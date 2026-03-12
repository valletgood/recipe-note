"use client";

interface RaccoonMascotProps {
  className?: string;
}

/** Recipe Note 마스코트 - 요리사 너구리 (앞치마·모자) */
export default function RaccoonMascot({ className = "" }: RaccoonMascotProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* 앞치마 */}
      <path
        d="M30 55 L60 48 L90 55 L85 95 L35 95 Z"
        fill="var(--point-pale)"
        stroke="var(--point)"
        strokeWidth="1.5"
      />
      <path
        d="M50 55 L60 52 L70 55 L68 85 L52 85 Z"
        fill="var(--point-bg)"
      />
      {/* 몸 */}
      <ellipse cx="60" cy="72" rx="28" ry="22" fill="#5D4E37" />
      <ellipse cx="60" cy="70" rx="24" ry="18" fill="#6B5B45" />
      {/* 머리 */}
      <circle cx="60" cy="42" r="22" fill="#5D4E37" />
      <circle cx="60" cy="40" r="20" fill="#6B5B45" />
      {/* 눈가 마스크 */}
      <path
        d="M42 38 Q38 42 42 46 Q48 44 50 40 Q46 36 42 38"
        fill="#2D2520"
      />
      <path
        d="M78 38 Q82 42 78 46 Q72 44 70 40 Q74 36 78 38"
        fill="#2D2520"
      />
      <circle cx="46" cy="41" r="2.5" fill="white" />
      <circle cx="74" cy="41" r="2.5" fill="white" />
      {/* 코 */}
      <ellipse cx="60" cy="48" rx="4" ry="3" fill="#2D2520" />
      {/* 요리사 모자 */}
      <ellipse cx="60" cy="28" rx="24" ry="8" fill="white" className="opacity-95" />
      <path
        d="M38 28 L38 20 L60 14 L82 20 L82 28"
        fill="white"
        stroke="var(--point)"
        strokeWidth="1"
      />
      <path d="M60 14 L60 28" stroke="var(--point-light)" strokeWidth="1" />
      {/* 귀 */}
      <ellipse cx="40" cy="28" rx="8" ry="12" fill="#5D4E37" />
      <ellipse cx="80" cy="28" rx="8" ry="12" fill="#5D4E37" />
      <ellipse cx="40" cy="28" rx="5" ry="8" fill="#6B5B45" />
      <ellipse cx="80" cy="28" rx="5" ry="8" fill="#6B5B45" />
      {/* 꼬리 줄무늬 */}
      <path
        d="M88 75 Q98 72 102 80 Q100 88 90 88"
        stroke="#2D2520"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M88 75 Q98 72 102 80 Q100 88 90 88"
        stroke="white"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="4 4"
      />
    </svg>
  );
}
