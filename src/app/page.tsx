import RecipeListView from '@/components/recipe/RecipeListView';
import FloatingAddButton from '@/components/ui/FloatingAddButton';
import FloatingSettingButton from '@/components/ui/FloatingSettingButton';
import { RaccoonLogo } from '@/components/character/RaccoonLogo';
import { getRecipesByUserUuid } from '@/db/queries/recipe';
import { MAIN_PAGE } from '@/constants/ui';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/session';

export default async function MainPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  let recipes: Awaited<ReturnType<typeof getRecipesByUserUuid>> = [];
  if (token) {
    try {
      const session = await verifySessionToken(token);
      recipes = await getRecipesByUserUuid(session.uuid);
    } catch {
      // 토큰 만료 시 빈 목록
    }
  }

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

            {/* 캐릭터 — 정중앙에 크게 */}
            <div
              className="flex w-full animate-[staggerFade_0.5s_ease-out_both] justify-center sm:justify-start"
              style={{ animationDelay: '0.15s' }}
            >
              <RaccoonLogo size="sm" />
            </div>
          </div>
        </section>

        <RecipeListView recipes={recipes} />

        <FloatingSettingButton />
        <FloatingAddButton href="/recipes/new" label={MAIN_PAGE.ADD_RECIPE} />
      </div>
    </AuthGuard>
  );
}
