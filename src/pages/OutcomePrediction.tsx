import * as React from 'react';
import { useState } from 'react';
import { Brain, Calendar, MapPin, DollarSign, FileText } from 'lucide-react';
import { cases } from '../services/api';
import { CaseLawOpinionCard } from '../components/CaseLawOpinionCard';
import { HuggingFaceOpinionCard } from '../components/HuggingFaceOpinionCard';
import { searchCourtListenerOpinions } from '../services/caselaw';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export function OutcomePrediction() {
  const [formData, setFormData] = useState({
    caseType: '',
    jurisdiction: '',
    keyFacts: '',
    contractValue: '',
    judgeInfo: '',
  });
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [caselawResults, setCaselawResults] = useState<any[]>([]);
  const [caselawLoading, setCaselawLoading] = useState(false);
  const [caselawError, setCaselawError] = useState<string | null>(null);

  // Hugging Face results state
  const [hfResults, setHfResults] = useState<any[]>([]);
  const [hfLoading, setHfLoading] = useState(false);
  const [hfError, setHfError] = useState<string | null>(null);

  const caseTypes = [
    { value: 'contract_dispute', label: 'Contract Dispute' },
    { value: 'personal_injury', label: 'Personal Injury' },
    { value: 'criminal_defense', label: 'Criminal Defense' },
    { value: 'employment_law', label: 'Employment Law' },
    { value: 'intellectual_property', label: 'Intellectual Property' },
    { value: 'real_estate', label: 'Real Estate' },
  ];

  const jurisdictions = [
    { value: 'california', label: 'California' },
    { value: 'new_york', label: 'New York' },
    { value: 'texas', label: 'Texas' },
    { value: 'florida', label: 'Florida' },
    { value: 'illinois', label: 'Illinois' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Extract key facts as an array
      const keyFactsArray = formData.keyFacts
        .split('\n')
        .filter(fact => fact.trim() !== '')
        .map(fact => fact.trim());
      
      // Add contract value if provided
      if (formData.contractValue) {
        keyFactsArray.push(`Contract value: ${formData.contractValue}`);
      }
      
      // Call the API service
      const result = await cases.predictOutcome(
        formData.caseType,
        formData.jurisdiction,
        keyFactsArray,
        formData.judgeInfo || undefined
      );
      
      // Create a more complete prediction object
      const fullPrediction = {
        caseId: result.caseId,
        outcomeProbabilities: result.outcomeProbabilities,
        confidenceScore: result.confidenceScore,
        keyFactors: [
          'Strong contractual evidence',
          'Favorable jurisdiction',
          formData.judgeInfo ? 'Judge history with similar cases' : 'Standard judicial approach',
          'Case complexity assessment',
        ],
        recommendations: [
          'Consider mediation as first option',
          'Gather additional evidence on breach timing',
          'Prepare for potential settlement negotiations',
        ],
      };
      
      // Attach explanation and fallback status to prediction for UI
      if (result && result.outcomeProbabilities) {
        fullPrediction.outcomeProbabilities = {
          ...result.outcomeProbabilities,
          explanation: result.outcomeProbabilities.explanation || result.outcomeProbabilities.reasoning || result.explanation || '',
          isLLMFallback: result.outcomeProbabilities.isLLMFallback ?? result.isLLMFallback ?? false,
        };
      }
      setPrediction(fullPrediction);
      // Fetch relevant caselaw from CourtListener
      setCaselawLoading(true);
      setCaselawError(null);
      setCaselawResults([]);
      // Fetch relevant caselaw from Hugging Face
      setHfLoading(true);
      setHfError(null);
      setHfResults([]);
      try {
        // Use the first key fact or the full keyFacts string as query
        const caselawQuery = keyFactsArray[0] || formData.keyFacts || '';
        if (caselawQuery) {
          // CourtListener
          const caselawData = await searchCourtListenerOpinions(caselawQuery, formData.jurisdiction);
          const opinions = caselawData.results || caselawData.opinions || [];
          setCaselawResults(opinions);
          // Hugging Face (local/streaming)
          const hfRes = await fetch(`http://localhost:8000/api/v1/caselaw/search?query=${encodeURIComponent(caselawQuery)}`);
          if (!hfRes.ok) throw new Error('Failed to fetch Hugging Face results');
          const hfData = await hfRes.json();
          setHfResults(Array.isArray(hfData) ? hfData : []);
        }
      } catch (err: any) {
        setCaselawError(err.message || 'Failed to fetch caselaw results.');
        setHfError(err.message || 'Failed to fetch Hugging Face results.');
      } finally {
        setCaselawLoading(false);
        setHfLoading(false);
      }
    } catch (error) {
      console.error('Error predicting outcome:', error);
      setError('Failed to predict case outcome. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Outcome Prediction</h1>
        </div>
        <p className="text-gray-600">
          Predict your case outcome using AI-powered analysis and judge behavioral patterns
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Case Details</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Case Type
              </label>
              <select
                value={formData.caseType}
                onChange={(e) => setFormData({ ...formData, caseType: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                <MapPin className="inline h-4 w-4 mr-1" />
                Jurisdiction
              </label>
              <select
                value={formData.jurisdiction}
                onChange={(e) => setFormData({ ...formData, jurisdiction: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                <FileText className="inline h-4 w-4 mr-1" />
                Key Facts
              </label>
              <textarea
                value={formData.keyFacts}
                onChange={(e) => setFormData({ ...formData, keyFacts: e.target.value })}
                rows={4}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Describe the key facts of your case..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="inline h-4 w-4 mr-1" />
                Contract/Claim Value (Optional)
              </label>
              <input
                type="text"
                value={formData.contractValue}
                onChange={(e) => setFormData({ ...formData, contractValue: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., $50,000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Judge Information (Optional)
              </label>
              <input
                type="text"
                value={formData.judgeInfo}
                onChange={(e) => setFormData({ ...formData, judgeInfo: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Judge name or court"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Analyzing...' : 'Predict Outcome'}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Prediction Results</h2>
          
          {loading && (
            <div className="text-center py-12">
              <LoadingSpinner size="large" color="blue" text="Analyzing your case..." />
            </div>
          )}

          {error && !loading && (
            <ErrorMessage 
              message={error} 
              onRetry={() => handleSubmit(new Event('submit') as any)} 
            />
          )}

          {prediction && !loading && !error && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Outcome Probabilities</h3>
                <div className="space-y-3">
                  {/* LLM Explanation & Fallback Transparency */}
                  {prediction.outcomeProbabilities && (
                    <div className="mb-4">
                      {typeof prediction.outcomeProbabilities.isLLMFallback !== 'undefined' && prediction.outcomeProbabilities.isLLMFallback && (
                        <div className="flex items-center mb-2">
                          <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded border border-yellow-300">
                            Fallback Used
                          </span>
                          <span className="text-xs text-gray-500">LLM output was missing or invalid; random fallback values generated.</span>
                        </div>
                      )}
                      {prediction.outcomeProbabilities.explanation && (
                        <div className="bg-gray-50 border-l-4 border-blue-400 p-3 rounded mb-2">
                          <span className="block text-xs text-blue-900 font-semibold mb-1">Model Explanation</span>
                          <span className="text-sm text-blue-800">{prediction.outcomeProbabilities.explanation}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Win</span>
                    <span className="text-sm font-medium text-green-600">
                      {prediction.outcomeProbabilities.win}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${prediction.outcomeProbabilities.win}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Settle</span>
                    <span className="text-sm font-medium text-yellow-600">
                      {prediction.outcomeProbabilities.settle}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-600 h-2 rounded-full"
                      style={{ width: `${prediction.outcomeProbabilities.settle}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Lose</span>
                    <span className="text-sm font-medium text-red-600">
                      {prediction.outcomeProbabilities.lose}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full"
                      style={{ width: `${prediction.outcomeProbabilities.lose}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Confidence Score</h4>
                <p className="text-2xl font-bold text-blue-700">{prediction.confidenceScore}%</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Key Factors</h4>
                <ul className="space-y-2">
                  {prediction.keyFactors.map((factor: string, index: number) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Recommendations</h4>
                <ul className="space-y-2">
                  {prediction.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-600 rounded-full mr-3 mt-2"></div>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Caselaw Results Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div>
                  <h4 className="font-semibold mb-2">Hugging Face (local)</h4>
                  {hfLoading ? (
                    <LoadingSpinner />
                  ) : hfError ? (
                    <ErrorMessage message={hfError} />
                  ) : (
                    <>
                      {Array.isArray(hfResults) && hfResults.length > 0 ? (
                        hfResults.map((op: any, i: number) => (
                          <HuggingFaceOpinionCard key={i} opinion={op} highlight={formData.keyFacts} />
                        ))
                      ) : (
                        <div className="text-gray-500">No results yet.</div>
                      )}
                      <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto mt-2" style={{maxHeight: 200}}>
                        {hfResults ? JSON.stringify(hfResults, null, 2) : 'No results yet.'}
                      </pre>
                    </>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold mb-2">CourtListener (live)</h4>
                  {caselawLoading ? (
                    <LoadingSpinner />
                  ) : caselawError ? (
                    <ErrorMessage message={caselawError} />
                  ) : (
                    <>
                      {Array.isArray(caselawResults) && caselawResults.length > 0 ? (
                        caselawResults.map((op: any, i: number) => (
                          <CaseLawOpinionCard key={i} opinion={op} />
                        ))
                      ) : (
                        <div className="text-gray-500">No opinions found.</div>
                      )}
                      <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto mt-2" style={{maxHeight: 200}}>
                        {caselawResults ? JSON.stringify(caselawResults, null, 2) : 'No results yet.'}
                      </pre>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {!prediction && !loading && !error && (
            <p className="text-gray-500 text-center py-12">
              Fill out the case details to get your prediction
            </p>
          )}
        </div>
      </div>
    </div>
  );
}