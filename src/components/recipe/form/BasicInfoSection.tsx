'use client';

import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import GlassCard from '@/components/ui/GlassCard';
import { ADD_RECIPE_PAGE, DIFFICULTY_OPTIONS } from '@/constants/ui';
import { RECIPE_CATEGORIES } from '@/constants/recipe-categories';
import type { RecipeCategoryValue } from '@/constants/recipe-categories';

interface BasicInfoData {
  title: string;
  description: string;
  category: RecipeCategoryValue | '';
  difficulty: 'easy' | 'medium' | 'hard' | '';
  cookTimeMinutes: string;
  servingCount: string;
}

interface BasicInfoSectionProps {
  data: BasicInfoData;
  onChange: (data: BasicInfoData) => void;
}

export default function BasicInfoSection({
  data,
  onChange,
}: BasicInfoSectionProps) {
  const update = <K extends keyof BasicInfoData>(
    key: K,
    value: BasicInfoData[K],
  ) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <GlassCard className="p-6">
      <h2 className="font-display mb-5 text-lg font-bold text-[var(--point)]">
        {ADD_RECIPE_PAGE.INFO_SECTION_TITLE}
      </h2>

      <div className="space-y-4">
        <Input
          label="레시피 이름"
          placeholder={ADD_RECIPE_PAGE.TITLE_PLACEHOLDER}
          value={data.title}
          onChange={(e) => update('title', e.target.value)}
        />

        <Textarea
          label="설명"
          placeholder={ADD_RECIPE_PAGE.DESCRIPTION_PLACEHOLDER}
          value={data.description}
          rows={5}
          onChange={(e) => update('description', e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="카테고리"
            options={RECIPE_CATEGORIES}
            placeholder="카테고리 선택"
            value={data.category}
            onChange={(e) =>
              update('category', e.target.value as RecipeCategoryValue | '')
            }
          />
          <Select
            label="난이도"
            options={DIFFICULTY_OPTIONS}
            placeholder="난이도 선택"
            value={data.difficulty}
            onChange={(e) =>
              update(
                'difficulty',
                e.target.value as 'easy' | 'medium' | 'hard' | '',
              )
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="조리 시간 (분)"
            type="number"
            placeholder="25"
            min={0}
            value={data.cookTimeMinutes}
            onChange={(e) => update('cookTimeMinutes', e.target.value)}
          />
          <Input
            label="인분 수"
            type="number"
            placeholder="2"
            min={1}
            value={data.servingCount}
            onChange={(e) => update('servingCount', e.target.value)}
          />
        </div>
      </div>
    </GlassCard>
  );
}

export type { BasicInfoData };
