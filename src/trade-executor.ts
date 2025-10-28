import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_BASE = process.env.SIMULATE_TRADES ? 'https://api-public.sandbox.pro.coinbase.com' : 'https://api-public.pro.coinbase.com';
const headers = {
  'CB-ACCESS-KEY': process.env.COINBASE_API_KEY!,
  'CB-ACCESS-SIGN': '', // Implement HMAC signing in prod (see Coinbase docs)
  'CB-ACCESS-TIMESTAMP': '',
  'CB-ACCESS-PASSPHRASE': process.env.COINBASE_PASSPHRASE!,
  'Content-Type': 'application/json'
};

export async function executeTrade(action: 'buy' | 'sell', symbol: string, amount: number = 0.001): Promise<string> {
  if (process.env.SIMULATE_TRADES === 'true') {
    console.log(`[SIMULATED] Executed ${action} ${amount} ${symbol} at market price.`);
    return 'simulated_tx_123';
  }

  // Real trade: POST to /api/v3/brokerage/orders
  const order = {
    client_order_id: `x402-bot-${Date.now()}`,
    product_id: symbol,
    side: action,
    order_configuration: { market_market_ioc: { base_size: amount.toString() } }
  };

  const response = await axios.post(`${API_BASE}/api/v3/brokerage/orders`, order, { headers });
  return response.data.order_id;
}