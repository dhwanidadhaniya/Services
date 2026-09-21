"""Generate a simulated transaction-processing dataset.

The distributions are intentionally skewed so that most items complete
straight-through, while a smaller share needs review or raises exceptions.
High-value wires and international transfers are more likely to be reviewed.
"""

from __future__ import annotations

import math
import random
from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.models import ImprovementScenario, ProcessStage, RiskControl, StageEvent, Transaction


RANDOM_SEED = 42
TRANSACTION_COUNT = 4200

STAGES = [
    ("Intake", 8.0, 1),
    ("Validation", 12.0, 2),
    ("Risk Screening", 15.0, 3),
    ("Manual Review", 30.0, 4),
    ("Approval", 12.0, 5),
    ("Settlement", 20.0, 6),
    ("Reconciliation", 25.0, 7),
]

# Typical minutes at each stage before type/channel adjustments.
STAGE_MEANS = {
    "Intake": 4.2,
    "Validation": 7.4,
    "Risk Screening": 12.8,
    "Manual Review": 51.0,
    "Approval": 8.1,
    "Settlement": 15.6,
    "Reconciliation": 21.4,
}

TYPE_WEIGHTS = [
    ("Card Payment", 0.32),
    ("Bill Payment", 0.18),
    ("Account Transfer", 0.16),
    ("Domestic Transfer", 0.14),
    ("International Transfer", 0.12),
    ("Wire Transfer", 0.08),
]

CHANNEL_WEIGHTS = [
    ("Online", 0.38),
    ("Mobile", 0.34),
    ("Branch", 0.16),
    ("API", 0.12),
]

REGION_WEIGHTS = [
    ("Northeast", 0.24),
    ("West", 0.22),
    ("Southeast", 0.20),
    ("Midwest", 0.18),
    ("Southwest", 0.16),
]

TYPE_TIME_FACTOR = {
    "Card Payment": 0.72,
    "Bill Payment": 0.84,
    "Account Transfer": 0.90,
    "Domestic Transfer": 1.00,
    "International Transfer": 1.38,
    "Wire Transfer": 1.55,
}

TYPE_AMOUNT = {
    "Card Payment": (3.8, 0.70, 8, 2500),
    "Bill Payment": (4.8, 0.55, 20, 4000),
    "Account Transfer": (6.4, 0.85, 50, 25000),
    "Domestic Transfer": (6.9, 0.80, 75, 40000),
    "International Transfer": (7.6, 0.90, 200, 80000),
    "Wire Transfer": (8.6, 0.85, 500, 250000),
}

CHANNEL_TIME_FACTOR = {
    "Online": 0.95,
    "Mobile": 0.92,
    "Branch": 1.18,
    "API": 0.86,
}

OPERATORS = [f"OP-{n:03d}" for n in range(101, 129)]

EXCEPTION_TYPES = [
    "Missing Information",
    "Validation Failure",
    "Duplicate Transaction",
    "Risk Review",
    "Settlement Failure",
    "Reconciliation Difference",
    "Other",
]


def _weighted_choice(pairs: list[tuple[str, float]], rng: random.Random) -> str:
    labels, weights = zip(*pairs)
    return rng.choices(labels, weights=weights, k=1)[0]


def _lognormal(rng: random.Random, mean_log: float, sigma: float, low: float, high: float) -> float:
    value = math.exp(rng.gauss(mean_log, sigma))
    return round(min(max(value, low), high), 2)


def _positive_minutes(rng: random.Random, mean: float, spread: float = 0.35) -> float:
    value = rng.gauss(mean, mean * spread)
    return round(max(0.4, value), 1)


