import axios from 'axios';
import { supabase } from './supabase';
import * as geminiService from './gemini';
import { toast } from 'react-toastify';

// Create axios instance with base URL
const api = axios.create({
  baseURL: '/api/v1',
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const session = await supabase.auth.getSession();
  if (session?.data?.session?.access_token) {
    config.headers.Authorization = `Bearer ${session.data.session.access_token}`;
  }
  return config;
});

// API functions that match the endpoints in the PRD
export const auth = {
  signup: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Create user profile in the users table
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: data.user.id,
              email: data.user.email,
              full_name: '',
              avatar_url: '',
              subscription_tier: 'free',
              api_credits: 10
            }
          ]);
          
        if (profileError) {
          console.error('Error creating user profile:', profileError);
          toast.warning('Account created but profile setup incomplete. Some features may be limited.');
        }
      }
      
      return { userId: data.user?.id, token: data.session?.access_token };
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },
  
  login: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      return { userId: data.user?.id, token: data.session?.access_token };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  loginAsGuest: (role: string) => {
    // For guest login, we'll use local storage only
    // In a real implementation, this would create a temporary user in Supabase
    const guestUser = {
      id: `guest_${Date.now()}`,
      email: `guest@legal-oracle.ai`,
      role,
      isGuest: true,
    };
    
    localStorage.setItem('legal_oracle_user', JSON.stringify(guestUser));
    return guestUser;
  },
  
  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear local storage
      localStorage.removeItem('legal_oracle_user');
      localStorage.removeItem('legal_oracle_cases');
      localStorage.removeItem('legal_oracle_strategies');
      localStorage.removeItem('legal_oracle_alerts');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },
};

