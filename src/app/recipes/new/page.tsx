"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import UrlAnalyzeSection from "@/components/recipe/form/UrlAnalyzeSection";
import BasicInfoSection from "@/components/recipe/form/BasicInfoSection";
import IngredientsSection from "@/components/recipe/form/IngredientsSection";
import CookingStepsSection from "@/components/recipe/form/CookingStepsSection";
import NutritionSection from "@/components/recipe/form/NutritionSection";
import Button from "@/components/ui/Button";
import { ADD_RECIPE_PAGE, NAV } from "@/constants/ui";
import { analyzeRecipeFromUrl } from "@/api/analyze-recipe";
import type { BasicInfoData } from "@/components/recipe/form/BasicInfoSection";
import type { NutritionData } from "@/components/recipe/form/NutritionSection";
import type { Ingredient, CookingStep } from "@/types/recipe";

export default function NewRecipePage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);

  const [basicInfo, setBasicInfo] = useState<BasicInfoData>({
    title: "",
    description: "",
    category: "",
    difficulty: "",
    cookTimeMinutes: "",
    servingCount: "",
  });

  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "", amount: "", unit: "" },
  ]);

  const [cookingSteps, setCookingSteps] = useState<CookingStep[]>([
    { order: 1, description: "", tip: "" },
  ]);

  const [nutrition, setNutrition] = useState<NutritionData>({
    calories: "",
    carbohydrates: "",
    protein: "",
    fat: "",
  });

  const handleAnalyze = useCallback(async (url: string) => {
    setIsAnalyzing(true);
    setAnalyzeError(null);

    try {
      const result = await analyzeRecipeFromUrl(url);

      if (result.error !== 0 || !result.data) {
        setAnalyzeError(result.message);
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
    } catch {
      setAnalyzeError(
        "레시피 분석 중 오류가 발생했습니다. 다시 시도해주세요."
      );
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const handleSave = useCallback(() => {
    // TODO: 저장 API 연동
    console.log({
      basicInfo,
      ingredients,
      cookingSteps,
      nutrition,
    });
  }, [basicInfo, ingredients, cookingSteps, nutrition]);

  return (
    <div className="relative z-10 min-h-screen">
      <header className="sticky top-0 z-20 border-b border-[var(--glass-border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="text-[var(--point)] transition-colors hover:text-[var(--point-light)]"
          >
            ← {NAV.BACK_TO_LIST}
          </Link>
          <h1 className="font-display text-2xl font-bold text-[var(--foreground)]">
            {ADD_RECIPE_PAGE.TITLE}
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="space-y-6">
          {/* URL 분석 섹션 */}
          <div className="animate-[staggerFade_0.4s_ease-out_both]">
            <UrlAnalyzeSection
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
              errorMessage={analyzeError}
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
            style={{ animationDelay: "0.06s" }}
          >
            <BasicInfoSection data={basicInfo} onChange={setBasicInfo} />
          </div>

          {/* 재료 */}
          <div
            className="animate-[staggerFade_0.4s_ease-out_both]"
            style={{ animationDelay: "0.12s" }}
          >
            <IngredientsSection
              ingredients={ingredients}
              onChange={setIngredients}
            />
          </div>

          {/* 조리 단계 */}
          <div
            className="animate-[staggerFade_0.4s_ease-out_both]"
            style={{ animationDelay: "0.18s" }}
          >
            <CookingStepsSection
              steps={cookingSteps}
              onChange={setCookingSteps}
            />
          </div>

          {/* 영양 정보 */}
          <div
            className="animate-[staggerFade_0.4s_ease-out_both]"
            style={{ animationDelay: "0.24s" }}
          >
            <NutritionSection data={nutrition} onChange={setNutrition} />
          </div>

          {/* 저장 버튼 */}
          <div
            className="animate-[staggerFade_0.4s_ease-out_both] pb-8"
            style={{ animationDelay: "0.3s" }}
          >
            <Button
              type="button"
              size="lg"
              className="w-full"
              onClick={handleSave}
            >
              {ADD_RECIPE_PAGE.SAVE_BUTTON}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
