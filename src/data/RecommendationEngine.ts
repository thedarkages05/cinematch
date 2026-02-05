import { HashTable } from '@/data-structures/HashTable';
import { LinkedList } from '@/data-structures/LinkedList';
import { BinarySearchTree } from '@/data-structures/BinarySearchTree';
import type { Movie, UserPreferences, RecommendationParams, VisualizationStep } from '@/types';

interface ScoredMovie {
  movie: Movie;
  score: number;
  genreMatch: number;
  ratingScore: number;
  popularityScore: number;
  recencyScore: number;
}

interface RecommendationResult {
  recommendations: ScoredMovie[];
  steps: VisualizationStep[];
  stats: {
    hashTableStats: ReturnType<HashTable<Movie>['getStats']>;
    bstStats: ReturnType<BinarySearchTree<ScoredMovie>['getStats']>;
    linkedListSize: number;
    totalMoviesProcessed: number;
    filteringTime: number;
    scoringTime: number;
    rankingTime: number;
  };
}

export class RecommendationEngine {
  private movieHashTable: HashTable<Movie>;
  private genreIndex: HashTable<LinkedList<Movie>>;
  private ratingTree: BinarySearchTree<Movie>;
  private yearTree: BinarySearchTree<Movie>;
  private popularityTree: BinarySearchTree<Movie>;

  constructor(movies: Movie[]) {
    this.movieHashTable = new HashTable<Movie>();
    this.genreIndex = new HashTable<LinkedList<Movie>>();
    this.ratingTree = new BinarySearchTree<Movie>((a, b) => a.rating - b.rating);
    this.yearTree = new BinarySearchTree<Movie>((a, b) => a.year - b.year);
    this.popularityTree = new BinarySearchTree<Movie>((a, b) => a.popularity - b.popularity);

    this.initializeDataStructures(movies);
  }

  private initializeDataStructures(movies: Movie[]): void {
    movies.forEach(movie => {
      // Add to hash table for O(1) lookup
      this.movieHashTable.set(movie.id, movie);

      // Add to genre index
      movie.genre.forEach(genre => {
        let genreList = this.genreIndex.get(genre);
        if (!genreList) {
          genreList = new LinkedList<Movie>();
          this.genreIndex.set(genre, genreList);
        }
        genreList.append(movie);
      });

      // Add to BSTs
      this.ratingTree.insert(movie);
      this.yearTree.insert(movie);
      this.popularityTree.insert(movie);
    });
  }

  getRecommendations(
    preferences: UserPreferences,
    params: RecommendationParams,
    limit: number = 10
  ): RecommendationResult {
    const steps: VisualizationStep[] = [];

    // Step 1: Filter movies using Hash Table lookup
    steps.push({
      step: 1,
      description: 'Initializing Hash Table for O(1) movie lookup',
      dataStructure: 'hash',
      highlightNodes: [],
      details: `Hash Table contains ${this.movieHashTable.getSize()} movies with ${this.movieHashTable.getStats().uniqueHashes} unique hash buckets`
    });

    const filteringStart = performance.now();
    const filteredMovies = this.filterMovies(preferences, steps);
    const filteringTime = performance.now() - filteringStart;

    // Step 2: Score movies using Linked List traversal
    steps.push({
      step: 2,
      description: 'Using Linked List to traverse filtered movies',
      dataStructure: 'linkedlist',
      highlightNodes: filteredMovies.slice(0, 5).map(m => m.id),
      details: `Traversing ${filteredMovies.length} filtered movies using sequential Linked List traversal`
    });

    const scoringStart = performance.now();
    const scoredMovies = this.scoreMovies(filteredMovies, preferences, params);
    const scoringTime = performance.now() - scoringStart;

    // Step 3: Rank using Binary Search Tree
    steps.push({
      step: 3,
      description: 'Using Binary Search Tree for efficient ranking',
      dataStructure: 'binarytree',
      highlightNodes: scoredMovies.slice(0, 5).map(s => s.movie.id),
      details: `BST height: ${this.popularityTree.getStats().height}, ensuring O(log n) operations`
    });

    const rankingStart = performance.now();
    const rankedMovies = this.rankMovies(scoredMovies, limit);
    const rankingTime = performance.now() - rankingStart;

    // Step 4: Final result
    steps.push({
      step: 4,
      description: 'Recommendation process complete',
      dataStructure: 'none',
      highlightNodes: rankedMovies.map(r => r.movie.id),
      details: `Generated ${rankedMovies.length} recommendations from ${filteredMovies.length} filtered movies`
    });

    return {
      recommendations: rankedMovies,
      steps,
      stats: {
        hashTableStats: this.movieHashTable.getStats(),
        bstStats: this.popularityTree.getStats(),
        linkedListSize: filteredMovies.length,
        totalMoviesProcessed: this.movieHashTable.getSize(),
        filteringTime,
        scoringTime,
        rankingTime
      }
    };
  }

