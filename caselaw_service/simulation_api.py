"""
Simulation API router for strategy simulation against AI opponents.

Implements the /api/v1/simulation/run endpoint for user story #3.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional
from caselaw_service.auth import get_current_user
import uuid
from datetime import datetime
import httpx

router = APIRouter(prefix="/api/v1", tags=["simulation"])

class SimulationRequest(BaseModel):
    case_id: Optional[str] = None
    strategy: str = Field(..., description="The legal strategy to simulate")
    opponent_type: str = Field(..., description="Type of opponent: 'opposing_counsel', 'judge', 'ai_system'")
    simulation_parameters: Dict[str, Any] = Field(default_factory=dict)

class SimulationResponse(BaseModel):
    simulation_id: str
    case_id: Optional[str]
    success_rate: float
    opponent_response: str
    key_insights: list[str]
    confidence_score: float

@router.post("/simulation/run", response_model=SimulationResponse)
async def run_simulation(
    body: SimulationRequest,
    user=Depends(get_current_user)
):
    """Simulate legal strategies against AI opponents, persist results."""
    import logging
    import uuid
    from datetime import datetime
    from caselaw_service.gemini_client import gemini_client
    from caselaw_service.supabase_client import supabase

    logger = logging.getLogger("simulation_api")

    # Generate simulation ID
    simulation_id = str(uuid.uuid4())
    case_id = getattr(body, "case_id", None) or str(uuid.uuid4())

    # Prepare payload for Gemini client
    gemini_payload = {
        "case_id": case_id,
        "strategy": getattr(body, "strategy", None),
        "opponent_type": getattr(body, "opponent_type", None),
        "simulation_parameters": getattr(body, "simulation_parameters", {}),
        "user_id": getattr(user, "id", user.get("sub", "anon")),
    }

    # Call Gemini for simulation
    try:
        simulation_result = await gemini_client.simulate_strategy(
            case_id=gemini_payload["case_id"],
            strategy=gemini_payload["strategy"],
            opponent_type=gemini_payload["opponent_type"],
            simulation_parameters=gemini_payload["simulation_parameters"]
        )
    except Exception as e:
        logger.error(f"Gemini simulation failed: {e}")
        raise HTTPException(status_code=502, detail="Gemini simulation failed")

    # Store simulation results in Supabase
    simulation_data = {
        "id": simulation_id,
        "user_id": gemini_payload["user_id"],
        "case_id": case_id,
        "strategy": gemini_payload["strategy"],
        "opponent_type": gemini_payload["opponent_type"],
        "simulation_parameters": gemini_payload["simulation_parameters"],
        "success_rate": simulation_result.get("success_rate", 0.0),
        "opponent_response": simulation_result.get("opponent_response", ""),
        "key_insights": simulation_result.get("key_insights", []),
        "confidence_score": simulation_result.get("confidence_score", 0.0),
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
    try:
        await supabase.insert("simulations", simulation_data)
    except Exception as e:
        logger.warning(f"Supabase write failed: {e}")
        # Do not fail the endpoint if DB write fails

    return SimulationResponse(
        simulation_id=simulation_id,
        case_id=case_id,
        success_rate=simulation_data["success_rate"],
        opponent_response=simulation_data["opponent_response"],
        key_insights=simulation_data["key_insights"],
        confidence_score=simulation_data["confidence_score"]
    )
