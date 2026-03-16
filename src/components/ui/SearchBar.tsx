'use client';

import { useCallback, useState } from 'react';
import GlassCard from './GlassCard';
import Input from './Input';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  /** 실시간 필터링용: 입력 시마다 호출 */
  onChange?: (query: string) => void;
  value?: string;
  defaultValue?: string;
  className?: string;
}

export default function SearchBar({
  placeholder = '검색...',
  onSearch,
  onChange,
  value: controlledValue,
  defaultValue = '',
  className = '',
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSearch?.(value.trim());
    },
    [value, onSearch],
  );

  return (
    <form onSubmit={handleSubmit} className={className} role="search">
      <GlassCard variant="strong" className="overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3">
          <SearchIcon className="h-5 w-5 shrink-0 text-[var(--point)]" />
          <Input
            type="search"
            value={value}
            onChange={(e) => {
              const next = e.target.value;
              if (!isControlled) setInternalValue(next);
              onChange?.(next);
            }}
            placeholder={placeholder}
            aria-label={placeholder}
            className={`border-none! bg-transparent! focus:border-none! focus:ring-0! focus:outline-none!`}
          />
        </div>
      </GlassCard>
    </form>
  );
}

function SearchIcon({ className }: { className?: string }) {
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
        d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
}
