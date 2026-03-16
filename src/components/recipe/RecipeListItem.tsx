'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Recipe } from '@/types/recipe';
import { useDeleteRecipe } from '@/api/recipe/hooks';
import ChevronIcon from '@/components/ui/ChevronIcon';
import DetailIcon from '@/components/ui/DetailIcon';
import PencilIcon from '@/components/ui/PencilIcon';
import TrashIcon from '@/components/ui/TrashIcon';
import ConfirmModal from '@/components/ui/ConfirmModal';

interface RecipeListItemProps {
  recipe: Recipe;
}

export default function RecipeListItem({ recipe }: RecipeListItemProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeletedModal, setShowDeletedModal] = useState(false);
  const deleteMutation = useDeleteRecipe();

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  const handleDelete = useCallback(() => {
    setShowDeleteModal(false);
    deleteMutation.mutate(recipe.id, {
      onSuccess: (res) => {
        if (res.error === 0) setShowDeletedModal(true);
      },
    });
  }, [recipe.id, deleteMutation]);

  const handleDeletedConfirm = useCallback(() => {
    setShowDeletedModal(false);
    router.refresh();
  }, [router]);

  const ingredients = recipe.ingredients ?? [];

  return (
    <>
      <ConfirmModal
        open={showDeleteModal}
        title={`"${recipe.title}" 레시피를 삭제할까요?`}
        description="삭제한 레시피는 복구할 수 없어요."
        confirmLabel="삭제"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
      <ConfirmModal
        open={showDeletedModal}
        title="레시피가 삭제됐어요"
        confirmLabel="확인"
        hideCancel
        onConfirm={handleDeletedConfirm}
        onCancel={handleDeletedConfirm}
      />
      <div className="glass rounded-xl transition-shadow hover:shadow-[var(--glass-shadow)]">
        {/* Header row */}
        <div className="flex items-center justify-between gap-3 px-5 py-4">
          {/* 레시피 이름 — 클릭 시 아코디언 토글 */}
          <button
            type="button"
            onClick={toggle}
            className="flex min-w-0 flex-1 items-center gap-2 text-left"
            aria-expanded={isOpen}
          >
            <ChevronIcon
              className={`h-4 w-4 shrink-0 text-[var(--point-muted)] transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
            />
            <span className="font-display truncate text-base font-semibold text-[var(--foreground)]">
              {recipe.title}
            </span>
          </button>

          {/* 우측 아이콘 버튼 그룹 */}
          <div className="flex shrink-0 items-center gap-1">
            <Link
              href={`/recipes/${recipe.id}`}
              className="rounded-lg p-2 text-[var(--point-muted)] transition-colors hover:bg-[var(--point-bg)] hover:text-[var(--point)]"
              aria-label="자세히 보기"
            >
              <DetailIcon className="h-5 w-5" />
            </Link>
            <Link
              href={`/recipes/${recipe.id}/edit`}
              className="rounded-lg p-2 text-[var(--point-muted)] transition-colors hover:bg-[var(--point-bg)] hover:text-[var(--point)]"
              aria-label="레시피 수정"
            >
              <PencilIcon className="h-5 w-5" />
            </Link>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              disabled={deleteMutation.isPending}
              className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
              aria-label="레시피 삭제"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Accordion panel — 재료 목록 */}
        <div
          className={`accordion-panel ${isOpen ? 'accordion-panel-open' : ''}`}
          aria-hidden={!isOpen}
        >
          <div className="border-t border-[var(--glass-border)] px-5 pt-3 pb-4">
            {ingredients.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {ingredients.map((ing, index) => (
                  <li
                    key={`${ing.name}-${index}`}
                    className="rounded-full bg-[var(--point-bg)] px-3 py-1 text-sm text-[var(--point)]"
                  >
                    <span className="font-medium">{ing.name}</span>
                    {ing.amount && (
                      <span className="ml-1 text-[var(--point-muted)]">
                        {ing.amount}
                        {ing.unit ?? ''}
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
          </div>
        </div>
      </div>
    </>
  );
}
