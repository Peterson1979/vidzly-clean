
import React, { useState, useEffect, useMemo } from 'react';
import { useSaved } from '../contexts/SavedContext'; // Updated from useWatchLater
import { YouTubeVideo } from '../types';
import { VideoCard } from '../components/VideoCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { allMockVideos as globalAllMockVideos } from '../services/youtubeService';
import { ClockIcon } from '../components/Icons'; // Icon can remain the same for "Saved"
import { AdBanner } from '../components/AdBanner';
import { useSubscription } from '../contexts/SubscriptionContext';

export const SavedView: React.FC = () => { // Renamed from WatchLaterView
  const { savedItems } = useSaved(); // Updated from useWatchLater and watchLaterItems
  const { isSubscribed } = useSubscription();
  const [detailedSavedVideos, setDetailedSavedVideos] = useState<YouTubeVideo[]>([]); // Renamed
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchSavedVideoDetails = async () => { // Renamed
      if (savedItems.length === 0) {
        setDetailedSavedVideos([]); // Renamed
        return;
      }
      setIsLoading(true);
      
      const savedVideoIds = savedItems.map(item => item.videoId); // Renamed
      const detailed = globalAllMockVideos.filter(video => 
        savedVideoIds.includes(video.id)
      );
      
      const sortedDetailed = detailed.sort((a, b) => {
        const itemA = savedItems.find(item => item.videoId === a.id); // Renamed
        const itemB = savedItems.find(item => item.videoId === b.id); // Renamed
        return (itemB?.addedAt || 0) - (itemA?.addedAt || 0);
      });

      setDetailedSavedVideos(sortedDetailed); // Renamed
      setIsLoading(false);
    };

    fetchSavedVideoDetails(); // Renamed
  }, [savedItems]); // Renamed

  if (isLoading && savedItems.length > 0) { // Renamed
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="pb-20 min-h-[calc(100vh-10rem)]">
      <h2 className="text-2xl sm:text-3xl font-bold text-text-light dark:text-text-dark text-center my-6">
        Saved Videos 
      </h2>

      {savedItems.length === 0 ? ( // Renamed
        <div className="text-center py-12 px-4 text-text-light dark:text-text-dark">
          <ClockIcon className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
          <h3 className="text-xl sm:text-2xl font-semibold mb-2">Your Saved List is Empty</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Tap the clock icon on videos to save them here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {detailedSavedVideos.map((video, index) => ( // Renamed
            <React.Fragment key={video.id}>
              <VideoCard video={video} />
              {index > 0 && (index + 1) % 4 === 0 && !isSubscribed && (
                <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4">
                   <AdBanner />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};
