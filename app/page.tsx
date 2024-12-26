"use client";

import { useState, useCallback } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useI18n } from '@/lib/i18n';
import { analyzeCatImage } from '@/lib/api/volcano-engine';
import { AnalysisView } from '@/components/cat-analysis/analysis-view';
import { toast } from 'sonner';
import type { CatAnalysisResult } from '@/lib/api/volcano-engine';

// 图片配置
const MAX_SIZE = 800; // 最大尺寸为 800px
const JPEG_QUALITY = 0.9; // JPEG 质量 90%

// 压缩图片
const compressImage = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // 计算新的尺寸
      let { width, height } = img;
      const aspectRatio = width / height;

      if (width > height && width > MAX_SIZE) {
        width = MAX_SIZE;
        height = Math.round(width / aspectRatio);
      } else if (height > MAX_SIZE) {
        height = MAX_SIZE;
        width = Math.round(height * aspectRatio);
      }

      // 创建画布
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // 使用高质量的图像平滑
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // 绘制图像
      ctx.drawImage(img, 0, 0, width, height);

      // 转换为 JPEG 格式
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to compress image'));
            return;
          }
          resolve(new File([blob], file.name, { type: 'image/jpeg' }));
        },
        'image/jpeg',
        JPEG_QUALITY
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

export default function Home() {
  const { t } = useI18n();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<CatAnalysisResult | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleAnalysis = async (imageData: string | File) => {
    try {
      setIsAnalyzing(true);

      // 如果是文件，先压缩
      let processedImageData = imageData;
      if (imageData instanceof File) {
        try {
          processedImageData = await compressImage(imageData);
        } catch (error) {
          console.warn('Image compression failed, using original image:', error);
        }
      }

      const analysisResult = await analyzeCatImage(processedImageData);
      setResult(analysisResult);
      setImageUrl(typeof processedImageData === 'string' ? processedImageData : URL.createObjectURL(processedImageData));
    } catch (error: any) {
      if (error.message && typeof error.message === 'string') {
        const errorKey = error.message as keyof typeof t;
        toast.error(t(`error.${errorKey}`), {
          description: error.details || t('error.tryAgainLater'),
        });
      } else {
        toast.error(t('error.analysis'), {
          description: t('error.tryAgainLater'),
        });
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error(t('error.invalidImageFormat'), {
          description: t('error.selectImageFile'),
        });
        return;
      }
      await handleAnalysis(file);
    }
  };

  const handleReset = () => {
    setResult(null);
    setImageUrl(null);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error(t('error.invalidImageFormat'), {
          description: t('error.selectImageFile'),
        });
        return;
      }
      await handleAnalysis(file);
    }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 pt-24 pb-12 flex-1">
        <Card className="max-w-2xl mx-auto p-6">
          <h1 className="text-3xl font-bold text-center mb-2">
            {t('home.title')}
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            {t('home.subtitle')}
          </p>

          {result && imageUrl ? (
            <AnalysisView
              result={result}
              imageUrl={imageUrl}
              onReset={handleReset}
            />
          ) : (
            <div className="space-y-4">
              <div
                className={`aspect-video relative rounded-lg overflow-hidden bg-muted transition-colors duration-200 ${
                  isDragging ? 'bg-primary/10 border-2 border-dashed border-primary' : ''
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <p className="text-muted-foreground text-center">
                    {isAnalyzing ? t('home.loading') : (
                      isDragging ? t('home.dropHere') : t('home.subtitle')
                    )}
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  size="lg"
                  className="w-full sm:w-auto min-w-[200px]"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  disabled={isAnalyzing}
                >
                  <Upload className="mr-2 h-5 w-5" />
                  {t('home.uploadButton')}
                </Button>
              </div>
            </div>
          )}

          <input
            id="file-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </Card>
      </div>

      <Footer />
    </main>
  );
}