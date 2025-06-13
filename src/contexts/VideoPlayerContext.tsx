
import React, { createContext, useState, useContext, ReactNode, useCallback, useMemo } from 'react';

interface VideoPlayerContextType {
  playingVideoId: string | null;
  playVideo: (videoId: string) => void;
  pauseVideo: (videoId: string) => void; // specific pause, or general pause if id matches current
}

const VideoPlayerContext = createContext<VideoPlayerContextType | undefined>(undefined);

export const VideoPlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  const playVideo = useCallback((videoId: string) => {
    setPlayingVideoId(videoId);
  }, []);

  const pauseVideo = useCallback((videoId: string) => {
    // Only pause if the video requesting pause is the one currently playing.
    // This prevents a video that's not in focus from trying to pause the active one.
    setPlayingVideoId(currentId => (currentId === videoId ? null : currentId));
  }, []);
  
  const contextValue = useMemo(() => ({
    playingVideoId,
    playVideo,
    pauseVideo
  }), [playingVideoId, playVideo, pauseVideo]);

  return (
    <VideoPlayerContext.Provider value={contextValue}>
      {children}
    </VideoPlayerContext.Provider>
  );
};

export const useVideoPlayer = (): VideoPlayerContextType => {
  const context = useContext(VideoPlayerContext);
  if (!context) {
    throw new Error('useVideoPlayer must be used within a VideoPlayerProvider');
  }
  return context;
};