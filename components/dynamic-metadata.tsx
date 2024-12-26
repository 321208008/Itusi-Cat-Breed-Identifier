'use client';

import { useEffect } from 'react';
import { useLocale } from '@/lib/i18n';

const titles = {
  zh: '猫咪品种识别',
  en: 'Cat Breed Identifier'
} as const;

const descriptions = {
  zh: '使用 AI 技术识别猫咪品种',
  en: 'Identify cat breeds using AI-powered image recognition'
} as const;

export function DynamicMetadata() {
  const { locale } = useLocale();

  useEffect(() => {
    // 更新标题
    document.title = titles[locale];
    
    // 更新描述
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', descriptions[locale]);
    }
  }, [locale]);

  return null;
} 