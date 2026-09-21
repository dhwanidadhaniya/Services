"""
Client Opportunity Engine
Rule-based institutional business development & cross-sell detection engine.
Identifies potential conversation opportunities:
- High Idle Cash Balance -> Liquidity Management / Automated Yield Sweeps
- Low Service Penetration -> Custody / Fund Admin / Collateral Cross-Sell
- High Transaction Frequency -> Automated Clearing / FX Direct Integration
- Cross-Border / Currency Exposure -> FX Hedging & Treasury Services
- Underperformance / Elevated Volatility -> Quantitative Performance Analytics
"""

import pandas as pd
from typing import List, Dict, Any

def scan_client_opportunities(client_row: pd.Series, client_holdings: pd.DataFrame, client_txns: pd.DataFrame) -> List[Dict[str, Any]]:
    """
    Evaluates rule-based institutional service triggers for a specific client entity.
    Uses professional, cautious phrasing: 'Potential Opportunity', 'Analyst Observation'.
    """
    opps = []
    
    cname = client_row["Client_Name"]
    cid = client_row["Client_ID"]
    aum = float(client_row["AUM_USD_M"])
    cash_ratio = float(client_row["Cash_Ratio_Pct"])
    cash_bal = float(client_row["Cash_Balance_USD_M"])
    active_services = str(client_row["Active_Services"]).split(";")
    service_count = int(client_row["Service_Count"])
    
    # 1. Trigger: High Cash Balance (> 10.0%)
    if cash_ratio >= 10.0:
        opps.append({
            "client_id": cid,
            "client_name": cname,
            "category": "Liquidity & Treasury",
            "trigger_type": "Elevated Cash Allocation",
            "observation": f"Client holds ${cash_bal:,.1f}M ({cash_ratio:.1f}% of AUM) in uninvested custody cash.",
            "potential_opportunity": "Automated Multi-Currency Liquidity Sweep & Yield Optimization mandate.",
            "target_service": "Liquidity Management",
            "priority": "HIGH" if cash_ratio > 13.0 else "MEDIUM",
            "estimated_rev_impact_usd_k": round(cash_bal * 0.15 * 10, 1) # Estimated fee headroom
        })
        
    # 2. Trigger: Low Service Penetration (< 3 active services out of 8)
    if service_count <= 3:
        missing_core = [s for s in ["Fund Administration", "Collateral Management", "Performance Analytics"] if s not in active_services]
        rec_service = missing_core[0] if missing_core else "Fund Administration"
        opps.append({
            "client_id": cid,
            "client_name": cname,
            "category": "Service Expansion",
            "trigger_type": "Single-Service Concentration",
            "observation": f"Client currently utilizes only {service_count} out of 8 institutional service offerings.",
            "potential_opportunity": f"Cross-sell institutional {rec_service} to streamline back-office workflows.",
            "target_service": rec_service,
            "priority": "HIGH" if aum > 3000.0 else "MEDIUM",
            "estimated_rev_impact_usd_k": round(aum * 0.00015 * 1000, 1)
        })
        
    # 3. Trigger: Multi-Currency / Cross-Border Activity without FX Services
    if not client_txns.empty:
        non_usd_txns = client_txns[client_txns["Currency"] != "USD"]
        cross_border_pct = (len(non_usd_txns) / len(client_txns)) * 100.0 if len(client_txns) > 0 else 0.0
        if cross_border_pct > 25.0 and "FX Services" not in active_services:
            opps.append({
                "client_id": cid,
                "client_name": cname,
                "category": "FX & Trade Solutions",
                "trigger_type": "Cross-Border Transaction Flow",
                "observation": f"{cross_border_pct:.1f}% of transactions involve foreign currencies without institutional FX mandate.",
                "potential_opportunity": "Onboard client to Automated FX Execution & Hedging facility.",
                "target_service": "FX Services",
                "priority": "HIGH",
                "estimated_rev_impact_usd_k": round(len(non_usd_txns) * 0.45, 1)
            })
            
    # 4. Trigger: High Fixed Income / Bond holdings without Collateral Management
    if not client_holdings.empty:
        bond_holdings = client_holdings[client_holdings["Asset_Class"].isin(["Government Bonds", "Corporate Bonds"])]
        bond_val = bond_holdings["Market_Value_USD_M"].sum()
        if bond_val > 1000.0 and "Collateral Management" not in active_services:
            opps.append({
                "client_id": cid,
                "client_name": cname,
                "category": "Collateral & Financing",
                "trigger_type": "Substantial Fixed Income Inventory",
                "observation": f"Client maintains ${bond_val:,.1f}M in sovereign/corporate bonds suitable for tri-party financing.",
                "potential_opportunity": "Introduce Tri-Party Collateral Management and automated securities lending program.",
                "target_service": "Collateral Management",
                "priority": "MEDIUM",
                "estimated_rev_impact_usd_k": round(bond_val * 0.00008 * 1000, 1)
            })
            
    return opps
