import React, { useState } from 'react';
import { FileText, TrendingUp, Calendar, BarChart } from 'lucide-react';

export function LegalEvolution() {
  const [modelData, setModelData] = useState({
    legalDomain: '',
    timeHorizon: '10_years',
    jurisdiction: '',
    focusArea: '',
  });
  const [evolution, setEvolution] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const legalDomains = [
    { value: 'contract_law', label: 'Contract Law' },
    { value: 'constitutional_law', label: 'Constitutional Law' },
    { value: 'intellectual_property', label: 'Intellectual Property' },
    { value: 'employment_law', label: 'Employment Law' },
    { value: 'privacy_law', label: 'Privacy Law' },
    { value: 'corporate_law', label: 'Corporate Law' },
  ];

  const timeHorizons = [
    { value: '5_years', label: '5 Years' },
    { value: '10_years', label: '10 Years' },
    { value: '20_years', label: '20 Years' },
    { value: '50_years', label: '50 Years' },
  ];

  const jurisdictions = [
    { value: 'US', label: 'United States' },
    { value: 'EU', label: 'European Union' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'global', label: 'Global Trends' },
  ];

  const handleModel = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const mockEvolution = {
        trendAnalysis: {
          overallDirection: 'Increasing Digitalization',
          confidence: 87,
          keyDrivers: [
            'Technological advancement',
            'Changing social norms',
            'Economic pressures',
            'International harmonization',
          ],
        },
        historicalPatterns: [
          {
            period: '2000-2005',
            trend: 'Traditional paper-based contracts',
            significance: 'Baseline period',
            keyEvents: ['E-SIGN Act passage', 'Early e-commerce growth'],
          },
          {
            period: '2005-2010',
            trend: 'Digital signature adoption',
            significance: 'Moderate change',
            keyEvents: ['UETA widespread adoption', 'Cloud computing emergence'],
          },
          {
            period: '2010-2015',
            trend: 'Electronic contract platforms',
            significance: 'Significant shift',
            keyEvents: ['SaaS contract management', 'Mobile commerce growth'],
          },
          {
            period: '2015-2020',
            trend: 'Smart contract emergence',
            significance: 'Revolutionary change',
            keyEvents: ['Blockchain adoption', 'AI contract analysis'],
          },
          {
            period: '2020-2025',
            trend: 'AI-powered contract automation',
            significance: 'Transformational',
            keyEvents: ['COVID-19 digital acceleration', 'AI legal tools'],
          },
        ],
        futureProjections: [
          {
            timeframe: '2025-2030',
            prediction: 'Widespread AI contract generation',
            probability: 78,
            impact: 'High',
            description: 'AI will generate 60% of standard contracts automatically',
          },
          {
            timeframe: '2030-2035',
            prediction: 'Blockchain-based legal frameworks',
            probability: 65,
            impact: 'Very High',
            description: 'Smart contracts will handle routine legal transactions',
          },
          {
            timeframe: '2035-2040',
            prediction: 'Predictive legal compliance',
            probability: 52,
            impact: 'Revolutionary',
            description: 'AI systems will predict and prevent legal violations',
          },
        ],
        emergingConcepts: [
          {
            concept: 'Algorithmic Contract Terms',
            maturity: 'Early Stage',
            adoptionRate: 15,
            description: 'Contract terms that automatically adjust based on data',
          },
          {
            concept: 'Decentralized Legal Arbitration',
            maturity: 'Experimental',
            adoptionRate: 8,
            description: 'Blockchain-based dispute resolution systems',
          },
          {
            concept: 'Quantum-Secured Legal Documents',
            maturity: 'Research Phase',
            adoptionRate: 2,
            description: 'Quantum cryptography for legal document security',
          },
        ],
        riskFactors: [
          'Regulatory backlash against automation',
          'Privacy concerns with AI legal tools',
          'Digital divide in legal access',
          'Cybersecurity vulnerabilities',
        ],
      };

      setEvolution(mockEvolution);
      setLoading(false);
    }, 2500);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <FileText className="h-8 w-8 text-teal-600" />
          <h1 className="text-3xl font-bold text-gray-900">Legal Evolution Modeling</h1>
        </div>
        <p className="text-gray-600">
          Model long-term trends and evolution patterns in legal systems and practices
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Model Parameters</h2>
            
            <form onSubmit={handleModel} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Legal Domain
                </label>
                <select
                  value={modelData.legalDomain}
                  onChange={(e) => setModelData({ ...modelData, legalDomain: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
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
                  Time Horizon
                </label>
                <select
                  value={modelData.timeHorizon}
                  onChange={(e) => setModelData({ ...modelData, timeHorizon: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                >
                  {timeHorizons.map((horizon) => (
                    <option key={horizon.value} value={horizon.value}>
                      {horizon.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jurisdiction
                </label>
                <select
                  value={modelData.jurisdiction}
                  onChange={(e) => setModelData({ ...modelData, jurisdiction: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
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
                  Focus Area (Optional)
                </label>
                <input
                  type="text"
                  value={modelData.focusArea}
                  onChange={(e) => setModelData({ ...modelData, focusArea: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                  placeholder="e.g., Digital contracts, AI regulation"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 text-white py-3 px-4 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Modeling Evolution...' : 'Generate Evolution Model'}
              </button>
            </form>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          {loading && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Modeling legal evolution...</p>
              </div>
            </div>
          )}

          {evolution && !loading && (
            <div className="space-y-6">
              {/* Trend Analysis */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-teal-600" />
                  Trend Analysis
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Overall Direction</h4>
                    <p className="text-lg font-semibold text-teal-600 mb-4">
                      {evolution.trendAnalysis.overallDirection}
                    </p>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">Confidence:</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-teal-600 h-2 rounded-full"
                          style={{ width: `${evolution.trendAnalysis.confidence}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{evolution.trendAnalysis.confidence}%</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Key Drivers</h4>
                    <ul className="space-y-2">
                      {evolution.trendAnalysis.keyDrivers.map((driver: string, index: number) => (
                        <li key={index} className="flex items-start text-sm">
                          <div className="w-2 h-2 bg-teal-600 rounded-full mr-3 mt-2"></div>
                          <span className="text-gray-700">{driver}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Historical Patterns */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Historical Evolution Patterns</h3>
                
                <div className="space-y-4">
                  {evolution.historicalPatterns.map((pattern: any, index: number) => (
                    <div key={index} className="border-l-4 border-teal-600 pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{pattern.period}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          pattern.significance === 'Revolutionary change' || pattern.significance === 'Transformational' 
                            ? 'bg-red-100 text-red-800' :
                          pattern.significance === 'Significant shift' 
                            ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                        }`}>
                          {pattern.significance}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2">{pattern.trend}</p>
                      <div className="text-sm text-gray-600">
                        <strong>Key Events:</strong> {pattern.keyEvents.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Future Projections */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <BarChart className="h-5 w-5 mr-2 text-teal-600" />
                  Future Projections
                </h3>
                
                <div className="space-y-6">
                  {evolution.futureProjections.map((projection: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{projection.timeframe}</h4>
                          <p className="text-lg text-teal-600 font-semibold">{projection.prediction}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Probability</div>
                          <div className="text-xl font-bold text-teal-600">{projection.probability}%</div>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-3">{projection.description}</p>
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                        projection.impact === 'Revolutionary' ? 'bg-purple-100 text-purple-800' :
                        projection.impact === 'Very High' ? 'bg-red-100 text-red-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {projection.impact} Impact
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emerging Concepts */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Emerging Concepts</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {evolution.emergingConcepts.map((concept: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">{concept.concept}</h4>
                      <p className="text-sm text-gray-600 mb-3">{concept.description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Maturity:</span>
                          <span className="font-medium">{concept.maturity}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Adoption:</span>
                          <span className="font-medium">{concept.adoptionRate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-teal-600 h-2 rounded-full"
                            style={{ width: `${concept.adoptionRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Factors */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Risk Factors</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {evolution.riskFactors.map((risk: string, index: number) => (
                    <div key={index} className="flex items-start p-3 bg-red-50 rounded-lg">
                      <div className="w-2 h-2 bg-red-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{risk}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!evolution && !loading && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-500 text-center py-12">
                Select parameters to generate a legal evolution model
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}