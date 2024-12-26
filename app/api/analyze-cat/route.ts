import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// 禁用静态生成
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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
});

export async function POST(request: Request) {
  try {
    // 1. 获取并验证图片数据
    let formData;
    try {
      formData = await request.formData();
    } catch (error) {
      console.error('Failed to parse form data:', error);
      return NextResponse.json(
        { error: 'invalidRequest' },
        { status: 400 }
      );
    }

    const imageData = formData.get('image');
    if (!imageData) {
      return NextResponse.json(
        { error: 'noImageData' },
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
          { error: 'invalidImageFormat' },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error('Failed to process image:', error);
      return NextResponse.json(
        { error: 'imageProcessing' },
        { status: 500 }
      );
    }

    // 3. 调用 AI API 获取中文描述
    let chineseResponse;
    try {
      const modelId = process.env.ARK_MODEL_ID as string;
      chineseResponse = await openai.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: '这是什么品种的猫？请详细描述这只猫的特征，并给出品种名称和可信度。可信度要根据图片质量、特征明显程度等实际情况给出，范围在30%-95%之间。请按以下格式回答：品种：xx猫，可信度：xx%，特征描述：xxx' },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ],
        model: modelId,
      });

      // 获取英文描述
      const englishResponse = await openai.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: 'What breed is this cat? Please describe its features in detail and provide the breed name and confidence level. The confidence should be based on image quality and feature clarity, ranging from 30% to 95%. Please answer in the following format: Breed: XX Cat, Confidence: XX%, Features: XXX' },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ],
        model: modelId,
      });

      const chineseResult = chineseResponse.choices[0]?.message?.content;
      const englishResult = englishResponse.choices[0]?.message?.content;

      if (!chineseResult) {
        return NextResponse.json(
          { error: 'noAnalysisResult' },
          { status: 500 }
        );
      }

      // 4. 解析结果
      try {
        // 解析中文AI返回的文本，提取品种和可信度信息
        let breed = '未知品种';
        let confidence = 0;
        let description = chineseResult;
        let description_en = englishResult || '';

        // 尝试从中文文本中提取品种信息
        const breedMatch = chineseResult.match(/品种[是为：:]\s*([^，。,\s]+)/);
        if (breedMatch) {
          breed = breedMatch[1].replace(/猫$/, '');  // 移除"猫"字后缀
        }

        // 从英文结果中提取品种名称（如果可用）
        const englishBreedMatch = englishResult?.match(/Breed[:\s]+([^,\n]+)/i);
        if (englishBreedMatch) {
          breed = englishBreedMatch[1].replace(/\s+Cat$/i, '');  // 移除"Cat"后缀
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
          { error: 'resultParsing' },
          { status: 500 }
        );
      }
    } catch (error) {
      console.error('AI API error:', error);
      return NextResponse.json(
        { error: 'aiService' },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'unknown' },
      { status: 500 }
    );
  }
}