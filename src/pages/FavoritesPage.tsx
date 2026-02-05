import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Heart, Download, Share2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { generateMovies } from '@/data/movieDatabase';
import { MovieCard } from '@/components/MovieCard';
import { useFavorites } from '@/contexts/FavoritesContext';

export function FavoritesPage() {
  const movies = useMemo(() => generateMovies(1500), []);
  const { favorites, toggleFavorite, clearFavorites } = useFavorites();

  const favoriteMovies = useMemo(() => {
    return movies.filter(m => favorites.includes(m.id));
  }, [movies, favorites]);

  const avgRating = favoriteMovies.length > 0 
    ? (favoriteMovies.reduce((sum, m) => sum + m.rating, 0) / favoriteMovies.length).toFixed(2)
    : '0.00';

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
        await navigator.share({ title: 'My Movie Favorites', text });
      } catch {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <Heart className="w-8 h-8 text-destructive fill-destructive" />
                My Favorites
              </h1>
              <p className="text-muted-foreground">
                Your personal collection of saved movies
              </p>
            </div>
            
            {favoriteMovies.length > 0 && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="destructive" size="sm" onClick={clearFavorites}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        {favoriteMovies.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{favoriteMovies.length}</div>
                  <div className="text-xs text-muted-foreground">Movies</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-500">{avgRating}</div>
                  <div className="text-xs text-muted-foreground">Avg Rating</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-accent">
                    {Math.max(...favoriteMovies.map(m => m.year))}
                  </div>
                  <div className="text-xs text-muted-foreground">Latest</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-secondary">
                    {new Set(favoriteMovies.flatMap(m => m.genre)).size}
                  </div>
                  <div className="text-xs text-muted-foreground">Genres</div>
                </CardContent>
              </Card>
            </div>

            {/* Movie Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {favoriteMovies.map((movie, index) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <MovieCard
                    movie={movie}
                    isFavorite={true}
                    onToggleFavorite={toggleFavorite}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
              <Heart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Favorites Yet</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Start exploring movies and click the heart icon to add them to your favorites list
            </p>
            <Button asChild>
              <a href="/explore">Explore Movies</a>
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
