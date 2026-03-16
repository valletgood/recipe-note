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

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get("image");

    if (!image || !(image instanceof File)) {
      return errorResponse(ErrorCode.BAD_REQUEST, "이미지 파일이 필요합니다.");
    }

    if (!ALLOWED_MIME_TYPES.includes(image.type)) {
      return errorResponse(ErrorCode.BAD_REQUEST, "JPG, PNG, WebP, GIF 형식만 지원합니다.");
    }

    if (image.size > MAX_SIZE_BYTES) {
      return errorResponse(ErrorCode.BAD_REQUEST, "이미지 크기는 10MB 이하여야 합니다.");
    }

    const bytes = await image.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const imagePart = {
      type: "image" as const,
      image: base64,
      mimeType: image.type as
        | "image/jpeg"
        | "image/png"
        | "image/webp"
        | "image/gif",
    };

    const result = await generateText({
      model: google("gemini-2.5-flash"),
      output: Output.object({ schema: recipeSchema }),
      messages: [
        {
          role: "user",
          content: [
            // Gemini는 base64 + mimeType 필요. AI SDK 타입에는 mimeType 없어서 별도 변수로 전달
            imagePart as { type: "image"; image: string },
            {
              type: "text",
              text: `당신은 요리 레시피 분석 전문가입니다.
이 이미지에서 요리 레시피 정보를 분석하여 구조화된 데이터로 추출해주세요.

## 분석 지침

- 재료의 분량과 단위를 정확하게 분리해주세요 (예: "마늘 3쪽" → name: "마늘", amount: "3", unit: "쪽")
- 단위가 명확하지 않거나 분량과 동일한 표현인 경우(예: "약간/약간", "조금/조금") unit은 빈 문자열로 두고 amount에만 표기하세요 (예: name: "후추", amount: "약간", unit: "")
- 조리 단계는 이미지에 보이는 순서를 따르되, 자연스럽게 정리해주세요
- 유용한 조리 팁이 있으면 tip 필드에 넣어주세요 (없으면 빈 문자열)
- 영양 정보는 재료와 분량을 기반으로 1인분 기준으로 추정해주세요
- 카테고리는 반드시 다음 중 하나를 선택하세요: soup_stew(국/찌개), stir_fry(볶음), grill(구이), braise(조림), steam(찜), jeon(전/부침), bibim(비빔), muchim(무침), noodle(면), rice(밥), dessert(디저트)
- 모든 필드를 빠짐없이 채워주세요
- 이미지에서 레시피 정보가 명확하지 않은 경우, 요리 이름과 이미지에서 보이는 재료를 바탕으로 합리적으로 추정해주세요`,
            },
          ],
        },
      ],
    });

    return successResponse("레시피 분석이 완료되었습니다.", result.output);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
    return errorResponse(ErrorCode.INTERNAL_SERVER_ERROR, message);
  }
}
