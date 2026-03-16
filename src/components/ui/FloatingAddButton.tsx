import Link from 'next/link';

interface FloatingAddButtonProps {
  href: string;
  label: string;
}

export default function FloatingAddButton({ href, label }: FloatingAddButtonProps) {
  return (
    // fixed inset-x-0 bottom-6: 하단에만 viewport 너비로 고정
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-30">
      {/* 페이지 콘텐츠와 동일한 max-width 컨테이너 */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* flex justify-end으로 우측 정렬 */}
        <div className="flex justify-end">
          <Link
            href={href}
            className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--point)] text-white shadow-[0_4px_20px_rgba(52,95,83,0.35)] transition-[transform,opacity] hover:opacity-95 active:scale-95"
            aria-label={label}
          >
            <PlusIcon className="h-7 w-7" />
          </Link>
        </div>
      </div>
    </div>
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
