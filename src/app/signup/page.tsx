'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RaccoonLoco } from '@/components/character/RaccoonLoco';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { signPasswordToken } from '@/lib/jwt';
import { useCheckEmail, useSignup } from '@/api/auth/hooks';
import { GuestGuard } from '@/components/auth/GuestGuard';

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidPassword(pw: string) {
  if (pw.length < 8 || pw.length > 20) return false;
  const hasLetter = /[a-zA-Z]/.test(pw);
  const hasNumber = /[0-9]/.test(pw);
  const hasSpecial = /[^a-zA-Z0-9]/.test(pw);
  return [hasLetter, hasNumber, hasSpecial].filter(Boolean).length >= 2;
}

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailChecked, setEmailChecked] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const checkEmailMutation = useCheckEmail();
  const signupMutation = useSignup();

  const passwordInvalid = password.length > 0 && !isValidPassword(password);
  const passwordMismatch =
    passwordConfirm.length > 0 && password !== passwordConfirm;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailChecked(false);
    checkEmailMutation.reset();
  };

  const handleCheckEmail = () => {
    checkEmailMutation.mutate(
      { email: email.toLowerCase().trim() },
      {
        onSuccess: (res) => {
          if (res.error === 0) setEmailChecked(true);
        },
      },
    );
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (
      !emailChecked ||
      !isValidPassword(password) ||
      password !== passwordConfirm
    )
      return;
    const passwordToken = signPasswordToken(password);
    signupMutation.mutate(
      { email: email.toLowerCase().trim(), name: name.trim(), passwordToken },
      {
        onSuccess: (res) => {
          if (res.error === 0) router.push('/login');
        },
      },
    );
  };

  const canSubmit =
    email.length > 0 &&
    emailChecked &&
    name.trim().length > 0 &&
    isValidPassword(password) &&
    passwordConfirm.length > 0 &&
    !passwordMismatch &&
    !signupMutation.isPending;

  return (
    <GuestGuard>
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm">
          {/* Hero */}
          <div className="mb-8 flex animate-[staggerFade_0.5s_ease-out_both] flex-col items-center gap-3">
            <div style={{ width: '116px', height: '81px', overflow: 'hidden' }}>
              <div
                style={{ transform: 'scale(0.5)', transformOrigin: 'top left' }}
              >
                <RaccoonLoco />
              </div>
            </div>
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
              {/* 이메일 */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-end gap-2">
                  <div className="min-w-0 flex-1">
                    <Input
                      id="email"
                      label="이메일"
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="hello@example.com"
                      required
                    />
                  </div>
                  <Button
                    variant="secondary"
                    onClick={handleCheckEmail}
                    disabled={!isValidEmail(email)}
                    className="h-full shrink-0 border-[var(--point)] py-3.5 text-[var(--point)]"
                  >
                    중복확인
                  </Button>
                </div>
                {emailChecked && (
                  <p className="text-xs text-[var(--point)]">
                    사용 가능한 이메일이에요.
                  </p>
                )}
                {checkEmailMutation.data &&
                  checkEmailMutation.data.error !== 0 && (
                    <p className="text-xs text-red-500">
                      {checkEmailMutation.data.message}
                    </p>
                  )}
              </div>

              {/* 이름 */}
              <Input
                id="name"
                label="이름"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력해주세요"
                required
              />

              {/* 비밀번호 */}
              <div className="flex flex-col gap-1.5">
                <Input
                  id="password"
                  label="비밀번호"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  error={
                    passwordInvalid
                      ? '숫자, 특수문자, 영어 중 2가지 이상을 조합하여 8~20글자로 입력해주세요.'
                      : undefined
                  }
                />
                {!passwordInvalid && (
                  <p className="text-xs text-[var(--point-muted)]">
                    숫자, 특수문자, 영어 중 2가지 이상을 조합하여 8~20글자로
                    입력해주세요.
                  </p>
                )}
              </div>

              {/* 비밀번호 확인 */}
              <Input
                id="passwordConfirm"
                label="비밀번호 확인"
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="••••••••"
                required
                error={
                  passwordMismatch ? '비밀번호가 일치하지 않아요.' : undefined
                }
              />

              {signupMutation.data && signupMutation.data.error !== 0 && (
                <p className="text-center text-sm text-red-500">
                  {signupMutation.data.message}
                </p>
              )}
              {signupMutation.isError && (
                <p className="text-center text-sm text-red-500">
                  회원가입 중 오류가 발생했습니다. 다시 시도해주세요.
                </p>
              )}

              <Button
                variant="primary"
                disabled={!canSubmit}
                isLoading={signupMutation.isPending}
                className="mt-1 h-12 w-full"
                onCanPlay={handleSubmit}
              >
                회원가입
              </Button>
            </div>
          </div>

          {/* Login link */}
          <p
            className="mt-4 animate-[staggerFade_0.5s_ease-out_both] text-center text-sm text-[var(--point-muted)]"
            style={{ animationDelay: '0.2s' }}
          >
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="font-semibold text-[var(--point)]">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </GuestGuard>
  );
}
