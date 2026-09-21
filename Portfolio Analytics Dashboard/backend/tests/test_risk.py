"""
Unit tests for Risk, Liquidity, and Concentration Analytics
"""

import pytest
import numpy as np
import pandas as pd
from backend.analytics.risk import (
    calculate_annualized_volatility,
    calculate_sharpe_ratio,
    calculate_sortino_ratio,
    calculate_historical_var,
    calculate_max_drawdown,
    calculate_beta
)
from backend.analytics.liquidity import (
    calculate_cash_ratio,
    calculate_days_of_liquidity,
    calculate_idle_cash,
    calculate_cash_efficiency
)
from backend.analytics.concentration import calculate_concentration_metrics

def test_annualized_volatility():
    # If standard deviation is 0.05 per month, annualized is 0.05 * sqrt(12) = 0.1732
    # Create sample with known std dev
    sample = [0.01, 0.03, -0.02, 0.04, 0.00, -0.01, 0.02, 0.05, -0.03, 0.01, 0.02, 0.00]
    vol = calculate_annualized_volatility(sample)
    assert vol > 0.0

def test_sharpe_ratio():
    # Return = 10.5%, Rf = 4.5%, Vol = 12.0% -> Sharpe = (10.5 - 4.5) / 12 = 6 / 12 = 0.50
    sharpe = calculate_sharpe_ratio(0.105, 0.12, 0.045)
    assert pytest.approx(sharpe, 0.0001) == 0.50

def test_max_drawdown():
    # NAV: 100 -> 120 (Peak) -> 90 (Trough: -25% from 120) -> 110
    navs = [100.0, 110.0, 120.0, 105.0, 90.0, 110.0]
    mdd, series = calculate_max_drawdown(navs)
    assert pytest.approx(mdd, 0.0001) == -0.25 # (90 - 120)/120 = -0.25

def test_historical_var():
    # Historical monthly returns
    rets = np.random.normal(0.01, 0.04, 60)
    var_res = calculate_historical_var(rets, portfolio_value_m=100.0, confidence=0.95)
    assert var_res["var_1d_usd_m"] > 0
    assert var_res["var_10d_usd_m"] > var_res["var_1d_usd_m"]

def test_liquidity_metrics():
    # Cash = 100M, AUM = 1000M -> 10%
    cash_ratio = calculate_cash_ratio(100.0, 1000.0)
    assert cash_ratio == 10.0
    
    # Target 4% of 1000M is 40M. Actual is 100M. Idle = 60M
    idle = calculate_idle_cash(100.0, 1000.0, 0.04)
    assert idle == 60.0
    
    # Cash efficiency: 40 / 100 = 0.40 (Excess cash drag)
    eff = calculate_cash_efficiency(100.0, 1000.0, 0.04)
    assert eff["efficiency_index"] == 0.40
    assert eff["grade"] == "Sub-Optimal"

def test_concentration_metrics():
    holdings_data = pd.DataFrame([
        {"Security_Ticker": "SEC_A", "Sector": "Tech", "Country": "US", "Asset_Class": "Equity", "Weight_Pct": 25.0},
        {"Security_Ticker": "SEC_B", "Sector": "Tech", "Country": "US", "Asset_Class": "Equity", "Weight_Pct": 20.0},
        {"Security_Ticker": "SEC_C", "Sector": "Finance", "Country": "India", "Asset_Class": "Equity", "Weight_Pct": 15.0},
        {"Security_Ticker": "SEC_D", "Sector": "Govt", "Country": "US", "Asset_Class": "Government Bonds", "Weight_Pct": 40.0}
    ])
    conc = calculate_concentration_metrics(holdings_data)
    assert conc["top_1_weight_pct"] == 40.0
    assert conc["alert_code"] == "RED" # Top position > 20%
    assert conc["largest_sector"]["name"] == "Tech"
