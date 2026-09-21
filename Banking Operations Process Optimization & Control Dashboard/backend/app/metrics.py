"""Operational KPI and scenario calculations.

All dashboard numbers are derived from the simulated transaction table.
None of the figures are hard-coded.
"""

from __future__ import annotations

from collections import defaultdict
from typing import Optional

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.filters import TransactionFilters, apply_filters, rate
from app.models import ProcessStage, RiskControl, StageEvent, Transaction


STAGE_ORDER = [
    "Intake",
    "Validation",
    "Risk Screening",
    "Manual Review",
    "Approval",
    "Settlement",
    "Reconciliation",
]


def pct_change(current: float, baseline: float) -> Optional[float]:
    if baseline == 0:
        return None
    return round(((current - baseline) / baseline) * 100, 1)


def _txn_query(db: Session, filters: Optional[TransactionFilters]):
    query = db.query(Transaction)
    if filters:
        query = apply_filters(query, filters)
    return query


def summarize_transactions(rows: list[Transaction]) -> dict:
    n = len(rows)
    if n == 0:
        return {
            "total_transactions": 0,
            "total_transaction_value": 0.0,
            "average_processing_time": 0.0,
            "exception_rate": 0.0,
            "sla_breach_rate": 0.0,
            "manual_review_rate": 0.0,
            "fraud_flag_rate": 0.0,
            "successful_settlement_rate": 0.0,
            "within_sla_count": 0,
            "outside_sla_count": 0,
            "exception_count": 0,
            "manual_review_count": 0,
            "settled_count": 0,
        }

    total_value = sum(r.transaction_amount for r in rows)
    avg_time = sum(r.processing_time_minutes for r in rows) / n
    exceptions = sum(1 for r in rows if r.exception_flag)
    breaches = sum(1 for r in rows if r.sla_breached)
    reviews = sum(1 for r in rows if r.manual_review)
    frauds = sum(1 for r in rows if r.fraud_flag)
    settled = sum(1 for r in rows if r.settlement_status == "Settled")

    return {
        "total_transactions": n,
        "total_transaction_value": round(total_value, 2),
        "average_processing_time": round(avg_time, 1),
        "exception_rate": rate(exceptions, n),
        "sla_breach_rate": rate(breaches, n),
        "manual_review_rate": rate(reviews, n),
        "fraud_flag_rate": rate(frauds, n),
        "successful_settlement_rate": rate(settled, n),
        "within_sla_count": n - breaches,
        "outside_sla_count": breaches,
        "exception_count": exceptions,
        "manual_review_count": reviews,
        "settled_count": settled,
    }


def baseline_window(rows: list[Transaction]) -> tuple[list[Transaction], list[Transaction]]:
    """Split into the latest half of the date span vs the earlier half."""
    if len(rows) < 20:
        return rows, []
    dates = sorted(r.transaction_date for r in rows)
    span = dates[-1] - dates[0]
    midpoint = dates[0] + span / 2
    current = [r for r in rows if r.transaction_date > midpoint]
    prior = [r for r in rows if r.transaction_date <= midpoint]
    return current, prior


def dashboard_summary(db: Session, filters: Optional[TransactionFilters]) -> dict:
    rows = _txn_query(db, filters).all()
    current_stats = summarize_transactions(rows)
    current_slice, prior_slice = baseline_window(rows)
    current_half = summarize_transactions(current_slice) if current_slice else current_stats
    prior_half = summarize_transactions(prior_slice) if prior_slice else None

    def kpi(key: str, higher_is_better: bool) -> dict:
        value = current_stats[key]
        vs = pct_change(current_half[key], prior_half[key]) if prior_half else None
        return {
            "value": value,
            "vs_baseline_pct": vs,
            "higher_is_better": higher_is_better,
        }

    return {
        **current_stats,
        "kpis": {
            "total_transactions": kpi("total_transactions", True),
            "average_processing_time": kpi("average_processing_time", False),
            "exception_rate": kpi("exception_rate", False),
            "sla_breach_rate": kpi("sla_breach_rate", False),
            "manual_review_rate": kpi("manual_review_rate", False),
            "successful_settlement_rate": kpi("successful_settlement_rate", True),
        },
        "baseline_note": (
            "Baseline compares the later half of the selected period with the earlier half."
            if prior_half
            else "Not enough history in the current filter to compute a baseline."
        ),
    }


