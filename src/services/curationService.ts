// src/services/curationService.ts

import { YouTubeVideo } from '../types';
import { MOCK_API_DELAY } from '../constants';

// --- MOCK DATA ---
const generateMockTheme = (existingThemes: string[] = []): string => {
  const MOCK_THEMES = [
    "Mind-Bending Science Docs", "Viral Comedy Gold", "Epic Gaming Moments",
    "Future Tech Insights", "Travel Vlogs Uncharted", "DIY Home Projects",
    "Learn to Code Fast", "Space Exploration Wonders", "Hidden Culinary Gems",
    "Indie Music Discoveries"
  ];

  const availableThemes = MOCK_THEMES.filter(t => !existingThemes.includes(t));
  if (availableThemes.length === 0) return MOCK_THEMES[Math.floor(Math.random() * MOCK_THEMES.length)];
  return availableThemes[Math.floor(Math.random() * availableThemes.length)];
};

const generateMockVideosForTheme = (theme: string, videos: YouTubeVideo[], count: number = 5): { videoIds: string[], description: string } => {
  const shuffled = [...videos].sort(() => 0.5 - Math.random());
  const selectedVideos = shuffled.slice(0, count);
  return {
    videoIds: selectedVideos.map(v => v.id),
    description: `A mock curated list of amazing videos about "${theme}". Dive in and explore these hand-picked (mocked) selections perfect for your viewing pleasure.`,
  };
};

// --- PROXY API CALL ---
interface CuratedFeedResponse {
  title: string;
  description: string;
  videoIds: string[];
}

/**
 * Lekéri a legfrissebb curation feed-et a proxy API-n keresztül.
 */
export async function getLatestCuratedFeed(): Promise<CuratedFeed | null> {
  // Előző feed betöltése localStorage-ból
  const CURATED_FEEDS_STORAGE_KEY = 'vidzly_curated_feeds';
  let storedFeeds: CuratedFeed[] = [];

  try {
    const rawStoredFeeds = localStorage.getItem(CURATED_FEEDS_STORAGE_KEY);
    if (rawStoredFeeds) {
      storedFeeds = JSON.parse(rawStoredFeeds);
    }
  } catch (e) {
    console.error("Curation Service: Failed to read cached feeds from localStorage", e);
  }

  // Ha van friss cache, azt használjuk
  const latestFeed = storedFeeds.length > 0 ? storedFeeds[0] : null;
  const CURATED_FEED_STALE_HOURS = 12;

  if (latestFeed && Date.now() - latestFeed.generatedAt < CURATED_FEED_STALE_HOURS * 60 * 60 * 1000) {
    console.log("Curation Service: Using cached curated feed.");
    return latestFeed;
  }

  // Proxy API hívás
  try {
    const response = await fetch('/api/curated-feed');
    if (!response.ok) throw new Error('API request failed');

    const data: CuratedFeedResponse = await response.json();

    // Új feed generálása
    const newFeed = {
      id: `curated_${Date.now()}`,
      title: data.title,
      description: data.description,
      videoIds: data.videoIds,
      generatedAt: Date.now(),
      themePrompt: `Generated theme: ${data.title}`
    };

    // Mentés localStorage-ba
    const updatedFeedsList = [newFeed, ...storedFeeds].slice(0, 5);
    localStorage.setItem(CURATED_FEEDS_STORAGE_KEY, JSON.stringify(updatedFeedsList));

    return newFeed;

  } catch (error) {
    console.warn("Curation Service: Failed to fetch real curated feed. Using mock instead.");
    const mockTheme = generateMockTheme(storedFeeds.map(f => f.title));
    const mockSelection = generateMockVideosForTheme(mockTheme, allMockVideos, 5);

    const mockFeed = {
      id: `mock_curated_${Date.now()}`,
      title: mockTheme,
      description: mockSelection.description,
      videoIds: mockSelection.videoIds,
      generatedAt: Date.now(),
      themePrompt: `Mock theme generated: ${mockTheme}`
    };

    const updatedFeeds = [mockFeed, ...storedFeeds.filter(f => f.id.startsWith("mock_"))].slice(0, 5);
    localStorage.setItem(CURATED_FEEDS_STORAGE_KEY, JSON.stringify(updatedFeeds));

    return mockFeed;
  }
}