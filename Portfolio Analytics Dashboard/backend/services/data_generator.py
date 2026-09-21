"""
Synthetic Institutional Financial Services Data Generator
Generates realistic data for:
- 25 Institutional Clients
- 65+ Portfolio Accounts & Position Holdings
- 5,000+ Transaction Records (2021-2026)
- 60 Months of Historical Monthly NAVs & Cash Flows
- 5 Global Benchmarks (NIFTY 50, S&P 500, MSCI World, Global Agg Bond, Crisil Liquid)

All entities and figures are synthetic/fictional for educational and portfolio presentation.
"""

import os
import random
import datetime
import numpy as np
import pandas as pd

# Set deterministic seed for reproducibility
np.random.seed(42)
random.seed(42)

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")
os.makedirs(DATA_DIR, exist_ok=True)

# -------------------------------------------------------------
# 1. CLIENTS DATASET (25 Institutional Clients)
# -------------------------------------------------------------
CLIENT_NAMES = [
    ("CLT-1001", "Northstar Pension Fund", "Pension Fund", "North America", "United States", "USD", "Conservative", "Custody", "Liquidity Management", 6200.0, "Active", "2016-03-15", "Sarah Jenkins"),
    ("CLT-1002", "Meridian Asset Management", "Asset Manager", "Europe", "United Kingdom", "GBP", "Growth", "Fund Administration", "FX Services", 4850.0, "Active", "2018-06-20", "Alistair Crawford"),
    ("CLT-1003", "Apex Insurance Group", "Insurance Company", "North America", "United States", "USD", "Conservative", "Collateral Management", "Custody", 7400.0, "Active", "2015-11-10", "Michael Chang"),
    ("CLT-1004", "Horizon University Endowment", "Endowment", "North America", "United States", "USD", "Growth", "Performance Analytics", "Custody", 1950.0, "Active", "2019-01-14", "Emily Watson"),
    ("CLT-1005", "Atlas Sovereign Fund", "Sovereign Fund", "Middle East", "UAE", "USD", "Moderate", "Cash Management", "Trade Finance", 12500.0, "Active", "2017-09-01", "Tariq Al-Mansoor"),
    ("CLT-1006", "BlueRiver Capital", "Asset Manager", "Asia-Pacific", "Singapore", "SGD", "Aggressive", "Custody", "FX Services", 3100.0, "Active", "2020-04-12", "Li Wei Tan"),
    ("CLT-1007", "Sterling Retirement Trust", "Pension Fund", "Europe", "United Kingdom", "GBP", "Conservative", "Custody", "Fund Administration", 5300.0, "Active", "2016-08-25", "Alistair Crawford"),
    ("CLT-1008", "Nova Family Office", "Family Office", "Europe", "Switzerland", "EUR", "Growth", "Cash Management", "Performance Analytics", 850.0, "Active", "2021-02-18", "Elena Rossi"),
    ("CLT-1009", "Summit Foundation", "Foundation", "North America", "United States", "USD", "Moderate", "Custody", "Cash Management", 1200.0, "Active", "2018-10-05", "Michael Chang"),
    ("CLT-1010", "Orion Investment Partners", "Asset Manager", "North America", "United States", "USD", "Aggressive", "Fund Administration", "Collateral Management", 3800.0, "Active", "2019-07-22", "Sarah Jenkins"),
    ("CLT-1011", "Bharat Infrastructure Trust", "Pension Fund", "Asia-Pacific", "India", "INR", "Moderate", "Custody", "Cash Management", 4200.0, "Active", "2017-12-01", "Rajesh Sharma"),
    ("CLT-1012", "Pacific Rim Life Insurance", "Insurance Company", "Asia-Pacific", "Japan", "JPY", "Conservative", "Collateral Management", "Custody", 8900.0, "Active", "2015-05-30", "Kenji Sato"),
    ("CLT-1013", "Tokyo Global Reinsurance", "Insurance Company", "Asia-Pacific", "Japan", "JPY", "Conservative", "Trade Finance", "Collateral Management", 6100.0, "Active", "2016-10-14", "Kenji Sato"),
    ("CLT-1014", "Rhine Corporate Treasury", "Corporate Treasury", "Europe", "Germany", "EUR", "Conservative", "Cash Management", "FX Services", 2800.0, "Active", "2020-09-15", "Elena Rossi"),
    ("CLT-1015", "Nordic Municipal Pension", "Pension Fund", "Europe", "Sweden", "EUR", "Conservative", "Custody", "Performance Analytics", 3400.0, "Active", "2018-04-03", "Alistair Crawford"),
    ("CLT-1016", "Vanguard Heritage Trust", "Endowment", "North America", "United States", "USD", "Moderate", "Performance Analytics", "Fund Administration", 1450.0, "Active", "2019-11-20", "Emily Watson"),
    ("CLT-1017", "Ganges Commercial Treasury", "Corporate Treasury", "Asia-Pacific", "India", "INR", "Moderate", "Cash Management", "Trade Finance", 2200.0, "Active", "2021-06-10", "Rajesh Sharma"),
    ("CLT-1018", "Southern Cross Superannuation", "Pension Fund", "Asia-Pacific", "Australia", "USD", "Moderate", "Custody", "Liquidity Management", 5700.0, "Active", "2017-01-28", "Li Wei Tan"),
    ("CLT-1019", "Helvetia Private Wealth", "Family Office", "Europe", "Switzerland", "EUR", "Growth", "Fund Administration", "FX Services", 950.0, "Active", "2022-01-15", "Elena Rossi"),
    ("CLT-1020", "Mumbai Growth Equities Fund", "Asset Manager", "Asia-Pacific", "India", "INR", "Aggressive", "Custody", "Fund Administration", 1800.0, "Active", "2020-11-05", "Rajesh Sharma"),
    ("CLT-1021", "Oasis National Reserve", "Sovereign Fund", "Middle East", "Saudi Arabia", "USD", "Conservative", "Cash Management", "Custody", 11200.0, "Active", "2016-04-18", "Tariq Al-Mansoor"),
    ("CLT-1022", "Emerald Medical Foundation", "Foundation", "Europe", "Ireland", "EUR", "Moderate", "Custody", "Cash Management", 720.0, "Active", "2021-08-22", "Michael Chang"),
    ("CLT-1023", "Silicon Valley Tech Treasury", "Corporate Treasury", "North America", "United States", "USD", "Growth", "Liquidity Management", "FX Services", 3500.0, "Active", "2019-05-12", "Sarah Jenkins"),
    ("CLT-1024", "Kyoto Endowment Fund", "Endowment", "Asia-Pacific", "Japan", "JPY", "Moderate", "Performance Analytics", "Custody", 1600.0, "Active", "2020-02-28", "Kenji Sato"),
    ("CLT-1025", "Equator Multi-Asset Partners", "Asset Manager", "Asia-Pacific", "Singapore", "SGD", "Growth", "Fund Administration", "Collateral Management", 2650.0, "Watchlist", "2022-05-19", "Li Wei Tan")
]

