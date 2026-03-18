'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { RaccoonLogo } from '@/components/character/RaccoonLogo';
import { ADD_RECIPE_PAGE } from '@/constants/ui';

interface ImageAnalyzeSectionProps {
  onAnalyze: (files: File[]) => void;
  isAnalyzing: boolean;
  errorMessage?: string | null;
}

const MAX_IMAGES = 5;

export default function ImageAnalyzeSection({
  onAnalyze,
  isAnalyzing,
  errorMessage,
}: ImageAnalyzeSectionProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((selected: FileList | File[]) => {
    const arr = Array.from(selected).filter((f) => f.type.startsWith('image/'));
    if (!arr.length) return;

    setFiles((prev) => [...prev, ...arr].slice(0, MAX_IMAGES));
    setPreviews((prev) => {
      const newUrls = arr.map((f) => URL.createObjectURL(f));
      return [...prev, ...newUrls].slice(0, MAX_IMAGES);
    });
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) addFiles(e.target.files);
      e.target.value = '';
    },
    [addFiles],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      addFiles(e.dataTransfer.files);
    },
    [addFiles],
  );

  const handleRemove = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const handleAnalyze = useCallback(() => {
    if (files.length) onAnalyze(files);
  }, [files, onAnalyze]);

  const canAddMore = files.length < MAX_IMAGES;

  return (
    <GlassCard variant="strong" className="p-6">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <RaccoonLogo size="xs" />
          <h2 className="font-display text-lg font-bold text-[var(--point)]">
            레시피 이미지
          </h2>
        </div>
        <p className="mt-1 text-sm text-[var(--point-muted)]">
          레시피 사진이나 스크린샷을 올리면 구리가 자동으로 분석해요
        </p>
        <p className="mt-0.5 text-xs text-[var(--foreground-muted)]">
          여러 장을 함께 올리면 하나의 레시피로 통합 분석해요 (최대 {MAX_IMAGES}장)
        </p>
        <p className="mt-1 text-xs text-[var(--foreground-muted)]">
          {ADD_RECIPE_PAGE.AI_DISCLAIMER}
        </p>
      </div>

      {/* 이미지 목록 */}
      {previews.length > 0 && (
        <div className="mb-3 grid grid-cols-3 gap-2">
          {previews.map((src, i) => (
            <div
              key={src}
              className="relative overflow-hidden rounded-xl border border-[var(--glass-border)] bg-[var(--point-bg)]"
            >
              <Image
                src={src}
                alt={`이미지 ${i + 1}`}
                width={300}
                height={200}
                className="aspect-square w-full object-cover"
              />
              {!isAnalyzing && (
                <button
                  type="button"
                  onClick={() => handleRemove(i)}
                  className="absolute top-1 right-1 rounded-full bg-black/50 p-0.5 text-white transition-colors hover:bg-black/70"
                  aria-label="이미지 제거"
                >
                  <XIcon className="h-3.5 w-3.5" />
                </button>
              )}
              <span className="absolute bottom-1 left-1 rounded bg-black/40 px-1 text-[10px] text-white">
                {i + 1}
              </span>
            </div>
          ))}

          {/* 추가 버튼 (MAX_IMAGES 미만일 때) */}
          {canAddMore && !isAnalyzing && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-[var(--glass-border)] bg-[var(--point-bg)] text-[var(--point-muted)] transition-colors hover:border-[var(--point)]"
            >
              <PlusIcon className="h-6 w-6" />
              <span className="text-[10px]">추가</span>
            </button>
          )}
        </div>
      )}

      {/* 드롭존 (이미지가 없을 때만 표시) */}
      {previews.length === 0 && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--glass-border)] bg-[var(--point-bg)] px-4 py-10 text-[var(--point-muted)] transition-colors hover:border-[var(--point)] hover:bg-[var(--point-bg)]"
        >
          <ImageIcon className="h-8 w-8" />
          <span className="text-sm font-medium">
            탭하거나 이미지를 드래그해서 올려주세요
          </span>
          <span className="text-xs">JPG, PNG, WebP · 최대 10MB · 최대 {MAX_IMAGES}장</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={handleChange}
        disabled={isAnalyzing}
      />

      {/* 분석 버튼 */}
      <Button
        type="button"
        size="lg"
        className="mt-3 w-full"
        disabled={!files.length || isAnalyzing}
        isLoading={isAnalyzing}
        onClick={handleAnalyze}
      >
        {isAnalyzing
          ? '분석 중...'
          : files.length > 1
            ? `이미지 ${files.length}장으로 레시피 분석`
            : '이미지로 레시피 분석'}
      </Button>

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

function ImageIcon({ className }: { className?: string }) {
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
        strokeWidth={1.5}
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 16M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
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
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
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
        d="M12 4v16m8-8H4"
      />
    </svg>
  );
}
