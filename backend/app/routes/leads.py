from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional
from app.services.supabase_rest import SupabaseREST

router = APIRouter(prefix="/leads", tags=["leads"])

class LeadCreate(BaseModel):
    business_id: str
    name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    message: str

@router.post("")
def create_lead(payload: LeadCreate):
    sb = SupabaseREST()

    biz = sb.get_one("businesses", {"id": f"eq.{payload.business_id}", "select": "*"})
    if not biz:
        raise HTTPException(status_code=404, detail="Business not found")

    lead = sb.insert("leads", {
        "business_id": payload.business_id,
        "name": payload.name,
        "email": str(payload.email) if payload.email else None,
        "phone": payload.phone,
        "message": payload.message,
        "status": "new",
    })

    return {"ok": True, "lead": lead}
