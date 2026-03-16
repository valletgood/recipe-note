'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RaccoonLogo } from '@/components/character/RaccoonLogo';
import { signPasswordToken } from '@/lib/jwt';
import { useLogin } from '@/api/auth/hooks';
import { useAuthStore } from '@/../stores/authStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { GuestGuard } from '@/components/auth/GuestGuard';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const loginMutation = useLogin();
  const authLogin = useAuthStore((s) => s.login);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email.trim() || !password) return;
    const passwordToken = signPasswordToken(password);
    loginMutation.mutate(
      { email: email.toLowerCase().trim(), passwordToken },
      {
        onSuccess: (res) => {
          if (res.error === 0 && res.data) {
            authLogin(
              {
                email: res.data.email,
                name: res.data.name,
                loginAt: res.data.loginAt,
              },
              res.data.token,
            );
            router.push('/');
          }
        },
      },
    );
  };

  return (
    <GuestGuard>
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm">
          {/* Hero */}
          <div className="mb-8 flex animate-[staggerFade_0.5s_ease-out_both] flex-col items-center gap-3">
            <RaccoonLogo size="md" />
            <div className="text-center">
              <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--foreground)]">
                Recipe Note
              </h1>
              <p className="mt-1 text-sm text-[var(--point-muted)]">
                구리와 함께 레시피를 기록해요
              </p>
            </div>
          </div>

          {/* Form card */}
          <div
            className="glass-strong animate-[staggerFade_0.5s_ease-out_both] rounded-2xl p-6"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="flex flex-col gap-4">
              <Input
                id="email"
                type="email"
                label="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@example.com"
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className="py-3 text-sm"
              />

              <Input
                id="password"
                type="password"
                label="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className="py-3 text-sm"
              />

              {loginMutation.data && loginMutation.data.error !== 0 && (
                <p className="text-center text-sm text-red-500">
                  {loginMutation.data.message}
                </p>
              )}
              {loginMutation.isError && (
                <p className="text-center text-sm text-red-500">
                  로그인 중 오류가 발생했습니다. 다시 시도해주세요.
                </p>
              )}

              <Button
                variant="primary"
                disabled={!email || !password || loginMutation.isPending}
                className="mt-1 h-12 w-full"
                onClick={handleSubmit}
              >
                {loginMutation.isPending ? '로그인 중...' : '로그인'}
              </Button>
            </div>
          </div>

          {/* Signup link */}
          <p
            className="mt-4 animate-[staggerFade_0.5s_ease-out_both] text-center text-sm text-[var(--point-muted)]"
            style={{ animationDelay: '0.2s' }}
          >
            계정이 없으신가요?{' '}
            <Link href="/signup" className="font-semibold text-[var(--point)]">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </GuestGuard>
  );
}
