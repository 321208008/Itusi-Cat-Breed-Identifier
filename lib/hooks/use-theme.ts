"use client";

import { useTheme as useNextTheme } from 'next-themes';

export function useTheme() {
  const { theme, setTheme } = useNextTheme();
  const isDark = theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return { isDark, toggleTheme };
}