// 'use client';

// import React, { useState, useMemo } from 'react';
// import { StockListItem, CandleData, FundamentalData } from '@/types/stock';
// import { generateMockHistory, generateMockFundamental } from '@/lib/api';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import { Search, TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';

// interface DashboardProps {
//   initialData: StockListItem[];
// }

// export default function Dashboard({ initialData }: DashboardProps) {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedStock, setSelectedStock] = useState<StockListItem | null>(null);

//   // Filter logika
//   const filteredStocks = useMemo(() => {
//     return initialData.filter((stock) =>
//       stock.Code.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       stock.Name.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   }, [initialData, searchQuery]);

//   // Generate data detail saat saham dipilih
//   const detailData = useMemo(() => {
//     if (!selectedStock) return null;
//     return {
//       history: generateMockHistory(selectedStock.LastPrice),
//       fundamental: generateMockFundamental(selectedStock.Code, selectedStock.LastPrice)
//     };
//   }, [selectedStock]);

//   return (
//     <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      
//       {/* SIDEBAR / LIST SAHAM */}
//       <div className="w-1/3 min-w-[300px] border-r border-slate-800 flex flex-col">
//         <div className="p-4 border-b border-slate-800 bg-slate-900">
//           <h1 className="text-xl font-bold mb-4 text-emerald-400">BEI ANALYZER</h1>
//           <div className="relative">
//             <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
//             <input
//               type="text"
//               placeholder="Cari Kode (misal: BBCA)"
//               className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
//         </div>

//         <div className="flex-1 overflow-y-auto">
//           {filteredStocks.map((stock) => (
//             <div
//               key={stock.Code}
//               onClick={() => setSelectedStock(stock)}
//               className={`p-4 border-b border-slate-800 cursor-pointer hover:bg-slate-900 transition-colors ${
//                 selectedStock?.Code === stock.Code ? 'bg-slate-800 border-l-4 border-l-emerald-500' : ''
//               }`}
//             >
//               <div className="flex justify-between items-center mb-1">
//                 <span className="font-bold text-lg">{stock.Code}</span>
//                 <span className="text-sm font-mono">{stock.LastPrice}</span>
//               </div>
//               <div className="flex justify-between items-center text-xs">
//                 <span className="text-slate-400 truncate w-32">{stock.Name}</span>
//                 <span className={stock.Change >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
//                   {stock.Change > 0 ? '+' : ''}{stock.Change} ({stock.ChangePersentage}%)
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* MAIN CONTENT / DETAIL VIEW */}
//       <div className="flex-1 flex flex-col overflow-y-auto bg-slate-950 p-6">
//         {selectedStock && detailData ? (
//           <div className="space-y-6">
            
//             {/* HEADER */}
//             <header className="flex justify-between items-end border-b border-slate-800 pb-4">
//               <div>
//                 <h2 className="text-3xl font-bold flex items-center gap-2">
//                   {selectedStock.Code} 
//                   <span className="text-base font-normal text-slate-400 bg-slate-900 px-2 py-1 rounded">{selectedStock.Board || 'Main Board'}</span>
//                 </h2>
//                 <p className="text-slate-400">{selectedStock.Name}</p>
//               </div>
//               <div className="text-right">
//                 <div className="text-2xl font-mono font-bold">Rp {selectedStock.LastPrice}</div>
//                 <div className={`flex items-center justify-end gap-1 ${selectedStock.Change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
//                   {selectedStock.Change >= 0 ? <TrendingUp size={16}/> : <TrendingDown size={16}/>}
//                   <span>{selectedStock.Change} ({selectedStock.ChangePersentage}%)</span>
//                 </div>
//               </div>
//             </header>

//             {/* TECHNICAL CHART */}
//             <section className="bg-slate-900 p-4 rounded-xl border border-slate-800">
//               <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                 <Activity size={18} className="text-blue-400"/> Analisis Teknikal (30 Hari Terakhir)
//               </h3>
//               <div className="h-[300px] w-full">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={detailData.history}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
//                     <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickFormatter={(val) => val.split('-')[2]} />
//                     <YAxis stroke="#94a3b8" fontSize={12} domain={['auto', 'auto']} />
//                     <Tooltip 
//                       contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
//                     />
//                     <Line type="monotone" dataKey="close" stroke="#10b981" strokeWidth={2} dot={false} />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </section>

