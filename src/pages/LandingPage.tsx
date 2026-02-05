import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Search, 
  BarChart3, 
  Heart, 
  PieChart,
  ArrowRight,
  Database,
  List,
  GitBranch,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// Animated background particles
function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      opacity: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      const count = Math.min(50, Math.floor(window.innerWidth / 30));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.2
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `hsla(265, 85%, 60%, ${0.15 * (1 - dist / 150)})`;
            ctx.stroke();
          }
        });
      });

      // Draw particles
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(265, 85%, 60%, ${p.opacity})`;
        ctx.fill();

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });

      animationId = requestAnimationFrame(draw);
    };

    resize();
    createParticles();
    draw();

    window.addEventListener('resize', () => {
      resize();
      createParticles();
    });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}

// Feature card component
function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  to,
  color 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string; 
  to: string;
  color: string;
}) {
  return (
    <Link to={to}>
      <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        whileTap={{ scale: 0.98 }}
      >
        <Card className="h-full card-hover cursor-pointer group overflow-hidden">
          <CardContent className="p-6">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
              style={{ background: color }}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-muted-foreground text-sm">
              {description}
            </p>
            <div className="mt-4 flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Explore</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}

// Stat card component
function StatCard({ value, label, icon: Icon }: { value: string; label: string; icon: React.ElementType }) {
  return (
    <div className="glass rounded-xl p-4 text-center">
      <Icon className="w-6 h-6 mx-auto mb-2 text-primary" />
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

export function LandingPage() {
  const features = [
    {
      icon: Sparkles,
      title: 'Smart Recommendations',
      description: 'Get personalized movie suggestions based on your preferences using advanced data structures.',
      to: '/recommend',
      color: 'linear-gradient(135deg, hsl(265, 85%, 60%), hsl(290, 85%, 55%))'
    },
    {
      icon: Search,
      title: 'Explore Movies',
      description: 'Browse through 1500+ movies by genre, rating, year, and language with instant search.',
      to: '/explore',
      color: 'linear-gradient(135deg, hsl(190, 85%, 50%), hsl(210, 85%, 55%))'
    },
    {
      icon: BarChart3,
      title: 'Data Structure Visualization',
      description: 'See how Hash Tables, Linked Lists, and Binary Trees work in real-time.',
      to: '/visualization',
      color: 'linear-gradient(135deg, hsl(25, 85%, 55%), hsl(45, 85%, 55%))'
    },
    {
      icon: PieChart,
      title: 'Analytics Dashboard',
      description: 'View comprehensive statistics and insights about the movie database.',
      to: '/analytics',
      color: 'linear-gradient(135deg, hsl(145, 70%, 50%), hsl(165, 70%, 50%))'
    },
    {
      icon: Heart,
      title: 'Save Favorites',
      description: 'Keep track of your favorite movies and export your collection.',
      to: '/favorites',
      color: 'linear-gradient(135deg, hsl(340, 80%, 60%), hsl(0, 80%, 65%))'
    }
  ];

  const dataStructures = [
    { icon: Database, name: 'Hash Table', complexity: 'O(1) Lookup', description: 'Instant movie retrieval using hash-based indexing' },
    { icon: List, name: 'Linked List', complexity: 'O(n) Traversal', description: 'Sequential access for filtering operations' },
    { icon: GitBranch, name: 'AVL Tree', complexity: 'O(log n) Search', description: 'Self-balancing BST for efficient ranking' }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/30 rounded-full blur-3xl" />
        
        {/* Particle network */}
        <ParticleBackground />
        
        {/* Grid overlay */}
        <div className="absolute inset-0 grid-bg opacity-50" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
                <Zap className="w-4 h-4" />
                <span>Powered by Advanced Data Structures</span>
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6"
            >
              <span className="text-foreground">Discover Your Next</span>
              <br />
              <span className="gradient-text">Favorite Movie</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            >
              A movie recommendation system built with Hash Tables, Linked Lists, and Binary Trees. 
              Explore 1500+ movies with intelligent filtering and real-time visualization.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link to="/recommend">
                <Button size="lg" className="gap-2 text-lg px-8">
                  <Sparkles className="w-5 h-5" />
                  Get Recommendations
                </Button>
              </Link>
              <Link to="/visualization">
                <Button size="lg" variant="outline" className="gap-2 text-lg px-8">
                  <BarChart3 className="w-5 h-5" />
                  View Visualization
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mt-16"
            >
              <StatCard value="1,500+" label="Movies" icon={Film} />
              <StatCard value="O(1)" label="Lookup Speed" icon={Zap} />
              <StatCard value="19" label="Genres" icon={PieChart} />
              <StatCard value="2" label="Languages" icon={Database} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Data Structures Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Built on Solid Foundations</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Our recommendation engine leverages three fundamental data structures for optimal performance
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {dataStructures.map((ds, index) => (
              <motion.div
                key={ds.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full card-hover">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
                      <ds.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{ds.name}</h3>
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
                      {ds.complexity}
                    </span>
                    <p className="text-muted-foreground text-sm">{ds.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Explore the Platform</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Discover all the features designed to help you find your perfect movie
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Film className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">CineMatch</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Built with React, TypeScript, and fundamental Data Structures
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Hash Tables</span>
              <span>•</span>
              <span>Linked Lists</span>
              <span>•</span>
              <span>Binary Trees</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Need to import Film for the stats
import { Film } from 'lucide-react';
