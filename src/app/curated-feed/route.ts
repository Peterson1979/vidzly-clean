import { GoogleGenerativeAI } from '@google/generative-ai';
import type { NextRequest } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function GET(request: NextRequest) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
Generate a short, catchy theme name (max 5 words) for a YouTube playlist.
Examples: "Mind-Bending Science Docs", "Viral Comedy Gold"
Only return the theme name.`;

    const result = await model.generateContent(prompt);
    const theme = result.response.text().trim();

    // Itt lehetne valódi videók lekérése is
    const videoIds = ['videoId1', 'videoId2', 'videoId3', 'videoId4', 'videoId5'];

    return Response.json({
      title: theme,
      description: `A handpicked collection of videos on "${theme}"`,
      videoIds,
    });
  } catch (error) {
    console.error('[Curated Feed Error]', error);
    return Response.json(
      {
        title: 'Trending Today',
        description: 'Popular videos based on general trends.',
        videoIds: ['mock1', 'mock2'],
      },
      { status: 500 }
    );
  }
}