def _is_weekday_heavy(rng: random.Random, start: datetime) -> datetime:
    """Most operations volume lands on weekdays during processing hours."""
    for _ in range(12):
        offset_days = rng.randint(0, 89)
        hour = rng.choices(
            range(7, 21),
            weights=[2, 3, 5, 7, 8, 8, 7, 7, 6, 6, 5, 4, 3, 2],
            k=1,
        )[0]
        minute = rng.randint(0, 59)
        dt = start + timedelta(days=offset_days, hours=hour, minutes=minute)
        if dt.weekday() < 5 or rng.random() < 0.18:
            return dt
    return start + timedelta(days=rng.randint(0, 89), hours=10)


def seed_reference_data(db: Session) -> None:
    if db.query(ProcessStage).count() == 0:
        for name, sla, order in STAGES:
            db.add(
                ProcessStage(
                    stage_name=name,
                    sequence_order=order,
                    average_processing_time=STAGE_MEANS[name],
                    sla_target=sla,
                    exception_rate=0.0,
                )
            )

    if db.query(RiskControl).count() == 0:
        for row in RISK_CONTROLS:
            likelihood = row["likelihood"]
            impact = row["impact"]
            db.add(
                RiskControl(
                    process_stage=row["process_stage"],
                    risk_description=row["risk_description"],
                    likelihood=likelihood,
                    impact=impact,
                    risk_score=likelihood * impact,
                    control_description=row["control_description"],
                    control_effectiveness=row["control_effectiveness"],
                    owner=row["owner"],
                )
            )

    if db.query(ImprovementScenario).count() == 0:
        db.add_all(
            [
                ImprovementScenario(
                    scenario_name="Volume Surge",
                    assumption="Inbound volume rises 20% with no change to staffing or automation.",
                    expected_time_reduction=-8.0,
                    expected_error_reduction=-3.0,
                    implementation_cost="Low (planning only)",
                    expected_benefit="Shows capacity strain before a seasonal or campaign-driven spike.",
                    volume_increase=20,
                    automation_level=0,
                    manual_review_reduction=0,
                    processing_efficiency=0,
                ),
                ImprovementScenario(
                    scenario_name="Increased Automation",
                    assumption="Straight-through processing is extended to about 30% more rules-based work.",
                    expected_time_reduction=12.0,
                    expected_error_reduction=14.0,
                    implementation_cost="Medium–High",
                    expected_benefit="Lower cycle time and fewer preventable validation exceptions.",
                    volume_increase=0,
                    automation_level=30,
                    manual_review_reduction=0,
                    processing_efficiency=0,
                ),
                ImprovementScenario(
                    scenario_name="Manual Review Optimization",
                    assumption="Referral rules are tightened so about 25% of current reviews no longer stop the flow.",
                    expected_time_reduction=15.0,
                    expected_error_reduction=6.0,
                    implementation_cost="Medium",
                    expected_benefit="Relieves the main bottleneck without a full platform rebuild.",
                    volume_increase=0,
                    automation_level=0,
                    manual_review_reduction=25,
                    processing_efficiency=0,
                ),
            ]
        )
    db.commit()


