import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  TrendingUp, 
  Scale, 
  Globe,
  Shield,
  Zap,
  Activity,
  BarChart3,
  FileText,
  AlertTriangle 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cases } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { QuickCaseLawSearch } from '../components/QuickCaseLawSearch';

export function Dashboard() {
  const { user } = useAuth();
  const [recentCases, setRecentCases] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Try to load cases from the API
        const casesData = await cases.getCases();
        // Fallback to empty array if undefined/null
        setRecentCases(Array.isArray(casesData) ? casesData : []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Fallback: load cases from LocalStorage if available
        const cachedCases = localStorage.getItem('legal_oracle_cases');
        if (cachedCases) {
          try {
            setRecentCases(JSON.parse(cachedCases));
          } catch (e) {
            console.warn('Failed to parse cached cases:', e);
          }
        }
      } finally {
        // Always attempt to load alerts from LocalStorage
        const cachedAlerts = localStorage.getItem('legal_oracle_alerts');
        if (cachedAlerts) {
          try {
            setAlerts(JSON.parse(cachedAlerts));
          } catch (e) {
            console.warn('Failed to parse cached alerts:', e);
          }
        }
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const features = [
    {
      title: 'Outcome Prediction',
      description: 'Predict case outcomes with AI-powered analysis',
      icon: <Brain className="h-8 w-8 text-blue-600" />,
      href: '/outcome-prediction',
      color: 'bg-blue-50 hover:bg-blue-100',
      roles: ['individual', 'lawyer', 'business'],
    },
    {
      title: 'Strategy Optimization',
      description: 'Optimize legal strategies for maximum success',
      icon: <TrendingUp className="h-8 w-8 text-green-600" />,
      href: '/strategy-optimization',
      color: 'bg-green-50 hover:bg-green-100',
      roles: ['individual', 'lawyer'],
    },
    {
      title: 'Strategy Simulation',
      description: 'Test strategies against AI opponents',
      icon: <Activity className="h-8 w-8 text-purple-600" />,
      href: '/strategy-simulation',
      color: 'bg-purple-50 hover:bg-purple-100',
      roles: ['lawyer'],
    },
    {
      title: 'Regulatory Forecasting',
      description: 'Forecast upcoming regulatory changes',
      icon: <BarChart3 className="h-8 w-8 text-orange-600" />,
      href: '/regulatory-forecasting',
      color: 'bg-orange-50 hover:bg-orange-100',
      roles: ['business', 'researcher', 'scholar'],
    },
    {
      title: 'Jurisdiction Optimization',
      description: 'Find the best jurisdiction for your case',
      icon: <Globe className="h-8 w-8 text-indigo-600" />,
      href: '/jurisdiction-optimization',
      color: 'bg-indigo-50 hover:bg-indigo-100',
      roles: ['lawyer', 'business'],
    },
    {
      title: 'Precedent Simulation',
      description: 'Simulate the impact of legal precedents',
      icon: <Scale className="h-8 w-8 text-gray-600" />,
      href: '/precedent-simulation',
      color: 'bg-gray-50 hover:bg-gray-100',
      roles: ['judge', 'researcher', 'scholar'],
    },
    {
      title: 'Legal Evolution',
      description: 'Model long-term legal trends',
      icon: <FileText className="h-8 w-8 text-teal-600" />,
      href: '/legal-evolution',
      color: 'bg-teal-50 hover:bg-teal-100',
      roles: ['researcher', 'scholar'],
    },
    {
      title: 'Compliance Optimization',
      description: 'Optimize compliance strategies',
      icon: <Shield className="h-8 w-8 text-red-600" />,
      href: '/compliance-optimization',
      color: 'bg-red-50 hover:bg-red-100',
      roles: ['business'],
    },
    {
      title: 'Landmark Prediction',
      description: 'Predict future landmark cases',
      icon: <AlertTriangle className="h-8 w-8 text-yellow-600" />,
      href: '/landmark-prediction',
      color: 'bg-yellow-50 hover:bg-yellow-100',
      roles: ['scholar', 'researcher'],
    },
    {
      title: 'Arbitrage Alerts',
      description: 'Receive legal arbitrage opportunities',
      icon: <Zap className="h-8 w-8 text-pink-600" />,
      href: '/arbitrage-alerts',
      color: 'bg-pink-50 hover:bg-pink-100',
      roles: ['individual', 'lawyer', 'business'],
    },
  ];

  const relevantFeatures = features.filter(feature => 
    feature.roles.includes(user?.role || 'individual')
  );

  const stats = [
    { label: 'Cases Analyzed', value: '12,847', change: '+12%' },
    { label: 'Success Rate', value: '87.3%', change: '+3.2%' },
    { label: 'Predictions Made', value: '2,431', change: '+8%' },
    { label: 'Alerts Generated', value: '156', change: '+15%' },
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="large" text="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Quick CaseLaw Search Widget */}
      <QuickCaseLawSearch />
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.isGuest ? `Guest (${user.role})` : user?.email}
        </h1>
        <p className="text-gray-600 mt-2">
          Your personalized legal intelligence dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="text-green-600 text-sm font-medium">
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Features Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relevantFeatures.map((feature, index) => (
            <Link
              key={index}
              to={feature.href}
              className={`block p-6 rounded-lg border border-gray-200 transition-colors ${feature.color}`}
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">{feature.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Cases</h3>
          {recentCases.length > 0 ? (
            <div className="space-y-3">
              {recentCases.slice(0, 5).map((recentCase: any, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{recentCase.title}</p>
                    <p className="text-sm text-gray-600">{recentCase.type}</p>
                  </div>
                  <div className="text-sm text-gray-500">{recentCase.date}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No recent cases. Start by using one of the features above.
            </p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Alerts</h3>
          {alerts.length > 0 ? (
            <div className="space-y-3">
              {alerts.slice(0, 5).map((alert: any, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">{alert.title}</p>
                    <p className="text-sm text-gray-600">{alert.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No active alerts. We'll notify you of relevant opportunities.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}