ALL_SERVICES = [
    "Cash Management", "Trade Finance", "Custody", "Fund Administration",
    "Collateral Management", "FX Services", "Liquidity Management", "Performance Analytics"
]

def generate_clients():
    records = []
    for c in CLIENT_NAMES:
        cid, name, ctype, region, country, base_ccy, risk, pri_serv, sec_serv, aum_m, status, start_date, rm = c
        
        # Determine tenure
        start_dt = datetime.datetime.strptime(start_date, "%Y-%m-%d")
        tenure_years = round((datetime.datetime(2026, 2, 28) - start_dt).days / 365.25, 1)
        
        # Cash balance: Realistic institutional cash balance (3% - 16% of AUM)
        if cid in ["CLT-1005", "CLT-1023"]: # Atlas Sovereign Fund and SV Tech Treasury have elevated cash
            cash_pct = random.uniform(0.13, 0.16)
        elif cid in ["CLT-1008", "CLT-1014"]:
            cash_pct = random.uniform(0.09, 0.12)
        else:
            cash_pct = random.uniform(0.035, 0.075)
            
        cash_balance = round(aum_m * cash_pct, 2)
        
        # Annual revenue earned from client (bps of AUM + transaction fee share)
        # Typically 4 to 12 bps for institutional custody/cash/admin
        bps_rate = random.uniform(0.0005, 0.00095)
        revenue_m = round(aum_m * bps_rate + random.uniform(0.1, 0.6), 3)
        
        # Account count
        if aum_m > 6000:
            num_accounts = random.randint(3, 5)
        elif aum_m > 2000:
            num_accounts = random.randint(2, 4)
        else:
            num_accounts = random.randint(1, 3)
            
        # Transaction volume YTD (Annualized $M)
        turnover_mult = random.uniform(0.8, 2.8)
        txn_vol_m = round(aum_m * turnover_mult, 1)
        
        # Services matrix (Used vs Not Used)
        used_services = [pri_serv, sec_serv]
        potential_extra = [s for s in ALL_SERVICES if s not in used_services]
        num_extra = random.randint(1, 3)
        extra_used = random.sample(potential_extra, num_extra)
        all_active_services = list(set(used_services + extra_used))
        
        services_str = ";".join(all_active_services)
        
        records.append({
            "Client_ID": cid,
            "Client_Name": name,
            "Client_Type": ctype,
            "Region": region,
            "Country": country,
            "Base_Currency": base_ccy,
            "AUM_USD_M": aum_m,
            "Cash_Balance_USD_M": cash_balance,
            "Cash_Ratio_Pct": round(cash_balance / aum_m * 100, 2),
            "Annual_Revenue_USD_M": revenue_m,
            "Revenue_Bps_AUM": round((revenue_m / aum_m) * 10000, 1),
            "Transaction_Volume_USD_M": txn_vol_m,
            "Number_of_Accounts": num_accounts,
            "Relationship_Start_Date": start_date,
            "Client_Tenure_Years": tenure_years,
            "Risk_Profile": risk,
            "Primary_Service": pri_serv,
            "Secondary_Service": sec_serv,
            "Active_Services": services_str,
            "Service_Count": len(all_active_services),
            "Relationship_Manager": rm,
            "Client_Status": status
        })
    
    df = pd.DataFrame(records)
    df.to_csv(os.path.join(DATA_DIR, "clients.csv"), index=False)
    print(f"Generated {len(df)} clients -> data/clients.csv")
    return df

