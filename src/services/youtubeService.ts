
import { YouTubeVideo } from '../types';
import { MOCK_API_DELAY } from '../constants'; 
 // Corrected: Import from generated env.ts

// --- MOCK DATA (Used as fallback or by other services) ---
export const allMockVideos: YouTubeVideo[] = [
  {
    id: 'mock_dQw4w9WgXcQ',
    title: 'Creative Commons Music: Inspiring Background Melody',
    description: 'A beautiful and uplifting royalty-free track perfect for your creative projects. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    thumbnailUrl: 'https://i.ytimg.com/vi/3fGg5ps4N2k/hqdefault.jpg', 
    videoUrl: 'https://www.youtube.com/watch?v=3fGg5ps4N2k',
    channelTitle: 'Melody Makers CC',
    viewCount: '2.1M views',
    publishDate: '3 weeks ago',
  },
  {
    id: 'mock_3JZ_D3ELwOQ',
    title: 'Tech Explained: Quantum Computing Basics',
    description: 'Dive into the fascinating world of quantum computing. This video breaks down complex concepts into easy-to-understand explanations. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    thumbnailUrl: 'https://i.ytimg.com/vi/F22fIKh_McA/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=F22fIKh_McA',
    channelTitle: 'Future Tech Now',
    viewCount: '950K views',
    publishDate: '1 month ago',
  },
  {
    id: 'mock_7NOSdkb0HlU',
    title: 'Travel Vlog: Hidden Gems of Southeast Asia',
    description: 'Join us on an adventure through ancient temples and bustling markets. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    thumbnailUrl: 'https://i.ytimg.com/vi/GaWFR3qN4Qc/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=GaWFR3qN4Qc',
    channelTitle: 'Wanderlust Ventures',
    viewCount: '1.2M views',
    publishDate: '2 days ago',
  },
  {
    id: 'mock_vO_IqF9o6TM',
    title: 'DIY Home Decor Ideas on a Budget',
    description: 'Transform your living space with these creative and affordable DIY projects. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    thumbnailUrl: 'https://i.ytimg.com/vi/kLg0Q3uWVSw/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=kLg0Q3uWVSw',
    channelTitle: 'Crafty Corner',
    viewCount: '500K views',
    publishDate: '5 days ago',
  },
  {
    id: 'mock_Lag9Pj_33hM',
    title: 'Learn to Code: Python for Beginners Crash Course',
    description: 'Get started with Python programming in this comprehensive crash course. Perfect for absolute beginners. No prior experience needed!',
    thumbnailUrl: 'https://i.ytimg.com/vi/rfscVS0vtbw/hqdefault.jpg', 
    videoUrl: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
    channelTitle: 'Code Academy Plus',
    viewCount: '3.5M views',
    publishDate: '2 months ago',
  },
    {
    id: 'mock_ChefAdventures',
    title: 'Mastering Sourdough Bread: A Step-by-Step Guide',
    description: 'Bake the perfect loaf of sourdough bread with this easy-to-follow recipe and techniques. From starter to a golden crust.',
    thumbnailUrl: 'https://i.ytimg.com/vi/sTAiDki7AQA/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=sTAiDki7AQA',
    channelTitle: 'Kitchen Crafts',
    viewCount: '780K views',
    publishDate: '1 week ago',
  },
  {
    id: 'mock_SpaceOdyssey',
    title: 'The Mysteries of Dark Matter: Unveiling the Invisible Universe',
    description: 'Scientists explore the enigma of dark matter and its profound implications for our understanding of the cosmos.',
    thumbnailUrl: 'https://i.ytimg.com/vi/QAa2O_8w4qY/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=QAa2O_8w4qY',
    channelTitle: 'Cosmic Explorers',
    viewCount: '1.9M views',
    publishDate: '4 days ago',
  },
  {
    id: 'mock_IndieMusicSpotlight',
    title: 'Acoustic Sessions: Emerging Indie Artists You Need to Hear',
    description: 'Discover your new favorite indie musicians in this intimate acoustic performance showcase. Raw talent and heartfelt lyrics.',
    thumbnailUrl: 'https://i.ytimg.com/vi/q0hyYWKXF0Q/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=q0hyYWKXF0Q',
    channelTitle: 'IndieVibes',
    viewCount: '320K views',
    publishDate: '6 hours ago',
  }
];

