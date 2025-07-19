import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API with the API key
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Validate API key
if (!API_KEY || API_KEY === 'your-gemini-api-key') {
  console.warn('⚠️ Missing or placeholder Gemini API key. LLM features will use mock data.');
}

// Create a cache for LLM responses to reduce API calls
const responseCache = new Map();

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(API_KEY || 'dummy-key');

// Get the Gemini model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Generate content with caching
export async function generateContent(prompt: string, systemInstruction?: string, cacheKey?: string) {
  try {
    // Use cache if available and cacheKey is provided
    if (cacheKey && responseCache.has(cacheKey)) {
      console.log('Using cached response for:', cacheKey);
      return responseCache.get(cacheKey);
    }

    // Check if we have a valid API key
    if (!API_KEY || API_KEY === 'your-gemini-api-key') {
      console.log('Using mock data due to missing API key');
      return getMockResponse(prompt);
    }

    const generationConfig = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    };

    const chatSession = model.startChat({
      generationConfig,
      systemInstruction: systemInstruction || '',
    });

    const result = await chatSession.sendMessage(prompt);
    const response = result.response.text();
    
    // Cache the response if cacheKey is provided
    if (cacheKey) {
      responseCache.set(cacheKey, response);
    }
    
    return response;
  } catch (error) {
    console.error('Error generating content with Gemini:', error);
    
    // Return mock data if API call fails
    return getMockResponse(prompt);
  }
}

// Get mock response based on prompt content
function getMockResponse(prompt: string) {
  if (prompt.includes('predict') || prompt.includes('outcome')) {
    return JSON.stringify({
      win: Math.floor(Math.random() * 40) + 40,
      settle: Math.floor(Math.random() * 30) + 20,
      lose: Math.floor(Math.random() * 30) + 10,
    });
  } else if (prompt.includes('strategy') || prompt.includes('optimize')) {
    return JSON.stringify([
      'Gather evidence of communications and contract terms',
      'Consider mediation to avoid litigation costs',
      'Consult an expert on supplier obligations',
      'Prepare for potential settlement negotiations',
    ]);
  } else if (prompt.includes('simulate')) {
    return JSON.stringify({
      successRate: Math.floor(Math.random() * 30) + 60,
      opponentResponse: {
        strategy: 'Counter-narrative with procedural challenges',
        likelihood: Math.floor(Math.random() * 40) + 50,
      },
    });
  } else if (prompt.includes('forecast') || prompt.includes('regulation')) {
    return JSON.stringify({
      predictedChanges: [
        {
          regulation: 'AI Transparency Act',
          probability: 85,
          timeline: 'Q2 2025',
          impact: 'High',
          description: 'New requirements for AI system transparency and explainability',
          businessImpact: 'Mandatory AI auditing and documentation processes',
        },
      ],
      impactAnalysis: {
        overallImpact: 'High',
        keyAreas: ['Compliance', 'Product Development', 'Data Governance'],
      },
    });
  } else {
    return "This is a mock response from Gemini. Please provide a valid API key for production use.";
  }
}

