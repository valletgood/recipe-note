'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import UrlAnalyzeSection from '@/components/recipe/form/UrlAnalyzeSection';
import BasicInfoSection from '@/components/recipe/form/BasicInfoSection';
import IngredientsSection from '@/components/recipe/form/IngredientsSection';
import CookingStepsSection from '@/components/recipe/form/CookingStepsSection';
import NutritionSection from '@/components/recipe/form/NutritionSection';
import Button from '@/components/ui/Button';
import PageNav from '@/components/layout/PageNav';
import { ADD_RECIPE_PAGE, NAV } from '@/constants/ui';
import { useAnalyzeRecipe, useCreateRecipe } from '@/api/recipe/hooks';
import type { BasicInfoData } from '@/components/recipe/form/BasicInfoSection';
import type { NutritionData } from '@/components/recipe/form/NutritionSection';
import type { Ingredient, CookingStep } from '@/types/recipe';
import type { RecipeCategoryValue } from '@/constants/recipe-categories';

export default function NewRecipePage() {
  const router = useRouter();
  const analyzeMutation = useAnalyzeRecipe();
  const createMutation = useCreateRecipe();

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

  const handleAnalyze = useCallback(
    (url: string) => {
      setSourceUrl(url);
      analyzeMutation.mutate(
        { url },
        {
          onSuccess: (result) => {
            if (result.error !== 0 || !result.data) {
              return;
            }

            const data = result.data;

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
          },
        },
      );
    },
    [analyzeMutation],
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
          if (result.error !== 0) return;
          router.push('/');
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
      <PageNav backHref="/" backLabel={NAV.BACK_TO_LIST} />

      <main className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="space-y-6">
          {/* URL 분석 섹션 */}
          <div className="animate-[staggerFade_0.4s_ease-out_both]">
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
