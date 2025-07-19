import os
import httpx
from fastapi import APIRouter, Query, HTTPException
from fastapi.responses import JSONResponse

router = APIRouter()

@router.get("/api/v1/courtlistener/opinions")
async def proxy_courtlistener_opinions(query: str = Query(..., description="Search query for opinions")):
    api_root = os.getenv("COURTLISTENER_API_ROOT", "https://www.courtlistener.com/api/rest/v4/")
    url = f"{api_root}opinions/?search={query}&format=json"
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, headers={"Accept": "application/json"})
            resp.raise_for_status()
            return JSONResponse(content=resp.json(), status_code=resp.status_code)
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"CourtListener error: {e.response.text}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"CourtListener proxy error: {str(e)}")
