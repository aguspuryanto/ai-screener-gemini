// src/lib/api.ts
import { StockData, CandleData } from '@/types/stock';

const API_URL = 'https://pasardana.id/api/StockSearchResult/GetAll?pageBegin=0&pageLength=1000&sortField=Code&sortOrder=ASC';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Simple in-memory cache
let cache: {
  data: StockData[];
  timestamp: number;
} | null = null;

// Rate limiting
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second between requests

async function fetchWithRateLimit<T>(url: string, options?: RequestInit): Promise<T> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  // Add delay if needed to respect rate limit
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
  }
  
  lastRequestTime = Date.now();
  
  const response = await fetch(url, {
    ...options,
    next: { revalidate: 300 }, // ISR: Revalidate every 5 minutes (300 seconds)
  });
  
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }
  
  return response.json();
}

export async function getStockList(forceRefresh = false): Promise<StockData[]> {
  try {
    const now = Date.now();
    
    // Return cached data if it's still valid and not forcing refresh
    if (cache && !forceRefresh && (now - cache.timestamp) < CACHE_DURATION) {
      console.log('Returning cached stock data');
      return cache.data;
    }
    
    console.log('Fetching fresh stock data from API');
    const data = await fetchWithRateLimit(API_URL);
    
    // Update cache
    const result = Array.isArray(data) ? data : (data?.['Result'] || []);
    cache = {
      data: result,
      timestamp: now
    };
    
    return result;
  } catch (error) {
    console.error("API Error:", error);
    // Return cached data if available, even if it's stale
    if (cache?.data) {
      console.warn('Using stale cache data due to API error');
      return cache.data;
    }
    return [];
  }
}

// --- HELPER FORMATTING ---

export const formatCurrency = (value: number) => 
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);

export const formatNumber = (value: number) => 
  new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(value);

export const formatPercent = (value: number) => 
  `${(value * 100).toFixed(2)}%`;

export const formatMarketCap = (value: number) => {
  if (value >= 1_000_000_000_000) return `${(value / 1_000_000_000_000).toFixed(2)} T`;
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)} M`;
  return value.toString();
};

// --- MOCK CHART GENERATOR (Hanya Visualisasi) ---
// Kita generate grafik mundur 30 hari dari harga 'Last' saat ini
export function generateMockHistory(lastPrice: number): CandleData[] {
  const data: CandleData[] = [];
  let currentPrice = lastPrice;
  const today = new Date();

  // Kita buat chart bergerak mundur agar 'Last' price-nya match
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const volatility = lastPrice * 0.03; 
    const change = (Math.random() - 0.5) * volatility;
    
    // Reverse logic karena kita loop mundur dari harga sekarang
    const close = currentPrice;
    const open = currentPrice - change; 
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;

    data.unshift({ // unshift biar urutan array dari lama ke baru
      date: date.toISOString().split('T')[0],
      open: Math.round(open),
      high: Math.round(high),
      low: Math.round(low),
      close: Math.round(close),
    });

    currentPrice = open; // Harga open hari ini jadi close hari kemarin
  }
  return data;
}