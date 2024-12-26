export interface CatAnalysisResult {
  breed: string;
  confidence: number;
  description: string;
  description_en?: string;
}

export async function analyzeCatImage(imageData: string | File): Promise<CatAnalysisResult> {
  try {
    // 1. 准备表单数据
    const formData = new FormData();
    
    try {
      if (typeof imageData === 'string') {
        // 如果是 base64 或 URL，直接使用
        formData.append('image', imageData);
      } else {
        formData.append('image', imageData);
      }
    } catch (error) {
      console.error('Error processing image:', error);
      throw new Error('upload');
    }

    // 2. 发送分析请求
    const response = await fetch('/api/analyze-cat', {
      method: 'POST',
      body: formData,
    });

    // 3. 处理响应
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'unknown');
    }

    return data;

  } catch (error) {
    console.error('Error analyzing cat image:', error);
    throw error instanceof Error ? error : new Error('unknown');
  }
}