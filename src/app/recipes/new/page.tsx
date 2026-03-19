'use client';

import BasicInfoSection from '@/components/recipe/form/BasicInfoSection';
import IngredientsSection from '@/components/recipe/form/IngredientsSection';
import CookingStepsSection from '@/components/recipe/form/CookingStepsSection';
import NutritionSection from '@/components/recipe/form/NutritionSection';
import AnalyzeTabSection from '@/components/recipe/form/AnalyzeTabSection';
import RecipeImagesSection from '@/components/recipe/form/RecipeImagesSection';
import SectionDivider from '@/components/recipe/form/SectionDivider';
import SaveBlock from '@/components/recipe/form/SaveBlock';
import Button from '@/components/ui/Button';
import PageNav from '@/components/layout/PageNav';
import AnalyzingOverlay from '@/components/ui/AnalyzingOverlay';
import { ADD_RECIPE_PAGE, NAV } from '@/constants/ui';
import { useNewRecipeForm } from '@/hooks/useNewRecipeForm';
import { AuthGuard } from '@/components/auth/AuthGuard';

const { FORM_STAGGER_DELAYS, SECTION_LABEL_RECIPE_INFO } = ADD_RECIPE_PAGE;

export default function NewRecipePage() {
  const {
    analyzeTab,
    setAnalyzeTab,
    showTutorial,
    setShowTutorial,
    showOverlay,
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
    isSaving,
    urlErrorMessage,
    imageErrorMessage,
    saveErrorMessageFromApi,
    saveErrorMessageGeneric,
  } = useNewRecipeForm();

  return (
    <AuthGuard>
      <div className="relative z-10 min-h-screen">
        <AnalyzingOverlay visible={showOverlay} />
        <PageNav
          backHref="/"
          backLabel={NAV.BACK_TO_LIST}
          button={
            <Button
              variant="ghost"
              size="sm"
              className="underline"
              onClick={handleSave}
              isLoading={isSaving}
              disabled={isSaving || !basicInfo.title.trim()}
            >
              {ADD_RECIPE_PAGE.SAVE_BUTTON}
            </Button>
          }
        />

        <main className="mx-auto max-w-3xl px-4 pt-6 sm:px-6">
          <div className="space-y-6">
            <AnalyzeTabSection
              analyzeTab={analyzeTab}
              onTabChange={setAnalyzeTab}
              showTutorial={showTutorial}
              onTutorialToggle={() => setShowTutorial((v) => !v)}
              onAnalyzeUrl={handleAnalyze}
              onAnalyzeImage={handleAnalyzeImage}
              isAnalyzingUrl={analyzeMutation.isPending}
              isAnalyzingImage={analyzeImageMutation.isPending}
              urlErrorMessage={urlErrorMessage}
              imageErrorMessage={imageErrorMessage}
            />

            <SectionDivider label={SECTION_LABEL_RECIPE_INFO} />

            <div className="animate-[staggerFade_0.4s_ease-out_both]">
              <RecipeImagesSection
                existingUrls={[]}
                onExistingUrlsChange={() => {}}
                newFiles={newImageFiles}
                onNewFilesChange={setNewImageFiles}
                disabled={isSaving}
              />
            </div>

            <div
              className="animate-[staggerFade_0.4s_ease-out_both]"
              style={{ animationDelay: FORM_STAGGER_DELAYS[0] }}
            >
              <BasicInfoSection data={basicInfo} onChange={setBasicInfo} />
            </div>

            <div
              className="animate-[staggerFade_0.4s_ease-out_both]"
              style={{ animationDelay: FORM_STAGGER_DELAYS[1] }}
            >
              <IngredientsSection
                ingredients={ingredients}
                onChange={setIngredients}
              />
            </div>

            <div
              className="animate-[staggerFade_0.4s_ease-out_both]"
              style={{ animationDelay: FORM_STAGGER_DELAYS[2] }}
            >
              <CookingStepsSection
                steps={cookingSteps}
                onChange={setCookingSteps}
              />
            </div>

            <div
              className="animate-[staggerFade_0.4s_ease-out_both]"
              style={{ animationDelay: FORM_STAGGER_DELAYS[3] }}
            >
              <NutritionSection data={nutrition} onChange={setNutrition} />
            </div>

            <SaveBlock
              errorMessageFromApi={saveErrorMessageFromApi}
              errorMessageGeneric={saveErrorMessageGeneric}
              onSave={handleSave}
              isLoading={isSaving}
              disabled={isSaving || !basicInfo.title.trim()}
            />
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
