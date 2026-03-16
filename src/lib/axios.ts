import axios from "axios";
import { getToken } from "@/lib/auth";

export interface ApiResponse<T> {
  error: number;
  message: string;
  data?: T;
}

export const api = axios.create({
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response) {
      return Promise.resolve(error.response);
    }
    return Promise.reject(error);
  }
);
