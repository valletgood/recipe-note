import RecipeListView from '@/components/recipe/RecipeListView';
import FloatingAddButton from '@/components/ui/FloatingAddButton';
import { RaccoonLoco } from '@/components/character/RaccoonLoco';
import { getAllRecipes } from '@/db/queries/recipe';
import { MAIN_PAGE } from '@/constants/ui';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default async function MainPage() {
  const recipes = await getAllRecipes();

  return (
    <AuthGuard>
      <div className="relative z-10 min-h-screen">
        {/* Hero */}
        <section
          className="mx-auto max-w-4xl px-4 pt-8 pb-4 sm:px-6 sm:pt-14 sm:pb-6"
          aria-label="페이지 소개"
        >
          <div className="flex flex-col-reverse items-center gap-4">
            {/* 텍스트 */}
            <div
              className="animate-[staggerFade_0.5s_ease-out_both] text-center sm:text-left"
              style={{ animationDelay: '0.05s' }}
            >
              <h1 className="font-display mt-1 text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
                Recipe Note
              </h1>
              <p className="mt-2.5 text-sm leading-relaxed text-[var(--point-muted)] sm:text-base">
                이미지나 URL을 넣으면
                <br />
                구리가 레시피를 정리해 드려요
              </p>
            </div>

            {/* 캐릭터 */}
            <div
              className="shrink-0 animate-[staggerFade_0.5s_ease-out_both]"
              style={{ animationDelay: '0.15s' }}
            >
              <div
                style={{ width: '116px', height: '81px', overflow: 'hidden' }}
              >
                <div
                  style={{
                    transform: 'scale(0.5)',
                    transformOrigin: 'top left',
                  }}
                >
                  <RaccoonLoco />
                </div>
              </div>
            </div>
          </div>
        </section>

        <RecipeListView recipes={recipes} />

        <FloatingAddButton href="/recipes/new" label={MAIN_PAGE.ADD_RECIPE} />
      </div>
    </AuthGuard>
  );
}
