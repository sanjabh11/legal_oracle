"""
API models for Legal Oracle platform
Pydantic models for all API endpoints
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class OutcomeRequest(BaseModel):
    case_type: str = Field(..., description="Type of legal case")
    jurisdiction: str = Field(..., description="Legal jurisdiction")
    key_facts: List[str] = Field(..., description="Key facts about the case")
    judge_name: Optional[str] = Field(None, description="Name of the judge")

class OutcomeResponse(BaseModel):
    predicted_outcome: str = Field(..., description="Predicted outcome (win/lose/settle)")
    probabilities: Dict[str, float] = Field(..., description="Probability distribution")
    reasoning: str = Field(..., description="AI reasoning for prediction")
    confidence: float = Field(..., description="Confidence score (0-1)")

class StrategyRequest(BaseModel):
    case_id: str = Field(..., description="Unique case identifier")
    case_details: str = Field(..., description="Detailed case description")
    strategies: Optional[List[str]] = Field(None, description="Current strategies to optimize")

class StrategyResponse(BaseModel):
    optimal_strategy: str = Field(..., description="Optimal strategy")
    rationale: str = Field(..., description="Rationale for optimal strategy")
    expected_outcome: str = Field(..., description="Expected outcome")
    recommendations: List[Dict[str, Any]] = Field(..., description="Strategy recommendations")
    overall_recommendation: str = Field(..., description="Primary recommended strategy")

class SimulationRequest(BaseModel):
    strategy: str = Field(..., description="Strategy to simulate")
    opponent_type: str = Field(..., description="Type of opponent")
    simulation_parameters: Dict[str, Any] = Field(..., description="Simulation parameters")
    case_id: Optional[str] = Field(None, description="Case identifier")

class SimulationResponse(BaseModel):
    success_rate: float = Field(..., description="Simulated success rate")
    opponent_response: str = Field(..., description="AI opponent response")
    key_insights: List[str] = Field(..., description="Key insights from simulation")
    confidence_score: float = Field(..., description="Confidence score")
    simulation_details: Dict[str, Any] = Field(..., description="Detailed simulation results")

class JurisdictionRequest(BaseModel):
    case_type: str = Field(..., description="Type of case for jurisdiction optimization")
    key_facts: str = Field(..., description="Key facts for jurisdiction analysis")

class JurisdictionResponse(BaseModel):
    optimal_jurisdiction: str = Field(..., description="Recommended jurisdiction")
    reasoning: str = Field(..., description="Reasoning for jurisdiction recommendation")
    success_probability: float = Field(..., description="Probability of success in recommended jurisdiction")

class ComplianceRequest(BaseModel):
    industry: str = Field(..., description="Industry for compliance optimization")
    regulations: Optional[List[str]] = Field(None, description="Specific regulations to consider")

class ComplianceResponse(BaseModel):
    compliance_score: float = Field(..., description="Compliance score (0-1)")
    recommendations: List[str] = Field(..., description="Compliance recommendations")
    risk_assessment: str = Field(..., description="Risk assessment summary")

class TrendsRequest(BaseModel):
    industry: str = Field(..., description="Industry for trend analysis")
    timeframe: Optional[str] = Field("1_year", description="Timeframe for analysis")

class TrendsResponse(BaseModel):
    trend_analysis: Dict[str, Any] = Field(..., description="Trend analysis results")
    predictions: List[Dict[str, Any]] = Field(..., description="Future trend predictions")
    confidence_score: float = Field(..., description="Confidence in predictions")

class PrecedentRequest(BaseModel):
    case_type: str = Field(..., description="Type of case for precedent analysis")
    jurisdiction: Optional[str] = Field(None, description="Jurisdiction for precedent search")
    key_facts: str = Field(..., description="Key facts for precedent matching")

class PrecedentResponse(BaseModel):
    relevant_precedents: List[Dict[str, Any]] = Field(..., description="Relevant legal precedents")
    success_rates: Dict[str, float] = Field(..., description="Success rates by precedent type")
    recommendations: List[str] = Field(..., description="Recommendations based on precedents")

class ArbitrageRequest(BaseModel):
    case_type: str = Field(..., description="Type of case for arbitrage analysis")
    jurisdiction: str = Field(..., description="Jurisdiction for arbitrage opportunities")
    budget: Optional[float] = Field(None, description="Budget for arbitrage opportunities")

class ArbitrageResponse(BaseModel):
    arbitrage_opportunities: List[Dict[str, Any]] = Field(..., description="Identified arbitrage opportunities")
    risk_assessment: Dict[str, Any] = Field(..., description="Risk assessment for opportunities")
    expected_returns: Dict[str, float] = Field(..., description="Expected returns for opportunities")

class HealthResponse(BaseModel):
    status: str = Field(..., description="Service health status")
    timestamp: str = Field(..., description="Health check timestamp")
    services: Dict[str, str] = Field(..., description="Status of individual services")
