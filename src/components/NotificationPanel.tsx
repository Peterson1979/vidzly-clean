
import React from 'react';
import { InAppNotification, InAppNotificationType } from '../types';
import { useNotificationCenter } from '../contexts/NotificationCenterContext';
import * as Icons from './Icons'; // Import all icons

// Helper to format timestamp (e.g., "2h ago", "5m ago", "Just now")
const timeSince = (timestamp: number): string => {
  const now = new Date().getTime();
  const secondsPast = (now - timestamp) / 1000;

  if (secondsPast < 60) {
    return `${Math.round(secondsPast)}s ago`;
  }
  if (secondsPast < 3600) {
    return `${Math.round(secondsPast / 60)}m ago`;
  }
  if (secondsPast <= 86400) {
    return `${Math.round(secondsPast / 3600)}h ago`;
  }
  const days = Math.round(secondsPast / 86400);
  if (days <= 7) {
    return `${days}d ago`;
  }
  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

const getIconComponent = (iconName?: string): React.FC<React.SVGProps<SVGSVGElement> & {className?: string}> => {
  if (iconName && (Icons as any)[iconName]) {
    return (Icons as any)[iconName];
  }
  return Icons.NotificationBellIcon; // Default icon
};


interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void; // Callback to handle navigation
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose, onNavigate }) => {
  const { 
    notifications, 
    unreadCount,
    markAsRead, 
    markAllAsRead, 
    clearNotification, 
    clearAllNotifications 
  } = useNotificationCenter();

  if (!isOpen) return null;

  const handleNotificationClick = (notification: InAppNotification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.link) {
      onNavigate(notification.link); // Use the passed navigation handler
    }
    onClose(); // Close panel after interaction
  };

  return (
    <div 
        className="absolute top-16 right-0 mt-1 w-80 sm:w-96 max-h-[70vh] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-80 flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notification-panel-title"
    >
      <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
        <h2 id="notification-panel-title" className="text-lg font-semibold text-text-light dark:text-text-dark">Notifications</h2>
        {notifications.length > 0 && unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs text-brand-orange hover:text-orange-400 font-medium flex items-center"
            aria-label="Mark all notifications as read"
          >
            <Icons.CheckCheckIcon className="w-4 h-4 mr-1" /> Mark all as read
          </button>
        )}
      </header>

      {notifications.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center p-6 text-center text-gray-500 dark:text-gray-400">
          <Icons.BellIcon className="w-12 h-12 mb-3 text-gray-400 dark:text-gray-500" />
          <p className="font-medium">You're all caught up!</p>
          <p className="text-sm">No new notifications right now.</p>
        </div>
      ) : (
        <ul className="flex-grow overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {notifications.map(notification => {
            const IconComponent = getIconComponent(notification.iconName);
            return (
              <li key={notification.id}>
                <button
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full text-left p-3 rounded-md transition-colors duration-150 ease-in-out group
                              ${notification.read ? 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/70' 
                                                  : 'bg-orange-50 dark:bg-orange-900/30 hover:bg-orange-100 dark:hover:bg-orange-800/50 border-l-4 border-brand-orange'}`}
                >
                  <div className="flex items-start">
                    <IconComponent className={`w-5 h-5 mt-0.5 mr-3 flex-shrink-0 ${notification.read ? 'text-gray-500 dark:text-gray-400' : 'text-brand-orange'}`} />
                    <div className="flex-grow">
                      <div className="flex justify-between items-baseline">
                        <h4 className={`text-sm font-semibold ${notification.read ? 'text-text-light dark:text-text-dark' : 'text-brand-orange dark:text-orange-400'}`}>
                          {notification.title}
                        </h4>
                        <span className="text-xs text-gray-400 dark:text-gray-500 ml-2 whitespace-nowrap">
                          {timeSince(notification.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5 leading-snug line-clamp-2">
                        {notification.body}
                      </p>
                    </div>
                    <button 
                        onClick={(e) => { e.stopPropagation(); clearNotification(notification.id); }}
                        className="ml-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Clear notification"
                    >
                        <Icons.XIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {notifications.length > 0 && (
        <footer className="p-3 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800 z-10">
          <button
            onClick={clearAllNotifications}
            className="w-full text-center text-xs text-red-500 hover:text-red-400 font-medium py-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
            aria-label="Clear all notifications"
          >
            Clear All Notifications
          </button>
        </footer>
      )}
    </div>
  );
};