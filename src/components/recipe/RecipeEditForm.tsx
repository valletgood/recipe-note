'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import BasicInfoSection from '@/components/recipe/form/BasicInfoSection';
import IngredientsSection from '@/components/recipe/form/IngredientsSection';
import CookingStepsSection from '@/components/recipe/form/CookingStepsSection';
import NutritionSection from '@/components/recipe/form/NutritionSection';
import Button from '@/components/ui/Button';
import PageNav from '@/components/layout/PageNav';
import { NAV, RECIPE_EDIT_PAGE } from '@/constants/ui';
import { useUpdateRecipe } from '@/api/recipe/hooks';
import type { BasicInfoData } from '@/components/recipe/form/BasicInfoSection';
import type { NutritionData } from '@/components/recipe/form/NutritionSection';
import type { Ingredient, CookingStep, Recipe } from '@/types/recipe';
import type { RecipeCategoryValue } from '@/constants/recipe-categories';
import { AuthGuard } from '../auth/AuthGuard';

const STAGGER_ANIMATION_BASE = 'animate-[staggerFade_0.4s_ease-out_both]';
const STAGGER_DELAY_CLASSES = [
  '',
  'animation-delay-[0.06s]',
  'animation-delay-[0.12s]',
  'animation-delay-[0.18s]',
  'animation-delay-[0.24s]',
] as const;

function getInitialBasicInfo(recipe: Recipe): BasicInfoData {
  return {
    title: recipe.title,
    description: recipe.description ?? '',
    category: recipe.category ?? '',
    difficulty: recipe.difficulty ?? '',
    cookTimeMinutes: String(recipe.cookTimeMinutes ?? ''),
    servingCount: String(recipe.servingCount ?? ''),
  };
}

function getInitialIngredients(recipe: Recipe): Ingredient[] {
  return recipe.ingredients?.length
    ? recipe.ingredients
    : [{ name: '', amount: '', unit: '' }];
}

function getInitialCookingSteps(recipe: Recipe): CookingStep[] {
  return recipe.cookingSteps?.length
    ? recipe.cookingSteps
    : [{ order: 1, description: '', tip: '' }];
}

function getInitialNutrition(recipe: Recipe): NutritionData {
  const info = recipe.nutritionInfo;
  return {
    calories: info?.calories != null ? String(info.calories) : '',
    carbohydrates:
      info?.carbohydrates != null ? String(info.carbohydrates) : '',
    protein: info?.protein != null ? String(info.protein) : '',
    fat: info?.fat != null ? String(info.fat) : '',
  };
}

interface RecipeEditFormProps {
  recipe: Recipe;
}

export default function RecipeEditForm({ recipe }: RecipeEditFormProps) {
  const router = useRouter();
  const updateMutation = useUpdateRecipe();

  const [basicInfo, setBasicInfo] = useState<BasicInfoData>(() =>
    getInitialBasicInfo(recipe),
  );
  const [ingredients, setIngredients] = useState<Ingredient[]>(() =>
    getInitialIngredients(recipe),
  );
  const [cookingSteps, setCookingSteps] = useState<CookingStep[]>(() =>
    getInitialCookingSteps(recipe),
  );
  const [nutrition, setNutrition] = useState<NutritionData>(() =>
    getInitialNutrition(recipe),
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
          router.push(`/recipes/${recipe.id}/complete?from=edit`);
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

  const isSaveDisabled = updateMutation.isPending || !basicInfo.title.trim();
  const saveButtonCommon = {
    onClick: handleSave,
    isLoading: updateMutation.isPending,
    disabled: isSaveDisabled,
  };

  const errorMessage = updateMutation.isError
    ? RECIPE_EDIT_PAGE.EDIT_ERROR_MESSAGE
    : updateMutation.data && updateMutation.data.error !== 0
      ? updateMutation.data.message
      : null;

  return (
    <AuthGuard>
      <PageNav
        backHref="/"
        backLabel={NAV.BACK_TO_LIST}
        button={
          <Button
            variant="ghost"
            size="sm"
            className="underline"
            {...saveButtonCommon}
          >
            {RECIPE_EDIT_PAGE.EDIT_BUTTON}
          </Button>
        }
      />

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="space-y-6">
          <div className={STAGGER_ANIMATION_BASE}>
            <BasicInfoSection data={basicInfo} onChange={setBasicInfo} />
          </div>

          <div
            className={`${STAGGER_ANIMATION_BASE} ${STAGGER_DELAY_CLASSES[1]}`}
          >
            <IngredientsSection
              ingredients={ingredients}
              onChange={setIngredients}
            />
          </div>

          <div
            className={`${STAGGER_ANIMATION_BASE} ${STAGGER_DELAY_CLASSES[2]}`}
          >
            <CookingStepsSection
              steps={cookingSteps}
              onChange={setCookingSteps}
            />
          </div>

          <div
            className={`${STAGGER_ANIMATION_BASE} ${STAGGER_DELAY_CLASSES[3]}`}
          >
            <NutritionSection data={nutrition} onChange={setNutrition} />
          </div>

          <div
            className={`${STAGGER_ANIMATION_BASE} ${STAGGER_DELAY_CLASSES[4]} pb-8`}
          >
            {errorMessage && (
              <p className="mb-3 text-center text-sm text-red-500">
                {errorMessage}
              </p>
            )}
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              {...saveButtonCommon}
            >
              {RECIPE_EDIT_PAGE.EDIT_BUTTON}
            </Button>
          </div>
        </div>
      </main>
    </AuthGuard>
  );
}
