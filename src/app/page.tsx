"use client";

import { useMemo, useState } from "react";
import SearchBar from "@/components/ui/SearchBar";
import CategorySection from "@/components/recipe/CategorySection";
import EmptyState from "@/components/EmptyState";
import { MAIN_PAGE } from "@/constants/ui";
import {
  RECIPE_CATEGORIES,
  getCategoryLabel,
} from "@/constants/recipe-categories";
import { MOCK_RECIPES } from "@/lib/mock-recipes";
import type { RecipeCategoryValue } from "@/constants/recipe-categories";
import type { Recipe } from "@/types/recipe";

function groupByCategory(recipes: Recipe[]) {
  const grouped = new Map<RecipeCategoryValue, Recipe[]>();
  const uncategorized: Recipe[] = [];

  for (const recipe of recipes) {
    if (recipe.category) {
      const list = grouped.get(recipe.category) ?? [];
      list.push(recipe);
      grouped.set(recipe.category, list);
    } else {
      uncategorized.push(recipe);
    }
  }

  const result: { value: RecipeCategoryValue | null; label: string; recipes: Recipe[] }[] = [];
  for (const cat of RECIPE_CATEGORIES) {
    const list = grouped.get(cat.value);
    if (list && list.length > 0) {
      result.push({ value: cat.value, label: cat.label, recipes: list });
    }
  }
  if (uncategorized.length > 0) {
    result.push({ value: null, label: "기타", recipes: uncategorized });
  }
  return result;
}

export default function MainPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRecipes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return MOCK_RECIPES;
    return MOCK_RECIPES.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        (r.description?.toLowerCase().includes(q) ?? false) ||
        (r.category ? getCategoryLabel(r.category).includes(q) : false) ||
        (r.ingredients?.some((i) => i.name.toLowerCase().includes(q)) ?? false)
    );
  }, [searchQuery]);

  const grouped = useMemo(() => groupByCategory(filteredRecipes), [filteredRecipes]);

  const showEmptyState = filteredRecipes.length === 0;
  const isSearchResultEmpty = searchQuery.trim() !== "" && showEmptyState;

  return (
    <div className="relative z-10 min-h-screen">
      <header className="sticky top-0 z-20 border-b border-[var(--glass-border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
          <h1 className="font-display text-2xl font-bold text-[var(--foreground)] sm:text-3xl">
            {MAIN_PAGE.TITLE}
          </h1>
          <div className="mt-4">
            <SearchBar
              placeholder={MAIN_PAGE.SEARCH_PLACEHOLDER}
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={setSearchQuery}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {showEmptyState ? (
          <EmptyState
            title={
              isSearchResultEmpty
                ? "검색 결과가 없어요"
                : MAIN_PAGE.EMPTY_TITLE
            }
            description={
              isSearchResultEmpty
                ? "다른 키워드로 검색해 보세요."
                : MAIN_PAGE.EMPTY_DESCRIPTION
            }
          />
        ) : (
          <div className="space-y-8">
            {grouped.map((group, index) => (
              <div
                key={group.value ?? "etc"}
                className="animate-[staggerFade_0.4s_ease-out_both]"
                style={{ animationDelay: `${index * 0.06}s` }}
              >
                <CategorySection
                  label={group.label}
                  recipes={group.recipes}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
