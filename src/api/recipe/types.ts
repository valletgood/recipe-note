import type {
  Ingredient,
  CookingStep,
  NutritionInfo,
  RecipeSourceType,
} from "@/types/recipe";
import type { RecipeCategoryValue } from "@/constants/recipe-categories";

export interface AnalyzeRecipeRequest {
  url: string;
}

export interface AnalyzeRecipeResponse {
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

export interface CreateRecipeRequest {
  title: string;
  description?: string;
  category: RecipeCategoryValue;
  difficulty: "easy" | "medium" | "hard";
  cookTimeMinutes: number;
  servingCount: number;
  ingredients: Ingredient[];
  cookingSteps: CookingStep[];
  nutrition?: NutritionInfo;
  sourceType?: RecipeSourceType;
  sourceUrl?: string;
}

export interface CreateRecipeResponse {
  id: string;
}
