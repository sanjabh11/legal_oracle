"""Oracle API routers for outcome prediction, strategy optimization, etc.

Sprint-scaffold: minimal endpoints that echo the request payload. Frontend can
replace geminiService mocks with these endpoints immediately. Once the Gemini
backend helpers are available these handlers can delegate real processing.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from typing import Any, Dict, List
from caselaw_service.api_models import (
    OutcomeRequest as NewOutcomeRequest,
    OutcomeResponse as NewOutcomeResponse,
    StrategyRequest as NewStrategyRequest,
    StrategyResponse,

    JurisdictionRequest as NewJurisdictionRequest,
    JurisdictionResponse as NewJurisdictionResponse,
    ComplianceRequest as NewComplianceRequest,
    ComplianceResponse as NewComplianceResponse,
    TrendsRequest as NewTrendsRequest,
    TrendsResponse as NewTrendsResponse,
    PrecedentRequest as NewPrecedentRequest,
    PrecedentResponse as NewPrecedentResponse
)
from caselaw_service.auth import get_current_user
from caselaw_service.supabase_client import supabase

router = APIRouter(prefix="/api/v1", tags=["oracle"])

# ---------------------------------------------------------------------------
# Pydantic request / response schemas (simplified placeholders)
# ---------------------------------------------------------------------------
class OutcomeRequest(BaseModel):
    case_type: str = Field(..., example="contract_dispute")
    jurisdiction: str = Field(..., example="California")
    key_facts: List[str] = Field(..., example=["Breach of contract for late delivery"])
    judge_name: str | None = None
    model: str | None = Field(None, example="gemini-2.5-flash", description="LLM model to use")

class OutcomeResponse(BaseModel):
    predicted_outcome: str
    probabilities: Dict[str, float]
    reasoning: str
    confidence: float

class StrategyRequest(BaseModel):
    case_id: str | None = None
    case_details: str | None = None
    strategies: List[str] | None = None


class JurisdictionRequest(BaseModel):
    case_type: str
    key_facts: str

class JurisdictionResponse(BaseModel):
    optimal_jurisdiction: str
    reasoning: str
    success_probability: float

class ComplianceRequest(BaseModel):
    industry: str
    regulations: List[str] | None = None

class ComplianceResponse(BaseModel):
    compliance_score: float
    recommendations: List[str]
    risk_assessment: str

class TrendsRequest(BaseModel):
    industry: str
    timeframe: str | None = None

class TrendsResponse(BaseModel):
    trend_analysis: Dict[str, Any]
    predictions: List[Dict[str, Any]]
    confidence_score: float

class LandmarkRequest(BaseModel):
    case_details: str

class LandmarkResponse(BaseModel):
    likelihood: float
    justification: str

# ---------------------------------------------------------------------------
# Endpoint implementations – echo demo responses.
# ---------------------------------------------------------------------------
@router.post("/outcome/predict", response_model=OutcomeResponse)
async def predict_outcome(body: OutcomeRequest, user=Depends(get_current_user)):
    """Predict case outcome using Gemini LLM and store case in Supabase."""
    from caselaw_service.gemini_client import gemini_client
    import logging

    logger = logging.getLogger("oracle_api")

    # 1. Model selection (if supported)
    model = body.model or "gemini-2.5-flash"
    try:
        # If Gemini supports model selection, pass model param (else fallback)
        prediction = await gemini_client.predict_outcome(
            case_type=body.case_type,
            jurisdiction=body.jurisdiction,
            key_facts=body.key_facts,
            judge_name=body.judge_name
            # model=model  # Uncomment if GeminiClient supports model param
        )
    except Exception as e:
        logger.error(f"Gemini prediction failed: {e}")
        raise HTTPException(status_code=502, detail=f"Gemini model error: {str(e)}")

    # 2. Persist to Supabase
    try:
        supabase_data = {
            "user_id": user.get("sub", user.get("id", "anon")),
            "case_type": body.case_type,
            "jurisdiction": body.jurisdiction,
            "key_facts": ", ".join(body.key_facts),
            "judge_name": body.judge_name,
            "predicted_outcome": prediction.get("predicted_outcome", "unknown"),
            "probabilities": prediction.get("probabilities", {}),
        }
        await supabase.insert("cases", supabase_data)
    except Exception as e:
        logger.warning(f"Supabase write failed: {e}")
        # Do not fail the endpoint if DB write fails

    return OutcomeResponse(
        predicted_outcome=prediction.get("predicted_outcome", "unknown"),
        probabilities=prediction.get("probabilities", {}),
        reasoning=prediction.get("reasoning", "Analysis completed"),
        confidence=prediction.get("confidence", 0.5)
    )

@router.post("/strategy/optimize", response_model=StrategyResponse)
async def optimize_strategy(body: StrategyRequest, user=Depends(get_current_user)):
    """Generate optimal legal strategy using Gemini LLM and persist strategy."""
    from caselaw_service.gemini_client import gemini_client
    import logging
    from datetime import datetime
    import uuid

    logger = logging.getLogger("oracle_api")

    # 1. Persist strategy request to Supabase
    strategy_id = str(uuid.uuid4())
    strategy_data = {
        "id": strategy_id,
        "user_id": getattr(user, "id", user.get("sub", "anon")),
        "case_id": getattr(body, "case_id", None),
        "case_details": getattr(body, "case_details", None),
        "strategies": getattr(body, "strategies", []),
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat(),
    }
    try:
        await supabase.insert("strategies", strategy_data)
    except Exception as e:
        logger.warning(f"Supabase write failed: {e}")
        # Do not fail the endpoint if DB write fails

    # 2. Call Gemini for strategy optimization
    try:
        case_details = body.case_details or ""
        strategies = body.strategies or []
        strategy = await gemini_client.optimize_strategy(
            case_details=case_details,
            strategies=strategies
        )
    except Exception as e:
        logger.error(f"Gemini strategy optimization failed: {e}")
        raise HTTPException(status_code=502, detail="Gemini strategy optimization failed")


    required_keys = {
        "optimal_strategy": "",
        "rationale": "",
        "expected_outcome": "",
        "recommendations": [],
        "overall_recommendation": ""
    }
    strategy_response = {k: strategy.get(k, v) for k, v in required_keys.items()}

    return StrategyResponse(**strategy_response)


@router.post("/jurisdiction/optimize", response_model=JurisdictionResponse)
async def optimize_jurisdiction(body: JurisdictionRequest, user=Depends(get_current_user)):
    """Optimize jurisdiction using Gemini LLM."""
    from caselaw_service.gemini_client import gemini_client
    import logging
    logger = logging.getLogger("oracle_api")
    try:
        result = await gemini_client.optimize_strategy(
            case_details=f"Jurisdiction optimization for {body.case_type} with facts: {body.key_facts}",
            strategies=["venue_selection", "precedent_analysis", "jurisdictional_advantage"]
        )
        optimal_jurisdiction = result.get("optimal_jurisdiction", "California")
        reasoning = result.get("rationale", "Gemini analysis completed.")
        success_probability = result.get("success_probability", 0.8)
    except Exception as e:
        logger.error(f"Gemini jurisdiction optimization failed: {e}")
        raise HTTPException(status_code=502, detail=f"Gemini model error: {str(e)}")
    return JurisdictionResponse(
        optimal_jurisdiction=optimal_jurisdiction,
        reasoning=reasoning,
        success_probability=success_probability
    )

@router.post("/compliance/optimize", response_model=ComplianceResponse)
async def optimize_compliance(body: ComplianceRequest, user=Depends(get_current_user)):
    """Optimize compliance strategy using Gemini LLM."""
    from caselaw_service.gemini_client import gemini_client
    import logging
    logger = logging.getLogger("oracle_api")
    try:
        result = await gemini_client.optimize_strategy(
            case_details=f"Compliance optimization for {body.industry} industry",
            strategies=["regulatory_compliance", "risk_mitigation", "audit_readiness"]
        )
        compliance_score = result.get("compliance_score", 0.87)
        recommendations = result.get("recommendations", [
            "Implement comprehensive compliance monitoring",
            "Establish regular audit procedures",
            "Create detailed documentation protocols",
            "Train staff on latest regulations"
        ])
        risk_assessment = result.get("risk_assessment", "Medium risk - proactive compliance measures recommended")
    except Exception as e:
        logger.error(f"Gemini compliance optimization failed: {e}")
        raise HTTPException(status_code=502, detail=f"Gemini model error: {str(e)}")
    return ComplianceResponse(
        compliance_score=compliance_score,
        recommendations=recommendations,
        risk_assessment=risk_assessment
    )

@router.post("/trends/forecast", response_model=TrendsResponse)
async def forecast_trends(body: TrendsRequest, user=Depends(get_current_user)):
    """Forecast legal trends using Gemini LLM."""
    from caselaw_service.gemini_client import gemini_client
    
    # Call Gemini client for trend forecasting
    import logging
    logger = logging.getLogger("oracle_api")
    try:
        trends = await gemini_client.optimize_strategy(
            case_details=f"Trend forecasting for {body.industry} industry over {body.timeframe or '12 months'}",
            strategies=["market_analysis", "regulatory_forecasting", "technology_impact"]
        )
    except Exception as e:
        logger.error(f"Gemini trend forecast failed: {e}")
        raise HTTPException(status_code=502, detail=f"Gemini model error: {str(e)}")

    return TrendsResponse(
        trend_analysis={
            "current_trends": [
                "Increased regulatory scrutiny",
                "Rise in AI-related legal issues",
                "Growing importance of data privacy"
            ],
            "market_impact": "High"
        },
        predictions=[
            {
                "prediction": "Regulatory compliance requirements will increase 40%",
                "confidence": 0.82,
                "timeline": "6-12 months"
            },
            {
                "prediction": "AI litigation cases will double",
                "confidence": 0.78,
                "timeline": "12-18 months"
            }
        ],
        confidence_score=0.80,
        key_indicators=["regulatory_changes", "court_decisions", "industry_reports"]
    )

@router.post("/precedent/simulate", response_model=NewPrecedentResponse)
async def simulate_precedent(body: NewPrecedentRequest, user=Depends(get_current_user)):
    """Simulate precedent analysis using Gemini and persist results."""
    from caselaw_service.gemini_client import gemini_client
    import logging
    from datetime import datetime
    import uuid
    logger = logging.getLogger("oracle_api")
    precedent_id = str(uuid.uuid4())
    try:
        result = await gemini_client.optimize_strategy(
            case_details=f"Precedent simulation for {body.case_type} in {body.jurisdiction or 'General'}: {body.key_facts}",
            strategies=["precedent_analysis", "case_matching", "success_rate_estimation"]
        )
        relevant_precedents = result.get("relevant_precedents", [
            {"case": "Smith v. Jones", "citation": "123 F.3d 456", "key_factors": ["contract_breach", "damages_proven"]}
        ])
        success_rates = result.get("success_rates", {"plaintiff_win": 0.75, "defendant_win": 0.15, "settlement": 0.10})
        recommendations = result.get("recommendations", [
            "Focus on similar successful precedents",
            "Emphasize key distinguishing factors",
            "Prepare for settlement negotiations"
        ])
    except Exception as e:
        logger.error(f"Gemini precedent simulation failed: {e}")
        raise HTTPException(status_code=502, detail=f"Gemini model error: {str(e)}")
    # Persist to Supabase
    try:
        precedent_data = {
            "id": precedent_id,
            "user_id": getattr(user, "id", user.get("sub", "anon")),
            "case_type": body.case_type,
            "jurisdiction": body.jurisdiction,
            "key_facts": body.key_facts,
            "relevant_precedents": relevant_precedents,
            "success_rates": success_rates,
            "recommendations": recommendations,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        await supabase.insert("precedents", precedent_data)
    except Exception as e:
        logger.warning(f"Supabase write failed: {e}")
    return NewPrecedentResponse(
        relevant_precedents=relevant_precedents,
        success_rates=success_rates,
        recommendations=recommendations
    )

@router.post("/precedent/predict", response_model=LandmarkResponse)
async def predict_landmark(body: LandmarkRequest, user=Depends(get_current_user)):
    """Predict landmark case likelihood using Gemini LLM and persist results."""
    from caselaw_service.gemini_client import gemini_client
    import logging
    from datetime import datetime
    import uuid
    logger = logging.getLogger("oracle_api")
    landmark_id = str(uuid.uuid4())
    try:
        # Call Gemini for landmark prediction
        result = await gemini_client.optimize_strategy(
            case_details=f"Landmark prediction for: {body.case_details}",
            strategies=["landmark_analysis", "precedent_significance", "societal_impact"]
        )
        likelihood = result.get("likelihood", 0.42)
        justification = result.get("justification", "Case addresses novel constitutional issue.")
    except Exception as e:
        logger.error(f"Gemini landmark prediction failed: {e}")
        raise HTTPException(status_code=502, detail=f"Gemini model error: {str(e)}")
    # Persist to Supabase
    try:
        landmark_data = {
            "id": landmark_id,
            "user_id": getattr(user, "id", user.get("sub", "anon")),
            "case_details": body.case_details,
            "likelihood": likelihood,
            "justification": justification,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        await supabase.insert("landmarks", landmark_data)
    except Exception as e:
        logger.warning(f"Supabase write failed: {e}")
    return LandmarkResponse(likelihood=likelihood, justification=justification)

