
import React from 'react';
import { Badge } from '../types';
import { LockClosedIcon, CheckCircleIcon } from './Icons';

interface BadgeCardProps {
  badge: Badge;
  isEarned: boolean;
  currentProgress?: number;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({ badge, isEarned, currentProgress }) => {
  const BadgeIcon = badge.iconComponent;

  return (
    <div 
      className={`relative flex flex-col items-center p-4 sm:p-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105
                  ${isEarned ? 'bg-gradient-to-br from-green-400 via-teal-500 to-blue-500 dark:from-green-500 dark:via-teal-600 dark:to-blue-600' 
                              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'}`}
    >
      {isEarned && (
        <div className="absolute top-3 right-3 text-white dark:text-gray-100">
          <CheckCircleIcon className="w-6 h-6" />
        </div>
      )}
      {!isEarned && (
         <div className="absolute top-3 right-3 text-gray-400 dark:text-gray-500">
          <LockClosedIcon className="w-5 h-5" />
        </div>
      )}

      <div className={`mb-3 p-3 rounded-full transition-colors duration-300 
                       ${isEarned ? 'bg-white/20 dark:bg-black/20' : 'bg-gray-100 dark:bg-gray-700'}`}>
        <BadgeIcon 
          className={`w-10 h-10 sm:w-12 sm:h-12 
                      ${isEarned ? 'text-white dark:text-gray-100' : 'text-brand-orange dark:text-orange-400'}`} 
        />
      </div>
      
      <h3 
        className={`text-md sm:text-lg font-semibold text-center mb-1
                    ${isEarned ? 'text-white dark:text-gray-50' : 'text-text-light dark:text-text-dark'}`}
      >
        {badge.name}
      </h3>
      <p 
        className={`text-xs sm:text-sm text-center mb-3
                    ${isEarned ? 'text-gray-100 dark:text-gray-200 opacity-90' : 'text-gray-600 dark:text-gray-400'}`}
      >
        {badge.description}
      </p>

      {!isEarned && typeof currentProgress === 'number' && badge.criteriaCount > 0 && (
        <div className="w-full mt-auto pt-2">
          <div className="flex justify-between text-xs mb-0.5 ${isEarned ? 'text-gray-100' : 'text-gray-500 dark:text-gray-400'}">
            <span>Progress</span>
            <span>{currentProgress} / {badge.criteriaCount}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-brand-orange h-2.5 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${Math.min((currentProgress / badge.criteriaCount) * 100, 100)}%` }}
              role="progressbar"
              aria-valuenow={currentProgress}
              aria-valuemin={0}
              aria-valuemax={badge.criteriaCount}
              aria-label={`${badge.name} progress`}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};