def generate_transactions(db: Session) -> None:
    if db.query(Transaction).count() > 0:
        return

    rng = random.Random(RANDOM_SEED)
    start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0) - timedelta(days=90)
    sla_lookup = {name: sla for name, sla, _ in STAGES}

    transactions: list[Transaction] = []
    events: list[StageEvent] = []

    for index in range(1, TRANSACTION_COUNT + 1):
        txn_type = _weighted_choice(TYPE_WEIGHTS, rng)
        channel = _weighted_choice(CHANNEL_WEIGHTS, rng)
        region = _weighted_choice(REGION_WEIGHTS, rng)
        amount_params = TYPE_AMOUNT[txn_type]
        amount = _lognormal(rng, *amount_params)

        high_value = amount >= 10000
        unusual_value = amount >= 50000

        risk_score = int(rng.randint(4, 18))
        if txn_type in ("International Transfer", "Wire Transfer"):
            risk_score += rng.randint(3, 8)
        if high_value:
            risk_score += rng.randint(2, 6)
        if unusual_value:
            risk_score += rng.randint(3, 7)
        if channel == "API" and rng.random() < 0.12:
            risk_score += 4
        risk_score = max(1, min(99, risk_score))

        fraud_p = 0.012
        if txn_type == "International Transfer":
            fraud_p += 0.018
        if txn_type == "Wire Transfer":
            fraud_p += 0.022
        if unusual_value:
            fraud_p += 0.03
        if risk_score >= 40:
            fraud_p += 0.04
        fraud_flag = rng.random() < fraud_p
        if fraud_flag:
            risk_score = max(risk_score, rng.randint(45, 88))

        review_p = 0.07
        if txn_type == "International Transfer":
            review_p += 0.12
        if txn_type == "Wire Transfer":
            review_p += 0.16
        if high_value:
            review_p += 0.10
        if unusual_value:
            review_p += 0.16
        if risk_score >= 35:
            review_p += 0.14
        if fraud_flag:
            review_p = 0.92
        if channel == "Branch":
            review_p += 0.03
        manual_review = rng.random() < min(review_p, 0.95)

        path = ["Intake", "Validation", "Risk Screening"]
        if manual_review:
            path.append("Manual Review")
        path.extend(["Approval", "Settlement", "Reconciliation"])

        # A small share never finishes — rejected or failed along the way.
        drop_at = None
        if fraud_flag and rng.random() < 0.55:
            drop_at = "Approval"
        elif rng.random() < 0.035:
            drop_at = rng.choice(["Validation", "Risk Screening", "Settlement"])

        time_factor = TYPE_TIME_FACTOR[txn_type] * CHANNEL_TIME_FACTOR[channel]
        if region in ("Northeast", "West"):
            time_factor *= 1.04

        stage_times = []
        exception_type = None
        total_time = 0.0
        total_sla = 0.0
        last_stage = path[0]

        for stage in path:
            minutes = _positive_minutes(rng, STAGE_MEANS[stage] * time_factor)
            if stage == "Manual Review" and (fraud_flag or unusual_value):
                minutes *= rng.uniform(1.15, 1.45)
            sla_target = sla_lookup[stage]
            stage_exception = False

            # Exceptions are uncommon and cluster in particular stages.
            if exception_type is None:
                p = 0.015
                if stage == "Intake":
                    p = 0.028
                elif stage == "Validation":
                    p = 0.034
                elif stage == "Risk Screening":
                    p = 0.022
                elif stage == "Manual Review":
                    p = 0.055
                elif stage == "Settlement":
                    p = 0.018
                elif stage == "Reconciliation":
                    p = 0.024
                if txn_type in ("International Transfer", "Wire Transfer"):
                    p += 0.012
                if rng.random() < p:
                    stage_exception = True
                    exception_type = _exception_for_stage(stage, rng)
                    minutes += rng.uniform(8, 28)

            sla_breached = minutes > sla_target
            total_time += minutes
            total_sla += sla_target
            last_stage = stage
            stage_times.append(
                {
                    "stage_name": stage,
                    "processing_time_minutes": round(minutes, 1),
                    "sla_target_minutes": sla_target,
                    "sla_breached": sla_breached,
                    "exception_flag": stage_exception if exception_type else False,
                }
            )

            if drop_at == stage:
                break

        exception_flag = exception_type is not None
        overall_sla = total_time > total_sla
        resolution = None
        if exception_flag:
            resolution = round(rng.uniform(12, 90), 1)
            total_time += resolution * 0.15

        if drop_at == "Approval" or (fraud_flag and last_stage in ("Risk Screening", "Manual Review", "Approval") and rng.random() < 0.4):
            approval_status = "Rejected"
        elif last_stage in ("Intake", "Validation", "Risk Screening", "Manual Review"):
            approval_status = "Pending"
        else:
            approval_status = "Approved"

        if approval_status == "Rejected":
            settlement_status = "Not Started"
        elif last_stage not in ("Settlement", "Reconciliation"):
            settlement_status = "Pending"
        elif exception_type == "Settlement Failure" or (drop_at == "Settlement"):
            settlement_status = "Failed"
        elif last_stage == "Settlement":
            settlement_status = "Pending"
        else:
            settlement_status = "Settled" if rng.random() < 0.97 else "Failed"

        txn_id = f"TXN-{index:06d}"
        txn = Transaction(
            transaction_id=txn_id,
            transaction_date=_is_weekday_heavy(rng, start),
            transaction_type=txn_type,
            channel=channel,
            region=region,
            transaction_amount=amount,
            processing_stage=last_stage,
            processing_time_minutes=round(total_time, 1),
            sla_target_minutes=round(total_sla, 1),
            sla_breached=overall_sla,
            exception_flag=exception_flag,
            exception_type=exception_type,
            exception_resolution_minutes=resolution,
            manual_review=manual_review,
            fraud_flag=fraud_flag,
            risk_score=risk_score,
            approval_status=approval_status,
            settlement_status=settlement_status,
            operator_id=rng.choice(OPERATORS),
        )
        transactions.append(txn)

        for event in stage_times:
            events.append(
                StageEvent(
                    transaction_pk=index,  # filled after flush; placeholder replaced below
                    transaction_id=txn_id,
                    **event,
                )
            )

    db.bulk_save_objects(transactions)
    db.flush()

    id_map = {
        row.transaction_id: row.id
        for row in db.query(Transaction.transaction_id, Transaction.id).all()
    }
    for event in events:
        event.transaction_pk = id_map[event.transaction_id]
    db.bulk_save_objects(events)
    db.commit()
    refresh_stage_aggregates(db)


