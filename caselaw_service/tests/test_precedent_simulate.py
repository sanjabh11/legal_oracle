import pytest
from httpx import AsyncClient
from caselaw_service.main import app

@pytest.mark.asyncio
async def test_precedent_simulate_success(monkeypatch):
    from caselaw_service.gemini_client import gemini_client
    async def dummy_optimize_strategy(case_details, strategies):
        return {
            "relevant_precedents": [
                {"case": "Doe v. Roe", "citation": "456 F.2d 789", "key_factors": ["negligence", "proximate_cause"]}
            ],
            "success_rates": {"plaintiff_win": 0.65, "defendant_win": 0.25, "settlement": 0.10},
            "recommendations": ["Highlight key facts", "Reference Doe v. Roe"]
        }
    monkeypatch.setattr(gemini_client, "optimize_strategy", dummy_optimize_strategy)
    payload = {"case_type": "tort", "jurisdiction": "California", "key_facts": "Slip and fall in store"}
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.post("/api/v1/precedent/simulate", json=payload)
        assert resp.status_code == 200
        data = resp.json()
        assert "relevant_precedents" in data
        assert "success_rates" in data
        assert "recommendations" in data

@pytest.mark.asyncio
async def test_precedent_simulate_gemini_error(monkeypatch):
    from caselaw_service.gemini_client import gemini_client
    async def fail_optimize_strategy(case_details, strategies):
        raise Exception("Gemini error!")
    monkeypatch.setattr(gemini_client, "optimize_strategy", fail_optimize_strategy)
    payload = {"case_type": "tort", "jurisdiction": "California", "key_facts": "Slip and fall in store"}
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.post("/api/v1/precedent/simulate", json=payload)
        assert resp.status_code == 502
        assert "Gemini" in resp.text
