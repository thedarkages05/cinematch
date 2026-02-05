import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Movie } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Star, Heart, Clock, Calendar, Globe, User, Film } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  isFavorite: boolean;
  onToggleFavorite: (movieId: string) => void;
  showScore?: boolean;
  score?: number;
  scoreDetails?: {
    genreMatch: number;
    ratingScore: number;
    popularityScore: number;
    recencyScore: number;
  };
}

export function MovieCard({ 
  movie, 
  isFavorite, 
  onToggleFavorite, 
  showScore = false, 
  score = 0,
  scoreDetails 
}: MovieCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
        <Card className="group overflow-hidden cursor-pointer card-hover" onClick={() => setShowDetails(true)}>
          <CardContent className="p-0">
            {/* Poster */}
            <div className="relative aspect-[2/3] overflow-hidden">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
              
              {/* Rating Badge */}
              <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-semibold text-white">{movie.rating.toFixed(2)}</span>
              </div>

              {/* Favorite Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(movie.id);
                }}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-destructive text-destructive' : 'text-white'}`} />
              </Button>

              {/* Year Badge */}
              <div className="absolute bottom-2 left-2">
                <Badge variant="secondary" className="text-xs">
                  {movie.year}
                </Badge>
              </div>

              {/* Score Badge */}
              {showScore && (
                <div className="absolute bottom-2 right-2">
                  <Badge className="bg-primary text-primary-foreground text-xs font-bold">
                    {(score * 100).toFixed(0)}%
                  </Badge>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-3 space-y-2">
              <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                {movie.title}
              </h3>
              
              <div className="flex flex-wrap gap-1">
                {movie.genre.slice(0, 2).map((g) => (
                  <Badge key={g} variant="outline" className="text-[10px]">
                    {g}
                  </Badge>
                ))}
                {movie.genre.length > 2 && (
                  <Badge variant="outline" className="text-[10px]">
                    +{movie.genre.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{movie.title}</DialogTitle>
            <DialogDescription>
              {movie.director} • {movie.year}
            </DialogDescription>
          </DialogHeader>

          <div className="grid md:grid-cols-[200px_1fr] gap-6 mt-4">
            {/* Poster */}
            <div className="rounded-lg overflow-hidden">
              <img src={movie.poster} alt={movie.title} className="w-full aspect-[2/3] object-cover" />
            </div>

            {/* Details */}
            <div className="space-y-4">
              {/* Rating & Popularity */}
              <div className="flex gap-4">
                <div className="flex items-center gap-2 bg-yellow-500/10 px-3 py-2 rounded-lg">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-bold text-yellow-500">{movie.rating.toFixed(2)}/10</span>
                </div>
                <div className="flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-lg">
                  <Film className="w-5 h-5 text-primary" />
                  <span className="font-bold text-primary">{movie.popularity}%</span>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{movie.year}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{movie.duration} min</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="w-4 h-4" />
                  <span>{movie.language}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span className="truncate">{movie.director}</span>
                </div>
              </div>

              {/* Genres */}
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-2">Genres</h4>
                <div className="flex flex-wrap gap-2">
                  {movie.genre.map((g) => (
                    <Badge key={g} variant="secondary">{g}</Badge>
                  ))}
                </div>
              </div>

              {/* Cast */}
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-2">Cast</h4>
                <p className="text-sm text-muted-foreground">{movie.actors.join(', ')}</p>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-2">Synopsis</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{movie.description}</p>
              </div>

              {/* Score Breakdown */}
              {showScore && scoreDetails && (
                <div className="bg-muted rounded-lg p-4 space-y-2">
                  <h4 className="text-sm font-semibold text-primary mb-2">
                    Match Score: {(score * 100).toFixed(1)}%
                  </h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Genre Match</span>
                      <span className="text-primary">{(scoreDetails.genreMatch * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rating Score</span>
                      <span className="text-yellow-500">{(scoreDetails.ratingScore * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Popularity</span>
                      <span className="text-accent">{(scoreDetails.popularityScore * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Recency</span>
                      <span className="text-secondary">{(scoreDetails.recencyScore * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <Button
                className={`w-full ${isFavorite ? 'bg-destructive hover:bg-destructive/90' : ''}`}
                onClick={() => onToggleFavorite(movie.id)}
              >
                <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-white' : ''}`} />
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
