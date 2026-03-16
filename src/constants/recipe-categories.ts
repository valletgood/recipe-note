/**
 * 레시피 음식 카테고리 (메인 화면 아코디언, 레시피 추가 시 사용)
 * value: DB/API용 식별자, label: 화면 표시용
 */
export const RECIPE_CATEGORIES = [
  { value: "soup_stew", label: "국 / 찌개" },
  { value: "stir_fry", label: "볶음" },
  { value: "grill", label: "구이" },
  { value: "braise", label: "조림" },
  { value: "steam", label: "찜" },
  { value: "jeon", label: "전 / 부침" },
  { value: "bibim", label: "비빔" },
  { value: "muchim", label: "무침" },
  { value: "noodle", label: "면" },
  { value: "rice", label: "밥" },
  { value: "dessert", label: "디저트" },
] as const;

export type RecipeCategoryValue =
  (typeof RECIPE_CATEGORIES)[number]["value"];

export type RecipeCategory = (typeof RECIPE_CATEGORIES)[number];

/** value로 label 찾기 */
export function getCategoryLabel(value: RecipeCategoryValue): string {
  const found = RECIPE_CATEGORIES.find((c) => c.value === value);
  return found?.label ?? value;
}
