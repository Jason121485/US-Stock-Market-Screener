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
