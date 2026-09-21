"""
Data Loader & In-Memory Repository
Provides fast cached queries and reactive filtering across clients, portfolios, holdings, NAVs, and transactions.
"""

import os
import pandas as pd
import numpy as np
from typing import Optional, Dict, List, Any

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")

class DataLoader:
    def __init__(self):
        self.clients_df = pd.DataFrame()
        self.portfolios_df = pd.DataFrame()
        self.holdings_df = pd.DataFrame()
        self.monthly_nav_df = pd.DataFrame()
        self.benchmarks_df = pd.DataFrame()
        self.transactions_df = pd.DataFrame()
        self.load_all()

    def load_all(self):
        c_path = os.path.join(DATA_DIR, "clients.csv")
        p_path = os.path.join(DATA_DIR, "portfolios.csv")
        h_path = os.path.join(DATA_DIR, "holdings.csv")
        n_path = os.path.join(DATA_DIR, "monthly_nav.csv")
        b_path = os.path.join(DATA_DIR, "benchmarks.csv")
        t_path = os.path.join(DATA_DIR, "transactions.csv")

        if os.path.exists(c_path):
            self.clients_df = pd.read_csv(c_path, keep_default_na=False)
        if os.path.exists(p_path):
            self.portfolios_df = pd.read_csv(p_path, keep_default_na=False)
        if os.path.exists(h_path):
            self.holdings_df = pd.read_csv(h_path, keep_default_na=False)
        if os.path.exists(n_path):
            self.monthly_nav_df = pd.read_csv(n_path, keep_default_na=False)
        if os.path.exists(b_path):
            self.benchmarks_df = pd.read_csv(b_path, keep_default_na=False)
        if os.path.exists(t_path):
            self.transactions_df = pd.read_csv(t_path, keep_default_na=False)

    def filter_data(
        self,
        client_id: Optional[str] = None,
        portfolio_id: Optional[str] = None,
        asset_class: Optional[str] = None,
        region: Optional[str] = None,
        country: Optional[str] = None,
        risk_profile: Optional[str] = None,
        benchmark: Optional[str] = None,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None
    ) -> Dict[str, pd.DataFrame]:
        c_df = self.clients_df.copy()
        p_df = self.portfolios_df.copy()
        h_df = self.holdings_df.copy()
        n_df = self.monthly_nav_df.copy()
        t_df = self.transactions_df.copy()

        # Filter Clients
        if client_id and client_id != "ALL":
            c_df = c_df[c_df["Client_ID"] == client_id]
        if region and region != "ALL":
            c_df = c_df[c_df["Region"] == region]
        if country and country != "ALL":
            c_df = c_df[c_df["Country"] == country]
        if risk_profile and risk_profile != "ALL":
            c_df = c_df[c_df["Risk_Profile"] == risk_profile]

        valid_client_ids = set(c_df["Client_ID"])

        # Filter Portfolios
        p_df = p_df[p_df["Client_ID"].isin(valid_client_ids)]
        if portfolio_id and portfolio_id != "ALL":
            p_df = p_df[p_df["Portfolio_ID"] == portfolio_id]
        if benchmark and benchmark != "ALL":
            p_df = p_df[p_df["Benchmark"] == benchmark]

        valid_portfolio_ids = set(p_df["Portfolio_ID"])

        # Filter Holdings
        h_df = h_df[h_df["Portfolio_ID"].isin(valid_portfolio_ids)]
        if asset_class and asset_class != "ALL":
            h_df = h_df[h_df["Asset_Class"] == asset_class]

        # Filter NAVs
        n_df = n_df[n_df["Portfolio_ID"].isin(valid_portfolio_ids)]
        if start_date:
            n_df = n_df[n_df["Date"] >= start_date]
        if end_date:
            n_df = n_df[n_df["Date"] <= end_date]

        # Filter Transactions
        t_df = t_df[t_df["Portfolio_ID"].isin(valid_portfolio_ids)]
        if asset_class and asset_class != "ALL":
            t_df = t_df[t_df["Asset_Class"] == asset_class]
        if start_date:
            t_df = t_df[t_df["Date"] >= start_date]
        if end_date:
            t_df = t_df[t_df["Date"] <= end_date]

        return {
            "clients": c_df,
            "portfolios": p_df,
            "holdings": h_df,
            "navs": n_df,
            "transactions": t_df
        }

# Global singleton loader
db = DataLoader()