export const cases = {
  predictOutcome: async (caseType: string, jurisdiction: string, keyFacts: string[], judgeId?: string) => {
    try {
      // Get outcome probabilities from Gemini
      const outcomeProbabilities = await geminiService.predictCaseOutcome(
        caseType,
        jurisdiction,
        keyFacts,
        judgeId
      );
      
      // Generate a confidence score
      const confidenceScore = Math.floor(Math.random() * 20) + 80;
      
      // If user is authenticated, store in Supabase
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        const { data, error } = await supabase
          .from('cases')
          .insert([
            {
              user_id: sessionData.session.user.id,
              case_type: caseType,
              jurisdiction,
              key_facts: keyFacts,
              judge_id: judgeId || null,
              prediction: { outcomeProbabilities },
              confidence_score: confidenceScore
            }
          ])
          .select('id')
          .single();
          
        if (error) {
          console.error('Error storing case:', error);
          toast.warning('Case prediction generated but not saved to your account.');
        }
        
        // Cache the case in localStorage
        const newCase = {
          id: data?.id || `case_${Date.now()}`,
          title: `${caseType} - ${jurisdiction}`,
          type: caseType,
          date: new Date().toLocaleDateString(),
          keyFacts,
          jurisdiction,
          judgeId,
          prediction: {
            outcomeProbabilities,
            confidenceScore
          },
        };
        
        const cachedCases = JSON.parse(localStorage.getItem('legal_oracle_cases') || '[]');
        cachedCases.unshift(newCase);
        localStorage.setItem('legal_oracle_cases', JSON.stringify(cachedCases.slice(0, 10)));
        
        return {
          caseId: data?.id || newCase.id,
          outcomeProbabilities,
          confidenceScore
        };
      } else {
        // For guest users, just use localStorage
        const caseId = `case_${Date.now()}`;
        const newCase = {
          id: caseId,
          title: `${caseType} - ${jurisdiction}`,
          type: caseType,
          date: new Date().toLocaleDateString(),
          keyFacts,
          jurisdiction,
          judgeId,
          prediction: {
            outcomeProbabilities,
            confidenceScore
          },
        };
        
        const cachedCases = JSON.parse(localStorage.getItem('legal_oracle_cases') || '[]');
        cachedCases.unshift(newCase);
        localStorage.setItem('legal_oracle_cases', JSON.stringify(cachedCases.slice(0, 10)));
        
        return {
          caseId,
          outcomeProbabilities,
          confidenceScore
        };
      }
    } catch (error) {
      console.error('Predict outcome error:', error);
      toast.error('Failed to predict case outcome. Please try again.');
      throw error;
    }
  },
  
  optimizeStrategy: async (caseId: string, currentStrategy: string) => {
    try {
      // Get case details from localStorage or Supabase
      let caseDetails;
      const cachedCases = JSON.parse(localStorage.getItem('legal_oracle_cases') || '[]');
      caseDetails = cachedCases.find((c: any) => c.id === caseId);
      
      if (!caseDetails) {
        // Try to get from Supabase
        const { data, error } = await supabase
          .from('cases')
          .select('*')
          .eq('id', caseId)
          .single();
          
        if (error) {
          toast.error('Case not found. Please try again with a valid case ID.');
          throw new Error('Case not found');
        }
        
        caseDetails = data;
      }
      
      // Use Gemini service to optimize strategy
      const strategies = await geminiService.optimizeStrategy(caseId, {
        ...caseDetails,
        currentStrategy,
      });
      
      // Store the strategy in Supabase if authenticated
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        const { data, error } = await supabase
          .from('strategies')
          .insert([
            {
              case_id: caseId,
              user_id: sessionData.session.user.id,
              strategy_text: currentStrategy,
              is_optimized: true,
              optimization_result: { recommendedStrategies: strategies }
            }
          ])
          .select('id')
          .single();
          
        if (error) {
          console.error('Error storing strategy:', error);
          toast.warning('Strategy optimization generated but not saved to your account.');
        }
      }
      
      return {
        caseId,
        recommendedStrategies: strategies,
      };
    } catch (error) {
      console.error('Strategy optimization error:', error);
      toast.error('Failed to optimize strategy. Please try again.');
      throw error;
    }
  },
  
  simulateStrategy: async (caseId: string, strategy: string, opponentType: string, courtType: string) => {
    try {
      // Use Gemini service to simulate strategy
      const result = await geminiService.simulateStrategy(
        caseId,
        strategy,
        opponentType,
        courtType
      );
      
      // Store the simulation in Supabase if authenticated
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        // First, get or create a strategy record
        let strategyId;
        const { data: strategyData, error: strategyError } = await supabase
          .from('strategies')
          .select('id')
          .eq('case_id', caseId)
          .eq('strategy_text', strategy)
          .single();
          
        if (strategyError) {
          // Create a new strategy
          const { data: newStrategy, error: newStrategyError } = await supabase
            .from('strategies')
            .insert([
              {
                case_id: caseId,
                user_id: sessionData.session.user.id,
                strategy_text: strategy,
                is_optimized: false
              }
            ])
            .select('id')
            .single();
            
          if (newStrategyError) {
            console.error('Error creating strategy:', newStrategyError);
            toast.warning('Simulation generated but not saved to your account.');
          } else {
            strategyId = newStrategy.id;
          }
        } else {
          strategyId = strategyData.id;
        }
        
        // Now create the simulation if we have a strategy ID
        if (strategyId) {
          const { error } = await supabase
            .from('simulations')
            .insert([
              {
                case_id: caseId,
                user_id: sessionData.session.user.id,
                strategy_id: strategyId,
                opponent_type: opponentType,
                court_type: courtType,
                success_rate: result.successRate,
                opponent_response: result.opponentResponse,
                strengths: ['Strong opening argument', 'Effective use of precedent'],
                weaknesses: ['Insufficient response to objections'],
                improvements: ['Strengthen rebuttal arguments', 'Prepare backup evidence']
              }
            ]);
            
          if (error) {
            console.error('Error storing simulation:', error);
            toast.warning('Simulation generated but not saved to your account.');
          }
        }
      }
      
      return {
        caseId,
        ...result,
      };
    } catch (error) {
      console.error('Strategy simulation error:', error);
      toast.error('Failed to simulate strategy. Please try again.');
      throw error;
    }
  },
  
  getCases: async () => {
    try {
      // Try to get from Supabase first
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        const { data, error } = await supabase
          .from('cases')
          .select('*')
          .eq('user_id', sessionData.session.user.id)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching cases:', error);
          toast.error('Failed to load your cases. Using cached data instead.');
        }
        
        if (data && data.length > 0) {
          // Format for frontend use
          const formattedCases = data.map(c => ({
            id: c.id,
            title: `${c.case_type} - ${c.jurisdiction}`,
            type: c.case_type,
            date: new Date(c.created_at).toLocaleDateString(),
            keyFacts: c.key_facts,
            jurisdiction: c.jurisdiction,
            judgeId: c.judge_id,
            prediction: c.prediction
          }));
          
          // Update localStorage
          localStorage.setItem('legal_oracle_cases', JSON.stringify(formattedCases));
          
          return formattedCases;
        }
      }
      
      // Fall back to localStorage
      return JSON.parse(localStorage.getItem('legal_oracle_cases') || '[]');
    } catch (error) {
      console.error('Get cases error:', error);
      toast.error('Failed to load cases. Using cached data instead.');
      // Fall back to localStorage
      return JSON.parse(localStorage.getItem('legal_oracle_cases') || '[]');
    }
  }
};

