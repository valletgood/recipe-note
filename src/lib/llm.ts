import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

// 사내 vLLM (OpenAI 호환) 엔드포인트
const provider = createOpenAICompatible({
  name: "cudo-llm",
  apiKey: process.env.LLM_API_KEY!,
  baseURL: process.env.LLM_BASE_URL!,
  // vLLM은 response_format: json_schema(guided decoding)를 지원한다.
  // 켜지 않으면 스키마가 요청에 실려나가지 않아 Output.object 파싱이 실패한다.
  supportsStructuredOutputs: true,
});

export const LLM_MODEL = process.env.LLM_MODEL ?? "glm-5.2";

export const llm = provider.chatModel(LLM_MODEL);
