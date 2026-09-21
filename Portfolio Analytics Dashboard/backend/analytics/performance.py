"""
Performance Analytics Module
Implements standard institutional performance calculations:
- Time-Weighted Return (TWR)
- Annualized Returns
- Active Return
- Tracking Error
- Information Ratio
- Win Rate & Modified Dietz Cash Flow adjustments
"""

import numpy as np
import pandas as pd
from typing import List, Dict, Union, Tuple

def calculate_twr(returns: Union[List[float], pd.Series, np.ndarray]) -> float:
    """
    Calculates cumulative Time-Weighted Return (TWR) over a multi-period series.
    TWR = Product(1 + R_t) - 1
    Eliminates the distorting effect of external cash flows on performance.
    """
    if len(returns) == 0:
        return 0.0
    r_arr = np.array(returns, dtype=float)
    # Remove NaN values
    r_clean = r_arr[~np.isnan(r_arr)]
    if len(r_clean) == 0:
        return 0.0
    cum_growth = np.prod(1.0 + r_clean)
    return float(cum_growth - 1.0)

def calculate_annualized_return(cumulative_return: float, num_months: int) -> float:
    """
    Annualizes a cumulative return over a given number of months.
    Formula: (1 + CumReturn)^(12 / N) - 1
    """
    if num_months <= 0:
        return 0.0
    if cumulative_return <= -1.0:
        return -1.0
    ann_ret = (1.0 + cumulative_return) ** (12.0 / num_months) - 1.0
    return float(ann_ret)

def calculate_active_return(portfolio_return: float, benchmark_return: float) -> float:
    """
    Active Return = Portfolio Return - Benchmark Return
    Represents excess return (alpha) generated above the benchmark hurdle.
    """
    return float(portfolio_return - benchmark_return)

def calculate_tracking_error(
    portfolio_returns: Union[List[float], pd.Series],
    benchmark_returns: Union[List[float], pd.Series]
) -> float:
    """
    Tracking Error (TE): Annualized sample standard deviation of excess returns.
    Formula: sqrt(12 / (N - 1) * Sum((Active_t - Mean_Active)^2))
    Measures the consistency of active returns relative to the benchmark.
    """
    p_arr = np.array(portfolio_returns, dtype=float)
    b_arr = np.array(benchmark_returns, dtype=float)
    
    if len(p_arr) < 2 or len(p_arr) != len(b_arr):
        return 0.0
    
    excess_returns = p_arr - b_arr
    monthly_te = np.std(excess_returns, ddof=1)
    annualized_te = float(monthly_te * np.sqrt(12.0))
    return 0.0 if abs(annualized_te) < 1e-12 else annualized_te

def calculate_information_ratio(
    portfolio_returns: Union[List[float], pd.Series],
    benchmark_returns: Union[List[float], pd.Series]
) -> float:
    """
    Information Ratio (IR) = Annualized Active Return / Annualized Tracking Error
    Quantifies the efficiency of active risk taken to generate alpha.
    """
    te = calculate_tracking_error(portfolio_returns, benchmark_returns)
    if te <= 0.0001:
        return 0.0
    
    p_cum = calculate_twr(portfolio_returns)
    b_cum = calculate_twr(benchmark_returns)
    n_months = len(portfolio_returns)
    
    p_ann = calculate_annualized_return(p_cum, n_months)
    b_ann = calculate_annualized_return(b_cum, n_months)
    active_ann = p_ann - b_ann
    
    return float(active_ann / te)

def calculate_win_rate(
    portfolio_returns: Union[List[float], pd.Series],
    benchmark_returns: Union[List[float], pd.Series]
) -> float:
    """
    Win Rate = (Count of months where R_p >= R_b) / Total Months * 100%
    """
    p_arr = np.array(portfolio_returns, dtype=float)
    b_arr = np.array(benchmark_returns, dtype=float)
    if len(p_arr) == 0:
        return 0.0
    wins = np.sum(p_arr >= b_arr)
    return float((wins / len(p_arr)) * 100.0)

def calculate_cumulative_growth_series(returns: Union[List[float], pd.Series], base_val: float = 100.0) -> List[float]:
    """
    Generates index growth series indexed to base_val (default 100.0).
    """
    series = [base_val]
    for r in returns:
        series.append(series[-1] * (1.0 + float(r)))
    return series