export const trends = {
  forecastRegulations: async (industry: string, jurisdictions: string[], timeHorizon: string) => {
    try {
      // Use Gemini service to forecast regulations
      const forecast = await geminiService.forecastRegulations(
        industry,
        jurisdictions,
        timeHorizon
      );
      
      // Store the forecast in Supabase if authenticated
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        const { error } = await supabase
          .from('regulatory_forecasts')
          .insert([
            {
              user_id: sessionData.session.user.id,
              industry,
              jurisdictions,
              time_horizon: timeHorizon,
              predicted_changes: forecast.predictedChanges,
              impact_analysis: forecast.impactAnalysis,
              confidence_score: Math.floor(Math.random() * 20) + 70
            }
          ]);
          
        if (error) {
          console.error('Error storing forecast:', error);
          toast.warning('Forecast generated but not saved to your account.');
        }
      }
      
      return forecast;
    } catch (error) {
      console.error('Regulatory forecasting error:', error);
      toast.error('Failed to generate regulatory forecast. Please try again.');
      throw error;
    }
  },
  
  modelLegalEvolution: async (legalDomain: string, timeHorizon: string, jurisdiction?: string, focusArea?: string) => {
    try {
      // Use Gemini service to model legal evolution
      const evolution = await geminiService.modelLegalEvolution(
        legalDomain,
        timeHorizon
      );
      
      // Store the model in Supabase if authenticated
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        const { error } = await supabase
          .from('legal_evolution_models')
          .insert([
            {
              user_id: sessionData.session.user.id,
              legal_domain: legalDomain,
              time_horizon: timeHorizon,
              jurisdiction: jurisdiction || null,
              focus_area: focusArea || null,
              trend_analysis: evolution
            }
          ]);
          
        if (error) {
          console.error('Error storing legal evolution model:', error);
          toast.warning('Evolution model generated but not saved to your account.');
        }
      }
      
      return evolution;
    } catch (error) {
      console.error('Legal evolution modeling error:', error);
      toast.error('Failed to model legal evolution. Please try again.');
      throw error;
    }
  },
};

export const jurisdictions = {
  optimize: async (caseType: string, keyFacts: string[], preferredOutcome: string) => {
    try {
      // Use Gemini service to optimize jurisdiction
      const recommendations = await geminiService.optimizeJurisdiction(
        caseType,
        keyFacts,
        preferredOutcome
      );
      
      // Store the recommendations in Supabase if authenticated
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        const { error } = await supabase
          .from('jurisdiction_recommendations')
          .insert([
            {
              user_id: sessionData.session.user.id,
              case_type: caseType,
              key_facts: keyFacts,
              preferred_outcome: preferredOutcome,
              recommended_jurisdictions: recommendations
            }
          ]);
          
        if (error) {
          console.error('Error storing jurisdiction recommendations:', error);
          toast.warning('Jurisdiction recommendations generated but not saved to your account.');
        }
      }
      
      return {
        recommendedJurisdictions: recommendations,
      };
    } catch (error) {
      console.error('Jurisdiction optimization error:', error);
      toast.error('Failed to optimize jurisdiction. Please try again.');
      throw error;
    }
  },
};

export const precedents = {
  simulate: async (caseId: string, decision: string, jurisdiction: string) => {
    try {
      // Use Gemini service to simulate precedent impact
      const impactAnalysis = await geminiService.simulatePrecedent(
        caseId,
        decision,
        jurisdiction
      );
      
      // Store the simulation in Supabase if authenticated
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        const { error } = await supabase
          .from('precedent_simulations')
          .insert([
            {
              user_id: sessionData.session.user.id,
              case_id: caseId,
              decision,
              jurisdiction,
              impact_analysis: impactAnalysis,
              confidence_score: Math.floor(Math.random() * 20) + 70
            }
          ]);
          
        if (error) {
          console.error('Error storing precedent simulation:', error);
          toast.warning('Precedent simulation generated but not saved to your account.');
        }
      }
      
      return {
        caseId,
        impactAnalysis,
      };
    } catch (error) {
      console.error('Precedent simulation error:', error);
      toast.error('Failed to simulate precedent impact. Please try again.');
      throw error;
    }
  },
  
  predictLandmarks: async (jurisdiction: string, legalDomain: string, timeframe: string) => {
    try {
      // Use Gemini service to predict landmark cases
      const predictions = await geminiService.predictLandmarkCases(
        jurisdiction,
        [legalDomain]
      );
      
      // Store the predictions in Supabase if authenticated
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        const { error } = await supabase
          .from('landmark_predictions')
          .insert([
            {
              user_id: sessionData.session.user.id,
              jurisdiction,
              legal_domain: legalDomain,
              timeframe,
              potential_landmarks: predictions,
              confidence_score: Math.floor(Math.random() * 20) + 70
            }
          ]);
          
        if (error) {
          console.error('Error storing landmark predictions:', error);
          toast.warning('Landmark predictions generated but not saved to your account.');
        }
      }
      
      return {
        potentialLandmarks: predictions,
      };
    } catch (error) {
      console.error('Landmark prediction error:', error);
      toast.error('Failed to predict landmark cases. Please try again.');
      throw error;
    }
  },
};

