"use client";

import { useEffect, useRef } from "react";
import type { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  autoResize?: boolean;
}

export default function Textarea({
  label,
  error,
  className = "",
  id,
  autoResize = false,
  ...rest
}: TextareaProps) {
  const textareaId = id ?? label?.toLowerCase().replace(/\s/g, "-");
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!autoResize || !ref.current) return;
    const el = ref.current;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [autoResize, rest.value]);

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
        ref={ref}
        id={textareaId}
        className={`w-full resize-none rounded-xl border border-[var(--glass-border)] bg-white/80 px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--point-muted)] focus:border-[var(--point)] focus:outline-none focus:ring-2 focus:ring-[var(--point)]/20 ${className}`}
        rows={autoResize ? 1 : 3}
        {...rest}
      />
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
}
