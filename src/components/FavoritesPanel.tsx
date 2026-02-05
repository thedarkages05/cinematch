import { useMemo } from 'react';
import { movies } from '@/data/movies';
import { MovieCard } from './MovieCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Download, Share2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface FavoritesPanelProps {
  favorites: string[];
  onToggleFavorite: (movieId: string) => void;
  onClearFavorites: () => void;
}

export function FavoritesPanel({ favorites, onToggleFavorite, onClearFavorites }: FavoritesPanelProps) {
  const favoriteMovies = useMemo(() => {
    return movies.filter(m => favorites.includes(m.id));
  }, [favorites]);

  const handleExport = () => {
    const data = JSON.stringify(favoriteMovies, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-movie-favorites.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Favorites exported successfully!');
  };

  const handleShare = async () => {
    const movieTitles = favoriteMovies.map(m => m.title).join(', ');
    const text = `Check out my favorite movies: ${movieTitles}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Movie Favorites',
          text: text,
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    }
  };

  if (favoriteMovies.length === 0) {
    return (
      <Card className="bg-slate-900/80 border-slate-700/50">
        <CardContent className="py-16 text-center">
          <Heart className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Favorites Yet</h3>
          <p className="text-slate-400 max-w-md mx-auto">
            Start exploring movies and click the heart icon to add them to your favorites list.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900/80 border-slate-700/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-400 fill-red-400" />
              My Favorites
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="border-slate-600 text-slate-400 hover:text-white"
              >
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="border-slate-600 text-slate-400 hover:text-white"
              >
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFavorites}
                className="border-red-600/50 text-red-400 hover:bg-red-600/20"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Clear
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <Badge variant="outline" className="border-red-500 text-red-400">
              {favoriteMovies.length} movies
            </Badge>
            <span>Average Rating: {(favoriteMovies.reduce((sum, m) => sum + m.rating, 0) / favoriteMovies.length).toFixed(1)}</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {favoriteMovies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            isFavorite={true}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
}
