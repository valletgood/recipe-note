import { generateText, Output } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { successResponse, errorResponse, ErrorCode } from "@/lib/api-response";
import { RECIPE_CATEGORIES } from "@/constants/recipe-categories";

const categoryValues = RECIPE_CATEGORIES.map((c) => c.value);

const recipeSchema = z.object({
  title: z.string().describe("레시피 이름"),
  description: z.string().describe("레시피에 대한 한 줄 요약 설명"),
  category: z
    .enum(categoryValues as [string, ...string[]])
    .describe(
      "음식 카테고리. soup_stew(국/찌개), stir_fry(볶음), grill(구이), braise(조림), steam(찜), jeon(전/부침), bibim(비빔), muchim(무침), noodle(면), rice(밥), dessert(디저트) 중 하나"
    ),
  difficulty: z
    .enum(["easy", "medium", "hard"])
    .describe("난이도. easy(쉬움), medium(보통), hard(어려움)"),
  cookTimeMinutes: z.number().describe("예상 조리 시간(분)"),
  servingCount: z.number().describe("인분 수"),
  ingredients: z
    .array(
      z.object({
        name: z.string().describe("재료 이름"),
        amount: z.string().describe("분량 (예: 200, 1/2, 약간)"),
        unit: z.string().describe("단위 (예: g, 개, 큰술, 약간)"),
      })
    )
    .describe("재료 목록"),
  cookingSteps: z
    .array(
      z.object({
        order: z.number().describe("단계 순서 (1부터 시작)"),
        description: z.string().describe("조리 방법 설명"),
        tip: z.string().describe("해당 단계의 팁 (없으면 빈 문자열)"),
      })
    )
    .describe("조리 단계 목록"),
  nutrition: z
    .object({
      calories: z.number().describe("예상 칼로리 (kcal, 1인분 기준)"),
      carbohydrates: z.number().describe("탄수화물 (g, 1인분 기준)"),
      protein: z.number().describe("단백질 (g, 1인분 기준)"),
      fat: z.number().describe("지방 (g, 1인분 기준)"),
    })
    .describe("1인분 기준 예상 영양 정보"),
});

const BOT_USER_AGENT = "RecipeNote/1.0 (+https://recipe-note.app; recipe-crawler)";

const FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "ko-KR,ko;q=0.9,en;q=0.5",
};

