
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
 // Corrected: Import from generated env.ts
import { YouTubeVideo, FavoriteItem } from '../types';
import { 
    GEMINI_MODEL_TEXT, 
    MOCK_API_DELAY
} from '../constants'; 

let ai: GoogleGenAI | null = null;
const PLACEHOLDER_GEMINI_API_KEY_NOT_SET = 'YOUR_GEMINI_API_KEY_NOT_SET'; // Matches build.sh placeholder

if (window.API_KEY && window.API_KEY !== PLACEHOLDER_GEMINI_API_KEY_NOT_SET) {
  try {
    ai = new GoogleGenAI({ apiKey: window.API_KEY });
    console.log("Personalization Service: GoogleGenAI initialized with provided window.API_KEY.");
  } catch (e) {
    console.error("Personalization Service: Failed to initialize GoogleGenAI, likely due to API key issue:", e);
  }
} else {
  console.warn(`Personalization Service: window.API_KEY is placeholder ('${PLACEHOLDER_GEMINI_API_KEY_NOT_SET}') or not set. Personalization features will use mock data.`);
}

interface PersonalizedFeedResponse {
    recommendedVideoIds: string[];
}

const generateMockRecommendations = (favoriteItems: FavoriteItem[], allVideos: YouTubeVideo[], count: number = 5): YouTubeVideo[] => {
    console.warn("Personalization Service: Generating mock recommendations.");
    const favoriteVideoIds = new Set(favoriteItems.map(fav => fav.videoId));
    const nonFavoritedVideos = allVideos.filter(video => !favoriteVideoIds.has(video.id));
    
    let recommendations: YouTubeVideo[] = [];
    if (nonFavoritedVideos.length > 0) {
        const shuffledNonFavorites = [...nonFavoritedVideos].sort(() => 0.5 - Math.random());
        recommendations = shuffledNonFavorites.slice(0, count);
    }
    
    // If not enough non-favorites, fill with any other videos not already recommended
    if (recommendations.length < count) {
        const currentRecommendationIds = new Set(recommendations.map(r => r.id));
        const availableForAll = allVideos.filter(video => !currentRecommendationIds.has(video.id) && !favoriteVideoIds.has(video.id));
        const shuffledAll = [...availableForAll].sort(() => 0.5 - Math.random());
        recommendations.push(...shuffledAll.slice(0, count - recommendations.length));
    }
    
    // Final fallback if still not enough (e.g., if allVideos is small)
    if (recommendations.length < count && allVideos.length > 0) {
        const currentRecIds = new Set(recommendations.map(r => r.id));
        const fallbackCandidates = allVideos.filter(v => !currentRecIds.has(v.id)); // Allow re-picking from favorites if absolutely necessary and nothing else available
        const shuffledFallback = [...fallbackCandidates].sort(() => 0.5 - Math.random());
        recommendations.push(...shuffledFallback.slice(0, count - recommendations.length));
    }

    return recommendations.slice(0, count);
};

