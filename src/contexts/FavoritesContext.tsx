
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { FavoriteItem, FavoriteCategory } from '../types';
import { FAVORITES_STORAGE_KEY, FAVORITE_CATEGORIES_STORAGE_KEY } from '../constants';
import { useBadges } from './BadgesContext'; // Import useBadges

interface FavoritesContextType {
  favorites: FavoriteItem[]; 
  categories: FavoriteCategory[];
  addFavorite: (videoId: string, categoryId?: string | null) => void;
  removeFavorite: (videoId: string) => void;
  isFavorite: (videoId: string) => boolean;
  getFavoriteItem: (videoId: string) => FavoriteItem | undefined;
  addCategory: (name: string) => string | null; // Returns new category ID or null if failed
  removeCategory: (categoryId: string) => void;
  updateCategoryName: (categoryId: string, newName: string) => void;
  assignVideoToCategory: (videoId: string, categoryId: string | null) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const badgesContext = useBadges(); // Get badges context

  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return storedFavorites ? JSON.parse(storedFavorites) : [];
    } catch (error) {
      console.error("Error reading favorites from localStorage", error);
      return [];
    }
  });

  const [categories, setCategories] = useState<FavoriteCategory[]>(() => {
    try {
      const storedCategories = localStorage.getItem(FAVORITE_CATEGORIES_STORAGE_KEY);
      return storedCategories ? JSON.parse(storedCategories) : [];
    } catch (error) {
      console.error("Error reading categories from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
      // After favorites change, check for related badges
      badgesContext.checkFavoriteBadges(favorites);
    } catch (error) {
      console.error("Error saving favorites to localStorage", error);
    }
  }, [favorites, badgesContext]); // badgesContext added to dependency array

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITE_CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    } catch (error) {
      console.error("Error saving categories to localStorage", error);
    }
  }, [categories]);

  const addFavorite = useCallback((videoId: string, categoryId: string | null = null) => {
    setFavorites(prevFavorites => {
      if (!prevFavorites.some(fav => fav.videoId === videoId)) {
        return [...prevFavorites, { videoId, favoritedAt: Date.now(), categoryId }];
      }
      // If already favorited, update its category if a new one is provided
      return prevFavorites.map(fav => fav.videoId === videoId ? {...fav, categoryId: categoryId !== undefined ? categoryId : fav.categoryId } : fav);
    });
    // No need to call badgesContext.checkFavoriteBadges here, it's handled by the useEffect on `favorites`
  }, []);

  const removeFavorite = useCallback((videoId: string) => {
    setFavorites(prevFavorites => prevFavorites.filter(fav => fav.videoId !== videoId));
    // No need to call badgesContext.checkFavoriteBadges here, it's handled by the useEffect on `favorites`
  }, []);

  const isFavorite = useCallback((videoId: string) => {
    return favorites.some(fav => fav.videoId === videoId);
  }, [favorites]);

  const getFavoriteItem = useCallback((videoId: string) => {
    return favorites.find(fav => fav.videoId === videoId);
  }, [favorites]);

  const addCategory = useCallback((name: string): string | null => {
    if (!name.trim() || categories.some(cat => cat.name.toLowerCase() === name.trim().toLowerCase())) {
        alert("Category name cannot be empty or already exists.");
        return null;
    }
    const newCategory: FavoriteCategory = { id: `cat_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`, name: name.trim() };
    setCategories(prev => [...prev, newCategory]);
    return newCategory.id;
  }, [categories]);

  const removeCategory = useCallback((categoryId: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    setFavorites(prevFavs => {
        const updatedFavs = prevFavs.map(fav => fav.categoryId === categoryId ? { ...fav, categoryId: null } : fav);
        // badgesContext.checkFavoriteBadges(updatedFavs); // Check after category removal potentially changes assignments
        return updatedFavs; // The useEffect on 'favorites' will handle the check.
    });
  }, [badgesContext]); // badgesContext added

  const updateCategoryName = useCallback((categoryId: string, newName: string) => {
    if (!newName.trim()) {
        alert("Category name cannot be empty.");
        return;
    }
    if (categories.some(cat => cat.id !== categoryId && cat.name.toLowerCase() === newName.trim().toLowerCase())) {
        alert("Another category with this name already exists.");
        return;
    }
    setCategories(prev => prev.map(cat => cat.id === categoryId ? { ...cat, name: newName.trim() } : cat));
  }, [categories]);

  const assignVideoToCategory = useCallback((videoId: string, categoryId: string | null) => {
    setFavorites(prevFavs => {
        const updatedFavs = prevFavs.map(fav => fav.videoId === videoId ? { ...fav, categoryId } : fav);
        // badgesContext.checkFavoriteBadges(updatedFavs); // The useEffect on 'favorites' will handle the check.
        return updatedFavs;
    });
  }, [badgesContext]); // badgesContext added

  const contextValue = useMemo(() => ({
    favorites,
    categories,
    addFavorite,
    removeFavorite,
    isFavorite,
    getFavoriteItem,
    addCategory,
    removeCategory,
    updateCategoryName,
    assignVideoToCategory,
  }), [favorites, categories, addFavorite, removeFavorite, isFavorite, getFavoriteItem, addCategory, removeCategory, updateCategoryName, assignVideoToCategory]);

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};