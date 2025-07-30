import pytest
from httpx import AsyncClient
from caselaw_service.main import app

@pytest.mark.asyncio
async def test_outcome_predict_success(monkeypatch):
    # Patch Gemini client
    from caselaw_service.gemini_client import gemini_client
    async def dummy_predict_outcome(*args, **kwargs):
        return {
            "predicted_outcome": "win",
            "probabilities": {"win": 0.8, "lose": 0.2},
            "reasoning": "Strong contract evidence.",
            "confidence": 0.8
        }
    monkeypatch.setattr(gemini_client, "predict_outcome", dummy_predict_outcome)
    async with AsyncClient(app=app, base_url="http://test") as ac:
        payload = {
            "case_type": "civil",
            "jurisdiction": "US federal",
            "key_facts": ["contract dispute", "damages claimed"],
            "judge_name": "Smith"
        }
        resp = await ac.post("/api/v1/outcome/predict", json=payload)
        assert resp.status_code == 200
        data = resp.json()
        assert "predicted_outcome" in data
        assert "probabilities" in data
        assert "reasoning" in data
        assert "confidence" in data

@pytest.mark.asyncio
async def test_outcome_predict_missing_fields():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        payload = {"case_type": "civil"}  # missing required fields
        resp = await ac.post("/api/v1/outcome/predict", json=payload)
        assert resp.status_code == 422

@pytest.mark.asyncio
async def test_outcome_predict_model_selection(monkeypatch):
    from caselaw_service.gemini_client import gemini_client
    async def dummy_predict_outcome(*args, **kwargs):
        return {
            "predicted_outcome": "lose",
            "probabilities": {"win": 0.1, "lose": 0.9},
            "reasoning": "Weak defense.",
            "confidence": 0.9
        }
    monkeypatch.setattr(gemini_client, "predict_outcome", dummy_predict_outcome)
    async with AsyncClient(app=app, base_url="http://test") as ac:
        payload = {
            "case_type": "criminal",
            "jurisdiction": "US state",
            "key_facts": ["burglary", "no witnesses"],
            "judge_name": "Doe",
            "model": "gemini-2.5-pro"
        }
        resp = await ac.post("/api/v1/outcome/predict", json=payload)
        assert resp.status_code == 200
        data = resp.json()
        assert data.get("predicted_outcome") is not None
        assert data.get("confidence") is not None

@pytest.mark.asyncio
async def test_outcome_predict_supabase_write(monkeypatch):
    # Patch SupabaseClient.insert to simulate DB write
    from caselaw_service import oracle_api
    from caselaw_service.gemini_client import gemini_client
    async def dummy_predict_outcome(*args, **kwargs):
        return {
            "predicted_outcome": "win",
            "probabilities": {"win": 0.8, "lose": 0.2},
            "reasoning": "Strong contract evidence.",
            "confidence": 0.8
        }
    monkeypatch.setattr(gemini_client, "predict_outcome", dummy_predict_outcome)
    class DummySupabase:
        async def insert(self, table, data):
            return {"id": 1, **data}
    monkeypatch.setattr(oracle_api, "supabase", DummySupabase())
    async with AsyncClient(app=app, base_url="http://test") as ac:
        payload = {
            "case_type": "civil",
            "jurisdiction": "US federal",
            "key_facts": ["contract dispute", "damages claimed"],
            "judge_name": "Smith"
        }
        resp = await ac.post("/api/v1/outcome/predict", json=payload)
        assert resp.status_code == 200
        data = resp.json()
        assert "predicted_outcome" in data
        assert "confidence" in data
