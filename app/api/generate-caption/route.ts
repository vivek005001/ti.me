import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { images } = await req.json();
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // Convert all images to the format Gemini expects
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

    const prompt = "Generate a single creative and engaging caption that describes all these images together, suitable for a time capsule memory. Keep it concise but meaningful.";

    // Send all images in a single request
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const caption = response.text();


    return NextResponse.json({ caption });
  } catch (error: any) {
    console.error('Detailed error:', {
      message: error.message,
      stack: error.stack,
      details: error
    });
    return NextResponse.json(
      { error: 'Failed to generate caption', details: error.message },
      { status: 500 }
    );
  }
} 