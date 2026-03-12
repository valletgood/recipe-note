"use client";

import { useCallback, useState } from "react";
import RecipeListItem from "./RecipeListItem";
import ChevronIcon from "@/components/ui/ChevronIcon";
import type { Recipe } from "@/types/recipe";

interface CategorySectionProps {
  label: string;
  recipes: Recipe[];
  defaultOpen?: boolean;
}

export default function CategorySection({
  label,
  recipes,
  defaultOpen = true,
}: CategorySectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <section>
      <button
        type="button"
        onClick={toggle}
        className="font-display mb-3 flex w-full items-center gap-2 text-left text-lg font-bold text-[var(--point)] transition-colors hover:text-[var(--point-light)]"
        aria-expanded={isOpen}
      >
        <ChevronIcon
          className={`h-5 w-5 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
        />
        {label}
        <span className="text-sm font-normal text-[var(--point-muted)]">
          ({recipes.length})
        </span>
      </button>

      <div
        className={`accordion-panel ${isOpen ? "accordion-panel-open" : ""}`}
        aria-hidden={!isOpen}
      >
        <ul className="space-y-3">
          {recipes.map((recipe) => (
            <li key={recipe.id}>
              <RecipeListItem recipe={recipe} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
