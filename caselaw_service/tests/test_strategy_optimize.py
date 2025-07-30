import pytest
from httpx import AsyncClient
from caselaw_service.main import app

@pytest.mark.asyncio
async def test_strategy_optimize_success(monkeypatch):
    # Patch Gemini client
    from caselaw_service.gemini_client import gemini_client
    async def dummy_optimize_strategy(*args, **kwargs):
        return {
            "optimal_strategy": "Settle early",
            "rationale": "Cost and time savings likely.",
            "expected_outcome": "Favorable settlement",
            "recommendations": [
                {"strategy": "Early mediation", "success_probability": 0.8, "timeline": "2 months"}
            ],
            "overall_recommendation": "Early mediation"
        }
    monkeypatch.setattr(gemini_client, "optimize_strategy", dummy_optimize_strategy)
    # Patch Supabase
    from caselaw_service import oracle_api
    class DummySupabase:
        async def insert(self, table, data):
            return {"id": data["id"], **data}
        async def update(self, table, id, data):
            return {"id": id, **data}
    monkeypatch.setattr(oracle_api, "supabase", DummySupabase())
    payload = {
        "case_id": "case-123",
        "case_details": "Contract dispute over late delivery.",
        "strategies": ["negotiate", "litigate"]
    }
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.post("/api/v1/strategy/optimize", json=payload)
        assert resp.status_code == 200
        data = resp.json()
        assert isinstance(data, dict)
        assert "optimal_strategy" in data
        assert "expected_outcome" in data
        assert "recommendations" in data
        assert "overall_recommendation" in data

@pytest.mark.asyncio
async def test_strategy_optimize_gemini_error(monkeypatch):
    from caselaw_service.gemini_client import gemini_client
    async def fail_optimize_strategy(*args, **kwargs):
        raise Exception("Gemini error!")
    monkeypatch.setattr(gemini_client, "optimize_strategy", fail_optimize_strategy)
    from caselaw_service import oracle_api
    class DummySupabase:
        async def insert(self, table, data):
            return {"id": data["id"], **data}
        async def update(self, table, id, data):
            return {"id": id, **data}
    monkeypatch.setattr(oracle_api, "supabase", DummySupabase())
    payload = {
        "case_id": "case-err",
        "case_details": "Test error.",
        "strategies": ["test"]
    }
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.post("/api/v1/strategy/optimize", json=payload)
        assert resp.status_code == 502
        assert "Gemini strategy optimization failed" in resp.text

@pytest.mark.asyncio
async def test_strategy_optimize_supabase_error(monkeypatch):
    from caselaw_service.gemini_client import gemini_client
    async def dummy_optimize_strategy(*args, **kwargs):
        return {
            "optimal_strategy": "Settle early",
            "rationale": "Cost and time savings likely.",
            "expected_outcome": "Favorable settlement",
            "recommendations": [
                {"strategy": "Early mediation", "success_probability": 0.8, "timeline": "2 months"}
            ],
            "overall_recommendation": "Early mediation"
        }
    monkeypatch.setattr(gemini_client, "optimize_strategy", dummy_optimize_strategy)
    from caselaw_service import oracle_api
    class DummySupabase:
        async def insert(self, table, data):
            raise Exception("Supabase insert error!")
        async def update(self, table, id, data):
            raise Exception("Supabase update error!")
    monkeypatch.setattr(oracle_api, "supabase", DummySupabase())
    payload = {
        "case_id": "case-456",
        "case_details": "Contract dispute over late delivery.",
        "strategies": ["negotiate", "litigate"]
    }
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.post("/api/v1/strategy/optimize", json=payload)
        assert resp.status_code == 200
        data = resp.json()
        assert isinstance(data, dict)
        assert "optimal_strategy" in data
        assert "expected_outcome" in data
        assert "recommendations" in data
        assert "overall_recommendation" in data
