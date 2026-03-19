'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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
  const [pasteError, setPasteError] = useState<string | null>(null);
  const [showPasteZone, setShowPasteZone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pasteZoneRef = useRef<HTMLDivElement>(null);

  const canAddMore = files.length < MAX_IMAGES;

  const addFiles = useCallback((selected: FileList | File[]) => {
    const arr = Array.from(selected).filter((f) => f.type.startsWith('image/'));
    if (!arr.length) return;
    setPasteError(null);
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

  // 데스크탑 Ctrl+V / Cmd+V — paste zone이 포커스되지 않은 상태에서 처리
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (isAnalyzing || !canAddMore) return;
      if (pasteZoneRef.current?.contains(e.target as Node)) return; // zone이 처리
      const items = Array.from(e.clipboardData?.items ?? []);
      const imageFiles = items
        .filter(
          (item) => item.kind === 'file' && item.type.startsWith('image/'),
        )
        .map((item) => item.getAsFile())
        .filter((f): f is File => f !== null);
      if (imageFiles.length) addFiles(imageFiles);
    };
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [isAnalyzing, canAddMore, addFiles]);

  // paste zone onPaste 핸들러
  const handlePasteZone = useCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setPasteError(null);
      const items = Array.from(e.clipboardData?.items ?? []);
      const imageFiles = items
        .filter(
          (item) => item.kind === 'file' && item.type.startsWith('image/'),
        )
        .map((item) => item.getAsFile())
        .filter((f): f is File => f !== null);
      if (imageFiles.length) {
        addFiles(imageFiles);
        e.currentTarget.innerHTML = '';
      } else {
        setPasteError('클립보드에 이미지가 없어요.');
      }
    },
    [addFiles],
  );

  // 클립보드 API로 직접 읽기 (iOS 16+ / Android Chrome / 데스크탑)
  const handleClipboardRead = useCallback(async () => {
    setPasteError(null);
    if (!navigator.clipboard?.read) {
      setPasteError('이 브라우저는 클립보드 읽기를 지원하지 않아요.');
      return;
    }
    try {
      const clipboardItems = await navigator.clipboard.read();
      const imageFiles: File[] = [];
      for (const item of clipboardItems) {
        const imageType = item.types.find((t) => t.startsWith('image/'));
        if (imageType) {
          const blob = await item.getType(imageType);
          imageFiles.push(
            new File([blob], `paste-${Date.now()}.png`, { type: imageType }),
          );
        }
      }
      if (imageFiles.length) {
        addFiles(imageFiles);
      } else {
        setPasteError('클립보드에 이미지가 없어요.');
      }
    } catch {
      setPasteError(
        '클립보드 접근이 거부되었어요. 브라우저 설정에서 허용해주세요.',
      );
    }
  }, [addFiles]);

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
          여러 장을 함께 올리면 하나의 레시피로 통합 분석해요 (최대 {MAX_IMAGES}
          장)
        </p>
        <p className="mt-1 text-xs text-[var(--foreground-muted)]">
          {ADD_RECIPE_PAGE.AI_DISCLAIMER}
        </p>
      </div>

      {/* 이미지 썸네일 */}
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
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => handleRemove(i)}
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
        </div>
      )}

      {/* 버튼 + 붙여넣기 zone */}
      {canAddMore && !isAnalyzing && (
        <div>
          {/* 버튼 행 */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="flex-1"
              onClick={() => {
                setShowPasteZone((v) => !v);
                setPasteError(null);
              }}
            >
              <ClipboardIcon className="mr-1.5 h-4 w-4" />
              이미지 붙여넣기
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="flex-1"
              onClick={() => inputRef.current?.click()}
            >
              <GalleryIcon className="mr-1.5 h-4 w-4" />
              이미지 선택하기
            </Button>
          </div>

          {/* 붙여넣기 zone — "이미지 붙여넣기" 클릭 시 표시 */}
          {showPasteZone && (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="mt-2 rounded-xl border-2 border-dashed border-[var(--point)]/50 bg-[var(--point-bg)] p-3"
            >
              <div
                ref={pasteZoneRef}
                contentEditable
                suppressContentEditableWarning
                onPaste={handlePasteZone}
                className="min-h-[3rem] cursor-text rounded-lg px-3 py-2 text-sm outline-none empty:before:pointer-events-none empty:before:text-[var(--foreground-muted)] empty:before:content-['여기를_클릭하여_이미지를_붙여넣어요'] focus:ring-2 focus:ring-[var(--point)]/30"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="mt-2 w-full"
                onClick={handleClipboardRead}
              >
                <ClipboardIcon className="mr-1.5 h-4 w-4" />
                클립보드에서 자동으로 가져오기
              </Button>
              {pasteError && (
                <p className="mt-2 text-xs text-red-500">{pasteError}</p>
              )}
            </div>
          )}
        </div>
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

function GalleryIcon({ className }: { className?: string }) {
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

function ClipboardIcon({ className }: { className?: string }) {
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
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
      />
    </svg>
  );
}
