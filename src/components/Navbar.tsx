
import React, { useState, useEffect, useRef } from 'react';
import { SearchIcon, NotificationBellIcon, UserIcon, UserSparklesIcon } from './Icons';
import { APP_NAME, DEFAULT_LOGO_SVG_STRING } from '../constants';
// import { useTheme } from '../contexts/ThemeContext'; // Theme not currently used in this component
import { NotificationPanel } from './NotificationPanel';
import { useNotificationCenter } from '../contexts/NotificationCenterContext';
import { useNavigateToView } from '../hooks/useNavigateToView';

interface NavbarProps {
  onOpenSearch: () => void;
  isForYouModeActive: boolean;
  onToggleForYouMode: () => void;
}

// LogoIcon using dangerouslySetInnerHTML
const LogoIcon: React.FC<{ className?: string }> = ({ className }) => {
  const effectiveClassName = className || "h-8 w-8 sm:h-10 sm:w-10"; // Default size if no className passed

  // The DEFAULT_LOGO_SVG_STRING itself should have width="100%" height="100%"
  // No need to add fill="currentColor" here if the SVG string itself defines its fills.
  return (
    <div
      className={effectiveClassName} // This div gets the size from Tailwind classes
      dangerouslySetInnerHTML={{ __html: DEFAULT_LOGO_SVG_STRING }} // SVG should scale to this div
      aria-label={`${APP_NAME} logo`}
      role="img"
    />
  );
};


export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch, isForYouModeActive, onToggleForYouMode }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const { unreadCount } = useNotificationCenter();
  const { navigateToPath } = useNavigateToView();
  const panelWrapperRef = useRef<HTMLDivElement>(null); // Ref for the div wrapping the NotificationPanel
  const bellButtonRef = useRef<HTMLButtonElement>(null); // Ref for the bell button

  const handlePanelToggle = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
  };

  const handleNavigationFromPanel = (path: string) => {
    navigateToPath(path);
    handleClosePanel();
  };

  // Close panel if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isPanelOpen &&
        panelWrapperRef.current && !panelWrapperRef.current.contains(event.target as Node) &&
        bellButtonRef.current && !bellButtonRef.current.contains(event.target as Node)
      ) {
        handleClosePanel();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPanelOpen]);


  return (
    <header className="sticky top-0 bg-primary-light dark:bg-primary-dark shadow-md z-50 transition-colors duration-300">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left section: Logo and App Name */}
          <div className="flex items-center flex-shrink-0">
             <LogoIcon /> {/* Uses default h-8 w-8 sm:h-10 sm:w-10 */}
            <span className="ml-2 sm:ml-3 font-bold text-lg sm:text-xl text-text-light dark:text-text-dark">
              {APP_NAME}
            </span>
          </div>

          {/* Center section: "For You" Toggle */}
          <div className="flex-1 flex justify-center px-4">
            <button
                onClick={onToggleForYouMode}
                className={`
                    px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center transition-all duration-300 ease-in-out
                    focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-primary-dark
                    ${isForYouModeActive
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:from-orange-600 hover:to-red-600 focus:ring-orange-500'
                        : `bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-gray-400 dark:focus:ring-gray-500`}
                `}
                aria-pressed={isForYouModeActive}
                aria-label={isForYouModeActive ? "Switch to general feed" : "Switch to For You feed"}
            >
                <UserSparklesIcon className={`w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 ${isForYouModeActive ? 'text-white' : 'text-orange-500 dark:text-orange-400'}`} />
                For You
            </button>
          </div>


          {/* Right section: Search, Notifications, User */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onOpenSearch}
              className="p-1.5 sm:p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-orange"
              aria-label="Open search"
            >
              <SearchIcon className="h-5 w-5 sm:h-6 sm:h-6" />
            </button>
            <div className="relative">
              <button
                ref={bellButtonRef}
                onClick={handlePanelToggle}
                className="p-1.5 sm:p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-orange relative"
                aria-label={`Open notifications (${unreadCount} unread)`}
                aria-expanded={isPanelOpen}
                aria-controls="notification-panel-dialog" 
              >
                <NotificationBellIcon className="h-5 w-5 sm:h-6 sm:h-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 block h-2.5 w-2.5 sm:h-3 sm:w-3 transform -translate-y-1/3 translate-x-1/3">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping"></span>
                    <span className="relative inline-flex rounded-full h-full w-full bg-red-600 justify-center items-center text-white text-[8px] sm:text-[9px] font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  </span>
                )}
              </button>
              {/* This div is for the click-outside detection logic */}
              <div ref={panelWrapperRef} id="notification-panel-dialog">
                <NotificationPanel
                    isOpen={isPanelOpen}
                    onClose={handleClosePanel}
                    onNavigate={handleNavigationFromPanel}
                />
              </div>
            </div>
            {/* User Avatar/Icon Placeholder */}
            <div className="p-1.5 sm:p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-orange cursor-pointer"
                 aria-label="User profile (placeholder)"
            >
              <UserIcon className="h-6 w-6 sm:h-7 sm:h-7" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};