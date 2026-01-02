// src/components/TechnicalAnalysis.tsx
import { StockData } from '@/types/stock';
import { formatCurrency, formatPercent } from '@/lib/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, BarChart, Bar, Cell } from 'recharts';
import { Activity } from 'lucide-react';

interface TechnicalAnalysisProps {
  stock: StockData;
}

export function TechnicalAnalysis({ stock }: TechnicalAnalysisProps) {
  // Mock technical indicators data
  const technicalIndicators = [
    { name: 'RSI (14)', value: 65, level: 'Overbought', color: 'text-rose-400' },
    { name: 'MACD', value: 1.2, level: 'Bullish', color: 'text-emerald-400' },
    { name: 'SMA 50', value: stock.Last * 0.97, level: 'Support', color: 'text-amber-400' },
    { name: 'SMA 200', value: stock.Last * 0.92, level: 'Support', color: 'text-amber-400' },
    { name: 'Volume (avg)', value: stock.Volume, level: 'Above Avg', color: 'text-blue-400' },
  ];

  // Generate mock price data with technical indicators
  const priceData = Array.from({ length: 30 }, (_, i) => {
    const basePrice = stock.Last * (1 + (Math.random() * 0.1 - 0.05));
    return {
      date: `D-${30 - i}`,
      price: basePrice,
      sma50: stock.Last * (0.95 + (i / 30) * 0.1),
      sma200: stock.Last * (0.9 + (i / 30) * 0.15),
      volume: stock.Volume * (0.5 + Math.random()),
    };
  });

  const getSignalColor = (value: number, high: number, low: number) => {
    const range = high - low;
    const position = (value - low) / range;
    if (position > 0.7) return 'text-rose-400';
    if (position < 0.3) return 'text-emerald-400';
    return 'text-amber-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-200">
          <Activity size={18} className="text-blue-400" /> Analisis Teknikal
        </h3>
        <div className="flex gap-2 text-xs">
          <span className="px-2 py-1 bg-slate-800 rounded">1M</span>
          <span className="px-2 py-1 bg-slate-800 rounded">3M</span>
          <span className="px-2 py-1 bg-slate-700 rounded border border-slate-600">1Y</span>
          <span className="px-2 py-1 bg-slate-800 rounded">5Y</span>
        </div>
      </div>

      {/* Price Chart */}
      <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={priceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
              <YAxis domain={['auto', 'auto']} stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }}
                formatter={(value: number) => [formatCurrency(value), 'Harga']}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorPrice)"
              />
              <Line
                type="monotone"
                dataKey="sma50"
                stroke="#f59e0b"
                dot={false}
                strokeWidth={1.5}
              />
              <Line
                type="monotone"
                dataKey="sma200"
                stroke="#ec4899"
                dot={false}
                strokeWidth={1.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-4 justify-center mt-2 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-blue-500"></div>
            <span>Harga</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-amber-500"></div>
            <span>SMA 50</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-pink-500"></div>
            <span>SMA 200</span>
          </div>
        </div>
      </div>

      {/* Technical Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {technicalIndicators.map((indicator, index) => (
          <div
            key={index}
            className="bg-slate-800/50 p-3 rounded-lg border border-slate-700"
          >
            <div className="text-xs text-slate-400 mb-1">{indicator.name}</div>
            <div className="text-lg font-bold text-white">
              {typeof indicator.value === 'number'
                ? indicator.value > 1000
                  ? (indicator.value / 1000).toFixed(1) + 'K'
                  : indicator.value.toFixed(2)
                : indicator.value}
            </div>
            <div className={`text-xs mt-1 ${indicator.color}`}>{indicator.level}</div>
          </div>
        ))}
      </div>

      {/* Volume Chart */}
      <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
        <h4 className="text-sm font-medium text-slate-300 mb-2">Volume Perdagangan</h4>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }}
                formatter={(value: number) => [value.toLocaleString(), 'Volume']}
              />
              <Bar dataKey="volume" radius={[2, 2, 0, 0]}>
                {priceData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.volume > stock.Volume ? '#3b82f6' : '#3b82f650'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trading Signals */}
      <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
        <h4 className="text-sm font-medium text-slate-300 mb-3">Sinyal Perdagangan</h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium">Moving Average Crossover</div>
              <div className="text-xs text-slate-400">SMA 50 vs SMA 200</div>
            </div>
            <span className="px-2 py-1 bg-emerald-900/50 text-emerald-400 text-xs rounded">
              Buy Signal
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium">RSI Divergence</div>
              <div className="text-xs text-slate-400">Momentum Indicator</div>
            </div>
            <span className="px-2 py-1 bg-rose-900/50 text-rose-400 text-xs rounded">
              Overbought
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium">Volume Spike</div>
              <div className="text-xs text-slate-400">30% above average</div>
            </div>
            <span className="px-2 py-1 bg-blue-900/50 text-blue-400 text-xs rounded">
              High Volume
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}