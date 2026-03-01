import express from "express";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// Mock/Fallback Data for Demo if API keys are missing
const getMockStocks = () => [
  { 
    symbol: "NVDA", 
    name: "NVIDIA Corporation",
    price: 135.20, 
    change: 4.5, 
    gapPercent: 3.2,
    volume: "120M", 
    relVol: 3.2, 
    float: "24.5B",
    marketCap: "3.3T",
    sector: "Technology",
    catalyst: "Earnings Surprise",
    breakoutLevel: 132.50,
    reason: "Gap Up + AI Demand", 
    score: 92, 
    status: "High Priority" 
  },
  { 
    symbol: "TSLA", 
    name: "Tesla, Inc.",
    price: 240.50, 
    change: 2.1, 
    gapPercent: 0.5,
    volume: "85M", 
    relVol: 1.8, 
    float: "2.8B",
    marketCap: "760B",
    sector: "Consumer Cyclical",
    catalyst: "Technical Breakout",
    breakoutLevel: 238.00,
    reason: "Resistance Breakout", 
    score: 78, 
    status: "Medium" 
  },
  { 
    symbol: "AMD", 
    name: "Advanced Micro Devices",
    price: 155.40, 
    change: 3.8, 
    gapPercent: 4.1,
    volume: "45M", 
    relVol: 2.5, 
    float: "1.6B",
    marketCap: "250B",
    sector: "Technology",
    catalyst: "Analyst Upgrade",
    breakoutLevel: 152.00,
    reason: "Volume Spike + News", 
    score: 85, 
    status: "High Priority" 
  },
  { 
    symbol: "PLTR", 
    name: "Palantir Technologies",
    price: 28.40, 
    change: 5.2, 
    gapPercent: 2.8,
    volume: "35M", 
    relVol: 4.1, 
    float: "1.9B",
    marketCap: "62B",
    sector: "Technology",
    catalyst: "Major Contract",
    breakoutLevel: 27.50,
    reason: "Contract Win + Volume", 
    score: 88, 
    status: "High Priority" 
  },
];

// API Routes
app.get("/api/market/stocks", async (req, res) => {
  try {
    const apiKey = process.env.POLYGON_API_KEY;
    if (!apiKey || apiKey === "YOUR_POLYGON_API_KEY" || apiKey === "") {
      return res.json(getMockStocks());
    }

    // Fetch snapshot of all US stocks
    const response = await axios.get(`https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers?apiKey=${apiKey}`);
    const tickers = response.data.tickers || [];

    // Filter for momentum: Gap/Change > 3%, Volume > 1M (liquidity), Price > $1
    const momentumStocks = tickers
      .filter((t: any) => {
        const change = t.todaysChangePerc || 0;
        const price = t.lastQuote?.p || t.min?.c || 0;
        const volume = t.day?.v || 0;
        return change >= 3 && price >= 1 && volume >= 500000;
      })
      .sort((a: any, b: any) => (b.todaysChangePerc || 0) - (a.todaysChangePerc || 0))
      .slice(0, 15)
      .map((t: any) => {
        const change = t.todaysChangePerc || 0;
        const price = t.lastQuote?.p || t.min?.c || 0;
        const volume = t.day?.v || 0;
        const prevVolume = t.prevDay?.v || 1;
        const relVol = (volume / prevVolume).toFixed(1);

        // Determine status and reason
        let status: 'High Priority' | 'Medium' | 'Low' = 'Low';
        let reason = "Momentum";
        if (change > 8 && parseFloat(relVol) > 3) {
          status = 'High Priority';
          reason = "Explosive Gap + Volume";
        } else if (change > 5) {
          status = 'Medium';
          reason = "Strong Trend";
        }

        return {
          symbol: t.ticker,
          name: t.ticker, // Snapshot doesn't give full name
          price: price,
          change: parseFloat(change.toFixed(2)),
          gapPercent: parseFloat(change.toFixed(2)), // Using change as proxy for gap in snapshot
          volume: volume > 1e6 ? `${(volume / 1e6).toFixed(1)}M` : `${(volume / 1e3).toFixed(1)}K`,
          relVol: relVol,
          float: "N/A", // Requires separate API call
          marketCap: "N/A", // Requires separate API call
          sector: "Equity",
          catalyst: change > 10 ? "High Volatility" : "Technical Breakout",
          breakoutLevel: parseFloat((price * 0.98).toFixed(2)),
          reason: reason,
          score: Math.min(100, Math.floor(50 + change * 3 + parseFloat(relVol) * 5)),
          status: status
        };
      });

    res.json(momentumStocks.length > 0 ? momentumStocks : getMockStocks());
  } catch (error) {
    console.error("Error fetching stocks from Polygon:", error);
    res.json(getMockStocks());
  }
});

app.post("/api/ai/analyze", async (req, res) => {
  const { assets } = req.body;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze these U.S. stocks for day trading momentum. Rank them and provide a brief expert insight for each, focusing on the catalyst and technical breakout levels.
      Assets: ${JSON.stringify(assets)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              symbol: { type: Type.STRING },
              aiScore: { type: Type.NUMBER },
              insight: { type: Type.STRING },
              recommendation: { type: Type.STRING }
            },
            required: ["symbol", "aiScore", "insight", "recommendation"]
          }
        }
      }
    });

    res.json(JSON.parse(response.text || "[]"));
  } catch (error) {
    console.error("AI Analysis Error:", error);
    res.status(500).json({ error: "AI analysis failed" });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
