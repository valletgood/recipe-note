'use client';

interface SectionDividerProps {
  label: string;
}

export default function SectionDivider({ label }: SectionDividerProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-px flex-1 bg-[var(--glass-border)]" />
      <span className="text-sm font-medium text-[var(--point-muted)]">
        {label}
      </span>
      <div className="h-px flex-1 bg-[var(--glass-border)]" />
    </div>
  );
}
