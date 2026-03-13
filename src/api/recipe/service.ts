import { api, type ApiResponse } from "@/lib/axios";
import type { AnalyzeRecipeRequest, AnalyzeRecipeResponse } from "./types";

export async function analyzeRecipe(data: AnalyzeRecipeRequest) {
  const response = await api.post<ApiResponse<AnalyzeRecipeResponse>>(
    "/api/recipes/analyze",
    data
  );
  return response.data;
}
