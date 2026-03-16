'use client';

import { useState, useEffect } from 'react';
import { RaccoonCooking } from '@/components/character/RaccoonCooking';
import { RaccoonFruits } from '@/components/character/RaccoonFruits';

interface AnalyzingOverlayProps {
  visible: boolean;
}

export default function AnalyzingOverlay({ visible }: AnalyzingOverlayProps) {
  const [showCooking, setShowCooking] = useState(true);

  useEffect(() => {
    if (!visible) return;
    setShowCooking(true);
    const interval = setInterval(() => {
      setShowCooking((v) => !v);
    }, 2500);
    return () => clearInterval(interval);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-5">
        <div className="relative h-[120px] w-[160px]">
          <div
            className={`absolute inset-0 transition-opacity duration-500 ${
              showCooking ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <RaccoonCooking fill />
          </div>
          <div
            className={`absolute inset-0 transition-opacity duration-500 ${
              showCooking ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <RaccoonFruits fill />
          </div>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <div className="relative h-6">
            <p
              className={`absolute left-1/2 -translate-x-1/2 text-base font-semibold whitespace-nowrap text-white transition-opacity duration-500 ${
                showCooking ? 'opacity-100' : 'opacity-0'
              }`}
            >
              구리가 조리 단계를 분석하고 있어요
            </p>
            <p
              className={`absolute left-1/2 -translate-x-1/2 text-base font-semibold whitespace-nowrap text-white transition-opacity duration-500 ${
                showCooking ? 'opacity-0' : 'opacity-100'
              }`}
            >
              구리가 재료를 분석하고 있어요
            </p>
          </div>
          <p className="text-sm text-white/70">잠시만 기다려주세요</p>
        </div>
      </div>
    </div>
  );
}
