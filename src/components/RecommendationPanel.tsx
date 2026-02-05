import { useState } from 'react';
import type { UserPreferences, RecommendationParams } from '@/types';
import { RecommendationEngine } from '@/data/RecommendationEngine';
import { movies, genres, languages } from '@/data/movies';
import { MovieCard } from './MovieCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Sparkles, RotateCcw, Settings2, TrendingUp, Star, Calendar, Film } from 'lucide-react';
import { toast } from 'sonner';

interface RecommendationPanelProps {
  favorites: string[];
  onToggleFavorite: (movieId: string) => void;
}

export function RecommendationPanel({ favorites, onToggleFavorite }: RecommendationPanelProps) {
  const [engine] = useState(() => new RecommendationEngine(movies));
  const [recommendations, setRecommendations] = useState<ReturnType<RecommendationEngine['getRecommendations']> | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // User Preferences
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(7);
  const [yearRange, setYearRange] = useState([1980, 2024]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [durationRange, setDurationRange] = useState([60, 200]);

  // Recommendation Parameters (Weights)
  const [params, setParams] = useState<RecommendationParams>({
    genreWeight: 0.35,
    ratingWeight: 0.25,
    popularityWeight: 0.20,
    recencyWeight: 0.20
  });

  const generateRecommendations = () => {
    setIsGenerating(true);
    
    // Simulate processing time for visualization effect
    setTimeout(() => {
      const preferences: UserPreferences = {
        genres: selectedGenres,
        minRating: minRating / 10,
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
        description: `Processed ${result.stats.totalMoviesProcessed} movies in ${(result.stats.filteringTime + result.stats.scoringTime + result.stats.rankingTime).toFixed(2)}ms`
      });
    }, 800);
  };

  const resetPreferences = () => {
    setSelectedGenres([]);
    setMinRating(7);
    setYearRange([1980, 2024]);
    setSelectedLanguages([]);
    setDurationRange([60, 200]);
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

  const updateWeight = (key: keyof RecommendationParams, value: number) => {
    setParams(prev => ({ ...prev, [key]: value / 100 }));
  };

  return (
    <div className="space-y-6">
      {/* Preferences Panel */}
      <Card className="bg-slate-900/80 border-slate-700/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-purple-400" />
              Recommendation Preferences
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={resetPreferences}
                className="border-slate-600 text-slate-400 hover:text-white hover:border-slate-500"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="border-slate-600 text-slate-400 hover:text-white hover:border-slate-500"
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
            <Label className="text-slate-300 flex items-center gap-2">
              <Film className="w-4 h-4 text-purple-400" />
              Preferred Genres
            </Label>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <Badge
                  key={genre}
                  variant={selectedGenres.includes(genre) ? 'default' : 'outline'}
                  className={`cursor-pointer transition-all ${
                    selectedGenres.includes(genre)
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'border-slate-600 text-slate-400 hover:border-purple-500 hover:text-purple-400'
                  }`}
                  onClick={() => toggleGenre(genre)}
                >
                  {genre}
                </Badge>
              ))}
            </div>
          </div>

          <Separator className="bg-slate-700" />

          {/* Rating Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-slate-300 flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                Minimum Rating
              </Label>
              <span className="text-sm font-semibold text-yellow-400">{(minRating / 10).toFixed(1)}</span>
            </div>
            <Slider
              value={[minRating]}
              onValueChange={(v) => setMinRating(v[0])}
              min={50}
              max={95}
              step={5}
              className="w-full"
            />
          </div>

          {/* Year Range */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-slate-300 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                Year Range
              </Label>
              <span className="text-sm font-semibold text-blue-400">{yearRange[0]} - {yearRange[1]}</span>
            </div>
            <Slider
              value={yearRange}
              onValueChange={setYearRange}
              min={1950}
              max={2024}
              step={1}
              className="w-full"
            />
          </div>

          {/* Languages */}
          <div className="space-y-3">
            <Label className="text-slate-300">Languages</Label>
            <div className="flex gap-4">
              {languages.map((lang) => (
                <div key={lang} className="flex items-center space-x-2">
                  <Checkbox
                    id={`lang-${lang}`}
                    checked={selectedLanguages.includes(lang)}
                    onCheckedChange={() => toggleLanguage(lang)}
                    className="border-slate-600 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                  />
                  <label
                    htmlFor={`lang-${lang}`}
                    className="text-sm text-slate-400 cursor-pointer"
                  >
                    {lang}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Duration Range */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-slate-300">Duration (minutes)</Label>
              <span className="text-sm font-semibold text-slate-400">{durationRange[0]} - {durationRange[1]} min</span>
            </div>
            <Slider
              value={durationRange}
              onValueChange={setDurationRange}
              min={60}
              max={240}
              step={10}
              className="w-full"
            />
          </div>

          {/* Advanced Parameters */}
          {showAdvanced && (
            <>
              <Separator className="bg-slate-700" />
              <div className="space-y-4">
                <Label className="text-slate-300 font-semibold">Scoring Weights</Label>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Genre Match</span>
                      <span className="text-sm text-purple-400">{Math.round(params.genreWeight * 100)}%</span>
                    </div>
                    <Slider
                      value={[params.genreWeight * 100]}
                      onValueChange={(v) => updateWeight('genreWeight', v[0])}
                      min={0}
                      max={100}
                      step={5}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Rating</span>
                      <span className="text-sm text-yellow-400">{Math.round(params.ratingWeight * 100)}%</span>
                    </div>
                    <Slider
                      value={[params.ratingWeight * 100]}
                      onValueChange={(v) => updateWeight('ratingWeight', v[0])}
                      min={0}
                      max={100}
                      step={5}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Popularity</span>
                      <span className="text-sm text-green-400">{Math.round(params.popularityWeight * 100)}%</span>
                    </div>
                    <Slider
                      value={[params.popularityWeight * 100]}
                      onValueChange={(v) => updateWeight('popularityWeight', v[0])}
                      min={0}
                      max={100}
                      step={5}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Recency</span>
                      <span className="text-sm text-blue-400">{Math.round(params.recencyWeight * 100)}%</span>
                    </div>
                    <Slider
                      value={[params.recencyWeight * 100]}
                      onValueChange={(v) => updateWeight('recencyWeight', v[0])}
                      min={0}
                      max={100}
                      step={5}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Generate Button */}
          <Button
            onClick={generateRecommendations}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-6"
          >
            <Sparkles className={`w-5 h-5 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Generating...' : 'Generate Recommendations'}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {recommendations && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Recommended Movies</h3>
            <Badge variant="outline" className="border-green-500 text-green-400">
              {recommendations.recommendations.length} results
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {recommendations.recommendations.map(({ movie, score, genreMatch, ratingScore, popularityScore, recencyScore }) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isFavorite={favorites.includes(movie.id)}
                onToggleFavorite={onToggleFavorite}
                showScore={true}
                score={score}
                scoreDetails={{ genreMatch, ratingScore, popularityScore, recencyScore }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
