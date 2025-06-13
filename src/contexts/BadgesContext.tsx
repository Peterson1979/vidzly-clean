
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { BadgeId, Badge, BadgeProgress, FavoriteItem, InAppNotificationType } from '../types';
import { BADGES_STORAGE_KEY, BADGE_PROGRESS_STORAGE_KEY, ALL_BADGES } from '../constants';
import { addInAppNotificationToStore } from '../services/notificationService'; // Import the function

interface BadgesContextType {
  earnedBadges: BadgeId[];
  progress: BadgeProgress;
  recordVideoWatch: () => void;
  recordAiInsightUsage: () => void;
  checkFavoriteBadges: (currentFavorites: FavoriteItem[]) => void;
  isBadgeEarned: (badgeId: BadgeId) => boolean;
  getBadgeDetails: (badgeId: BadgeId) => Badge | undefined;
  getAllBadgeDetails: () => Badge[];
}

const BadgesContext = createContext<BadgesContextType | undefined>(undefined);

const defaultProgress: BadgeProgress = {
  watchedVideosCount: 0,
  aiInsightsUsedCount: 0,
};

export const BadgesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [earnedBadges, setEarnedBadges] = useState<BadgeId[]>(() => {
    try {
      const storedBadges = localStorage.getItem(BADGES_STORAGE_KEY);
      return storedBadges ? JSON.parse(storedBadges) : [];
    } catch (error) {
      console.error("Error reading earned badges from localStorage", error);
      return [];
    }
  });

  const [progress, setProgress] = useState<BadgeProgress>(() => {
    try {
      const storedProgress = localStorage.getItem(BADGE_PROGRESS_STORAGE_KEY);
      return storedProgress ? JSON.parse(storedProgress) : defaultProgress;
    } catch (error) {
      console.error("Error reading badge progress from localStorage", error);
      return defaultProgress;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(BADGES_STORAGE_KEY, JSON.stringify(earnedBadges));
    } catch (error) {
      console.error("Error saving earned badges to localStorage", error);
    }
  }, [earnedBadges]);

  useEffect(() => {
    try {
      localStorage.setItem(BADGE_PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error("Error saving badge progress to localStorage", error);
    }
  }, [progress]);


  const checkAndAwardBadges = useCallback((currentFavoritesForCheck: FavoriteItem[] = []) => {
    setEarnedBadges(prevEarned => {
      let newBadgesAwarded = false;
      const updatedEarnedBadges = [...prevEarned];

      ALL_BADGES.forEach(badge => {
        if (updatedEarnedBadges.includes(badge.id)) return; 

        let criteriaMet = false;
        switch (badge.id) {
          case BadgeId.WATCH_10:
            if (progress.watchedVideosCount >= badge.criteriaCount) criteriaMet = true;
            break;
          case BadgeId.AI_INSIGHTS_3:
            if (progress.aiInsightsUsedCount >= badge.criteriaCount) criteriaMet = true;
            break;
          case BadgeId.FAVORITE_5_DISTINCT_CATEGORIES:
            const distinctCategories = new Set(
              currentFavoritesForCheck
                .map(fav => fav.categoryId)
                .filter(catId => catId !== null && catId !== undefined) 
            );
            if (distinctCategories.size >= badge.criteriaCount) criteriaMet = true;
            break;
        }

        if (criteriaMet) {
          updatedEarnedBadges.push(badge.id);
          newBadgesAwarded = true;
          
          // Send in-app notification for newly earned badge
          addInAppNotificationToStore(
            `Badge Unlocked: ${badge.name}!`,
            badge.description,
            InAppNotificationType.BADGE_EARNED,
            '/achievements' // Link to achievements view
          );
          console.log(`Badge earned: ${badge.name} - In-app notification sent.`);
        }
      });
      
      return newBadgesAwarded ? updatedEarnedBadges : prevEarned;
    });
  }, [progress]); 


  const recordVideoWatch = useCallback(() => {
    setProgress(prev => ({ ...prev, watchedVideosCount: prev.watchedVideosCount + 1 }));
  }, []);

  const recordAiInsightUsage = useCallback(() => {
    setProgress(prev => ({ ...prev, aiInsightsUsedCount: prev.aiInsightsUsedCount + 1 }));
  }, []);

  const checkFavoriteBadges = useCallback((currentFavorites: FavoriteItem[]) => {
    checkAndAwardBadges(currentFavorites);
  }, [checkAndAwardBadges]);
  
  useEffect(() => {
    checkAndAwardBadges(); // Check non-favorite badges on progress change
  }, [progress, checkAndAwardBadges]);


  const isBadgeEarned = useCallback((badgeId: BadgeId) => {
    return earnedBadges.includes(badgeId);
  }, [earnedBadges]);

  const getBadgeDetails = useCallback((badgeId: BadgeId) => {
    return ALL_BADGES.find(b => b.id === badgeId);
  }, []);

  const getAllBadgeDetails = useCallback(() => {
    return ALL_BADGES;
  }, []);

  const contextValue = useMemo(() => ({
    earnedBadges,
    progress,
    recordVideoWatch,
    recordAiInsightUsage,
    checkFavoriteBadges,
    isBadgeEarned,
    getBadgeDetails,
    getAllBadgeDetails,
  }), [earnedBadges, progress, recordVideoWatch, recordAiInsightUsage, checkFavoriteBadges, isBadgeEarned, getBadgeDetails, getAllBadgeDetails]);

  return (
    <BadgesContext.Provider value={contextValue}>
      {children}
    </BadgesContext.Provider>
  );
};

export const useBadges = (): BadgesContextType => {
  const context = useContext(BadgesContext);
  if (!context) {
    throw new Error('useBadges must be used within a BadgesProvider');
  }
  return context;
};