export interface Movie {
  id: string;
  title: string;
  year: number;
  genre: string[];
  rating: number;
  director: string;
  actors: string[];
  description: string;
  poster: string;
  duration: number;
  language: string;
  popularity: number;
}

export interface UserPreferences {
  genres: string[];
  minRating: number;
  maxYear: number;
  minYear: number;
  languages: string[];
  minDuration: number;
  maxDuration: number;
}

export interface RecommendationParams {
  genreWeight: number;
  ratingWeight: number;
  popularityWeight: number;
  recencyWeight: number;
}

export interface VisualizationStep {
  step: number;
  description: string;
  dataStructure: 'hash' | 'linkedlist' | 'binarytree' | 'none';
  highlightNodes: string[];
  details: string;
}

export interface LinkedListNode<T> {
  data: T;
  next: LinkedListNode<T> | null;
}

export interface TreeNode<T> {
  data: T;
  left: TreeNode<T> | null;
  right: TreeNode<T> | null;
  height: number;
}

export interface HashTableEntry<T> {
  key: string;
  value: T;
}

export interface ThemeContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (movieId: string) => void;
  clearFavorites: () => void;
  isFavorite: (movieId: string) => boolean;
}
