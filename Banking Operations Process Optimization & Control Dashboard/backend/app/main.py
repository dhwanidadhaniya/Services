from datetime import datetime, timezone
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError

from app.config import settings
from app.database import Base, SessionLocal, engine
from app.routers import controls, dashboard, process, scenarios, transactions
from app.seed import seed_if_empty


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_if_empty(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Banking Operations Process Optimization API",
    description=(
        "Simulated transaction operations environment for an academic project. "
        "All data is generated for educational use and does not represent a real bank."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list or ["http://localhost:5173", "http://localhost:5175"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(transactions.router)
app.include_router(dashboard.router)
app.include_router(process.router)
app.include_router(controls.router)
app.include_router(scenarios.router)


@app.exception_handler(SQLAlchemyError)
async def database_error_handler(_: Request, exc: SQLAlchemyError):
    return JSONResponse(
        status_code=500,
        content={"detail": "A database error occurred while reading operational data.", "error": str(exc.__class__.__name__)},
    )


@app.exception_handler(HTTPException)
async def http_error_handler(_: Request, exc: HTTPException):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "service": "banking-operations-api",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "disclaimer": "Simulated academic dataset. Not real bank data.",
    }