def process_performance(db: Session, filters: Optional[TransactionFilters]) -> dict:
    txn_count = _txn_query(db, filters).count()
    stage_rows = db.query(ProcessStage).order_by(ProcessStage.sequence_order).all()
    if txn_count == 0:
        stages = [
            {
                "stage_name": s.stage_name,
                "sequence_order": s.sequence_order,
                "average_processing_time": 0.0,
                "sla_target": s.sla_target,
                "exception_rate": 0.0,
                "transaction_count": 0,
                "sla_breach_rate": 0.0,
                "gap_minutes": 0.0,
                "is_bottleneck": False,
                "pressure_level": "Low",
            }
            for s in stage_rows
        ]
        return {
            "stages": stages,
            "bottleneck_stage": None,
            "explanation": "No transactions match the current filters.",
        }

    event_query = db.query(StageEvent).join(
        Transaction, StageEvent.transaction_id == Transaction.transaction_id
    )
    if filters:
        event_query = apply_filters(event_query, filters)
    events = event_query.all()

    grouped: dict[str, list[StageEvent]] = defaultdict(list)
    for event in events:
        grouped[event.stage_name].append(event)

    computed = []
    for stage in stage_rows:
        items = grouped.get(stage.stage_name, [])
        count = len(items)
        avg_time = sum(e.processing_time_minutes for e in items) / count if count else 0.0
        exceptions = sum(1 for e in items if e.exception_flag)
        breaches = sum(1 for e in items if e.sla_breached)
        gap = avg_time - stage.sla_target
        computed.append(
            {
                "stage_name": stage.stage_name,
                "sequence_order": stage.sequence_order,
                "average_processing_time": round(avg_time, 1),
                "sla_target": stage.sla_target,
                "exception_rate": rate(exceptions, count),
                "transaction_count": count,
                "sla_breach_rate": rate(breaches, count),
                "gap_minutes": round(gap, 1),
                "is_bottleneck": False,
                "pressure_level": "Low",
            }
        )

    if computed:
        bottleneck = max(computed, key=lambda s: s["gap_minutes"])
        for stage in computed:
            stage["is_bottleneck"] = stage["stage_name"] == bottleneck["stage_name"]
            score_preview = bottleneck_components(stage)
            stage["pressure_level"] = score_preview["level"]

        explanation = build_bottleneck_explanation(computed, bottleneck["stage_name"])
    else:
        bottleneck = {"stage_name": None}
        explanation = "Stage-level events are not available for the current filter."

    return {
        "stages": computed,
        "bottleneck_stage": bottleneck["stage_name"],
        "explanation": explanation,
    }


def bottleneck_components(stage: dict) -> dict:
    """Bottleneck score = time pressure + SLA pressure + exception pressure."""
    sla_target = stage["sla_target"] or 1
    time_pressure = stage["average_processing_time"] / sla_target
    sla_pressure = stage["sla_breach_rate"] / 100
    exception_pressure = stage["exception_rate"] / 100
    score = round((0.40 * time_pressure) + (0.35 * sla_pressure) + (0.25 * exception_pressure), 3)

    if score >= 0.85:
        level = "High"
    elif score >= 0.55:
        level = "Medium"
    else:
        level = "Low"

    return {
        "time_pressure": round(time_pressure, 3),
        "sla_pressure": round(sla_pressure, 3),
        "exception_pressure": round(exception_pressure, 3),
        "score": score,
        "level": level,
    }


