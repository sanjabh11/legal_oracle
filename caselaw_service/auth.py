"""Supabase JWT verification middleware (Sprint-1 placeholder).

In production: set SUPABASE_PROJECT_ID or SUPABASE_JWKS_URL in the environment.
If SKIP_JWT_VERIFY=true the middleware becomes a no-op (useful for local dev).
"""
import os
from typing import Any, Dict

import httpx
from fastapi import Depends, Header, HTTPException, status
from jose import jwt

JWKS_CACHE: Dict[str, Any] = {}

SUPABASE_PROJECT_ID = os.getenv("SUPABASE_PROJECT_ID")
SUPABASE_JWKS_URL = os.getenv("SUPABASE_JWKS_URL") or (
    f"https://{SUPABASE_PROJECT_ID}.supabase.co/auth/v1/keys" if SUPABASE_PROJECT_ID else None
)



async def _fetch_jwks() -> Dict[str, Any]:
    if SUPABASE_JWKS_URL is None:
        raise RuntimeError("SUPABASE_PROJECT_ID or SUPABASE_JWKS_URL must be set")
    if SUPABASE_JWKS_URL in JWKS_CACHE:
        return JWKS_CACHE[SUPABASE_JWKS_URL]
    async with httpx.AsyncClient() as client:
        resp = await client.get(SUPABASE_JWKS_URL, timeout=10)
        resp.raise_for_status()
        jwks = resp.json()
        JWKS_CACHE[SUPABASE_JWKS_URL] = jwks
        return jwks


async def get_current_user(
    authorization: str = Header(None, convert_underscores=False),
) -> Dict[str, Any]:
    """Dependency that verifies Supabase JWT and returns claims."""
    # Evaluate skip flag at request-time so tests can set env dynamically
    # Default to skipping JWT in dev if not set
    skip_jwt = os.getenv("SKIP_JWT_VERIFY")
    if skip_jwt is None:
        skip_jwt = "true"
    if skip_jwt.lower() == "true":
        return {"sub": "anon", "role": "guest"}

    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing Bearer token")

    token = authorization.split(" ", 1)[1]
    try:
        jwks = await _fetch_jwks()
        claims = jwt.decode(token, jwks, algorithms=["RS256"], options={"verify_aud": False})
        return claims
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token") from exc
