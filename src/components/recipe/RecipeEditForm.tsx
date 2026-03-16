'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import BasicInfoSection from '@/components/recipe/form/BasicInfoSection';
import IngredientsSection from '@/components/recipe/form/IngredientsSection';
import CookingStepsSection from '@/components/recipe/form/CookingStepsSection';
import NutritionSection from '@/components/recipe/form/NutritionSection';
import Button from '@/components/ui/Button';
import PageNav from '@/components/layout/PageNav';
import { ADD_RECIPE_PAGE, NAV, RECIPE_EDIT_PAGE } from '@/constants/ui';
import { useUpdateRecipe } from '@/api/recipe/hooks';
import type { BasicInfoData } from '@/components/recipe/form/BasicInfoSection';
import type { NutritionData } from '@/components/recipe/form/NutritionSection';
import type { Ingredient, CookingStep, Recipe } from '@/types/recipe';
import type { RecipeCategoryValue } from '@/constants/recipe-categories';

interface RecipeEditFormProps {
  recipe: Recipe;
}

export default function RecipeEditForm({ recipe }: RecipeEditFormProps) {
  const router = useRouter();
  const updateMutation = useUpdateRecipe();

  const [basicInfo, setBasicInfo] = useState<BasicInfoData>({
    title: recipe.title,
    description: recipe.description ?? '',
    category: recipe.category ?? '',
    difficulty: recipe.difficulty ?? '',
    cookTimeMinutes: String(recipe.cookTimeMinutes ?? ''),
    servingCount: String(recipe.servingCount ?? ''),
  });

  const [ingredients, setIngredients] = useState<Ingredient[]>(
    recipe.ingredients?.length
      ? recipe.ingredients
      : [{ name: '', amount: '', unit: '' }],
  );

  const [cookingSteps, setCookingSteps] = useState<CookingStep[]>(
    recipe.cookingSteps?.length
      ? recipe.cookingSteps
      : [{ order: 1, description: '', tip: '' }],
  );

  const [nutrition, setNutrition] = useState<NutritionData>({
    calories: recipe.nutritionInfo?.calories
      ? String(recipe.nutritionInfo.calories)
      : '',
    carbohydrates: recipe.nutritionInfo?.carbohydrates
      ? String(recipe.nutritionInfo.carbohydrates)
      : '',
    protein: recipe.nutritionInfo?.protein
      ? String(recipe.nutritionInfo.protein)
      : '',
    fat: recipe.nutritionInfo?.fat ? String(recipe.nutritionInfo.fat) : '',
  });

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

    updateMutation.mutate(
      {
        id: recipe.id,
        data: {
          title: basicInfo.title,
          description: basicInfo.description || undefined,
          category: basicInfo.category as RecipeCategoryValue,
          difficulty: basicInfo.difficulty as 'easy' | 'medium' | 'hard',
          cookTimeMinutes: Number(basicInfo.cookTimeMinutes),
          servingCount: Number(basicInfo.servingCount),
          ingredients,
          cookingSteps,
          nutrition: nutritionData,
          sourceType: recipe.sourceType,
          sourceUrl: recipe.sourceUrl,
        },
      },
      {
        onSuccess: (result) => {
          if (result.error !== 0) return;
          router.push(`/recipes/${recipe.id}`);
        },
      },
    );
  }, [
    basicInfo,
    ingredients,
    cookingSteps,
    nutrition,
    recipe.id,
    recipe.sourceType,
    recipe.sourceUrl,
    updateMutation,
    router,
  ]);

  return (
    <>
      <PageNav
        backHref={`/recipes/${recipe.id}`}
        backLabel={NAV.BACK_TO_LIST}
      />

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="space-y-6">
          <div className="animate-[staggerFade_0.4s_ease-out_both]">
            <BasicInfoSection data={basicInfo} onChange={setBasicInfo} />
          </div>

          <div
            className="animate-[staggerFade_0.4s_ease-out_both]"
            style={{ animationDelay: '0.06s' }}
          >
            <IngredientsSection
              ingredients={ingredients}
              onChange={setIngredients}
            />
          </div>

          <div
            className="animate-[staggerFade_0.4s_ease-out_both]"
            style={{ animationDelay: '0.12s' }}
          >
            <CookingStepsSection
              steps={cookingSteps}
              onChange={setCookingSteps}
            />
          </div>

          <div
            className="animate-[staggerFade_0.4s_ease-out_both]"
            style={{ animationDelay: '0.18s' }}
          >
            <NutritionSection data={nutrition} onChange={setNutrition} />
          </div>

          <div
            className="animate-[staggerFade_0.4s_ease-out_both] pb-8"
            style={{ animationDelay: '0.24s' }}
          >
            {updateMutation.data && updateMutation.data.error !== 0 && (
              <p className="mb-3 text-center text-sm text-red-500">
                {updateMutation.data.message}
              </p>
            )}
            {updateMutation.isError && (
              <p className="mb-3 text-center text-sm text-red-500">
                수정 중 오류가 발생했습니다. 다시 시도해주세요.
              </p>
            )}
            <Button
              type="button"
              size="lg"
              className="w-full"
              onClick={handleSave}
              isLoading={updateMutation.isPending}
              disabled={updateMutation.isPending || !basicInfo.title.trim()}
            >
              {RECIPE_EDIT_PAGE.SAVE_BUTTON}
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
