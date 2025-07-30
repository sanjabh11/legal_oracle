"""FastAPI wrapper for Hugging Face U.S. Caselaw dataset.
Sprint-1 scaffold – minimal routes + health-check.

Once the streaming/search logic is implemented, these placeholder responses will
be replaced with real data (semantic search, judge analysis, etc.).
"""

import os
from fastapi import FastAPI, Depends, HTTPException, Request, status
from fastapi.responses import JSONResponse
from typing import List, Dict, Any
from datetime import datetime
from caselaw_service.models import CaseQuery, SimilarityQuery, CaseResult, SearchLog
from caselaw_service.auth import get_current_user
from caselaw_service.courtlistener_proxy import router as courtlistener_router
from caselaw_service.dataset_api import router as dataset_router
from caselaw_service.oracle_api import router as oracle_router
from caselaw_service.simulation_api import router as simulation_router
from caselaw_service.admin_api import router as admin_router
from caselaw_service.low_priority_endpoints import router as low_priority_router
from caselaw_service.export_api import router as export_router
from caselaw_service.feedback import router as feedback_router
from caselaw_service.analytics import router as analytics_router
from pydantic import ValidationError
import httpx
import datasets
import logging
from fastapi.middleware.cors import CORSMiddleware
from caselaw_service.embeddings import autocomplete, embed_query, get_index

# SlowAPI rate limiter
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address, default_limits=["60/minute"])
app = FastAPI(title="LEGAL ORACLE Caselaw Service", version="0.1.0")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# --- CORS for local frontend ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", "http://127.0.0.1:3000",
        "http://localhost:5173", "http://127.0.0.1:5173",
        "http://localhost:5174", "http://127.0.0.1:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Mount CourtListener proxy endpoints
app.include_router(courtlistener_router)
# Mount Oracle API endpoints
app.include_router(oracle_router)
# Mount Simulation API endpoints
app.include_router(simulation_router)
# Mount Dataset API endpoints
app.include_router(dataset_router)
# Mount low-priority endpoints (trends/model, arbitrage/alerts, etc.)
app.include_router(low_priority_router)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("caselaw_service")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

@app.get("/health")
@limiter.limit("30/minute")
async def health(request: Request) -> Dict[str, Any]:
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}

from functools import lru_cache
import hashlib
import time

# --- Simple in-memory LRU cache with TTL (10 min) ---
class TTLCache:
    def __init__(self, maxsize=128, ttl=600):
        self.cache = {}
        self.order = []
        self.maxsize = maxsize
        self.ttl = ttl

    def _make_key(self, query, limit):
        key = f"{query}|{limit}"
        return hashlib.sha256(key.encode()).hexdigest()

    def get(self, query, limit):
        k = self._make_key(query, limit)
        item = self.cache.get(k)
        if item:
            val, ts = item
            if time.time() - ts < self.ttl:
                # Move to end (LRU)
                self.order.remove(k)
                self.order.append(k)
                return val
            else:
                # Expired
                del self.cache[k]
                self.order.remove(k)
        return None

    def set(self, query, limit, value):
        k = self._make_key(query, limit)
        if k in self.cache:
            self.order.remove(k)
        elif len(self.order) >= self.maxsize:
            oldest = self.order.pop(0)
            del self.cache[oldest]
        self.cache[k] = (value, time.time())
        self.order.append(k)

case_search_cache = TTLCache(maxsize=128, ttl=600)

from slowapi.util import get_remote_address

