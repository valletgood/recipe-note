import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  /** 테마 다크 모드 여부 */
  themeDarkMode: boolean;
  toggleThemeDarkMode: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      themeDarkMode: false,
      toggleThemeDarkMode: () =>
        set((state) => ({ themeDarkMode: !state.themeDarkMode })),
    }),
    { name: 'theme-storage' },
  ),
);
