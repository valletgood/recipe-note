'use client';

import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import UrlAnalyzeSection from '@/components/recipe/form/UrlAnalyzeSection';
import ImageAnalyzeSection from '@/components/recipe/form/ImageAnalyzeSection';
import BasicInfoSection from '@/components/recipe/form/BasicInfoSection';
import IngredientsSection from '@/components/recipe/form/IngredientsSection';
import CookingStepsSection from '@/components/recipe/form/CookingStepsSection';
import NutritionSection from '@/components/recipe/form/NutritionSection';
import Button from '@/components/ui/Button';
import PageNav from '@/components/layout/PageNav';
import AnalyzingOverlay from '@/components/ui/AnalyzingOverlay';
import { ADD_RECIPE_PAGE, NAV } from '@/constants/ui';
import {
  useAnalyzeRecipe,
  useAnalyzeRecipeFromImage,
  useCreateRecipe,
} from '@/api/recipe/hooks';
import type { BasicInfoData } from '@/components/recipe/form/BasicInfoSection';
import type { NutritionData } from '@/components/recipe/form/NutritionSection';
import type { Ingredient, CookingStep } from '@/types/recipe';
import type { RecipeCategoryValue } from '@/constants/recipe-categories';
import type { AnalyzeRecipeResponse } from '@/api/recipe/types';

