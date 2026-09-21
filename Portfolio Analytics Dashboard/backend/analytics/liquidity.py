"""
Liquidity & Cash Analytics Module
Implements institutional liquidity and cash management frameworks:
- Cash / AUM Ratio
- Days of Liquidity
- Idle Cash Estimation
- Student-Defined Cash Efficiency Index
"""

from typing import Dict, Union

def calculate_cash_ratio(cash_balance_m: float, aum_m: float) -> float:
    """
    Cash / AUM Ratio (%) = (Cash Balance / Total AUM) * 100
    """
    if aum_m <= 0:
        return 0.0
    return round((cash_balance_m / aum_m) * 100.0, 2)

def calculate_days_of_liquidity(
    cash_and_liquid_assets_m: float,
    monthly_outflows_m: float
) -> float:
    """
    Days of Liquidity = Cash & Level-1 Liquid Assets / Daily Average Outflows
    Daily Average Outflows = Monthly Outflows / 30
    """
    if monthly_outflows_m <= 0:
        return 999.0 # Effectively infinite liquidity runway
    daily_burn = monthly_outflows_m / 30.0
    days = cash_and_liquid_assets_m / daily_burn
    return round(days, 1)

def calculate_idle_cash(
    cash_balance_m: float,
    aum_m: float,
    operating_buffer_pct: float = 0.04
) -> float:
    """
    Idle Cash Estimate = Max(0, Actual Cash - Target Operating Buffer)
    Operating buffer typically 4% of AUM for institutional settlement and collateral needs.
    """
    target_buffer = aum_m * operating_buffer_pct
    idle = max(0.0, cash_balance_m - target_buffer)
    return round(idle, 2)

def calculate_cash_efficiency(
    cash_balance_m: float,
    aum_m: float,
    target_operating_pct: float = 0.04
) -> Dict[str, Union[float, str]]:
    """
    Student-Defined Cash Efficiency Index.
    Formula: Target Operating Liquidity / Actual Cash Balance
    
    Interpretation:
    - ~1.0: Optimal cash deployment (minimal cash drag while covering operating requirements).
    - < 0.6: Sub-optimal / Cash drag (excess idle liquidity earning sub-market returns).
    - > 1.4: Liquidity squeeze (cash reserves below operational safety buffer).
    
    *Note: Clearly labeled as a student-defined analytical indicator.*
    """
    target_req = aum_m * target_operating_pct
    if cash_balance_m <= 0.001:
        return {"efficiency_index": 0.0, "status": "Depleted / High Squeeze Risk", "grade": "Critical"}
    
    index_val = round(target_req / cash_balance_m, 2)
    
    if index_val < 0.5:
        status = "Excess Cash Drag (High Sweep Opportunity)"
        grade = "Sub-Optimal"
    elif 0.5 <= index_val <= 1.2:
        status = "Efficient Cash Deployment"
        grade = "Optimal"
    elif 1.2 < index_val <= 1.6:
        status = "Tight Operating Buffer"
        grade = "Moderate Watch"
    else:
        status = "Elevated Liquidity Squeeze Risk"
        grade = "High Risk"
        
    return {
        "efficiency_index": index_val,
        "target_buffer_usd_m": round(target_req, 2),
        "actual_cash_usd_m": round(cash_balance_m, 2),
        "idle_cash_usd_m": calculate_idle_cash(cash_balance_m, aum_m, target_operating_pct),
        "status": status,
        "grade": grade
    }