//             {/* FUNDAMENTAL GRID */}
//             <section>
//               <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                 <DollarSign size={18} className="text-yellow-400"/> Analisis Fundamental (Estimasi)
//               </h3>
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                 <Card label="Market Cap" value={detailData.fundamental.marketCap} />
//                 <Card label="P/E Ratio" value={`${detailData.fundamental.peRatio}x`} 
//                   color={detailData.fundamental.peRatio < 15 ? 'text-emerald-400' : 'text-slate-200'} />
//                 <Card label="PBV" value={`${detailData.fundamental.pbv}x`} />
//                 <Card label="ROE" value={`${detailData.fundamental.roe}%`} 
//                   color={detailData.fundamental.roe > 15 ? 'text-emerald-400' : 'text-slate-200'}/>
//                 <Card label="EPS" value={`Rp ${detailData.fundamental.eps}`} />
//                 <Card label="Div. Yield" value={`${detailData.fundamental.dividendYield}%`} />
//               </div>
//             </section>

//           </div>
//         ) : (
//           <div className="h-full flex flex-col items-center justify-center text-slate-500">
//             <Activity size={64} className="mb-4 opacity-20" />
//             <p className="text-xl">Pilih saham di sebelah kiri untuk melihat analisis.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // Komponen Kecil untuk Card Fundamental
// function Card({ label, value, color = 'text-slate-100' }: { label: string, value: string | number, color?: string }) {
//   return (
//     <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
//       <div className="text-slate-500 text-sm mb-1">{label}</div>
//       <div className={`text-xl font-bold ${color}`}>{value}</div>
//     </div>
//   );
// }

// 'use client';

// import React, { useState, useMemo } from 'react';
// import { StockData } from '@/types/stock';
// import { generateMockHistory, formatCurrency, formatPercent, formatMarketCap, formatNumber } from '@/lib/api';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
// import { Search, TrendingUp, TrendingDown, Activity, PieChart, BarChart2 } from 'lucide-react';
// import clsx from 'clsx';

// interface DashboardProps {
//   initialData: StockData[];
// }

// export default function Dashboard({ initialData }: DashboardProps) {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedStock, setSelectedStock] = useState<StockData | null>(initialData[0] || null);

//   const filteredStocks = useMemo(() => {
//     const query = searchQuery.toLowerCase();
//     return initialData.filter((stock) =>
//       stock.Code.toLowerCase().includes(query) ||
//       stock.Name.toLowerCase().includes(query)
//     );
//   }, [initialData, searchQuery]);

//   // Generate chart data on fly saat stock berubah
//   const chartData = useMemo(() => {
//     if (!selectedStock) return [];
//     return generateMockHistory(selectedStock.Last);
//   }, [selectedStock]);

//   // Siapkan data untuk grafik performa (Bar Chart)
//   const performanceData = useMemo(() => {
//     if (!selectedStock) return [];
//     return [
//       { name: '1W', value: selectedStock.OneWeek },
//       { name: '1M', value: selectedStock.OneMonth },
//       { name: '3M', value: selectedStock.ThreeMonth },
//       { name: 'YTD', value: selectedStock.Ytd },
//       { name: '1Y', value: selectedStock.OneYear },
//     ];
//   }, [selectedStock]);

//   if (!initialData.length) return <div className="p-10 text-white">Loading data or API Error...</div>;

//   return (
//     <div className="flex h-screen bg-[#0f172a] text-slate-100 overflow-hidden font-sans">
      
