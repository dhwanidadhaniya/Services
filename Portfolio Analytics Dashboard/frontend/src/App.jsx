import React, { useState } from 'react';
import { FilterProvider } from './context/FilterContext';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import FilterBar from './components/common/FilterBar';

import LandingPage from './pages/LandingPage';
import ExecutiveDashboard from './pages/ExecutiveDashboard';
import ClientsListPage from './pages/ClientsListPage';
import Client360Page from './pages/Client360Page';
import PortfoliosListPage from './pages/PortfoliosListPage';
import PortfolioDetailPage from './pages/PortfolioDetailPage';
import RiskLiquidityPage from './pages/RiskLiquidityPage';
import TransactionAnalyticsPage from './pages/TransactionAnalyticsPage';
import OpportunitiesPage from './pages/OpportunitiesPage';
import DataQualityPage from './pages/DataQualityPage';
import ReportGeneratorPage from './pages/ReportGeneratorPage';
import MethodologyGlossaryPage from './pages/MethodologyGlossaryPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing');
  const [selectedClientId, setSelectedClientId] = useState('CLT-1005');
  const [selectedPortfolioId, setSelectedPortfolioId] = useState('P-101');

  const handleSelectClient = (clientId) => {
    setSelectedClientId(clientId);
    setActiveTab('client-360');
  };

  const handleSelectPortfolio = (portfolioId) => {
    setSelectedPortfolioId(portfolioId);
    setActiveTab('portfolio-detail');
  };

  return (
    <FilterProvider>
      <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
        {/* Main Sidebar Navigation */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Institutional Header */}
          <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Reactive Filter Bar (Shown on analytics views) */}
          {activeTab !== 'landing' && activeTab !== 'methodology' && (
            <FilterBar />
          )}

          {/* Page Routing */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {activeTab === 'landing' && (
              <LandingPage
                onOpenAnalytics={() => setActiveTab('dashboard')}
                onOpenTab={setActiveTab}
              />
            )}

            {activeTab === 'dashboard' && (
              <ExecutiveDashboard onSelectClient={handleSelectClient} />
            )}

            {activeTab === 'clients' && (
              <ClientsListPage onSelectClient={handleSelectClient} />
            )}

            {activeTab === 'client-360' && (
              <Client360Page
                selectedClientId={selectedClientId}
                onSelectPortfolio={handleSelectPortfolio}
              />
            )}

            {activeTab === 'portfolios' && (
              <PortfoliosListPage onSelectPortfolio={handleSelectPortfolio} />
            )}

            {activeTab === 'portfolio-detail' && (
              <PortfolioDetailPage selectedPortfolioId={selectedPortfolioId} />
            )}

            {activeTab === 'risk-liquidity' && (
              <RiskLiquidityPage />
            )}

            {activeTab === 'transactions' && (
              <TransactionAnalyticsPage />
            )}

            {activeTab === 'opportunities' && (
              <OpportunitiesPage onSelectClient={handleSelectClient} />
            )}

            {activeTab === 'data-quality' && (
              <DataQualityPage />
            )}

            {activeTab === 'reports' && (
              <ReportGeneratorPage selectedClientId={selectedClientId} />
            )}

            {activeTab === 'methodology' && (
              <MethodologyGlossaryPage />
            )}
          </main>
        </div>
      </div>
    </FilterProvider>
  );
}
