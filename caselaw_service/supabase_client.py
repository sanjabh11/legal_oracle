"""Minimal Supabase client for Oracle API persistence."""
import os
import httpx
from typing import Dict, Any, Optional

SUPABASE_URL = os.getenv("SUPABASE_URL", "http://localhost:54321")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")

class SupabaseClient:
    def __init__(self):
        self.url = f"{SUPABASE_URL}/rest/v1"
        self.headers = {
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=representation",
        }

    async def insert(self, table: str, data: Dict[str, Any]) -> Dict[str, Any]:
        async with httpx.AsyncClient() as client:
            r = await client.post(
                f"{self.url}/{table}", json=data, headers=self.headers
            )
            r.raise_for_status()
            return r.json()

    async def update(self, table: str, id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        async with httpx.AsyncClient() as client:
            r = await client.patch(
                f"{self.url}/{table}?id=eq.{id}", json=data, headers=self.headers
            )
            r.raise_for_status()
            return r.json()

    async def select(self, table: str, filters: Optional[Dict[str, Any]] = None) -> list:
        params = {}
        if filters:
            params.update(filters)
        async with httpx.AsyncClient() as client:
            r = await client.get(f"{self.url}/{table}", params=params, headers=self.headers)
            r.raise_for_status()
            return r.json()

supabase = SupabaseClient()
