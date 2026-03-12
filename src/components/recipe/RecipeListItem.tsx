"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import type { Recipe } from "@/types/recipe";
import ChevronIcon from "@/components/ui/ChevronIcon";

interface RecipeListItemProps {
  recipe: Recipe;
}

export default function RecipeListItem({ recipe }: RecipeListItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  const ingredients = recipe.ingredients ?? [];

  return (
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
            className={`h-4 w-4 shrink-0 text-[var(--point-muted)] transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
          />
          <span className="font-display truncate text-base font-semibold text-[var(--foreground)]">
            {recipe.title}
          </span>
        </button>

        {/* 우측 버튼 그룹 */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--point)] transition-colors hover:bg-[var(--point-bg)]"
          >
            {isOpen ? "접기" : "간단히 보기"}
          </button>
          <Link
            href={`/recipes/${recipe.id}`}
            className="rounded-lg bg-[var(--point)] px-3 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-85"
          >
            자세히 보기
          </Link>
        </div>
      </div>

      {/* Accordion panel — 재료 목록 */}
      <div
        className={`accordion-panel ${isOpen ? "accordion-panel-open" : ""}`}
        aria-hidden={!isOpen}
      >
        <div className="border-t border-[var(--glass-border)] px-5 pb-4 pt-3">
          {ingredients.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {ingredients.map((ing) => (
                <li
                  key={ing.name}
                  className="rounded-full bg-[var(--point-bg)] px-3 py-1 text-sm text-[var(--point)]"
                >
                  <span className="font-medium">{ing.name}</span>
                  {ing.amount && (
                    <span className="ml-1 text-[var(--point-muted)]">
                      {ing.amount}
                      {ing.unit ?? ""}
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
  );
}
