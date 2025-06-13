
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
 // Corrected: Import from generated env.ts
import { GEMINI_MODEL_TEXT, MOCK_API_DELAY } from '../constants';

let ai: GoogleGenAI | null = null;
const PLACEHOLDER_GEMINI_API_KEY_NOT_SET = 'YOUR_GEMINI_API_KEY_NOT_SET'; // Matches build.sh placeholder

if (window.API_KEY && window.API_KEY !== PLACEHOLDER_GEMINI_API_KEY_NOT_SET) {
  try {
    ai = new GoogleGenAI({ apiKey: window.API_KEY });
    console.log("Gemini Service: GoogleGenAI initialized with provided window.API_KEY.");
  } catch (e) {
    console.error("Gemini Service: Failed to initialize GoogleGenAI, likely due to API key issue during construction:", e);
    // ai remains null, and subsequent calls will use mock data or handle the error
  }
} else {
  console.warn(`Gemini Service: window.API_KEY is placeholder ('${PLACEHOLDER_GEMINI_API_KEY_NOT_SET}') or not set. Gemini features will use mock data.`);
}

export const getVideoSummary = async (title: string, description: string): Promise<string> => {
  if (!ai) {
    const reason = window.API_KEY === PLACEHOLDER_GEMINI_API_KEY_NOT_SET 
                   ? `window.API_KEY is placeholder ('${PLACEHOLDER_GEMINI_API_KEY_NOT_SET}')`
                   : "GoogleGenAI client not initialized (API key might be missing or invalid)";
    console.warn(`Gemini Service: ${reason}. Using mock summary for "${title}".`);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`This is a mock AI summary for "${title}". Key points: This video seems to be about ${description.substring(0,50)}... It likely offers engaging content, potentially high production value, and a clear message. Viewers often find this type of video informative and entertaining.`);
      }, MOCK_API_DELAY / 2);
    });
  }

  try {
    const prompt = `Provide a concise, engaging summary (2-3 sentences, max 150 characters) for a YouTube video titled "${title}" with description: "${description}". Highlight its key appeal or what a viewer can expect.`;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: GEMINI_MODEL_TEXT,
        contents: prompt,
    });

    let summaryText = response.text;
    
    // Remove markdown fences if present
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = summaryText.match(fenceRegex);
    if (match && match[2]) {
      summaryText = match[2].trim();
    }

    return summaryText.trim();

  } catch (error) {
    console.error(`Gemini Service: Error fetching summary from Gemini for "${title}":`, error);
    // Fallback to mock data or error string if the API call fails
    if (error instanceof Error && 
        (error.message.toLowerCase().includes("api key not valid") || 
         error.message.toLowerCase().includes("api key is invalid") ||
         error.message.toLowerCase().includes("provide an api key") ||
         error.message.toLowerCase().includes("api_key_invalid"))) { // More comprehensive check
         const userMessage = `Could not generate AI summary: The Gemini API Key is invalid or missing. Please ensure it's correctly set in your Vercel project environment variables. (Using mock data as fallback)`;
         console.error("Gemini Service: " + userMessage);
         return new Promise((resolve) => { // Return mock on API key error
            setTimeout(() => {
              resolve(`Mock summary due to API Key issue: Video "${title}" appears to be about its description's start. Interesting content awaits!`);
            }, MOCK_API_DELAY / 3);
          });
    }
    // Generic fallback for other errors
    const genericErrorMessage = `Could not generate AI summary for "${title}" at this time. (Using mock data as fallback)`;
    console.warn("Gemini Service: " + genericErrorMessage);
    return new Promise((resolve) => { // Return mock on other errors
        setTimeout(() => {
          resolve(`Mock summary due to error: Video "${title}" looks promising. Check it out!`);
        }, MOCK_API_DELAY / 3);
    });
  }
};