// --- YOUTUBE API CONFIGURATION ---
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';
const PLACEHOLDER_API_KEY_NOT_SET = 'YOUR_YOUTUBE_API_KEY_NOT_SET'; // Matches build.sh placeholder

// --- HELPER FUNCTIONS ---
const formatViewCount = (viewCount: string | undefined): string => {
  if (!viewCount) return 'N/A';
  const num = parseInt(viewCount, 10);
  if (isNaN(num)) return viewCount; 

  if (num >= 1000000000) return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return num.toString();
};

const formatRelativeTime = (isoDateString: string | undefined): string => {
  if (!isoDateString) return 'Unknown date';
  const date = new Date(isoDateString);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const weeks = Math.round(days / 7);
  const months = Math.round(days / 30.44); 
  const years = Math.round(days / 365.25); 

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
  if (weeks < 5) return `${weeks} week${weeks === 1 ? '' : 's'} ago`; 
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`;
  return `${years} year${years === 1 ? '' : 's'} ago`;
};

// --- API CALL WRAPPER ---
async function fetchYouTubeData(endpoint: string, params: Record<string, string>, apiKey: string) {
  const queryParams = new URLSearchParams({ ...params, key: apiKey }).toString();
  const url = `${YOUTUBE_API_BASE_URL}/${endpoint}?${queryParams}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      const errorMessage = errorData?.error?.message || response.statusText;
      console.error(`YouTube API Error (${response.status}) for ${url}: ${errorMessage}`, errorData);
      
      // Specific check for invalid API key
      if (errorMessage.toLowerCase().includes("api key not valid") || 
          errorMessage.toLowerCase().includes("api key invalid") ||
          errorMessage.toLowerCase().includes("apikeyinvalid")) {
        throw new Error(`API key invalid: ${errorMessage}`);
      }
      throw new Error(`API request to ${endpoint} failed with status ${response.status}: ${errorMessage}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching from YouTube API endpoint ${endpoint}:`, error);
    throw error; 
  }
}

// --- MAIN VIDEO FETCHING LOGIC ---
interface FetchVideosParams {
  searchTerm?: string;
  pageToken?: string;
  count?: number; 
}

interface FetchVideosResult {
  videos: YouTubeVideo[];
  nextPageToken?: string;
  hasMore: boolean;
}

const useMockDataForYoutube = (reason: string): FetchVideosResult => {
    console.warn(`YouTube Service: ${reason}. Using mock data.`);
    const mockPageSize = 8; // Default mock page size
    const paginatedMockVideos = allMockVideos.slice(0, mockPageSize);
    return {
        videos: paginatedMockVideos,
        nextPageToken: allMockVideos.length > mockPageSize ? "mockNextPage" : undefined, // Simplistic mock next page
        hasMore: allMockVideos.length > mockPageSize,
    };
}

