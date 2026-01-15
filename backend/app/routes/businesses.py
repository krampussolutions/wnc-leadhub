from fastapi import APIRouter, HTTPException
from typing import Optional
from app.services.supabase_rest import SupabaseREST

router = APIRouter(prefix="/businesses", tags=["businesses"])

@router.get("")
def list_businesses(
    town: Optional[str] = None,
    category: Optional[str] = None,
    active_only: bool = True,
):
    """
    Public directory endpoint.
    Returns minimal business fields for listing and selection.
    Uses SERVICE ROLE via backend so we do NOT need public RLS policies.
    """
    sb = SupabaseREST()

    # Build PostgREST filters
    params = {
        "select": "id,business_name,category,town,subscription_status",
        "order": "business_name.asc"
    }

    if active_only:
        params["subscription_status"] = "eq.active"

    if town:
        # ILIKE partial match for towns
        params["town"] = f"ilike.*{town}*"

    if category:
        params["category"] = f"ilike.*{category}*"

    try:
        rows = sb.get_many("businesses", params)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    # Strip subscription_status from public response
    out = []
    for r in rows:
        out.append({
            "id": r.get("id"),
            "business_name": r.get("business_name"),
            "category": r.get("category"),
            "town": r.get("town"),
        })

    return {"ok": True, "businesses": out}
