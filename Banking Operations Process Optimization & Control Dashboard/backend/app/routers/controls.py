from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import RiskControl

router = APIRouter(prefix="/api/controls", tags=["controls"])


class ControlCreate(BaseModel):
    process_stage: str
    risk_description: str
    likelihood: int = Field(..., ge=1, le=5)
    impact: int = Field(..., ge=1, le=5)
    control_description: str
    control_effectiveness: str
    owner: str


def serialize(row: RiskControl) -> dict:
    score = row.likelihood * row.impact
    return {
        "control_id": row.control_id,
        "risk_id": f"RC-{row.control_id:03d}",
        "process_stage": row.process_stage,
        "risk_description": row.risk_description,
        "likelihood": row.likelihood,
        "impact": row.impact,
        "risk_score": score,
        "control_description": row.control_description,
        "control_effectiveness": row.control_effectiveness,
        "owner": row.owner,
        "priority": "High" if score >= 15 else "Medium" if score >= 8 else "Low",
    }


@router.get("")
def list_controls(db: Session = Depends(get_db)):
    rows = db.query(RiskControl).order_by(RiskControl.risk_score.desc()).all()
    return {"items": [serialize(row) for row in rows]}


@router.post("")
def create_control(payload: ControlCreate, db: Session = Depends(get_db)):
    score = payload.likelihood * payload.impact
    if not 1 <= score <= 25:
        raise HTTPException(status_code=422, detail="Risk score must be between 1 and 25.")
    row = RiskControl(
        process_stage=payload.process_stage,
        risk_description=payload.risk_description,
        likelihood=payload.likelihood,
        impact=payload.impact,
        risk_score=score,
        control_description=payload.control_description,
        control_effectiveness=payload.control_effectiveness,
        owner=payload.owner,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return serialize(row)
