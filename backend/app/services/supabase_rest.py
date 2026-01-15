import requests
from typing import Any, Dict, Optional
from app.core.config import SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

class SupabaseREST:
    def __init__(self):
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            raise RuntimeError("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
        self.base = f"{SUPABASE_URL}/rest/v1"
        self.headers = {
            "apikey": SUPABASE_SERVICE_ROLE_KEY,
            "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
            "Content-Type": "application/json",
        }

    def get_one(self, table: str, params: Dict[str, str]) -> Optional[Dict[str, Any]]:
        r = requests.get(f"{self.base}/{table}", headers=self.headers, params=params)
        r.raise_for_status()
        rows = r.json()
        return rows[0] if rows else None

    def get_many(self, table: str, params: Dict[str, str]) -> list[Dict[str, Any]]:
        r = requests.get(f"{self.base}/{table}", headers=self.headers, params=params)
        r.raise_for_status()
        return r.json()

    def insert(self, table: str, row: Dict[str, Any]) -> Dict[str, Any]:
        h = dict(self.headers)
        h["Prefer"] = "return=representation"
        r = requests.post(f"{self.base}/{table}", headers=h, json=row)
        r.raise_for_status()
        return r.json()[0]

    def patch(self, table: str, match_params: Dict[str, str], updates: Dict[str, Any]) -> list[Dict[str, Any]]:
        h = dict(self.headers)
        h["Prefer"] = "return=representation"
        r = requests.patch(f"{self.base}/{table}", headers=h, params=match_params, json=updates)
        r.raise_for_status()
        return r.json()
