"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'en' | 'zh';

// 获取浏览器语言
function getBrowserLanguage(): Language {
  if (typeof window === 'undefined') return 'zh';

  const browserLang = navigator.language.toLowerCase();
  
  // 检查完整匹配 (例如 'zh-cn', 'en-us')
  if (browserLang.startsWith('zh')) {
    return 'zh';
  }
  
  return 'en';
}

interface I18nStore {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useI18nStore = create<I18nStore>()(
  persist(
    (set) => ({
      language: getBrowserLanguage(),
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: 'language-storage',
    }
  )
);