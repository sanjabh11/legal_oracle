import pytest
from httpx import AsyncClient
from caselaw_service.main import app

@pytest.mark.asyncio
async def test_simulation_run_success(monkeypatch):
    # Patch Gemini client
    from caselaw_service.gemini_client import gemini_client
    async def dummy_simulate_case(**kwargs):
        return {
            "success_rate": 0.85,
            "opponent_response": "Opponent likely to settle.",
            "key_insights": ["Strong evidence for plaintiff"],
            "confidence_score": 0.9
        }
    monkeypatch.setattr(gemini_client, "simulate_strategy", dummy_simulate_case)
    # Patch Supabase
    from caselaw_service import simulation_api
    class DummySupabase:
        async def insert(self, table, data):
            return {"id": data["id"], **data}
    monkeypatch.setattr(simulation_api, "supabase", DummySupabase())
    payload = {
        "case_id": "sim-case-1",
        "strategy": "negotiate",
        "opponent_type": "AI",
        "simulation_parameters": {"rounds": 3}
    }
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.post("/api/v1/simulation/run", json=payload)
        assert resp.status_code == 200
        data = await resp.json()
        assert data["success_rate"] == 0.85
        assert data["confidence_score"] == 0.9
        assert data["opponent_response"] == "Opponent likely to settle."
        assert "key_insights" in data

@pytest.mark.asyncio
async def test_simulation_run_gemini_error(monkeypatch):
    from caselaw_service.gemini_client import gemini_client
    async def fail_simulate_case(**kwargs):
        raise Exception("Gemini error!")
    monkeypatch.setattr(gemini_client, "simulate_strategy", fail_simulate_case)
    from caselaw_service import simulation_api
    class DummySupabase:
        async def insert(self, table, data):
            return {"id": data["id"], **data}
    monkeypatch.setattr(simulation_api, "supabase", DummySupabase())
    payload = {
        "case_id": "sim-case-err",
        "strategy": "negotiate",
        "opponent_type": "AI",
        "simulation_parameters": {"rounds": 1}
    }
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.post("/api/v1/simulation/run", json=payload)
        assert resp.status_code == 502
        assert "Gemini simulation failed" in await resp.text()

@pytest.mark.asyncio
async def test_simulation_run_supabase_error(monkeypatch):
    from caselaw_service.gemini_client import gemini_client
    async def dummy_simulate_case(**kwargs):
        return {
            "success_rate": 0.75,
            "opponent_response": "Opponent will contest.",
            "key_insights": ["Weak evidence for plaintiff"],
            "confidence_score": 0.7
        }
    monkeypatch.setattr(gemini_client, "simulate_strategy", dummy_simulate_case)
    from caselaw_service import simulation_api
    class DummySupabase:
        async def insert(self, table, data):
            raise Exception("Supabase insert error!")
    monkeypatch.setattr(simulation_api, "supabase", DummySupabase())
    payload = {
        "case_id": "sim-case-2",
        "strategy": "litigate",
        "opponent_type": "AI",
        "simulation_parameters": {"rounds": 2}
    }
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.post("/api/v1/simulation/run", json=payload)
        assert resp.status_code == 200
        data = await resp.json()
        assert data["success_rate"] == 0.75
        assert data["confidence_score"] == 0.7
        assert data["opponent_response"] == "Opponent will contest."
        assert "key_insights" in data
