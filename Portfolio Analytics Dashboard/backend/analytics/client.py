"""
Client Analytics & Segmentation Module
Implements:
- Student-Defined Client Health Score (0-100)
- 2D Client Segmentation Grid (Client Value vs Growth Potential)
- Service Utilization Matrix & Heatmap Data
"""

import pandas as pd
import numpy as np
from typing import Dict, List, Any

ALL_SERVICES = [
    "Cash Management", "Trade Finance", "Custody", "Fund Administration",
    "Collateral Management", "FX Services", "Liquidity Management", "Performance Analytics"
]

def calculate_client_health_score(
    perf_ann_ret: float,
    aum_growth_pct: float,
    rev_bps: float,
    txn_count: int,
    service_count: int,
    cash_ratio_pct: float
) -> Dict[str, Any]:
    """
    Student-Defined Client Health Score (0 - 100).
    Weighted multi-factor assessment:
    - Performance Score (25%): 0-100 based on annualized return vs hurdle
    - AUM Growth Score (20%): 0-100 based on YoY AUM trajectory
    - Revenue Efficiency (15%): 0-100 based on fee capture bps
    - Transaction Engagement (15%): 0-100 based on volume & activity
    - Service Breadth (15%): 0-100 based on number of active services
    - Liquidity Stability (10%): 0-100 penalty for excessive cash drag or squeeze
    
    *Explicitly labeled as a student-defined analytical indicator.*
    """
    # 1. Performance component (target > 8% ann return)
    s_perf = min(100.0, max(0.0, (perf_ann_ret + 0.05) / 0.18 * 100.0))
    
    # 2. AUM growth component (-5% to +15% range)
    s_growth = min(100.0, max(0.0, (aum_growth_pct + 5.0) / 20.0 * 100.0))
    
    # 3. Revenue capture component (4 to 12 bps)
    s_rev = min(100.0, max(0.0, (rev_bps - 3.0) / 8.0 * 100.0))
    
    # 4. Transaction activity
    s_txn = min(100.0, max(10.0, (txn_count / 250.0) * 100.0))
    
    # 5. Service breadth (1 to 8 services)
    s_serv = min(100.0, max(15.0, (service_count / 8.0) * 100.0))
    
    # 6. Liquidity balance (optimal 4-8% cash)
    if 3.5 <= cash_ratio_pct <= 9.0:
        s_liq = 95.0
    elif cash_ratio_pct > 13.0:
        s_liq = 55.0 # Drag penalty
    else:
        s_liq = 75.0
        
    total_score = (
        0.25 * s_perf +
        0.20 * s_growth +
        0.15 * s_rev +
        0.15 * s_txn +
        0.15 * s_serv +
        0.10 * s_liq
    )
    total_score = round(total_score, 1)
    
    if total_score >= 80.0:
        grade = "Strong / Strategic Health"
        status_color = "GREEN"
    elif total_score >= 65.0:
        grade = "Stable / Core Relationship"
        status_color = "BLUE"
    elif total_score >= 50.0:
        grade = "Moderate / Opportunity to Deepen"
        status_color = "AMBER"
    else:
        grade = "Needs Attention / Attrition Risk"
        status_color = "RED"
        
    return {
        "health_score": total_score,
        "grade": grade,
        "status_color": status_color,
        "sub_scores": {
            "performance": round(s_perf, 1),
            "aum_growth": round(s_growth, 1),
            "revenue_efficiency": round(s_rev, 1),
            "transaction_engagement": round(s_txn, 1),
            "service_breadth": round(s_serv, 1),
            "liquidity_health": round(s_liq, 1)
        }
    }

def classify_client_segment(
    aum_m: float,
    revenue_m: float,
    aum_growth_pct: float,
    service_count: int
) -> Dict[str, Any]:
    """
    2D Institutional Client Segmentation:
    - X-Axis: Client Scale & Value (AUM + Revenue rank proxy)
    - Y-Axis: Growth & Expansion Potential (YoY Growth + Service White-space)
    
    Segments:
    1. Strategic (High Value, High Growth/Expansion)
    2. Core (High Value, Mature/Steady Growth)
    3. Growth (Emerging Scale, Rapid Expansion)
    4. Emerging (Lower Scale, Specialized Mandates)
    5. Needs Attention (Low Growth, Low Service Penetration or Attrition Risk)
    """
    # Normalize Client Value (0 - 100)
    client_value = min(100.0, (aum_m / 12500.0) * 60.0 + (revenue_m / 8.0) * 40.0)
    
    # Growth & Expansion Potential (0 - 100)
    expansion_headroom = (8 - service_count) / 8.0 * 50.0
    growth_score = min(100.0, max(0.0, (aum_growth_pct + 2.0) / 15.0 * 50.0 + expansion_headroom))
    
    if client_value >= 50.0 and growth_score >= 50.0:
        segment = "Strategic"
        color = "#1E3A8A" # Deep Navy
    elif client_value >= 50.0 and growth_score < 50.0:
        segment = "Core"
        color = "#0D9488" # Teal
    elif client_value < 50.0 and growth_score >= 55.0:
        segment = "Growth"
        color = "#10B981" # Emerald
    elif client_value < 50.0 and growth_score >= 35.0:
        segment = "Emerging"
        color = "#6366F1" # Indigo
    else:
        segment = "Needs Attention"
        color = "#F59E0B" # Amber
        
    return {
        "segment": segment,
        "client_value_score": round(client_value, 1),
        "growth_potential_score": round(growth_score, 1),
        "color": color
    }
