from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
import stripe

from app.core.config import (
    STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_PRICE_ID_MONTHLY, APP_BASE_URL
)
from app.services.supabase_rest import SupabaseREST

router = APIRouter(prefix="/billing", tags=["billing"])

stripe.api_key = STRIPE_SECRET_KEY

class CheckoutCreate(BaseModel):
    business_id: str

@router.post("/checkout")
def create_checkout(payload: CheckoutCreate):
    if not STRIPE_SECRET_KEY or not STRIPE_PRICE_ID_MONTHLY:
        raise HTTPException(status_code=500, detail="Stripe env not configured")

    sb = SupabaseREST()
    biz = sb.get_one("businesses", {"id": f"eq.{payload.business_id}", "select": "*"})
    if not biz:
        raise HTTPException(status_code=404, detail="Business not found")

    customer_id = biz.get("stripe_customer_id")

    if not customer_id:
        cust = stripe.Customer.create(
            name=biz.get("business_name"),
            email=biz.get("email") or None,
            metadata={"business_id": payload.business_id},
        )
        customer_id = cust["id"]
        sb.patch("businesses", {"id": f"eq.{payload.business_id}"}, {"stripe_customer_id": customer_id})

    session = stripe.checkout.Session.create(
        mode="subscription",
        customer=customer_id,
        line_items=[{"price": STRIPE_PRICE_ID_MONTHLY, "quantity": 1}],
        success_url=f"{APP_BASE_URL}/dashboard?billing=success",
        cancel_url=f"{APP_BASE_URL}/billing?billing=cancel",
        metadata={"business_id": payload.business_id},
    )
    return {"url": session["url"]}

@router.post("/webhook")
async def stripe_webhook(request: Request):
    if not STRIPE_WEBHOOK_SECRET:
        raise HTTPException(status_code=500, detail="Missing STRIPE_WEBHOOK_SECRET")

    payload = await request.body()
    sig = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(payload, sig, STRIPE_WEBHOOK_SECRET)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid webhook signature")

    sb = SupabaseREST()

    if event["type"] in ("customer.subscription.created", "customer.subscription.updated", "customer.subscription.deleted"):
        sub = event["data"]["object"]
        customer_id = sub.get("customer")
        status = sub.get("status")

        mapped = "inactive"
        if status == "active":
            mapped = "active"
        elif status in ("past_due", "unpaid"):
            mapped = "past_due"
        elif status in ("canceled", "incomplete_expired"):
            mapped = "canceled"

        sb.patch(
            "businesses",
            {"stripe_customer_id": f"eq.{customer_id}"},
            {
                "stripe_subscription_id": sub.get("id"),
                "subscription_status": mapped,
            },
        )

    return {"received": True}
