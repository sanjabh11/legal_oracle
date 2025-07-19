import React, { useState } from 'react';
import { Activity, Play, BarChart3, Users } from 'lucide-react';

export function StrategySimulation() {
  const [simulationData, setSimulationData] = useState({
    caseId: '',
    strategy: '',
    opponentType: 'opposing_counsel',
    courtType: '',
  });
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const opponentTypes = [
    { value: 'opposing_counsel', label: 'Opposing Counsel' },
    { value: 'judge', label: 'Judge' },
    { value: 'jury', label: 'Jury' },
    { value: 'arbitrator', label: 'Arbitrator' },
  ];

  const courtTypes = [
    { value: 'state_superior', label: 'State Superior Court' },
    { value: 'federal_district', label: 'Federal District Court' },
    { value: 'appellate', label: 'Appellate Court' },
    { value: 'arbitration', label: 'Arbitration Panel' },
  ];

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const mockResults = {
        simulationId: `sim_${Date.now()}`,
        successRate: Math.floor(Math.random() * 30) + 60,
        strengths: [
          'Strong opening argument structure',
          'Effective use of precedent',
          'Clear evidence presentation',
          'Compelling narrative flow',
        ],
        weaknesses: [
          'Insufficient response to potential objections',
          'Limited alternative evidence paths',
          'Weak closing argument',
        ],
        opponentResponse: {
          strategy: 'Counter-narrative with procedural challenges',
          likelihood: Math.floor(Math.random() * 40) + 50,
          expectedArguments: [
            'Challenge evidence admissibility',
            'Invoke statute of limitations',
            'Question witness credibility',
          ],
        },
        improvements: [
          'Strengthen rebuttal arguments',
          'Prepare backup evidence',
          'Address procedural vulnerabilities',
          'Develop stronger closing statement',
        ],
        benchmarkComparison: {
          averageSuccessRate: 65,
          topQuartile: 78,
          yourRank: 'Above Average',
        },
      };

      setResults(mockResults);
      setLoading(false);
    }, 2500);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Activity className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Strategy Simulation</h1>
        </div>
        <p className="text-gray-600">
          Test your legal strategies against AI-powered opponents and get detailed feedback
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Simulation Setup</h2>
          
          <form onSubmit={handleSimulate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Case ID (Optional)
              </label>
              <input
                type="text"
                value={simulationData.caseId}
                onChange={(e) => setSimulationData({ ...simulationData, caseId: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                placeholder="Reference existing case"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Strategy to Test
              </label>
              <textarea
                value={simulationData.strategy}
                onChange={(e) => setSimulationData({ ...simulationData, strategy: e.target.value })}
                rows={6}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                placeholder="Describe your legal strategy, arguments, or approach..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="inline h-4 w-4 mr-1" />
                Opponent Type
              </label>
              <select
                value={simulationData.opponentType}
                onChange={(e) => setSimulationData({ ...simulationData, opponentType: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
                {opponentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Court Type
              </label>
              <select
                value={simulationData.courtType}
                onChange={(e) => setSimulationData({ ...simulationData, courtType: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                required
              >
                <option value="">Select court type</option>
                {courtTypes.map((court) => (
                  <option key={court.value} value={court.value}>
                    {court.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Play className="h-5 w-5 mr-2" />
              {loading ? 'Running Simulation...' : 'Run Simulation'}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {loading && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Running simulation...</p>
                <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
              </div>
            </div>
          )}

          {results && !loading && (
            <>
              {/* Success Rate */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                  Simulation Results
                </h3>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">
                    {results.successRate}%
                  </div>
                  <p className="text-gray-600">Predicted Success Rate</p>
                  <div className="mt-4 bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-purple-600 h-3 rounded-full"
                      style={{ width: `${results.successRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Strategy Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-green-700 mb-3">Strengths</h4>
                    <ul className="space-y-2">
                      {results.strengths.map((strength: string, index: number) => (
                        <li key={index} className="flex items-start text-sm">
                          <div className="w-2 h-2 bg-green-600 rounded-full mr-3 mt-2"></div>
                          <span className="text-gray-700">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-red-700 mb-3">Weaknesses</h4>
                    <ul className="space-y-2">
                      {results.weaknesses.map((weakness: string, index: number) => (
                        <li key={index} className="flex items-start text-sm">
                          <div className="w-2 h-2 bg-red-600 rounded-full mr-3 mt-2"></div>
                          <span className="text-gray-700">{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Opponent Response */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Predicted Opponent Response</h3>
                <div className="bg-red-50 p-4 rounded-lg mb-4">
                  <h4 className="font-medium text-red-900 mb-2">Likely Counter-Strategy</h4>
                  <p className="text-red-800">{results.opponentResponse.strategy}</p>
                  <p className="text-sm text-red-700 mt-2">
                    Likelihood: {results.opponentResponse.likelihood}%
                  </p>
                </div>
                
                <h4 className="font-medium text-gray-900 mb-3">Expected Arguments</h4>
                <ul className="space-y-2">
                  {results.opponentResponse.expectedArguments.map((arg: string, index: number) => (
                    <li key={index} className="flex items-start text-sm">
                      <div className="w-2 h-2 bg-orange-600 rounded-full mr-3 mt-2"></div>
                      <span className="text-gray-700">{arg}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvements */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Improvements</h3>
                <ul className="space-y-3">
                  {results.improvements.map((improvement: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2"></div>
                      <span className="text-gray-700">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benchmark Comparison */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Benchmark Comparison</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-600">
                      {results.benchmarkComparison.averageSuccessRate}%
                    </div>
                    <div className="text-sm text-gray-500">Average</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {results.successRate}%
                    </div>
                    <div className="text-sm text-gray-500">Your Score</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {results.benchmarkComparison.topQuartile}%
                    </div>
                    <div className="text-sm text-gray-500">Top 25%</div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    results.benchmarkComparison.yourRank === 'Above Average' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {results.benchmarkComparison.yourRank}
                  </span>
                </div>
              </div>
            </>
          )}

          {!results && !loading && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-500 text-center py-12">
                Set up your simulation parameters to test your strategy
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}