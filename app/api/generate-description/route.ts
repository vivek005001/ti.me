import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { images, currentDescription } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const imageParts = images.map((base64Image: string) => {
      try {
        const base64Data = base64Image.split(',')[1];
        return {
          inlineData: {
            data: base64Data,
            mimeType: "image/jpeg"
          }
        };
      } catch (error) {
        console.error('Error processing image:', error);
        throw error;
      }
    });

    const contextPrompt = currentDescription 
      ? `Based on the current description: "${currentDescription}", generate an enhanced single description`
      : "Generate a single cohesive description";

    const prompt = `${contextPrompt} that captures the essence of all these images together. The description should be between 50-100 words, focusing on the core memory and emotional significance. Make it personal and meaningful, as if writing a cherished memory for a time capsule.`;

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const description = response.text();


    return NextResponse.json({ description });
  } catch (error: any) {
    console.error('Detailed error:', {
      message: error.message,
      stack: error.stack,
      details: error
    });
    return NextResponse.json(
      { error: 'Failed to generate description', details: error.message },
      { status: 500 }
    );
  }
} 