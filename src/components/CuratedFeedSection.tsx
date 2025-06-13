
import React from 'react';
import { CuratedFeed, YouTubeVideo } from '../types';
import { VideoCard } from './VideoCard';
import { LightBulbIcon } from './Icons'; // Or a more specific "curated" icon

interface CuratedFeedSectionProps {
  feed: CuratedFeed;
  allVideos: YouTubeVideo[]; // Pass all available videos to find details
}

export const CuratedFeedSection: React.FC<CuratedFeedSectionProps> = ({ feed, allVideos }) => {
  const detailedVideos = feed.videoIds
    .map(id => allVideos.find(video => video.id === id))
    .filter(video => video !== undefined) as YouTubeVideo[];

  if (!detailedVideos || detailedVideos.length === 0) {
    return null; // Don't render if no videos found for the feed
  }

  return (
    <section className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <div className="flex items-center mb-3">
        <LightBulbIcon className="w-7 h-7 text-yellow-500 dark:text-yellow-400 mr-3 flex-shrink-0" />
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-text-light dark:text-text-dark">
            {feed.title}
          </h2>
          {feed.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {feed.description}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent -mx-4 px-4">
        {detailedVideos.map(video => (
          <div key={video.id} className="flex-shrink-0 w-full sm:w-72 md:w-80">
            <VideoCard video={video} />
          </div>
        ))}
        {detailedVideos.length < 2 && <div className="w-px"></div> /* Ensure scrollbar appears for single item too by having a tiny second element if needed */}
      </div>
      {feed.themePrompt && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-right italic">
          AI Theme Hint: {feed.themePrompt.substring(0,100)}{feed.themePrompt.length > 100 ? '...' : ''}
        </p>
      )}
    </section>
  );
};