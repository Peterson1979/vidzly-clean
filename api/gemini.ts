// api/gemini.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Missing title or description' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Provide a short, engaging summary for a YouTube video titled "${title}" with description "${description}"`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.status(200).json({ summary: text });
  } catch (error: any) {
    console.error('[Gemini API Error]', error);
    res.status(500).json({ error: 'Gemini API request failed' });
  }
}