export const fetchVideos = async ({
  searchTerm = '',
  pageToken,
  count,
}: FetchVideosParams): Promise<FetchVideosResult> => {

  if (!window.YOUTUBE_API_KEY || window.YOUTUBE_API_KEY === PLACEHOLDER_API_KEY_NOT_SET) {
    console.warn(`YouTube API key is not configured or is the placeholder value (current: '${window.YOUTUBE_API_KEY}'). Using mock data for fetchVideos.`);
    
    const mockPageSize = count || (searchTerm ? 12 : 8);
    let sourceVideos = allMockVideos;
    if (searchTerm.trim()) {
      const lowerSearchTerm = searchTerm.trim().toLowerCase();
      sourceVideos = allMockVideos.filter(
        v => v.title.toLowerCase().includes(lowerSearchTerm) || 
             v.description.toLowerCase().includes(lowerSearchTerm) ||
             v.channelTitle.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    const startIndex = pageToken && pageToken !== "mockNextPage" ? parseInt(pageToken, 10) : (pageToken === "mockNextPage" ? mockPageSize : 0);
    const endIndex = startIndex + mockPageSize;
    const paginatedMockVideos = sourceVideos.slice(startIndex, endIndex);
    const nextMockPageIndex = endIndex < sourceVideos.length ? "mockNextPage" : undefined;

    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                videos: paginatedMockVideos,
                nextPageToken: nextMockPageIndex,
                hasMore: nextMockPageIndex !== undefined,
            });
        }, MOCK_API_DELAY / 2 );
    });
  }

  const maxResults = (count || (searchTerm.trim() ? 12 : 8)).toString();

  try {
    let videoDataItems: any[] = [];
    let nextPageTokenApi: string | undefined;

    if (searchTerm.trim()) {
      const searchParams: Record<string, string> = {
        part: 'snippet',
        q: searchTerm.trim(),
        type: 'video',
        videoEmbeddable: 'true',
        maxResults,
      };
      if (pageToken) searchParams.pageToken = pageToken;

      const searchData = await fetchYouTubeData('search', searchParams, window.YOUTUBE_API_KEY); 
      
      const videoIds = searchData.items
        ?.map((item: any) => item.id?.videoId)
        .filter((id: string | undefined): id is string => !!id)
        .join(',');

      if (!videoIds || videoIds.length === 0) {
        return { videos: [], nextPageToken: undefined, hasMore: false };
      }

      const videoDetailsParams = {
        part: 'snippet,contentDetails,statistics',
        id: videoIds,
        maxResults: videoIds.split(',').length.toString(), 
      };
      const videoDetailsData = await fetchYouTubeData('videos', videoDetailsParams, window.YOUTUBE_API_KEY);
      videoDataItems = videoDetailsData.items || [];
      nextPageTokenApi = searchData.nextPageToken;

    } else {
      const popularParams: Record<string, string> = {
        part: 'snippet,contentDetails,statistics',
        chart: 'mostPopular',
        regionCode: 'US', 
        videoCategoryId: '', 
        maxResults,
      };
      if (pageToken) popularParams.pageToken = pageToken;

      const popularData = await fetchYouTubeData('videos', popularParams, window.YOUTUBE_API_KEY);
      videoDataItems = popularData.items || [];
      nextPageTokenApi = popularData.nextPageToken;
    }

    const videos: YouTubeVideo[] = videoDataItems.map((item: any) => ({
      id: item.id?.videoId || item.id, 
      title: item.snippet?.title || 'No title available',
      description: item.snippet?.description || 'No description available',
      thumbnailUrl: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url || '',
      videoUrl: `https://www.youtube.com/watch?v=${item.id?.videoId || item.id}`,
      channelTitle: item.snippet?.channelTitle || 'Unknown Channel',
      viewCount: formatViewCount(item.statistics?.viewCount),
      publishDate: formatRelativeTime(item.snippet?.publishedAt),
    }));

    return {
      videos,
      nextPageToken: nextPageTokenApi,
      hasMore: !!nextPageTokenApi,
    };

  } catch (error) {
    console.error('Failed to fetch videos from YouTube API in fetchVideos:', error);
    // Fallback to mock data on API error, including invalid key
    const mockPageSize = count || (searchTerm ? 12 : 8);
    const mockFallbackVideos = allMockVideos.slice(0, mockPageSize);
    let hasMoreMock = mockFallbackVideos.length < allMockVideos.length && mockFallbackVideos.length > 0;
    
    // Provide a simple mock pagination experience for the fallback
    const mockNextToken = hasMoreMock ? "mockNextPage" : undefined;

    return { videos: mockFallbackVideos, nextPageToken: mockNextToken, hasMore: hasMoreMock };
  }
};