def _exception_for_stage(stage: str, rng: random.Random) -> str:
    if stage == "Intake":
        return rng.choices(
            ["Missing Information", "Duplicate Transaction", "Other"],
            weights=[0.62, 0.28, 0.10],
            k=1,
        )[0]
    if stage == "Validation":
        return rng.choices(
            ["Validation Failure", "Missing Information", "Other"],
            weights=[0.70, 0.22, 0.08],
            k=1,
        )[0]
    if stage in ("Risk Screening", "Manual Review"):
        return rng.choices(
            ["Risk Review", "Missing Information", "Other"],
            weights=[0.78, 0.14, 0.08],
            k=1,
        )[0]
    if stage == "Settlement":
        return rng.choices(
            ["Settlement Failure", "Other"],
            weights=[0.86, 0.14],
            k=1,
        )[0]
    if stage == "Reconciliation":
        return rng.choices(
            ["Reconciliation Difference", "Other"],
            weights=[0.88, 0.12],
            k=1,
        )[0]
    return "Other"


def refresh_stage_aggregates(db: Session) -> None:
    stages = db.query(ProcessStage).all()
    for stage in stages:
        rows = db.query(StageEvent).filter(StageEvent.stage_name == stage.stage_name).all()
        if not rows:
            continue
        stage.average_processing_time = round(
            sum(r.processing_time_minutes for r in rows) / len(rows), 2
        )
        stage.exception_rate = round(
            sum(1 for r in rows if r.exception_flag) / len(rows) * 100, 2
        )
    db.commit()


def seed_if_empty(db: Session) -> None:
    seed_reference_data(db)
    generate_transactions(db)


