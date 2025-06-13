
import { YouTubeVideo, NotificationPreferences, InAppNotificationType, InAppNotification } from '../types';
import { 
    NOTIFICATION_PREFERENCES_KEY, 
    LAST_ACTIVE_STORAGE_KEY, 
    STREAK_STORAGE_KEY, 
    APP_NAME,
    INACTIVITY_THRESHOLD_DAYS,
    LAST_NOTIFICATION_TIME_KEY,
    NOTIFICATION_COOLDOWN_MS,
    LAST_WEEKLY_NOTIFICATION_TIME_KEY,
    LAST_HUMOROUS_NOTIFICATION_TIME_KEY,
    HUMOROUS_NOTIFICATION_INTERVAL_MS,
    DEFAULT_LOGO_SVG_STRING,
    IN_APP_NOTIFICATIONS_STORAGE_KEY,
    MAX_IN_APP_NOTIFICATIONS,
    NEW_IN_APP_NOTIFICATION_EVENT,
    DEFAULT_NOTIFICATION_PREFERENCES
} from '../constants';
import * as Icons from '../components/Icons'; // Import all icons

// Function to create data URL from SVG string
const createSvgDataUrl = (svgString: string): string => {
  if (typeof btoa === 'function') {
    const cleanedSvgString = svgString
      .replace(/\n/g, "") 
      .replace(/>\s+</g, "><") 
      .replace(/"/g, "'"); 
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(cleanedSvgString)))}`;
  }
  console.warn("btoa not available or SVG string issue for creating SVG data URL for notifications. Using fallback.");
  return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='white'/%3E%3Cg fill='%23F97316'%3E%3Cpath d='M30 25 C30 20 35 18 40 20 L75 40 C80 42 80 48 75 50 L40 70 C35 72 30 70 30 65 Z' /%3E%3Cpath d='M20 70 Q20 85 35 85 L40 85 Q25 85 25 70 Z' /%3E%3C/g%3E%3C/svg%3E";
};

const APP_LOGO_DATA_URL = createSvgDataUrl(DEFAULT_LOGO_SVG_STRING);

// --- Preference Management ---
export const getNotificationPreferences = (): NotificationPreferences => {
  try {
    const storedPrefs = localStorage.getItem(NOTIFICATION_PREFERENCES_KEY);
    if (storedPrefs) {
        const parsed = JSON.parse(storedPrefs);
        // Merge with defaults to ensure all keys are present if old prefs are loaded
        return { ...DEFAULT_NOTIFICATION_PREFERENCES, ...parsed };
    }
    return DEFAULT_NOTIFICATION_PREFERENCES;
  } catch (e) {
    console.error("Error reading notification preferences:", e);
    return DEFAULT_NOTIFICATION_PREFERENCES;
  }
};

export const saveNotificationPreferences = (prefs: NotificationPreferences): void => {
  try {
    localStorage.setItem(NOTIFICATION_PREFERENCES_KEY, JSON.stringify(prefs));
  } catch (e) {
    console.error("Error saving notification preferences:", e);
  }
};

// --- Helper Functions for Browser Push Notifications ---
const canSendBrowserNotification = (): boolean => {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') {
    return false;
  }
  const prefs = getNotificationPreferences();
  if (!prefs.allEnabled) { // This 'allEnabled' now primarily refers to browser push notifications
    return false;
  }
  
  const lastNotificationTime = parseInt(localStorage.getItem(LAST_NOTIFICATION_TIME_KEY) || '0');
  if (Date.now() - lastNotificationTime < NOTIFICATION_COOLDOWN_MS) {
    return false; 
  }
  return true;
};

const displayBrowserNotification = (title: string, options?: NotificationOptions): void => {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
  
  const notification = new Notification(title, {
    body: options?.body,
    icon: APP_LOGO_DATA_URL, 
    ...options,
  });
  notification.onclick = () => {
    window.focus(); 
  };
  localStorage.setItem(LAST_NOTIFICATION_TIME_KEY, Date.now().toString());
};

// --- Helper Functions for In-App Notifications ---
const getIconNameForType = (type: InAppNotificationType): string => {
    switch (type) {
        case InAppNotificationType.BADGE_EARNED: return 'CupIcon';
        case InAppNotificationType.GEMINI_CURATED_NEW: return 'LightBulbIcon';
        case InAppNotificationType.NEW_CONTENT_DAILY:
        case InAppNotificationType.NEW_CONTENT_WEEKLY: return 'TvIcon';
        case InAppNotificationType.STREAK_UPDATE: return 'SparklesIcon'; // Or a specific streak icon
        case InAppNotificationType.INACTIVITY_REMINDER: return 'ClockIcon';
        case InAppNotificationType.HUMOROUS_SURPRISE: return 'SparklesIcon'; // Or a gift icon
        case InAppNotificationType.FEATURE_ANNOUNCEMENT: return 'InformationCircleIcon';
        case InAppNotificationType.GENERIC:
        default: return 'NotificationBellIcon'; // Or InformationCircleIcon
    }
};

export const addInAppNotificationToStore = (
    title: string, 
    body: string, 
    type: InAppNotificationType, 
    link?: string,
    videoId?: string
): void => {
    try {
        const storedNotifications = localStorage.getItem(IN_APP_NOTIFICATIONS_STORAGE_KEY);
        let notifications: InAppNotification[] = storedNotifications ? JSON.parse(storedNotifications) : [];

        const newNotification: InAppNotification = {
            id: `inapp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title,
            body,
            timestamp: Date.now(),
            read: false,
            type,
            link,
            iconName: getIconNameForType(type),
            videoId,
        };

        notifications = [newNotification, ...notifications]; // Add to the beginning

        if (notifications.length > MAX_IN_APP_NOTIFICATIONS) {
            notifications = notifications.slice(0, MAX_IN_APP_NOTIFICATIONS); // Trim old ones
        }

        localStorage.setItem(IN_APP_NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
        
        // Dispatch custom event to notify UI components (like NotificationCenterContext)
        window.dispatchEvent(new CustomEvent(NEW_IN_APP_NOTIFICATION_EVENT));

    } catch (error) {
        console.error("Error adding in-app notification to store:", error);
    }
};