// Specialized functions for each LLM task with proper system prompts from PRD
export const predictCaseOutcome = async (caseType: string, jurisdiction: string, keyFacts: string[], judgeId?: string) => {
  const systemInstruction = `You are an AI assistant for the LEGAL ORACLE platform, specializing in predicting legal case outcomes via the /api/v1/outcome/predict endpoint. Your goal is to interpret natural language requests and extract structured parameters for outcome prediction. Focus on:

1. **Case Type**: Identify the legal issue category (e.g., contract_dispute, personal_injury, criminal_defense).
2. **Jurisdiction**: Determine the location where the case is heard (e.g., California, UK).
3. **Key Facts**: Extract relevant details influencing the outcome (e.g., contract value, actions, defenses).
4. **Judge Information**: Identify the judge or court, if specified, for behavioral analysis.
5. **Clarification**: Ask targeted questions for missing details, referencing legal standards.
6. **Validation**: Ensure parameters are valid (e.g., jurisdiction exists, facts are relevant).`;
  
  const prompt = `
    Please predict the outcome for this case:
    Case Type: ${caseType}
    Jurisdiction: ${jurisdiction}
    Key Facts: ${keyFacts.join(', ')}
    ${judgeId ? `Judge: ${judgeId}` : ''}
    
    Provide a probability distribution of possible outcomes (win, settle, lose) based on similar past cases and judge behavior.
  `;
  
  const cacheKey = `outcome_${caseType}_${jurisdiction}_${keyFacts.join('_')}_${judgeId || ''}`;
  
  try {
    const response = await generateContent(prompt, systemInstruction, cacheKey);
    
    // Try to parse the response as JSON
    try {
      const parsed = JSON.parse(response);
      // Log the raw LLM response and parsed output
      console.info('[LLM] Raw response:', response);
      console.info('[LLM] Parsed outcome:', parsed);
      // If explanation is present, include it in the return value
      if (parsed && typeof parsed === 'object' && ('win' in parsed || 'settle' in parsed || 'lose' in parsed)) {
        return {
          ...parsed,
          explanation: parsed.explanation || parsed.reasoning || '',
          isLLMFallback: false,
        };
      }
      // If structure is wrong, treat as fallback
      console.warn('[LLM] Response missing expected keys, using fallback.', response);
    } catch (e) {
      console.warn('[LLM] Failed to parse LLM response, using fallback.', response);
    }
    // Fallback: random values, mark as fallback
    const fallback = {
      win: Math.floor(Math.random() * 40) + 40,
      settle: Math.floor(Math.random() * 30) + 20,
      lose: Math.floor(Math.random() * 30) + 10,
      explanation: 'Prediction generated using fallback logic due to invalid or missing LLM output.',
      isLLMFallback: true,
    };
    console.info('[LLM] Fallback outcome:', fallback);
    return fallback;
  } catch (error) {
    console.error('Error predicting case outcome:', error);
    // Return fallback data
    const fallback = {
      win: 60,
      settle: 25,
      lose: 15,
      explanation: 'Prediction generated using fallback logic due to error in LLM call.',
      isLLMFallback: true,
    };
    console.info('[LLM] Fallback outcome (error):', fallback);
    return fallback;
  }
};

export const optimizeStrategy = async (caseId: string, caseDetails: any) => {
  const systemInstruction = `You are an AI assistant for the LEGAL ORACLE platform, specializing in providing personalized legal strategies via the /api/v1/strategy/optimize endpoint. Your goal is to:

1. **Retrieve Case Details**: Use previously provided case details from localStorage or prompt for case_type, jurisdiction, and key_facts.
2. **Generate Strategies**: Suggest actionable legal strategies based on case specifics and historical data.
3. **Clarify**: Ask for additional details if the context is incomplete.
4. **Validate**: Ensure strategies are legally sound and appropriate for the user's role (non-lawyer).`;
  
  const prompt = `
    Please optimize strategy for this case:
    Case ID: ${caseId}
    Case Type: ${caseDetails.type || caseDetails.case_type}
    Jurisdiction: ${caseDetails.jurisdiction}
    Key Facts: ${Array.isArray(caseDetails.keyFacts) ? caseDetails.keyFacts.join(', ') : caseDetails.keyFacts}
    Current Strategy: ${caseDetails.currentStrategy || ''}
    
    Provide personalized legal strategy recommendations based on this specific situation.
  `;
  
  const cacheKey = `strategy_${caseId}_${caseDetails.currentStrategy || ''}`;
  
  try {
    const response = await generateContent(prompt, systemInstruction, cacheKey);
    
    // Try to parse the response as JSON
    try {
      return JSON.parse(response);
    } catch (e) {
      // If parsing fails, return a structured mock response
      return [
        'Gather evidence of communications and contract terms',
        'Consider mediation to avoid litigation costs',
        'Consult an expert on supplier obligations',
        'Prepare for potential settlement negotiations',
      ];
    }
  } catch (error) {
    console.error('Error optimizing strategy:', error);
    // Return fallback data
    return [
      'Gather evidence of communications and contract terms',
      'Consider mediation to avoid litigation costs',
      'Consult an expert on supplier obligations',
    ];
  }
};