def bottleneck_ranking(db: Session, filters: Optional[TransactionFilters]) -> dict:
    performance = process_performance(db, filters)
    ranked = []
    for stage in performance["stages"]:
        components = bottleneck_components(stage)
        ranked.append({**stage, **components})
    ranked.sort(key=lambda s: s["score"], reverse=True)
    for index, row in enumerate(ranked, start=1):
        row["rank"] = index
    return {
        "methodology": (
            "Bottleneck Score = 0.40 × (avg processing time / SLA target) "
            "+ 0.35 × SLA breach rate + 0.25 × exception rate. "
            "Time pressure above 1.0 means the stage is slower than its SLA on average."
        ),
        "stages": ranked,
        "explanation": performance["explanation"],
        "bottleneck_stage": performance["bottleneck_stage"],
    }


def build_bottleneck_explanation(stages: list[dict], bottleneck_name: str) -> str:
    stage = next((s for s in stages if s["stage_name"] == bottleneck_name), None)
    if not stage:
        return "Process-stage metrics could not be calculated."

    gap = stage["gap_minutes"]
    if gap > 0:
        time_clause = (
            f"average processing time ({stage['average_processing_time']} min) "
            f"exceeds the {stage['sla_target']} min SLA by {gap} minutes"
        )
    else:
        time_clause = (
            f"average processing time ({stage['average_processing_time']} min) "
            f"is within the {stage['sla_target']} min SLA, but relative pressure is still highest here"
        )

    exception_clause = ""
    if stage["exception_rate"] >= 8:
        exception_clause = f" Exception volume is also elevated at {stage['exception_rate']}%."
    elif stage["exception_rate"] >= 4:
        exception_clause = f" Exception rate is moderate at {stage['exception_rate']}%."

    return (
        f"{bottleneck_name} is currently the main bottleneck because {time_clause}."
        f"{exception_clause} "
        f"SLA breaches at this stage are {stage['sla_breach_rate']}% across "
        f"{stage['transaction_count']:,} transactions."
    )


def sla_dashboard(db: Session, filters: Optional[TransactionFilters]) -> dict:
    rows = _txn_query(db, filters).all()
    summary = summarize_transactions(rows)
    performance = process_performance(db, filters)

    by_type: dict[str, list[Transaction]] = defaultdict(list)
    by_day: dict[str, list[Transaction]] = defaultdict(list)
    for row in rows:
        by_type[row.transaction_type].append(row)
        by_day[row.transaction_date.date().isoformat()].append(row)

    type_stats = []
    for txn_type, items in sorted(by_type.items()):
        breaches = sum(1 for r in items if r.sla_breached)
        avg_time = sum(r.processing_time_minutes for r in items) / len(items)
        type_stats.append(
            {
                "transaction_type": txn_type,
                "count": len(items),
                "average_processing_time": round(avg_time, 1),
                "sla_breach_rate": rate(breaches, len(items)),
                "within_sla_rate": round(100 - rate(breaches, len(items)), 2),
            }
        )

    timeline = []
    for day in sorted(by_day.keys()):
        items = by_day[day]
        breaches = sum(1 for r in items if r.sla_breached)
        timeline.append(
            {
                "date": day,
                "count": len(items),
                "sla_breaches": breaches,
                "sla_breach_rate": rate(breaches, len(items)),
            }
        )

    return {
        "within_sla": summary["within_sla_count"],
        "outside_sla": summary["outside_sla_count"],
        "average_processing_time": summary["average_processing_time"],
        "sla_breach_rate": summary["sla_breach_rate"],
        "by_stage": [
            {
                "stage_name": s["stage_name"],
                "sla_target": s["sla_target"],
                "average_processing_time": s["average_processing_time"],
                "sla_compliance_rate": round(100 - s["sla_breach_rate"], 2),
                "sla_breach_rate": s["sla_breach_rate"],
            }
            for s in performance["stages"]
        ],
        "by_type": type_stats,
        "over_time": timeline,
    }


EXCEPTION_ORDER = [
    "Missing Information",
    "Validation Failure",
    "Duplicate Transaction",
    "Risk Review",
    "Settlement Failure",
    "Reconciliation Difference",
    "Other",
]