const getRandomVideo = (videos: YouTubeVideo[]): YouTubeVideo | null => {
  if (!videos || videos.length === 0) return null;
  return videos[Math.floor(Math.random() * videos.length)];
};

const getTopVideo = (videos: YouTubeVideo[]): YouTubeVideo | null => {
    if (!videos || videos.length === 0) return null;
    return videos.sort((a, b) => {
        const viewsA = parseFloat(a.viewCount) * (a.viewCount.includes('M') ? 1000000 : a.viewCount.includes('K') ? 1000 : 1);
        const viewsB = parseFloat(b.viewCount) * (b.viewCount.includes('M') ? 1000000 : b.viewCount.includes('K') ? 1000 : 1);
        return viewsB - viewsA;
    })[0];
}

const isSameDay = (ts1: number, ts2: number): boolean => {
  const d1 = new Date(ts1);
  const d2 = new Date(ts2);
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};


// --- Core Notification Logic ---

export const initializeNotifications = async (): Promise<void> => {
  if (typeof Notification === 'undefined') {
    console.warn('Browser Notifications API not supported.');
    return;
  }
  if (Notification.permission === 'default') {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Browser Notification permission granted.');
        // Optionally send a welcome browser notification
        displayBrowserNotification(`${APP_NAME}: Browser Notifications Enabled!`, {
          body: "You can manage these in settings.",
        });
        // And/Or an in-app notification
        addInAppNotificationToStore(
            "Browser Notifications Enabled",
            "You've allowed browser notifications. You can manage these and other alerts in settings.",
            InAppNotificationType.GENERIC
        );
      } else {
        console.log('Browser Notification permission denied.');
         addInAppNotificationToStore(
            "Browser Notifications Not Enabled",
            "You can enable browser notifications via your browser settings if you change your mind.",
            InAppNotificationType.GENERIC
        );
      }
    } catch (error) {
      console.error('Error requesting browser notification permission:', error);
    }
  }
  // Log initial in-app notification preferences for debugging
  // console.log("Initial In-App Notification Preferences:", getNotificationPreferences());
};

