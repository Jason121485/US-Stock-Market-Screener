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

export interface TradePlan {
  symbol: string;
  setupType: string;
  entryPrice: number;
  stopLoss: number;
  takeProfit1: number;
  takeProfit2: number;
  riskReward: string;
  positionSize: string;
  confidenceScore: number;
  reason: string;
}

export interface FilterSettings {
  minGap: number;
  minRelVol: number;
  minPrice: number;
  maxPrice: number;
  marketCap: 'All' | 'Small' | 'Mid' | 'Large';
  accountSize: number;
  riskPerTrade: number;
}
