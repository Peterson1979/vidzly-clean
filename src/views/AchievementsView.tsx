
import React from 'react';
import { useBadges } from '../contexts/BadgesContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { BadgeCard } from '../components/BadgeCard';
import { BadgeId, FavoriteItem } from '../types';
import { TrophyAwardIcon } from '../components/Icons'; // Changed CupIcon to TrophyAwardIcon

export const AchievementsView: React.FC = () => {
  const { getAllBadgeDetails, isBadgeEarned, progress } = useBadges();
  const { favorites } = useFavorites(); // For category-based badge progress

  const allBadges = getAllBadgeDetails();

  const getProgressForBadge = (badgeId: BadgeId, currentProgress: typeof progress, currentFavorites: FavoriteItem[]): number | undefined => {
    switch (badgeId) {
      case BadgeId.WATCH_10:
        return currentProgress.watchedVideosCount;
      case BadgeId.AI_INSIGHTS_3:
        return currentProgress.aiInsightsUsedCount;
      case BadgeId.FAVORITE_5_DISTINCT_CATEGORIES:
        const distinctCategories = new Set(
          currentFavorites
            .map(fav => fav.categoryId)
            .filter(catId => catId !== null && catId !== undefined)
        );
        return distinctCategories.size;
      default:
        return undefined;
    }
  };

  return (
    <div className="pb-20 min-h-[calc(100vh-10rem)]">
      <div className="text-center my-6">
        <TrophyAwardIcon className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-brand-orange dark:text-orange-400 mb-3" /> {/* Changed CupIcon to TrophyAwardIcon */}
        <h2 className="text-2xl sm:text-3xl font-bold text-text-light dark:text-text-dark">
          Your Achievements
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Track your progress and unlock all badges!</p>
      </div>

      {allBadges.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">No badges defined yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 px-2 sm:px-4">
          {allBadges.map(badge => {
            const earned = isBadgeEarned(badge.id);
            const currentVal = getProgressForBadge(badge.id, progress, favorites);
            return (
              <BadgeCard
                key={badge.id}
                badge={badge}
                isEarned={earned}
                currentProgress={currentVal}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};