def exception_dashboard(db: Session, filters: Optional[TransactionFilters]) -> dict:
    rows = _txn_query(db, filters).all()
    n = len(rows)
    exceptions = [r for r in rows if r.exception_flag]
    total_exceptions = len(exceptions)

    grouped: dict[str, list[Transaction]] = defaultdict(list)
    for row in exceptions:
        label = row.exception_type or "Other"
        grouped[label].append(row)

    categories = []
    for name in EXCEPTION_ORDER:
        items = grouped.get(name, [])
        count = len(items)
        if count == 0 and name not in grouped:
            avg_res = 0.0
            value = 0.0
        else:
            times = [r.exception_resolution_minutes or 0 for r in items]
            avg_res = sum(times) / count if count else 0.0
            value = sum(r.transaction_amount for r in items)
        categories.append(
            {
                "exception_type": name,
                "count": count,
                "exception_rate": rate(count, n),
                "share_of_exceptions": rate(count, total_exceptions) if total_exceptions else 0.0,
                "average_resolution_time": round(avg_res, 1),
                "affected_transaction_value": round(value, 2),
            }
        )

    ranked = sorted(categories, key=lambda c: c["count"], reverse=True)
    running = 0.0
    pareto = []
    for item in ranked:
        running += item["share_of_exceptions"]
        pareto.append({**item, "cumulative_share": round(running, 2)})

    top_two = sum(item["share_of_exceptions"] for item in ranked[:2])
    if total_exceptions == 0:
        insight = "No exceptions are present in the current filter."
    else:
        insight = (
            f"Approximately {round(top_two)}% of exceptions originate from the top two categories "
            f"({ranked[0]['exception_type']} and {ranked[1]['exception_type']})."
        )

    return {
        "total_exceptions": total_exceptions,
        "exception_rate": rate(total_exceptions, n),
        "categories": categories,
        "pareto": pareto,
        "top_two_share": round(top_two, 1),
        "insight": insight,
    }


def risk_dashboard(db: Session) -> dict:
    controls = db.query(RiskControl).order_by(RiskControl.risk_score.desc()).all()
    register = []
    matrix = {(impact, likelihood): [] for impact in range(1, 6) for likelihood in range(1, 6)}

    for item in controls:
        priority = "High" if item.risk_score >= 15 else "Medium" if item.risk_score >= 8 else "Low"
        row = {
            "control_id": f"RC-{item.control_id:03d}",
            "process_stage": item.process_stage,
            "risk_description": item.risk_description,
            "likelihood": item.likelihood,
            "impact": item.impact,
            "risk_score": item.risk_score,
            "control_description": item.control_description,
            "control_effectiveness": item.control_effectiveness,
            "owner": item.owner,
            "priority": priority,
        }
        register.append(row)
        matrix[(item.impact, item.likelihood)].append(row["control_id"])

    matrix_cells = []
    for likelihood in range(5, 0, -1):
        for impact in range(1, 6):
            score = likelihood * impact
            band = "High" if score >= 15 else "Medium" if score >= 8 else "Low"
            matrix_cells.append(
                {
                    "likelihood": likelihood,
                    "impact": impact,
                    "score": score,
                    "band": band,
                    "risk_ids": matrix[(impact, likelihood)],
                }
            )

    return {
        "register": register,
        "matrix": matrix_cells,
        "scoring_note": "Operational risk score = Likelihood × Impact, each on a 1–5 scale.",
    }


def process_map(db: Session, filters: Optional[TransactionFilters]) -> dict:
    performance = process_performance(db, filters)
    nodes = []
    for stage in performance["stages"]:
        if stage["sla_breach_rate"] >= 20 or stage["gap_minutes"] > 5:
            sla_status = "Off target"
        elif stage["sla_breach_rate"] >= 10 or stage["gap_minutes"] > 0:
            sla_status = "Watch"
        else:
            sla_status = "On target"
        nodes.append(
            {
                **stage,
                "sla_status": sla_status,
            }
        )
    return {
        "nodes": nodes,
        "flow": STAGE_ORDER,
        "explanation": performance["explanation"],
    }