export const getPersonalizedFeed = async (favoriteItems: FavoriteItem[], allVideos: YouTubeVideo[]): Promise<YouTubeVideo[]> => {
    if (!ai || favoriteItems.length === 0) {
        let reasonMessage = "";
        if (!ai) {
            reasonMessage = window.API_KEY === PLACEHOLDER_GEMINI_API_KEY_NOT_SET
                ? `window.API_KEY is placeholder ('${PLACEHOLDER_GEMINI_API_KEY_NOT_SET}')`
                : "GoogleGenAI client not initialized (API key might be missing or invalid)";
        } else { // This means ai is initialized, but favoriteItems.length === 0
            reasonMessage = "No favorite items to personalize";
        }
        console.warn(`Personalization Service: ${reasonMessage}. Using mock recommendations.`);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(generateMockRecommendations(favoriteItems, allVideos, 8)); // Default to 8 mock recommendations
            }, MOCK_API_DELAY / 2);
        });
    }

    const favoriteVideoDetails = favoriteItems
        .map(fav => allVideos.find(v => v.id === fav.videoId))
        .filter(Boolean) as YouTubeVideo[];

    if (favoriteVideoDetails.length === 0 && favoriteItems.length > 0) {
        console.warn("Personalization Service: Favorite items exist, but no matching video details found in allVideos. Using mock recommendations.");
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(generateMockRecommendations(favoriteItems, allVideos, 8));
            }, MOCK_API_DELAY / 2);
        });
    }
    
    const promptFavoriteVideos = favoriteVideoDetails.slice(0, 10).map(v => ({ // Limit for prompt size
        id: v.id,
        title: v.title,
        description: v.description.substring(0, 100) + "..."
    }));

    const promptAllVideos = allVideos.slice(0, 50).map(v => ({ // Limit for prompt size
        id: v.id,
        title: v.title,
        description: v.description.substring(0, 80) + "..."
    }));

    const desiredRecommendationCount = Math.min(Math.max(1, allVideos.length - favoriteItems.length), 8);
    
    if (desiredRecommendationCount <= 0 && allVideos.length > 0) {
         console.warn("Personalization Service: No new videos to recommend from the current pool (all might be favorited or pool too small). Using mock or empty.");
         return new Promise((resolve) => {
            setTimeout(() => {
                const nonFavorited = allVideos.filter(v => !favoriteItems.some(f => f.videoId === v.id));
                if (nonFavorited.length > 0) {
                     // Use generateMockRecommendations to pick a few from non-favorited if any
                    resolve(generateMockRecommendations([], nonFavorited, Math.min(3, nonFavorited.length) ));
                } else {
                    resolve([]); // Return empty if truly nothing new to suggest
                }
            }, MOCK_API_DELAY / 2);
        });
    }


    try {
        const prompt = `Based on these favorited videos, recommend ${desiredRecommendationCount} other video IDs from the provided "Available video pool" that the user might also like.
The user has favorited:
${JSON.stringify(promptFavoriteVideos)}

Here is the list of all available videos (some of which might be already favorited). Do NOT recommend videos already in the user's favorites list shown above.
Available video pool (ID, title, short description):
${JSON.stringify(promptAllVideos)}

Provide your response strictly as a JSON object with one key:
"recommendedVideoIds": An array of ${desiredRecommendationCount} recommended, distinct video string IDs (e.g., ["videoId1", "videoId2"]). These IDs MUST exist in the "Available video pool" and MUST NOT be in the "user has favorited" list.
Ensure your JSON is valid.
`;

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: GEMINI_MODEL_TEXT,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        let jsonStr = response.text.trim();
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
          jsonStr = match[2].trim();
        }

        const parsedData = JSON.parse(jsonStr) as PersonalizedFeedResponse;

        if (!parsedData.recommendedVideoIds || !Array.isArray(parsedData.recommendedVideoIds)) {
            console.error("Personalization Service: Gemini returned invalid JSON structure for recommendations. Falling back to mock.", parsedData);
            return generateMockRecommendations(favoriteItems, allVideos, 8);
        }

        const favoriteVideoIdsSet = new Set(favoriteItems.map(f => f.videoId));
        
        const finalRecommendations = parsedData.recommendedVideoIds
            .map(id => allVideos.find(video => video.id === id)) 
            .filter(Boolean) 
            .filter(video => !favoriteVideoIdsSet.has(video!.id)) 
            .slice(0, desiredRecommendationCount) as YouTubeVideo[]; 


        if (finalRecommendations.length === 0 && parsedData.recommendedVideoIds.length > 0) {
             console.warn("Personalization Service: Gemini recommended only favorited videos, invalid IDs, or none fitting criteria. Falling back to mock.");
             return generateMockRecommendations(favoriteItems, allVideos, 8);
        }
        
        return finalRecommendations;

    } catch (error) {
        console.error("Personalization Service: Error getting personalized feed from Gemini or parsing JSON:", error);
        let isApiKeyError = false;
        if (error instanceof Error) {
            const lowerMsg = error.message.toLowerCase();
            if (lowerMsg.includes("api key not valid") || lowerMsg.includes("api key is invalid") || lowerMsg.includes("provide an api key") || lowerMsg.includes("api_key_invalid")) {
                isApiKeyError = true;
            }
        }
        if (isApiKeyError) {
            console.error("Personalization Service: API Key is invalid during personalized feed generation. Using mock recommendations.");
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(generateMockRecommendations(favoriteItems, allVideos, 8));
            }, MOCK_API_DELAY / 2);
        });
    }
};
