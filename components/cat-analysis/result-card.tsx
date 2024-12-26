"use client";

import { Card } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/use-translations";
import type { CatAnalysisResult } from "@/lib/api/volcano-engine";
import { Progress } from "@/components/ui/progress";
import { useLocale } from "@/lib/i18n";

interface ResultCardProps {
  result: CatAnalysisResult;
}

export function ResultCard({ result }: ResultCardProps) {
  const { t } = useI18n();
  const { locale } = useLocale();
  const confidence = Math.round(result.confidence * 100);

  // 获取翻译后的品种名称
  const translationKey = `cats.breeds.${result.breed}` as const;
  // 英文界面显示英文品种名，中文界面显示中文品种名
  const breedName = locale === 'en' ? result.breed : (t(translationKey) === translationKey ? result.breed : t(translationKey));

  // 根据当前语言获取描述文本
  const getDescription = () => {
    if (locale === 'en' && result.description_en) {
      return result.description_en;
    }
    return result.description;
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">
          {t('result.breed')}: {breedName}
        </h3>
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>{t('result.confidence')}</span>
            <span>{confidence}%</span>
          </div>
          <Progress value={confidence} className="h-2" />
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          <h4 className="font-medium text-foreground mb-1">
            {t('result.description')}:
          </h4>
          <p className="whitespace-pre-wrap">{getDescription()}</p>
        </div>
      </div>
    </Card>
  );
}