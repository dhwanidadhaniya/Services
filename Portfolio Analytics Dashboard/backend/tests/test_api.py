"""
FastAPI Endpoint Integration Tests
"""

import pytest
from starlette.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_root_and_health():
    res = client.get("/")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "online"
    assert data["synthetic_data"]["clients"] == 25

    res_h = client.get("/health")
    assert res_h.status_code == 200
    assert res_h.json()["status"] == "healthy"

def test_get_kpis():
    res = client.get("/api/kpis")
    assert res.status_code == 200
    data = res.json()
    assert data["total_aum_usd_m"] > 0
    assert data["total_clients"] == 25
    assert "portfolio_annualized_return_pct" in data

def test_get_clients():
    res = client.get("/api/clients")
    assert res.status_code == 200
    clients = res.json()
    assert len(clients) == 25
    assert clients[0]["Client_ID"] == "CLT-1001"
    assert "Health_Score" in clients[0]

def test_get_client_detail():
    res = client.get("/api/clients/CLT-1005") # Atlas Sovereign Fund
    assert res.status_code == 200
    data = res.json()
    assert data["client_info"]["Client_Name"] == "Atlas Sovereign Fund"
    assert "opportunities" in data
    assert "service_matrix" in data

def test_get_portfolios():
    res = client.get("/api/portfolios")
    assert res.status_code == 200
    portfolios = res.json()
    assert len(portfolios) > 0

def test_get_portfolio_detail():
    res = client.get("/api/portfolios/P-101")
    assert res.status_code == 200
    data = res.json()
    assert "metrics" in data
    assert "time_series" in data

def test_get_transactions_and_exceptions():
    res_t = client.get("/api/transactions?limit=20")
    assert res_t.status_code == 200
    assert len(res_t.json()["records"]) == 20

    res_e = client.get("/api/exceptions")
    assert res_e.status_code == 200
    assert res_e.json()["total_exceptions"] > 0

def test_ask_the_data():
    res_q = client.get("/api/ask-data/questions")
    assert res_q.status_code == 200
    assert len(res_q.json()) == 6

    res_a = client.get("/api/ask-data/answer/highest_cash_ratio")
    assert res_a.status_code == 200
    assert "Atlas" in res_a.json()["title"] or "Highest Cash Ratio" in res_a.json()["title"]
