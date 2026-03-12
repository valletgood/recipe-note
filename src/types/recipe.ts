import type { RecipeCategoryValue } from "@/constants/recipe-categories";

export interface Ingredient {
  name: string;
  amount?: string;
  unit?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string | null;
  /** 음식 카테고리 (국/찌개, 볶음, 구이 등) */
  category?: RecipeCategoryValue;
  /** 필요한 재료 목록 */
  ingredients?: Ingredient[];
  servingCount?: number;
  cookTimeMinutes?: number;
  difficulty?: "easy" | "medium" | "hard";
  createdAt: string;
}
