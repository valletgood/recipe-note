import type { Ingredient, CookingStep } from "@/types/recipe";
import type { RecipeCategoryValue } from "@/constants/recipe-categories";

interface AnalyzeRecipeResponse {
  title: string;
  description: string;
  category: RecipeCategoryValue;
  difficulty: "easy" | "medium" | "hard";
  cookTimeMinutes: number;
  servingCount: number;
  ingredients: Ingredient[];
  cookingSteps: CookingStep[];
  nutrition: {
    calories: number;
    carbohydrates: number;
    protein: number;
    fat: number;
  };
}

interface ApiResult<T> {
  error: number;
  message: string;
  data?: T;
}

export async function analyzeRecipeFromUrl(
  url: string
): Promise<ApiResult<AnalyzeRecipeResponse>> {
  const response = await fetch("/api/recipes/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  const result: ApiResult<AnalyzeRecipeResponse> = await response.json();
  return result;
}

export type { AnalyzeRecipeResponse };
