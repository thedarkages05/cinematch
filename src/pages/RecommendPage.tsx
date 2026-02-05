import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RotateCcw, Settings2, TrendingUp, Star, Calendar, Film, Clock, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { RecommendationEngine } from '@/data/RecommendationEngine';
import { generateMovies, allGenres, allLanguages } from '@/data/movieDatabase';
import { MovieCard } from '@/components/MovieCard';
import { useFavorites } from '@/contexts/FavoritesContext';

export function RecommendPage() {
  const movies = useMemo(() => generateMovies(1500), []);
  const engine = useMemo(() => new RecommendationEngine(movies), [movies]);
  const { toggleFavorite, isFavorite } = useFavorites();
  
  const [recommendations, setRecommendations] = useState<ReturnType<RecommendationEngine['getRecommendations']> | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // User Preferences
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(6.0);
  const [yearRange, setYearRange] = useState([1950, 2024]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [durationRange, setDurationRange] = useState([60, 240]);

  // Recommendation Parameters (Weights)
  const [params, setParams] = useState({
    genreWeight: 0.35,
    ratingWeight: 0.25,
    popularityWeight: 0.20,
    recencyWeight: 0.20
  });

  const generateRecommendations = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const preferences = {
        genres: selectedGenres,
        minRating: minRating,
        minYear: yearRange[0],
        maxYear: yearRange[1],
        languages: selectedLanguages,
        minDuration: durationRange[0],
        maxDuration: durationRange[1]
      };

      const result = engine.getRecommendations(preferences, params, 12);
      setRecommendations(result);
      setIsGenerating(false);
      
      toast.success(`Generated ${result.recommendations.length} recommendations!`, {
        description: `Processed ${result.stats.totalMoviesProcessed} movies`
      });
    }, 500);
  };

  const resetPreferences = () => {
    setSelectedGenres([]);
    setMinRating(6.0);
    setYearRange([1950, 2024]);
    setSelectedLanguages([]);
    setDurationRange([60, 240]);
    setParams({
      genreWeight: 0.35,
      ratingWeight: 0.25,
      popularityWeight: 0.20,
      recencyWeight: 0.20
    });
    setRecommendations(null);
    toast.info('Preferences reset to defaults');
  };

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages(prev => 
      prev.includes(lang) 
        ? prev.filter(l => l !== lang)
        : [...prev, lang]
    );
  };

  const updateWeight = (key: keyof typeof params, value: number) => {
    setParams(prev => ({ ...prev, [key]: value / 100 }));
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
          <h1 className="text-3xl font-bold mb-2">Movie Recommendations</h1>
          <p className="text-muted-foreground">
            Set your preferences and let our data structures find the perfect movies for you
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[400px_1fr] gap-8">
          {/* Preferences Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="sticky top-24">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings2 className="w-5 h-5 text-primary" />
                    Preferences
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={resetPreferences}
                      className="h-8 w-8"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                    >
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {showAdvanced ? 'Hide' : 'Advanced'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Genres */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Film className="w-4 h-4 text-primary" />
                    Genres
                  </Label>
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-2">
                    {allGenres.map((genre) => (
                      <Badge
                        key={genre}
                        variant={selectedGenres.includes(genre) ? 'default' : 'secondary'}
                        className={`cursor-pointer transition-all ${
                          selectedGenres.includes(genre)
                            ? 'bg-primary hover:bg-primary/90'
                            : 'hover:bg-secondary/80'
                        }`}
                        onClick={() => toggleGenre(genre)}
                      >
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Rating Slider - 0.25 to 10.00 */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      Min Rating
                    </Label>
                    <span className="text-sm font-semibold text-primary">{minRating.toFixed(2)}</span>
                  </div>
                  <Slider
                    value={[minRating]}
                    onValueChange={(v) => setMinRating(Math.round(v[0] * 4) / 4)}
                    min={0.25}
                    max={10.00}
                    step={0.25}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0.25</span>
                    <span>10.00</span>
                  </div>
                </div>

                {/* Year Range */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-accent" />
                      Year Range
                    </Label>
                    <span className="text-sm font-semibold">{yearRange[0]} - {yearRange[1]}</span>
                  </div>
                  <Slider
                    value={yearRange}
                    onValueChange={setYearRange}
                    min={1950}
                    max={2024}
                    step={1}
                  />
                </div>

                {/* Languages */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-secondary" />
                    Languages
                  </Label>
                  <div className="flex gap-4">
                    {allLanguages.map((lang) => (
                      <div key={lang} className="flex items-center space-x-2">
                        <Checkbox
                          id={`lang-${lang}`}
                          checked={selectedLanguages.includes(lang)}
                          onCheckedChange={() => toggleLanguage(lang)}
                        />
                        <label htmlFor={`lang-${lang}`} className="text-sm cursor-pointer">
                          {lang}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Duration Range */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      Duration
                    </Label>
                    <span className="text-sm font-semibold">{durationRange[0]} - {durationRange[1]} min</span>
                  </div>
                  <Slider
                    value={durationRange}
                    onValueChange={setDurationRange}
                    min={60}
                    max={240}
                    step={5}
                  />
                </div>

                {/* Advanced Parameters */}
                {showAdvanced && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <Label className="font-semibold">Scoring Weights</Label>
                      
                      {[
                        { key: 'genreWeight', label: 'Genre Match', color: 'text-primary' },
                        { key: 'ratingWeight', label: 'Rating', color: 'text-yellow-500' },
                        { key: 'popularityWeight', label: 'Popularity', color: 'text-accent' },
                        { key: 'recencyWeight', label: 'Recency', color: 'text-secondary' }
                      ].map(({ key, label, color }) => (
                        <div key={key} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">{label}</span>
                            <span className={`text-sm font-medium ${color}`}>
                              {Math.round(params[key as keyof typeof params] * 100)}%
                            </span>
                          </div>
                          <Slider
                            value={[params[key as keyof typeof params] * 100]}
                            onValueChange={(v) => updateWeight(key as keyof typeof params, v[0])}
                            min={0}
                            max={100}
                            step={5}
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Generate Button */}
                <Button
                  onClick={generateRecommendations}
                  disabled={isGenerating}
                  className="w-full gap-2"
                  size="lg"
                >
                  <Sparkles className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
                  {isGenerating ? 'Generating...' : 'Get Recommendations'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results */}
          <div>
            {recommendations ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-primary">{recommendations.recommendations.length}</div>
                      <div className="text-xs text-muted-foreground">Results</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-accent">{recommendations.stats.totalMoviesProcessed}</div>
                      <div className="text-xs text-muted-foreground">Movies Checked</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-500">{recommendations.stats.linkedListSize}</div>
                      <div className="text-xs text-muted-foreground">After Filtering</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-secondary">
                        {(recommendations.stats.filteringTime + recommendations.stats.scoringTime + recommendations.stats.rankingTime).toFixed(0)}ms
                      </div>
                      <div className="text-xs text-muted-foreground">Processing Time</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Movie Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {recommendations.recommendations.map(({ movie, score, genreMatch, ratingScore, popularityScore, recencyScore }, index) => (
                    <motion.div
                      key={movie.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <MovieCard
                        movie={movie}
                        isFavorite={isFavorite(movie.id)}
                        onToggleFavorite={toggleFavorite}
                        showScore={true}
                        score={score}
                        scoreDetails={{ genreMatch, ratingScore, popularityScore, recencyScore }}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Sparkles className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Ready to Discover</h3>
                <p className="text-muted-foreground max-w-md">
                  Adjust your preferences on the left and click "Get Recommendations" to find movies tailored to your taste
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
