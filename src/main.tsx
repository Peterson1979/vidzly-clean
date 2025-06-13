import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { ThemeProvider } from './contexts/ThemeContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { NotificationCenterProvider } from './contexts/NotificationCenterContext';
import { BadgesProvider } from './contexts/BadgesContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { SavedProvider } from './contexts/SavedContext';
import { WatchLaterProvider } from './contexts/WatchLaterContext';
import { ViewHistoryProvider } from './contexts/ViewHistoryContext';
import { VideoPlayerProvider } from './contexts/VideoPlayerContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <SubscriptionProvider>
        <NotificationCenterProvider>
          <BadgesProvider>
            <FavoritesProvider>
              <SavedProvider>
                  <ViewHistoryProvider>
                    <VideoPlayerProvider>
                      <App />
                    </VideoPlayerProvider>
                  </ViewHistoryProvider>
              </SavedProvider>
            </FavoritesProvider>
          </BadgesProvider>
        </NotificationCenterProvider>
      </SubscriptionProvider>
    </ThemeProvider>
  </React.StrictMode>
);
