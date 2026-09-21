"""
Unit tests for Performance Analytics Module
"""

import pytest
import numpy as np
from backend.analytics.performance import (
    calculate_twr,
    calculate_annualized_return,
    calculate_active_return,
    calculate_tracking_error,
    calculate_information_ratio,
    calculate_win_rate
)

def test_calculate_twr_positive():
    # 3 periods: +10%, +5%, -2% -> (1.10 * 1.05 * 0.98) - 1 = 1.1319 - 1 = 0.1319
    returns = [0.10, 0.05, -0.02]
    twr = calculate_twr(returns)
    assert pytest.approx(twr, 0.0001) == 0.1319

def test_calculate_twr_empty():
    assert calculate_twr([]) == 0.0

def test_calculate_annualized_return():
    # 24 months (2 years) with cumulative 21% -> (1.21)^(12/24) - 1 = sqrt(1.21) - 1 = 10%
    ann = calculate_annualized_return(0.21, 24)
    assert pytest.approx(ann, 0.0001) == 0.10

def test_calculate_active_return():
    assert pytest.approx(calculate_active_return(0.12, 0.095), 0.0001) == 0.025

def test_calculate_tracking_error_and_ir():
    # Constant excess return has 0 tracking error
    p_rets = [0.02, 0.03, -0.01, 0.04]
    b_rets = [0.01, 0.02, -0.02, 0.03] # Constant +0.01 excess each month
    te = calculate_tracking_error(p_rets, b_rets)
    assert te == 0.0 # Standard deviation of constant excess is zero

    # Varying excess return
    p_rets2 = [0.03, 0.01, -0.02, 0.05, 0.02, -0.01]
    b_rets2 = [0.01, 0.02, -0.01, 0.02, 0.01, 0.00]
    te2 = calculate_tracking_error(p_rets2, b_rets2)
    assert te2 > 0.0
    ir = calculate_information_ratio(p_rets2, b_rets2)
    assert isinstance(ir, float)

def test_calculate_win_rate():
    p_rets = [0.05, 0.02, -0.01, 0.03]
    b_rets = [0.03, 0.04, -0.02, 0.01] # Months 1, 3, 4 win -> 3/4 = 75%
    win_rate = calculate_win_rate(p_rets, b_rets)
    assert win_rate == 75.0
