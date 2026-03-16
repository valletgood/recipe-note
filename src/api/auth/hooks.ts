import { useMutation } from '@tanstack/react-query';
import { login, checkEmail, signup } from './service';

export function useLogin() {
  return useMutation({
    mutationFn: login,
  });
}

export function useCheckEmail() {
  return useMutation({
    mutationFn: checkEmail,
  });
}

export function useSignup() {
  return useMutation({
    mutationFn: signup,
  });
}
