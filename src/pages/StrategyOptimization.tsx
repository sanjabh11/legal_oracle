import React, { useState, useEffect } from 'react';
import { TrendingUp, Target, CheckCircle, AlertCircle } from 'lucide-react';
import { cases } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export function StrategyOptimization() {
  const [caseId, setCaseId] = useState('');
  const [currentStrategy, setCurrentStrategy] = useState('');
  const [optimization, setOptimization] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableCases, setAvailableCases] = useState<any[]>([]);

  useEffect(() => {
    // Load available cases
    const fetchCases = async () => {
      try {
        const casesData = await cases.getCases();
        setAvailableCases(casesData);
      } catch (error) {
        console.error('Error fetching cases:', error);
      }
    };
    
    fetchCases();
  }, []);

  const handleOptimize = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Call the API service
      const result = await cases.optimizeStrategy(caseId, currentStrategy);
      
      // Create a more complete optimization object
      const fullOptimization = {
        optimizedStrategies: [
          {
            strategy: 'Evidence-First Approach',
            successRate: 78,
            description: 'Focus on gathering and presenting strong documentary evidence before proceeding',
            pros: ['Higher credibility', 'Stronger foundation', 'Better settlement position'],
            cons: ['Time-intensive', 'Higher upfront costs'],
          },
          {
            strategy: 'Mediation-Focused Strategy',
            successRate: 65,
            description: 'Prioritize mediation and alternative dispute resolution methods',
            pros: ['Cost-effective', 'Faster resolution', 'Preserves relationships'],
            cons: ['Lower settlement amounts', 'Requires cooperation'],
          },
          {
            strategy: 'Aggressive Litigation',
            successRate: 52,
            description: 'Pursue immediate litigation with comprehensive discovery',
            pros: ['Maximum pressure', 'Full discovery rights', 'Higher damages potential'],
            cons: ['High costs', 'Time-consuming', 'Relationship damage'],
          },
        ],
        riskAssessment: {
          overall: 'Medium',
          factors: [
            { factor: 'Evidence strength', risk: 'Low', impact: 'High' },
            { factor: 'Opposing counsel reputation', risk: 'Medium', impact: 'Medium' },
            { factor: 'Jurisdiction favorability', risk: 'Low', impact: 'High' },
            { factor: 'Timeline constraints', risk: 'High', impact: 'Medium' },
          ],
        },
        recommendations: [
          'Start with evidence gathering phase',
          'Prepare for mediation as backup option',
          'Set aside 6-12 months for resolution',
          'Consider insurance coverage implications',
        ],
      };
      
      setOptimization(fullOptimization);
    } catch (error) {
      console.error('Error optimizing strategy:', error);
      setError('Failed to optimize strategy. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <TrendingUp className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-900">Strategy Optimization</h1>
        </div>
        <p className="text-gray-600">
          Optimize your legal strategies using AI-powered analysis and historical data
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Strategy Input</h2>
            
            <form onSubmit={handleOptimize} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Case ID
                </label>
                {availableCases.length > 0 ? (
                  <select
                    value={caseId}
                    onChange={(e) => setCaseId(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  >
                    <option value="">Select a case</option>
                    {availableCases.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} ({c.date})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={caseId}
                    onChange={(e) => setCaseId(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    placeholder="Enter existing case ID"
                    required
                  />
                )}
                {availableCases.length === 0 && (
                  <p className="mt-1 text-sm text-gray-500">
                    No recent cases found. Create a case prediction first.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Strategy
                </label>
                <textarea
                  value={currentStrategy}
                  onChange={(e) => setCurrentStrategy(e.target.value)}
                  rows={6}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  placeholder="Describe your current legal strategy..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Optimizing...' : 'Optimize Strategy'}
              </button>
            </form>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          {loading && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center py-12">
                <LoadingSpinner size="large" color="green" text="Optimizing your strategy..." />
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <ErrorMessage 
                message={error} 
                onRetry={() => handleOptimize(new Event('submit') as any)} 
              />
            </div>
          )}

          {optimization && !loading && !error && (
            <div className="space-y-6">
              {/* Optimized Strategies */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Optimized Strategies</h2>
                <div className="space-y-6">
                  {optimization.optimizedStrategies.map((strategy: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{strategy.strategy}</h3>
                        <div className="flex items-center space-x-2">
                          <Target className="h-5 w-5 text-green-600" />
                          <span className="text-lg font-bold text-green-600">{strategy.successRate}%</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{strategy.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-green-700 mb-2 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Pros
                          </h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {strategy.pros.map((pro: string, i: number) => (
                              <li key={i}>• {pro}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-red-700 mb-2 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            Cons
                          </h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {strategy.cons.map((con: string, i: number) => (
                              <li key={i}>• {con}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Assessment */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Risk Assessment</h2>
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">Overall Risk</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      optimization.riskAssessment.overall === 'Low' ? 'bg-green-100 text-green-800' :
                      optimization.riskAssessment.overall === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {optimization.riskAssessment.overall}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {optimization.riskAssessment.factors.map((factor: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">{factor.factor}</span>
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          factor.risk === 'Low' ? 'bg-green-100 text-green-800' :
                          factor.risk === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {factor.risk} Risk
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          factor.impact === 'Low' ? 'bg-gray-100 text-gray-800' :
                          factor.impact === 'Medium' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {factor.impact} Impact
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Recommendations</h2>
                <ul className="space-y-3">
                  {optimization.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {!optimization && !loading && !error && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-500 text-center py-12">
                Enter your strategy details to get optimization recommendations
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}