def simulate_scenario(current: dict, assumptions: dict, with_recommendation: bool = True) -> dict:
    """Project operational metrics from the current filtered dataset.

    Volume increases add congestion. Automation and efficiency reduce time and
    errors. Manual-review reduction mainly helps the current bottleneck.
    """
    volume = _clip(assumptions.get("volume_increase", 0), 0, 50)
    automation = _clip(assumptions.get("automation_level", 0), 0, 70)
    review_cut = _clip(assumptions.get("manual_review_reduction", 0), 0, 50)
    efficiency = _clip(assumptions.get("processing_efficiency", 0), 0, 40)

    t = current["average_processing_time"]
    sla = current["sla_breach_rate"] / 100
    exc = current["exception_rate"] / 100
    mr = current["manual_review_rate"] / 100
    n = current["total_transactions"]

    # Share of total cycle time sitting in manual review — used to size that lever.
    mr_time_share = current.get("manual_review_time_share", 0.22)

    t1 = t * (1 - efficiency / 100 * 0.90)
    t1 *= 1 - (automation / 100) * 0.42
    t1 *= 1 - (review_cut / 100) * mr_time_share * 0.90
    t1 *= 1 + (volume / 100) * 0.32

    exc1 = exc * (1 - (automation / 100) * 0.48) * (1 - (review_cut / 100) * 0.18)
    exc1 *= 1 + (volume / 100) * 0.12
    exc1 *= 1 - (efficiency / 100) * 0.15

    mr1 = mr * (1 - review_cut / 100) * (1 - (automation / 100) * 0.28)
    workload = n * mr * (1 + volume / 100) * (1 - review_cut / 100) * (1 - (automation / 100) * 0.28)

    # SLA improves when time falls, deteriorates when volume rises without capacity.
    time_ratio = t1 / t if t else 1
    sla1 = sla * (0.35 + 0.65 * time_ratio)
    sla1 *= 1 + (volume / 100) * 0.55
    sla1 = max(0.01, min(0.95, sla1))
    exc1 = max(0.005, min(0.80, exc1))

    within_sla = (1 - sla1) * n * (1 + volume / 100)

    projected = {
        "average_processing_time": round(t1, 1),
        "sla_breach_rate": round(sla1 * 100, 2),
        "exception_rate": round(exc1 * 100, 2),
        "manual_review_rate": round(mr1 * 100, 2),
        "manual_workload": round(workload, 0),
        "transactions_within_sla": round(within_sla, 0),
        "volume_factor": round(1 + volume / 100, 2),
    }

    current_view = {
        "average_processing_time": current["average_processing_time"],
        "sla_breach_rate": current["sla_breach_rate"],
        "exception_rate": current["exception_rate"],
        "manual_review_rate": current["manual_review_rate"],
        "manual_workload": round(n * mr, 0),
        "transactions_within_sla": current["within_sla_count"],
    }

    def delta(metric: str, lower_is_better: bool) -> dict:
        before = current_view[metric]
        after = projected[metric]
        change_pct = pct_change(after, before)
        return {
            "current": before,
            "projected": after,
            "change_pct": change_pct,
            "improved": (after < before) if lower_is_better else (after > before),
        }

    comparison = {
        "average_processing_time": delta("average_processing_time", True),
        "sla_breach_rate": delta("sla_breach_rate", True),
        "exception_rate": delta("exception_rate", True),
        "manual_review_rate": delta("manual_review_rate", True),
        "manual_workload": delta("manual_workload", True),
        "transactions_within_sla": delta("transactions_within_sla", False),
    }

    clipped = {
        "volume_increase": volume,
        "automation_level": automation,
        "manual_review_reduction": review_cut,
        "processing_efficiency": efficiency,
    }
    recommendation = None
    if with_recommendation:
        recommendation = build_recommendation(current, clipped, comparison, mr_time_share)

    return {
        "assumptions": clipped,
        "current": current_view,
        "projected": projected,
        "comparison": comparison,
        "recommendation": recommendation,
    }


