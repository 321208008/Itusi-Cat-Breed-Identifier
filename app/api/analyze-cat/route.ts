import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// 禁用静态生成
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// 设置较长的超时时间
export const maxDuration = 30; // 设置为30秒

// 检查环境变量
if (!process.env.ARK_API_KEY) {
  throw new Error('ARK_API_KEY environment variable is not set');
}

if (!process.env.ARK_MODEL_ID) {
  throw new Error('ARK_MODEL_ID environment variable is not set');
}

// 初始化 OpenAI 客户端
const openai = new OpenAI({
  apiKey: process.env.ARK_API_KEY || '',
  baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
  timeout: 25000, // 25秒超时
  maxRetries: 2, // 最多重试2次
});

// 创建 AI 分析请求
const createAnalysisRequest = (imageUrl: string, isEnglish = false) => {
  return openai.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: isEnglish
              ? 'What breed is this cat? Please describe its features in detail and provide the breed name and confidence level. The confidence should be based on image quality and feature clarity, ranging from 30% to 95%. Please answer in the following format: Breed: XX Cat, Confidence: XX%, Features: XXX'
              : '这是什么品种的猫？请详细描述这只猫的特征，并给出品种名称和可信度。可信度要根据图片质量、特征明显程度等实际情况给出，范围在30%-95%之间。请按以下格式回答：品种：xx猫，可信度：xx%，特征描述：xxx',
          },
          {
            type: 'image_url',
            image_url: { url: imageUrl },
          },
        ],
      },
    ],
    model: process.env.ARK_MODEL_ID as string,
  });
};

export async function POST(request: Request) {
  try {
    // 1. 获取并验证图片数据
    let formData;
    try {
      formData = await request.formData();
    } catch (error) {
      console.error('Failed to parse form data:', error);
      return NextResponse.json(
        { error: 'invalidRequest', message: '请求格式无效' },
        { status: 400 }
      );
    }

    const imageData = formData.get('image');
    if (!imageData) {
      return NextResponse.json(
        { error: 'noImageData', message: '未找到图片数据' },
        { status: 400 }
      );
    }

    // 2. 处理图片数据
    let imageUrl: string;
    try {
      if (typeof imageData === 'string') {
        imageUrl = imageData;
      } else if (imageData instanceof File) {
        const bytes = await imageData.arrayBuffer();
        const base64 = Buffer.from(bytes).toString('base64');
        imageUrl = `data:${imageData.type};base64,${base64}`;
      } else {
        return NextResponse.json(
          { error: 'invalidImageFormat', message: '图片格式无效' },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error('Failed to process image:', error);
      return NextResponse.json(
        { error: 'imageProcessing', message: '图片处理失败' },
        { status: 500 }
      );
    }

    // 3. 并行调用 AI API 获取中英文描述
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);

      try {
        // 并行发起中英文请求
        const [chineseResponse, englishResponse] = await Promise.all([
          createAnalysisRequest(imageUrl),
          createAnalysisRequest(imageUrl, true),
        ].map(p => p.catch(e => ({ error: e }))));

        // 检查是否有错误发生
        if ('error' in chineseResponse) {
          throw chineseResponse.error;
        }

        const chineseResult = chineseResponse.choices[0]?.message?.content;
        const englishResult = 'error' in englishResponse 
          ? undefined 
          : englishResponse.choices[0]?.message?.content;

        if (!chineseResult) {
          return NextResponse.json(
            { error: 'noAnalysisResult', message: '未获取到分析结果' },
            { status: 500 }
          );
        }

        // 4. 解析结果
        try {
          let breed = '未知品种';
          let confidence = 0;
          let description = chineseResult;
          let description_en = englishResult || '';

          // 尝试从中文文本中提取品种信息
          const breedMatch = chineseResult.match(/品种[是为：:]\s*([^，。,\s]+)/);
          if (breedMatch) {
            breed = breedMatch[1].replace(/猫$/, '');
          }

          // 从英文结果中提取品种名称（如果可用）
          if (englishResult) {
            const englishBreedMatch = englishResult.match(/Breed[:\s]+([^,\n]+)/i);
            if (englishBreedMatch) {
              breed = englishBreedMatch[1].replace(/\s+Cat$/i, '');
            }
          }

          // 尝试从文本中提取可信度信息
          const confidenceMatch = chineseResult.match(/可信度[为是：:]\s*(\d+(?:\.\d+)?)[%％]/);
          if (confidenceMatch) {
            confidence = parseFloat(confidenceMatch[1]) / 100;
          }

          return NextResponse.json({
            breed,
            confidence,
            description,
            description_en,
          });
        } catch (error) {
          console.error('Failed to parse AI response:', error);
          return NextResponse.json(
            { error: 'resultParsing', message: '结果解析失败' },
            { status: 500 }
          );
        }
      } finally {
        clearTimeout(timeout);
      }
    } catch (error: any) {
      console.error('AI API error:', error);
      
      if (error.name === 'AbortError' || error.code === 'ETIMEDOUT') {
        return NextResponse.json(
          { error: 'timeout', message: 'AI 服务响应超时，请重试' },
          { status: 504 }
        );
      }
      
      return NextResponse.json(
        { error: 'aiService', message: 'AI 服务暂时不可用，请稍后重试' },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'unknown', message: '发生未知错误，请重试' },
      { status: 500 }
    );
  }
}