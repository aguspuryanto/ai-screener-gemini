// src/types/stock.ts

// Tipe data sesuai response API pasardana.id (perkiraan field umum)
export interface StockListItem {
  Code: string;
  Name: string;
  Board: string;
  Sector: string;
  LastPrice: number;
  Change: number;
  ChangePersentage: number; // Typo di API aslinya biasanya terjadi, sesuaikan jika perlu
  Volume: number;
}

// Tipe data Mock untuk Fundamental
export interface FundamentalData {
  code: string;
  peRatio: number;
  pbv: number;
  roe: number;
  eps: number;
  marketCap: string;
  dividendYield: number;
}// src/types/stock.ts

export interface StockData {
  Id: number;
  Name: string;
  Code: string;
  SectorName: string;
  SubSectorName: string;
  
  // Harga
  Last: number;
  PrevClosingPrice: number;
  AdjustedHighPrice: number;
  AdjustedLowPrice: number;
  Volume: number;
  Value: number;

  // Performa (dalam desimal, misal -0.012 = -1.2%)
  OneDay: number;
  OneWeek: number;
  OneMonth: number;
  ThreeMonth: number;
  SixMonth: number;
  OneYear: number;
  Ytd: number;

  // Fundamental
  Per: number; // Price Earning Ratio
  Pbr: number; // Price to Book Value (PBV)
  Roe: number; // Return on Equity
  Capitalization: number; // Market Cap
  BetaOneYear: number;
  
  LastDate: string;
}

// Kita tetap butuh Mock untuk Chart Historis karena API ini hanya snapshot (Current State)
export interface CandleData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}