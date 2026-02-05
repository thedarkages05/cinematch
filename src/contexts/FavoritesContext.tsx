import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import type { FavoritesContextType } from '@/types';

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('movieFavorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('movieFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (movieId: string) => {
    setFavorites(prev => {
      if (prev.includes(movieId)) {
        toast.info('Removed from favorites');
        return prev.filter(id => id !== movieId);
      } else {
        toast.success('Added to favorites!');
        return [...prev, movieId];
      }
    });
  };

  const clearFavorites = () => {
    setFavorites([]);
    toast.info('All favorites cleared');
  };

  const isFavorite = (movieId: string) => favorites.includes(movieId);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, clearFavorites, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
