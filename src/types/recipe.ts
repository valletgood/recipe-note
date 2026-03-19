import type { RecipeCategoryValue } from "@/constants/recipe-categories";

/** 재료 */
export interface Ingredient {
  name: string;
  amount?: string;
  unit?: string;
}

/** 조리 단계 */
export interface CookingStep {
  order: number;
  description: string;
  tip?: string;
}

/** 영양 정보 (AI 추정, 1인분 기준) */
export interface NutritionInfo {
  calories: number;
  carbohydrates: number;
  protein: number;
  fat: number;
}

/** 외부 콘텐츠 (유튜브, 인스타그램 등) */
export interface ExternalContent {
  platform: "youtube" | "instagram";
  url: string;
  title?: string;
  thumbnailUrl?: string;
}

/** 레시피 원본 소스 타입 */
export type RecipeSourceType = "url" | "image" | "manual";

/** 레시피 */
export interface Recipe {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string | null;
  images?: string[] | null;
  /** 음식 카테고리 (국/찌개, 볶음, 구이 등) */
  category?: RecipeCategoryValue;
  /** 필요한 재료 목록 */
  ingredients?: Ingredient[];
  /** 조리 단계 */
  cookingSteps?: CookingStep[];
  /** AI 추정 영양 정보 (1인분 기준) */
  nutritionInfo?: NutritionInfo;
  /** 관련 외부 콘텐츠 (유튜브, 인스타그램) */
  externalContents?: ExternalContent[];
  /** 원본 소스 타입 (URL / 이미지 / 직접 입력) */
  sourceType?: RecipeSourceType;
  /** 원본 URL (sourceType이 url인 경우) */
  sourceUrl?: string;
  servingCount?: number;
  cookTimeMinutes?: number;
  difficulty?: "easy" | "medium" | "hard";
  createdAt: string;
}
