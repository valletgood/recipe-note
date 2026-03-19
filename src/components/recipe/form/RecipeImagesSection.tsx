'use client';

import { useCallback, useRef } from 'react';
import Image from 'next/image';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';

interface RecipeImagesSectionProps {
  /** 이미 저장된 이미지 URL (수정 폼에서 사용) */
  existingUrls: string[];
  onExistingUrlsChange: (urls: string[]) => void;
  /** 새로 추가된 파일 (저장 시 업로드됨) */
  newFiles: File[];
  onNewFilesChange: (files: File[]) => void;
  disabled?: boolean;
}

const MAX_IMAGES = 10;

export default function RecipeImagesSection({
  existingUrls = [],
  onExistingUrlsChange,
  newFiles = [],
  onNewFilesChange,
  disabled,
}: RecipeImagesSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const totalCount = existingUrls.length + newFiles.length;
  const canAddMore = totalCount < MAX_IMAGES;

  const handleFiles = useCallback(
    (selected: File[]) => {
      const imageFiles = selected.filter((f) => f.type.startsWith('image/'));
      if (!imageFiles.length) return;
      const available = MAX_IMAGES - totalCount;
      onNewFilesChange([...newFiles, ...imageFiles].slice(0, newFiles.length + available));
    },
    [totalCount, newFiles, onNewFilesChange],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) handleFiles(Array.from(e.target.files));
      e.target.value = '';
    },
    [handleFiles],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      handleFiles(Array.from(e.dataTransfer.files));
    },
    [handleFiles],
  );

  const handleRemoveExisting = useCallback(
    (index: number) => {
      onExistingUrlsChange(existingUrls.filter((_, i) => i !== index));
    },
    [existingUrls, onExistingUrlsChange],
  );

  const handleRemoveNew = useCallback(
    (index: number) => {
      onNewFilesChange(newFiles.filter((_, i) => i !== index));
    },
    [newFiles, onNewFilesChange],
  );

  return (
    <GlassCard variant="strong" className="p-6">
      <div className="mb-4">
        <h2 className="font-display text-lg font-bold text-[var(--point)]">레시피 사진</h2>
        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
          요리 사진을 추가해보세요 (선택, 최대 {MAX_IMAGES}장)
        </p>
      </div>

      {/* 이미지 그리드 */}
      {totalCount > 0 && (
        <div className="mb-3 grid grid-cols-3 gap-2">
          {/* 기존 저장된 이미지 */}
          {existingUrls.map((url, i) => (
            <div
              key={url}
              className="relative overflow-hidden rounded-xl border border-[var(--glass-border)] bg-[var(--point-bg)]"
            >
              <Image
                src={url}
                alt={`레시피 사진 ${i + 1}`}
                width={300}
                height={300}
                className="aspect-square w-full object-cover"
              />
              {!disabled && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => handleRemoveExisting(i)}
                  className="absolute top-1 right-1 !rounded-full bg-black/50 !p-0.5 text-white hover:bg-black/70"
                  aria-label="이미지 제거"
                >
                  <XIcon className="h-3.5 w-3.5" />
                </Button>
              )}
              <span className="absolute bottom-1 left-1 rounded bg-black/40 px-1 text-[10px] text-white">
                {i + 1}
              </span>
            </div>
          ))}

          {/* 새로 추가된 파일 (로컬 미리보기) */}
          {newFiles.map((file, i) => (
            <div
              key={`${file.name}-${file.lastModified}-${i}`}
              className="relative overflow-hidden rounded-xl border border-[var(--glass-border)] bg-[var(--point-bg)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={URL.createObjectURL(file)}
                alt="새 사진"
                className="aspect-square w-full object-cover"
              />
              {!disabled && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => handleRemoveNew(i)}
                  className="absolute top-1 right-1 !rounded-full bg-black/50 !p-0.5 text-white hover:bg-black/70"
                  aria-label="이미지 제거"
                >
                  <XIcon className="h-3.5 w-3.5" />
                </Button>
              )}
              <span className="absolute bottom-1 left-1 rounded bg-black/40 px-1 text-[10px] text-white">
                {existingUrls.length + i + 1}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 추가 버튼 */}
      {canAddMore && !disabled && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="rounded-xl border-2 border-dashed border-[var(--glass-border)] p-4 text-center transition-colors hover:border-[var(--point)]/50"
        >
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => inputRef.current?.click()}
          >
            <CameraIcon className="mr-1.5 h-4 w-4" />
            사진 추가
          </Button>
          <p className="mt-2 text-xs text-[var(--foreground-muted)]">
            또는 사진을 여기로 드래그하세요
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
      />
    </GlassCard>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}
