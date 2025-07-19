import pytest
from httpx import AsyncClient
from caselaw_service.main import app

@pytest.mark.asyncio
async def test_search_keyword():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.get("/api/v1/caselaw/search", params={"query": "Miranda", "limit": 2})
        assert resp.status_code == 200
        data = resp.json()
        assert isinstance(data, list)
        assert len(data) <= 2
        if data:
            assert "case_name" in data[0]
            assert "id" in data[0]

@pytest.mark.asyncio
async def test_search_no_query():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.get("/api/v1/caselaw/search", params={"query": ""})
        assert resp.status_code == 400
        assert resp.json()["detail"] == "query parameter is required"
