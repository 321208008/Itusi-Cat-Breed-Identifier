"use client";

import { useI18nStore, type Language } from './store';

export function useLocale() {
  const { language: locale, setLanguage: setLocale } = useI18nStore();
  return { locale, setLocale } as const;
} 