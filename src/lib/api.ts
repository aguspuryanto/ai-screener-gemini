// src/lib/api.ts
import { StockData, CandleData } from '@/types/stock';

const API_URL = 'https://pasardana.id/api/StockSearchResult/GetAll?pageBegin=0&pageLength=1000&sortField=Code&sortOrder=ASC';

export async function getStockList(): Promise<StockData[]> {
  try {
    const res = await fetch(API_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch');
    
    // Pasardana returnnya langsung Array atau dibungkus, kita handle aman:
    const data = await res.json();
    return Array.isArray(data) ? data : (data['Result'] || []);
  } catch (error) {
    console.error("API Error:", error);
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