# -------------------------------------------------------------
# 2. PORTFOLIOS & HOLDINGS DATASET (65+ Portfolios)
# -------------------------------------------------------------
SECURITIES_MASTER = [
    # US Equities
    ("AAPL", "Apple Inc.", "Equity", "Technology", "United States", "USD", "S&P 500", 1),
    ("MSFT", "Microsoft Corp.", "Equity", "Technology", "United States", "USD", "S&P 500", 1),
    ("NVDA", "NVIDIA Corp.", "Equity", "Technology", "United States", "USD", "S&P 500", 1),
    ("GOOGL", "Alphabet Inc.", "Equity", "Communication", "United States", "USD", "S&P 500", 1),
    ("AMZN", "Amazon.com Inc.", "Equity", "Consumer Discretionary", "United States", "USD", "S&P 500", 1),
    ("JPM", "JPMorgan Chase & Co.", "Equity", "Financials", "United States", "USD", "S&P 500", 1),
    ("UNH", "UnitedHealth Group", "Equity", "Healthcare", "United States", "USD", "S&P 500", 1),
    ("XOM", "Exxon Mobil Corp.", "Equity", "Energy", "United States", "USD", "S&P 500", 1),
    # Indian Equities
    ("RELIANCE_IN", "Reliance Industries Ltd.", "Equity", "Energy", "India", "INR", "NIFTY 50", 1),
    ("HDFCBANK_IN", "HDFC Bank Ltd.", "Equity", "Financials", "India", "INR", "NIFTY 50", 1),
    ("INFY_IN", "Infosys Ltd.", "Equity", "Technology", "India", "INR", "NIFTY 50", 1),
    ("TCS_IN", "Tata Consultancy Services", "Equity", "Technology", "India", "INR", "NIFTY 50", 1),
    ("ICICIBANK_IN", "ICICI Bank Ltd.", "Equity", "Financials", "India", "INR", "NIFTY 50", 1),
    ("LT_IN", "Larsen & Toubro Ltd.", "Equity", "Industrials", "India", "INR", "NIFTY 50", 1),
    ("BHARTIARTL_IN", "Bharti Airtel Ltd.", "Equity", "Communication", "India", "INR", "NIFTY 50", 1),
    # European / UK Equities
    ("AZN_LN", "AstraZeneca PLC", "Equity", "Healthcare", "United Kingdom", "GBP", "MSCI World", 1),
    ("SHEL_LN", "Shell PLC", "Equity", "Energy", "United Kingdom", "GBP", "MSCI World", 1),
    ("ASML_NA", "ASML Holding NV", "Equity", "Technology", "Netherlands", "EUR", "MSCI World", 1),
    ("SAP_GY", "SAP SE", "Equity", "Technology", "Germany", "EUR", "MSCI World", 1),
    ("NOVN_SW", "Novartis AG", "Equity", "Healthcare", "Switzerland", "CHF", "MSCI World", 1),
    # Asian Equities
    ("DBS_SP", "DBS Group Holdings", "Equity", "Financials", "Singapore", "SGD", "MSCI World", 1),
    ("7203_JP", "Toyota Motor Corp.", "Equity", "Consumer Discretionary", "Japan", "JPY", "MSCI World", 1),
    ("6758_JP", "Sony Group Corp.", "Equity", "Consumer Discretionary", "Japan", "JPY", "MSCI World", 1),
    # Fixed Income (Sovereign & Corporate)
    ("US_10Y_UST", "US Treasury 10-Yr Benchmark Note", "Government Bonds", "Sovereign Debt", "United States", "USD", "Bloomberg Global Aggregate", 1),
    ("US_5Y_UST", "US Treasury 5-Yr Benchmark Note", "Government Bonds", "Sovereign Debt", "United States", "USD", "Bloomberg Global Aggregate", 1),
    ("IND_10Y_GSEC", "India Sovereign G-Sec 7.18% 2033", "Government Bonds", "Sovereign Debt", "India", "INR", "Bloomberg Global Aggregate", 1),
    ("UK_10Y_GILT", "UK Gilt 3.75% 2033", "Government Bonds", "Sovereign Debt", "United Kingdom", "GBP", "Bloomberg Global Aggregate", 1),
    ("GER_10Y_BUND", "Germany Bund 2.60% 2033", "Government Bonds", "Sovereign Debt", "Germany", "EUR", "Bloomberg Global Aggregate", 1),
    ("JGB_10Y", "Japan Government Bond 10-Yr 0.8%", "Government Bonds", "Sovereign Debt", "Japan", "JPY", "Bloomberg Global Aggregate", 1),
    ("CORP_IG_USD", "US Investment Grade Corporate Bond Fund", "Corporate Bonds", "Corporate Credit", "United States", "USD", "Bloomberg Global Aggregate", 2),
    ("CORP_IG_EUR", "Euro High Grade Corporate Bond Note", "Corporate Bonds", "Corporate Credit", "Europe", "EUR", "Bloomberg Global Aggregate", 2),
    ("CORP_HY_USD", "US High Yield Corporate Credit Note", "Corporate Bonds", "Corporate Credit", "United States", "USD", "Bloomberg Global Aggregate", 3),
    # Cash & Money Market
    ("USD_TREAS_MMF", "Institutional USD Treasury Money Market Fund", "Money Market", "Cash Equivalents", "United States", "USD", "Crisil Liquid / MMF", 1),
    ("INR_OVERNIGHT_CASH", "Institutional INR Overnight Liquid Fund", "Money Market", "Cash Equivalents", "India", "INR", "Crisil Liquid / MMF", 1),
    ("EUR_LIQUIDITY_FUND", "EUR Institutional Liquidity Master Fund", "Money Market", "Cash Equivalents", "Europe", "EUR", "Crisil Liquid / MMF", 1),
    ("OPERATING_CASH", "Operational Custody Cash Balance", "Cash", "Cash Equivalents", "Global", "USD", "Crisil Liquid / MMF", 1),
    # Alternatives & REITs
    ("GLD_ETF", "SPDR Gold Shares Institutional Trust", "ETF", "Commodities", "United States", "USD", "MSCI World", 1),
    ("PLD_REIT", "Prologis Global Logistics REIT", "REIT", "Real Estate", "United States", "USD", "MSCI World", 2),
    ("INFRA_GLOBAL_TRUST", "Global Infrastructure Core Income Note", "Alternatives", "Infrastructure", "Global", "USD", "MSCI World", 3)
]

