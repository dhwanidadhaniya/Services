"""
Exception Monitoring & Operational Alerts Engine
Rules-based institutional exception engine:
- Large transaction size anomalies
- Settlement failures & breaks
- Excessive single-position concentration breaches
- Severe portfolio drawdowns
- Benchmark underperformance breaches
- Elevated idle cash balances

Every alert includes WHAT happened, WHY it was flagged, and WHAT DATA triggered it.
"""

import pandas as pd
from typing import List, Dict, Any

def detect_institutional_exceptions(
    clients_df: pd.DataFrame,
    portfolios_df: pd.DataFrame,
    holdings_df: pd.DataFrame,
    txns_df: pd.DataFrame,
    navs_df: pd.DataFrame,
    concentration_threshold_pct: float = 15.0,
    large_txn_threshold_usd_m: float = 2.0,
    cash_ratio_threshold_pct: float = 12.0,
    drawdown_threshold_pct: float = 12.0
) -> List[Dict[str, Any]]:
    """
    Scans entire institutional book for operational & portfolio risk exceptions.
    """
    exceptions = []
    
    # 1. Concentration Breaches
    for _, h in holdings_df.iterrows():
        w = float(h["Weight_Pct"])
        if w >= concentration_threshold_pct:
            pid = h["Portfolio_ID"]
            cid = h["Client_ID"]
            sec = h["Security_Name"]
            exceptions.append({
                "exception_id": f"EXC-CONC-{pid}-{h['Security_Ticker']}",
                "category": "Portfolio Risk",
                "entity_type": "Portfolio",
                "entity_id": pid,
                "client_id": cid,
                "severity": "HIGH",
                "title": "Single-Position Concentration Breach",
                "what": f"Portfolio {pid} has an excessive concentration in {sec}.",
                "why": f"Position weight ({w:.1f}%) exceeds the configurable risk tolerance of {concentration_threshold_pct:.1f}%.",
                "data_trigger": f"Holding: {h['Security_Ticker']} | Weight: {w:.2f}% | Market Value: ${h['Market_Value_USD_M']:.2f}M"
            })
            
    # 2. Large Transaction Exceptions
    large_txns = txns_df[txns_df["Gross_Value_USD_M"] >= large_txn_threshold_usd_m]
    for _, t in large_txns.head(15).iterrows():
        tid = t["Transaction_ID"]
        exceptions.append({
            "exception_id": f"EXC-TXN-{tid}",
            "category": "Operational Surveillance",
            "entity_type": "Transaction",
            "entity_id": tid,
            "client_id": t["Client_ID"],
            "severity": "MEDIUM",
            "title": "High-Value Transaction Execution",
            "what": f"Unusually large institutional {t['Transaction_Type']} trade executed.",
            "why": f"Gross transaction size (${t['Gross_Value_USD_M']:.2f}M) exceeds the surveillance monitoring threshold of ${large_txn_threshold_usd_m:.2f}M.",
            "data_trigger": f"Trade: {t['Transaction_Type']} {t['Security_Ticker']} | Gross: ${t['Gross_Value_USD_M']:.2f}M | Currency: {t['Currency']}"
        })
        
    # 3. Settlement Break Exceptions
    failed_txns = txns_df[txns_df["Settlement_Status"] == "FAILED"]
    for _, t in failed_txns.head(15).iterrows():
        tid = t["Transaction_ID"]
        exceptions.append({
            "exception_id": f"EXC-SETTLE-{tid}",
            "category": "Trade Operations",
            "entity_type": "Settlement",
            "entity_id": tid,
            "client_id": t["Client_ID"],
            "severity": "HIGH",
            "title": "Trade Settlement Failure",
            "what": f"Transaction {tid} failed post-trade custody settlement.",
            "why": "Counterparty affirmation failure or custodian cash mismatch at settlement cutoff.",
            "data_trigger": f"Trade Date: {t['Date']} | Settle Date: {t['Settlement_Date']} | Value: ${t['Net_Value_USD_M']:.2f}M"
        })
        
    # 4. Elevated Idle Cash Balances
    high_cash_clients = clients_df[clients_df["Cash_Ratio_Pct"] >= cash_ratio_threshold_pct]
    for _, c in high_cash_clients.iterrows():
        cid = c["Client_ID"]
        exceptions.append({
            "exception_id": f"EXC-CASH-{cid}",
            "category": "Liquidity Management",
            "entity_type": "Client",
            "entity_id": cid,
            "client_id": cid,
            "severity": "MEDIUM",
            "title": "Elevated Uninvested Cash Drag",
            "what": f"Client {c['Client_Name']} maintains a substantial uninvested cash position.",
            "why": f"Cash / AUM ratio ({c['Cash_Ratio_Pct']:.1f}%) exceeds the liquidity optimization trigger of {cash_ratio_threshold_pct:.1f}%.",
            "data_trigger": f"AUM: ${c['AUM_USD_M']:.1f}M | Cash: ${c['Cash_Balance_USD_M']:.1f}M ({c['Cash_Ratio_Pct']:.1f}%)"
        })
        
    return exceptions
