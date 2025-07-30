import pytest
from httpx import AsyncClient
from caselaw_service.main import app
from caselaw_service.gemini_client import gemini_client

@pytest.mark.asyncio
async def test_arbitrage_alerts_success(monkeypatch):
    async def dummy_optimize_strategy(*args, **kwargs):
        return {
            "arbitrage_opportunities": [
                {"opportunity": "Cross-jurisdictional regulatory arbitrage", "expected_return": 0.18, "timeline": "3-6 months"},
                {"opportunity": "Technology-enabled compliance optimization", "expected_return": 0.12, "timeline": "1-3 months"}
            ],
            "risk_assessment": {"overall": "moderate", "details": "Diverse regulatory landscapes"},
            "expected_returns": {"Cross-jurisdictional regulatory arbitrage": 0.18, "Technology-enabled compliance optimization": 0.12}
        }
    monkeypatch.setattr(gemini_client, "optimize_strategy", dummy_optimize_strategy)

    class DummySupabase:
        async def insert(self, table, data):
            return {"id": 1, **data}
    import caselaw_service.low_priority_endpoints as endpoints
    monkeypatch.setattr(endpoints, "supabase", DummySupabase())

    async with AsyncClient(app=app, base_url="http://test") as ac:
        payload = {
            "case_type": "civil",
            "jurisdiction": "US federal",
            "budget": 100000.0
        }
        resp = await ac.post("/api/v1/arbitrage/alerts", json=payload)
        assert resp.status_code == 200
        data = resp.json()
        assert "arbitrage_opportunities" in data
        assert "risk_assessment" in data
        assert "expected_returns" in data

@pytest.mark.asyncio
async def test_arbitrage_alerts_gemini_error(monkeypatch):
    async def fail_optimize_strategy(*args, **kwargs):
        raise Exception("Gemini error!")
    monkeypatch.setattr(gemini_client, "optimize_strategy", fail_optimize_strategy)
    import caselaw_service.low_priority_endpoints as endpoints
    class DummySupabase:
        async def insert(self, table, data):
            return {"id": 1, **data}
    monkeypatch.setattr(endpoints, "supabase", DummySupabase())
    async with AsyncClient(app=app, base_url="http://test") as ac:
        payload = {
            "case_type": "civil",
            "jurisdiction": "US federal",
            "budget": 100000.0
        }
        resp = await ac.post("/api/v1/arbitrage/alerts", json=payload)
        assert resp.status_code == 502
        assert "Gemini model error" in resp.text
