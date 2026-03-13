"use client";

import type { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export default function Textarea({
  label,
  error,
  className = "",
  id,
  ...rest
}: TextareaProps) {
  const textareaId = id ?? label?.toLowerCase().replace(/\s/g, "-");
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="mb-1.5 block text-sm font-medium text-[var(--foreground)]"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`w-full resize-none rounded-xl border border-[var(--glass-border)] bg-white/80 px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--point-muted)] focus:border-[var(--point)] focus:outline-none focus:ring-2 focus:ring-[var(--point)]/20 ${className}`}
        rows={3}
        {...rest}
      />
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
}