export const simulateStrategy = async (caseId: string, strategy: string, opponentType: string, courtType: string) => {
  const systemInstruction = `You are an AI assistant for the LEGAL ORACLE platform, specializing in simulating legal strategies against AI opponents via the /api/v1/simulation/run endpoint. Your goal is to:

1. **Identify Case and Strategy**: Confirm the case_id and extract the proposed strategy (e.g., opening statement, evidence presentation).
2. **Set Up Simulation**: Define the opponent (e.g., opposing counsel, judge) and simulation parameters (e.g., court type).
3. **Provide Feedback**: Analyze simulation outcomes and suggest improvements.
4. **Clarify**: Ask for specifics if the strategy or case is vague.
5. **Validate**: Ensure the strategy is legally viable.`;
  
  const prompt = `
    Please simulate this strategy:
    Case ID: ${caseId}
    Strategy: ${strategy}
    Opponent Type: ${opponentType}
    Court Type: ${courtType}
    
    Simulate the strategy against the specified opponent and provide a detailed analysis of its effectiveness.
  `;
  
  const cacheKey = `simulation_${caseId}_${opponentType}_${courtType}_${strategy.substring(0, 50)}`;
  
  try {
    const response = await generateContent(prompt, systemInstruction, cacheKey);
    
    // Try to parse the response as JSON
    try {
      return JSON.parse(response);
    } catch (e) {
      // If parsing fails, return a structured mock response
      return {
        successRate: Math.floor(Math.random() * 30) + 60,
        opponentResponse: {
          strategy: 'Counter-narrative with procedural challenges',
          likelihood: Math.floor(Math.random() * 40) + 50,
        },
      };
    }
  } catch (error) {
    console.error('Error simulating strategy:', error);
    // Return fallback data
    return {
      successRate: 65,
      opponentResponse: {
        strategy: 'Counter-narrative with procedural challenges',
        likelihood: 70,
      },
    };
  }
};

export const forecastRegulations = async (industry: string, jurisdictions: string[], timeHorizon: string) => {
  const systemInstruction = `You are an AI assistant for the LEGAL ORACLE platform, specializing in forecasting regulatory changes via the /api/v1/trends/forecast endpoint. Your goal is to:

1. **Identify Industry and Jurisdiction**: Extract the user's industry (e.g., tech, healthcare) and relevant jurisdictions.
2. **Analyze Trends**: Use historical data and sentiment analysis to predict regulatory shifts.
3. **Clarify**: Ask for specific industries or jurisdictions if not provided.
4. **Validate**: Ensure predictions are based on reliable data sources.`;
  
  const prompt = `
    Please forecast regulatory changes:
    Industry: ${industry}
    Jurisdictions: ${jurisdictions.join(', ')}
    Time Horizon: ${timeHorizon}
    
    Provide a forecast of upcoming regulatory changes that could impact this industry, including probability, timeline, and business impact.
  `;
  
  const cacheKey = `forecast_${industry}_${jurisdictions.join('_')}_${timeHorizon}`;
  
  try {
    const response = await generateContent(prompt, systemInstruction, cacheKey);
    
    // Try to parse the response as JSON
    try {
      return JSON.parse(response);
    } catch (e) {
      // If parsing fails, return a structured mock response
      return {
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
        ],
        impactAnalysis: {
          overallImpact: 'High',
          keyAreas: ['Compliance', 'Product Development', 'Data Governance'],
        },
      };
    }
  } catch (error) {
    console.error('Error forecasting regulations:', error);
    // Return fallback data
    return {
      predictedChanges: [
        {
          regulation: 'AI Transparency Act',
          probability: 85,
          timeline: 'Q2 2025',
          impact: 'High',
        },
      ],
      impactAnalysis: {
        overallImpact: 'High',
        keyAreas: ['Compliance', 'Product Development', 'Data Governance'],
      },
    };
  }
};

export const optimizeJurisdiction = async (caseType: string, keyFacts: string[], preferredOutcome: string) => {
  const systemInstruction = `You are an AI assistant for the LEGAL ORACLE platform, specializing in jurisdictional optimization via the /api/v1/jurisdiction/optimize endpoint. Your goal is to:

1. **Identify Case Details**: Extract case_type, key_facts, and preferred outcomes.
2. **Analyze Jurisdictions**: Compare jurisdictions based on historical outcomes and legal frameworks.
3. **Clarify**: Ask for case specifics if not provided.
4. **Validate**: Ensure jurisdictions are valid and relevant.`;
  
  const prompt = `
    Please recommend optimal jurisdictions:
    Case Type: ${caseType}
    Key Facts: ${keyFacts.join(', ')}
    Preferred Outcome: ${preferredOutcome}
    
    Determine the optimal jurisdiction to file this case to maximize the chances of a favorable outcome.
  `;
  
  const cacheKey = `jurisdiction_${caseType}_${preferredOutcome}_${keyFacts.join('_').substring(0, 50)}`;
  
  try {
    const response = await generateContent(prompt, systemInstruction, cacheKey);
    
    // Try to parse the response as JSON
    try {
      return JSON.parse(response);
    } catch (e) {
      // If parsing fails, return a structured mock response
      return [
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
        },
      ];
    }
  } catch (error) {
    console.error('Error optimizing jurisdiction:', error);
    // Return fallback data
    return [
      { jurisdiction: 'Delaware', score: 92 },
      { jurisdiction: 'New York', score: 87 },
    ];
  }
};

