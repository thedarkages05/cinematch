import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Star, Film, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RecommendationEngine } from '@/data/RecommendationEngine';
import { generateMovies, allGenres } from '@/data/movieDatabase';
import { MovieCard } from '@/components/MovieCard';
import { useFavorites } from '@/contexts/FavoritesContext';

export function ExplorePage() {
  const movies = useMemo(() => generateMovies(1500), []);
  const engine = useMemo(() => new RecommendationEngine(movies), [movies]);
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  // View mode can be added later
  // const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return engine.searchByTitle(searchQuery);
  }, [searchQuery, engine]);

  // Genre results
  const genreResults = useMemo(() => {
    if (!selectedGenre) return [];
    return engine.getMoviesByGenre(selectedGenre);
  }, [selectedGenre, engine]);

  // Top rated
  const topRated = useMemo(() => engine.getTopRated(16), [engine]);

  // Most popular
  const mostPopular = useMemo(() => engine.getMostPopular(16), [engine]);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Explore Movies</h1>
          <p className="text-muted-foreground">
            Search, browse by genre, or discover top-rated and popular films
          </p>
        </motion.div>

        <Tabs defaultValue="search" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="search" className="gap-2">
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
            </TabsTrigger>
            <TabsTrigger value="genres" className="gap-2">
              <Film className="w-4 h-4" />
              <span className="hidden sm:inline">Genres</span>
            </TabsTrigger>
            <TabsTrigger value="toprated" className="gap-2">
              <Star className="w-4 h-4" />
              <span className="hidden sm:inline">Top Rated</span>
            </TabsTrigger>
            <TabsTrigger value="popular" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Popular</span>
            </TabsTrigger>
          </TabsList>

          {/* Search Tab */}
          <TabsContent value="search" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-primary" />
                  Search Movies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by movie title..."
                    className="pl-10"
                  />
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <Filter className="w-4 h-4" />
                  <span>Using Hash Table O(1) lookup for instant results</span>
                </div>
              </CardContent>
            </Card>

            {searchQuery && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Search Results</h3>
                  <Badge variant="secondary">{searchResults.length} found</Badge>
                </div>
                
                {searchResults.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {searchResults.map((movie) => (
                      <MovieCard
                        key={movie.id}
                        movie={movie}
                        isFavorite={isFavorite(movie.id)}
                        onToggleFavorite={toggleFavorite}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No movies found matching &quot;{searchQuery}&quot;</p>
                  </div>
                )}
              </motion.div>
            )}
          </TabsContent>

          {/* Genres Tab */}
          <TabsContent value="genres" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Film className="w-5 h-5 text-primary" />
                  Browse by Genre
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {allGenres.map((genre) => (
                    <Button
                      key={genre}
                      variant={selectedGenre === genre ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedGenre(selectedGenre === genre ? null : genre)}
                    >
                      {genre}
                    </Button>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <Filter className="w-4 h-4" />
                  <span>Using Genre Index (Hash Table → Linked List) for efficient filtering</span>
                </div>
              </CardContent>
            </Card>

            {selectedGenre && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{selectedGenre} Movies</h3>
                  <Badge variant="secondary">{genreResults.length} movies</Badge>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {genreResults.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      isFavorite={isFavorite(movie.id)}
                      onToggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </TabsContent>

          {/* Top Rated Tab */}
          <TabsContent value="toprated" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Top Rated Movies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Movies sorted by rating using Binary Search Tree (BST) for O(log n) retrieval of top-rated films.
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {topRated.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  isFavorite={isFavorite(movie.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </TabsContent>

          {/* Popular Tab */}
          <TabsContent value="popular" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  Most Popular Movies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Movies sorted by popularity score using Binary Search Tree (BST) for efficient ranking.
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {mostPopular.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  isFavorite={isFavorite(movie.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