//       {/* --- LEFT SIDEBAR (Stock List) --- */}
//       <div className="w-[320px] border-r border-slate-800 flex flex-col bg-[#1e293b]">
//         <div className="p-4 border-b border-slate-700">
//           <h1 className="text-xl font-bold mb-4 text-emerald-400 tracking-wider">PASARDANA <span className="text-white font-light">LIVE</span></h1>
//           <div className="relative">
//             <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
//             <input
//               type="text"
//               placeholder="Cari Kode (BBCA, TLKM)..."
//               className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-emerald-500 text-white"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
//         </div>

//         <div className="flex-1 overflow-y-auto custom-scrollbar">
//           {filteredStocks.map((stock) => (
//             <div
//               key={stock.Id}
//               onClick={() => setSelectedStock(stock)}
//               className={clsx(
//                 "p-3 border-b border-slate-800 cursor-pointer hover:bg-slate-700 transition-all",
//                 selectedStock?.Code === stock.Code ? "bg-slate-800 border-l-4 border-l-emerald-500" : ""
//               )}
//             >
//               <div className="flex justify-between items-center">
//                 <span className="font-bold text-base">{stock.Code}</span>
//                 <span className={clsx("text-sm font-medium", stock.OneDay >= 0 ? "text-emerald-400" : "text-rose-400")}>
//                   {formatCurrency(stock.Last)}
//                 </span>
//               </div>
//               <div className="flex justify-between items-center mt-1">
//                 <span className="text-xs text-slate-400 truncate w-32">{stock.Name}</span>
//                 <span className={clsx("text-xs", stock.OneDay >= 0 ? "text-emerald-400" : "text-rose-400")}>
//                   {stock.OneDay > 0 ? '+' : ''}{formatPercent(stock.OneDay)}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* --- RIGHT CONTENT (Detail) --- */}
//       <div className="flex-1 flex flex-col overflow-y-auto bg-[#0f172a] p-6 gap-6">
//         {selectedStock && (
//           <>
//             {/* HEADER INFO */}
//             <div className="flex justify-between items-start">
//               <div>
//                 <h2 className="text-4xl font-bold text-white mb-1">{selectedStock.Code}</h2>
//                 <p className="text-lg text-slate-400">{selectedStock.Name}</p>
//                 <div className="flex items-center gap-2 mt-2">
//                   <span className="bg-slate-800 text-xs px-2 py-1 rounded text-slate-300 border border-slate-700">{selectedStock.SectorName}</span>
//                   <span className="bg-slate-800 text-xs px-2 py-1 rounded text-slate-300 border border-slate-700">{selectedStock.SubSectorName}</span>
//                 </div>
//               </div>
//               <div className="text-right">
//                 <div className="text-4xl font-mono font-bold text-white">{formatCurrency(selectedStock.Last)}</div>
//                 <div className={clsx("flex items-center justify-end gap-2 text-lg mt-1", selectedStock.OneDay >= 0 ? 'text-emerald-400' : 'text-rose-400')}>
//                   {selectedStock.OneDay >= 0 ? <TrendingUp size={24}/> : <TrendingDown size={24}/>}
//                   <span>{formatPercent(selectedStock.OneDay)} (1D)</span>
//                 </div>
//                 <div className="text-slate-500 text-sm mt-1">Vol: {selectedStock.Volume.toLocaleString()}</div>
//               </div>
//             </div>

//             {/* CHART SECTION */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
//               {/* Technical Chart (Mocked Series based on Real Last Price) */}
//               <div className="lg:col-span-2 bg-[#1e293b] p-5 rounded-xl border border-slate-800 shadow-lg">
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-200">
//                     <Activity size={18} className="text-blue-400"/> Pergerakan Harga (30 Hari)
//                   </h3>
//                   <div className="flex gap-4 text-sm text-slate-400">
//                     <span>Hi: <b className="text-white">{selectedStock.AdjustedHighPrice}</b></span>
//                     <span>Lo: <b className="text-white">{selectedStock.AdjustedLowPrice}</b></span>
//                   </div>
//                 </div>
//                 <div className="h-[300px]">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <LineChart data={chartData}>
//                       <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
//                       <XAxis dataKey="date" hide />
//                       <YAxis domain={['auto', 'auto']} stroke="#64748b" fontSize={12} tickFormatter={(val) => val.toLocaleString()} />
//                       <Tooltip 
//                         contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
//                         formatter={(value: number | string | undefined) => [value ? value.toString() : 'N/A', 'Harga']}
//                       />
//                       <Line type="monotone" dataKey="close" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
//                     </LineChart>
//                   </ResponsiveContainer>
//                 </div>
//               </div>

