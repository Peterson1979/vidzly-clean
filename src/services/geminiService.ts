import { YouTubeVideo } from '../types';
import { MOCK_API_DELAY } from '../constants';

// --- MOCK DATA ---
const generateMockSummary = (title: string): string => {
  const mockSummaries = [
    `"${title}" offers an exciting journey into an intriguing topic.`,
    `"${title}" features engaging content that's perfect for curious minds.`,
    `"${title}" delivers well-structured and entertaining insights.`,
    `"${title}" is highly recommended for fans of this subject.`,
    `"${title}": A concise yet compelling overview of the theme.`
  ];

  return mockSummaries[Math.floor(Math.random() * mockSummaries.length)];
};

// --- PROXY API CALL ---
interface GeminiSummaryResponse {
  summary: string;
}

/**
 * Fetches a video summary using the local proxy API.
 */
export const getVideoSummary = async (title: string, description: string): Promise<string> => {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description }),
    });

    if (!response.ok) {
      throw new Error('AI summary request failed');
    }

    const data: GeminiSummaryResponse = await response.json();
    return data.summary;

  } catch (error) {
    console.error('[getVideoSummary] Failed to fetch real summary from /api/gemini', error);
    // Fallback to mock data on error
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(generateMockSummary(title));
      }, MOCK_API_DELAY / 2);
    });
  }
};