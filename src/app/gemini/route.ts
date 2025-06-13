import { GoogleGenerativeAI } from '@google/generative-ai';
import type { NextRequest } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  const { title, description } = await request.json();

  if (!title || !description) {
    return Response.json({ error: 'Missing video title or description' }, { status: 400 });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Provide a concise summary for "${title}" with description: "${description}".`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    return Response.json({ summary: text });
  } catch (error) {
    console.error('[Gemini API Error]', error);
    return Response.json(
      { summary: `Mock summary for "${title}" due to error.` },
      { status: 500 }
    );
  }
}