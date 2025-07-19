import React, { useState } from 'react';
import { Scale, GitBranch, TrendingUp, AlertCircle } from 'lucide-react';

export function PrecedentSimulation() {
  const [simulationData, setSimulationData] = useState({
    caseId: '',
    decision: '',
    jurisdiction: '',
    legalPrinciple: '',
  });
  const [simulation, setSimulation] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const jurisdictions = [
    { value: 'federal', label: 'Federal Courts' },
    { value: 'california', label: 'California' },
    { value: 'new_york', label: 'New York' },
    { value: 'texas', label: 'Texas' },
    { value: 'florida', label: 'Florida' },
  ];

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const mockSimulation = {
        impactAnalysis: {
          immediateImpact: {
            affectedCases: 1247,
            jurisdictionalReach: 'Statewide',
            likelihoodOfAppeal: 35,
          },
          longTermImpact: {
            precedentStrength: 'Strong',
            estimatedCitations: 450,
            influenceRating: 8.2,
            timeHorizon: '5-10 years',
          },
        },
        cascadeEffects: [
          {
            area: 'Contract Interpretation',
            impact: 'Significant',
            description: 'New standard for implied covenant of good faith',
            affectedCases: 300,
            probability: 85,
          },
          {
            area: 'Commercial Litigation',
            impact: 'Moderate',
            description: 'Enhanced burden of proof requirements',
            affectedCases: 180,
            probability: 72,
          },
          {
            area: 'Consumer Protection',
            impact: 'Significant',
            description: 'Strengthened consumer remedy framework',
            affectedCases: 220,
            probability: 68,
          },
        ],
        jurisdictionalSpread: {
          immediate: ['California', 'Nevada', 'Arizona'],
          likely: ['Oregon', 'Washington', 'Hawaii'],
          possible: ['Texas', 'Colorado', 'Utah'],
          timeframes: {
            immediate: '0-6 months',
            likely: '6-18 months',
            possible: '18-36 months',
          },
        },
        riskFactors: [
          'Potential for circuit split',
          'Legislative response probability',
          'Industry pushback likelihood',
          'Appeal to higher court',
        ],
        recommendations: [
          'Monitor appellate court filing deadlines',
          'Prepare guidance for similar pending cases',
          'Consider amicus brief opportunities',
          'Update internal legal guidelines',
          'Brief relevant stakeholders on implications',
        ],
        confidenceScore: 82,
      };

      setSimulation(mockSimulation);
      setLoading(false);
    }, 2500);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Scale className="h-8 w-8 text-gray-600" />
          <h1 className="text-3xl font-bold text-gray-900">Precedent Impact Simulation</h1>
        </div>
        <p className="text-gray-600">
          Simulate the long-term impact of judicial decisions on future legal landscape
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Decision Details</h2>
            
            <form onSubmit={handleSimulate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Case ID (Optional)
                </label>
                <input
                  type="text"
                  value={simulationData.caseId}
                  onChange={(e) => setSimulationData({ ...simulationData, caseId: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                  placeholder="Enter case reference"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proposed Decision
                </label>
                <textarea
                  value={simulationData.decision}
                  onChange={(e) => setSimulationData({ ...simulationData, decision: e.target.value })}
                  rows={4}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                  placeholder="Describe the key aspects of your proposed decision..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jurisdiction
                </label>
                <select
                  value={simulationData.jurisdiction}
                  onChange={(e) => setSimulationData({ ...simulationData, jurisdiction: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
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
                  Legal Principle
                </label>
                <input
                  type="text"
                  value={simulationData.legalPrinciple}
                  onChange={(e) => setSimulationData({ ...simulationData, legalPrinciple: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                  placeholder="e.g., Contract interpretation, Due process"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-700 text-white py-3 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Simulating Impact...' : 'Simulate Precedent Impact'}
              </button>
            </form>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          {loading && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Simulating precedent impact...</p>
              </div>
            </div>
          )}

          {simulation && !loading && (
            <div className="space-y-6">
              {/* Confidence Score */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Simulation Confidence</h3>
                  <div className="text-2xl font-bold text-gray-600">{simulation.confidenceScore}%</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gray-600 h-3 rounded-full"
                    style={{ width: `${simulation.confidenceScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Impact Analysis */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-gray-600" />
                  Impact Analysis
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Immediate Impact</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Affected Cases</span>
                        <span className="font-medium">{simulation.impactAnalysis.immediateImpact.affectedCases}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Jurisdictional Reach</span>
                        <span className="font-medium">{simulation.impactAnalysis.immediateImpact.jurisdictionalReach}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Appeal Likelihood</span>
                        <span className="font-medium">{simulation.impactAnalysis.immediateImpact.likelihoodOfAppeal}%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Long-term Impact</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Precedent Strength</span>
                        <span className="font-medium">{simulation.impactAnalysis.longTermImpact.precedentStrength}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Estimated Citations</span>
                        <span className="font-medium">{simulation.impactAnalysis.longTermImpact.estimatedCitations}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Influence Rating</span>
                        <span className="font-medium">{simulation.impactAnalysis.longTermImpact.influenceRating}/10</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cascade Effects */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <GitBranch className="h-5 w-5 mr-2 text-gray-600" />
                  Cascade Effects
                </h3>
                
                <div className="space-y-4">
                  {simulation.cascadeEffects.map((effect: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{effect.area}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          effect.impact === 'Significant' ? 'bg-red-100 text-red-800' :
                          effect.impact === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {effect.impact}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{effect.description}</p>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Affected Cases: {effect.affectedCases}</span>
                        <span className="text-gray-500">Probability: {effect.probability}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Jurisdictional Spread */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Jurisdictional Spread</h3>
                
                <div className="space-y-4">
                  {Object.entries(simulation.jurisdictionalSpread).filter(([key]) => key !== 'timeframes').map(([category, jurisdictions]: [string, any]) => (
                    <div key={category}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-700 capitalize">{category} Adoption</h4>
                        <span className="text-sm text-gray-500">
                          {simulation.jurisdictionalSpread.timeframes[category]}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {jurisdictions.map((jurisdiction: string, index: number) => (
                          <span
                            key={index}
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              category === 'immediate' ? 'bg-green-100 text-green-800' :
                              category === 'likely' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {jurisdiction}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Factors & Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
                    Risk Factors
                  </h3>
                  <ul className="space-y-2">
                    {simulation.riskFactors.map((risk: string, index: number) => (
                      <li key={index} className="flex items-start text-sm">
                        <AlertCircle className="h-4 w-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
                  <ul className="space-y-2">
                    {simulation.recommendations.map((rec: string, index: number) => (
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

          {!simulation && !loading && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-500 text-center py-12">
                Enter decision details to simulate precedent impact
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}