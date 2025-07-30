import pytest
from httpx import AsyncClient
from caselaw_service.main import app

@pytest.mark.asyncio
async def test_trends_model_success(monkeypatch):
    from caselaw_service.gemini_client import gemini_client
    async def dummy_optimize_strategy(case_details, strategies):
        return {
            "trend_analysis": {"evolution_patterns": ["pattern1"], "regulatory_trajectory": "test", "technology_impact": "test", "competitive_landscape": "test"},
            "predictions": [{"prediction": "test", "confidence": 0.99, "timeline": "now"}],
            "confidence_score": 0.95
        }
    monkeypatch.setattr(gemini_client, "optimize_strategy", dummy_optimize_strategy)
    payload = {"industry": "legal", "timeframe": "1_year"}
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.post("/api/v1/trends/model", json=payload)
        assert resp.status_code == 200
        data = resp.json()
        assert "trend_analysis" in data
        assert "predictions" in data
        assert "confidence_score" in data

@pytest.mark.asyncio
async def test_trends_model_gemini_error(monkeypatch):
    from caselaw_service.gemini_client import gemini_client
    async def fail_optimize_strategy(case_details, strategies):
        raise Exception("Gemini error!")
    monkeypatch.setattr(gemini_client, "optimize_strategy", fail_optimize_strategy)
    payload = {"industry": "legal", "timeframe": "1_year"}
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.post("/api/v1/trends/model", json=payload)
        assert resp.status_code == 500
        assert "Trend modeling failed" in resp.text