//               {/* Performance Bar Chart (REAL DATA) */}
//               <div className="bg-[#1e293b] p-5 rounded-xl border border-slate-800 shadow-lg flex flex-col">
//                 <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-200">
//                   <BarChart2 size={18} className="text-purple-400"/> Tren Performa
//                 </h3>
//                 <div className="flex-1 min-h-[250px]">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <BarChart data={performanceData} layout="vertical" margin={{ left: 10 }}>
//                       <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} opacity={0.3}/>
//                       <XAxis type="number" hide />
//                       <YAxis dataKey="name" type="category" stroke="#94a3b8" width={30} tick={{fontSize: 12}} />
//                       <Tooltip 
//                         cursor={{fill: 'transparent'}}
//                         contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }}
//                         formatter={(val: number) => formatPercent(val)}
//                       />
//                       <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={30}>
//                         {performanceData.map((entry, index) => (
//                           <Cell key={`cell-${index}`} fill={entry.value >= 0 ? '#10b981' : '#f43f5e'} />
//                         ))}
//                       </Bar>
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>
//               </div>
//             </div>

//             {/* FUNDAMENTAL GRID (REAL DATA) */}
//             <div>
//               <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-200">
//                 <PieChart size={18} className="text-orange-400"/> Analisis Fundamental
//               </h3>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 <MetricCard 
//                   label="Market Cap" 
//                   value={formatMarketCap(selectedStock.Capitalization)} 
//                   sub="IDR"
//                 />
//                 <MetricCard 
//                   label="P/E Ratio (PER)" 
//                   value={selectedStock.Per ? `${formatNumber(selectedStock.Per)}x` : 'N/A'} 
//                   color={selectedStock.Per > 0 && selectedStock.Per < 15 ? 'text-emerald-400' : 'text-slate-100'}
//                 />
//                 <MetricCard 
//                   label="PBV (PBR)" 
//                   value={selectedStock.Pbr ? `${formatNumber(selectedStock.Pbr)}x` : 'N/A'}
//                   color={selectedStock.Pbr < 2 ? 'text-emerald-400' : 'text-slate-100'} 
//                 />
//                 <MetricCard 
//                   label="ROE" 
//                   value={selectedStock.Roe ? formatPercent(selectedStock.Roe) : 'N/A'} 
//                   color={selectedStock.Roe > 0.1 ? 'text-emerald-400' : 'text-yellow-400'}
//                 />
//                 <MetricCard 
//                   label="Beta (1Y)" 
//                   value={formatNumber(selectedStock.BetaOneYear)} 
//                   sub="Volatilitas"
//                 />
//                  <MetricCard 
//                   label="YTD Return" 
//                   value={formatPercent(selectedStock.Ytd)} 
//                   color={selectedStock.Ytd >= 0 ? 'text-emerald-400' : 'text-rose-400'}
//                 />
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// // Component Kecil
// function MetricCard({ label, value, sub, color = 'text-white' }: { label: string, value: string, sub?: string, color?: string }) {
//   return (
//     <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-800 flex flex-col justify-between hover:border-slate-600 transition-colors">
//       <span className="text-slate-400 text-sm">{label}</span>
//       <div className="mt-2">
//         <span className={`text-2xl font-bold font-mono ${color}`}>{value}</span>
//         {sub && <span className="text-xs text-slate-500 ml-2">{sub}</span>}
//       </div>
//     </div>
//   );
// }

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { StockData } from '@/types/stock';
import { generateMockHistory, formatCurrency, formatPercent, formatMarketCap, formatNumber } from '@/lib/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Search, TrendingUp, TrendingDown, Activity, PieChart, BarChart2, Star, ListFilter, LayoutGrid } from 'lucide-react';
import clsx from 'clsx';

