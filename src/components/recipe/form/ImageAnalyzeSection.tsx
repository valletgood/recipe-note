'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { RaccoonLogo } from '@/components/character/RaccoonLogo';

interface ImageAnalyzeSectionProps {
  onAnalyze: (file: File) => void;
  isAnalyzing: boolean;
  errorMessage?: string | null;
}

export default function ImageAnalyzeSection({
  onAnalyze,
  isAnalyzing,
  errorMessage,
}: ImageAnalyzeSectionProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((selected: File) => {
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreview(url);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0];
      if (selected) handleFile(selected);
    },
    [handleFile],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const dropped = e.dataTransfer.files[0];
      if (dropped && dropped.type.startsWith('image/')) handleFile(dropped);
    },
    [handleFile],
  );

  const handleAnalyze = useCallback(() => {
    if (file) onAnalyze(file);
  }, [file, onAnalyze]);

  const handleReset = useCallback(() => {
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
  }, []);

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
      </div>

      {/* 드롭존 / 미리보기 */}
      {preview ? (
        <div className="relative overflow-hidden rounded-xl border border-[var(--glass-border)]">
          <Image
            src={preview}
            alt="선택된 이미지"
            width={800}
            height={400}
            className="max-h-60 w-full bg-[var(--point-bg)] object-contain"
          />
          {!isAnalyzing && (
            <button
              type="button"
              onClick={handleReset}
              className="absolute top-2 right-2 rounded-full bg-black/50 p-1 text-white transition-colors hover:bg-black/70"
              aria-label="이미지 제거"
            >
              <XIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : (
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
          <span className="text-xs">JPG, PNG, WebP · 최대 10MB</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleChange}
        disabled={isAnalyzing}
      />

      {/* 분석 버튼 */}
      <Button
        type="button"
        size="lg"
        className="mt-3 w-full"
        disabled={!file || isAnalyzing}
        isLoading={isAnalyzing}
        onClick={handleAnalyze}
      >
        {isAnalyzing ? '분석 중...' : '이미지로 레시피 분석'}
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
