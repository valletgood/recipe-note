'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Lightbox from '@/components/ui/Lightbox';

interface ImageGalleryProps {
  images: string[];
  alt?: string;
}

export default function ImageGallery({ images, alt = '레시피 사진' }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToIndex = useCallback((index: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const item = container.children[index] as HTMLElement;
    if (item) {
      container.scrollTo({ left: item.offsetLeft, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const itemWidth = container.offsetWidth;
      const index = Math.round(container.scrollLeft / itemWidth);
      setActiveIndex(index);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  if (!images.length) return null;

  return (
    <>
    <div className="relative w-full overflow-hidden rounded-2xl">
      {/* 스크롤 컨테이너 */}
      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {images.map((url, i) => (
          <div key={url} className="relative w-full shrink-0 snap-center">
            <button
              type="button"
              className="relative block aspect-[4/3] w-full"
              onClick={() => setLightboxSrc(url)}
            >
              <Image
                src={url}
                alt={`${alt} ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
                priority={i === 0}
              />
            </button>
          </div>
        ))}
      </div>

      {/* 이미지 개수 표시 (여러 장인 경우) */}
      {images.length > 1 && (
        <>
          {/* 닷 인디케이터 */}
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollToIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === activeIndex
                    ? 'w-4 bg-white'
                    : 'w-1.5 bg-white/60'
                }`}
                aria-label={`${i + 1}번째 사진`}
              />
            ))}
          </div>

          {/* 장 수 뱃지 */}
          <div className="absolute top-3 right-3 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white">
            {activeIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>

    {lightboxSrc && (
      <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
    )}
    </>
  );
}
