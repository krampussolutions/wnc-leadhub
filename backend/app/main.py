from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.leads import router as leads_router
from app.routes.billing import router as billing_router


from app.routes.businesses import router as businesses_router
app = FastAPI(title="WNC Lead Hub API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(leads_router)
app.include_router(billing_router)


app.include_router(businesses_router)
@app.get("/health")
def health():
    return {"ok": True}

