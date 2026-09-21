# Institutional Data Dictionary

This document details every table, attribute, data type, calculation source, and business meaning across the institutional financial services dataset.

---

## 1. Table: `clients.csv`

| Field | Data Type | Example | Calculation / Source | Business Meaning & Context |
| :--- | :--- | :--- | :--- | :--- |
| `Client_ID` | String | `CLT-1001` | Unique primary key | Unique identifier for legal institutional entity. |
| `Client_Name` | String | `Northstar Pension Fund` | Synthetic master | Registered legal name of institutional client. |
| `Client_Type` | String | `Pension Fund` | Classification | Institutional profile (Pension, Sovereign, Insurance, Endowment, Family Office). |
| `Region` | String | `North America` | Geography | Management region overseeing relationship. |
| `Country` | String | `United States` | Domicile | Country jurisdiction of the client headquarters. |
| `Base_Currency` | String | `USD` | ISO Currency Code | Primary accounting and reporting currency. |
| `AUM_USD_M` | Float | `6200.0` | Sum of account NAVs | **Assets Under Management**: Total market value of assets administered/custodied. |
| `Cash_Balance_USD_M`| Float | `410.5` | Sum of cash holdings | Total uninvested custody cash and money market liquidity. |
| `Cash_Ratio_Pct` | Float | `6.62` | `(Cash / AUM) * 100` | Percentage of total assets held in uninvested cash. |
| `Annual_Revenue_USD_M`| Float| `4.15` | Bps fee capture + txn share | Annual relationship fee revenue earned by the institution. |
| `Revenue_Bps_AUM` | Float | `6.7` | `(Revenue / AUM) * 10,000` | Effective fee capture rate in basis points. |
| `Transaction_Volume_USD_M`| Float| `9800.0`| Sum of gross trade flow | Total annual gross value of securities and cash traded. |
| `Number_of_Accounts`| Integer | `4` | Count of accounts | Number of segregated custody accounts. |
| `Client_Tenure_Years`| Float| `9.9` | As of Feb 2026 | Duration of commercial relationship. |
| `Risk_Profile` | String | `Conservative` | KYC Mandate | Risk appetite mandate (Conservative, Moderate, Growth, Aggressive). |
| `Primary_Service` | String | `Custody` | Core Contract | Anchor mandated institutional service. |
| `Secondary_Service`| String| `Liquidity Management` | Add-on Mandate | Secondary operational service line. |
| `Active_Services` | String | `Custody;Cash;FX` | Delimited List | Semicolon-delimited list of active service mandates. |
| `Service_Count` | Integer | `3` | Count | Total count of active Citi Services product lines. |
| `Relationship_Manager`| String| `Sarah Jenkins` | Coverage Team | Assigned coverage banker / institutional analyst. |
| `Client_Status` | String | `Active` | Governance | Account status (Active, Strategic Review, Watchlist). |

---

## 2. Table: `portfolios.csv` & `holdings.csv`

| Field | Data Type | Example | Business Meaning & Context |
| :--- | :--- | :--- | :--- |
| `Portfolio_ID` | String | `P-101` | Unique account identifier. |
| `Security_Ticker` | String | `NVDA` | Market symbol identifier across global equities and bonds. |
| `Security_Name` | String | `NVIDIA Corp.` | Full legal name of issuer. |
| `Asset_Class` | String | `Equity` | Asset categorization (Equity, Govt Bonds, Corp Bonds, Cash, ETF, REIT). |
| `Sector` | String | `Technology` | Industry classification sector. |
| `Market_Value_USD_M`| Float | `84.50` | `Quantity * Current_Price`. Current market valuation. |
| `Cost_Basis_USD_M` | Float | `62.10` | `Quantity * Purchase_Price`. Historical acquisition cost. |
| `Unrealized_PnL_USD_M`| Float| `+22.40` | `Market Value - Cost Basis`. Paper gain/loss. |
| `Weight_Pct` | Float | `8.45` | Position weight as percentage of portfolio market value. |
| `Benchmark` | String | `S&P 500` | Designated performance hurdle index. |
| `Duration_Years` | Float | `6.4` | Effective interest rate sensitivity for fixed income assets. |
| `Credit_Rating` | String | `AAA` | Standard & Poor's / Moody's credit quality rating. |

---

## 3. Table: `transactions.csv`

| Field | Data Type | Example | Business Meaning & Context |
| :--- | :--- | :--- | :--- |
| `Transaction_ID` | String | `TXN-20230142` | Unique transaction execution identifier. |
| `Date` | Date | `2023-04-18` | Trade execution date. |
| `Settlement_Date` | Date | `2023-04-20` | Value date when cash and securities are officially exchanged (T+1/T+2). |
| `Transaction_Type` | String | `BUY` | Type: BUY, SELL, DIVIDEND, INTEREST, FEE, TRANSFER, DEPOSIT, WITHDRAWAL. |
| `Gross_Value_USD_M`| Float | `1.4500` | `Quantity * Price`. Total principal value traded. |
| `Fees_USD_M` | Float | `0.0004` | Brokerage, clearing, and custody execution fees deducted. |
| `Net_Value_USD_M` | Float | `1.4504` | `Gross + Fees` (for BUY) or `Gross - Fees` (for SELL). |
| `Settlement_Status`| String | `SETTLED` | `SETTLED`, `PENDING`, or `FAILED` (reconciliation break). |
