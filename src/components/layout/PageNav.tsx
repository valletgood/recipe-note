import Link from 'next/link';
import type { ReactNode } from 'react';

interface PageNavProps {
  /** 목록/이전 페이지로 가는 링크 (href 없으면 렌더 안 함) */
  backHref?: string;
  backLabel: string;
  /** 중앙 제목 (선택) */
  title?: string;
  /** 우측에 배치할 버튼 등 (ReactNode) */
  button?: ReactNode;
  /** 컨테이너 최대 너비 (기본 max-w-3xl, 목록과 다를 수 있음) */
  maxWidth?: 'max-w-3xl' | 'max-w-4xl';
}

export default function PageNav({
  backHref,
  backLabel,
  title,
  button,
  maxWidth = 'max-w-3xl',
}: PageNavProps) {
  return (
    <nav
      className="sticky top-0 z-20 bg-[var(--background)]"
      aria-label="페이지 탐색"
    >
      <div
        className={`mx-auto flex min-h-14 items-center justify-between gap-4 px-4 sm:px-6 ${maxWidth}`}
      >
        {backHref ? (
          <Link
            href={backHref}
            className="group flex items-center gap-1.5 text-sm font-medium text-[var(--point)] transition-colors hover:text-[var(--point-light)]"
          >
            <span
              className="transition-transform group-hover:-translate-x-0.5"
              aria-hidden
            >
              ←
            </span>
            <span>{backLabel}</span>
          </Link>
        ) : (
          <span />
        )}

        <div className="min-w-0 flex-1 truncate text-center">
          {title && (
            <span className="font-display text-lg font-semibold text-[var(--foreground)]">
              {title}
            </span>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-end">
          {button ?? <span />}
        </div>
      </div>
    </nav>
  );
}
