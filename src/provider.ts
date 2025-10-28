import express from 'express';
import { paymentMiddleware } from '@x402/server';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

// x402 Middleware: $0.01 for /signals/*
app.use(paymentMiddleware(process.env.WALLET_ADDRESS!, { '/signals': '$0.01' }));

// Mock AI signal endpoint
app.get('/signals/btc', (req, res) => {
  // Simulate paid signal (in real: Generate with ML model)
  const prediction = Math.random() > 0.5 ? 'buy' : 'sell';
  const confidence = Math.random() * 0.5 + 0.5; // 0.5-1.0
  res.json({ prediction, confidence, timestamp: new Date().toISOString() });
});

app.listen(3001, () => console.log('[PROVIDER] Mock x402 Signal Server on port 3001'));