RISK_CONTROLS = [
    {
        "process_stage": "Intake",
        "risk_description": "Incomplete customer or beneficiary details enter the workflow and create later rework.",
        "likelihood": 4,
        "impact": 3,
        "control_description": "Mandatory field checks at channel capture, with a reject-back to the originating channel.",
        "control_effectiveness": "Medium",
        "owner": "Payments Intake",
    },
    {
        "process_stage": "Intake",
        "risk_description": "Duplicate submissions from channel retries inflate volume and settlement risk.",
        "likelihood": 3,
        "impact": 3,
        "control_description": "Idempotency key matching on transaction reference, amount, and party identifiers.",
        "control_effectiveness": "High",
        "owner": "Channel Operations",
    },
    {
        "process_stage": "Validation",
        "risk_description": "Account status or payment-format errors are missed and stop downstream settlement.",
        "likelihood": 3,
        "impact": 4,
        "control_description": "Format, limit, and account-status validation before risk screening.",
        "control_effectiveness": "High",
        "owner": "Payments Operations",
    },
    {
        "process_stage": "Validation",
        "risk_description": "Manual data repair introduces inconsistent values across related records.",
        "likelihood": 2,
        "impact": 3,
        "control_description": "Four-eye check on any operator override of validated fields.",
        "control_effectiveness": "Medium",
        "owner": "Payments Operations",
    },
    {
        "process_stage": "Risk Screening",
        "risk_description": "Sanctions or fraud hits are not reviewed within the screening SLA.",
        "likelihood": 2,
        "impact": 5,
        "control_description": "Alert queue with aging thresholds and dual control on release.",
        "control_effectiveness": "Medium",
        "owner": "Financial Crime Operations",
    },
    {
        "process_stage": "Risk Screening",
        "risk_description": "False-positive alerts consume reviewer capacity and delay genuine payments.",
        "likelihood": 4,
        "impact": 3,
        "control_description": "Tuning of rules by product and corridor, reviewed monthly against alert yield.",
        "control_effectiveness": "Medium",
        "owner": "Financial Crime Operations",
    },
    {
        "process_stage": "Manual Review",
        "risk_description": "High-value items sit in review without an owner, creating SLA breaches.",
        "likelihood": 4,
        "impact": 4,
        "control_description": "Work allocation by risk score and aging, with a same-day escalation at 80% of SLA.",
        "control_effectiveness": "Low",
        "owner": "Exception Management",
    },
    {
        "process_stage": "Manual Review",
        "risk_description": "Reviewers clear items without documenting the rationale, weakening auditability.",
        "likelihood": 3,
        "impact": 4,
        "control_description": "Structured disposition codes and mandatory comment on override decisions.",
        "control_effectiveness": "Medium",
        "owner": "Exception Management",
    },
    {
        "process_stage": "Approval",
        "risk_description": "Approval is granted after a screening exception was only partially resolved.",
        "likelihood": 2,
        "impact": 5,
        "control_description": "System block on approval while an open risk exception remains.",
        "control_effectiveness": "High",
        "owner": "Payments Operations",
    },
    {
        "process_stage": "Settlement",
        "risk_description": "Settlement instructions fail at the correspondent or network and are not recycled in time.",
        "likelihood": 3,
        "impact": 4,
        "control_description": "Failed-settlement queue with cut-off clocks and automated retry for eligible codes.",
        "control_effectiveness": "Medium",
        "owner": "Settlement Team",
    },
    {
        "process_stage": "Settlement",
        "risk_description": "Funding or nostro timing issues create unreconciled cash positions.",
        "likelihood": 2,
        "impact": 4,
        "control_description": "Intraday position monitoring against settlement windows.",
        "control_effectiveness": "Medium",
        "owner": "Treasury Operations",
    },
    {
        "process_stage": "Reconciliation",
        "risk_description": "Breaks between the ledger and network reports remain open past the close.",
        "likelihood": 3,
        "impact": 4,
        "control_description": "Daily reconciliation with aging of unmatched items and a next-day clearance target.",
        "control_effectiveness": "Medium",
        "owner": "Reconciliation Team",
    },
    {
        "process_stage": "Reconciliation",
        "risk_description": "Amount mismatches on international items are written off without investigation.",
        "likelihood": 2,
        "impact": 5,
        "control_description": "Threshold-based investigation and dual approval for any write-off.",
        "control_effectiveness": "High",
        "owner": "Reconciliation Team",
    },
]
