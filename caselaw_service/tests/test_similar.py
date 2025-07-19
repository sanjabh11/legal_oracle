import pytest
from httpx import AsyncClient
from caselaw_service.main import app

@pytest.mark.asyncio
async def test_similar_placeholder():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.post("/api/v1/caselaw/similar", json={"text": "landmark search and seizure case"})
        assert resp.status_code == 200
        data = resp.json()
        assert isinstance(data, list)
        assert data == []

@pytest.mark.asyncio
async def test_similar_missing_text():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.post("/api/v1/caselaw/similar", json={})
        assert resp.status_code == 422  # validation error for missing required field