export const recordUserActivity = (): void => {
  localStorage.setItem(LAST_ACTIVE_STORAGE_KEY, Date.now().toString());
};

interface StreakData {
  count: number;
  lastUpdated: number;
}

export const updateStreakAndNotify = (allVideos: YouTubeVideo[]): void => {
  const prefs = getNotificationPreferences();
  // This function now primarily manages in-app notifications for streaks.
  // Browser push notifications for streaks depend on `prefs.allEnabled && prefs.gamification`.

  const now = Date.now();
  const rawStreakData = localStorage.getItem(STREAK_STORAGE_KEY);
  let streak: StreakData = rawStreakData ? JSON.parse(rawStreakData) : { count: 0, lastUpdated: 0 };
  const lastActive = parseInt(localStorage.getItem(LAST_ACTIVE_STORAGE_KEY) || '0');

  if (!isSameDay(streak.lastUpdated, now)) {
    if (isSameDay(lastActive, now - (24 * 60 * 60 * 1000)) || (streak.count === 0 && isSameDay(lastActive, now))) {
      streak.count++;
      streak.lastUpdated = now;
      localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(streak));

      const title = streak.count === 1 ? "🎉 Daily Streak Started!" : `🏆 Streak: ${streak.count} Days!`;
      const body = streak.count === 1 ? "You've started your daily video watching streak! Keep it up!" : `Amazing! You're on a ${streak.count}-day streak.`;
      
      addInAppNotificationToStore(title, body, InAppNotificationType.STREAK_UPDATE, '/achievements');

      if (prefs.allEnabled && prefs.gamification && canSendBrowserNotification()) {
         if (streak.count === 1 || (streak.count % 3 === 0 && streak.count > 0)) {
            displayBrowserNotification(title, { body });
        }
      }
    } else if (now - streak.lastUpdated > (2 * 24 * 60 * 60 * 1000)) {
      if (streak.count > 0) {
        addInAppNotificationToStore("😟 Streak Broken", "Your viewing streak was broken. Start a new one today!", InAppNotificationType.STREAK_UPDATE, '/achievements');
        if (prefs.allEnabled && prefs.gamification && canSendBrowserNotification()){
          displayBrowserNotification("Streak Broken 😟", { body: "Your viewing streak was broken. Start a new one today!" });
        }
      }
      streak = { count: 0, lastUpdated: 0 };
      localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(streak));
    }
  }
};

export const checkAndSendScheduledNotifications = (allVideos: YouTubeVideo[]): void => {
  const prefs = getNotificationPreferences();
  // Daily Hot Content
  if (prefs.dailyHotContent) {
    const lastDailyPush = parseInt(localStorage.getItem(LAST_NOTIFICATION_TIME_KEY + '_daily_push') || '0');
    if (Date.now() - lastDailyPush > (23 * 60 * 60 * 1000)) { 
        const video = getTopVideo(allVideos) || getRandomVideo(allVideos);
        if (video) {
            const title = "🔥 Vidzly Daily Hot Video";
            const body = `Don't miss today's top pick: ${video.title}!`;
            addInAppNotificationToStore(title, body, InAppNotificationType.NEW_CONTENT_DAILY, `/`, video.id);
            if (prefs.allEnabled && canSendBrowserNotification()) {
                displayBrowserNotification(title, { body });
                localStorage.setItem(LAST_NOTIFICATION_TIME_KEY + '_daily_push', Date.now().toString());
            }
        }
    }
  }

  // Weekly Top List
  if (prefs.weeklyTopList) {
    const lastWeeklyPush = parseInt(localStorage.getItem(LAST_WEEKLY_NOTIFICATION_TIME_KEY + '_push') || '0');
    if (Date.now() - lastWeeklyPush > (6.5 * 24 * 60 * 60 * 1000)) { 
      const topVideo = getTopVideo(allVideos);
      if (topVideo) {
        const title = "⭐ Vidzly Weekly Roundup";
        const body = `This week's star: ${topVideo.title} with ${topVideo.viewCount} views. Catch up now!`;
        addInAppNotificationToStore(title, body, InAppNotificationType.NEW_CONTENT_WEEKLY, `/`, topVideo.id);
        if (prefs.allEnabled && canSendBrowserNotification()) {
            displayBrowserNotification(title, { body });
            localStorage.setItem(LAST_WEEKLY_NOTIFICATION_TIME_KEY + '_push', Date.now().toString());
        }
      }
    }
  }
};

