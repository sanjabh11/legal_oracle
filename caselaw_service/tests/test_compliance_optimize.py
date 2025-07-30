import pytest
from httpx import AsyncClient
from caselaw_service.main import app

@pytest.mark.asyncio
async def test_compliance_optimize_success(monkeypatch):
    from caselaw_service.gemini_client import gemini_client
    async def dummy_optimize_strategy(case_details, strategies):
        return {
            "compliance_score": 0.95,
            "recommendations": ["Update policies", "Train staff"],
            "risk_assessment": "Low risk"
        }
    monkeypatch.setattr(gemini_client, "optimize_strategy", dummy_optimize_strategy)
    payload = {"industry": "finance", "regulations": ["SOX", "GDPR"]}
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.post("/api/v1/compliance/optimize", json=payload)
        assert resp.status_code == 200
        data = resp.json()
        assert data["compliance_score"] == 0.95
        assert "recommendations" in data
        assert data["risk_assessment"] == "Low risk"

@pytest.mark.asyncio
async def test_compliance_optimize_gemini_error(monkeypatch):
    from caselaw_service.gemini_client import gemini_client
    async def fail_optimize_strategy(case_details, strategies):
        raise Exception("Gemini error!")
    monkeypatch.setattr(gemini_client, "optimize_strategy", fail_optimize_strategy)
    payload = {"industry": "finance", "regulations": ["SOX", "GDPR"]}
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.post("/api/v1/compliance/optimize", json=payload)
        assert resp.status_code == 502
        assert "Gemini" in resp.text
