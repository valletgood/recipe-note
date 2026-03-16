import { api, type ApiResponse } from '@/lib/axios';
import type { LoginRequest, LoginResponse, CheckEmailRequest, SignupRequest, SignupResponse } from './types';

export async function login(data: LoginRequest) {
  const response = await api.post<ApiResponse<LoginResponse>>('/api/auth/login', data);
  return response.data;
}

export async function checkEmail(data: CheckEmailRequest) {
  const response = await api.post<ApiResponse<undefined>>('/api/auth/check-email', data);
  return response.data;
}

export async function signup(data: SignupRequest) {
  const response = await api.post<ApiResponse<SignupResponse>>('/api/auth/signup', data);
  return response.data;
}