export const checkAndSendInactivityNotification = (allVideos: YouTubeVideo[]): void => {
  const prefs = getNotificationPreferences();
  if (!prefs.inactivityReengagement) return;

  const lastActive = parseInt(localStorage.getItem(LAST_ACTIVE_STORAGE_KEY) || '0');
  const daysSinceLastActive = (Date.now() - lastActive) / (1000 * 60 * 60 * 24);

  if (daysSinceLastActive >= INACTIVITY_THRESHOLD_DAYS) {
    const lastInactivityPush = parseInt(localStorage.getItem(LAST_NOTIFICATION_TIME_KEY + '_inactivity_push') || '0');
    if (Date.now() - lastInactivityPush > (INACTIVITY_THRESHOLD_DAYS * 24 * 60 * 60 * 1000 * 0.9)) { // Ensure not too frequent
        const video = getRandomVideo(allVideos);
        const title = "👋 We Miss You on Vidzly!";
        const body = video ? `Come back and check out videos like "${video.title}"!` : "Discover what's new!";
        addInAppNotificationToStore(title, body, InAppNotificationType.INACTIVITY_REMINDER, `/`, video?.id);
        if (prefs.allEnabled && canSendBrowserNotification()) {
            displayBrowserNotification(title, { body });
        }
        localStorage.setItem(LAST_NOTIFICATION_TIME_KEY + '_inactivity_push', Date.now().toString());
    }
  }
};

export const checkAndSendHumorousNotification = (allVideos: YouTubeVideo[]): void => {
    const prefs = getNotificationPreferences();
    if (!prefs.humorousSurprising) return;

    const lastHumorousPush = parseInt(localStorage.getItem(LAST_HUMOROUS_NOTIFICATION_TIME_KEY + '_push') || '0');
    if (Date.now() - lastHumorousPush > HUMOROUS_NOTIFICATION_INTERVAL_MS) { 
        const video = getRandomVideo(allVideos);
        const title = "Vidzly Surprise! 😂";
        const body = video ? `You won't believe what's in this video: ${video.title}` : "Time for a laugh break!";
        addInAppNotificationToStore(title, body, InAppNotificationType.HUMOROUS_SURPRISE, `/`, video?.id);
        if (prefs.allEnabled && canSendBrowserNotification()) {
            displayBrowserNotification(title, { body });
        }
        localStorage.setItem(LAST_HUMOROUS_NOTIFICATION_TIME_KEY + '_push', Date.now().toString());
    }
};

// Example: Function to announce a new feature (call this manually or on app update)
export const announceNewFeature = (featureTitle: string, featureBody: string, link?: string) => {
    addInAppNotificationToStore(
        `✨ New Feature: ${featureTitle}`,
        featureBody,
        InAppNotificationType.FEATURE_ANNOUNCEMENT,
        link || '/settings' // Default link to settings or a specific feature page
    );
    // Optionally, also send a browser notification if it's a major feature
    // if (getNotificationPreferences().allEnabled && canSendBrowserNotification()) {
    //     displayBrowserNotification(`Vidzly Update: ${featureTitle}`, { body: featureBody });
    // }
};