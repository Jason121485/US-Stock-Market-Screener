import React from 'react';
import { TrendingUp, TrendingDown, AlertCircle, BarChart3, Zap, Shield, Search, Settings2, RefreshCcw } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Card = ({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) => (
  <div id={id} className={cn("bg-[#151619] border border-[#2A2B2F] rounded-xl overflow-hidden shadow-xl", className)}>
    {children}
  </div>
);

export const Badge = ({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' }) => {
  const variants = {
    default: "bg-zinc-800 text-zinc-300",
    success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    danger: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
    info: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  };
  return (
    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider", variants[variant])}>
      {children}
    </span>
  );
};

export const Stat = ({ label, value, subValue, trend }: { label: string; value: string; subValue?: string; trend?: 'up' | 'down' }) => (
  <div className="p-4 border-r border-[#2A2B2F] last:border-0">
    <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">{label}</div>
    <div className="flex items-baseline gap-2">
      <span className="text-xl font-mono font-medium text-white">{value}</span>
      {trend && (
        <span className={cn("text-xs font-bold", trend === 'up' ? "text-emerald-400" : "text-rose-400")}>
          {trend === 'up' ? "+" : "-"}{subValue}
        </span>
      )}
    </div>
  </div>
);

import { TradePlan } from '../types';

export const TradeCard: React.FC<{ plan: TradePlan }> = ({ plan }) => (
  <div className="p-5 bg-[#1A1B1E] border border-[#2A2B2F] rounded-2xl shadow-2xl space-y-4 hover:border-emerald-500/30 transition-all group relative overflow-hidden">
    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl -mr-16 -mt-16 rounded-full" />
    
    <div className="flex justify-between items-start border-b border-[#2A2B2F] pb-3 relative z-10">
      <div>
        <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mb-1">Ticker</div>
        <div className="flex items-center gap-3">
          <span className="text-2xl font-black text-white tracking-tighter">{plan.symbol}</span>
          <div className="flex flex-col">
            <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Setup Type</div>
            <Badge variant="success">{plan.setupType}</Badge>
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Confidence Score</div>
        <div className="text-lg font-mono font-bold text-emerald-400">{plan.confidenceScore}%</div>
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-4 relative z-10">
      <div className="space-y-1">
        <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Entry Price</div>
        <div className="text-sm font-mono font-bold text-white bg-[#0A0B0D] p-2 rounded-lg border border-[#2A2B2F]">
          ${plan.entryPrice.toFixed(2)}
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Stop Loss</div>
        <div className="text-sm font-mono font-bold text-rose-400 bg-[#0A0B0D] p-2 rounded-lg border border-[#2A2B2F]">
          ${plan.stopLoss.toFixed(2)}
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Take Profit</div>
        <div className="text-sm font-mono font-bold text-emerald-400 bg-[#0A0B0D] p-2 rounded-lg border border-[#2A2B2F]">
          ${plan.takeProfit1.toFixed(2)}
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Risk/Reward</div>
        <div className="text-sm font-mono font-bold text-white bg-[#0A0B0D] p-2 rounded-lg border border-[#2A2B2F]">
          {plan.riskReward}
        </div>
      </div>
    </div>

    <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10 relative z-10 flex justify-between items-center">
      <div className="text-[10px] text-emerald-500/70 font-bold uppercase tracking-widest">Position Size</div>
      <div className="text-sm font-bold text-emerald-400">{plan.positionSize}</div>
    </div>

    <div className="space-y-2 pt-2 border-t border-[#2A2B2F] relative z-10">
      <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Reason for Selection</div>
      <p className="text-[11px] text-zinc-400 leading-relaxed italic">
        {plan.reason}
      </p>
    </div>
  </div>
);
