import axios from "axios";

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response) {
      return Promise.resolve(error.response);
    }
    return Promise.reject(error);
  }
);
