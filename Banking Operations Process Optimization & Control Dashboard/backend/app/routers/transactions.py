from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.filters import TransactionFilters, apply_filters
from app.models import StageEvent, Transaction

router = APIRouter(prefix="/api/transactions", tags=["transactions"])

SORTABLE = {
    "transaction_id": Transaction.transaction_id,
    "transaction_date": Transaction.transaction_date,
    "transaction_type": Transaction.transaction_type,
    "channel": Transaction.channel,
    "transaction_amount": Transaction.transaction_amount,
    "processing_time_minutes": Transaction.processing_time_minutes,
    "risk_score": Transaction.risk_score,
    "settlement_status": Transaction.settlement_status,
}


def serialize_txn(row: Transaction) -> dict:
    return {
        "transaction_id": row.transaction_id,
        "transaction_date": row.transaction_date.isoformat(),
        "transaction_type": row.transaction_type,
        "channel": row.channel,
        "region": row.region,
        "transaction_amount": row.transaction_amount,
        "processing_stage": row.processing_stage,
        "processing_time_minutes": row.processing_time_minutes,
        "sla_target_minutes": row.sla_target_minutes,
        "sla_breached": row.sla_breached,
        "exception_flag": row.exception_flag,
        "exception_type": row.exception_type,
        "exception_resolution_minutes": row.exception_resolution_minutes,
        "manual_review": row.manual_review,
        "fraud_flag": row.fraud_flag,
        "risk_score": row.risk_score,
        "approval_status": row.approval_status,
        "settlement_status": row.settlement_status,
        "operator_id": row.operator_id,
    }


@router.get("")
def list_transactions(
    filters: TransactionFilters = Depends(),
    search: Optional[str] = Query(None),
    sort_by: str = Query("transaction_date"),
    sort_dir: str = Query("desc"),
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = apply_filters(db.query(Transaction), filters)
    if search:
        term = f"%{search.strip()}%"
        query = query.filter(
            (Transaction.transaction_id.ilike(term))
            | (Transaction.operator_id.ilike(term))
            | (Transaction.exception_type.ilike(term))
        )

    column = SORTABLE.get(sort_by, Transaction.transaction_date)
    query = query.order_by(column.asc() if sort_dir == "asc" else column.desc())
    total = query.count()
    rows = query.offset((page - 1) * page_size).limit(page_size).all()
    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "pages": (total + page_size - 1) // page_size if total else 0,
        "items": [serialize_txn(row) for row in rows],
    }


@router.get("/{transaction_id}")
def get_transaction(transaction_id: str, db: Session = Depends(get_db)):
    row = db.query(Transaction).filter(Transaction.transaction_id == transaction_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Transaction not found.")
    events = (
        db.query(StageEvent)
        .filter(StageEvent.transaction_id == transaction_id)
        .all()
    )
    payload = serialize_txn(row)
    payload["stage_history"] = [
        {
            "stage_name": event.stage_name,
            "processing_time_minutes": event.processing_time_minutes,
            "sla_target_minutes": event.sla_target_minutes,
            "sla_breached": event.sla_breached,
            "exception_flag": event.exception_flag,
        }
        for event in events
    ]
    return payload
