
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { VideoPlayerProvider } from './contexts/VideoPlayerContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
// import { LogoProvider } from './contexts/LogoContext'; // Removed
import { SavedProvider } from './contexts/SavedContext'; // Renamed from WatchLaterProvider
import { BadgesProvider } from './contexts/BadgesContext';
import { NotificationCenterProvider } from './contexts/NotificationCenterContext';
import { ViewHistoryProvider } from './contexts/ViewHistoryContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      {/* <LogoProvider> */} {/* Removed */}
        <SubscriptionProvider>
          <VideoPlayerProvider>
            <BadgesProvider>
              <FavoritesProvider>
                <SavedProvider> {/* Renamed from WatchLaterProvider */}
                  <NotificationCenterProvider>
                    <ViewHistoryProvider> 
                      <App />
                    </ViewHistoryProvider>
                  </NotificationCenterProvider>
                </SavedProvider> {/* Renamed from WatchLaterProvider */}
              </FavoritesProvider>
            </BadgesProvider>
          </VideoPlayerProvider>
        </SubscriptionProvider>
      {/* </LogoProvider> */} {/* Removed */}
    </ThemeProvider>
  </React.StrictMode>
);