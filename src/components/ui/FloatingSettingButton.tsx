'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from 'stores/authStore';
import { useThemeStore } from 'stores/themeStore';

export default function FloatingSettingButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { themeDarkMode, toggleThemeDarkMode } = useThemeStore();

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    if (!isOpen) return;
    const handle = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [isOpen]);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    router.push('/login');
  };

  return (
    <>
      <div
        ref={menuRef}
        className="pointer-events-none fixed inset-x-0 bottom-6 z-40"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="pointer-events-auto flex flex-col items-start gap-2">
            {/* 메뉴 패널 */}
            {isOpen && (
              <div
                className="w-44 overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg-strong)] py-1.5 shadow-[var(--glass-shadow)] backdrop-blur-md"
                role="menu"
                style={{ animation: 'menuIn 0.15s ease-out' }}
              >
                <MenuItem onClick={toggleThemeDarkMode}>
                  {themeDarkMode ? '화면 밝게' : '화면 어둡게'}
                </MenuItem>
                <div className="mx-3 my-1 border-t border-[var(--glass-border)]" />
                <MenuItem onClick={() => { setIsOpen(false); setShowUserInfo(true); }}>
                  내 정보
                </MenuItem>
                <MenuItem onClick={handleLogout} destructive>
                  로그아웃
                </MenuItem>
              </div>
            )}

            {/* 트리거 버튼 */}
            <button
              type="button"
              onClick={() => setIsOpen((v) => !v)}
              aria-label="설정"
              aria-expanded={isOpen}
              aria-haspopup="menu"
              className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg-strong)] text-[var(--point)] shadow-[var(--glass-shadow)] backdrop-blur-md transition-[transform,opacity] hover:opacity-90 active:scale-95"
            >
              <GearIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* 내 정보 모달 */}
      {showUserInfo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setShowUserInfo(false)}
        >
          <div
            className="w-80 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg-strong)] p-6 shadow-[var(--glass-shadow)]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display mb-4 text-lg font-bold text-[var(--foreground)]">
              내 정보
            </h2>
            <div className="space-y-3">
              <InfoRow label="이름" value={user?.name ?? '-'} />
              <InfoRow label="이메일" value={user?.email ?? '-'} />
            </div>
            <button
              type="button"
              onClick={() => setShowUserInfo(false)}
              className="mt-6 w-full rounded-xl bg-[var(--point)] py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              확인
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes menuIn {
          from { opacity: 0; transform: translateY(6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}

function MenuItem({
  children,
  onClick,
  destructive = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors ${
        destructive
          ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30'
          : 'text-[var(--foreground)] hover:bg-[var(--point-bg)]'
      }`}
    >
      {children}
    </button>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-[var(--point-muted)]">{label}</span>
      <span className="text-sm font-medium text-[var(--foreground)]">{value}</span>
    </div>
  );
}

function GearIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}
