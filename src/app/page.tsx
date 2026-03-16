import RecipeListView from '@/components/recipe/RecipeListView';
import FloatingAddButton from '@/components/ui/FloatingAddButton';
import { getAllRecipes } from '@/db/queries/recipe';
import { MAIN_PAGE } from '@/constants/ui';

export default async function MainPage() {
  const recipes = await getAllRecipes();

  return (
    <div className="relative z-10 min-h-screen">
      {/* Hero: 헤더 바 없이 콘텐츠와 통합된 상단 영역 */}
      <section
        className="mx-auto max-w-4xl px-4 pt-7 pb-6 sm:px-6 sm:pt-14 sm:pb-8"
        aria-label="페이지 소개"
      >
        <div
          className="min-w-0 animate-[staggerFade_0.5s_ease-out_both]"
          style={{ animationDelay: '0.05s' }}
        >
          <h1 className="text-lg font-medium tracking-[0.2em] text-[var(--point)] uppercase sm:text-base">
            Recipe Note
          </h1>
          <p className="mt-2 text-sm text-[var(--point-muted)] sm:text-base">
            이미지나 URL을 넣으면 AI가 레시피를 정리해 드려요
          </p>
        </div>
      </section>

      <RecipeListView recipes={recipes} />

      <FloatingAddButton href="/recipes/new" label={MAIN_PAGE.ADD_RECIPE} />
    </div>
  );
}
