import { useState, useEffect, useRef } from 'react';
import { RecommendationEngine } from '@/data/RecommendationEngine';
import { movies } from '@/data/movies';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Database, 
  List, 
  GitBranch, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack,
  Info,
  Clock,
  BarChart3
} from 'lucide-react';

interface VisualizationStep {
  step: number;
  description: string;
  dataStructure: 'hash' | 'linkedlist' | 'binarytree' | 'none';
  highlightNodes: string[];
  details: string;
}

export function DataStructureViz() {
  const [engine] = useState(() => new RecommendationEngine(movies));
  const [activeTab, setActiveTab] = useState('process');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<VisualizationStep[]>([]);
  const [stats, setStats] = useState<ReturnType<RecommendationEngine['getStats']> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Generate initial recommendation to get steps
    const result = engine.getRecommendations(
      { genres: ['Drama', 'Crime'], minRating: 7.5, minYear: 1990, maxYear: 2024, languages: [], minDuration: 90, maxDuration: 180 },
      { genreWeight: 0.35, ratingWeight: 0.25, popularityWeight: 0.20, recencyWeight: 0.20 },
      8
    );
    setSteps(result.steps);
    setStats(engine.getStats());
  }, [engine]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, steps.length]);

  const handlePlay = () => {
    if (currentStep >= steps.length - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800">
          <TabsTrigger value="process" className="data-[state=active]:bg-purple-600">
            <Play className="w-4 h-4 mr-2" />
            Process Flow
          </TabsTrigger>
          <TabsTrigger value="hashtable" className="data-[state=active]:bg-blue-600">
            <Database className="w-4 h-4 mr-2" />
            Hash Table
          </TabsTrigger>
          <TabsTrigger value="linkedlist" className="data-[state=active]:bg-green-600">
            <List className="w-4 h-4 mr-2" />
            Linked List
          </TabsTrigger>
          <TabsTrigger value="bst" className="data-[state=active]:bg-orange-600">
            <GitBranch className="w-4 h-4 mr-2" />
            Binary Tree
          </TabsTrigger>
        </TabsList>

        {/* Process Flow Tab */}
        <TabsContent value="process" className="space-y-4">
          <Card className="bg-slate-900/80 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span>Recommendation Algorithm Visualization</span>
                <Badge variant="outline" className="border-purple-500 text-purple-400">
                  Step {currentStep + 1} of {steps.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Playback Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className="border-slate-600 hover:bg-slate-800"
                >
                  <SkipBack className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handlePlay}
                  className="bg-purple-600 hover:bg-purple-700 px-8"
                >
                  {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                  {isPlaying ? 'Pause' : 'Play'}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNext}
                  disabled={currentStep === steps.length - 1}
                  className="border-slate-600 hover:bg-slate-800"
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>

              {/* Step Display */}
              {currentStepData && (
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Step Info */}
                  <div className="space-y-4">
                    <div className={`p-6 rounded-xl border-2 transition-all duration-500 ${
                      currentStepData.dataStructure === 'hash' ? 'border-blue-500 bg-blue-500/10' :
                      currentStepData.dataStructure === 'linkedlist' ? 'border-green-500 bg-green-500/10' :
                      currentStepData.dataStructure === 'binarytree' ? 'border-orange-500 bg-orange-500/10' :
                      'border-purple-500 bg-purple-500/10'
                    }`}>
                      <div className="flex items-center gap-3 mb-4">
                        {currentStepData.dataStructure === 'hash' && <Database className="w-8 h-8 text-blue-400" />}
                        {currentStepData.dataStructure === 'linkedlist' && <List className="w-8 h-8 text-green-400" />}
                        {currentStepData.dataStructure === 'binarytree' && <GitBranch className="w-8 h-8 text-orange-400" />}
                        {currentStepData.dataStructure === 'none' && <Info className="w-8 h-8 text-purple-400" />}
                        <h3 className="text-xl font-bold text-white">{currentStepData.description}</h3>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{currentStepData.details}</p>
                    </div>

                    {/* Data Structure Indicator */}
                    <div className="flex gap-2">
                      <Badge 
                        variant={currentStepData.dataStructure === 'hash' ? 'default' : 'outline'}
                        className={currentStepData.dataStructure === 'hash' ? 'bg-blue-600' : 'border-slate-600 text-slate-400'}
                      >
                        <Database className="w-3 h-3 mr-1" />
                        Hash Table
                      </Badge>
                      <Badge 
                        variant={currentStepData.dataStructure === 'linkedlist' ? 'default' : 'outline'}
                        className={currentStepData.dataStructure === 'linkedlist' ? 'bg-green-600' : 'border-slate-600 text-slate-400'}
                      >
                        <List className="w-3 h-3 mr-1" />
                        Linked List
                      </Badge>
                      <Badge 
                        variant={currentStepData.dataStructure === 'binarytree' ? 'default' : 'outline'}
                        className={currentStepData.dataStructure === 'binarytree' ? 'bg-orange-600' : 'border-slate-600 text-slate-400'}
                      >
                        <GitBranch className="w-3 h-3 mr-1" />
                        BST
                      </Badge>
                    </div>
                  </div>

                  {/* Algorithm Steps */}
                  <div className="bg-slate-800/50 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-slate-400 mb-4">Algorithm Steps</h4>
                    <div className="space-y-2">
                      {steps.map((step, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg transition-all duration-300 ${
                            idx === currentStep 
                              ? 'bg-purple-600/30 border border-purple-500/50' 
                              : idx < currentStep 
                                ? 'bg-green-600/20 border border-green-500/30' 
                                : 'bg-slate-800 border border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              idx === currentStep 
                                ? 'bg-purple-600 text-white' 
                                : idx < currentStep 
                                  ? 'bg-green-600 text-white' 
                                  : 'bg-slate-700 text-slate-400'
                            }`}>
                              {idx + 1}
                            </span>
                            <span className={`text-sm ${
                              idx === currentStep 
                                ? 'text-white' 
                                : idx < currentStep 
                                  ? 'text-green-400' 
                                  : 'text-slate-500'
                            }`}>
                              {step.description}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Performance Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-slate-900/80 border-slate-700/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-blue-400 mb-2">
                    <Database className="w-4 h-4" />
                    <span className="text-sm font-medium">Hash Table</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{stats.hashTable.size}</p>
                  <p className="text-xs text-slate-400">Total movies stored</p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-900/80 border-slate-700/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-orange-400 mb-2">
                    <GitBranch className="w-4 h-4" />
                    <span className="text-sm font-medium">BST Height</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{stats.ratingTree.height}</p>
                  <p className="text-xs text-slate-400">Tree balance factor</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/80 border-slate-700/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-green-400 mb-2">
                    <BarChart3 className="w-4 h-4" />
                    <span className="text-sm font-medium">Genre Index</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{stats.genreIndexSize}</p>
                  <p className="text-xs text-slate-400">Unique genres indexed</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/80 border-slate-700/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-purple-400 mb-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">Lookup Time</span>
                  </div>
                  <p className="text-2xl font-bold text-white">O(1)</p>
                  <p className="text-xs text-slate-400">Average case complexity</p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Hash Table Tab */}
        <TabsContent value="hashtable">
          <HashTableViz engine={engine} />
        </TabsContent>

        {/* Linked List Tab */}
        <TabsContent value="linkedlist">
          <LinkedListViz engine={engine} />
        </TabsContent>

        {/* BST Tab */}
        <TabsContent value="bst">
          <BSTViz engine={engine} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Hash Table Visualization
function HashTableViz({ engine }: { engine: RecommendationEngine }) {
  const [buckets, setBuckets] = useState<ReturnType<RecommendationEngine['getHashTableBuckets']>>([]);
  const [selectedBucket, setSelectedBucket] = useState<number | null>(null);

  useEffect(() => {
    setBuckets(engine.getHashTableBuckets());
  }, [engine]);

  return (
    <Card className="bg-slate-900/80 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-400" />
          Hash Table Structure
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
          <h4 className="text-blue-400 font-semibold mb-2">How Hash Table Works</h4>
          <p className="text-sm text-slate-300">
            Movies are stored using a hash function that maps movie IDs to bucket indices. 
            This enables O(1) average-time complexity for lookups, insertions, and deletions.
            Collisions are handled using separate chaining with linked lists.
          </p>
        </div>

        <ScrollArea className="h-[400px] w-full">
          <div className="space-y-2">
            {buckets.slice(0, 20).map((bucket) => (
              <div
                key={bucket.hash}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  selectedBucket === bucket.hash 
                    ? 'bg-blue-600/30 border-blue-500' 
                    : 'bg-slate-800 border-slate-700 hover:border-blue-500/50'
                }`}
                onClick={() => setSelectedBucket(selectedBucket === bucket.hash ? null : bucket.hash)}
              >
                <div className="flex items-center gap-4">
                  <Badge className="bg-blue-600 text-white min-w-[80px]">
                    Bucket {bucket.hash}
                  </Badge>
                  <div className="flex-1 flex flex-wrap gap-2">
                    {bucket.keys.slice(0, 5).map((key) => (
                      <span key={key} className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">
                        Movie #{key}
                      </span>
                    ))}
                    {bucket.keys.length > 5 && (
                      <span className="text-xs text-slate-500">+{bucket.keys.length - 5} more</span>
                    )}
                  </div>
                  <Badge variant="outline" className="border-slate-600 text-slate-400">
                    {bucket.keys.length} items
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// Linked List Visualization
function LinkedListViz({ engine }: { engine: RecommendationEngine }) {
  const [sampleMovies, setSampleMovies] = useState<Array<{ id: string; title: string }>>([]);

  useEffect(() => {
    // Get a sample of movies to visualize as linked list
    const sample = engine['movieHashTable'].values().slice(0, 10);
    setSampleMovies(sample.map(m => ({ id: m.id, title: m.title })));
  }, [engine]);

  return (
    <Card className="bg-slate-900/80 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <List className="w-5 h-5 text-green-400" />
          Linked List Structure
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-4 bg-green-500/10 rounded-lg border border-green-500/30">
          <h4 className="text-green-400 font-semibold mb-2">How Linked List Works</h4>
          <p className="text-sm text-slate-300">
            Linked Lists are used to store movies within each hash bucket and for sequential traversal 
            during filtering operations. Each node contains a movie and a pointer to the next node, 
            enabling efficient insertion and deletion.
          </p>
        </div>

        <div className="overflow-x-auto">
          <div className="flex items-center gap-2 p-4 min-w-max">
            <div className="bg-green-600/20 border-2 border-green-500 rounded-lg p-3 min-w-[120px]">
              <p className="text-xs text-green-400 font-semibold">HEAD</p>
              <p className="text-xs text-slate-400">Pointer to first</p>
            </div>
            
            <div className="text-green-500 text-2xl">→</div>

            {sampleMovies.map((movie, idx) => (
              <div key={movie.id} className="flex items-center gap-2">
                <div className="bg-slate-800 border-2 border-green-500/50 rounded-lg p-3 min-w-[150px]">
                  <p className="text-xs text-green-400 font-semibold">Node {idx + 1}</p>
                  <p className="text-sm text-white truncate">{movie.title}</p>
                  <p className="text-xs text-slate-500 mt-1">data + next</p>
                </div>
                {idx < sampleMovies.length - 1 && (
                  <div className="text-green-500 text-2xl">→</div>
                )}
              </div>
            ))}

            <div className="text-green-500 text-2xl">→</div>

            <div className="bg-red-600/20 border-2 border-red-500 rounded-lg p-3 min-w-[80px]">
              <p className="text-xs text-red-400 font-semibold">NULL</p>
              <p className="text-xs text-slate-400">End of list</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-slate-800 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-400">O(1)</p>
            <p className="text-xs text-slate-400">Insert at head</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-yellow-400">O(n)</p>
            <p className="text-xs text-slate-400">Search</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-400">O(1)</p>
            <p className="text-xs text-slate-400">Delete (with pointer)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// BST Visualization
function BSTViz({ engine }: { engine: RecommendationEngine }) {
  const [treeData, setTreeData] = useState<unknown>(null);

  useEffect(() => {
    setTreeData(engine.getRatingTreeStructure());
  }, [engine]);

  interface TreeNodeData {
    data: Movie;
    height: number;
    left: TreeNodeData | null;
    right: TreeNodeData | null;
  }

  interface Movie {
    title: string;
    rating: number;
  }

  const renderNode = (node: TreeNodeData | null): React.ReactElement | null => {
    if (!node) return null;

    return (
      <div className="flex flex-col items-center">
        <div className="bg-orange-600/20 border-2 border-orange-500 rounded-lg p-3 min-w-[100px] text-center mb-4">
          <p className="text-xs text-orange-400 font-semibold">Rating: {node.data.rating}</p>
          <p className="text-sm text-white truncate">{node.data.title}</p>
          <p className="text-xs text-slate-500">h={node.height}</p>
        </div>
        
        {(node.left || node.right) && (
          <div className="flex gap-8">
            <div className="flex flex-col items-center">
              {node.left && (
                <>
                  <div className="w-px h-4 bg-orange-500"></div>
                  <div className="text-orange-500 text-lg">↙</div>
                  {renderNode(node.left)}
                </>
              )}
            </div>
            <div className="flex flex-col items-center">
              {node.right && (
                <>
                  <div className="w-px h-4 bg-orange-500"></div>
                  <div className="text-orange-500 text-lg">↘</div>
                  {renderNode(node.right)}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="bg-slate-900/80 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-orange-400" />
          Binary Search Tree (AVL)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-4 bg-orange-500/10 rounded-lg border border-orange-500/30">
          <h4 className="text-orange-400 font-semibold mb-2">How BST Works</h4>
          <p className="text-sm text-slate-300">
            We use a self-balancing AVL Tree to maintain movies sorted by rating. 
            This ensures O(log n) time complexity for insertions, deletions, and searches. 
            The tree automatically rebalances itself to maintain optimal height.
          </p>
        </div>

        <ScrollArea className="h-[400px] w-full">
          <div className="flex justify-center p-8 min-w-max">
            {treeData ? renderNode(treeData as TreeNodeData) : null}
          </div>
        </ScrollArea>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-slate-800 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-400">O(log n)</p>
            <p className="text-xs text-slate-400">Search</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-400">O(log n)</p>
            <p className="text-xs text-slate-400">Insert</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-400">O(log n)</p>
            <p className="text-xs text-slate-400">Delete</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
