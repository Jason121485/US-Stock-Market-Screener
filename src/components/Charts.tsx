import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const generateData = (basePrice: number) => {
  return Array.from({ length: 20 }, (_, i) => ({
    time: `${i}:00`,
    price: basePrice + (Math.random() - 0.5) * (basePrice * 0.05),
  }));
};

export const MiniChart = ({ basePrice, color = "#10b981" }: { basePrice: number; color?: string }) => {
  const data = React.useMemo(() => generateData(basePrice), [basePrice]);

  return (
    <div className="h-12 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke={color} 
            strokeWidth={2} 
            dot={false} 
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const MainChart = ({ symbol, price }: { symbol: string; price: number }) => {
  const data = React.useMemo(() => generateData(price), [price]);

  return (
    <div className="h-full w-full p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">{symbol}</h3>
          <p className="text-xs text-zinc-500">Real-time 1m Chart</p>
        </div>
        <div className="flex gap-2">
          {['1m', '5m', '15m', '1h', '1d'].map(tf => (
            <button key={tf} className="px-2 py-1 text-[10px] font-bold bg-zinc-800 text-zinc-400 rounded hover:bg-zinc-700 transition-colors">
              {tf}
            </button>
          ))}
        </div>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2B2F" vertical={false} />
            <XAxis dataKey="time" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis 
              domain={['auto', 'auto']} 
              stroke="#52525b" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(val) => `$${val.toFixed(2)}`}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#151619', border: '1px solid #2A2B2F', borderRadius: '8px' }}
              itemStyle={{ color: '#fff' }}
              labelStyle={{ color: '#52525b' }}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#10b981" 
              strokeWidth={2} 
              dot={false} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
