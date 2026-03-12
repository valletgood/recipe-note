"use client";

import Link from "next/link";
import type { Recipe } from "@/types/recipe";
import GlassCard from "@/components/ui/GlassCard";

interface RecipeCardProps {
  recipe: Recipe;
}

const DIFFICULTY_LABEL: Record<NonNullable<Recipe["difficulty"]>, string> = {
  easy: "쉬움",
  medium: "보통",
  hard: "어려움",
};

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link href={`/recipes/${recipe.id}`} className="block transition-transform hover:scale-[1.02]">
      <GlassCard className="overflow-hidden transition-shadow hover:shadow-[var(--glass-shadow)]">
        <div className="aspect-[4/3] w-full bg-[var(--point-bg)]">
          {recipe.imageUrl ? (
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[var(--point-muted)]">
              <RecipePlaceholderIcon className="h-16 w-16" />
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-display text-lg font-semibold text-[var(--foreground)] line-clamp-2">
            {recipe.title}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[var(--point)]">
            {recipe.cookTimeMinutes != null && (
              <span>{recipe.cookTimeMinutes}분</span>
            )}
            {recipe.difficulty && (
              <span className="text-[var(--point-muted)]">
                {DIFFICULTY_LABEL[recipe.difficulty]}
              </span>
            )}
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}

function RecipePlaceholderIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm0 2c2.76 0 5 2.24 5 5 0 2.05-1.23 3.81-3 4.58V16H8v-2.42C6.23 12.81 5 11.05 5 9c0-2.76 2.24-5 5-5z" />
    </svg>
  );
}
