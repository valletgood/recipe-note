"use client";

import Input from "@/components/ui/Input";
import GlassCard from "@/components/ui/GlassCard";
import { ADD_RECIPE_PAGE } from "@/constants/ui";

interface NutritionData {
  calories: string;
  carbohydrates: string;
  protein: string;
  fat: string;
}

interface NutritionSectionProps {
  data: NutritionData;
  onChange: (data: NutritionData) => void;
}

export default function NutritionSection({
  data,
  onChange,
}: NutritionSectionProps) {
  const update = (key: keyof NutritionData, value: string) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <GlassCard className="p-6">
      <h2 className="font-display mb-5 text-lg font-bold text-[var(--point)]">
        {ADD_RECIPE_PAGE.NUTRITION_SECTION_TITLE}
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Input
          label="칼로리 (kcal)"
          type="number"
          placeholder="0"
          min={0}
          value={data.calories}
          onChange={(e) => update("calories", e.target.value)}
        />
        <Input
          label="탄수화물 (g)"
          type="number"
          placeholder="0"
          min={0}
          value={data.carbohydrates}
          onChange={(e) => update("carbohydrates", e.target.value)}
        />
        <Input
          label="단백질 (g)"
          type="number"
          placeholder="0"
          min={0}
          value={data.protein}
          onChange={(e) => update("protein", e.target.value)}
        />
        <Input
          label="지방 (g)"
          type="number"
          placeholder="0"
          min={0}
          value={data.fat}
          onChange={(e) => update("fat", e.target.value)}
        />
      </div>
    </GlassCard>
  );
}

export type { NutritionData };
