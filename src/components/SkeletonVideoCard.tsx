
import React from 'react';

export const SkeletonVideoCard: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg flex flex-col animate-pulse">
      {/* Video Player Placeholder */}
      <div className="aspect-video bg-gray-300 dark:bg-gray-700 rounded-t-lg"></div>
      
      <div className="p-4 sm:p-5 flex-grow flex flex-col">
        {/* Title Placeholder */}
        <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-3"></div>

        {/* Meta Info Placeholder (Channel, Views, Date) */}
        <div className="flex flex-wrap items-center text-xs mb-3 space-x-2">
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/5"></div>
        </div>
        
        {/* Description Placeholder */}
        <div className="space-y-1.5 flex-grow mb-3">
          <div className="h-2.5 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-2.5 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
        
        {/* Actions Placeholder */}
        <div className="flex justify-between items-center mt-auto pt-2.5 border-t border-gray-200 dark:border-gray-600">
          <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div> {/* Gemini Insights Toggle */}
          <div className="flex space-x-2 sm:space-x-2.5">
            <div className="h-5 w-5 bg-gray-300 dark:bg-gray-700 rounded-full"></div> {/* Watch Later */}
            <div className="h-5 w-5 bg-gray-300 dark:bg-gray-700 rounded-full"></div> {/* Favorite */}
            <div className="h-5 w-5 bg-gray-300 dark:bg-gray-700 rounded-full"></div> {/* Share */}
          </div>
        </div>
      </div>
    </div>
  );
};