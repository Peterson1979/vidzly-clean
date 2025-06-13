
import React, { useState, useEffect, useRef } from 'react';
import { YouTubeVideo } from '../types';
import { GeminiInsights } from './GeminiInsights';
import { VideoPlayer } from './VideoPlayer';
import { useVideoPlayer } from '../contexts/VideoPlayerContext';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useFavorites } from '../contexts/FavoritesContext';
import { useSaved } from '../contexts/SavedContext'; // Renamed from useWatchLater
import { useBadges } from '../contexts/BadgesContext';
import { useViewHistory } from '../contexts/ViewHistoryContext';
import { EyeIcon, CalendarIcon, HeartIcon, HeartFilledIcon, ShareIcon, ClockIcon, ClockFilledIcon } from './Icons';

interface VideoCardProps {
  video: YouTubeVideo;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { playingVideoId, playVideo, pauseVideo } = useVideoPlayer();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { addToSaved, removeFromSaved, isInSaved } = useSaved(); // Renamed from useWatchLater and its functions
  const badgesContext = useBadges();
  const { addVideoToHistory } = useViewHistory();

  const videoCardRef = useRef<HTMLDivElement>(null);
  const isIntersecting = useIntersectionObserver(videoCardRef, { threshold: 0.7 });

  const currentlyFavorite = isFavorite(video.id);
  const currentlyInSaved = isInSaved(video.id); // Renamed from currentlyInWatchLater / isInWatchLater
  const isCurrentlyPlaying = playingVideoId === video.id;

  useEffect(() => {
    if (isIntersecting) {
      playVideo(video.id);
      badgesContext.recordVideoWatch();
      addVideoToHistory(video.id); 
    } else if (isCurrentlyPlaying) {
      // Pausing handled by context or manual interaction
    }
  }, [isIntersecting, video.id, playVideo, isCurrentlyPlaying, badgesContext, addVideoToHistory]);

  const toggleDescription = () => setShowFullDescription(!showFullDescription);

  const descriptionToShow = showFullDescription
    ? video.description
    : video.description.substring(0, 100) + (video.description.length > 100 ? '...' : '');

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (currentlyFavorite) {
      removeFavorite(video.id);
    } else {
      addFavorite(video.id);
    }
  };

  const handleToggleSaved = (e: React.MouseEvent) => { // Renamed from handleToggleWatchLater
    e.stopPropagation();
    if (currentlyInSaved) { // Renamed from currentlyInWatchLater
      removeFromSaved(video.id); // Renamed from removeFromWatchLater
    } else {
      addToSaved(video.id); // Renamed from addToWatchLater
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title,
          text: `Check out this video: ${video.title}`,
          url: video.videoUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
        navigator.clipboard.writeText(video.videoUrl)
        .then(() => alert('Video link copied to clipboard!'))
        .catch(() => alert('Could not copy video link.'));
      }
    } else {
      navigator.clipboard.writeText(video.videoUrl)
        .then(() => alert('Video link copied to clipboard!'))
        .catch(() => alert('Could not copy video link.'));
    }
  };

  return (
    <div 
      ref={videoCardRef} 
      className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl flex flex-col transition-all duration-300 ease-in-out md:hover:scale-102 ${isCurrentlyPlaying ? 'ring-4 ring-brand-orange' : 'ring-1 ring-gray-200 dark:ring-gray-700'}`}
    >
      <VideoPlayer
        url={video.videoUrl}
        isPlaying={isCurrentlyPlaying}
        onPlay={() => {
          playVideo(video.id);
        }}
        onPause={() => { if(isCurrentlyPlaying) pauseVideo(video.id); }}
      />
      <div className="p-4 sm:p-5 flex-grow flex flex-col">
        <h3 className="text-lg sm:text-xl font-semibold text-text-light dark:text-text-dark mb-2 leading-tight">{video.title}</h3>
        <div className="flex flex-wrap items-center text-xs text-gray-500 dark:text-gray-400 mb-3 space-x-3">
          <span>{video.channelTitle}</span>
          <span className="flex items-center"><EyeIcon className="w-4 h-4 mr-1" /> {video.viewCount}</span>
          <span className="flex items-center"><CalendarIcon className="w-4 h-4 mr-1" /> {video.publishDate}</span>
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-300 mb-3 flex-grow">
          <p>{descriptionToShow}</p>
          {video.description.length > 100 && (
            <button onClick={toggleDescription} className="text-brand-orange hover:text-orange-400 dark:hover:text-orange-300 text-xs mt-1 font-semibold">
              {showFullDescription ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-200 dark:border-gray-700">
          <GeminiInsights videoId={video.id} videoTitle={video.title} videoDescription={video.description} />
          <div className="flex space-x-2 sm:space-x-3">
            <button
              onClick={handleToggleSaved} // Renamed from handleToggleWatchLater
              className="p-1 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
              aria-label={currentlyInSaved ? 'Remove from Saved' : 'Add to Saved'} // Updated aria-label
            >
              {currentlyInSaved ? <ClockFilledIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" /> : <ClockIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
            <button
              onClick={handleToggleFavorite}
              className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
              aria-label={currentlyFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {currentlyFavorite ? <HeartFilledIcon className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" /> : <HeartIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
            <button
              onClick={handleShare}
              className="p-1 text-gray-500 hover:text-brand-orange dark:text-gray-400 dark:hover:text-orange-400 transition-colors"
              aria-label="Share video"
            >
              <ShareIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};