def generate_portfolios(clients_df):
    portfolio_rows = []
    holdings_rows = []
    
    p_id_counter = 101
    
    for _, client in clients_df.iterrows():
        cid = client["Client_ID"]
        cname = client["Client_Name"]
        aum = client["AUM_USD_M"]
        risk = client["Risk_Profile"]
        base_ccy = client["Base_Currency"]
        num_accs = client["Number_of_Accounts"]
        
        acc_weights = np.random.dirichlet(np.ones(num_accs))
        
        strategy_names = [
            "Core Global Multi-Asset Account",
            "Sovereign Fixed Income & Liquidity Account",
            "Active Equity Alpha Strategy Account",
            "Strategic Collateral & Yield Account",
            "Tactical Overlay & Treasury Account"
        ]
        
        for acc_idx in range(num_accs):
            pid = f"P-{p_id_counter}"
            p_id_counter += 1
            
            p_aum = round(aum * acc_weights[acc_idx], 2)
            p_strat = strategy_names[acc_idx % len(strategy_names)]
            
            if "Equity" in p_strat:
                if client["Country"] == "India":
                    benchmark = "NIFTY 50"
                elif client["Country"] == "United States":
                    benchmark = "S&P 500"
                else:
                    benchmark = "MSCI World"
            elif "Fixed Income" in p_strat or "Collateral" in p_strat:
                benchmark = "Bloomberg Global Aggregate"
            elif "Liquidity" in p_strat or "Treasury" in p_strat:
                benchmark = "Crisil Liquid / MMF"
            else:
                benchmark = "MSCI World" if risk in ["Growth", "Aggressive"] else "Bloomberg Global Aggregate"
                
            num_holdings = random.randint(6, 12)
            sampled_secs = random.sample(SECURITIES_MASTER, num_holdings)
            
            has_cash = any(s[2] in ["Cash", "Money Market"] for s in sampled_secs)
            if not has_cash:
                sampled_secs.append(SECURITIES_MASTER[32])
            
            h_weights = np.random.dirichlet(np.ones(len(sampled_secs)))
            
            # Specifically create a concentration breach on P-104 (24.5%) for demonstration
            if pid == "P-104":
                h_weights = h_weights / h_weights.sum() * 0.755
                h_weights[0] = 0.245
                
            h_weights = np.sort(h_weights)[::-1]
            
            p_holdings_val = 0.0
            p_unrealized_pnl = 0.0
            p_cost_basis = 0.0
            
            for h_idx, sec in enumerate(sampled_secs):
                ticker, sname, aclass, sector, country, ccy, bmark, liq_score = sec
                w = float(h_weights[h_idx])
                pos_mkt_val = round(p_aum * w, 3)
                
                if aclass in ["Cash", "Money Market"]:
                    cur_price = 100.0
                    pnl_mult = random.uniform(1.002, 1.02)
                elif aclass in ["Government Bonds", "Corporate Bonds"]:
                    cur_price = round(random.uniform(92.0, 105.0), 2)
                    pnl_mult = random.uniform(0.94, 1.08)
                else:
                    cur_price = round(random.uniform(50.0, 450.0), 2)
                    pnl_mult = random.uniform(0.82, 1.38)
                    
                cost_price = round(cur_price / pnl_mult, 2)
                qty = round((pos_mkt_val * 1_000_000) / cur_price, 0)
                cost_basis = round((qty * cost_price) / 1_000_000, 3)
                unrealized_pnl = round(pos_mkt_val - cost_basis, 3)
                realized_pnl = round(unrealized_pnl * random.uniform(0.1, 0.4), 3)
                
                duration = round(random.uniform(3.5, 8.2), 1) if "Bonds" in aclass else 0.0
                credit_rating = random.choice(["AAA", "AA+", "AA", "A", "BBB+"]) if "Bonds" in aclass else ("Sovereign" if aclass == "Government Bonds" else "N/A")
                
                holdings_rows.append({
                    "Portfolio_ID": pid,
                    "Client_ID": cid,
                    "Security_Ticker": ticker,
                    "Security_Name": sname,
                    "Asset_Class": aclass,
                    "Sector": sector,
                    "Country": country,
                    "Currency": ccy,
                    "Quantity": qty,
                    "Purchase_Price": cost_price,
                    "Current_Price": cur_price,
                    "Market_Value_USD_M": pos_mkt_val,
                    "Cost_Basis_USD_M": cost_basis,
                    "Unrealized_PnL_USD_M": unrealized_pnl,
                    "Realized_PnL_USD_M": realized_pnl,
                    "Weight_Pct": round(w * 100, 2),
                    "Benchmark": benchmark,
                    "Duration_Years": duration,
                    "Credit_Rating": credit_rating,
                    "Liquidity_Score": liq_score
                })
                
                p_holdings_val += pos_mkt_val
                p_cost_basis += cost_basis
                p_unrealized_pnl += unrealized_pnl
                
            portfolio_rows.append({
                "Portfolio_ID": pid,
                "Client_ID": cid,
                "Client_Name": cname,
                "Portfolio_Name": p_strat,
                "Base_Currency": base_ccy,
                "Total_Market_Value_USD_M": round(p_holdings_val, 2),
                "Cost_Basis_USD_M": round(p_cost_basis, 2),
                "Unrealized_PnL_USD_M": round(p_unrealized_pnl, 2),
                "Benchmark": benchmark,
                "Number_of_Holdings": len(sampled_secs),
                "Top_Holding_Weight_Pct": round(float(h_weights[0]) * 100, 2),
                "Top_5_Holdings_Weight_Pct": round(float(h_weights[:5].sum()) * 100, 2)
            })

    df_portfolios = pd.DataFrame(portfolio_rows)
    df_holdings = pd.DataFrame(holdings_rows)
    
    df_portfolios.to_csv(os.path.join(DATA_DIR, "portfolios.csv"), index=False)
    df_holdings.to_csv(os.path.join(DATA_DIR, "holdings.csv"), index=False)
    print(f"Generated {len(df_portfolios)} portfolios and {len(df_holdings)} holdings positions.")
    return df_portfolios, df_holdings

