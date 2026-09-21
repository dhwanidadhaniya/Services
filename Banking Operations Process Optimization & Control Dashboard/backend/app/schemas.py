from typing import Optional

from pydantic import BaseModel, Field


class ScenarioAssumptions(BaseModel):
    volume_increase: float = Field(0, ge=0, le=50)
    automation_level: float = Field(0, ge=0, le=70)
    manual_review_reduction: float = Field(0, ge=0, le=50)
    processing_efficiency: float = Field(0, ge=0, le=40)


class TransactionOut(BaseModel):
    transaction_id: str
    transaction_date: str
    transaction_type: str
    channel: str
    region: str
    transaction_amount: float
    processing_stage: str
    processing_time_minutes: float
    sla_target_minutes: float
    sla_breached: bool
    exception_flag: bool
    exception_type: Optional[str]
    exception_resolution_minutes: Optional[float]
    manual_review: bool
    fraud_flag: bool
    risk_score: int
    approval_status: str
    settlement_status: str
    operator_id: str
