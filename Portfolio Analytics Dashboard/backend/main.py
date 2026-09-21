"""
FastAPI Server Entry Point
Financial Services / Portfolio Analytics Dashboard
Target: Citi Services - Summer Analyst, India, 2027 (Mumbai)
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.routes import router as api_router
from backend.services.data_loader import db

app = FastAPI(
    title="Financial Services Portfolio Analytics API",
    description="Institutional portfolio performance, risk, liquidity, and client opportunity analytics platform.",
    version="1.0.0"
)

# Enable CORS for frontend Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes under /api prefix
app.include_router(api_router, prefix="/api")

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "Financial Services / Portfolio Analytics Engine",
        "role_context": "Citi Services – Summer Analyst, India, 2027 (Mumbai)",
        "synthetic_data": {
            "clients": len(db.clients_df),
            "portfolios": len(db.portfolios_df),
            "transactions": len(db.transactions_df),
            "monthly_nav_points": len(db.monthly_nav_df)
        },
        "docs_url": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": "2026-02-28 23:59:59"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
