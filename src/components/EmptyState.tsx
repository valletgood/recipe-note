"use client";

import RaccoonMascot from "./RaccoonMascot";

interface EmptyStateProps {
  title: string;
  description?: string;
  className?: string;
}

export default function EmptyState({
  title,
  description,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-6 py-16 text-center ${className}`}
      role="status"
      aria-label="내용 없음"
    >
      <RaccoonMascot className="h-32 w-32 animate-[float_3s_ease-in-out_infinite]" />
      <div className="space-y-2">
        <h2 className="font-display text-xl font-semibold text-[var(--foreground)]">
          {title}
        </h2>
        {description && (
          <p className="max-w-sm text-[var(--point)]">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
