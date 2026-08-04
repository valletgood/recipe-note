import { api, type ApiResponse } from "@/lib/axios";
import { compressImageFiles } from "@/utils/compressImage";
import type {
  AnalyzeRecipeRequest,
  AnalyzeRecipeResponse,
  CreateRecipeRequest,
  CreateRecipeResponse,
} from "./types";

export async function uploadRecipeImages(files: File[]): Promise<string[]> {
  const formData = new FormData();
  for (const file of files) {
    formData.append('images', file);
  }
  const response = await api.post<ApiResponse<{ urls: string[] }>>(
    '/api/recipes/upload-images',
    formData,
    { headers: { 'Content-Type': undefined } },
  );
  return response.data.data?.urls ?? [];
}

/** LLM 분석은 수 분까지 걸릴 수 있어 공통 30초 타임아웃을 해제한다 */
const NO_TIMEOUT = 0;

export async function analyzeRecipe(data: AnalyzeRecipeRequest) {
  const response = await api.post<ApiResponse<AnalyzeRecipeResponse>>(
    "/api/recipes/analyze",
    data,
    { timeout: NO_TIMEOUT }
  );
  return response.data;
}

/** 서버리스 페이로드 한도(예: Vercel 4.5MB) 내로 이미지 압축 후 전송 */
const IMAGE_PAYLOAD_MAX_BYTES = 4 * 1024 * 1024;

export async function analyzeRecipeFromImage(files: File[]) {
  const compressed = await compressImageFiles(files, {
    maxTotalBytes: IMAGE_PAYLOAD_MAX_BYTES,
  });
  const formData = new FormData();
  for (const file of compressed) {
    formData.append("images", file);
  }
  const response = await api.post<ApiResponse<AnalyzeRecipeResponse>>(
    "/api/recipes/analyze-image",
    formData,
    { headers: { "Content-Type": undefined }, timeout: NO_TIMEOUT }
  );
  return response.data;
}

export async function createRecipe(data: CreateRecipeRequest) {
  const response = await api.post<ApiResponse<CreateRecipeResponse>>(
    "/api/recipes",
    data
  );
  return response.data;
}

export async function updateRecipe(id: string, data: CreateRecipeRequest) {
  const response = await api.put<ApiResponse<CreateRecipeResponse>>(
    `/api/recipes/${id}`,
    data
  );
  return response.data;
}

export async function deleteRecipe(id: string) {
  const response = await api.delete<ApiResponse<CreateRecipeResponse>>(
    `/api/recipes/${id}`
  );
  return response.data;
}
