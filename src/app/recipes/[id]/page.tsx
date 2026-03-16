import { notFound } from 'next/navigation';
import { getRecipeById } from '@/db/queries/recipe';
import { getCategoryLabel } from '@/constants/recipe-categories';
import { NAV, RECIPE_DETAIL_PAGE, DIFFICULTY_OPTIONS } from '@/constants/ui';
import GlassCard from '@/components/ui/GlassCard';
import PageNav from '@/components/layout/PageNav';
import FloatingEditButton from '@/components/ui/FloatingEditButton';
import type { Recipe } from '@/types/recipe';
import { AuthGuard } from '@/components/auth/AuthGuard';

interface RecipeDetailPageProps {
  params: Promise<{ id: string }>;
}

function getDifficultyLabel(value: string): string {
  return DIFFICULTY_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export default async function RecipeDetailPage({
  params,
}: RecipeDetailPageProps) {
  const { id } = await params;
  const recipe = await getRecipeById(id);

  if (!recipe) {
    notFound();
  }

  const ingredients = recipe.ingredients ?? [];
  const steps = recipe.cookingSteps ?? [];
  const nutrition = recipe.nutritionInfo;

  return (
    <AuthGuard>
      <div className="relative z-10 min-h-screen">
        <PageNav backHref="/" backLabel={NAV.BACK_TO_LIST} />

        <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <article className="space-y-8">
            {/* Title & meta */}
            <div className="animate-[staggerFade_0.4s_ease-out_both]">
              <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
                {recipe.title}
              </h1>
              {recipe.description && (
                <p className="mt-3 text-[var(--point-muted)]">
                  {recipe.description}
                </p>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                {recipe.category && (
                  <MetaBadge label={getCategoryLabel(recipe.category)} />
                )}
                <MetaBadge
                  label={`${RECIPE_DETAIL_PAGE.COOK_TIME} ${recipe.cookTimeMinutes ?? 0}${RECIPE_DETAIL_PAGE.MINUTES}`}
                />
                <MetaBadge
                  label={`${recipe.servingCount ?? 1}${RECIPE_DETAIL_PAGE.SERVINGS}`}
                />
                {recipe.difficulty && (
                  <MetaBadge
                    label={`${RECIPE_DETAIL_PAGE.DIFFICULTY} ${getDifficultyLabel(recipe.difficulty)}`}
                  />
                )}
              </div>
              {recipe.sourceUrl && (
                <p className="mt-3 flex min-w-0 gap-1 text-sm">
                  <span className="shrink-0 text-[var(--point-muted)]">
                    {RECIPE_DETAIL_PAGE.SOURCE_URL}:{' '}
                  </span>
                  <a
                    href={recipe.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-w-0 truncate text-[var(--point)] underline hover:text-[var(--point-light)]"
                    title={recipe.sourceUrl}
                  >
                    {recipe.sourceUrl}
                  </a>
                </p>
              )}
            </div>

            {/* Ingredients */}
            <section
              className="animate-[staggerFade_0.4s_ease-out_both]"
              style={{ animationDelay: '0.06s' }}
            >
              <GlassCard className="p-6">
                <h2 className="font-display mb-4 text-lg font-bold text-[var(--point)]">
                  {RECIPE_DETAIL_PAGE.INGREDIENTS_TITLE}
                </h2>
                {ingredients.length > 0 ? (
                  <ul className="space-y-2">
                    {ingredients.map((ing, i) => (
                      <li
                        key={`${ing.name}-${i}`}
                        className="flex items-baseline gap-2 text-[var(--foreground)]"
                      >
                        <span className="font-medium">{ing.name}</span>
                        {(ing.amount || ing.unit) && (
                          <span className="text-[var(--point-muted)]">
                            {[ing.amount, ing.unit].filter(Boolean).join(' ')}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-[var(--point-muted)]">
                    등록된 재료가 없습니다.
                  </p>
                )}
              </GlassCard>
            </section>

            {/* Cooking steps */}
            <section
              className="animate-[staggerFade_0.4s_ease-out_both]"
              style={{ animationDelay: '0.12s' }}
            >
              <GlassCard className="p-6">
                <h2 className="font-display mb-4 text-lg font-bold text-[var(--point)]">
                  {RECIPE_DETAIL_PAGE.STEPS_TITLE}
                </h2>
                {steps.length > 0 ? (
                  <ol className="space-y-4">
                    {steps
                      .slice()
                      .sort((a, b) => a.order - b.order)
                      .map((step) => (
                        <li key={step.order} className="flex gap-4">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--point)] text-sm font-bold text-white">
                            {step.order}
                          </span>
                          <div>
                            <p className="text-[var(--foreground)]">
                              {step.description}
                            </p>
                            {step.tip && (
                              <p className="mt-1 text-sm text-[var(--point-muted)]">
                                💡 {step.tip}
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                  </ol>
                ) : (
                  <p className="text-sm text-[var(--point-muted)]">
                    등록된 조리 단계가 없습니다.
                  </p>
                )}
              </GlassCard>
            </section>

            {/* Nutrition */}
            {nutrition && (
              <section
                className="animate-[staggerFade_0.4s_ease-out_both]"
                style={{ animationDelay: '0.18s' }}
              >
                <GlassCard className="p-6">
                  <h2 className="font-display mb-4 text-lg font-bold text-[var(--point)]">
                    {RECIPE_DETAIL_PAGE.NUTRITION_TITLE}
                  </h2>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <NutritionItem
                      label="칼로리"
                      value={`${nutrition.calories} kcal`}
                    />
                    <NutritionItem
                      label="탄수화물"
                      value={`${nutrition.carbohydrates}g`}
                    />
                    <NutritionItem
                      label="단백질"
                      value={`${nutrition.protein}g`}
                    />
                    <NutritionItem label="지방" value={`${nutrition.fat}g`} />
                  </div>
                </GlassCard>
              </section>
            )}
          </article>
        </main>

        <FloatingEditButton
          href={`/recipes/${id}/edit`}
          label={RECIPE_DETAIL_PAGE.EDIT_BUTTON}
        />
      </div>
    </AuthGuard>
  );
}

function MetaBadge({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-[var(--point-bg)] px-3 py-1 text-sm font-medium text-[var(--point)]">
      {label}
    </span>
  );
}

function NutritionItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg-strong)] px-4 py-3 text-center">
      <p className="text-xs font-medium text-[var(--point-muted)]">{label}</p>
      <p className="font-display mt-0.5 font-semibold text-[var(--foreground)]">
        {value}
      </p>
    </div>
  );
}
