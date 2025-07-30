import pytest
from httpx import AsyncClient
from caselaw_service.main import app

@pytest.mark.asyncio
async def test_trends_forecast_success(monkeypatch):
    from caselaw_service.gemini_client import gemini_client
    async def dummy_optimize_strategy(case_details, strategies):
        return {
            "trend_analysis": {
                "current_trends": ["trend1", "trend2"],
                "market_impact": "High"
            },
            "predictions": [
                {"prediction": "Growth", "confidence": 0.9, "timeline": "6mo"},
                {"prediction": "Risk", "confidence": 0.7, "timeline": "12mo"}
            ],
            "confidence_score": 0.88,
            "key_indicators": ["regulatory", "court"]
        }
    monkeypatch.setattr(gemini_client, "optimize_strategy", dummy_optimize_strategy)
    payload = {"industry": "AI", "timeframe": "1_year"}
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.post("/api/v1/trends/forecast", json=payload)
        assert resp.status_code == 200
        data = resp.json()
        assert "trend_analysis" in data
        assert "predictions" in data
        assert data["confidence_score"] > 0

@pytest.mark.asyncio
async def test_trends_forecast_gemini_error(monkeypatch):
    from caselaw_service.gemini_client import gemini_client
    async def fail_optimize_strategy(case_details, strategies):
        raise Exception("Gemini error!")
    monkeypatch.setattr(gemini_client, "optimize_strategy", fail_optimize_strategy)
    payload = {"industry": "AI", "timeframe": "1_year"}
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.post("/api/v1/trends/forecast", json=payload)
        assert resp.status_code == 502
        assert "Gemini" in resp.text
