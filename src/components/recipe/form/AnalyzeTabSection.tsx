'use client';

import { ADD_RECIPE_PAGE } from '@/constants/ui';
import UrlAnalyzeSection from '@/components/recipe/form/UrlAnalyzeSection';
import ImageAnalyzeSection from '@/components/recipe/form/ImageAnalyzeSection';

const TABS = ['url', 'image'] as const;
const TUTORIAL_STEPS = [
  ADD_RECIPE_PAGE.TUTORIAL_STEP_1,
  ADD_RECIPE_PAGE.TUTORIAL_STEP_2,
  ADD_RECIPE_PAGE.TUTORIAL_STEP_3,
] as const;

function TutorialStepItem({
  index,
  text,
}: {
  index: number;
  text: string;
}) {
  const separator = ' — ';
  const parts = text.includes(separator) ? text.split(separator) : null;
  return (
    <li className="flex gap-2">
      <span className="mt-0.5 shrink-0 text-[var(--point)]">
        {['①', '②', '③'][index]}
      </span>
      <span>
        {parts ? (
          <>
            <strong className="text-[var(--foreground)]">{parts[0]}</strong>
            {separator}
            {parts[1]}
          </>
        ) : (
          text
        )}
      </span>
    </li>
  );
}

interface AnalyzeTabSectionProps {
  analyzeTab: 'url' | 'image';
  onTabChange: (tab: 'url' | 'image') => void;
  showTutorial: boolean;
  onTutorialToggle: () => void;
  onAnalyzeUrl: (url: string) => void;
  onAnalyzeImage: (file: File) => void;
  isAnalyzingUrl: boolean;
  isAnalyzingImage: boolean;
  urlErrorMessage: string | null;
  imageErrorMessage: string | null;
}

export default function AnalyzeTabSection({
  analyzeTab,
  onTabChange,
  showTutorial,
  onTutorialToggle,
  onAnalyzeUrl,
  onAnalyzeImage,
  isAnalyzingUrl,
  isAnalyzingImage,
  urlErrorMessage,
  imageErrorMessage,
}: AnalyzeTabSectionProps) {
  const tabLabels: Record<'url' | 'image', string> = {
    url: ADD_RECIPE_PAGE.TAB_URL_LABEL,
    image: ADD_RECIPE_PAGE.TAB_IMAGE_LABEL,
  };

  return (
    <div className="animate-[staggerFade_0.4s_ease-out_both]">
      <div className="mb-3 flex items-center gap-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              analyzeTab === tab
                ? 'bg-[var(--point)] text-white'
                : 'bg-[var(--point-bg)] text-[var(--point)] hover:bg-[var(--point-pale)]'
            }`}
          >
            {tabLabels[tab]}
          </button>
        ))}
        <button
          type="button"
          onClick={onTutorialToggle}
          aria-label={ADD_RECIPE_PAGE.TUTORIAL_ARIA_LABEL}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--point-bg)] text-[var(--point)] transition-colors hover:bg-[var(--point-pale)]"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </button>
      </div>

      {showTutorial && (
        <div className="mb-3 rounded-2xl border border-[var(--glass-border)] bg-[var(--point-bg)] px-4 py-4 text-sm text-[var(--foreground)]">
          <p className="mb-2 font-semibold text-[var(--point)]">
            {ADD_RECIPE_PAGE.TUTORIAL_TITLE}
          </p>
          <ul className="space-y-2 text-[var(--point-muted)]">
            {TUTORIAL_STEPS.map((text, index) => (
              <TutorialStepItem key={index} index={index} text={text} />
            ))}
          </ul>
        </div>
      )}

      {analyzeTab === 'url' ? (
        <UrlAnalyzeSection
          onAnalyze={onAnalyzeUrl}
          isAnalyzing={isAnalyzingUrl}
          errorMessage={urlErrorMessage}
        />
      ) : (
        <ImageAnalyzeSection
          onAnalyze={onAnalyzeImage}
          isAnalyzing={isAnalyzingImage}
          errorMessage={imageErrorMessage}
        />
      )}
    </div>
  );
}
