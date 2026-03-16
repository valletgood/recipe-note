import { create } from "zustand";
import { persist } from "zustand/middleware";
import { setToken, removeToken } from "@/lib/auth";

export interface AuthUser {
  email: string;
  name: string;
  loginAt: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
  updateUser: (user: AuthUser) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,

      login: (user: AuthUser, token: string) => {
        setToken(token);
        set({ isAuthenticated: true, user, token });
      },

      logout: () => {
        removeToken();
        set({ isAuthenticated: false, user: null, token: null });
      },

      updateUser: (user: AuthUser) => {
        set((state) => (state.isAuthenticated ? { user } : state));
      },
    }),
    {
      name: "auth-storage",
      partialize: (state: AuthState) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.token !== null,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          state.isAuthenticated = true;
        }
      },
    }
  )
);
