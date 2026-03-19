'use client';

import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  useAnalyzeRecipe,
  useAnalyzeRecipeFromImage,
  useCreateRecipe,
  useUploadRecipeImages,
} from '@/api/recipe/hooks';
import type { AnalyzeRecipeResponse } from '@/api/recipe/types';
import type { BasicInfoData } from '@/components/recipe/form/BasicInfoSection';
import type { NutritionData } from '@/components/recipe/form/NutritionSection';
import type { Ingredient, CookingStep } from '@/types/recipe';
import type { RecipeCategoryValue } from '@/constants/recipe-categories';
import { ADD_RECIPE_PAGE } from '@/constants/ui';

type AnalyzeMutationResult = {
  isError: boolean;
  data?: { error: number; message?: string; data?: AnalyzeRecipeResponse };
};

const INITIAL_BASIC_INFO: BasicInfoData = {
  title: '',
  description: '',
  category: '',
  difficulty: '',
  cookTimeMinutes: '',
  servingCount: '',
};

const INITIAL_INGREDIENTS: Ingredient[] = [{ name: '', amount: '', unit: '' }];

const INITIAL_COOKING_STEPS: CookingStep[] = [
  { order: 1, description: '', tip: '' },
];

const INITIAL_NUTRITION: NutritionData = {
  calories: '',
  carbohydrates: '',
  protein: '',
  fat: '',
};

function getAnalyzeErrorMessage(
  mutation: AnalyzeMutationResult,
  fallback: string,
): string | null {
  if (mutation.isError) return fallback;
  if (mutation.data && mutation.data.error !== 0) return mutation.data.message ?? null;
  return null;
}

export function useNewRecipeForm() {
  const router = useRouter();
  const analyzeMutation = useAnalyzeRecipe();
  const analyzeImageMutation = useAnalyzeRecipeFromImage();
  const createMutation = useCreateRecipe();
  const uploadImagesMutation = useUploadRecipeImages();

  const [analyzeTab, setAnalyzeTab] = useState<'url' | 'image'>('url');
  const [showTutorial, setShowTutorial] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const overlayStartRef = useRef<number>(0);
  const [sourceUrl, setSourceUrl] = useState<string>('');

  const [basicInfo, setBasicInfo] = useState<BasicInfoData>(INITIAL_BASIC_INFO);
  const [ingredients, setIngredients] = useState<Ingredient[]>(INITIAL_INGREDIENTS);
  const [cookingSteps, setCookingSteps] = useState<CookingStep[]>(INITIAL_COOKING_STEPS);
  const [nutrition, setNutrition] = useState<NutritionData>(INITIAL_NUTRITION);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);

  const hideOverlayAfterMinDelay = useCallback(() => {
    const elapsed = Date.now() - overlayStartRef.current;
    const remaining = Math.max(0, ADD_RECIPE_PAGE.OVERLAY_MIN_DELAY_MS - elapsed);
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

  const handleAnalyzeSuccess = useCallback(
    (result: { error: number; data?: AnalyzeRecipeResponse }) => {
      if (result.error !== 0 || !result.data) {
        hideOverlayAfterMinDelay();
        return;
      }
      applyAnalysisResult(result.data);
    },
    [applyAnalysisResult, hideOverlayAfterMinDelay],
  );

  const handleAnalyze = useCallback(
    (url: string) => {
      setSourceUrl(url);
      setShowOverlay(true);
      overlayStartRef.current = Date.now();
      analyzeMutation.mutate(
        { url },
        {
          onSuccess: handleAnalyzeSuccess,
          onError: hideOverlayAfterMinDelay,
        },
      );
    },
    [analyzeMutation, handleAnalyzeSuccess, hideOverlayAfterMinDelay],
  );

  const handleAnalyzeImage = useCallback(
    (files: File[]) => {
      setShowOverlay(true);
      overlayStartRef.current = Date.now();
      analyzeImageMutation.mutate(files, {
        onSuccess: handleAnalyzeSuccess,
        onError: hideOverlayAfterMinDelay,
      });
    },
    [analyzeImageMutation, handleAnalyzeSuccess, hideOverlayAfterMinDelay],
  );

  const handleSave = useCallback(async () => {
    if (!basicInfo.title.trim()) return;

    const nutritionData = nutrition.calories
      ? {
          calories: Number(nutrition.calories),
          carbohydrates: Number(nutrition.carbohydrates),
          protein: Number(nutrition.protein),
          fat: Number(nutrition.fat),
        }
      : undefined;

    // 1. 이미지가 있으면 먼저 업로드
    let uploadedUrls: string[] = [];
    if (newImageFiles.length) {
      uploadedUrls = await uploadImagesMutation.mutateAsync(newImageFiles);
    }

    // 2. 레시피 저장
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
        images: uploadedUrls.length ? uploadedUrls : undefined,
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
    newImageFiles,
    uploadImagesMutation,
    createMutation,
    router,
  ]);

  const urlErrorMessage = getAnalyzeErrorMessage(
    analyzeMutation,
    ADD_RECIPE_PAGE.ERROR_ANALYZE_URL,
  );
  const imageErrorMessage = getAnalyzeErrorMessage(
    analyzeImageMutation,
    ADD_RECIPE_PAGE.ERROR_ANALYZE_IMAGE,
  );

  const saveErrorMessageFromApi =
    createMutation.data && createMutation.data.error !== 0
      ? createMutation.data.message ?? null
      : null;
  const saveErrorMessageGeneric = createMutation.isError
    ? ADD_RECIPE_PAGE.ERROR_SAVE
    : null;

  const isSaving = uploadImagesMutation.isPending || createMutation.isPending;

  return {
    analyzeTab,
    setAnalyzeTab,
    showTutorial,
    setShowTutorial,
    showOverlay,
    sourceUrl,
    setSourceUrl,
    basicInfo,
    setBasicInfo,
    ingredients,
    setIngredients,
    cookingSteps,
    setCookingSteps,
    nutrition,
    setNutrition,
    newImageFiles,
    setNewImageFiles,
    handleAnalyze,
    handleAnalyzeImage,
    handleSave,
    analyzeMutation,
    analyzeImageMutation,
    createMutation,
    isSaving,
    urlErrorMessage,
    imageErrorMessage,
    saveErrorMessageFromApi,
    saveErrorMessageGeneric,
  };
}
