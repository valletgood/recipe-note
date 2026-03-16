import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getRecipeById } from '@/db/queries/recipe';
import { RaccoonEating } from '@/components/character/RaccoonEating';
import { AuthGuard } from '@/components/auth/AuthGuard';

interface RecipeCompletePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
}

export default async function RecipeCompletePage({
  params,
  searchParams,
}: RecipeCompletePageProps) {
  const { id } = await params;
  const { from } = await searchParams;
  const isEdit = from === 'edit';

  const recipe = await getRecipeById(id);
  if (!recipe) notFound();

  return (
    <AuthGuard>
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        <div className="flex w-full max-w-sm animate-[staggerFade_0.5s_ease-out_both] flex-col items-center gap-6 text-center">
          <RaccoonEating />

          <div className="flex flex-col gap-1.5">
            <h1 className="font-display text-2xl font-bold text-[var(--foreground)]">
              {isEdit ? '레시피가 수정됐어요!' : '레시피가 저장됐어요!'}
            </h1>
            <p className="text-sm text-[var(--point-muted)]">{recipe.title}</p>
          </div>

          <div className="flex w-full flex-col gap-2.5">
            <Link
              href={`/recipes/${id}`}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-[var(--point)] text-sm font-semibold text-white transition-opacity hover:opacity-90 active:scale-95"
            >
              레시피 보기
            </Link>
            <Link
              href="/"
              className="flex h-12 w-full items-center justify-center rounded-xl bg-[var(--point-bg)] text-sm font-semibold text-[var(--point)] transition-colors hover:bg-[var(--point-pale)] active:scale-95"
            >
              목록으로
            </Link>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
