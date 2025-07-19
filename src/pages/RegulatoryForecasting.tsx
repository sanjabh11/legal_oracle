import React, { useState } from 'react';
import { BarChart3, TrendingUp, AlertTriangle, Calendar } from 'lucide-react';

export function RegulatoryForecasting() {
  const [forecastData, setForecastData] = useState({
    industry: '',
    jurisdiction: '',
    timeHorizon: '2_years',
  });
  const [forecast, setForecast] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const industries = [
    { value: 'tech', label: 'Technology' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'finance', label: 'Financial Services' },
    { value: 'energy', label: 'Energy & Utilities' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'retail', label: 'Retail & E-commerce' },
  ];

  const jurisdictions = [
    { value: 'US', label: 'United States' },
    { value: 'EU', label: 'European Union' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'CA', label: 'Canada' },
    { value: 'global', label: 'Global' },
  ];

  const timeHorizons = [
    { value: '1_year', label: '1 Year' },
    { value: '2_years', label: '2 Years' },
    { value: '5_years', label: '5 Years' },
    { value: '10_years', label: '10 Years' },
  ];

  const handleForecast = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const mockForecast = {
        predictedChanges: [
          {
            regulation: 'AI Transparency Act',
            probability: 85,
            timeline: 'Q2 2025',
            impact: 'High',
            description: 'New requirements for AI system transparency and explainability',
            businessImpact: 'Mandatory AI auditing and documentation processes',
          },
          {
            regulation: 'Digital Privacy Enhancement',
            probability: 72,
            timeline: 'Q4 2025',
            impact: 'Medium',
            description: 'Stricter data collection and processing requirements',
            businessImpact: 'Updated consent mechanisms and data handling procedures',
          },
          {
            regulation: 'Algorithmic Accountability Framework',
            probability: 68,
            timeline: 'Q1 2026',
            impact: 'High',
            description: 'Framework for algorithmic decision-making accountability',
            businessImpact: 'Regular algorithm audits and bias testing requirements',
          },
        ],
        trendAnalysis: {
          emergingThemes: [
            'Increased AI regulation and oversight',
            'Enhanced consumer privacy protections',
            'Cross-border data governance harmonization',
            'Sustainability and ESG compliance requirements',
          ],
          riskFactors: [
            'Regulatory fragmentation across jurisdictions',
            'Rapid technology evolution outpacing regulation',
            'Enforcement uncertainty in new frameworks',
          ],
        },
        preparationRecommendations: [
          'Establish AI governance committee',
          'Implement privacy-by-design principles',
          'Develop algorithm audit capabilities',
          'Create regulatory monitoring system',
          'Engage with policy makers and industry groups',
        ],
        confidenceScore: 78,
      };

      setForecast(mockForecast);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <BarChart3 className="h-8 w-8 text-orange-600" />
          <h1 className="text-3xl font-bold text-gray-900">Regulatory Forecasting</h1>
        </div>
        <p className="text-gray-600">
          Forecast upcoming regulatory changes and their potential impact on your business
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Forecast Parameters</h2>
            
            <form onSubmit={handleForecast} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry
                </label>
                <select
                  value={forecastData.industry}
                  onChange={(e) => setForecastData({ ...forecastData, industry: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  required
                >
                  <option value="">Select industry</option>
                  {industries.map((industry) => (
                    <option key={industry.value} value={industry.value}>
                      {industry.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jurisdiction
                </label>
                <select
                  value={forecastData.jurisdiction}
                  onChange={(e) => setForecastData({ ...forecastData, jurisdiction: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
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
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Time Horizon
                </label>
                <select
                  value={forecastData.timeHorizon}
                  onChange={(e) => setForecastData({ ...forecastData, timeHorizon: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                >
                  {timeHorizons.map((horizon) => (
                    <option key={horizon.value} value={horizon.value}>
                      {horizon.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 text-white py-3 px-4 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Generating Forecast...' : 'Generate Forecast'}
              </button>
            </form>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          {loading && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Analyzing regulatory trends...</p>
              </div>
            </div>
          )}

          {forecast && !loading && (
            <div className="space-y-6">
              {/* Confidence Score */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Forecast Confidence</h3>
                  <div className="text-2xl font-bold text-orange-600">{forecast.confidenceScore}%</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-orange-600 h-3 rounded-full"
                    style={{ width: `${forecast.confidenceScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Predicted Changes */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Predicted Regulatory Changes</h3>
                <div className="space-y-6">
                  {forecast.predictedChanges.map((change: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{change.regulation}</h4>
                          <p className="text-gray-600 mt-1">{change.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-500">Probability</div>
                          <div className="text-xl font-bold text-orange-600">{change.probability}%</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div>
                          <div className="text-sm font-medium text-gray-500">Timeline</div>
                          <div className="font-medium text-gray-900">{change.timeline}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-500">Impact Level</div>
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            change.impact === 'High' ? 'bg-red-100 text-red-800' :
                            change.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {change.impact}
                          </span>
                        </div>
                        <div className="md:col-span-1">
                          <div className="text-sm font-medium text-gray-500">Business Impact</div>
                          <div className="text-sm text-gray-700 mt-1">{change.businessImpact}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trend Analysis */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-orange-600" />
                  Trend Analysis
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-green-700 mb-3">Emerging Themes</h4>
                    <ul className="space-y-2">
                      {forecast.trendAnalysis.emergingThemes.map((theme: string, index: number) => (
                        <li key={index} className="flex items-start text-sm">
                          <TrendingUp className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{theme}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-red-700 mb-3">Risk Factors</h4>
                    <ul className="space-y-2">
                      {forecast.trendAnalysis.riskFactors.map((risk: string, index: number) => (
                        <li key={index} className="flex items-start text-sm">
                          <AlertTriangle className="h-4 w-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Preparation Recommendations */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Preparation Recommendations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {forecast.preparationRecommendations.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start p-4 bg-blue-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 font-medium">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!forecast && !loading && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-500 text-center py-12">
                Select your parameters to generate a regulatory forecast
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}