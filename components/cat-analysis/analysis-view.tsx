"use client";

import { Card } from "@/components/ui/card";
import { ResultCard } from "./result-card";
import { useI18n } from "@/lib/i18n/use-translations";
import type { CatAnalysisResult } from "@/lib/api/volcano-engine";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface AnalysisViewProps {
  result: CatAnalysisResult;
  onReset: () => void;
  imageUrl: string;
}

export function AnalysisView({ result, onReset, imageUrl }: AnalysisViewProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <img
          src={imageUrl}
          alt="Analyzed cat"
          className="w-full aspect-video object-cover"
        />
      </Card>

      <div className="space-y-4">
        <ResultCard result={result} />
      </div>

      <Button
        onClick={onReset}
        variant="outline"
        className="w-full"
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        {t('result.tryAgain')}
      </Button>
    </div>
  );
}