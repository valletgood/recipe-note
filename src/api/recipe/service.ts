import { api, type ApiResponse } from "@/lib/axios";
import type {
  AnalyzeRecipeRequest,
  AnalyzeRecipeResponse,
  CreateRecipeRequest,
  CreateRecipeResponse,
} from "./types";

export async function analyzeRecipe(data: AnalyzeRecipeRequest) {
  const response = await api.post<ApiResponse<AnalyzeRecipeResponse>>(
    "/api/recipes/analyze",
    data
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
