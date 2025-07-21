import { useState, useEffect, useCallback } from 'react';
import { Zap, Bell, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { arbitrage } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

interface Alert {
  id: string;
  title: string;
  description: string;
  urgency: 'High' | 'Medium' | 'Low';
  potentialSavings: number;
  expirationDate: string;
  confidence: number;
  actionRequired: string;
  jurisdiction: string;
  created: string;
}

export function ArbitrageAlerts() {
  const { user } = useAuth();
  const [alertSettings, setAlertSettings] = useState({
    userRole: user?.role || 'individual',
    jurisdiction: '',
    legalInterests: [] as string[],
    alertFrequency: 'daily',
  });
    const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const jurisdictions = [
    { value: 'california', label: 'California' },
    { value: 'new_york', label: 'New York' },
    { value: 'texas', label: 'Texas' },
    { value: 'florida', label: 'Florida' },
    { value: 'federal', label: 'Federal' },
  ];

  const legalInterests = [
    { value: 'tax', label: 'Tax Advantages' },
    { value: 'contracts', label: 'Contract Optimization' },
    { value: 'intellectual_property', label: 'IP Protection' },
    { value: 'employment', label: 'Employment Law' },
    { value: 'corporate', label: 'Corporate Structure' },
    { value: 'real_estate', label: 'Real Estate' },
  ];

  const frequencies = [
    { value: 'realtime', label: 'Real-time' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ];

  const handleSaveSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Save settings to localStorage
      localStorage.setItem('legal_oracle_alert_settings', JSON.stringify(alertSettings));
      
      // Only generate alerts if jurisdiction and at least one interest is selected
      if (alertSettings.jurisdiction && alertSettings.legalInterests.length > 0) {
        // Get alerts from API
        const result = await arbitrage.getAlerts(
          alertSettings.userRole,
          alertSettings.jurisdiction,
          alertSettings.legalInterests,
          alertSettings.alertFrequency
        );
        
        setAlerts(result.opportunities);
      }
    } catch (error) {
      console.error('Error saving alert settings:', error);
      setError('Failed to save settings or generate alerts. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [alertSettings]);

  useEffect(() => {
    // Load existing alerts and settings
    const fetchData = async () => {
      try {
        // Load alert settings
        const settings = await arbitrage.getAlertSettings();
        if (settings) {
          setAlertSettings(settings);
        }
        
        // Load existing alerts from localStorage
        const savedAlerts = localStorage.getItem('legal_oracle_alerts');
        if (savedAlerts) {
          setAlerts(JSON.parse(savedAlerts));
        } else {
          // Generate some mock alerts if settings are available and jurisdiction is set
          if (settings && settings.jurisdiction) {
            await handleSaveSettings();
          }
        }
      } catch (error) {
        console.error('Error loading alerts:', error);
      } finally {
        setSettingsLoading(false);
      }
    };
    
    fetchData();
  }, [handleSaveSettings]);

  const handleInterestToggle = (interest: string) => {
    setAlertSettings(prev => ({
      ...prev,
      legalInterests: prev.legalInterests.includes(interest)
        ? prev.legalInterests.filter(i => i !== interest)
        : [...prev.legalInterests, interest]
    }));
  };



  const dismissAlert = (alertId: string) => {
    const updatedAlerts = alerts.filter(alert => alert.id !== alertId);
    setAlerts(updatedAlerts);
    localStorage.setItem('legal_oracle_alerts', JSON.stringify(updatedAlerts));
  };

  if (settingsLoading) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="large" color="pink" text="Loading alert settings..." />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Zap className="h-8 w-8 text-pink-600" />
          <h1 className="text-3xl font-bold text-gray-900">Legal Arbitrage Alerts</h1>
        </div>
        <p className="text-gray-600">
          Receive alerts for temporary legal advantages and optimization opportunities
        </p>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorMessage message={error} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Alert Settings */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Bell className="h-5 w-5 mr-2 text-pink-600" />
              Alert Settings
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User Role
                </label>
                <select
                  value={alertSettings.userRole}
                  onChange={(e) => setAlertSettings({ ...alertSettings, userRole: e.target.value as any })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                >
                  <option value="individual">Individual</option>
                  <option value="lawyer">Lawyer</option>
                  <option value="business">Business</option>
                  <option value="researcher">Researcher</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Jurisdiction
                </label>
                <select
                  value={alertSettings.jurisdiction}
                  onChange={(e) => setAlertSettings({ ...alertSettings, jurisdiction: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                >
                  <option value="">Select jurisdiction</option>
                  {jurisdictions.map((jurisdiction) => (
                    <option key={jurisdiction.value} value={jurisdiction.value}>
                      {jurisdiction.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Legal Interests
                </label>
                <div className="space-y-2">
                  {legalInterests.map((interest) => (
                    <label key={interest.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={alertSettings.legalInterests.includes(interest.value)}
                        onChange={() => handleInterestToggle(interest.value)}
                        className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{interest.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alert Frequency
                </label>
                <select
                  value={alertSettings.alertFrequency}
                  onChange={(e) => setAlertSettings({ ...alertSettings, alertFrequency: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                >
                  {frequencies.map((frequency) => (
                    <option key={frequency.value} value={frequency.value}>
                      {frequency.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSaveSettings}
                disabled={loading}
                className="w-full bg-pink-600 text-white py-3 px-4 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Alert Settings'}
              </button>
            </div>
          </div>
        </div>

        {/* Active Alerts */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Active Alerts</h2>
              <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium">
                {alerts.length} Active
              </span>
            </div>

            {loading && (
              <div className="text-center py-12">
                <LoadingSpinner size="large" color="pink" text="Generating alerts..." />
              </div>
            )}

            {!loading && alerts.length > 0 ? (
              <div className="space-y-6">
                {alerts.map((alert) => (
                  <div key={alert.id} className="border border-gray-200 rounded-lg p-6 hover:border-pink-300 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                          {alert.title}
                          <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${
                            alert.urgency === 'High' ? 'bg-red-100 text-red-800' :
                            alert.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {alert.urgency} Priority
                          </span>
                        </h3>
                        <p className="text-gray-600 mt-2">{alert.description}</p>
                      </div>
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ×
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center">
                        <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-700">Potential Value</div>
                          <div className="text-sm text-gray-600">{alert.potentialSavings}</div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-orange-600 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-700">Expires</div>
                          <div className="text-sm text-gray-600">
                            {new Date(alert.expirationDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-700">Confidence</div>
                          <div className="text-sm text-gray-600">{alert.confidence}%</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-pink-50 p-4 rounded-lg mb-4">
                      <h4 className="font-medium text-pink-900 mb-2">Action Required</h4>
                      <p className="text-pink-800 text-sm">{alert.actionRequired}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">
                          {alert.jurisdiction}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(alert.created).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="px-4 py-2 bg-pink-600 text-white rounded-md text-sm hover:bg-pink-700 transition-colors">
                          Take Action
                        </button>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50 transition-colors">
                          Learn More
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : !loading ? (
              <div className="text-center py-12">
                <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No active alerts</p>
                <p className="text-sm text-gray-400">
                  Configure your alert settings to start receiving legal arbitrage opportunities
                </p>
              </div>
            ) : null}
          </div>

          {/* Alert Statistics */}
          {alerts.length > 0 && !loading && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-2xl font-bold text-pink-600">{alerts.length}</div>
                <div className="text-sm text-gray-600">Active Alerts</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {alerts.filter(a => a.urgency === 'High').length}
                </div>
                <div className="text-sm text-gray-600">High Priority</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(alerts.reduce((sum: number, alert) => sum + alert.confidence, 0) / alerts.length)}%
                </div>
                <div className="text-sm text-gray-600">Avg Confidence</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}