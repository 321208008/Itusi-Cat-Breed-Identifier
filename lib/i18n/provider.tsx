'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useLocale } from './use-locale';
import { translations } from './translations';
import type { TranslationKey } from './types';
import type { Language } from './store';

type I18nContextType = {
  t: (key: TranslationKey) => string;
};

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const { locale } = useLocale();
  const currentTranslations = translations[locale as Language];

  const t = (key: TranslationKey): string => {
    const keys = key.split('.');
    let value: any = currentTranslations;
    
    for (const k of keys) {
      if (value?.[k]) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    return value as string;
  };

  return (
    <I18nContext.Provider value={{ t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
} 