  private filterMovies(preferences: UserPreferences, steps: VisualizationStep[]): Movie[] {
    const filtered = new LinkedList<Movie>();
    const allMovies = this.movieHashTable.values();

    let candidateMovies: Movie[] = [];
    
    if (preferences.genres.length > 0) {
      const genreMovies = new Set<Movie>();
      preferences.genres.forEach(genre => {
        const genreList = this.genreIndex.get(genre);
        if (genreList) {
          genreList.toArray().forEach(movie => genreMovies.add(movie));
        }
      });
      candidateMovies = Array.from(genreMovies);
      
      steps.push({
        step: 1,
        description: `Genre filtering using Hash Table index`,
        dataStructure: 'hash',
        highlightNodes: candidateMovies.slice(0, 5).map(m => m.id),
        details: `Found ${candidateMovies.length} movies matching genres: ${preferences.genres.join(', ')}`
      });
    } else {
      candidateMovies = allMovies;
    }

    candidateMovies.forEach(movie => {
      if (this.matchesPreferences(movie, preferences)) {
        filtered.append(movie);
      }
    });

    return filtered.toArray();
  }

  private matchesPreferences(movie: Movie, preferences: UserPreferences): boolean {
    if (movie.rating < preferences.minRating) return false;
    if (movie.year < preferences.minYear || movie.year > preferences.maxYear) return false;
    if (preferences.languages.length > 0 && !preferences.languages.includes(movie.language)) {
      return false;
    }
    if (movie.duration < preferences.minDuration || movie.duration > preferences.maxDuration) {
      return false;
    }
    return true;
  }

  private scoreMovies(
    movies: Movie[],
    preferences: UserPreferences,
    params: RecommendationParams
  ): ScoredMovie[] {
    const scoredMovies = new LinkedList<ScoredMovie>();

    movies.forEach(movie => {
      const genreMatch = this.calculateGenreMatch(movie, preferences.genres);
      const ratingScore = movie.rating / 10;
      const popularityScore = movie.popularity / 100;
      const currentYear = new Date().getFullYear();
      const age = currentYear - movie.year;
      const recencyScore = Math.max(0, 1 - (age / 100));

      const score = 
        (genreMatch * params.genreWeight) +
        (ratingScore * params.ratingWeight) +
        (popularityScore * params.popularityWeight) +
        (recencyScore * params.recencyWeight);

      scoredMovies.append({
        movie,
        score,
        genreMatch,
        ratingScore,
        popularityScore,
        recencyScore
      });
    });

    return scoredMovies.toArray();
  }

  private calculateGenreMatch(movie: Movie, preferredGenres: string[]): number {
    if (preferredGenres.length === 0) return 1;
    
    const matchingGenres = movie.genre.filter(g => preferredGenres.includes(g));
    return matchingGenres.length / Math.max(movie.genre.length, preferredGenres.length);
  }

  private rankMovies(scoredMovies: ScoredMovie[], limit: number): ScoredMovie[] {
    const scoreTree = new BinarySearchTree<ScoredMovie>((a, b) => a.score - b.score);
    
    scoredMovies.forEach(sm => scoreTree.insert(sm));
    
    return scoreTree.getKLargest(limit);
  }

  searchByTitle(query: string): Movie[] {
    const results: Movie[] = [];
    const lowerQuery = query.toLowerCase();
    
    this.movieHashTable.values().forEach(movie => {
      if (movie.title.toLowerCase().includes(lowerQuery)) {
        results.push(movie);
      }
    });
    
    return results;
  }

  getMoviesByGenre(genre: string): Movie[] {
    const genreList = this.genreIndex.get(genre);
    return genreList ? genreList.toArray() : [];
  }

  getTopRated(limit: number = 10): Movie[] {
    return this.ratingTree.getKLargest(limit);
  }

  getMostPopular(limit: number = 10): Movie[] {
    return this.popularityTree.getKLargest(limit);
  }

  getMoviesByYearRange(minYear: number, maxYear: number): Movie[] {
    return this.yearTree.rangeSearch(
      { year: minYear } as Movie,
      { year: maxYear } as Movie
    );
  }

  getStats() {
    return {
      hashTable: this.movieHashTable.getStats(),
      ratingTree: this.ratingTree.getStats(),
      yearTree: this.yearTree.getStats(),
      popularityTree: this.popularityTree.getStats(),
      genreIndexSize: this.genreIndex.getSize()
    };
  }

  getHashTableBuckets() {
    return this.movieHashTable.getBuckets();
  }

  getRatingTreeStructure() {
    return this.ratingTree.getTreeStructure();
  }
}

export type { RecommendationResult, ScoredMovie };
