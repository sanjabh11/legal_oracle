import React, { useState } from 'react';
import { AlertTriangle, Star, TrendingUp, Calendar } from 'lucide-react';

export function LandmarkPrediction() {
  const [predictionData, setPredictionData] = useState({
    jurisdiction: '',
    legalDomain: '',
    timeframe: '1_year',
  });
  const [predictions, setPredictions] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const jurisdictions = [
    { value: 'US_supreme', label: 'US Supreme Court' },
    { value: 'US_federal', label: 'US Federal Courts' },
    { value: 'california', label: 'California Supreme Court' },
    { value: 'new_york', label: 'New York Court of Appeals' },
    { value: 'EU_court', label: 'European Court of Justice' },
  ];

  const legalDomains = [
    { value: 'constitutional_law', label: 'Constitutional Law' },
    { value: 'privacy_rights', label: 'Privacy Rights' },
    { value: 'intellectual_property', label: 'Intellectual Property' },
    { value: 'employment_law', label: 'Employment Law' },
    { value: 'corporate_law', label: 'Corporate Law' },
    { value: 'environmental_law', label: 'Environmental Law' },
  ];

  const timeframes = [
    { value: '6_months', label: '6 Months' },
    { value: '1_year', label: '1 Year' },
    { value: '2_years', label: '2 Years' },
    { value: '5_years', label: '5 Years' },
  ];

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const mockPredictions = {
        potentialLandmarks: [
          {
            caseName: 'TechCorp v. Privacy Coalition',
            probability: 87,
            significance: 'Very High',
            domain: 'Privacy Rights',
            currentStatus: 'Pending Supreme Court Review',
            keyIssues: [
              'AI surveillance constitutionality',
              'Fourth Amendment digital privacy',
              'Corporate data collection limits',
            ],
            potentialImpact: 'Could establish fundamental digital privacy rights framework',
            timeline: 'Decision expected Q2 2025',
            stakeholders: ['Tech industry', 'Privacy advocates', 'Government agencies'],
          },
          {
            caseName: 'Workers United v. AutomationCorp',
            probability: 73,
            significance: 'High',
            domain: 'Employment Law',
            currentStatus: 'Circuit Court Appeal',
            keyIssues: [
              'AI displacement compensation',
              'Retraining obligations',
              'Collective bargaining rights',
            ],
            potentialImpact: 'May define employer obligations in AI automation',
            timeline: 'Decision expected Q4 2025',
            stakeholders: ['Labor unions', 'Technology companies', 'Workers'],
          },
          {
            caseName: 'State of California v. ClimateEnergy Inc.',
            probability: 68,
            significance: 'High',
            domain: 'Environmental Law',
            currentStatus: 'State Supreme Court',
            keyIssues: [
              'Corporate climate liability',
              'Environmental justice',
              'Regulatory enforcement',
            ],
            potentialImpact: 'Could establish corporate climate change liability standards',
            timeline: 'Decision expected Q1 2026',
            stakeholders: ['Environmental groups', 'Energy companies', 'State governments'],
          },
        ],
        trendAnalysis: {
          emergingThemes: [
            'AI and technology regulation',
            'Digital privacy and surveillance',
            'Climate change liability',
            'Gig economy worker rights',
            'Cryptocurrency regulation',
          ],
          jurisdictionalFocus: {
            'US Supreme Court': 'Constitutional technology issues',
            'Federal Courts': 'Interstate commerce and digital rights',
            'State Courts': 'Local implementation of federal standards',
          },
        },
        historicalContext: {
          recentLandmarks: [
            {
              case: 'Carpenter v. United States (2018)',
              impact: 'Established digital privacy protections',
              relevance: 'Foundation for current privacy cases',
            },
            {
              case: 'Janus v. AFSCME (2018)',
              impact: 'Limited union collective bargaining',
              relevance: 'Influences current labor disputes',
            },
          ],
          patternAnalysis: 'Courts increasingly addressing technology-society intersection',
        },
        riskFactors: [
          'Political composition changes in courts',
          'Legislative preemption of judicial decisions',
          'Settlement before landmark ruling',
          'Procedural dismissals avoiding substantive issues',
        ],
        monitoringRecommendations: [
          'Track cert petitions in technology cases',
          'Monitor amicus brief filings',
          'Follow oral argument scheduling',
          'Watch for emergency stays or injunctions',
        ],
      };

      setPredictions(mockPredictions);
      setLoading(false);
    }, 2500);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="h-8 w-8 text-yellow-600" />
          <h1 className="text-3xl font-bold text-gray-900">Landmark Case Prediction</h1>
        </div>
        <p className="text-gray-600">
          Predict which current cases are likely to become landmark legal decisions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Prediction Parameters</h2>
            
            <form onSubmit={handlePredict} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jurisdiction
                </label>
                <select
                  value={predictionData.jurisdiction}
                  onChange={(e) => setPredictionData({ ...predictionData, jurisdiction: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                  required
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Legal Domain
                </label>
                <select
                  value={predictionData.legalDomain}
                  onChange={(e) => setPredictionData({ ...predictionData, legalDomain: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                  required
                >
                  <option value="">Select legal domain</option>
                  {legalDomains.map((domain) => (
                    <option key={domain.value} value={domain.value}>
                      {domain.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Prediction Timeframe
                </label>
                <select
                  value={predictionData.timeframe}
                  onChange={(e) => setPredictionData({ ...predictionData, timeframe: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                >
                  {timeframes.map((timeframe) => (
                    <option key={timeframe.value} value={timeframe.value}>
                      {timeframe.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-600 text-white py-3 px-4 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Analyzing Cases...' : 'Predict Landmark Cases'}
              </button>
            </form>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          {loading && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Analyzing potential landmark cases...</p>
              </div>
            </div>
          )}

          {predictions && !loading && (
            <div className="space-y-6">
              {/* Potential Landmarks */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-600" />
                  Potential Landmark Cases
                </h3>
                
                <div className="space-y-6">
                  {predictions.potentialLandmarks.map((landmark: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6 hover:border-yellow-300 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-xl font-semibold text-gray-900 flex items-center">
                            {landmark.caseName}
                            {index === 0 && <Star className="h-5 w-5 text-yellow-500 ml-2" />}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">{landmark.currentStatus}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-yellow-600">{landmark.probability}%</div>
                          <div className="text-sm text-gray-500">Landmark Probability</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium text-gray-700 mb-2">Key Issues</h5>
                          <ul className="space-y-1">
                            {landmark.keyIssues.map((issue: string, i: number) => (
                              <li key={i} className="text-sm text-gray-600 flex items-start">
                                <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mr-2 mt-2"></div>
                                {issue}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-medium text-gray-700 mb-2">Stakeholders</h5>
                          <div className="flex flex-wrap gap-2">
                            {landmark.stakeholders.map((stakeholder: string, i: number) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                              >
                                {stakeholder}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                        <h5 className="font-medium text-yellow-900 mb-2">Potential Impact</h5>
                        <p className="text-yellow-800 text-sm">{landmark.potentialImpact}</p>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          landmark.significance === 'Very High' ? 'bg-red-100 text-red-800' :
                          landmark.significance === 'High' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {landmark.significance} Significance
                        </span>
                        <span className="text-sm text-gray-600">{landmark.timeline}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trend Analysis */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-yellow-600" />
                  Trend Analysis
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Emerging Themes</h4>
                    <ul className="space-y-2">
                      {predictions.trendAnalysis.emergingThemes.map((theme: string, index: number) => (
                        <li key={index} className="flex items-start text-sm">
                          <TrendingUp className="h-4 w-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{theme}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Jurisdictional Focus</h4>
                    <div className="space-y-3">
                      {Object.entries(predictions.trendAnalysis.jurisdictionalFocus).map(([jurisdiction, focus]: [string, any]) => (
                        <div key={jurisdiction} className="p-3 bg-gray-50 rounded-lg">
                          <div className="font-medium text-gray-700 text-sm">{jurisdiction}</div>
                          <div className="text-xs text-gray-600 mt-1">{focus}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Historical Context */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Historical Context</h3>
                
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Recent Landmark Cases</h4>
                  <div className="space-y-3">
                    {predictions.historicalContext.recentLandmarks.map((landmark: any, index: number) => (
                      <div key={index} className="border-l-4 border-yellow-600 pl-4">
                        <h5 className="font-medium text-gray-900">{landmark.case}</h5>
                        <p className="text-sm text-gray-600 mt-1">{landmark.impact}</p>
                        <p className="text-xs text-gray-500 mt-1">Relevance: {landmark.relevance}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Pattern Analysis</h4>
                  <p className="text-blue-800 text-sm">{predictions.historicalContext.patternAnalysis}</p>
                </div>
              </div>

              {/* Risk Factors & Monitoring */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                    Risk Factors
                  </h3>
                  <ul className="space-y-2">
                    {predictions.riskFactors.map((risk: string, index: number) => (
                      <li key={index} className="flex items-start text-sm">
                        <AlertTriangle className="h-4 w-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Monitoring Recommendations</h3>
                  <ul className="space-y-2">
                    {predictions.monitoringRecommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start text-sm">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {!predictions && !loading && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-500 text-center py-12">
                Select parameters to predict potential landmark cases
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}