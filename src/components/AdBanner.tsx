
import React from 'react';

interface AdBannerProps {
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ className }) => {
  return (
    <div className={`bg-gray-200 dark:bg-gray-700 p-4 rounded-lg text-center text-gray-600 dark:text-gray-400 my-4 ${className}`}>
      <p className="font-semibold text-lg">Advertisement</p>
      <p className="text-sm">Support Vidzly by viewing ads or subscribe for an ad-free experience!</p>
      {/* In a real app, AdSense or other ad network code would go here */}
      <div className="mt-2 w-full h-24 bg-gray-300 dark:bg-gray-600 flex items-center justify-center rounded">
        {/* Removed text: (Ad Content Area) */}
      </div>
    </div>
  );
};