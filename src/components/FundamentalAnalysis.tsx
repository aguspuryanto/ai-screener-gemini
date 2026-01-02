import { StockData } from '@/types/stock';
import { formatNumber, formatPercent, formatMarketCap } from '@/lib/api';

interface FundamentalAnalysisProps {
  stock: StockData;
}

export function FundamentalAnalysis({ stock }: FundamentalAnalysisProps) {
  const getPERInterpretation = (per: number) => {
    if (per > 30) return { text: '⚠️ Sangat Tinggi (Overvalued)', color: 'text-rose-400' };
    if (per > 20) return { text: '📈 Tinggi (Growth Stock)', color: 'text-amber-400' };
    if (per > 10) return { text: '✅ Wajar', color: 'text-emerald-400' };
    return { text: '💎 Murah (Undervalued)', color: 'text-blue-400' };
  };

  const getPBVInterpretation = (pbv: number) => {
    if (pbv > 5) return { text: '⚠️ Sangat Tinggi', color: 'text-rose-400' };
    if (pbv > 3) return { text: '📈 Tinggi', color: 'text-amber-400' };
    if (pbv > 1) return { text: '✅ Wajar', color: 'text-emerald-400' };
    return { text: '💎 Murah', color: 'text-blue-400' };
  };

  const getROEInterpretation = (roe: number) => {
    if (roe > 0.2) return { text: '⭐ Sangat Baik', color: 'text-emerald-400' };
    if (roe > 0.15) return { text: '👍 Baik', color: 'text-green-400' };
    if (roe > 0.1) return { text: '⚖️ Cukup', color: 'text-amber-400' };
    return { text: '⚠️ Perlu Perbaikan', color: 'text-rose-400' };
  };

  const getBetaInterpretation = (beta: number) => {
    if (beta > 1.5) return { text: '📈 Sangat Volatile', color: 'text-rose-400' };
    if (beta > 1) return { text: '📊 Lebih Volatile dari Pasar', color: 'text-amber-400' };
    if (beta > 0.5) return { text: '⚖️ Seimbang', color: 'text-emerald-400' };
    return { text: '🛡️ Defensif', color: 'text-blue-400' };
  };

  const getYTDInterpretation = (ytd: number) => {
    if (ytd > 0.5) return { text: '🚀 Eksplosif', color: 'text-emerald-400' };
    if (ytd > 0.2) return { text: '📈 Kuat', color: 'text-green-400' };
    if (ytd > 0) return { text: '⚖️ Stabil', color: 'text-amber-400' };
    return { text: '🔻 Turun', color: 'text-rose-400' };
  };

  const per = stock.Per || 0;
  const pbv = stock.Pbr || 0;
  const roe = stock.Roe || 0;
  const beta = stock.BetaOneYear || 0;
  const ytd = stock.Ytd || 0;

  const perInfo = getPERInterpretation(per);
  const pbvInfo = getPBVInterpretation(pbv);
  const roeInfo = getROEInterpretation(roe);
  const betaInfo = getBetaInterpretation(beta);
  const ytdInfo = getYTDInterpretation(ytd);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-2">Analisis Fundamental</h3>
        <p className="text-slate-300 text-sm">
          Analisis fundamental menilai nilai wajar saham berdasarkan kinerja keuangan dan prospek bisnis perusahaan.
          Cocok untuk investasi jangka menengah-panjang.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Market Cap */}
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <h4 className="font-semibold text-slate-200 mb-2">Market Capitalization</h4>
          <div className="text-2xl font-bold text-white">{formatMarketCap(stock.Capitalization)}</div>
          <p className="text-slate-400 text-sm mt-2">
            {stock.Capitalization > 100_000_000_000_000 ? 'Emiten Besar (Blue Chip)' : 
             stock.Capitalization > 10_000_000_000_000 ? 'Mid Cap' : 'Small Cap'}
          </p>
        </div>

        {/* P/E Ratio */}
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <h4 className="font-semibold text-slate-200 mb-2">P/E Ratio (PER)</h4>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{per ? `${formatNumber(per)}x` : 'N/A'}</span>
            <span className={`text-sm ${perInfo.color}`}>{perInfo.text}</span>
          </div>
          <p className="text-slate-400 text-sm mt-2">
            {per > 30 ? 'Valuasi sangat tinggi, pertumbuhan tinggi diharapkan' :
             per > 20 ? 'Growth stock dengan ekspektasi tinggi' :
             per > 10 ? 'Valuasi wajar' : 'Potensi undervalued'}
          </p>
        </div>

        {/* PBV */}
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <h4 className="font-semibold text-slate-200 mb-2">Price to Book Value (PBV)</h4>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{pbv ? `${formatNumber(pbv)}x` : 'N/A'}</span>
            <span className={`text-sm ${pbvInfo.color}`}>{pbvInfo.text}</span>
          </div>
          <p className="text-slate-400 text-sm mt-2">
            {pbv > 5 ? 'Valuasi aset sangat mahal' :
             pbv > 3 ? 'Ekspektasi pertumbuhan tinggi' :
             pbv > 1 ? 'Nilai wajar berdasarkan aset' : 'Di bawah nilai buku'}
          </p>
        </div>

        {/* ROE */}
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <h4 className="font-semibold text-slate-200 mb-2">Return on Equity (ROE)</h4>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{roe ? formatPercent(roe) : 'N/A'}</span>
            <span className={`text-sm ${roeInfo.color}`}>{roeInfo.text}</span>
          </div>
          <p className="text-slate-400 text-sm mt-2">
            {roe > 0.2 ? 'Sangat efisien menghasilkan laba' :
             roe > 0.15 ? 'Manajemen efektif' :
             roe > 0.1 ? 'Cukup efisien' : 'Perlu peningkatan efisiensi'}
          </p>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Beta */}
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <h4 className="font-semibold text-slate-200 mb-2">Beta (1Y) - Volatilitas</h4>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{formatNumber(beta)}</span>
            <span className={`text-sm ${betaInfo.color}`}>{betaInfo.text}</span>
          </div>
          <p className="text-slate-400 text-sm mt-2">
            {beta > 1.5 ? 'Sangat sensitif terhadap pergerakan pasar' :
             beta > 1 ? 'Lebih fluktuatif dari IHSG' :
             beta > 0.5 ? 'Perubahan harga relatif stabil' : 'Cenderung stabil saat pasar bergejolak'}
          </p>
        </div>

        {/* YTD Return */}
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <h4 className="font-semibold text-slate-200 mb-2">YTD Return</h4>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold ${ytd >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatPercent(ytd)}
            </span>
            <span className={`text-sm ${ytdInfo.color}`}>{ytdInfo.text}</span>
          </div>
          <p className="text-slate-400 text-sm mt-2">
            {ytd > 0.5 ? 'Kinerja sangat kuat tahun ini' :
             ytd > 0.2 ? 'Mengungguli ekspektasi' :
             ytd > 0 ? 'Pertumbuhan positif' : 'Performa di bawah harapan'}
          </p>
        </div>
      </div>

      {/* Investment Suitability */}
      <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
        <h4 className="font-semibold text-slate-200 mb-3">Kesesuaian untuk Tipe Investor</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span>Trader Momentum</span>
            <span className="px-3 py-1 bg-emerald-400/20 text-emerald-400 rounded-full text-sm">✅ Cocok</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Swing Trader</span>
            <span className="px-3 py-1 bg-amber-400/20 text-amber-400 rounded-full text-sm">⚠️ Hati-hati</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Investor Jangka Panjang (Value)</span>
            <span className="px-3 py-1 bg-rose-400/20 text-rose-400 rounded-full text-sm">❌ Tidak Cocok</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Spekulan Growth</span>
            <span className="px-3 py-1 bg-amber-400/20 text-amber-400 rounded-full text-sm">⚠️ Dengan Manajemen Risiko</span>
          </div>
        </div>
      </div>

      {/* Key Takeaways */}
      <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-700/50">
        <h4 className="font-semibold text-blue-300 mb-2">📌 Poin Penting</h4>
        <ul className="list-disc list-inside text-slate-300 space-y-1 text-sm">
          <li>Valuasi saham saat ini termasuk tinggi berdasarkan PER dan PBV</li>
          <li>ROE cukup baik tetapi perlu diimbangi dengan pertumbuhan yang konsisten</li>
          <li>Volatilitas tinggi cocok untuk trader berpengalaman</li>
          <li>Perhatikan faktor eksternal yang mempengaruhi sektor</li>
        </ul>
      </div>
    </div>
  );
}
