
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { SavedItem } from '../types'; // Updated from WatchLaterItem
import { SAVED_ITEMS_STORAGE_KEY } from '../constants'; // Updated from WATCH_LATER_STORAGE_KEY

interface SavedContextType { // Renamed from WatchLaterContextType
  savedItems: SavedItem[]; // Renamed from watchLaterItems
  addToSaved: (videoId: string) => void; // Renamed from addToWatchLater
  removeFromSaved: (videoId: string) => void; // Renamed from removeFromWatchLater
  isInSaved: (videoId: string) => boolean; // Renamed from isInWatchLater
}

const SavedContext = createContext<SavedContextType | undefined>(undefined); // Renamed from WatchLaterContext

export const SavedProvider: React.FC<{ children: ReactNode }> = ({ children }) => { // Renamed from WatchLaterProvider
  const [savedItems, setSavedItems] = useState<SavedItem[]>(() => { // Renamed from setWatchLaterItems & watchLaterItems
    try {
      const storedItems = localStorage.getItem(SAVED_ITEMS_STORAGE_KEY); // Updated storage key
      return storedItems ? JSON.parse(storedItems) : [];
    } catch (error) {
      console.error("Error reading saved items from localStorage", error); // Updated message
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_ITEMS_STORAGE_KEY, JSON.stringify(savedItems)); // Updated storage key & items
    } catch (error) {
      console.error("Error saving saved items to localStorage", error); // Updated message
    }
  }, [savedItems]); // Updated items

  const addToSaved = useCallback((videoId: string) => { // Renamed from addToWatchLater
    setSavedItems(prevItems => { // Renamed from setWatchLaterItems
      if (!prevItems.some(item => item.videoId === videoId)) {
        return [...prevItems, { videoId, addedAt: Date.now() }];
      }
      return prevItems;
    });
  }, []);

  const removeFromSaved = useCallback((videoId: string) => { // Renamed from removeFromWatchLater
    setSavedItems(prevItems => prevItems.filter(item => item.videoId !== videoId)); // Renamed from setWatchLaterItems
  }, []);

  const isInSaved = useCallback((videoId: string) => { // Renamed from isInWatchLater
    return savedItems.some(item => item.videoId === videoId); // Renamed from watchLaterItems
  }, [savedItems]); // Renamed from watchLaterItems

  const contextValue = useMemo(() => ({
    savedItems, // Renamed
    addToSaved, // Renamed
    removeFromSaved, // Renamed
    isInSaved, // Renamed
  }), [savedItems, addToSaved, removeFromSaved, isInSaved]); // Renamed variables

  return (
    <SavedContext.Provider value={contextValue}>
      {children}
    </SavedContext.Provider>
  );
};

export const useSaved = (): SavedContextType => { // Renamed from useWatchLater
  const context = useContext(SavedContext); // Renamed
  if (!context) {
    throw new Error('useSaved must be used within a SavedProvider'); // Updated message
  }
  return context;
};
