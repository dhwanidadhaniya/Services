from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.database import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(String(24), unique=True, nullable=False, index=True)
    transaction_date = Column(DateTime, nullable=False, index=True)
    transaction_type = Column(String(40), nullable=False, index=True)
    channel = Column(String(20), nullable=False, index=True)
    region = Column(String(20), nullable=False, index=True)
    transaction_amount = Column(Float, nullable=False)
    processing_stage = Column(String(40), nullable=False, index=True)
    processing_time_minutes = Column(Float, nullable=False)
    sla_target_minutes = Column(Float, nullable=False)
    sla_breached = Column(Boolean, nullable=False, index=True)
    exception_flag = Column(Boolean, nullable=False, index=True)
    exception_type = Column(String(40), nullable=True)
    exception_resolution_minutes = Column(Float, nullable=True)
    manual_review = Column(Boolean, nullable=False, index=True)
    fraud_flag = Column(Boolean, nullable=False)
    risk_score = Column(Integer, nullable=False)
    approval_status = Column(String(20), nullable=False, index=True)
    settlement_status = Column(String(20), nullable=False, index=True)
    operator_id = Column(String(16), nullable=False)

    stage_events = relationship("StageEvent", back_populates="transaction")


class StageEvent(Base):
    __tablename__ = "stage_events"

    id = Column(Integer, primary_key=True, index=True)
    transaction_pk = Column(Integer, ForeignKey("transactions.id"), nullable=False, index=True)
    transaction_id = Column(String(24), nullable=False, index=True)
    stage_name = Column(String(40), nullable=False, index=True)
    processing_time_minutes = Column(Float, nullable=False)
    sla_target_minutes = Column(Float, nullable=False)
    sla_breached = Column(Boolean, nullable=False)
    exception_flag = Column(Boolean, nullable=False)

    transaction = relationship("Transaction", back_populates="stage_events")


class ProcessStage(Base):
    __tablename__ = "process_stages"

    stage_id = Column(Integer, primary_key=True, index=True)
    stage_name = Column(String(40), unique=True, nullable=False)
    sequence_order = Column(Integer, nullable=False)
    average_processing_time = Column(Float, nullable=False)
    sla_target = Column(Float, nullable=False)
    exception_rate = Column(Float, nullable=False)


class RiskControl(Base):
    __tablename__ = "risk_controls"

    control_id = Column(Integer, primary_key=True, index=True)
    process_stage = Column(String(40), nullable=False)
    risk_description = Column(Text, nullable=False)
    likelihood = Column(Integer, nullable=False)
    impact = Column(Integer, nullable=False)
    risk_score = Column(Integer, nullable=False)
    control_description = Column(Text, nullable=False)
    control_effectiveness = Column(String(16), nullable=False)
    owner = Column(String(60), nullable=False)


class ImprovementScenario(Base):
    __tablename__ = "improvement_scenarios"

    scenario_id = Column(Integer, primary_key=True, index=True)
    scenario_name = Column(String(80), nullable=False)
    assumption = Column(Text, nullable=False)
    expected_time_reduction = Column(Float, nullable=False)
    expected_error_reduction = Column(Float, nullable=False)
    implementation_cost = Column(String(40), nullable=False)
    expected_benefit = Column(Text, nullable=False)
    volume_increase = Column(Float, nullable=False, default=0)
    automation_level = Column(Float, nullable=False, default=0)
    manual_review_reduction = Column(Float, nullable=False, default=0)
    processing_efficiency = Column(Float, nullable=False, default=0)
