
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { ViewHistoryItem } from '../types';
import { VIEW_HISTORY_STORAGE_KEY, MAX_VIEW_HISTORY_ITEMS } from '../constants';

interface ViewHistoryContextType {
  historyItems: ViewHistoryItem[];
  addVideoToHistory: (videoId: string) => void;
  clearHistory: () => void;
}

const ViewHistoryContext = createContext<ViewHistoryContextType | undefined>(undefined);

export const ViewHistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [historyItems, setHistoryItems] = useState<ViewHistoryItem[]>(() => {
    try {
      const storedItems = localStorage.getItem(VIEW_HISTORY_STORAGE_KEY);
      return storedItems ? JSON.parse(storedItems) : [];
    } catch (error) {
      console.error("Error reading view history items from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(VIEW_HISTORY_STORAGE_KEY, JSON.stringify(historyItems));
    } catch (error) {
      console.error("Error saving view history items to localStorage", error);
    }
  }, [historyItems]);

  const addVideoToHistory = useCallback((videoId: string) => {
    setHistoryItems(prevItems => {
      // Remove if already exists to move it to the top
      const filteredItems = prevItems.filter(item => item.videoId !== videoId);
      const newHistoryItem: ViewHistoryItem = { videoId, viewedAt: Date.now() };
      const updatedItems = [newHistoryItem, ...filteredItems];
      
      // Limit the history size
      return updatedItems.slice(0, MAX_VIEW_HISTORY_ITEMS);
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistoryItems([]);
    // localStorage will be updated by the useEffect hook
  }, []);

  const contextValue = useMemo(() => ({
    historyItems,
    addVideoToHistory,
    clearHistory,
  }), [historyItems, addVideoToHistory, clearHistory]);

  return (
    <ViewHistoryContext.Provider value={contextValue}>
      {children}
    </ViewHistoryContext.Provider>
  );
};

export const useViewHistory = (): ViewHistoryContextType => {
  const context = useContext(ViewHistoryContext);
  if (!context) {
    throw new Error('useViewHistory must be used within a ViewHistoryProvider');
  }
  return context;
};