export const simulatePrecedent = async (caseId: string, decision: string, jurisdiction: string) => {
  const systemInstruction = `You are an AI assistant for the LEGAL ORACLE platform, specializing in simulating precedent impacts via the /api/v1/precedent/simulate endpoint. Your goal is to:

1. **Identify Case Details**: Extract case_id, decision details, and jurisdiction.
2. **Simulate Impact**: Predict how the decision could influence future cases.
3. **Clarify**: Ask for specifics if the decision is vague.
4. **Validate**: Ensure the case and decision are valid.`;
  
  const prompt = `
    Please simulate precedent impact:
    Case ID: ${caseId}
    Decision: ${decision}
    Jurisdiction: ${jurisdiction}
    
    Predict the potential long-term impacts of this decision on future cases.
  `;
  
  const cacheKey = `precedent_${caseId}_${jurisdiction}_${decision.substring(0, 50)}`;
  
  try {
    const response = await generateContent(prompt, systemInstruction, cacheKey);
    
    // Try to parse the response as JSON
    try {
      return JSON.parse(response);
    } catch (e) {
      // If parsing fails, return a structured mock response
      return {
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
      };
    }
  } catch (error) {
    console.error('Error simulating precedent:', error);
    // Return fallback data
    return {
      immediateImpact: {
        affectedCases: 1247,
        jurisdictionalReach: 'Statewide',
      },
      longTermImpact: {
        precedentStrength: 'Strong',
        estimatedCitations: 450,
      },
    };
  }
};

export const modelLegalEvolution = async (legalDomain: string, timeHorizon: string) => {
  const systemInstruction = `You are an AI assistant for the LEGAL ORACLE platform, specializing in modeling legal evolution via the /api/v1/trends/model endpoint. Your goal is to:

1. **Identify Scope**: Extract the legal domain (e.g., contract_law) and time_horizon.
2. **Analyze Trends**: Use historical data to model changes in legal interpretations.
3. **Clarify**: Ask for specific domains or timeframes if not provided.
4. **Validate**: Ensure the domain is supported by available data.`;
  
  const prompt = `
    Please model legal evolution:
    Legal Domain: ${legalDomain}
    Time Horizon: ${timeHorizon}
    
    Model long-term trends and evolution patterns in this legal domain.
  `;
  
  const cacheKey = `evolution_${legalDomain}_${timeHorizon}`;
  
  try {
    const response = await generateContent(prompt, systemInstruction, cacheKey);
    
    // Try to parse the response as JSON
    try {
      return JSON.parse(response);
    } catch (e) {
      // If parsing fails, return a structured mock response
      return {
        overallDirection: 'Increasing Digitalization',
        confidence: 87,
        keyDrivers: [
          'Technological advancement',
          'Changing social norms',
          'Economic pressures',
          'International harmonization',
        ],
      };
    }
  } catch (error) {
    console.error('Error modeling legal evolution:', error);
    // Return fallback data
    return {
      overallDirection: 'Increasing Digitalization',
      confidence: 87,
      keyDrivers: [
        'Technological advancement',
        'Changing social norms',
        'Economic pressures',
      ],
    };
  }
};

export const optimizeCompliance = async (industry: string, jurisdiction: string, currentPractices: string[]) => {
  const systemInstruction = `You are an AI assistant for the LEGAL ORACLE platform, specializing in compliance optimization via the /api/v1/compliance/optimize endpoint. Your goal is to:

1. **Identify Business Context**: Extract industry, jurisdiction, and current compliance practices.
2. **Generate Recommendations**: Suggest strategies to reduce legal risks and costs.
3. **Clarify**: Ask for specifics if the context is incomplete.
4. **Validate**: Ensure recommendations align with regulations.`;
  
  const prompt = `
    Please optimize compliance strategies:
    Industry: ${industry}
    Jurisdiction: ${jurisdiction}
    Current Practices: ${currentPractices.join(', ')}
    
    Suggest strategies to reduce legal risks and costs while ensuring regulatory compliance.
  `;
  
  const cacheKey = `compliance_${industry}_${jurisdiction}`;
  
  try {
    const response = await generateContent(prompt, systemInstruction, cacheKey);
    
    // Try to parse the response as JSON
    try {
      return JSON.parse(response);
    } catch (e) {
      // If parsing fails, return a structured mock response
      return [
        'Implement comprehensive GDPR compliance program',
        'Establish SOC 2 Type II compliance',
        'Update employee handbook and policies',
        'Implement regular compliance training',
      ];
    }
  } catch (error) {
    console.error('Error optimizing compliance:', error);
    // Return fallback data
    return [
      'Implement comprehensive GDPR compliance program',
      'Establish SOC 2 Type II compliance',
      'Update employee handbook and policies',
    ];
  }
};

