'use client';

import Button from '@/components/ui/Button';
import { ADD_RECIPE_PAGE } from '@/constants/ui';

interface SaveBlockProps {
  errorMessageFromApi: string | null;
  errorMessageGeneric: string | null;
  onSave: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export default function SaveBlock({
  errorMessageFromApi,
  errorMessageGeneric,
  onSave,
  isLoading,
  disabled,
}: SaveBlockProps) {
  return (
    <div
      className="animate-[staggerFade_0.4s_ease-out_both] pb-8"
      style={{ animationDelay: ADD_RECIPE_PAGE.FORM_STAGGER_DELAYS[4] }}
    >
      {errorMessageFromApi && (
        <p className="mb-3 text-center text-sm text-red-500">
          {errorMessageFromApi}
        </p>
      )}
      {errorMessageGeneric && (
        <p className="mb-3 text-center text-sm text-red-500">
          {errorMessageGeneric}
        </p>
      )}
      <Button
        type="button"
        size="lg"
        className="w-full"
        onClick={onSave}
        isLoading={isLoading}
        disabled={disabled}
      >
        {ADD_RECIPE_PAGE.SAVE_BUTTON}
      </Button>
    </div>
  );
}
