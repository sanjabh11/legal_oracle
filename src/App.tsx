import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import { Navigation } from './components/Navigation';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { OutcomePrediction } from './pages/OutcomePrediction';
import { StrategyOptimization } from './pages/StrategyOptimization';
import { StrategySimulation } from './pages/StrategySimulation';
import { RegulatoryForecasting } from './pages/RegulatoryForecasting';
import { JurisdictionOptimization } from './pages/JurisdictionOptimization';
import { PrecedentSimulation } from './pages/PrecedentSimulation';
import { LegalEvolution } from './pages/LegalEvolution';
import { ComplianceOptimization } from './pages/ComplianceOptimization';
import { LandmarkPrediction } from './pages/LandmarkPrediction';
import { ArbitrageAlerts } from './pages/ArbitrageAlerts';
import { AuthPage } from './pages/AuthPage';
import { ProfilePage } from './pages/ProfilePage';
import { PrivateRoute } from './components/PrivateRoute';
import { CaseLawDemo } from './pages/CaseLawDemo';
import { GlobalLegalSearchModal } from './components/GlobalLegalSearchModal';

function App() {
  const [searchModalOpen, setSearchModalOpen] = React.useState(false);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <GlobalLegalSearchModal open={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            <Route path="/outcome-prediction" element={<PrivateRoute><OutcomePrediction /></PrivateRoute>} />
            <Route path="/strategy-optimization" element={<PrivateRoute><StrategyOptimization /></PrivateRoute>} />
            <Route path="/strategy-simulation" element={<PrivateRoute><StrategySimulation /></PrivateRoute>} />
            <Route path="/regulatory-forecasting" element={<PrivateRoute><RegulatoryForecasting /></PrivateRoute>} />
            <Route path="/jurisdiction-optimization" element={<PrivateRoute><JurisdictionOptimization /></PrivateRoute>} />
            <Route path="/precedent-simulation" element={<PrivateRoute><PrecedentSimulation /></PrivateRoute>} />
            <Route path="/legal-evolution" element={<PrivateRoute><LegalEvolution /></PrivateRoute>} />
            <Route path="/compliance-optimization" element={<PrivateRoute><ComplianceOptimization /></PrivateRoute>} />
            <Route path="/landmark-prediction" element={<PrivateRoute><LandmarkPrediction /></PrivateRoute>} />
            <Route path="/arbitrage-alerts" element={<PrivateRoute><ArbitrageAlerts /></PrivateRoute>} />
            {/* Demo: CaseLaw API integration */}
            <Route path="/caselaw-demo" element={<CaseLawDemo />} />
          </Routes>
          <ToastContainer position="top-right" autoClose={5000} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;