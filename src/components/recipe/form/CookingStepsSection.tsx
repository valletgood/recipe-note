"use client";

import { useCallback } from "react";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";
import { ADD_RECIPE_PAGE } from "@/constants/ui";
import type { CookingStep } from "@/types/recipe";

interface CookingStepsSectionProps {
  steps: CookingStep[];
  onChange: (steps: CookingStep[]) => void;
}

export default function CookingStepsSection({
  steps,
  onChange,
}: CookingStepsSectionProps) {
  const addStep = useCallback(() => {
    onChange([
      ...steps,
      { order: steps.length + 1, description: "", tip: "" },
    ]);
  }, [steps, onChange]);

  const removeStep = useCallback(
    (index: number) => {
      const updated = steps
        .filter((_, i) => i !== index)
        .map((step, i) => ({ ...step, order: i + 1 }));
      onChange(updated);
    },
    [steps, onChange]
  );

  const updateStep = useCallback(
    (index: number, field: "description" | "tip", value: string) => {
      const updated = steps.map((step, i) =>
        i === index ? { ...step, [field]: value } : step
      );
      onChange(updated);
    },
    [steps, onChange]
  );

  return (
    <GlassCard className="p-6">
      <h2 className="font-display mb-5 text-lg font-bold text-[var(--point)]">
        {ADD_RECIPE_PAGE.STEPS_SECTION_TITLE}
      </h2>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className="relative rounded-xl border border-[var(--glass-border)] bg-[var(--point-bg)] p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="font-display inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--point)] text-sm font-bold text-white">
                {step.order}
              </span>
              <button
                type="button"
                onClick={() => removeStep(index)}
                className="rounded-lg p-1 text-red-400 transition-colors hover:bg-red-50 hover:text-red-500"
                aria-label="단계 삭제"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
            <Textarea
              placeholder="조리 방법을 입력하세요"
              value={step.description}
              onChange={(e) =>
                updateStep(index, "description", e.target.value)
              }
              autoResize
              rows={5}
            />
            <div className="mt-2">
              <Textarea
                placeholder="팁 (선택사항)"
                value={step.tip ?? ""}
                onChange={(e) => updateStep(index, "tip", e.target.value)}
                autoResize
                rows={2}
              />
            </div>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={addStep}
        className="mt-4"
      >
        + {ADD_RECIPE_PAGE.ADD_STEP}
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
