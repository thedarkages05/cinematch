import { useState, useMemo } from 'react';
import { RecommendationEngine } from '@/data/RecommendationEngine';
import { movies } from '@/data/movies';
import { MovieCard } from './MovieCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, TrendingUp, Star, Film, Filter } from 'lucide-react';

interface SearchPanelProps {
  favorites: string[];
  onToggleFavorite: (movieId: string) => void;
}

export function SearchPanel({ favorites, onToggleFavorite }: SearchPanelProps) {
  const [engine] = useState(() => new RecommendationEngine(movies));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('search');

  const genres = useMemo(() => {
    const genreSet = new Set<string>();
    movies.forEach(m => m.genre.forEach(g => genreSet.add(g)));
    return Array.from(genreSet).sort();
  }, []);

  // Search results using hash table lookup
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return engine.searchByTitle(searchQuery);
  }, [searchQuery, engine]);

  // Genre results using hash table index
  const genreResults = useMemo(() => {
    if (!selectedGenre) return [];
    return engine.getMoviesByGenre(selectedGenre);
  }, [selectedGenre, engine]);

  // Top rated using BST
  const topRated = useMemo(() => engine.getTopRated(12), [engine]);

  // Most popular using BST
  const mostPopular = useMemo(() => engine.getMostPopular(12), [engine]);

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800">
          <TabsTrigger value="search" className="data-[state=active]:bg-purple-600">
            <Search className="w-4 h-4 mr-2" />
            Search
          </TabsTrigger>
          <TabsTrigger value="genres" className="data-[state=active]:bg-blue-600">
            <Film className="w-4 h-4 mr-2" />
            Genres
          </TabsTrigger>
          <TabsTrigger value="toprated" className="data-[state=active]:bg-yellow-600">
            <Star className="w-4 h-4 mr-2" />
            Top Rated
          </TabsTrigger>
          <TabsTrigger value="popular" className="data-[state=active]:bg-green-600">
            <TrendingUp className="w-4 h-4 mr-2" />
            Popular
          </TabsTrigger>
        </TabsList>

        {/* Search Tab */}
        <TabsContent value="search" className="space-y-4">
          <Card className="bg-slate-900/80 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-purple-400" />
                Search Movies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by movie title..."
                  className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>
              
              <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
                <Filter className="w-4 h-4" />
                <span>Using Hash Table O(1) lookup for instant results</span>
              </div>
            </CardContent>
          </Card>

          {searchQuery && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Search Results</h3>
                <Badge variant="outline" className="border-purple-500 text-purple-400">
                  {searchResults.length} found
                </Badge>
              </div>
              
              {searchResults.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {searchResults.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      isFavorite={favorites.includes(movie.id)}
                      onToggleFavorite={onToggleFavorite}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No movies found matching &quot;{searchQuery}&quot;</p>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* Genres Tab */}
        <TabsContent value="genres" className="space-y-4">
          <Card className="bg-slate-900/80 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Film className="w-5 h-5 text-blue-400" />
                Browse by Genre
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <Button
                    key={genre}
                    variant={selectedGenre === genre ? 'default' : 'outline'}
                    onClick={() => setSelectedGenre(selectedGenre === genre ? null : genre)}
                    className={selectedGenre === genre 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'border-slate-600 text-slate-400 hover:border-blue-500 hover:text-blue-400'
                    }
                  >
                    {genre}
                  </Button>
                ))}
              </div>
              
              <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
                <Filter className="w-4 h-4" />
                <span>Using Genre Index (Hash Table → Linked List) for efficient filtering</span>
              </div>
            </CardContent>
          </Card>

          {selectedGenre && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">{selectedGenre} Movies</h3>
                <Badge variant="outline" className="border-blue-500 text-blue-400">
                  {genreResults.length} movies
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {genreResults.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    isFavorite={favorites.includes(movie.id)}
                    onToggleFavorite={onToggleFavorite}
                  />
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Top Rated Tab */}
        <TabsContent value="toprated" className="space-y-4">
          <Card className="bg-slate-900/80 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                Top Rated Movies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400 text-sm">
                Movies sorted by IMDb rating using Binary Search Tree (BST) for O(log n) retrieval of top-rated films.
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {topRated.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isFavorite={favorites.includes(movie.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </TabsContent>

        {/* Popular Tab */}
        <TabsContent value="popular" className="space-y-4">
          <Card className="bg-slate-900/80 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Most Popular Movies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400 text-sm">
                Movies sorted by popularity score using Binary Search Tree (BST) for efficient ranking.
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {mostPopular.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isFavorite={favorites.includes(movie.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
