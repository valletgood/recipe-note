'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Button from '@/components/ui/Button';

interface LightboxProps {
  src: string;
  alt?: string;
  onClose: () => void;
}

export default function Lightbox({
  src,
  alt = '사진',
  onClose,
}: LightboxProps) {
  // 열려있는 동안 body 스크롤 잠금 (모바일 포함)
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return createPortal(
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 99999, backgroundColor: 'rgba(0,0,0,0.85)' }}
      className="flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        style={{ maxHeight: '90dvh', maxWidth: '90dvw' }}
        className="rounded-xl object-contain"
        onClick={(e) => e.stopPropagation()}
      />
      <Button
        type="button"
        onClick={onClose}
        variant="ghost"
        style={{ position: 'fixed', top: '1rem', right: '1rem' }}
        className="!rounded-full !bg-black/60 !p-2 !text-white hover:!bg-black/80"
        aria-label="닫기"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </Button>
    </div>,
    document.body,
  );
}