export const predictLandmarkCases = async (jurisdiction: string, caseDetails: string[]) => {
  const systemInstruction = `You are an AI assistant for the LEGAL ORACLE platform, specializing in predicting landmark cases via the /api/v1/precedent/predict endpoint. Your goal is to:

1. **Identify Cases**: Extract case_ids or case details (e.g., legal issue, jurisdiction).
2. **Analyze Impact**: Predict the likelihood of a case becoming a landmark decision.
3. **Clarify**: Ask for specifics if case details are vague.
4. **Validate**: Ensure cases are current and relevant.`;
  
  const prompt = `
    Please predict landmark cases:
    Jurisdiction: ${jurisdiction}
    Case Details: ${caseDetails.join(', ')}
    
    Predict which current cases are likely to become landmark decisions.
  `;
  
  const cacheKey = `landmark_${jurisdiction}_${caseDetails.join('_')}`;
  
  try {
    const response = await generateContent(prompt, systemInstruction, cacheKey);
    
    // Try to parse the response as JSON
    try {
      return JSON.parse(response);
    } catch (e) {
      // If parsing fails, return a structured mock response
      return [
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
        },
      ];
    }
  } catch (error) {
    console.error('Error predicting landmark cases:', error);
    // Return fallback data
    return [
      {
        caseName: 'TechCorp v. Privacy Coalition',
        probability: 87,
        significance: 'Very High',
      },
    ];
  }
};

export const getArbitrageAlerts = async (userRole: string, jurisdiction: string, legalInterests: string[]) => {
  const systemInstruction = `You are an AI assistant for the LEGAL ORACLE platform, specializing in legal arbitrage alerts via the /api/v1/arbitrage/alerts endpoint. Your goal is to:

1. **Identify User Context**: Extract user role (e.g., individual, business), jurisdiction, and legal interests.
2. **Detect Opportunities**: Identify temporary legal advantages based on current laws and trends.
3. **Clarify**: Ask for specific interests if not provided.
4. **Validate**: Ensure opportunities are ethical and legal.`;
  
  const prompt = `
    Please identify legal arbitrage opportunities:
    User Role: ${userRole}
    Jurisdiction: ${jurisdiction}
    Legal Interests: ${legalInterests.join(', ')}
    
    Identify temporary legal advantages or loopholes that can be utilized before they are closed.
  `;
  
  const cacheKey = `arbitrage_${userRole}_${jurisdiction}_${legalInterests.join('_')}`;
  
  try {
    const response = await generateContent(prompt, systemInstruction, cacheKey);
    
    // Try to parse the response as JSON
    try {
      return JSON.parse(response);
    } catch (e) {
      // If parsing fails, return a structured mock response
      return [
        {
          id: 'alert_1',
          title: 'New Tax Credit Opportunity',
          description: 'California AB-123 creates temporary R&D tax credits for AI companies',
          category: 'tax',
          urgency: 'High',
          expirationDate: '2025-03-15',
          potentialSavings: '$50,000 - $200,000',
          actionRequired: 'File application by March 1, 2025',
          jurisdiction: 'California',
          confidence: 92,
          created: new Date().toISOString(),
        },
        {
          id: 'alert_2',
          title: 'Contract Law Loophole',
          description: 'Recent ruling creates favorable interpretation for force majeure clauses',
          category: 'contracts',
          urgency: 'Medium',
          expirationDate: '2025-06-30',
          potentialSavings: 'Risk mitigation',
          actionRequired: 'Review and update existing contracts',
          jurisdiction: 'Federal',
          confidence: 78,
          created: new Date(Date.now() - 86400000).toISOString(),
        },
      ];
    }
  } catch (error) {
    console.error('Error getting arbitrage alerts:', error);
    // Return fallback data
    return [
      {
        id: 'alert_1',
        title: 'New Tax Credit Opportunity',
        description: 'California AB-123 creates temporary R&D tax credits for AI companies',
        category: 'tax',
        urgency: 'High',
        expirationDate: '2025-03-15',
        potentialSavings: '$50,000 - $200,000',
        actionRequired: 'File application by March 1, 2025',
        jurisdiction: 'California',
        confidence: 92,
        created: new Date().toISOString(),
      },
    ];
  }
};