interface DashboardProps {
  initialData: StockData[];
}

export default function Dashboard({ initialData }: DashboardProps) {
  // --- STATE ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStock, setSelectedStock] = useState<StockData | null>(initialData[0] || null);
  
  // State untuk Watchlist & Tab View
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'all' | 'watchlist'>('all');
  const [isClient, setIsClient] = useState(false); // Untuk mencegah hydration error

  // --- EFFECT: LOAD & SAVE LOCALSTORAGE ---
  
  useEffect(() => {
    // Menandakan bahwa kita sudah di browser (Client Side)
    setIsClient(true);
    
    // Load dari LocalStorage saat pertama kali mount
    const saved = localStorage.getItem('my-stock-watchlist');
    if (saved) {
      try {
        setWatchlist(JSON.parse(saved));
      } catch (e) {
        console.error("Gagal load watchlist", e);
      }
    }
  }, []);

  useEffect(() => {
    // Save ke LocalStorage setiap kali watchlist berubah (hanya jika sudah di client)
    if (isClient) {
      localStorage.setItem('my-stock-watchlist', JSON.stringify(watchlist));
    }
  }, [watchlist, isClient]);

  // --- LOGIC: TOGGLE WATCHLIST ---
  const toggleWatchlist = (code: string) => {
    setWatchlist((prev) => {
      if (prev.includes(code)) {
        return prev.filter((c) => c !== code); // Hapus
      } else {
        return [...prev, code]; // Tambah
      }
    });
  };

  const isFavorited = (code: string) => watchlist.includes(code);

  // --- LOGIC: FILTERING ---
  const filteredStocks = useMemo(() => {
    const query = searchQuery.toLowerCase();
    
    return initialData.filter((stock) => {
      // 1. Filter Search Text
      const matchesSearch = 
        stock.Code.toLowerCase().includes(query) ||
        stock.Name.toLowerCase().includes(query);
      
      // 2. Filter Tab (All vs Watchlist)
      const matchesMode = viewMode === 'all' ? true : watchlist.includes(stock.Code);

      return matchesSearch && matchesMode;
    });
  }, [initialData, searchQuery, viewMode, watchlist]);

  // --- LOGIC: CHART DATA ---
  const chartData = useMemo(() => {
    if (!selectedStock) return [];
    return generateMockHistory(selectedStock.Last);
  }, [selectedStock]);

  const performanceData = useMemo(() => {
    if (!selectedStock) return [];
    return [
      { name: '1W', value: selectedStock.OneWeek },
      { name: '1M', value: selectedStock.OneMonth },
      { name: '3M', value: selectedStock.ThreeMonth },
      { name: 'YTD', value: selectedStock.Ytd },
      { name: '1Y', value: selectedStock.OneYear },
    ];
  }, [selectedStock]);

  if (!initialData.length) return <div className="p-10 text-white">Loading data...</div>;

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-100 overflow-hidden font-sans">
      
      {/* --- LEFT SIDEBAR (Stock List) --- */}
      <div className="w-[340px] border-r border-slate-800 flex flex-col bg-[#1e293b]">
        
        {/* Header Sidebar */}
        <div className="p-4 border-b border-slate-700 space-y-4">
          <h1 className="text-xl font-bold text-emerald-400 tracking-wider">PASARDANA <span className="text-white font-light">LIVE</span></h1>
          
          {/* Tabs: All vs Watchlist */}
          <div className="flex bg-slate-900 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('all')}
              className={clsx(
                "flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-all",
                viewMode === 'all' ? "bg-slate-700 text-white shadow" : "text-slate-400 hover:text-slate-200"
              )}
            >
              <LayoutGrid size={14} /> Semua Saham
            </button>
            <button
              onClick={() => setViewMode('watchlist')}
              className={clsx(
                "flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-all",
                viewMode === 'watchlist' ? "bg-slate-700 text-white shadow" : "text-slate-400 hover:text-slate-200"
              )}
            >
              <Star size={14} className={viewMode === 'watchlist' ? "fill-yellow-400 text-yellow-400" : ""} /> Watchlist
              <span className="bg-slate-800 px-1.5 rounded-full text-[10px]">{watchlist.length}</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder={viewMode === 'watchlist' ? "Cari di watchlist..." : "Cari Kode (BBCA, ADRO)..."}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-emerald-500 text-white transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* List Items */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredStocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-slate-500 text-sm p-4 text-center">
              {viewMode === 'watchlist' ? (
                <>
                  <Star size={32} className="mb-2 opacity-20" />
                  <p>Watchlist kosong.</p>
                  <p className="text-xs mt-1">Klik bintang pada saham untuk menambahkannya.</p>
                </>
              ) : (
                <p>Tidak ada saham ditemukan.</p>
              )}
            </div>
          ) : (
            filteredStocks.map((stock) => (
              <div
                key={stock.Id}
                onClick={() => setSelectedStock(stock)}
                className={clsx(
                  "group p-3 border-b border-slate-800 cursor-pointer hover:bg-slate-700 transition-all relative pr-8", // pr-8 for star space
                  selectedStock?.Code === stock.Code ? "bg-slate-800 border-l-4 border-l-emerald-500" : ""
                )}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base">{stock.Code}</span>
                    {/* Mini Star indicator in list if favorited */}
                    {isFavorited(stock.Code) && <Star size={10} className="text-yellow-400 fill-yellow-400" />}
                  </div>
                  <span className={clsx("text-sm font-medium", stock.OneDay >= 0 ? "text-emerald-400" : "text-rose-400")}>
                    {formatCurrency(stock.Last)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-slate-400 truncate w-32">{stock.Name}</span>
                  <span className={clsx("text-xs", stock.OneDay >= 0 ? "text-emerald-400" : "text-rose-400")}>
                    {stock.OneDay > 0 ? '+' : ''}{formatPercent(stock.OneDay)}
                  </span>
                </div>
                
                {/* Quick Toggle Button on Hover (Desktop) */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWatchlist(stock.Code);
                  }}
                  className={clsx(
                    "absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all hover:bg-slate-600",
                    isFavorited(stock.Code) ? "opacity-100" : "opacity-0 group-hover:opacity-50 hover:!opacity-100"
                  )}
                >
                   <Star size={14} className={isFavorited(stock.Code) ? "text-yellow-400 fill-yellow-400" : "text-slate-400"} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- RIGHT CONTENT (Detail) --- */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-[#0f172a] p-6 gap-6">
        {selectedStock ? (
          <>
            {/* HEADER INFO */}
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-4xl font-bold text-white">{selectedStock.Code}</h2>
                  
                  {/* MAIN WATCHLIST TOGGLE BUTTON */}
                  <button
                    onClick={() => toggleWatchlist(selectedStock.Code)}
                    className={clsx(
                      "p-2 rounded-full border transition-all",
                      isFavorited(selectedStock.Code) 
                        ? "bg-yellow-400/10 border-yellow-400/50 text-yellow-400" 
                        : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200"
                    )}
                    title={isFavorited(selectedStock.Code) ? "Hapus dari Watchlist" : "Tambah ke Watchlist"}
                  >
                    <Star size={20} className={isFavorited(selectedStock.Code) ? "fill-yellow-400" : ""} />
                  </button>
                </div>
                
                <p className="text-lg text-slate-400">{selectedStock.Name}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-slate-800 text-xs px-2 py-1 rounded text-slate-300 border border-slate-700">{selectedStock.SectorName}</span>
                  <span className="bg-slate-800 text-xs px-2 py-1 rounded text-slate-300 border border-slate-700">{selectedStock.SubSectorName}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-mono font-bold text-white">{formatCurrency(selectedStock.Last)}</div>
                <div className={clsx("flex items-center justify-end gap-2 text-lg mt-1", selectedStock.OneDay >= 0 ? 'text-emerald-400' : 'text-rose-400')}>
                  {selectedStock.OneDay >= 0 ? <TrendingUp size={24}/> : <TrendingDown size={24}/>}
                  <span>{formatPercent(selectedStock.OneDay)} (1D)</span>
                </div>
                <div className="text-slate-500 text-sm mt-1">Vol: {selectedStock.Volume.toLocaleString()}</div>
              </div>
            </div>

            {/* CHART SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Technical Chart */}
              <div className="lg:col-span-2 bg-[#1e293b] p-5 rounded-xl border border-slate-800 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-200">
                    <Activity size={18} className="text-blue-400"/> Pergerakan Harga (30 Hari)
                  </h3>
                  <div className="flex gap-4 text-sm text-slate-400">
                    <span>Hi: <b className="text-white">{selectedStock.AdjustedHighPrice}</b></span>
                    <span>Lo: <b className="text-white">{selectedStock.AdjustedLowPrice}</b></span>
                  </div>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                      <XAxis dataKey="date" hide />
                      <YAxis domain={['auto', 'auto']} stroke="#64748b" fontSize={12} tickFormatter={(val) => val.toLocaleString()} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                        formatter={(value: number | string | undefined) => [value ? value.toString() : 'N/A', 'Harga']}
                      />
                      <Line type="monotone" dataKey="close" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Performance Bar Chart */}
              <div className="bg-[#1e293b] p-5 rounded-xl border border-slate-800 shadow-lg flex flex-col">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-200">
                  <BarChart2 size={18} className="text-purple-400"/> Tren Performa
                </h3>
                <div className="flex-1 min-h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData} layout="vertical" margin={{ left: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} opacity={0.3}/>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" stroke="#94a3b8" width={30} tick={{fontSize: 12}} />
                      <Tooltip 
                        cursor={{fill: 'transparent'}}
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }}
                        formatter={(val: number | undefined) => val !== undefined ? formatPercent(val) : 'N/A'}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={30}>
                        {performanceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.value >= 0 ? '#10b981' : '#f43f5e'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* FUNDAMENTAL GRID */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-200">
                <PieChart size={18} className="text-orange-400"/> Analisis Fundamental
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard 
                  label="Market Cap" 
                  value={formatMarketCap(selectedStock.Capitalization)} 
                  sub="IDR"
                />
                <MetricCard 
                  label="P/E Ratio (PER)" 
                  value={selectedStock.Per ? `${formatNumber(selectedStock.Per)}x` : 'N/A'} 
                  color={selectedStock.Per > 0 && selectedStock.Per < 15 ? 'text-emerald-400' : 'text-slate-100'}
                />
                <MetricCard 
                  label="PBV (PBR)" 
                  value={selectedStock.Pbr ? `${formatNumber(selectedStock.Pbr)}x` : 'N/A'}
                  color={selectedStock.Pbr < 2 ? 'text-emerald-400' : 'text-slate-100'} 
                />
                <MetricCard 
                  label="ROE" 
                  value={selectedStock.Roe ? formatPercent(selectedStock.Roe) : 'N/A'} 
                  color={selectedStock.Roe > 0.1 ? 'text-emerald-400' : 'text-yellow-400'}
                />
                <MetricCard 
                  label="Beta (1Y)" 
                  value={formatNumber(selectedStock.BetaOneYear)} 
                  sub="Volatilitas"
                />
                <MetricCard 
                  label="YTD Return" 
                  value={formatPercent(selectedStock.Ytd)} 
                  color={selectedStock.Ytd >= 0 ? 'text-emerald-400' : 'text-rose-400'}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-500">
            <Activity size={64} className="mb-4 opacity-20" />
            <p className="text-xl">Pilih saham di sebelah kiri untuk melihat analisis.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ label, value, sub, color = 'text-white' }: { label: string, value: string, sub?: string, color?: string }) {
  return (
    <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-800 flex flex-col justify-between hover:border-slate-600 transition-colors">
      <span className="text-slate-400 text-sm">{label}</span>
      <div className="mt-2">
        <span className={`text-2xl font-bold font-mono ${color}`}>{value}</span>
        {sub && <span className="text-xs text-slate-500 ml-2">{sub}</span>}
      </div>
    </div>
  );
}