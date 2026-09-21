/**
 * Frontend API Service Adapter
 * Communicates with FastAPI Backend (/api/*) with error resilience.
 */

const API_BASE = '/api';

export async function fetchKPIs(filters = {}) {
  const query = new URLSearchParams(cleanParams(filters)).toString();
  const res = await fetch(`${API_BASE}/kpis?${query}`);
  if (!res.ok) throw new Error('Failed to fetch KPIs');
  return res.json();
}

export async function fetchClients(filters = {}) {
  const query = new URLSearchParams(cleanParams(filters)).toString();
  const res = await fetch(`${API_BASE}/clients?${query}`);
  if (!res.ok) throw new Error('Failed to fetch clients');
  return res.json();
}

export async function fetchClientDetail(clientId) {
  const res = await fetch(`${API_BASE}/clients/${clientId}`);
  if (!res.ok) throw new Error(`Failed to fetch client ${clientId}`);
  return res.json();
}

export async function fetchPortfolios(filters = {}) {
  const query = new URLSearchParams(cleanParams(filters)).toString();
  const res = await fetch(`${API_BASE}/portfolios?${query}`);
  if (!res.ok) throw new Error('Failed to fetch portfolios');
  return res.json();
}

export async function fetchPortfolioDetail(portfolioId) {
  const res = await fetch(`${API_BASE}/portfolios/${portfolioId}`);
  if (!res.ok) throw new Error(`Failed to fetch portfolio ${portfolioId}`);
  return res.json();
}

export async function fetchPerformance(filters = {}) {
  const query = new URLSearchParams(cleanParams(filters)).toString();
  const res = await fetch(`${API_BASE}/performance?${query}`);
  if (!res.ok) throw new Error('Failed to fetch performance');
  return res.json();
}

export async function fetchRiskAnalytics() {
  const res = await fetch(`${API_BASE}/risk`);
  if (!res.ok) throw new Error('Failed to fetch risk analytics');
  return res.json();
}

export async function fetchLiquidityAnalytics() {
  const res = await fetch(`${API_BASE}/liquidity`);
  if (!res.ok) throw new Error('Failed to fetch liquidity analytics');
  return res.json();
}

export async function fetchTransactions(params = {}) {
  const query = new URLSearchParams(cleanParams(params)).toString();
  const res = await fetch(`${API_BASE}/transactions?${query}`);
  if (!res.ok) throw new Error('Failed to fetch transactions');
  return res.json();
}

export async function fetchExceptions() {
  const res = await fetch(`${API_BASE}/exceptions`);
  if (!res.ok) throw new Error('Failed to fetch exceptions');
  return res.json();
}

export async function fetchOpportunities() {
  const res = await fetch(`${API_BASE}/opportunities`);
  if (!res.ok) throw new Error('Failed to fetch opportunities');
  return res.json();
}

export async function fetchDataQuality() {
  const res = await fetch(`${API_BASE}/data-quality`);
  if (!res.ok) throw new Error('Failed to fetch data quality audit');
  return res.json();
}

export async function fetchAskDataQuestions() {
  const res = await fetch(`${API_BASE}/ask-data/questions`);
  if (!res.ok) throw new Error('Failed to fetch query questions');
  return res.json();
}

export async function fetchAskDataAnswer(queryKey) {
  const res = await fetch(`${API_BASE}/ask-data/answer/${queryKey}`);
  if (!res.ok) throw new Error('Failed to resolve data question');
  return res.json();
}

function cleanParams(obj) {
  const cleaned = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined && v !== null && v !== '' && v !== 'ALL') {
      cleaned[k] = v;
    }
  }
  return cleaned;
}
