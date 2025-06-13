import { YouTubeVideo } from '../types';
import { MOCK_API_DELAY } from '../constants';

// --- MOCK DATA ---
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
  // ... többi mock videó ...
];

// --- API CONFIG ---
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';
const PLACEHOLDER_API_KEY_NOT_SET = 'YOUR_YOUTUBE_API_KEY_NOT_SET';

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
  if (weeks < 5) return `${weeks} week${weeks === 1 ? '' : 's'} ago';
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`;
  return `${years} year${years === 1 ? '' : 's'} ago`;
};

// --- API WRAPPER ---
async function fetchYouTubeData(endpoint: string, params: Record<string, string>, apiKey: string) {
  const queryParams = new URLSearchParams({ ...params, key: apiKey }).toString();
  const url = `${YOUTUBE_API_BASE_URL}/${endpoint}?${queryParams}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      const errorMessage = errorData?.error?.message || response.statusText;
      console.error(`YouTube API Error (${response.status}) for ${url}: ${errorMessage}`, errorData);
      
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

// --- TYPES ---
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

// --- MOCK FALLBACK ---
const useMockDataForYoutube = (reason: string): FetchVideosResult => {
  console.warn(`YouTube Service: ${reason}. Using mock data.`);
  const mockPageSize = 8;
  const paginatedMockVideos = allMockVideos.slice(0, mockPageSize);
  return {
    videos: paginatedMockVideos,
    nextPageToken: allMockVideos.length > mockPageSize ? "mockNextPage" : undefined,
    hasMore: allMockVideos.length > mockPageSize,
  };
};

// --- MAIN API FUNCTION ---
export const fetchVideos = async ({
  searchTerm = '',
  pageToken,
  count,
}: FetchVideosParams): Promise<FetchVideosResult> => {
  // Check if using mock data
  if (!window.YOUTUBE_API_KEY || window.YOUTUBE_API_KEY === PLACEHOLDER_API_KEY_NOT_SET) {
    return new Promise(resolve => {
      setTimeout(() => {
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

        resolve({
          videos: paginatedMockVideos,
          nextPageToken: nextMockPageIndex,
          hasMore: nextMockPageIndex !== undefined,
        });
      }, MOCK_API_DELAY / 2);
    });
  }

  // Real API call
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
    console.error('Failed to fetch videos from YouTube API:', error);
    return useMockDataForYoutube('YouTube API error');
  }
};