@app.get("/api/v1/caselaw/search", response_model=List[CaseResult])
@limiter.limit("30/minute")
async def search_cases(request: Request, query: str, limit: int = 10, semantic: bool = False, user=Depends(get_current_user)):
    if not query:
        raise HTTPException(status_code=400, detail="query parameter is required")
    if not (1 <= limit <= 50):
        raise HTTPException(status_code=400, detail="limit must be 1-50")
    if semantic:
        idx = get_index()
        if idx and idx.ready:
            emb = embed_query(query)
            matches = idx.search(emb, top_k=limit)
            dataset = datasets.load_dataset("caselaw/justia-opinions", split="train", streaming=True)
            # Build lookup by index (assume order matches)
            all_cases = []
            for i, case in enumerate(dataset):
                all_cases.append(case)
                if len(all_cases) > max(i for i, _ in matches):
                    break
            results = []
            for i, dist in matches:
                case = all_cases[i]
                results.append(CaseResult(
                    id=case.get("id", ""),
                    case_name=case.get("case_name", ""),
                    court=case.get("court", ""),
                    jurisdiction=case.get("jurisdiction", ""),
                    date=case.get("date", ""),
                    citation=case.get("citation", ""),
                    summary=case.get("summary", "") or None,
                    url=case.get("url", None)
                ))
            return results
        # If FAISS unavailable, fallback
    # --- Check cache ---
    cached = case_search_cache.get(query, limit)
    if cached is not None:
        logger.info(f"Cache hit for query '{query}' (limit={limit})")
        return cached
    start = datetime.utcnow()
    try:
        dataset = datasets.load_dataset("caselaw/justia-opinions", split="train", streaming=True)
    except Exception:
        dataset = [
            {
                "id": "1",
                "case_name": "Miranda v. Arizona",
                "court": "US Supreme Court",
                "jurisdiction": "federal",
                "date": "1966-06-13",
                "citation": "384 U.S. 436",
                "summary": "Landmark decision on police interrogations",
                "text": "Miranda rights...",
                "url": "https://example.com/miranda"
            }
        ]
    results = []
    for case in dataset:
        if query.lower() in (case.get("case_name", "") + case.get("text", "")).lower():
            results.append(CaseResult(
                id=case.get("id", ""),
                case_name=case.get("case_name", ""),
                court=case.get("court", ""),
                jurisdiction=case.get("jurisdiction", ""),
                date=case.get("date", ""),
                citation=case.get("citation", ""),
                summary=case.get("summary", "") or None,
                url=case.get("url", None)
            ))
            if len(results) >= limit:
                break
    exec_ms = (datetime.utcnow() - start).total_seconds() * 1000
    # Log search to Supabase if configured
    if SUPABASE_URL and SUPABASE_KEY:
        async with httpx.AsyncClient() as client:
            try:
                await client.post(
                    f"{SUPABASE_URL}/rest/v1/caselaw_searches",
                    headers={
                        "apikey": SUPABASE_KEY,
                        "Authorization": f"Bearer {SUPABASE_KEY}",
                        "Content-Type": "application/json"
                    },
                    json=SearchLog(
                        user_id=user.get("sub", "anon"),
                        query=query,
                        search_type="keyword",
                        timestamp=datetime.utcnow().isoformat(),
                        results_count=len(results),
                        execution_time_ms=exec_ms
                    ).dict()
                )
            except Exception as e:
                logger.warning(f"Supabase log failed: {e}")
    # --- Update cache ---
    case_search_cache.set(query, limit, results)
    return results

@app.get("/api/v1/caselaw/autocomplete", response_model=List[str])
@limiter.limit("30/minute")
async def autocomplete_cases(request: Request, query: str, limit: int = 5):
    if not query.strip():
        return []
    return autocomplete(query, top_k=limit)

# --- Cache first N cases for quick similarity comparisons ---
MAX_CACHE_CASES = 500
_dataset_cache: List[dict] = []

async def _load_dataset_cache():
    global _dataset_cache
    if _dataset_cache:
        return _dataset_cache
    try:
        ds_iter = hf_datasets.load_dataset("caselaw/justia-opinions", split="train", streaming=True)
        for i, case in enumerate(ds_iter):
            _dataset_cache.append(case)
            if i + 1 >= MAX_CACHE_CASES:
                break
    except Exception:
        # Fallback to a single hard-coded case if dataset unavailable
        _dataset_cache = [
            {
                "id": "1",
                "case_name": "Miranda v. Arizona",
                "court": "US Supreme Court",
                "jurisdiction": "federal",
                "date": "1966-06-13",
                "citation": "384 U.S. 436",
                "summary": "Landmark decision on police interrogations",
                "text": "Miranda rights...",
                "url": "https://example.com/miranda"
            }
        ]
    return _dataset_cache

def _compute_similarity(text1: str, text2: str) -> float:
    """Simple Jaccard similarity on word sets."""
    s1 = set(text1.lower().split())
    s2 = set(text2.lower().split())
    if not s1 or not s2:
        return 0.0
    return len(s1 & s2) / len(s1 | s2)

@app.post("/api/v1/caselaw/similar", response_model=List[CaseResult])
@limiter.limit("30/minute")
async def similar_cases(request: Request, body: SimilarityQuery, user=Depends(get_current_user)):
    if not body.text.strip():
        raise HTTPException(status_code=400, detail="'text' field required")
    # Load cache (first call populates it)
    cases_cached = await _load_dataset_cache()
    scored: List[tuple] = []
    for case in cases_cached:
        case_text = (case.get("case_name", "") + " " + case.get("text", ""))
        score = _compute_similarity(body.text, case_text)
        if score > 0:
            scored.append((score, case))
    # Sort by score descending
    scored.sort(key=lambda x: x[0], reverse=True)
    top = scored[: body.limit]
    results: List[CaseResult] = []
    for score, case in top:
        results.append(CaseResult(
            id=case.get("id", ""),
            case_name=case.get("case_name", ""),
            court=case.get("court", None),
            jurisdiction=case.get("jurisdiction", None),
            date=case.get("date", None),
            citation=case.get("citation", None),
            summary=case.get("summary", None),
            url=case.get("url", None)
        ))
    return results
