import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Search, 
  Settings2, 
  RefreshCcw, 
  LayoutDashboard, 
  Coins, 
  BarChart4, 
  Bell,
  BrainCircuit,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { Asset, FilterSettings } from './types';
import { Card, Badge, Stat, cn } from './components/UI';
import { MiniChart, MainChart } from './components/Charts';

export default function App() {
  const [stocks, setStocks] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(date);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const stocksRes = await fetch('/api/market/stocks');
      const stocksData = await stocksRes.json();
      setStocks(stocksData);
      if (!selectedAsset && stocksData.length > 0) setSelectedAsset(stocksData[0]);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const runAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assets: stocks.slice(0, 5) })
      });
      const insights = await response.json();
      setAiInsights(insights);
    } catch (error) {
      console.error("AI Analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-zinc-300 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="border-bottom border-[#2A2B2F] bg-[#151619]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Zap className="text-black w-6 h-6 fill-current" />
            </div>
            <div>
              <h1 className="text-white font-bold tracking-tight text-lg uppercase">US MOMENTUM<span className="text-emerald-500"> TERMINAL</span></h1>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Institutional Grade U.S. Equities Screener</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-4">
              <div className="text-white font-mono text-sm font-bold tracking-tighter">
                {formatTime(currentTime)}
              </div>
              <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                {formatDate(currentTime)} • NY TIME
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0A0B0D] border border-[#2A2B2F] rounded-lg">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">NYSE/NASDAQ LIVE</span>
            </div>
            <button className="p-2 text-zinc-500 hover:text-white transition-colors">
              <Bell size={20} />
            </button>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={cn("p-2 transition-colors", showFilters ? "text-emerald-500" : "text-zinc-500 hover:text-white")}
            >
              <Settings2 size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-6 grid grid-cols-12 gap-6">
        {/* Filter Bar (Conditional) */}
        {showFilters && (
          <div className="col-span-12 animate-in slide-in-from-top-4 duration-300">
            <Card className="p-4 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 bg-[#1A1B1E]">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Min Gap %</label>
                <input type="number" defaultValue={3} className="w-full bg-[#0A0B0D] border border-[#2A2B2F] rounded p-2 text-xs text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Vol Multiplier</label>
                <input type="number" defaultValue={2} className="w-full bg-[#0A0B0D] border border-[#2A2B2F] rounded p-2 text-xs text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Price Range</label>
                <div className="flex gap-2">
                  <input type="number" placeholder="Min" className="w-1/2 bg-[#0A0B0D] border border-[#2A2B2F] rounded p-2 text-xs text-white" />
                  <input type="number" placeholder="Max" className="w-1/2 bg-[#0A0B0D] border border-[#2A2B2F] rounded p-2 text-xs text-white" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Market Cap</label>
                <select className="w-full bg-[#0A0B0D] border border-[#2A2B2F] rounded p-2 text-xs text-white">
                  <option>All</option>
                  <option>Small Cap</option>
                  <option>Mid Cap</option>
                  <option>Large Cap</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Float Size</label>
                <select className="w-full bg-[#0A0B0D] border border-[#2A2B2F] rounded p-2 text-xs text-white">
                  <option>All</option>
                  <option>Low Float (&lt;20M)</option>
                  <option>Mid Float</option>
                </select>
              </div>
              <div className="flex items-end">
                <button className="w-full py-2 bg-emerald-500 text-black font-bold text-xs rounded hover:bg-emerald-400 transition-colors">
                  APPLY FILTERS
                </button>
              </div>
            </Card>
          </div>
        )}

        {/* Left Column: Screener */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Market Stats Bar */}
          <Card className="flex divide-x divide-[#2A2B2F]">
            <Stat label="S&P 500" value="5,123.42" subValue="1.2%" trend="up" />
            <Stat label="Nasdaq" value="16,274.94" subValue="0.8%" trend="up" />
            <Stat label="Russell 2000" value="2,042.15" subValue="1.5%" trend="up" />
            <Stat label="Volatility (VIX)" value="14.20" subValue="3.5%" trend="down" />
          </Card>

          {/* Screener Table */}
          <Card id="screener-table">
            <div className="p-4 border-b border-[#2A2B2F] flex items-center justify-between bg-[#1A1B1E]">
              <div className="flex items-center gap-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                  <Filter size={16} className="text-emerald-500" />
                  Momentum Scanner
                </h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                  <input 
                    type="text" 
                    placeholder="Search tickers..." 
                    className="bg-[#0A0B0D] border border-[#2A2B2F] rounded-md py-1.5 pl-9 pr-4 text-xs focus:outline-none focus:border-emerald-500/50 w-48"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={fetchData}
                  className="p-2 bg-[#0A0B0D] border border-[#2A2B2F] rounded-md hover:bg-zinc-800 transition-colors text-zinc-400"
                >
                  <RefreshCcw size={14} className={loading ? "animate-spin" : ""} />
                </button>
                <button className="px-3 py-1.5 bg-emerald-500 text-black text-[10px] font-bold rounded-md hover:bg-emerald-400 transition-colors uppercase tracking-wider">
                  Export CSV
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0A0B0D] border-b border-[#2A2B2F]">
                    <th className="px-4 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Ticker</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Price</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Change</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Gap %</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Rel Vol</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Catalyst</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Score</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Chart</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2B2F]">
                  {stocks.map((asset) => (
                    <tr 
                      key={asset.symbol} 
                      onClick={() => setSelectedAsset(asset)}
                      className={cn(
                        "hover:bg-zinc-800/30 cursor-pointer transition-colors group",
                        selectedAsset?.symbol === asset.symbol && "bg-emerald-500/5"
                      )}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-white">
                            {asset.symbol.substring(0, 2)}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{asset.symbol}</div>
                            <div className="text-[10px] text-zinc-500 font-medium">{asset.sector}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-mono text-sm text-zinc-300">
                        ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-4">
                        <div className={cn(
                          "flex items-center gap-1 text-sm font-bold",
                          asset.change >= 0 ? "text-emerald-400" : "text-rose-400"
                        )}>
                          {asset.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                          {Math.abs(asset.change)}%
                        </div>
                      </td>
                      <td className="px-4 py-4 font-mono text-sm text-zinc-400">
                        {asset.gapPercent > 0 ? "+" : ""}{asset.gapPercent}%
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-zinc-400">{asset.relVol}x</span>
                          <div className="w-12 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500" 
                              style={{ width: `${Math.min(100, (Number(asset.relVol) / 5) * 100)}%` }} 
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant={asset.status === 'High Priority' ? 'success' : asset.status === 'Medium' ? 'warning' : 'default'}>
                          {asset.catalyst}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "text-sm font-bold",
                            asset.score > 80 ? "text-emerald-400" : asset.score > 50 ? "text-amber-400" : "text-zinc-500"
                          )}>
                            {asset.score}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <MiniChart basePrice={asset.price} color={asset.change >= 0 ? "#10b981" : "#f43f5e"} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Column: Details & AI */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Analysis Panel */}
          <Card className="flex flex-col h-full">
            <div className="p-4 border-b border-[#2A2B2F] flex items-center justify-between bg-[#1A1B1E]">
              <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <BrainCircuit size={16} className="text-emerald-500" />
                AI Decision Layer
              </h2>
              <button 
                onClick={runAIAnalysis}
                disabled={isAnalyzing}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-[10px] font-bold rounded-md transition-all flex items-center gap-2"
              >
                {isAnalyzing ? "ANALYZING..." : "RUN AI SCAN"}
              </button>
            </div>

            <div className="p-4 space-y-4 flex-1 overflow-y-auto max-h-[400px]">
              {aiInsights.length > 0 ? (
                aiInsights.map((insight, idx) => (
                  <div key={idx} className="p-3 bg-[#0A0B0D] border border-[#2A2B2F] rounded-lg space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white">{insight.symbol}</span>
                      <Badge variant="info">Score: {insight.aiScore}</Badge>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed italic">
                      "{insight.insight}"
                    </p>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                      <ArrowUpRight size={12} /> {insight.recommendation}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                  <div className="w-12 h-12 bg-zinc-800/50 rounded-full flex items-center justify-center">
                    <BrainCircuit className="text-zinc-600" size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">No Active Analysis</p>
                    <p className="text-[10px] text-zinc-600 mt-1">Run AI Scan to get institutional-grade insights on current movers.</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Selected Asset Details */}
          {selectedAsset && (
            <Card className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="p-4 border-b border-[#2A2B2F] bg-[#1A1B1E]">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedAsset.symbol}</h2>
                    <p className="text-xs text-zinc-500">{selectedAsset.name}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-mono font-bold text-white">${selectedAsset.price}</div>
                    <div className={cn("text-xs font-bold", selectedAsset.change >= 0 ? "text-emerald-400" : "text-rose-400")}>
                      {selectedAsset.change >= 0 ? "+" : ""}{selectedAsset.change}%
                    </div>
                  </div>
                </div>
              </div>
              
              <MainChart symbol={selectedAsset.symbol} price={selectedAsset.price} />

              <div className="p-4 grid grid-cols-2 gap-4 border-t border-[#2A2B2F]">
                <div className="p-3 bg-[#0A0B0D] rounded-lg border border-[#2A2B2F]">
                  <div className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Float Size</div>
                  <div className="text-sm font-mono text-white">{selectedAsset.float}</div>
                </div>
                <div className="p-3 bg-[#0A0B0D] rounded-lg border border-[#2A2B2F]">
                  <div className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Market Cap</div>
                  <div className="text-sm font-mono text-white">{selectedAsset.marketCap}</div>
                </div>
                <div className="p-3 bg-[#0A0B0D] rounded-lg border border-[#2A2B2F]">
                  <div className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Breakout Level</div>
                  <div className="text-sm font-mono text-emerald-400">${selectedAsset.breakoutLevel}</div>
                </div>
                <div className="p-3 bg-[#0A0B0D] rounded-lg border border-[#2A2B2F]">
                  <div className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Sector</div>
                  <div className="text-sm font-mono text-white">{selectedAsset.sector}</div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2">
                  <Zap size={18} fill="currentColor" />
                  ADD TO WATCHLIST
                </button>
              </div>
            </Card>
          )}
        </div>
      </main>

      {/* Footer / Status Bar */}
      <footer className="border-t border-[#2A2B2F] bg-[#151619] py-2 px-6 fixed bottom-0 w-full z-50">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              NYSE/NASDAQ: OPEN
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              DATA FEED: POLYGON.IO
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span>© 2026 US MOMENTUM TERMINAL</span>
            <span className="text-zinc-700">|</span>
            <span>V2.5.0-STABLE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
