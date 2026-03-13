"use client";

import { useCallback, useState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { ADD_RECIPE_PAGE } from "@/constants/ui";

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
  const [url, setUrl] = useState("");

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = url.trim();
      if (!trimmed) return;
      onAnalyze(trimmed);
    },
    [url, onAnalyze]
  );

  return (
    <GlassCard variant="strong" className="p-6">
      <h2 className="font-display mb-4 text-lg font-bold text-[var(--point)]">
        {ADD_RECIPE_PAGE.URL_SECTION_TITLE}
      </h2>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="relative min-w-0 flex-1">
          <LinkIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--point-muted)]" />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={ADD_RECIPE_PAGE.URL_PLACEHOLDER}
            className="w-full rounded-xl border border-[var(--glass-border)] bg-white/80 py-3 pl-11 pr-4 text-[var(--foreground)] placeholder:text-[var(--point-muted)] focus:border-[var(--point)] focus:outline-none focus:ring-2 focus:ring-[var(--point)]/20"
            disabled={isAnalyzing}
          />
        </div>
        <Button
          type="submit"
          disabled={!url.trim()}
          isLoading={isAnalyzing}
          size="lg"
        >
          {isAnalyzing
            ? ADD_RECIPE_PAGE.URL_ANALYZING
            : ADD_RECIPE_PAGE.URL_ANALYZE_BUTTON}
        </Button>
      </form>
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
