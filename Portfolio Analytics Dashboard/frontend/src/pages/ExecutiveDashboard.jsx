import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Users,
  TrendingUp,
  Award,
  Droplets,
  ArrowLeftRight,
  ShieldCheck,
  Activity,
  Layers
} from 'lucide-react';
import { useFilters } from '../context/FilterContext';
import {
  fetchKPIs,
  fetchClients,
  fetchPerformance,
  fetchRiskAnalytics,
  fetchLiquidityAnalytics,
  fetchOpportunities
} from '../services/api';

import MetricCard from '../components/common/MetricCard';
import PortfolioPulse from '../components/dashboard/PortfolioPulse';
import PerformanceSection from '../components/dashboard/PerformanceSection';
import PerformanceDrivers from '../components/dashboard/PerformanceDrivers';
import RiskSection from '../components/dashboard/RiskSection';
import ClientInsightsSection from '../components/dashboard/ClientInsightsSection';
import LiquiditySection from '../components/dashboard/LiquiditySection';
import OpportunitiesSection from '../components/dashboard/OpportunitiesSection';
import ClientSpotlight from '../components/dashboard/ClientSpotlight';
import AskTheData from '../components/dashboard/AskTheData';

export default function ExecutiveDashboard({ onSelectClient }) {
  const { filters } = useFilters();
  const [kpis, setKpis] = useState(null);
  const [clients, setClients] = useState([]);
  const [perfData, setPerfData] = useState(null);
  const [riskData, setRiskData] = useState(null);
  const [liqData, setLiqData] = useState(null);
  const [oppsData, setOppsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchKPIs(filters),
      fetchClients(filters),
      fetchPerformance(filters),
      fetchRiskAnalytics(),
      fetchLiquidityAnalytics(),
      fetchOpportunities()
    ])
      .then(([kpiRes, clientRes, perfRes, riskRes, liqRes, oppsRes]) => {
        setKpis(kpiRes);
        setClients(clientRes);
        setPerfData(perfRes);
        setRiskData(riskRes);
        setLiqData(liqRes);
        setOppsData(oppsRes?.opportunities || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading dashboard data:", err);
        setLoading(false);
      });
  }, [filters]);

  return (
    <div className="space-y-6">
      {/* Top Banner: Portfolio Pulse */}
      <PortfolioPulse kpis={kpis} />

      {/* Top KPI Cards Grid (8 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <MetricCard
          title="Total Institutional AUM"
          value={kpis ? `$${kpis.total_aum_usd_m.toLocaleString()}M` : "$104,820.0M"}
          previousValue="$99,450.0M"
          changePct={5.4}
          metricKey="AUM"
          icon={DollarSign}
          subtitle="Assets Under Custody / Admin"
        />

        <MetricCard
          title="Institutional Clients"
          value={kpis ? `${kpis.total_clients}` : "25"}
          previousValue="24"
          changePct={4.2}
          icon={Users}
          subtitle="Pensions, Endowments & Sovereigns"
        />

        <MetricCard
          title="Portfolio Return (TWR)"
          value={kpis ? `${kpis.portfolio_annualized_return_pct}%` : "10.82%"}
          previousValue="9.85%"
          changePct={9.8}
          metricKey="TWR"
          icon={TrendingUp}
          subtitle="Annualized Compound Rate"
        />

        <MetricCard
          title="Active Return (Alpha)"
          value={kpis ? `+${kpis.active_return_pct}%` : "+1.30%"}
          previousValue="+1.10%"
          changePct={18.2}
          metricKey="ACTIVE_RETURN"
          icon={Award}
          subtitle="Excess vs Benchmark Index"
        />

        <MetricCard
          title="Uninvested Cash / AUM"
          value={kpis ? `${kpis.cash_ratio_pct}%` : "6.42%"}
          previousValue="7.10%"
          changePct={-9.6}
          changeLabel="change in cash drag"
          metricKey="CASH_RATIO"
          icon={Droplets}
          subtitle="Uninvested Custody Cash"
          positiveIsGood={false}
        />

        <MetricCard
          title="Annual Servicing Revenue"
          value={kpis ? `$${kpis.total_revenue_usd_m}M` : "$74.85M"}
          previousValue="$69.20M"
          changePct={8.2}
          icon={DollarSign}
          subtitle="Relationship Fee Capture"
        />

        <MetricCard
          title="Transaction Volume (YTD)"
          value={kpis ? `$${kpis.transaction_volume_usd_m.toLocaleString()}M` : "$168,240M"}
          previousValue="$152,000M"
          changePct={10.7}
          icon={ArrowLeftRight}
          subtitle="Gross Trade Flow Executed"
        />

        <MetricCard
          title="Settlement Success Rate"
          value={kpis ? `${kpis.settlement_efficiency_pct}%` : "98.80%"}
          previousValue="98.10%"
          changePct={0.7}
          icon={ShieldCheck}
          subtitle="T+1 / T+2 Custody Reconciliation"
        />
      </div>

      {/* SECTION 1: Performance Attribution */}
      <PerformanceSection perfData={perfData} />

      {/* Performance Drivers + Client Spotlight in 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8">
          <PerformanceDrivers />
        </div>
        <div className="lg:col-span-4">
          <ClientSpotlight onSelectClient={onSelectClient} />
        </div>
      </div>

      {/* SECTION 2: Risk Analytics */}
      <RiskSection riskData={riskData} />

      {/* SECTION 3: Client Insights & Segmentation */}
      <ClientInsightsSection clients={clients} onSelectClient={onSelectClient} />

      {/* SECTION 4: Cash & Liquidity Management */}
      <LiquiditySection liquidityData={liqData} />

      {/* Ask The Data (Deterministic Assistant) */}
      <AskTheData />

      {/* SECTION 5: Institutional Opportunities */}
      <OpportunitiesSection opportunities={oppsData} onSelectClient={onSelectClient} />
    </div>
  );
}
