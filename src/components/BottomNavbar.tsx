
import React from 'react';
import { HomeIcon, HeartIcon, SettingsIcon, TvIcon, ClockIcon, TrophyAwardIcon, HistoryIcon } from './Icons';

export type View = 'home' | 'favorites' | 'settings' | 'saved' | 'achievements' | 'history'; // Changed 'watchlater' to 'saved'

interface BottomNavbarProps {
  currentView: View | 'search'; 
  onViewChange: (view: View) => void;
}

interface NavItemProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  ariaLabel?: string;
}

const NavItem: React.FC<NavItemProps> = ({ label, icon, isActive, onClick, ariaLabel }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center flex-1 px-2 py-2.5 text-xs font-medium transition-colors duration-150 ease-in-out focus:outline-none
                ${isActive ? 'text-brand-orange dark:text-orange-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}
    aria-current={isActive ? 'page' : undefined}
    aria-label={ariaLabel || label}
  >
    {icon}
    <span className="mt-1">{label}</span>
  </button>
);

export const BottomNavbar: React.FC<BottomNavbarProps> = ({ currentView, onViewChange }) => {
  const navItems: { view: View; label: string; icon: React.ReactNode; ariaLabel?: string }[] = [
    { view: 'home', label: 'Home', icon: <TvIcon className="w-6 h-6" /> },
    { view: 'saved', label: 'Saved', icon: <ClockIcon className="w-6 h-6" /> }, // Changed from 'watchlater' to 'saved', label to 'Saved'
    { view: 'favorites', label: 'Favorites', icon: <HeartIcon className="w-6 h-6" /> },
    { view: 'history', label: 'History', icon: <HistoryIcon className="w-6 h-6" /> }, 
    { view: 'settings', label: 'Settings', icon: <SettingsIcon className="w-6 h-6" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-60">
      <div className="container mx-auto max-w-screen-md">
        <div className="flex justify-around items-center h-16">
          {navItems.map(item => (
            <NavItem
              key={item.view}
              label={item.label}
              icon={item.icon}
              isActive={currentView === item.view}
              onClick={() => onViewChange(item.view)}
              ariaLabel={item.ariaLabel}
            />
          ))}
        </div>
      </div>
    </nav>
  );
};