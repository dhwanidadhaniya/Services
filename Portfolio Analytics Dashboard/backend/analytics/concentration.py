"""
Concentration Analytics Module
Implements portfolio concentration analysis:
- Top 5 & Top 10 Holdings Exposure
- Largest Single Position, Sector, Country, and Asset Class Weights
- Herfindahl-Hirschman Index (HHI)
- Student-Defined Concentration Alert Thresholds
"""

import numpy as np
import pandas as pd
from typing import Dict, List, Any

def calculate_concentration_metrics(holdings_df: pd.DataFrame) -> Dict[str, Any]:
    """
    Computes comprehensive concentration metrics for a portfolio or aggregated book.
    """
    if holdings_df.empty:
        return {
            "top_1_weight_pct": 0.0,
            "top_5_weight_pct": 0.0,
            "top_10_weight_pct": 0.0,
            "hhi_score": 0.0,
            "concentration_level": "Low",
            "largest_sector": {"name": "N/A", "weight_pct": 0.0},
            "largest_country": {"name": "N/A", "weight_pct": 0.0},
            "largest_asset_class": {"name": "N/A", "weight_pct": 0.0},
            "holdings_breakdown": []
        }
    
    # Sort holdings descending by weight
    df_sorted = holdings_df.sort_values(by="Weight_Pct", ascending=False).reset_index(drop=True)
    weights = df_sorted["Weight_Pct"].values
    
    top_1 = float(weights[0]) if len(weights) > 0 else 0.0
    top_5 = float(weights[:5].sum()) if len(weights) >= 5 else float(weights.sum())
    top_10 = float(weights[:10].sum()) if len(weights) >= 10 else float(weights.sum())
    
    # Herfindahl-Hirschman Index (HHI)
    # Sum of squared percentage weights (0 to 10,000)
    hhi = float(np.sum(weights ** 2))
    
    # Sector breakdown
    sector_agg = holdings_df.groupby("Sector")["Weight_Pct"].sum().sort_values(ascending=False)
    largest_sector = {"name": sector_agg.index[0], "weight_pct": round(float(sector_agg.iloc[0]), 2)}
    
    # Country breakdown
    country_agg = holdings_df.groupby("Country")["Weight_Pct"].sum().sort_values(ascending=False)
    largest_country = {"name": country_agg.index[0], "weight_pct": round(float(country_agg.iloc[0]), 2)}
    
    # Asset class breakdown
    asset_agg = holdings_df.groupby("Asset_Class")["Weight_Pct"].sum().sort_values(ascending=False)
    largest_asset = {"name": asset_agg.index[0], "weight_pct": round(float(asset_agg.iloc[0]), 2)}
    
    # Alert level classification (Student-Defined Concentration Indicator)
    if top_1 > 20.0 or top_5 > 65.0 or hhi > 2500:
        level = "High Concentration Risk"
        alert_code = "RED"
    elif top_1 > 12.0 or top_5 > 45.0 or hhi > 1500:
        level = "Moderate Concentration"
        alert_code = "AMBER"
    else:
        level = "Well Diversified"
        alert_code = "GREEN"
        
    return {
        "top_1_weight_pct": round(top_1, 2),
        "top_5_weight_pct": round(top_5, 2),
        "top_10_weight_pct": round(top_10, 2),
        "hhi_score": round(hhi, 1),
        "concentration_level": level,
        "alert_code": alert_code,
        "largest_sector": largest_sector,
        "largest_country": largest_country,
        "largest_asset_class": largest_asset,
        "sector_breakdown": [{"sector": k, "weight_pct": round(float(v), 2)} for k, v in sector_agg.items()],
        "country_breakdown": [{"country": k, "weight_pct": round(float(v), 2)} for k, v in country_agg.items()],
        "asset_class_breakdown": [{"asset_class": k, "weight_pct": round(float(v), 2)} for k, v in asset_agg.items()]
    }