# -------------------------------------------------------------
# 3. MONTHLY NAV & BENCHMARK TIME SERIES (60 Months)
# -------------------------------------------------------------
BENCHMARK_PROFILES = {
    "S&P 500": {"ann_ret": 0.115, "ann_vol": 0.16},
    "NIFTY 50": {"ann_ret": 0.138, "ann_vol": 0.15},
    "MSCI World": {"ann_ret": 0.098, "ann_vol": 0.145},
    "Bloomberg Global Aggregate": {"ann_ret": 0.038, "ann_vol": 0.065},
    "Crisil Liquid / MMF": {"ann_ret": 0.058, "ann_vol": 0.012}
}

def generate_monthly_time_series(portfolios_df):
    dates = pd.date_range(start="2021-01-31", end="2026-02-28", freq="ME")
    n_months = len(dates)
    
    bmark_records = []
    bmark_returns_dict = {}
    
    for bname, params in BENCHMARK_PROFILES.items():
        m_mean = params["ann_ret"] / 12.0
        m_vol = params["ann_vol"] / np.sqrt(12.0)
        
        monthly_rets = np.random.normal(m_mean, m_vol, n_months)
        for idx, dt in enumerate(dates):
            if dt.year == 2022:
                monthly_rets[idx] -= 0.015
        
        bmark_returns_dict[bname] = monthly_rets
        
        level = 1000.0
        for idx, dt in enumerate(dates):
            ret = float(monthly_rets[idx])
            level = level * (1 + ret)
            bmark_records.append({
                "Date": dt.strftime("%Y-%m-%d"),
                "Benchmark_Name": bname,
                "Monthly_Return": round(ret, 5),
                "Index_Level": round(level, 2)
            })
            
    df_bmarks = pd.DataFrame(bmark_records)
    df_bmarks.to_csv(os.path.join(DATA_DIR, "benchmarks.csv"), index=False)
    print(f"Generated {len(df_bmarks)} monthly benchmark records.")
    
    nav_records = []
    
    for _, p in portfolios_df.iterrows():
        pid = p["Portfolio_ID"]
        cid = p["Client_ID"]
        cur_val = p["Total_Market_Value_USD_M"]
        bname = p["Benchmark"]
        
        bmark_rets = bmark_returns_dict.get(bname, bmark_returns_dict["MSCI World"])
        
        if pid in ["P-101", "P-105", "P-112", "P-120"]:
            alpha_annual = random.uniform(0.02, 0.045)
        elif pid in ["P-104", "P-110", "P-118", "P-125"]:
            alpha_annual = random.uniform(-0.04, -0.015)
        else:
            alpha_annual = random.uniform(-0.01, 0.02)
            
        alpha_monthly = alpha_annual / 12.0
        te_noise = random.uniform(0.005, 0.015)
        
        p_monthly_rets = []
        for idx in range(n_months):
            b_ret = bmark_rets[idx]
            noise = np.random.normal(0, te_noise)
            p_ret = b_ret + alpha_monthly + noise
            p_monthly_rets.append(p_ret)
            
        nav_series = [100.0]
        for r in p_monthly_rets:
            nav_series.append(nav_series[-1] * (1 + r))
            
        scale_factor = cur_val / nav_series[-1]
        scaled_navs = [round(v * scale_factor, 3) for v in nav_series[1:]]
        
        for idx, dt in enumerate(dates):
            ret = float(p_monthly_rets[idx])
            nav_val = scaled_navs[idx]
            
            if random.random() < 0.12:
                flow = round(random.choice([-1, 1]) * nav_val * random.uniform(0.02, 0.08), 2)
            else:
                flow = 0.0
                
            nav_records.append({
                "Date": dt.strftime("%Y-%m-%d"),
                "Portfolio_ID": pid,
                "Client_ID": cid,
                "Ending_NAV_USD_M": nav_val,
                "Monthly_Return": round(ret, 5),
                "Benchmark_Monthly_Return": round(float(bmark_rets[idx]), 5),
                "Net_Cash_Flow_USD_M": flow,
                "Benchmark": bname
            })
            
    df_navs = pd.DataFrame(nav_records)
    df_navs.to_csv(os.path.join(DATA_DIR, "monthly_nav.csv"), index=False)
    print(f"Generated {len(df_navs)} monthly NAV records.")
    return df_bmarks, df_navs

