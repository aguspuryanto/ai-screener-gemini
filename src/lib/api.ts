// // src/lib/api.ts
// import { StockListItem, CandleData, FundamentalData } from '@/types/stock';

// const API_URL = 'https://pasardana.id/api/StockSearchResult/GetAll?pageBegin=0&pageLength=1000&sortField=Code&sortOrder=ASC';

// export async function getStockList(): Promise<StockListItem[]> {
//   try {
//     // Menambahkan { cache: 'no-store' } agar data selalu fresh saat refresh
//     const res = await fetch(API_URL, { cache: 'no-store' });
    
//     if (!res.ok) {
//       throw new Error('Failed to fetch stock data');
//     }

//     // Pasardana mungkin mengembalikan struktur { Result: [...] } atau array langsung.
//     // Kode di bawah menyesuaikan dengan asumsi return JSON langsung atau properti tertentu.
//     const data = await res.json();
//     return data || []; 
//   } catch (error) {
//     console.error("Error fetching stocks:", error);
//     return [];
//   }
// }

// // --- MOCK DATA GENERATORS (Karena API List tidak punya data detail) ---

// export function generateMockHistory(basePrice: number): CandleData[] {
//   const data: CandleData[] = [];
//   let currentPrice = basePrice;
//   const today = new Date();

//   for (let i = 30; i >= 0; i--) {
//     const date = new Date(today);
//     date.setDate(date.getDate() - i);
    
//     const volatility = basePrice * 0.02; // 2% pergerakan
//     const change = (Math.random() - 0.5) * volatility;
    
//     const open = currentPrice;
//     const close = currentPrice + change;
//     const high = Math.max(open, close) + Math.random() * volatility * 0.5;
//     const low = Math.min(open, close) - Math.random() * volatility * 0.5;

//     data.push({
//       date: date.toISOString().split('T')[0],
//       open: Math.round(open),
//       high: Math.round(high),
//       low: Math.round(low),
//       close: Math.round(close),
//     });

//     currentPrice = close;
//   }
//   return data;
// }

// export function generateMockFundamental(code: string, price: number): FundamentalData {
//   return {
//     code,
//     peRatio: parseFloat((Math.random() * 20 + 5).toFixed(2)), // Random PER 5-25x
//     pbv: parseFloat((Math.random() * 5 + 0.5).toFixed(2)),     // Random PBV 0.5-5x
//     roe: parseFloat((Math.random() * 25 + 5).toFixed(2)),      // Random ROE 5-30%
//     eps: Math.round(price / (Math.random() * 15 + 10)),
//     marketCap: (Math.random() * 500 + 1).toFixed(0) + " T",
//     dividendYield: parseFloat((Math.random() * 5).toFixed(2))
//   };
// }

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