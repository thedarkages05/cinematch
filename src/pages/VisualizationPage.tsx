import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, 
  List, 
  GitBranch, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack,
  ChevronDown,
  ChevronRight,
  Info,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { generateMovies } from '@/data/movieDatabase';
import { RecommendationEngine } from '@/data/RecommendationEngine';

export function VisualizationPage() {
  const movies = useMemo(() => generateMovies(1500), []);
  const engine = useMemo(() => new RecommendationEngine(movies), [movies]);
  const [activeTab, setActiveTab] = useState('process');

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Data Structure Visualization</h1>
          <p className="text-muted-foreground">
            Interactive visualizations of Hash Tables, Linked Lists, and Binary Trees in action
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="process" className="gap-2">
              <Play className="w-4 h-4" />
              <span className="hidden sm:inline">Process</span>
            </TabsTrigger>
            <TabsTrigger value="hashtable" className="gap-2">
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">Hash Table</span>
            </TabsTrigger>
            <TabsTrigger value="linkedlist" className="gap-2">
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Linked List</span>
            </TabsTrigger>
            <TabsTrigger value="bst" className="gap-2">
              <GitBranch className="w-4 h-4" />
              <span className="hidden sm:inline">Binary Tree</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="process">
            <ProcessFlowViz engine={engine} />
          </TabsContent>

          <TabsContent value="hashtable">
            <HashTableViz engine={engine} />
          </TabsContent>

          <TabsContent value="linkedlist">
            <LinkedListViz engine={engine} />
          </TabsContent>

          <TabsContent value="bst">
            <BSTViz engine={engine} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Process Flow Visualization
function ProcessFlowViz({ engine }: { engine: RecommendationEngine }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const result = engine.getRecommendations(
      { genres: ['Drama', 'Action'], minRating: 7.0, minYear: 1990, maxYear: 2024, languages: [], minDuration: 90, maxDuration: 180 },
      { genreWeight: 0.35, ratingWeight: 0.25, popularityWeight: 0.20, recencyWeight: 0.20 },
      8
    );
    setSteps(result.steps);
    setStats(result.stats);
  }, [engine]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);

  const currentStepData = steps[currentStep];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recommendation Algorithm Flow</span>
            <Badge variant="outline">Step {currentStep + 1} of {steps.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button variant="outline" size="icon" onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0}>
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button onClick={() => setIsPlaying(!isPlaying)} className="gap-2 px-6">
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            <Button variant="outline" size="icon" onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))} disabled={currentStep === steps.length - 1}>
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress */}
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          {/* Step Display */}
          {currentStepData && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className={`p-6 rounded-xl border-2 ${
                currentStepData.dataStructure === 'hash' ? 'border-blue-500 bg-blue-500/5' :
                currentStepData.dataStructure === 'linkedlist' ? 'border-green-500 bg-green-500/5' :
                currentStepData.dataStructure === 'binarytree' ? 'border-orange-500 bg-orange-500/5' :
                'border-primary bg-primary/5'
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  {currentStepData.dataStructure === 'hash' && <Database className="w-8 h-8 text-blue-500" />}
                  {currentStepData.dataStructure === 'linkedlist' && <List className="w-8 h-8 text-green-500" />}
                  {currentStepData.dataStructure === 'binarytree' && <GitBranch className="w-8 h-8 text-orange-500" />}
                  {currentStepData.dataStructure === 'none' && <Info className="w-8 h-8 text-primary" />}
                  <h3 className="text-xl font-bold">{currentStepData.description}</h3>
                </div>
                <p className="text-muted-foreground">{currentStepData.details}</p>
              </div>

              <div className="bg-muted rounded-xl p-4">
                <h4 className="font-semibold mb-4">Algorithm Steps</h4>
                <div className="space-y-2">
                  {steps.map((step, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg flex items-center gap-3 ${
                        idx === currentStep ? 'bg-primary/20 border border-primary/50' :
                        idx < currentStep ? 'bg-green-500/10 border border-green-500/30' :
                        'bg-card border border-border'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        idx === currentStep ? 'bg-primary text-primary-foreground' :
                        idx < currentStep ? 'bg-green-500 text-white' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="text-sm">{step.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Database className="w-5 h-5 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{stats.totalMoviesProcessed}</div>
              <div className="text-xs text-muted-foreground">Movies Stored</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <GitBranch className="w-5 h-5 mx-auto mb-2 text-orange-500" />
              <div className="text-2xl font-bold">{stats.bstStats.height}</div>
              <div className="text-xs text-muted-foreground">Tree Height</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <List className="w-5 h-5 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">{stats.linkedListSize}</div>
              <div className="text-xs text-muted-foreground">Filtered Movies</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Zap className="w-5 h-5 mx-auto mb-2 text-yellow-500" />
              <div className="text-2xl font-bold">O(1)</div>
              <div className="text-xs text-muted-foreground">Lookup Time</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// Enhanced Hash Table Visualization
function HashTableViz({ engine }: { engine: RecommendationEngine }) {
  const [buckets, setBuckets] = useState<any[]>([]);
  const [expandedBucket, setExpandedBucket] = useState<number | null>(null);

  useEffect(() => {
    setBuckets(engine.getHashTableBuckets());
  }, [engine]);

  const stats = useMemo(() => {
    const totalBuckets = buckets.length;
    const totalItems = buckets.reduce((sum, b) => sum + b.keys.length, 0);
    const avgBucketSize = totalBuckets > 0 ? (totalItems / totalBuckets).toFixed(2) : '0';
    const maxBucketSize = Math.max(...buckets.map(b => b.keys.length), 0);
    return { totalBuckets, totalItems, avgBucketSize, maxBucketSize };
  }, [buckets]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-500" />
            Hash Table Structure
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Info */}
          <div className="p-4 bg-blue-500/5 rounded-lg border border-blue-500/20">
            <h4 className="text-blue-500 font-semibold mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" />
              How Hash Table Works
            </h4>
            <p className="text-sm text-muted-foreground">
              Movies are stored using the djb2 hash function that maps movie IDs to bucket indices. 
              This enables O(1) average-time complexity for lookups. Click on a bucket to see its linked list.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-xl font-bold">{stats.totalBuckets}</div>
              <div className="text-xs text-muted-foreground">Buckets</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-xl font-bold">{stats.totalItems}</div>
              <div className="text-xs text-muted-foreground">Total Items</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-xl font-bold">{stats.avgBucketSize}</div>
              <div className="text-xs text-muted-foreground">Avg/ Bucket</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-xl font-bold">{stats.maxBucketSize}</div>
              <div className="text-xs text-muted-foreground">Max Bucket</div>
            </div>
          </div>

          {/* Buckets */}
          <ScrollArea className="h-[400px] border rounded-lg">
            <div className="p-4 space-y-2">
              {buckets.slice(0, 50).map((bucket) => (
                <motion.div
                  key={bucket.hash}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`border rounded-lg overflow-hidden transition-all ${
                    expandedBucket === bucket.hash ? 'border-blue-500/50 ring-1 ring-blue-500/30' : 'border-border'
                  }`}
                >
                  {/* Bucket Header */}
                  <button
                    className="w-full p-3 flex items-center gap-4 hover:bg-muted/50 transition-colors"
                    onClick={() => setExpandedBucket(expandedBucket === bucket.hash ? null : bucket.hash)}
                  >
                    {expandedBucket === bucket.hash ? 
                      <ChevronDown className="w-4 h-4 text-muted-foreground" /> : 
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    }
                    <Badge className="bg-blue-500/20 text-blue-500 hover:bg-blue-500/30">
                      Bucket {bucket.hash}
                    </Badge>
                    <div className="flex-1 flex flex-wrap gap-1">
                      {bucket.keys.slice(0, 3).map((key: string) => (
                        <span key={key} className="text-xs bg-muted px-2 py-0.5 rounded">
                          Movie #{key}
                        </span>
                      ))}
                      {bucket.keys.length > 3 && (
                        <span className="text-xs text-muted-foreground">+{bucket.keys.length - 3}</span>
                      )}
                    </div>
                    <Badge variant="outline">{bucket.keys.length} items</Badge>
                  </button>

                  {/* Expanded Linked List */}
                  <AnimatePresence>
                    {expandedBucket === bucket.hash && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-border bg-muted/30"
                      >
                        <div className="p-4">
                          <h5 className="text-sm font-medium mb-3 text-muted-foreground">Linked List Contents</h5>
                          <div className="flex flex-wrap gap-3">
                            {bucket.keys.map((key: string, idx: number) => (
                              <div key={key} className="flex items-center">
                                <div className="bg-card border border-border rounded-lg px-3 py-2 text-sm">
                                  <span className="text-muted-foreground">Node {idx + 1}:</span>
                                  <span className="ml-2 font-medium">Movie #{key}</span>
                                </div>
                                {idx < bucket.keys.length - 1 && (
                                  <div className="mx-2 text-muted-foreground">→</div>
                                )}
                              </div>
                            ))}
                            <div className="flex items-center">
                              <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2 text-sm text-destructive">
                                NULL
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

// Enhanced Linked List Visualization
function LinkedListViz({ engine }: { engine: RecommendationEngine }) {
  const [sampleMovies, setSampleMovies] = useState<any[]>([]);
  const [highlightedNode, setHighlightedNode] = useState<number | null>(null);

  useEffect(() => {
    const sample = engine['movieHashTable'].values().slice(0, 12);
    setSampleMovies(sample);
  }, [engine]);

  const operations = [
    { name: 'Insert at Head', complexity: 'O(1)', desc: 'Add node at beginning' },
    { name: 'Insert at Tail', complexity: 'O(1)', desc: 'Add node at end' },
    { name: 'Search', complexity: 'O(n)', desc: 'Find by value' },
    { name: 'Delete', complexity: 'O(1)*', desc: 'With pointer' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="w-5 h-5 text-green-500" />
            Linked List Structure
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Info */}
          <div className="p-4 bg-green-500/5 rounded-lg border border-green-500/20">
            <h4 className="text-green-500 font-semibold mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" />
              How Linked List Works
            </h4>
            <p className="text-sm text-muted-foreground">
              Linked Lists store movies within each hash bucket. Each node contains data and a pointer to the next node. 
              Click on nodes to see the traversal in action.
            </p>
          </div>

          {/* Operations */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {operations.map((op) => (
              <div key={op.name} className="text-center p-3 bg-muted rounded-lg">
                <div className="text-lg font-bold text-green-500">{op.complexity}</div>
                <div className="text-sm font-medium">{op.name}</div>
                <div className="text-xs text-muted-foreground">{op.desc}</div>
              </div>
            ))}
          </div>

          {/* Linked List Visualization */}
          <div className="overflow-x-auto">
            <div className="flex items-center gap-2 p-6 min-w-max">
              {/* Head Pointer */}
              <div className="flex flex-col items-center">
                <div className="bg-green-500/20 border-2 border-green-500 rounded-lg p-3 min-w-[80px] text-center">
                  <div className="text-xs text-green-500 font-bold">HEAD</div>
                </div>
                <div className="w-0.5 h-6 bg-green-500/50"></div>
                <div className="text-green-500 text-xl">↓</div>
              </div>

              {/* Nodes */}
              {sampleMovies.map((movie, idx) => (
                <div key={movie.id} className="flex items-center">
                  <motion.div
                    className={`relative border-2 rounded-lg p-3 min-w-[140px] cursor-pointer transition-all ${
                      highlightedNode === idx 
                        ? 'border-green-500 bg-green-500/10 ring-2 ring-green-500/50' 
                        : 'border-border hover:border-green-500/50'
                    }`}
                    onClick={() => {
                      setHighlightedNode(idx);
                      setTimeout(() => setHighlightedNode(null), 1000);
                    }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="text-xs text-green-500 font-bold mb-1">Node {idx + 1}</div>
                    <div className="text-sm font-medium truncate">{movie.title}</div>
                    <div className="text-xs text-muted-foreground">{movie.year}</div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs bg-muted px-1.5 py-0.5 rounded">data</span>
                      <span className="text-xs bg-muted px-1.5 py-0.5 rounded">next →</span>
                    </div>
                  </motion.div>
                  
                  {idx < sampleMovies.length - 1 && (
                    <div className="mx-2 text-green-500 text-2xl">→</div>
                  )}
                </div>
              ))}

              {/* NULL terminator */}
              <div className="flex items-center">
                <div className="mx-2 text-green-500 text-2xl">→</div>
                <div className="bg-destructive/10 border-2 border-destructive/50 rounded-lg p-3 min-w-[60px] text-center">
                  <div className="text-xs text-destructive font-bold">NULL</div>
                </div>
              </div>
            </div>
          </div>

          {/* Memory Representation */}
          <div className="bg-muted rounded-lg p-4">
            <h5 className="font-medium mb-3">Memory Structure</h5>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-card rounded border">
                <div className="text-muted-foreground mb-1">Node Structure</div>
                <code className="text-xs">
                  {'{'}<br/>
                  &nbsp;&nbsp;data: Movie,<br/>
                  &nbsp;&nbsp;next: Node*<br/>
                  {'}'}
                </code>
              </div>
              <div className="p-3 bg-card rounded border">
                <div className="text-muted-foreground mb-1">Head Pointer</div>
                <code className="text-xs">
                  head → Node1<br/>
                  Points to first node
                </code>
              </div>
              <div className="p-3 bg-card rounded border">
                <div className="text-muted-foreground mb-1">Traversal</div>
                <code className="text-xs">
                  while (curr != NULL) {'{'}<br/>
                  &nbsp;&nbsp;process(curr→data)<br/>
                  &nbsp;&nbsp;curr = curr→next<br/>
                  {'}'}
                </code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Enhanced BST Visualization
function BSTViz({ engine }: { engine: RecommendationEngine }) {
  const [treeData, setTreeData] = useState<any>(null);
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);

  useEffect(() => {
    setTreeData(engine.getRatingTreeStructure());
  }, [engine]);

  interface TreeNodeProps {
    node: any;
    level: number;
    isLeft?: boolean;
  }

  const TreeNode = ({ node, level, isLeft }: TreeNodeProps) => {
    if (!node) return null;

    const isHighlighted = highlightedNode === node.data.id;

    return (
      <div className="flex flex-col items-center">
        {/* Connection line from parent */}
        {level > 0 && (
          <div className={`w-px h-6 ${isLeft ? 'bg-gradient-to-br' : 'bg-gradient-to-bl'} from-orange-500/50 to-transparent`} />
        )}
        
        {/* Node */}
        <motion.div
          className={`relative border-2 rounded-xl p-3 min-w-[120px] text-center cursor-pointer transition-all z-10 ${
            isHighlighted 
              ? 'border-orange-500 bg-orange-500/20 ring-2 ring-orange-500/50' 
              : 'border-orange-500/50 bg-card hover:border-orange-500'
          }`}
          onClick={() => {
            setHighlightedNode(node.data.id);
            setTimeout(() => setHighlightedNode(null), 1500);
          }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-xs text-orange-500 font-bold">Rating: {node.data.rating}</div>
          <div className="text-sm font-medium truncate">{node.data.title}</div>
          <div className="text-xs text-muted-foreground mt-1">h={node.height}</div>
        </motion.div>
        
        {/* Children */}
        {(node.left || node.right) && (
          <div className="relative mt-4">
            {/* Horizontal connector */}
            {(node.left && node.right) && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-px bg-orange-500/30" />
            )}
            
            <div className="flex gap-16">
              <div className="flex flex-col items-center">
                {node.left && (
                  <>
                    <div className="w-px h-4 bg-orange-500/30" />
                    <div className="text-orange-500/50 text-lg mb-1">↙</div>
                    <TreeNode node={node.left} level={level + 1} isLeft={true} />
                  </>
                )}
              </div>
              <div className="flex flex-col items-center">
                {node.right && (
                  <>
                    <div className="w-px h-4 bg-orange-500/30" />
                    <div className="text-orange-500/50 text-lg mb-1">↘</div>
                    <TreeNode node={node.right} level={level + 1} isLeft={false} />
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const operations = [
    { name: 'Search', complexity: 'O(log n)', desc: 'Find a node' },
    { name: 'Insert', complexity: 'O(log n)', desc: 'Add new node' },
    { name: 'Delete', complexity: 'O(log n)', desc: 'Remove node' },
    { name: 'Get K Largest', complexity: 'O(log n + k)', desc: 'Top K items' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-orange-500" />
            AVL Binary Search Tree
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Info */}
          <div className="p-4 bg-orange-500/5 rounded-lg border border-orange-500/20">
            <h4 className="text-orange-500 font-semibold mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" />
              How AVL Tree Works
            </h4>
            <p className="text-sm text-muted-foreground">
              AVL Tree is a self-balancing Binary Search Tree where the height difference between subtrees 
              never exceeds 1. This ensures O(log n) operations. Click on nodes to highlight them.
            </p>
          </div>

          {/* Operations */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {operations.map((op) => (
              <div key={op.name} className="text-center p-3 bg-muted rounded-lg">
                <div className="text-lg font-bold text-orange-500">{op.complexity}</div>
                <div className="text-sm font-medium">{op.name}</div>
                <div className="text-xs text-muted-foreground">{op.desc}</div>
              </div>
            ))}
          </div>

          {/* Tree Visualization */}
          <ScrollArea className="h-[500px] border rounded-lg">
            <div className="flex justify-center p-8 min-w-max">
              {treeData && <TreeNode node={treeData} level={0} />}
            </div>
          </ScrollArea>

          {/* Balance Factor Explanation */}
          <div className="bg-muted rounded-lg p-4">
            <h5 className="font-medium mb-3">Balance Factor & Rotations</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="p-3 bg-card rounded border">
                <div className="text-orange-500 font-bold mb-1">Balance Factor</div>
                <code className="text-xs">BF = height(left) - height(right)</code>
                <div className="text-xs text-muted-foreground mt-1">Must be -1, 0, or 1</div>
              </div>
              <div className="p-3 bg-card rounded border">
                <div className="text-orange-500 font-bold mb-1">Left Rotation</div>
                <div className="text-xs text-muted-foreground">When BF &lt; -1</div>
              </div>
              <div className="p-3 bg-card rounded border">
                <div className="text-orange-500 font-bold mb-1">Right Rotation</div>
                <div className="text-xs text-muted-foreground">When BF &gt; 1</div>
              </div>
              <div className="p-3 bg-card rounded border">
                <div className="text-orange-500 font-bold mb-1">Double Rotation</div>
                <div className="text-xs text-muted-foreground">Left-Right or Right-Left</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