export default function NewRecipePage() {
  const router = useRouter();
  const analyzeMutation = useAnalyzeRecipe();
  const analyzeImageMutation = useAnalyzeRecipeFromImage();
  const createMutation = useCreateRecipe();

  const [analyzeTab, setAnalyzeTab] = useState<'url' | 'image'>('url');
  const [showTutorial, setShowTutorial] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const overlayStartRef = useRef<number>(0);
  const [sourceUrl, setSourceUrl] = useState<string>('');

  const [basicInfo, setBasicInfo] = useState<BasicInfoData>({
    title: '',
    description: '',
    category: '',
    difficulty: '',
    cookTimeMinutes: '',
    servingCount: '',
  });

  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: '', amount: '', unit: '' },
  ]);

  const [cookingSteps, setCookingSteps] = useState<CookingStep[]>([
    { order: 1, description: '', tip: '' },
  ]);

  const [nutrition, setNutrition] = useState<NutritionData>({
    calories: '',
    carbohydrates: '',
    protein: '',
    fat: '',
  });

  const hideOverlayAfterMinDelay = useCallback(() => {
    const elapsed = Date.now() - overlayStartRef.current;
    const remaining = Math.max(0, 2000 - elapsed);
    setTimeout(() => setShowOverlay(false), remaining);
  }, []);

  const applyAnalysisResult = useCallback(
    (data: AnalyzeRecipeResponse) => {
      setBasicInfo({
        title: data.title,
        description: data.description,
        category: data.category,
        difficulty: data.difficulty,
        cookTimeMinutes: String(data.cookTimeMinutes),
        servingCount: String(data.servingCount),
      });
      setIngredients(data.ingredients);
      setCookingSteps(data.cookingSteps);
      setNutrition({
        calories: String(data.nutrition.calories),
        carbohydrates: String(data.nutrition.carbohydrates),
        protein: String(data.nutrition.protein),
        fat: String(data.nutrition.fat),
      });
      hideOverlayAfterMinDelay();
    },
    [hideOverlayAfterMinDelay],
  );

  const handleAnalyze = useCallback(
    (url: string) => {
      setSourceUrl(url);
      setShowOverlay(true);
      overlayStartRef.current = Date.now();
      analyzeMutation.mutate(
        { url },
        {
          onSuccess: (result) => {
            if (result.error !== 0 || !result.data) {
              hideOverlayAfterMinDelay();
              return;
            }
            applyAnalysisResult(result.data);
          },
          onError: () => hideOverlayAfterMinDelay(),
        },
      );
    },
    [analyzeMutation, applyAnalysisResult, hideOverlayAfterMinDelay],
  );

  const handleAnalyzeImage = useCallback(
    (file: File) => {
      setShowOverlay(true);
      overlayStartRef.current = Date.now();
      analyzeImageMutation.mutate(file, {
        onSuccess: (result) => {
          if (result.error !== 0 || !result.data) {
            hideOverlayAfterMinDelay();
            return;
          }
          applyAnalysisResult(result.data);
        },
        onError: () => hideOverlayAfterMinDelay(),
      });
    },
    [analyzeImageMutation, applyAnalysisResult, hideOverlayAfterMinDelay],
  );

  const handleSave = useCallback(() => {
    if (!basicInfo.title.trim()) return;

    const nutritionData = nutrition.calories
      ? {
          calories: Number(nutrition.calories),
          carbohydrates: Number(nutrition.carbohydrates),
          protein: Number(nutrition.protein),
          fat: Number(nutrition.fat),
        }
      : undefined;

    createMutation.mutate(
      {
        title: basicInfo.title,
        description: basicInfo.description || undefined,
        category: basicInfo.category as RecipeCategoryValue,
        difficulty: basicInfo.difficulty as 'easy' | 'medium' | 'hard',
        cookTimeMinutes: Number(basicInfo.cookTimeMinutes),
        servingCount: Number(basicInfo.servingCount),
        ingredients,
        cookingSteps,
        nutrition: nutritionData,
        sourceType: sourceUrl ? 'url' : 'manual',
        sourceUrl: sourceUrl || undefined,
      },
      {
        onSuccess: (result) => {
          if (result.error !== 0 || !result.data) return;
          router.push(`/recipes/${result.data.id}/complete`);
        },
      },
    );
  }, [
    basicInfo,
    ingredients,
    cookingSteps,
    nutrition,
    sourceUrl,
    createMutation,
    router,
  ]);

  return (
    <div className="relative z-10 min-h-screen">
      <AnalyzingOverlay visible={showOverlay} />
      <PageNav backHref="/" backLabel={NAV.BACK_TO_LIST} />

      <main className="mx-auto max-w-3xl px-4 pt-6 sm:px-6">
        <div className="space-y-6">
          {/* 분석 섹션 (탭) */}
          <div className="animate-[staggerFade_0.4s_ease-out_both]">
            {/* 탭 버튼 */}
            <div className="mb-3 flex items-center gap-2">
              {(['url', 'image'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setAnalyzeTab(tab)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    analyzeTab === tab
                      ? 'bg-[var(--point)] text-white'
                      : 'bg-[var(--point-bg)] text-[var(--point)] hover:bg-[var(--point-pale)]'
                  }`}
                >
                  {tab === 'url' ? '레시피 주소' : '레시피 이미지'}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setShowTutorial((v) => !v)}
                aria-label="사용 방법 보기"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--point-bg)] text-[var(--point)] transition-colors hover:bg-[var(--point-pale)]"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </button>
            </div>

            {/* 튜토리얼 패널 */}
            {showTutorial && (
              <div className="mb-3 rounded-2xl border border-[var(--glass-border)] bg-[var(--point-bg)] px-4 py-4 text-sm text-[var(--foreground)]">
                <p className="mb-2 font-semibold text-[var(--point)]">
                  사용 방법
                </p>
                <ul className="space-y-2 text-[var(--point-muted)]">
                  <li className="flex gap-2">
                    <span className="mt-0.5 shrink-0 text-[var(--point)]">
                      ①
                    </span>
                    <span>
                      <strong className="text-[var(--foreground)]">
                        레시피 주소
                      </strong>{' '}
                      — 레시피 블로그나 사이트의 URL을 붙여넣고 분석 버튼을
                      누르면 구리가 레시피를 자동으로 추출해요.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-0.5 shrink-0 text-[var(--point)]">
                      ②
                    </span>
                    <span>
                      <strong className="text-[var(--foreground)]">
                        레시피 이미지
                      </strong>{' '}
                      — 레시피가 담긴 사진이나 스크린샷을 올리면 구리가 이미지를
                      읽고 레시피를 정리해요. 한 장만 업로드할 수 있어요.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-0.5 shrink-0 text-[var(--point)]">
                      ③
                    </span>
                    <span>
                      분석 결과는 아래에 자동으로 입력되며, 내용을 직접 수정한
                      뒤 저장할 수 있어요.
                    </span>
                  </li>
                </ul>
              </div>
            )}

            {analyzeTab === 'url' ? (
              <UrlAnalyzeSection
                onAnalyze={handleAnalyze}
                isAnalyzing={analyzeMutation.isPending}
                errorMessage={
                  analyzeMutation.isError
                    ? '레시피 분석 중 오류가 발생했습니다. 다시 시도해주세요.'
                    : analyzeMutation.data && analyzeMutation.data.error !== 0
                      ? analyzeMutation.data.message
                      : null
                }
              />
            ) : (
              <ImageAnalyzeSection
                onAnalyze={handleAnalyzeImage}
                isAnalyzing={analyzeImageMutation.isPending}
                errorMessage={
                  analyzeImageMutation.isError
                    ? '이미지 분석 중 오류가 발생했습니다. 다시 시도해주세요.'
                    : analyzeImageMutation.data &&
                        analyzeImageMutation.data.error !== 0
                      ? analyzeImageMutation.data.message
                      : null
                }
              />
            )}
          </div>

          {/* 구분선 */}
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-[var(--glass-border)]" />
            <span className="text-sm font-medium text-[var(--point-muted)]">
              레시피 정보
            </span>
            <div className="h-px flex-1 bg-[var(--glass-border)]" />
          </div>

          {/* 기본 정보 */}
          <div
            className="animate-[staggerFade_0.4s_ease-out_both]"
            style={{ animationDelay: '0.06s' }}
          >
            <BasicInfoSection data={basicInfo} onChange={setBasicInfo} />
          </div>

          {/* 재료 */}
          <div
            className="animate-[staggerFade_0.4s_ease-out_both]"
            style={{ animationDelay: '0.12s' }}
          >
            <IngredientsSection
              ingredients={ingredients}
              onChange={setIngredients}
            />
          </div>

          {/* 조리 단계 */}
          <div
            className="animate-[staggerFade_0.4s_ease-out_both]"
            style={{ animationDelay: '0.18s' }}
          >
            <CookingStepsSection
              steps={cookingSteps}
              onChange={setCookingSteps}
            />
          </div>

          {/* 영양 정보 */}
          <div
            className="animate-[staggerFade_0.4s_ease-out_both]"
            style={{ animationDelay: '0.24s' }}
          >
            <NutritionSection data={nutrition} onChange={setNutrition} />
          </div>

          {/* 저장 버튼 */}
          <div
            className="animate-[staggerFade_0.4s_ease-out_both] pb-8"
            style={{ animationDelay: '0.3s' }}
          >
            {createMutation.data && createMutation.data.error !== 0 && (
              <p className="mb-3 text-center text-sm text-red-500">
                {createMutation.data.message}
              </p>
            )}
            {createMutation.isError && (
              <p className="mb-3 text-center text-sm text-red-500">
                레시피 저장 중 오류가 발생했습니다. 다시 시도해주세요.
              </p>
            )}
            <Button
              type="button"
              size="lg"
              className="w-full"
              onClick={handleSave}
              isLoading={createMutation.isPending}
              disabled={createMutation.isPending || !basicInfo.title.trim()}
            >
              {ADD_RECIPE_PAGE.SAVE_BUTTON}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
