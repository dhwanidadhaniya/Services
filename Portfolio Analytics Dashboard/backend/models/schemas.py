"""
Pydantic Schemas for Financial Services Analytics API
Defines institutional data models with comprehensive docstrings and typed attributes.
"""

from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field

class ClientSummary(BaseModel):
    Client_ID: str = Field(..., description="Unique client identifier (e.g. CLT-1001)")
    Client_Name: str = Field(..., description="Institutional client legal entity name")
    Client_Type: str = Field(..., description="Institutional category (e.g. Pension Fund, Sovereign Fund)")
    Region: str = Field(..., description="Geographical management region")
    Country: str = Field(..., description="Jurisdiction country")
    Base_Currency: str = Field(..., description="Base reporting currency")
    AUM_USD_M: float = Field(..., description="Assets Under Management in millions USD")
    Cash_Balance_USD_M: float = Field(..., description="Uninvested cash held in custody in millions USD")
    Cash_Ratio_Pct: float = Field(..., description="Cash as a percentage of total AUM")
    Annual_Revenue_USD_M: float = Field(..., description="Annual relationship fee revenue in millions USD")
    Revenue_Bps_AUM: float = Field(..., description="Fee capture rate in basis points of AUM")
    Transaction_Volume_USD_M: float = Field(..., description="Annual gross transaction throughput in millions USD")
    Number_of_Accounts: int = Field(..., description="Number of segregated custody accounts")
    Client_Tenure_Years: float = Field(..., description="Tenure of institutional relationship in years")
    Risk_Profile: str = Field(..., description="Risk profile classification (Conservative, Moderate, Growth, Aggressive)")
    Primary_Service: str = Field(..., description="Core mandated institutional service")
    Secondary_Service: str = Field(..., description="Secondary institutional service")
    Service_Count: int = Field(..., description="Number of active services utilized")
    Relationship_Manager: str = Field(..., description="Assigned institutional relationship manager")
    Client_Status: str = Field(..., description="Relationship status (Active, Watchlist, Strategic Review)")
    Health_Score: Optional[float] = Field(None, description="Student-defined Client Health Score (0-100)")
    Segment: Optional[str] = Field(None, description="2D Segmentation category (Strategic, Core, Growth, Emerging, Needs Attention)")

class HoldingItem(BaseModel):
    Portfolio_ID: str
    Client_ID: str
    Security_Ticker: str
    Security_Name: str
    Asset_Class: str
    Sector: str
    Country: str
    Currency: str
    Quantity: float
    Purchase_Price: float
    Current_Price: float
    Market_Value_USD_M: float
    Cost_Basis_USD_M: float
    Unrealized_PnL_USD_M: float
    Realized_PnL_USD_M: float
    Weight_Pct: float
    Benchmark: str
    Duration_Years: float
    Credit_Rating: str
    Liquidity_Score: int

class PortfolioSummary(BaseModel):
    Portfolio_ID: str
    Client_ID: str
    Client_Name: str
    Portfolio_Name: str
    Base_Currency: str
    Total_Market_Value_USD_M: float
    Cost_Basis_USD_M: float
    Unrealized_PnL_USD_M: float
    Benchmark: str
    Number_of_Holdings: int
    Top_Holding_Weight_Pct: float
    Top_5_Holdings_Weight_Pct: float

class TransactionItem(BaseModel):
    Transaction_ID: str
    Date: str
    Settlement_Date: str
    Client_ID: str
    Portfolio_ID: str
    Security_Ticker: str
    Security_Name: str
    Asset_Class: str
    Transaction_Type: str
    Quantity: float
    Price: float
    Gross_Value_USD_M: float
    Fees_USD_M: float
    Net_Value_USD_M: float
    Currency: str
    FX_Rate_to_USD: float
    Settlement_Status: str

class ExecutiveKPISummary(BaseModel):
    total_aum_usd_m: float
    total_clients: int
    total_portfolios: int
    portfolio_annualized_return_pct: float
    benchmark_annualized_return_pct: float
    active_return_pct: float
    cash_ratio_pct: float
    total_revenue_usd_m: float
    transaction_volume_usd_m: float
    settlement_efficiency_pct: float
    avg_client_health_score: float

class ExceptionItem(BaseModel):
    exception_id: str
    category: str
    entity_type: str
    entity_id: str
    client_id: str
    severity: str
    title: str
    what: str
    why: str
    data_trigger: str

class OpportunityItem(BaseModel):
    client_id: str
    client_name: str
    category: str
    trigger_type: str
    observation: str
    potential_opportunity: str
    target_service: str
    priority: str
    estimated_rev_impact_usd_k: float