def build_recommendation(current: dict, assumptions: dict, comparison: dict, mr_time_share: float) -> dict:
    volume = assumptions["volume_increase"]
    automation = assumptions["automation_level"]
    review_cut = assumptions["manual_review_reduction"]
    efficiency = assumptions["processing_efficiency"]

    # Isolate each lever against a no-change baseline to see which moved time the most.
    base = {
        "volume_increase": 0,
        "automation_level": 0,
        "manual_review_reduction": 0,
        "processing_efficiency": 0,
    }
    isolated = []
    for lever, value in [
        ("volume_increase", volume),
        ("automation_level", automation),
        ("manual_review_reduction", review_cut),
        ("processing_efficiency", efficiency),
    ]:
        if value <= 0:
            continue
        trial = simulate_scenario(current, {**base, lever: value}, with_recommendation=False)
        isolated.append(
            {
                "lever": lever,
                "value": value,
                "time_change": trial["comparison"]["average_processing_time"]["change_pct"] or 0,
                "sla_change": trial["comparison"]["sla_breach_rate"]["change_pct"] or 0,
            }
        )

    time_improved = comparison["average_processing_time"]["improved"]
    time_change = comparison["average_processing_time"]["change_pct"] or 0

    if volume > 0 and automation == 0 and review_cut == 0 and efficiency == 0:
        action = "Add capacity before absorbing a volume increase"
        impact = (
            f"A {volume:.0f}% volume increase lengthens average processing time by "
            f"{abs(time_change):.1f}% and raises SLA breaches because queues form at constrained stages."
        )
        tradeoff = "Protecting service levels requires staffing or automation spend that is not in this scenario."
        consideration = (
            "If a surge is expected, pair the volume plan with either overtime at Manual Review "
            "or a straight-through processing rule for low-risk payments."
        )
    elif not isolated:
        action = "Hold the current operating model"
        impact = "No process-change assumptions were applied, so projected metrics match the current state."
        tradeoff = "Stability is preserved, but bottleneck pressure is left unaddressed."
        consideration = "Use the sliders or a preset scenario to test volume, automation, or review-policy changes."
    else:
        helpful = [item for item in isolated if item["lever"] != "volume_increase"]
        helpful.sort(key=lambda x: x["time_change"])
        winner = helpful[0] if helpful else isolated[0]
        labels = {
            "automation_level": "increasing automation",
            "manual_review_reduction": "reducing manual review volume",
            "processing_efficiency": "improving processing efficiency",
            "volume_increase": "absorbing additional volume",
        }
        action_map = {
            "automation_level": "Prioritize targeted automation at high-volume, rules-based stages",
            "manual_review_reduction": "Tighten manual-review referral rules before broad automation",
            "processing_efficiency": "Remove idle time and rework inside the existing process",
            "volume_increase": "Revisit capacity planning",
        }

        if winner["lever"] == "manual_review_reduction" or (
            review_cut > 0 and mr_time_share >= 0.18 and review_cut >= automation * 0.5
        ):
            action = action_map["manual_review_reduction"]
            lever_text = labels["manual_review_reduction"]
        else:
            action = action_map[winner["lever"]]
            lever_text = labels[winner["lever"]]

        direction = "reduces" if time_improved else "increases"
        impact = (
            f"Based on the selected assumptions, {lever_text} produces the largest movement in "
            f"average processing time. Overall cycle time {direction} by {abs(time_change):.1f}%, "
            f"and SLA breach rate moves from {comparison['sla_breach_rate']['current']}% to "
            f"{comparison['sla_breach_rate']['projected']}%."
        )

        if winner["lever"] == "automation_level":
            tradeoff = (
                "Automation lowers unit cost and cycle time but needs exception-handling capacity "
                "for the residual cases that still fail straight-through processing."
            )
            consideration = (
                "Start with Intake and Validation, where rules are clearer, rather than automating "
                "Manual Review end-to-end."
            )
        elif winner["lever"] == "manual_review_reduction":
            tradeoff = (
                "Fewer reviews speed the process, but a looser referral policy can miss higher-risk items "
                "if the remaining sample is not risk-weighted."
            )
            consideration = (
                "Keep mandatory review for high-value wires and elevated fraud scores, and reduce "
                "reviews mainly on low-risk domestic and card payments."
            )
        else:
            tradeoff = (
                "Efficiency gains are cheaper than new systems, but they usually cap out once obvious rework is gone."
            )
            consideration = (
                "Measure idle time between stages and duplicate data checks before funding a larger automation program."
            )

    return {
        "recommended_action": action,
        "expected_operational_impact": impact,
        "main_tradeoff": tradeoff,
        "implementation_consideration": consideration,
    }


