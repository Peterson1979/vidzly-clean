
export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  channelTitle: string;
  viewCount: string; // Could be number for sorting, string for display
  publishDate: string; // e.g., "3 days ago", "2023-10-26"
}

export interface GeminiInsight {
  videoId: string;
  summary?: string;
  keywords?: string[];
  error?: string;
}

export enum SubscriptionTier {
  NONE = 'none',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export interface GroundingChunkWeb {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web?: GroundingChunkWeb;
  // Other types of chunks can be added here if needed
}

export interface FavoriteItem {
  videoId: string;
  favoritedAt: number; // Timestamp of when it was favorited
  categoryId?: string | null; // ID of the category it belongs to, null/undefined if uncategorized
}

export interface FavoriteCategory {
  id: string;
  name: string;
}

export interface NotificationPreferences {
  allEnabled: boolean;
  dailyHotContent: boolean;
  weeklyTopList: boolean;
  inactivityReengagement: boolean;
  humorousSurprising: boolean;
  gamification: boolean; // For badge notifications, etc.
  // New preference for in-app visibility of different notification types
  inAppShowSystem: boolean; // For general app updates, new features
  inAppShowContent: boolean; // For new videos, curated lists
  inAppShowEngagement: boolean; // For streaks, badges
}

export interface SavedItem { // Renamed from WatchLaterItem
  videoId: string;
  addedAt: number; // Timestamp of when it was added
}

// --- Gamification: Badges ---
export enum BadgeId {
  WATCH_10 = 'watch_10',
  FAVORITE_5_DISTINCT_CATEGORIES = 'favorite_5_distinct_categories',
  AI_INSIGHTS_3 = 'ai_insights_3',
  // Add more badge IDs here
}

export interface Badge {
  id: BadgeId;
  name: string;
  description: string;
  iconComponent: React.FC<React.SVGProps<SVGSVGElement> & { className?: string }>; // Function that returns a JSX Element for the icon
  criteriaCount: number;
}

export interface BadgeProgress {
  watchedVideosCount: number;
  aiInsightsUsedCount: number;
  // Note: Favorited distinct categories count is derived on-the-fly from FavoritesContext
}

// --- In-App Notification Center ---
export enum InAppNotificationType {
  GENERIC = 'generic', // General info, system messages
  BADGE_EARNED = 'badge_earned',
  STREAK_UPDATE = 'streak_update',
  NEW_CONTENT_DAILY = 'new_content_daily', // Daily hot content
  NEW_CONTENT_WEEKLY = 'new_content_weekly', // Weekly top list
  INACTIVITY_REMINDER = 'inactivity_reminder',
  HUMOROUS_SURPRISE = 'humorous_surprise',
  GEMINI_CURATED_NEW = 'gemini_curated_new', // For new Gemini curated feeds
  FEATURE_ANNOUNCEMENT = 'feature_announcement'
}

export interface InAppNotification {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  read: boolean;
  type: InAppNotificationType;
  link?: string; // e.g., '/video/videoId', '/achievements', '/discover/feedId'
  iconName?: string; // Key to map to an icon component, e.g., 'CupIcon', 'LightBulbIcon'
  videoId?: string; // Optional: if the notification links directly to a video
}

// --- Gemini Curated Feeds ---
export interface CuratedFeed {
  id: string; // e.g., 'curated_theme_YYYYMMDD_randomHash'
  title: string; // AI-generated theme title, e.g., "Weekend Laughs"
  description: string; // AI-generated short description for the feed
  videoIds: string[]; // Array of YouTubeVideo IDs
  generatedAt: number; // Timestamp of when this feed was generated
  themePrompt?: string; // Optional: the prompt used to generate the theme (for debugging/interest)
}

// --- Watch History ---
export interface ViewHistoryItem {
  videoId: string;
  viewedAt: number; // Timestamp of when it was last viewed
}