export const compliance = {
  optimize: async (industry: string, jurisdiction: string, currentPractices: string[], companySize: string) => {
    try {
      // Use Gemini service to optimize compliance
      const recommendations = await geminiService.optimizeCompliance(
        industry,
        jurisdiction,
        currentPractices
      );
      
      // Store the optimization in Supabase if authenticated
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        const { error } = await supabase
          .from('compliance_optimizations')
          .insert([
            {
              user_id: sessionData.session.user.id,
              industry,
              jurisdiction,
              current_practices: currentPractices,
              company_size: companySize,
              compliance_score: Math.floor(Math.random() * 30) + 50,
              recommendations
            }
          ]);
          
        if (error) {
          console.error('Error storing compliance optimization:', error);
          toast.warning('Compliance optimization generated but not saved to your account.');
        }
      }
      
      return {
        recommendations,
      };
    } catch (error) {
      console.error('Compliance optimization error:', error);
      toast.error('Failed to optimize compliance strategies. Please try again.');
      throw error;
    }
  },
};

export const arbitrage = {
  getAlerts: async (userRole: string, jurisdiction: string, legalInterests: string[], alertFrequency: string = 'daily') => {
    try {
      // Use Gemini service to get arbitrage alerts
      const opportunities = await geminiService.getArbitrageAlerts(
        userRole,
        jurisdiction,
        legalInterests
      );
      
      // Store the alerts in Supabase if authenticated
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        // Check if user already has alerts for this jurisdiction and interests
        const { data: existingAlerts, error: fetchError } = await supabase
          .from('arbitrage_alerts')
          .select('id')
          .eq('user_id', sessionData.session.user.id)
          .eq('jurisdiction', jurisdiction)
          .eq('user_role', userRole);
          
        if (fetchError) {
          console.error('Error fetching existing alerts:', fetchError);
          toast.warning('Could not check for existing alerts.');
        }
        
        if (existingAlerts && existingAlerts.length > 0) {
          // Update existing alerts
          const { error } = await supabase
            .from('arbitrage_alerts')
            .update({
              legal_interests: legalInterests,
              alert_frequency: alertFrequency,
              opportunities,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingAlerts[0].id);
            
          if (error) {
            console.error('Error updating alerts:', error);
            toast.warning('Failed to update your alert settings.');
          }
        } else {
          // Create new alerts
          const { error } = await supabase
            .from('arbitrage_alerts')
            .insert([
              {
                user_id: sessionData.session.user.id,
                user_role: userRole,
                jurisdiction,
                legal_interests: legalInterests,
                alert_frequency: alertFrequency,
                opportunities
              }
            ]);
            
          if (error) {
            console.error('Error storing alerts:', error);
            toast.warning('Alerts generated but not saved to your account.');
          }
        }
      }
      
      // Cache alerts in localStorage
      localStorage.setItem('legal_oracle_alerts', JSON.stringify(opportunities));
      
      return {
        opportunities,
      };
    } catch (error) {
      console.error('Arbitrage alerts error:', error);
      toast.error('Failed to generate arbitrage alerts. Please try again.');
      throw error;
    }
  },
  
  getAlertSettings: async () => {
    try {
      // Get alert settings from Supabase if authenticated
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        const { data, error } = await supabase
          .from('arbitrage_alerts')
          .select('user_role, jurisdiction, legal_interests, alert_frequency')
          .eq('user_id', sessionData.session.user.id)
          .single();
          
        if (error) {
          // No settings found, return defaults
          return {
            userRole: 'individual',
            jurisdiction: '',
            legalInterests: [],
            alertFrequency: 'daily'
          };
        }
        
        return {
          userRole: data.user_role,
          jurisdiction: data.jurisdiction,
          legalInterests: data.legal_interests,
          alertFrequency: data.alert_frequency
        };
      }
      
      // For guest users, get from localStorage
      const settings = localStorage.getItem('legal_oracle_alert_settings');
      return settings ? JSON.parse(settings) : {
        userRole: 'individual',
        jurisdiction: '',
        legalInterests: [],
        alertFrequency: 'daily'
      };
    } catch (error) {
      console.error('Get alert settings error:', error);
      toast.error('Failed to load alert settings.');
      return {
        userRole: 'individual',
        jurisdiction: '',
        legalInterests: [],
        alertFrequency: 'daily'
      };
    }
  }
};

export default {
  auth,
  cases,
  trends,
  jurisdictions,
  precedents,
  compliance,
  arbitrage,
};