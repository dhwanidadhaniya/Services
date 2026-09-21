from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy.orm import Session

from app.database import get_db
from app.filters import TransactionFilters
from app.metrics import current_operating_state, export_payload, simulate_scenario
from app.models import ImprovementScenario
from app.schemas import ScenarioAssumptions

router = APIRouter(prefix="/api", tags=["scenarios"])


def serialize_scenario(row: ImprovementScenario) -> dict:
    return {
        "scenario_id": row.scenario_id,
        "scenario_name": row.scenario_name,
        "assumption": row.assumption,
        "expected_time_reduction": row.expected_time_reduction,
        "expected_error_reduction": row.expected_error_reduction,
        "implementation_cost": row.implementation_cost,
        "expected_benefit": row.expected_benefit,
        "volume_increase": row.volume_increase,
        "automation_level": row.automation_level,
        "manual_review_reduction": row.manual_review_reduction,
        "processing_efficiency": row.processing_efficiency,
    }


@router.get("/scenarios")
def list_scenarios(
    filters: TransactionFilters = Depends(),
    db: Session = Depends(get_db),
):
    rows = db.query(ImprovementScenario).order_by(ImprovementScenario.scenario_id).all()
    state = current_operating_state(db, filters)
    items = []
    for row in rows:
        simulated = simulate_scenario(
            state,
            {
                "volume_increase": row.volume_increase,
                "automation_level": row.automation_level,
                "manual_review_reduction": row.manual_review_reduction,
                "processing_efficiency": row.processing_efficiency,
            },
        )
        items.append({**serialize_scenario(row), "simulation": simulated})
    return {"items": items}


@router.post("/scenarios/simulate")
def run_simulation(
    payload: ScenarioAssumptions,
    filters: TransactionFilters = Depends(),
    db: Session = Depends(get_db),
):
    state = current_operating_state(db, filters)
    return simulate_scenario(state, payload.model_dump())


@router.get("/export/summary")
def export_summary(
    filters: TransactionFilters = Depends(),
    format: str = Query("json", pattern="^(json|csv)$"),
    volume_increase: float = Query(0, ge=0, le=50),
    automation_level: float = Query(20, ge=0, le=70),
    manual_review_reduction: float = Query(15, ge=0, le=50),
    processing_efficiency: float = Query(10, ge=0, le=40),
    db: Session = Depends(get_db),
):
    payload = export_payload(
        db,
        filters,
        {
            "volume_increase": volume_increase,
            "automation_level": automation_level,
            "manual_review_reduction": manual_review_reduction,
            "processing_efficiency": processing_efficiency,
        },
    )
    if format == "json":
        return payload

    lines = [
        "section,metric,value",
        f"disclaimer,note,{_csv(payload['disclaimer'])}",
        f"kpi,total_transactions,{payload['kpi_summary']['total_transactions']}",
        f"kpi,total_transaction_value,{payload['kpi_summary']['total_transaction_value']}",
        f"kpi,average_processing_time,{payload['kpi_summary']['average_processing_time']}",
        f"kpi,exception_rate,{payload['kpi_summary']['exception_rate']}",
        f"kpi,sla_breach_rate,{payload['kpi_summary']['sla_breach_rate']}",
        f"kpi,manual_review_rate,{payload['kpi_summary']['manual_review_rate']}",
        f"kpi,successful_settlement_rate,{payload['kpi_summary']['successful_settlement_rate']}",
        f"bottleneck,explanation,{_csv(payload['bottleneck_analysis']['explanation'])}",
    ]
    for row in payload["bottleneck_analysis"]["ranking"]:
        lines.append(
            f"bottleneck,{row['rank']}_{row['stage_name']},{row['score']}|{row['level']}"
        )
    rec = payload["recommendations"]
    lines.append(f"recommendation,action,{_csv(rec['recommended_action'])}")
    lines.append(f"recommendation,impact,{_csv(rec['expected_operational_impact'])}")
    lines.append(f"recommendation,tradeoff,{_csv(rec['main_tradeoff'])}")
    lines.append(f"recommendation,consideration,{_csv(rec['implementation_consideration'])}")
    csv_body = "\n".join(lines)
    return Response(
        content=csv_body,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=operations_summary.csv"},
    )


def _csv(value: str) -> str:
    cleaned = value.replace('"', "'").replace("\n", " ")
    return f'"{cleaned}"'