def _clip(value: float, low: float, high: float) -> float:
    try:
        number = float(value)
    except (TypeError, ValueError):
        return low
    return max(low, min(high, number))


def current_operating_state(db: Session, filters: Optional[TransactionFilters]) -> dict:
    rows = _txn_query(db, filters).all()
    summary = summarize_transactions(rows)
    performance = process_performance(db, filters)
    stages = {s["stage_name"]: s for s in performance["stages"]}
    mr = stages.get("Manual Review")
    total_stage_time = sum(s["average_processing_time"] * max(s["transaction_count"], 1) for s in performance["stages"])
    mr_time = 0.0
    if mr:
        mr_time = mr["average_processing_time"] * mr["transaction_count"]
    share = (mr_time / total_stage_time) if total_stage_time else 0.22
    summary["manual_review_time_share"] = round(share, 3)
    summary["bottleneck_stage"] = performance["bottleneck_stage"]
    return summary


def export_payload(db: Session, filters: Optional[TransactionFilters], assumptions: Optional[dict] = None) -> dict:
    summary = dashboard_summary(db, filters)
    bottlenecks = bottleneck_ranking(db, filters)
    risks = risk_dashboard(db)
    state = current_operating_state(db, filters)
    assumptions = assumptions or {
        "volume_increase": 0,
        "automation_level": 20,
        "manual_review_reduction": 15,
        "processing_efficiency": 10,
    }
    scenario = simulate_scenario(state, assumptions)
    high_risks = [r for r in risks["register"] if r["priority"] == "High"]
    return {
        "disclaimer": "All transaction data in this project is simulated and created solely for educational purposes.",
        "kpi_summary": summary,
        "bottleneck_analysis": {
            "methodology": bottlenecks["methodology"],
            "ranking": [
                {
                    "rank": s["rank"],
                    "stage_name": s["stage_name"],
                    "score": s["score"],
                    "level": s["level"],
                    "average_processing_time": s["average_processing_time"],
                    "sla_target": s["sla_target"],
                    "exception_rate": s["exception_rate"],
                }
                for s in bottlenecks["stages"]
            ],
            "explanation": bottlenecks["explanation"],
        },
        "risk_summary": {
            "high_priority_count": len(high_risks),
            "high_priority_risks": high_risks[:5],
        },
        "process_improvement_scenario": scenario,
        "recommendations": scenario["recommendation"],
    }


def filter_options(db: Session) -> dict:
    def distinct(column):
        values = db.query(column).distinct().order_by(column).all()
        return [row[0] for row in values if row[0] is not None]

    min_date, max_date = db.query(
        func.min(Transaction.transaction_date),
        func.max(Transaction.transaction_date),
    ).one()

    return {
        "transaction_types": distinct(Transaction.transaction_type),
        "channels": distinct(Transaction.channel),
        "regions": distinct(Transaction.region),
        "statuses": distinct(Transaction.settlement_status),
        "date_min": min_date.date().isoformat() if min_date else None,
        "date_max": max_date.date().isoformat() if max_date else None,
    }
