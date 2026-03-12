"use client";

import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  className = "",
  id,
  ...rest
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s/g, "-");
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-[var(--foreground)]"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full rounded-xl border border-[var(--glass-border)] bg-white/80 px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--point-muted)] focus:border-[var(--point)] focus:outline-none focus:ring-2 focus:ring-[var(--point)]/20 ${className}`}
        {...rest}
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
