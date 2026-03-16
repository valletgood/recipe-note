'use client';

import { useCallback, useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { ADD_RECIPE_PAGE } from '@/constants/ui';
import { RaccoonLogo } from '@/components/character/RaccoonLogo';

interface UrlAnalyzeSectionProps {
  onAnalyze: (url: string) => void;
  isAnalyzing: boolean;
  errorMessage?: string | null;
}

export default function UrlAnalyzeSection({
  onAnalyze,
  isAnalyzing,
  errorMessage,
}: UrlAnalyzeSectionProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = url.trim();
      if (!trimmed) return;
      onAnalyze(trimmed);
    },
    [url, onAnalyze],
  );

  return (
    <GlassCard variant="strong" className="p-6">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <RaccoonLogo size="xs" />
          <h2 className="font-display text-lg font-bold text-[var(--point)]">
            레시피 주소
          </h2>
        </div>
        <p className="mt-1 text-sm text-[var(--point-muted)]">
          블로그나 사이트 URL을 넣으면 구리가 자동으로 분석해요
        </p>
        <p className="mt-1 text-xs text-[var(--foreground-muted)]">
          {ADD_RECIPE_PAGE.AI_DISCLAIMER}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <LinkIcon className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[var(--point-muted)]" />
          <Input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={ADD_RECIPE_PAGE.URL_PLACEHOLDER}
            className="py-3 pl-11"
            disabled={isAnalyzing}
          />
        </div>
        <Button
          type="submit"
          disabled={!url.trim()}
          isLoading={isAnalyzing}
          size="lg"
          className="w-full sm:w-auto"
        >
          {isAnalyzing
            ? ADD_RECIPE_PAGE.URL_ANALYZING
            : ADD_RECIPE_PAGE.URL_ANALYZE_BUTTON}
        </Button>
      </form>
      {isAnalyzing && (
        <p className="mt-3 text-sm text-[var(--point-muted)]">
          화면을 이동하거나 종료하지 말고 기다려주세요
        </p>
      )}
      {errorMessage && (
        <p className="mt-3 text-sm text-red-500">{errorMessage}</p>
      )}
    </GlassCard>
  );
}

function LinkIcon({ className }: { className?: string }) {
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
        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
      />
    </svg>
  );
}
