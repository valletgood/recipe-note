"use client";

import { useCallback } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";
import { ADD_RECIPE_PAGE } from "@/constants/ui";
import type { Ingredient } from "@/types/recipe";

interface IngredientsSectionProps {
  ingredients: Ingredient[];
  onChange: (ingredients: Ingredient[]) => void;
}

export default function IngredientsSection({
  ingredients,
  onChange,
}: IngredientsSectionProps) {
  const addIngredient = useCallback(() => {
    onChange([...ingredients, { name: "", amount: "", unit: "" }]);
  }, [ingredients, onChange]);

  const removeIngredient = useCallback(
    (index: number) => {
      onChange(ingredients.filter((_, i) => i !== index));
    },
    [ingredients, onChange]
  );

  const updateIngredient = useCallback(
    (index: number, field: keyof Ingredient, value: string) => {
      const updated = ingredients.map((ing, i) =>
        i === index ? { ...ing, [field]: value } : ing
      );
      onChange(updated);
    },
    [ingredients, onChange]
  );

  return (
    <GlassCard className="p-6">
      <h2 className="font-display mb-5 text-lg font-bold text-[var(--point)]">
        {ADD_RECIPE_PAGE.INGREDIENTS_SECTION_TITLE}
      </h2>

      <div className="space-y-3">
        {ingredients.map((ing, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="grid min-w-0 flex-1 grid-cols-[1fr_80px_80px] gap-2">
              <Input
                placeholder="재료명"
                value={ing.name}
                onChange={(e) =>
                  updateIngredient(index, "name", e.target.value)
                }
              />
              <Input
                placeholder="양"
                value={ing.amount ?? ""}
                onChange={(e) =>
                  updateIngredient(index, "amount", e.target.value)
                }
              />
              <Input
                placeholder="단위"
                value={ing.unit ?? ""}
                onChange={(e) =>
                  updateIngredient(index, "unit", e.target.value)
                }
              />
            </div>
            <button
              type="button"
              onClick={() => removeIngredient(index)}
              className="mt-2.5 shrink-0 rounded-lg p-1.5 text-red-400 transition-colors hover:bg-red-50 hover:text-red-500"
              aria-label="재료 삭제"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={addIngredient}
        className="mt-4"
      >
        + {ADD_RECIPE_PAGE.ADD_INGREDIENT}
      </Button>
    </GlassCard>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );
}
