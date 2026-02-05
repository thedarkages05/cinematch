import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { Layout } from '@/components/Layout';
import { LandingPage } from '@/pages/LandingPage';
import { RecommendPage } from '@/pages/RecommendPage';
import { VisualizationPage } from '@/pages/VisualizationPage';
import { ExplorePage } from '@/pages/ExplorePage';
import { FavoritesPage } from '@/pages/FavoritesPage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/recommend" element={<RecommendPage />} />
              <Route path="/visualization" element={<VisualizationPage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
            </Routes>
          </Layout>
          <Toaster position="top-right" richColors />
        </Router>
      </FavoritesProvider>
    </ThemeProvider>
  );
}

export default App;
