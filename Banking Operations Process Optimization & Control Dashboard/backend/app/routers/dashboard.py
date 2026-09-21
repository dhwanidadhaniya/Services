from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.filters import TransactionFilters
from app.metrics import (
    dashboard_summary,
    exception_dashboard,
    filter_options,
    process_performance,
    risk_dashboard,
    sla_dashboard,
)

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/summary")
def summary(filters: TransactionFilters = Depends(), db: Session = Depends(get_db)):
    return dashboard_summary(db, filters)


@router.get("/process-performance")
def process_metrics(filters: TransactionFilters = Depends(), db: Session = Depends(get_db)):
    return process_performance(db, filters)


@router.get("/exceptions")
def exceptions(filters: TransactionFilters = Depends(), db: Session = Depends(get_db)):
    return exception_dashboard(db, filters)


@router.get("/risk")
def risk(db: Session = Depends(get_db)):
    return risk_dashboard(db)


@router.get("/sla")
def sla(filters: TransactionFilters = Depends(), db: Session = Depends(get_db)):
    return sla_dashboard(db, filters)


@router.get("/filters")
def filters(db: Session = Depends(get_db)):
    return filter_options(db)