# -------------------------------------------------------------
# 4. TRANSACTIONS DATASET (5,000+ Records 2021-2026)
# -------------------------------------------------------------
TXN_TYPES = ["BUY", "SELL", "DIVIDEND", "INTEREST", "FEE", "TRANSFER", "DEPOSIT", "WITHDRAWAL"]
TXN_WEIGHTS = [0.38, 0.32, 0.10, 0.08, 0.05, 0.03, 0.02, 0.02]

def generate_transactions(portfolios_df, holdings_df):
    txn_records = []
    
    start_dt = datetime.date(2021, 1, 1)
    end_dt = datetime.date(2026, 2, 25)
    total_days = (end_dt - start_dt).days
    
    n_txns = 5250
    p_to_c = dict(zip(portfolios_df["Portfolio_ID"], portfolios_df["Client_ID"]))
    p_ids = list(portfolios_df["Portfolio_ID"])
    
    for i in range(1, n_txns + 1):
        txn_id = f"TXN-{2021 + (i % 5)}{i:05d}"
        rand_days = random.randint(0, total_days)
        txn_date = start_dt + datetime.timedelta(days=rand_days)
        if txn_date.weekday() >= 5:
            txn_date += datetime.timedelta(days=(7 - txn_date.weekday()))
            
        pid = random.choice(p_ids)
        cid = p_to_c[pid]
        ttype = random.choices(TXN_TYPES, weights=TXN_WEIGHTS)[0]
        
        sec = random.choice(SECURITIES_MASTER)
        ticker, sname, aclass, sector, country, ccy, bmark, liq_score = sec
        
        if ttype in ["BUY", "SELL"]:
            qty = random.choice([500, 1000, 2500, 5000, 10000, 25000, 50000])
            price = round(random.uniform(40.0, 350.0), 2) if aclass == "Equity" else round(random.uniform(95.0, 103.0), 2)
            gross = round((qty * price) / 1_000_000, 4)
            fee_bps = random.uniform(0.00015, 0.0005)
            fees = round(gross * fee_bps, 6)
            net = round(gross + fees, 4) if ttype == "BUY" else round(gross - fees, 4)
        elif ttype in ["DIVIDEND", "INTEREST"]:
            qty = 0
            price = 0.0
            gross = round(random.uniform(0.015, 0.250), 4)
            fees = round(gross * 0.001, 6)
            net = round(gross - fees, 4)
        elif ttype == "FEE":
            qty = 0
            price = 0.0
            gross = round(random.uniform(0.005, 0.045), 4)
            fees = gross
            net = -gross
        else:
            qty = 0
            price = 1.0
            gross = round(random.uniform(0.200, 3.500), 4)
            fees = 0.0001
            net = gross if ttype == "DEPOSIT" else -gross
            
        fx_rates = {"USD": 1.0, "INR": 86.5, "GBP": 0.79, "EUR": 0.92, "SGD": 1.34, "JPY": 152.0, "CHF": 0.88}
        fx_rate = fx_rates.get(ccy, 1.0)
        
        settle_days = 2 if aclass in ["Equity", "Corporate Bonds"] else 1
        settle_date = txn_date + datetime.timedelta(days=settle_days)
        if settle_date.weekday() >= 5:
            settle_date += datetime.timedelta(days=2)
            
        rand_status = random.random()
        if rand_status < 0.012:
            status = "FAILED"
        elif rand_status < 0.035:
            status = "PENDING"
        else:
            status = "SETTLED"
            
        if i == 88:
            status = "FAILED"
        elif i == 142:
            fees = -0.002
            
        txn_records.append({
            "Transaction_ID": txn_id,
            "Date": txn_date.strftime("%Y-%m-%d"),
            "Settlement_Date": settle_date.strftime("%Y-%m-%d"),
            "Client_ID": cid,
            "Portfolio_ID": pid,
            "Security_Ticker": ticker,
            "Security_Name": sname,
            "Asset_Class": aclass,
            "Transaction_Type": ttype,
            "Quantity": qty,
            "Price": price,
            "Gross_Value_USD_M": gross,
            "Fees_USD_M": fees,
            "Net_Value_USD_M": net,
            "Currency": ccy,
            "FX_Rate_to_USD": fx_rate,
            "Settlement_Status": status
        })
        
    df_txns = pd.DataFrame(txn_records)
    df_txns = df_txns.sort_values("Date").reset_index(drop=True)
    df_txns.to_csv(os.path.join(DATA_DIR, "transactions.csv"), index=False)
    print(f"Generated {len(df_txns)} institutional transactions -> data/transactions.csv")
    return df_txns

def main():
    print("Starting synthetic data generation pipeline...")
    df_clients = generate_clients()
    df_portfolios, df_holdings = generate_portfolios(df_clients)
    df_bmarks, df_navs = generate_monthly_time_series(df_portfolios)
    df_txns = generate_transactions(df_portfolios, df_holdings)
    print("Data generation complete.")

if __name__ == "__main__":
    main()
