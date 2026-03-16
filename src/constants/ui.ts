export const MAIN_PAGE = {
  SEARCH_PLACEHOLDER: '레시피 검색...',
  EMPTY_TITLE: '아직 저장한 레시피가 없어요',
  EMPTY_DESCRIPTION: '이미지나 URL을 추가하면 구리가 레시피를 정리해 드려요.',
  ADD_RECIPE: '레시피 추가',
} as const;

export const NAV = {
  BACK_TO_LIST: '목록으로',
} as const;

export const ADD_RECIPE_PAGE = {
  URL_SECTION_TITLE: 'URL로 레시피 가져오기',
  URL_PLACEHOLDER: '레시피 URL을 붙여넣으세요',
  URL_ANALYZE_BUTTON: 'AI 분석',
  URL_ANALYZING: '분석 중...',
  AI_DISCLAIMER:
    '구리가 분석할 때 가끔 실수할 수 있어요. 저장하기 전에 재료와 조리법을 꼭 확인해 주세요.',
  INFO_SECTION_TITLE: '기본 정보',
  INGREDIENTS_SECTION_TITLE: '재료',
  STEPS_SECTION_TITLE: '조리 단계',
  NUTRITION_SECTION_TITLE: '영양 정보 (1인분)',
  ADD_INGREDIENT: '재료 추가',
  ADD_STEP: '단계 추가',
  SAVE_BUTTON: '레시피 저장',
  TITLE_PLACEHOLDER: '레시피 이름을 입력하세요',
  DESCRIPTION_PLACEHOLDER: '간단한 설명을 입력하세요',
  /** 분석 탭 라벨 */
  TAB_URL_LABEL: '레시피 주소',
  TAB_IMAGE_LABEL: '레시피 이미지',
  /** 튜토리얼 */
  TUTORIAL_ARIA_LABEL: '사용 방법 보기',
  TUTORIAL_TITLE: '사용 방법',
  TUTORIAL_STEP_1:
    '레시피 주소 — 레시피 블로그나 사이트의 URL을 붙여넣고 분석 버튼을 누르면 구리가 레시피를 자동으로 추출해요.',
  TUTORIAL_STEP_2:
    '레시피 이미지 — 레시피가 담긴 사진이나 스크린샷을 올리면 구리가 이미지를 읽고 레시피를 정리해요. 한 장만 업로드할 수 있어요.',
  TUTORIAL_STEP_3:
    '분석 결과는 아래에 자동으로 입력되며, 내용을 직접 수정한 뒤 저장할 수 있어요.',
  /** 구분선 라벨 */
  SECTION_LABEL_RECIPE_INFO: '레시피 정보',
  /** 에러 메시지 */
  ERROR_ANALYZE_URL:
    '레시피 분석 중 오류가 발생했습니다. 다시 시도해주세요.',
  ERROR_ANALYZE_IMAGE:
    '이미지 분석 중 오류가 발생했습니다. 다시 시도해주세요.',
  ERROR_SAVE: '레시피 저장 중 오류가 발생했습니다. 다시 시도해주세요.',
  /** 오버레이 최소 표시 시간 (ms) */
  OVERLAY_MIN_DELAY_MS: 2000,
  /** 폼 섹션 스태거 애니메이션 딜레이 */
  FORM_STAGGER_DELAYS: ['0.06s', '0.12s', '0.18s', '0.24s', '0.3s'] as const,
} as const;

export const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: '쉬움' },
  { value: 'medium', label: '보통' },
  { value: 'hard', label: '어려움' },
] as const;

export const RECIPE_DETAIL_PAGE = {
  EDIT_BUTTON: '수정',
  INGREDIENTS_TITLE: '재료',
  STEPS_TITLE: '조리 방법',
  NUTRITION_TITLE: '영양 정보 (1인분)',
  COOK_TIME: '조리 시간',
  MINUTES: '분',
  SERVINGS: '인분',
  DIFFICULTY: '난이도',
  SOURCE_URL: '출처',
} as const;

export const RECIPE_EDIT_PAGE = {
  TITLE: '레시피 수정',
  SAVE_BUTTON: '수정 완료',
} as const;
