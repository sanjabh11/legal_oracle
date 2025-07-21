import React, { useState } from 'react';
import { Shield, CheckCircle, Target } from 'lucide-react';

interface RiskCategory {
  category: string;
  risk: 'High' | 'Medium' | 'Low';
  score: number;
  priority: number;
}

interface Recommendation {
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  action: string;
  timeline: string;
  cost: string;
  impact: string;
  steps: readonly string[];
}

interface CostBenefitAnalysis {
  totalInvestment: string;
  annualSavings: string;
  riskReduction: string;
  roi: string;
  paybackPeriod: string;
}

interface ImplementationPhase {
  duration: string;
  focus: string;
  actions: readonly string[];
}

interface OptimizationResult {
  complianceScore: number;
  riskAssessment: {
    readonly overall: 'High' | 'Medium' | 'Low';
    readonly categories: readonly RiskCategory[];
  };
  readonly recommendations: readonly Recommendation[];
  readonly costBenefitAnalysis: CostBenefitAnalysis;
  readonly implementationPlan: {
    readonly [key: string]: ImplementationPhase;
  };
}

export function ComplianceOptimization() {
  const [complianceData, setComplianceData] = useState({
    industry: '',
    jurisdiction: '',
    currentPractices: '',
    companySize: '',
  });
    const [optimization, setOptimization] = useState<OptimizationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const industries = [
    { value: 'tech', label: 'Technology' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'finance', label: 'Financial Services' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'retail', label: 'Retail' },
    { value: 'energy', label: 'Energy' },
  ];

  const jurisdictions = [
    { value: 'US', label: 'United States' },
    { value: 'EU', label: 'European Union' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'CA', label: 'Canada' },
    { value: 'global', label: 'Global Operations' },
  ];

  const companySizes = [
    { value: 'startup', label: 'Startup (1-50 employees)' },
    { value: 'small', label: 'Small Business (51-200 employees)' },
    { value: 'medium', label: 'Medium Business (201-1000 employees)' },
    { value: 'large', label: 'Large Enterprise (1000+ employees)' },
  ];

  const handleOptimize = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const mockOptimization = {
        complianceScore: 72,
        riskAssessment: {
          overall: 'Medium',
          categories: [
            { category: 'Data Privacy', risk: 'High', score: 45, priority: 1 },
            { category: 'Financial Reporting', risk: 'Low', score: 85, priority: 3 },
            { category: 'Employment Law', risk: 'Medium', score: 68, priority: 2 },
            { category: 'Cybersecurity', risk: 'High', score: 52, priority: 1 },
          ],
        },
        recommendations: [
          {
            category: 'Data Privacy',
            priority: 'High',
            action: 'Implement comprehensive GDPR compliance program',
            timeline: '3-6 months',
            cost: '$50,000 - $100,000',
            impact: 'Reduces regulatory risk by 80%',
            steps: [
              'Conduct data mapping audit',
              'Update privacy policies',
              'Implement consent management',
              'Train staff on data handling',
            ],
          },
          {
            category: 'Cybersecurity',
            priority: 'High',
            action: 'Establish SOC 2 Type II compliance',
            timeline: '6-12 months',
            cost: '$75,000 - $150,000',
            impact: 'Meets enterprise customer requirements',
            steps: [
              'Security controls assessment',
              'Implement monitoring systems',
              'Document security procedures',
              'Third-party audit',
            ],
          },
          {
            category: 'Employment Law',
            priority: 'Medium',
            action: 'Update employee handbook and policies',
            timeline: '1-3 months',
            cost: '$10,000 - $25,000',
            impact: 'Reduces employment litigation risk',
            steps: [
              'Review current policies',
              'Update for local regulations',
              'Employee training program',
              'Regular policy reviews',
            ],
          },
        ],
        costBenefitAnalysis: {
          totalInvestment: '$135,000 - $275,000',
          annualSavings: '$200,000 - $500,000',
          riskReduction: '65%',
          roi: '148% - 270%',
          paybackPeriod: '8-16 months',
        },
        implementationPlan: {
          phase1: {
            duration: '0-3 months',
            focus: 'Critical compliance gaps',
            actions: ['Data privacy audit', 'Policy updates', 'Staff training'],
          },
          phase2: {
            duration: '3-9 months',
            focus: 'System implementations',
            actions: [
              'Establish SOC 2 controls',
              'Update employment policies',
              'Cybersecurity enhancements',
            ],
          },
          phase3: {
            duration: '9-12 months',
            focus: 'Ongoing monitoring and optimization',
            actions: [
              'Regular compliance reviews',
              'Third-party audits',
              'Continuous improvement process',
            ],
          },
        },
      } as const;

      setOptimization(mockOptimization);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="h-8 w-8 text-red-600" />
          <h1 className="text-3xl font-bold text-gray-900">Compliance Optimization</h1>
        </div>
        <p className="text-gray-600">
          Optimize your compliance strategies to minimize legal risks and reduce costs
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Business Profile</h2>
            
            <form onSubmit={handleOptimize} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry
                </label>
                <select
                  value={complianceData.industry}
                  onChange={(e) => setComplianceData({ ...complianceData, industry: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
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
                  Primary Jurisdiction
                </label>
                <select
                  value={complianceData.jurisdiction}
                  onChange={(e) => setComplianceData({ ...complianceData, jurisdiction: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
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
                  Company Size
                </label>
                <select
                  value={complianceData.companySize}
                  onChange={(e) => setComplianceData({ ...complianceData, companySize: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  required
                >
                  <option value="">Select company size</option>
                  {companySizes.map((size) => (
                    <option key={size.value} value={size.value}>
                      {size.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Compliance Practices
                </label>
                <textarea
                  value={complianceData.currentPractices}
                  onChange={(e) => setComplianceData({ ...complianceData, currentPractices: e.target.value })}
                  rows={4}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  placeholder="Describe your current compliance measures..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Analyzing...' : 'Optimize Compliance'}
              </button>
            </form>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          {loading && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Analyzing compliance requirements...</p>
              </div>
            </div>
          )}

          {optimization && !loading && (
            <div className="space-y-6">
              {/* Compliance Score */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Current Compliance Score</h3>
                  <div className="text-3xl font-bold text-red-600">{optimization.complianceScore}/100</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-red-600 h-4 rounded-full"
                    style={{ width: `${optimization.complianceScore}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Score based on current practices and regulatory requirements
                </p>
              </div>

              {/* Risk Assessment */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Risk Assessment</h3>
                
                <div className="space-y-4">
                  {optimization.riskAssessment.categories.map((category: RiskCategory, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">{category.category}</h4>
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            category.risk === 'High' ? 'bg-red-100 text-red-800' :
                            category.risk === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {category.risk} Risk
                          </span>
                          <span className="text-sm font-medium text-gray-600">
                            Priority {category.priority}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                          <div
                            className={`h-2 rounded-full ${
                              category.score >= 80 ? 'bg-green-600' :
                              category.score >= 60 ? 'bg-yellow-600' :
                              'bg-red-600'
                            }`}
                            style={{ width: `${category.score}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{category.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <Target className="h-5 w-5 mr-2 text-red-600" />
                  Optimization Recommendations
                </h3>
                
                <div className="space-y-6">
                                    {optimization.recommendations.map((rec: Recommendation, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{rec.action}</h4>
                          <p className="text-sm text-gray-600">{rec.category}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          rec.priority === 'High' ? 'bg-red-100 text-red-800' :
                          rec.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {rec.priority} Priority
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="text-sm font-medium text-gray-500">Timeline</div>
                          <div className="font-medium text-gray-900">{rec.timeline}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-500">Estimated Cost</div>
                          <div className="font-medium text-gray-900">{rec.cost}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-500">Impact</div>
                          <div className="font-medium text-gray-900">{rec.impact}</div>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Implementation Steps</h5>
                        <ul className="space-y-1">
                          {rec.steps.map((step: string, i: number) => (
                            <li key={i} className="flex items-start text-sm">
                              <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cost-Benefit Analysis */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Cost-Benefit Analysis</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Investment</span>
                      <span className="font-semibold text-gray-900">{optimization.costBenefitAnalysis.totalInvestment}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Annual Savings</span>
                      <span className="font-semibold text-green-600">{optimization.costBenefitAnalysis.annualSavings}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Risk Reduction</span>
                      <span className="font-semibold text-blue-600">{optimization.costBenefitAnalysis.riskReduction}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">ROI</span>
                      <span className="font-semibold text-green-600">{optimization.costBenefitAnalysis.roi}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Payback Period</span>
                      <span className="font-semibold text-gray-900">{optimization.costBenefitAnalysis.paybackPeriod}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Implementation Plan */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Implementation Plan</h3>
                
                <div className="space-y-6">
                                    {Object.entries(optimization.implementationPlan).map(([phase, details]: [string, ImplementationPhase]) => (
                    <div key={phase} className="border-l-4 border-red-600 pl-4">
                      <h4 className="font-medium text-gray-900 mb-2">
                        {phase.replace('phase', 'Phase ').toUpperCase()} - {details.focus}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">Duration: {details.duration}</p>
                      <ul className="space-y-1">
                        {details.actions.map((action: string, index: number) => (
                          <li key={index} className="flex items-start text-sm">
                            <div className="w-2 h-2 bg-red-600 rounded-full mr-3 mt-2"></div>
                            <span className="text-gray-700">{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!optimization && !loading && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-500 text-center py-12">
                Enter your business details to get compliance optimization recommendations
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}