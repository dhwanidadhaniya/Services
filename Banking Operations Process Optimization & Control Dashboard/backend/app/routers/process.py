from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.filters import TransactionFilters
from app.metrics import bottleneck_ranking, process_map, process_performance
from app.models import ProcessStage

router = APIRouter(prefix="/api/process", tags=["process"])


@router.get("/stages")
def stages(filters: TransactionFilters = Depends(), db: Session = Depends(get_db)):
    stored = db.query(ProcessStage).order_by(ProcessStage.sequence_order).all()
    live = process_performance(db, filters)
    live_by_name = {row["stage_name"]: row for row in live["stages"]}
    return {
        "stages": [
            {
                "stage_id": row.stage_id,
                "stage_name": row.stage_name,
                "sequence_order": row.sequence_order,
                "sla_target": row.sla_target,
                "stored_average_processing_time": row.average_processing_time,
                "stored_exception_rate": row.exception_rate,
                **live_by_name.get(row.stage_name, {}),
            }
            for row in stored
        ],
        "bottleneck_stage": live["bottleneck_stage"],
        "explanation": live["explanation"],
    }


@router.get("/bottlenecks")
def bottlenecks(filters: TransactionFilters = Depends(), db: Session = Depends(get_db)):
    return bottleneck_ranking(db, filters)


@router.get("/map")
def map_view(filters: TransactionFilters = Depends(), db: Session = Depends(get_db)):
    return process_map(db, filters)
