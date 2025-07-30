import pytest
from httpx import AsyncClient
from caselaw_service.main import app
from caselaw_service.gemini_client import gemini_client

@pytest.mark.asyncio
async def test_precedent_predict_success(monkeypatch):
    async def dummy_optimize_strategy(*args, **kwargs):
        return {
            "relevant_precedents": [
                {"citation": "123 US 456", "summary": "Landmark case on contract law."}
            ],
            "success_rates": {"contract": 0.82},
            "recommendations": ["Use precedent X for best outcome"]
        }
    monkeypatch.setattr(gemini_client, "optimize_strategy", dummy_optimize_strategy)

    class DummySupabase:
        async def insert(self, table, data):
            return {"id": 1, **data}
    import caselaw_service.oracle_api as oracle
    monkeypatch.setattr(oracle, "supabase", DummySupabase())

    async with AsyncClient(app=app, base_url="http://test") as ac:
        payload = {
            "case_type": "contract",
            "jurisdiction": "US federal",
            "key_facts": "Breach of contract for delivery of goods"
        }
        resp = await ac.post("/api/v1/precedent/predict", json=payload)
        assert resp.status_code == 200
        data = resp.json()
        assert "relevant_precedents" in data
        assert "success_rates" in data
        assert "recommendations" in data

@pytest.mark.asyncio
async def test_precedent_predict_gemini_error(monkeypatch):
    async def fail_optimize_strategy(*args, **kwargs):
        raise Exception("Gemini error!")
    monkeypatch.setattr(gemini_client, "optimize_strategy", fail_optimize_strategy)
    import caselaw_service.oracle_api as oracle
    class DummySupabase:
        async def insert(self, table, data):
            return {"id": 1, **data}
    monkeypatch.setattr(oracle, "supabase", DummySupabase())
    async with AsyncClient(app=app, base_url="http://test") as ac:
        payload = {
            "case_type": "contract",
            "jurisdiction": "US federal",
            "key_facts": "Breach of contract for delivery of goods"
        }
        resp = await ac.post("/api/v1/precedent/predict", json=payload)
        assert resp.status_code == 502
        assert "Gemini model error" in resp.text
