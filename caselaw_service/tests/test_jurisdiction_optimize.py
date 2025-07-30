import pytest
from httpx import AsyncClient
from caselaw_service.main import app

@pytest.mark.asyncio
async def test_jurisdiction_optimize_success(monkeypatch):
    from caselaw_service.gemini_client import gemini_client
    async def dummy_optimize_strategy(case_details, strategies):
        return {
            "optimal_jurisdiction": "New York",
            "rationale": "NY courts have strong contract law precedent.",
            "success_probability": 0.92
        }
    monkeypatch.setattr(gemini_client, "optimize_strategy", dummy_optimize_strategy)
    payload = {"case_type": "contract_dispute", "key_facts": "International delivery delay"}
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.post("/api/v1/jurisdiction/optimize", json=payload)
        assert resp.status_code == 200
        data = resp.json()
        assert data["optimal_jurisdiction"] == "New York"
        assert data["success_probability"] > 0.9
        assert "reasoning" in data

@pytest.mark.asyncio
async def test_jurisdiction_optimize_gemini_error(monkeypatch):
    from caselaw_service.gemini_client import gemini_client
    async def fail_optimize_strategy(case_details, strategies):
        raise Exception("Gemini error!")
    monkeypatch.setattr(gemini_client, "optimize_strategy", fail_optimize_strategy)
    payload = {"case_type": "contract_dispute", "key_facts": "International delivery delay"}
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.post("/api/v1/jurisdiction/optimize", json=payload)
        assert resp.status_code == 502
        assert "Gemini" in resp.text
