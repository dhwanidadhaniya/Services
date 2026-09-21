"""
Risk Analytics Module
Implements institutional risk analytics:
- Annualized Volatility
- Sharpe Ratio (with configurable risk-free rate)
- Sortino Ratio (downside deviation)
- Historical Value-at-Risk (95% 1-day and 10-day)
- Maximum Drawdown & Drawdown Series
- Portfolio Beta vs Benchmark
"""

import numpy as np
import pandas as pd
from typing import List, Union, Tuple, Dict

def calculate_annualized_volatility(returns: Union[List[float], pd.Series, np.ndarray]) -> float:
    """
    Annualized Volatility (Sample Standard Deviation).
    Formula: sqrt(12) * Sample_StdDev(Monthly_Returns)
    """
    r_arr = np.array(returns, dtype=float)
    r_clean = r_arr[~np.isnan(r_arr)]
    if len(r_clean) < 2:
        return 0.0
    monthly_std = np.std(r_clean, ddof=1)
    return float(monthly_std * np.sqrt(12.0))

def calculate_sharpe_ratio(
    annualized_return: float,
    annualized_volatility: float,
    risk_free_rate: float = 0.045
) -> float:
    """
    Sharpe Ratio = (Annualized Return - Risk Free Rate) / Annualized Volatility
    Measures excess return earned per unit of total risk.
    """
    if annualized_volatility <= 0.0001:
        return 0.0
    return float((annualized_return - risk_free_rate) / annualized_volatility)

def calculate_downside_deviation(
    returns: Union[List[float], pd.Series, np.ndarray],
    risk_free_rate: float = 0.045
) -> float:
    """
    Annualized Downside Deviation (Semi-deviation below hurdle rate).
    Hurdle = monthly risk-free rate (rf / 12).
    """
    r_arr = np.array(returns, dtype=float)
    r_clean = r_arr[~np.isnan(r_arr)]
    if len(r_clean) < 2:
        return 0.0
    monthly_rf = risk_free_rate / 12.0
    downside_diffs = np.minimum(0.0, r_clean - monthly_rf)
    downside_variance = np.sum(downside_diffs ** 2) / (len(r_clean) - 1)
    monthly_downside_std = np.sqrt(downside_variance)
    return float(monthly_downside_std * np.sqrt(12.0))

def calculate_sortino_ratio(
    annualized_return: float,
    returns: Union[List[float], pd.Series, np.ndarray],
    risk_free_rate: float = 0.045
) -> float:
    """
    Sortino Ratio = (Annualized Return - Risk Free Rate) / Downside Volatility
    Differentiates harmful volatility from beneficial upside volatility.
    """
    downside_vol = calculate_downside_deviation(returns, risk_free_rate)
    if downside_vol <= 0.0001:
        return 0.0
    return float((annualized_return - risk_free_rate) / downside_vol)

def calculate_historical_var(
    returns: Union[List[float], pd.Series, np.ndarray],
    portfolio_value_m: float,
    confidence: float = 0.95,
    horizon_days: int = 1
) -> Dict[str, float]:
    """
    Historical Value-at-Risk (VaR) at specified confidence level (e.g. 95%).
    Calculates 1-day and 10-day estimated loss bounds based on historical empirical quantiles.
    
    Limitation Note: VaR only describes the minimum loss threshold at a confidence interval;
    it does not describe tail distribution severity beyond that point (Expected Shortfall).
    """
    r_arr = np.array(returns, dtype=float)
    r_clean = r_arr[~np.isnan(r_arr)]
    if len(r_clean) < 5:
        return {"var_pct": 0.0, "var_1d_usd_m": 0.0, "var_10d_usd_m": 0.0}
    
    # 5th percentile monthly return (for 95% confidence)
    alpha = 1.0 - confidence
    monthly_var_pct = float(-np.percentile(r_clean, alpha * 100))
    
    # Scale from monthly (approx 21 trading days) to 1-day and 10-day via square root of time
    var_1d_pct = max(0.0, monthly_var_pct / np.sqrt(21.0))
    var_10d_pct = var_1d_pct * np.sqrt(horizon_days if horizon_days > 1 else 10.0)
    
    var_1d_usd = round(portfolio_value_m * var_1d_pct, 4)
    var_10d_usd = round(portfolio_value_m * var_10d_pct, 4)
    
    return {
        "var_1d_pct": round(var_1d_pct * 100, 2),
        "var_10d_pct": round(var_10d_pct * 100, 2),
        "var_1d_usd_m": var_1d_usd,
        "var_10d_usd_m": var_10d_usd
    }

def calculate_max_drawdown(nav_series: Union[List[float], pd.Series, np.ndarray]) -> Tuple[float, List[float]]:
    """
    Calculates Maximum Drawdown (MDD) and complete underwater drawdown percentage series.
    Drawdown_t = (NAV_t - Peak_t) / Peak_t
    MDD = min(Drawdown_t)
    """
    nav_arr = np.array(nav_series, dtype=float)
    if len(nav_arr) == 0:
        return 0.0, []
    
    peaks = np.maximum.accumulate(nav_arr)
    # Avoid division by zero
    peaks[peaks == 0] = 1e-9
    drawdowns = (nav_arr - peaks) / peaks
    mdd = float(np.min(drawdowns))
    return float(mdd), [round(float(d) * 100, 2) for d in drawdowns]

def calculate_beta(
    portfolio_returns: Union[List[float], pd.Series],
    benchmark_returns: Union[List[float], pd.Series]
) -> float:
    """
    Portfolio Beta = Cov(R_p, R_b) / Var(R_b)
    Measures sensitivity of portfolio returns to market movements.
    """
    p_arr = np.array(portfolio_returns, dtype=float)
    b_arr = np.array(benchmark_returns, dtype=float)
    
    if len(p_arr) < 2 or len(p_arr) != len(b_arr):
        return 1.0
    
    b_var = np.var(b_arr, ddof=1)
    if b_var <= 1e-8:
        return 1.0
    
    cov = np.cov(p_arr, b_arr)[0][1]
    return float(cov / b_var)