const REQUEST_DELAY_MS = 1000;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function isPathAllowedByRobots(url: string): Promise<boolean> {
  try {
    const parsed = new URL(url);
    const robotsUrl = `${parsed.origin}/robots.txt`;
    const response = await fetch(robotsUrl, {
      headers: { "User-Agent": BOT_USER_AGENT },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) return true;

    const robotsTxt = await response.text();
    const path = parsed.pathname + parsed.search;

    let inUserAgentBlock = false;
    for (const line of robotsTxt.split("\n")) {
      const trimmed = line.trim().toLowerCase();
      if (trimmed.startsWith("user-agent:")) {
        const agent = trimmed.slice("user-agent:".length).trim();
        inUserAgentBlock = agent === "*" || agent === "recipenote";
      } else if (inUserAgentBlock && trimmed.startsWith("disallow:")) {
        const disallowed = trimmed.slice("disallow:".length).trim();
        if (disallowed && path.startsWith(disallowed)) {
          return false;
        }
      }
    }
    return true;
  } catch {
    return true;
  }
}

async function fetchPageContent(url: string): Promise<string> {
  const fetchUrl = toScrapableUrl(url);

  const allowed = await isPathAllowedByRobots(fetchUrl);
  if (!allowed) {
    throw new Error("robots.txt에 의해 크롤링이 차단된 페이지입니다.");
  }

  await delay(REQUEST_DELAY_MS);

  const html = await fetchHtml(fetchUrl);
  let text = stripHtmlTags(html);

  if (text.length < 50) {
    const iframeSrc = extractNaverIframeSrc(html, fetchUrl);
    if (iframeSrc) {
      await delay(REQUEST_DELAY_MS);
      const iframeHtml = await fetchHtml(iframeSrc);
      text = stripHtmlTags(iframeHtml);
    }
  }

  return text;
}

function toScrapableUrl(url: string): string {
  const parsed = new URL(url);

  if (
    parsed.hostname === "blog.naver.com" ||
    parsed.hostname === "m.blog.naver.com"
  ) {
    parsed.hostname = "m.blog.naver.com";
    return parsed.toString();
  }

  if (parsed.hostname === "post.naver.com") {
    parsed.hostname = "m.post.naver.com";
    return parsed.toString();
  }

  return url;
}

function extractNaverIframeSrc(html: string, baseUrl: string): string | null {
  const match = html.match(
    /<iframe[^>]+id=["']mainFrame["'][^>]+src=["']([^"']+)["']/i
  );
  if (!match?.[1]) return null;

  try {
    return new URL(match[1], baseUrl).toString();
  } catch {
    return null;
  }
}

async function fetchHtml(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: FETCH_HEADERS,
    signal: AbortSignal.timeout(15000),
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`페이지를 가져올 수 없습니다. (${response.status})`);
  }

  return response.text();
}

function stripHtmlTags(html: string): string {
  let text = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[\s\S]*?<\/nav>/gi, "")
    .replace(/<footer[\s\S]*?<\/footer>/gi, "")
    .replace(/<header[\s\S]*?<\/header>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();

  const MAX_LENGTH = 15000;
  if (text.length > MAX_LENGTH) {
    text = text.slice(0, MAX_LENGTH);
  }

  return text;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return errorResponse(ErrorCode.BAD_REQUEST, "URL이 필요합니다.");
    }

    let pageContent: string;
    try {
      pageContent = await fetchPageContent(url);
    } catch (fetchErr) {
      const fetchMessage =
        fetchErr instanceof Error ? fetchErr.message : "";
      if (fetchMessage.includes("robots.txt")) {
        return errorResponse(ErrorCode.FORBIDDEN, fetchMessage);
      }
      return errorResponse(
        ErrorCode.BAD_REQUEST,
        "해당 URL의 페이지를 가져올 수 없습니다. URL을 확인해주세요."
      );
    }

    if (pageContent.length < 50) {
      return errorResponse(
        ErrorCode.BAD_REQUEST,
        "페이지에서 충분한 내용을 추출할 수 없습니다."
      );
    }

    const result = await generateText({
      model: google("gemini-2.5-flash"),
      output: Output.object({ schema: recipeSchema }),
      prompt: `당신은 요리 레시피 분석 전문가입니다.

아래는 웹페이지에서 추출한 텍스트입니다. 이 텍스트에서 요리 레시피 정보를 분석하여 구조화된 데이터로 추출해주세요.

## 분석 지침

- 재료의 분량과 단위를 정확하게 분리해주세요 (예: "마늘 3쪽" → name: "마늘", amount: "3", unit: "쪽")
- 단위가 명확하지 않거나 분량과 동일한 표현인 경우(예: "약간/약간", "조금/조금") unit은 빈 문자열로 두고 amount에만 표기하세요 (예: name: "후추", amount: "약간", unit: "")
- 조리 단계는 원문의 순서를 따르되, 자연스럽게 다시 정리해주세요
- 유용한 조리 팁이 있으면 tip 필드에 넣어주세요 (없으면 빈 문자열)
- 영양 정보는 재료와 분량을 기반으로 1인분 기준으로 추정해주세요
- 카테고리는 반드시 다음 중 하나를 선택하세요: soup_stew(국/찌개), stir_fry(볶음), grill(구이), braise(조림), steam(찜), jeon(전/부침), bibim(비빔), muchim(무침), noodle(면), rice(밥), dessert(디저트)
- 모든 필드를 빠짐없이 채워주세요

## 저작권 주의

- 원문을 그대로 복사하지 마세요. 조리 단계와 설명은 내용을 기반으로 자체적으로 재구성해주세요.
- 블로그 저자의 개인적인 이야기, 광고 문구 등은 제외하고 레시피 정보만 추출하세요.

## 웹페이지 텍스트

${pageContent}`,
    });

    return successResponse("레시피 분석이 완료되었습니다.", result.output);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
    return errorResponse(ErrorCode.INTERNAL_SERVER_ERROR, message);
  }
}
