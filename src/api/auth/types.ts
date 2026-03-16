export interface LoginRequest {
  email: string;
  passwordToken: string;
}

export interface LoginResponse {
  email: string;
  name: string;
  loginAt: string;
}

export interface CheckEmailRequest {
  email: string;
}

export interface SignupRequest {
  email: string;
  name: string;
  passwordToken: string;
}

export interface SignupResponse {
  uuid: string;
  email: string;
  name: string;
}
