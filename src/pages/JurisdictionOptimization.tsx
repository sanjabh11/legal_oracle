import React, { useState } from 'react';
import { Globe, MapPin, Star, Clock } from 'lucide-react';

export function JurisdictionOptimization() {
  const [optimizationData, setOptimizationData] = useState({
    caseType: '',
    keyFacts: '',
    preferredOutcome: '',
    parties: '',
  });
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const caseTypes = [
    { value: 'contract_dispute', label: 'Contract Dispute' },
    { value: 'intellectual_property', label: 'Intellectual Property' },
    { value: 'corporate_law', label: 'Corporate Law' },
    { value: 'employment_law', label: 'Employment Law' },
    { value: 'personal_injury', label: 'Personal Injury' },
    { value: 'real_estate', label: 'Real Estate' },
  ];

  const outcomes = [
    { value: 'win', label: 'Win (Favorable Judgment)' },
    { value: 'settle', label: 'Settle (Quick Resolution)' },
    { value: 'minimize_costs', label: 'Minimize Costs' },
    { value: 'precedent', label: 'Set Legal Precedent' },
  ];

  const handleOptimize = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const mockRecommendations = {
        recommendedJurisdictions: [
          {
            jurisdiction: 'Delaware',
            score: 92,
            reasons: [
              'Highly experienced corporate courts',
              'Favorable business law precedents',
              'Efficient case processing',
              'Strong plaintiff protection',
            ],
            avgResolutionTime: '8-12 months',
            successRate: '78%',
            costs: 'Medium-High',
            pros: ['Expert judges', 'Predictable outcomes', 'Fast appeals'],
            cons: ['Higher filing fees', 'Competitive legal market'],
          },
          {
            jurisdiction: 'New York',
            score: 87,
            reasons: [
              'Comprehensive commercial courts',
              'Strong enforcement mechanisms',
              'International recognition',
              'Experienced counsel availability',
            ],
            avgResolutionTime: '12-18 months',
            successRate: '72%',
            costs: 'High',
            pros: ['Sophisticated legal market', 'Strong precedents', 'International expertise'],
            cons: ['High costs', 'Court congestion', 'Complex procedures'],
          },
          {
            jurisdiction: 'California',
            score: 81,
            reasons: [
              'Tech-friendly legal environment',
              'Strong consumer protections',
              'Innovative legal approaches',
              'Large attorney pool',
            ],
            avgResolutionTime: '10-15 months',
            successRate: '69%',
            costs: 'Medium-High',
            pros: ['Innovation-friendly', 'Consumer protection', 'Diverse expertise'],
            cons: ['Regulatory complexity', 'High living costs', 'Court backlog'],
          },
        ],
        comparisonFactors: {
          costEffectiveness: {
            delaware: 75,
            newYork: 60,
            california: 70,
          },
          timeEfficiency: {
            delaware: 85,
            newYork: 65,
            california: 75,
          },
          successProbability: {
            delaware: 78,
            newYork: 72,
            california: 69,
          },
        },
        keyConsiderations: [
          'Delaware offers the most predictable outcomes for corporate matters',
          'New York provides the strongest enforcement mechanisms',
          'California has the most tech-savvy legal environment',
          'Consider forum selection clauses in existing contracts',
          'Evaluate personal jurisdiction requirements',
        ],
      };

      setRecommendations(mockRecommendations);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Globe className="h-8 w-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">Jurisdiction Optimization</h1>
        </div>
        <p className="text-gray-600">
          Find the optimal jurisdiction for your case to maximize success probability and minimize costs
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Case Details</h2>
            
            <form onSubmit={handleOptimize} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Case Type
                </label>
                <select
                  value={optimizationData.caseType}
                  onChange={(e) => setOptimizationData({ ...optimizationData, caseType: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select case type</option>
                  {caseTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Facts & Context
                </label>
                <textarea
                  value={optimizationData.keyFacts}
                  onChange={(e) => setOptimizationData({ ...optimizationData, keyFacts: e.target.value })}
                  rows={4}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Describe key facts, contract terms, parties involved..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Outcome
                </label>
                <select
                  value={optimizationData.preferredOutcome}
                  onChange={(e) => setOptimizationData({ ...optimizationData, preferredOutcome: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select preferred outcome</option>
                  {outcomes.map((outcome) => (
                    <option key={outcome.value} value={outcome.value}>
                      {outcome.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Party Locations
                </label>
                <input
                  type="text"
                  value={optimizationData.parties}
                  onChange={(e) => setOptimizationData({ ...optimizationData, parties: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="e.g., Plaintiff in CA, Defendant in NY"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Analyzing...' : 'Find Optimal Jurisdiction'}
              </button>
            </form>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          {loading && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Analyzing jurisdictions...</p>
              </div>
            </div>
          )}

          {recommendations && !loading && (
            <div className="space-y-6">
              {/* Recommended Jurisdictions */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Recommended Jurisdictions</h3>
                
                <div className="space-y-6">
                  {recommendations.recommendedJurisdictions.map((jurisdiction: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6 hover:border-indigo-300 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-xl font-semibold text-gray-900 flex items-center">
                            {jurisdiction.jurisdiction}
                            {index === 0 && <Star className="h-5 w-5 text-yellow-500 ml-2" />}
                          </h4>
                          <div className="flex items-center mt-2">
                            <div className="text-2xl font-bold text-indigo-600 mr-4">
                              {jurisdiction.score}/100
                            </div>
                            <div className="text-sm text-gray-600">
                              <Clock className="inline h-4 w-4 mr-1" />
                              {jurisdiction.avgResolutionTime}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Success Rate</div>
                          <div className="text-lg font-bold text-green-600">{jurisdiction.successRate}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium text-gray-700 mb-2">Why This Jurisdiction</h5>
                          <ul className="space-y-1">
                            {jurisdiction.reasons.map((reason: string, i: number) => (
                              <li key={i} className="text-sm text-gray-600 flex items-start">
                                <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-2 mt-2"></div>
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <h6 className="font-medium text-green-700 text-sm mb-1">Pros</h6>
                              <ul className="space-y-1">
                                {jurisdiction.pros.slice(0, 3).map((pro: string, i: number) => (
                                  <li key={i} className="text-xs text-gray-600">• {pro}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h6 className="font-medium text-red-700 text-sm mb-1">Cons</h6>
                              <ul className="space-y-1">
                                {jurisdiction.cons.slice(0, 3).map((con: string, i: number) => (
                                  <li key={i} className="text-xs text-gray-600">• {con}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium text-gray-700">Estimated Costs: </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              jurisdiction.costs === 'High' ? 'bg-red-100 text-red-800' :
                              jurisdiction.costs.includes('Medium') ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {jurisdiction.costs}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comparison Chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Jurisdiction Comparison</h3>
                
                <div className="space-y-6">
                  {Object.entries(recommendations.comparisonFactors).map(([factor, scores]: [string, any]) => (
                    <div key={factor}>
                      <h4 className="font-medium text-gray-700 mb-3 capitalize">
                        {factor.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <div className="space-y-2">
                        {Object.entries(scores).map(([jurisdiction, score]: [string, any]) => (
                          <div key={jurisdiction} className="flex items-center">
                            <div className="w-20 text-sm text-gray-600 capitalize">{jurisdiction}</div>
                            <div className="flex-1 bg-gray-200 rounded-full h-2 mx-3">
                              <div
                                className="bg-indigo-600 h-2 rounded-full"
                                style={{ width: `${score}%` }}
                              ></div>
                            </div>
                            <div className="w-12 text-sm font-medium text-gray-900">{score}%</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Considerations */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Key Considerations</h3>
                <ul className="space-y-3">
                  {recommendations.keyConsiderations.map((consideration: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{consideration}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {!recommendations && !loading && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-500 text-center py-12">
                Enter your case details to get jurisdiction recommendations
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}