import React from 'react';

export interface Asset {
  symbol: string;
  name: string;
  price: number;
  change: number;
  gapPercent: number;
  volume: string;
  relVol: number | string;
  float: string;
  marketCap: string;
  sector: string;
  catalyst: string;
  breakoutLevel: number;
  reason: string;
  score: number;
  status: 'High Priority' | 'Medium' | 'Low';
  aiInsight?: string;
}

export interface FilterSettings {
  minGap: number;
  minRelVol: number;
  minPrice: number;
  maxPrice: number;
  marketCap: 'All' | 'Small' | 'Mid' | 'Large';
}
