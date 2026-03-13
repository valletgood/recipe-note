export const MAIN_PAGE = {
  TITLE: "내 레시피",
  SEARCH_PLACEHOLDER: "레시피 검색...",
  EMPTY_TITLE: "아직 저장한 레시피가 없어요",
  EMPTY_DESCRIPTION: "이미지나 URL을 추가하면 AI가 레시피를 정리해 드려요.",
  ADD_RECIPE: "레시피 추가",
} as const;

export const NAV = {
  BACK_TO_LIST: "목록으로",
} as const;

export const ADD_RECIPE_PAGE = {
  TITLE: "레시피 추가",
  URL_SECTION_TITLE: "URL로 레시피 가져오기",
  URL_PLACEHOLDER: "레시피 URL을 붙여넣으세요",
  URL_ANALYZE_BUTTON: "AI 분석",
  URL_ANALYZING: "분석 중...",
  INFO_SECTION_TITLE: "기본 정보",
  INGREDIENTS_SECTION_TITLE: "재료",
  STEPS_SECTION_TITLE: "조리 단계",
  NUTRITION_SECTION_TITLE: "영양 정보 (1인분)",
  ADD_INGREDIENT: "재료 추가",
  ADD_STEP: "단계 추가",
  SAVE_BUTTON: "레시피 저장",
  TITLE_PLACEHOLDER: "레시피 이름을 입력하세요",
  DESCRIPTION_PLACEHOLDER: "간단한 설명을 입력하세요",
} as const;

export const DIFFICULTY_OPTIONS = [
  { value: "easy", label: "쉬움" },
  { value: "medium", label: "보통" },
  { value: "hard", label: "어려움" },
] as const;
