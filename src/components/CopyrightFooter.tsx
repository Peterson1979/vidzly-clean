
import React from 'react';
import { APP_NAME } from '../constants';

export const CopyrightFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-6 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <p>
        &copy; {currentYear} {APP_NAME}. All rights reserved.
      </p>
      <p className="mt-1">
        Video content is sourced from YouTube. {APP_NAME} is not affiliated with YouTube.
      </p>
      <p className="mt-1">
        Please respect copyright laws. All trademarks and copyrights belong to their respective owners.
      </p>
    </footer>
  );
};