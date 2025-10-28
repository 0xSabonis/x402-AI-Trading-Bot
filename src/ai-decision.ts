import * as talib from 'node-talib'; // For technical indicators

// Mock free price data fetch (in real: use Coinbase API)
async function getHistoricalPrices(symbol: string, period: number = 14): Promise<number[]> {
  // Simulated: In real, fetch from Coinbase: axios.get(`/products/${symbol}/candles`)
  return Array.from({ length: period }, () => Math.random() * 100 + 50000); // Fake BTC prices ~$50k
}

export async function decideTrade(signal: { prediction: 'buy' | 'sell' | 'hold'; confidence: number }): Promise<{ action: 'buy' | 'sell' | 'hold'; reason: string }> {
  const prices = await getHistoricalPrices(process.env.TRADE_SYMBOL!);
  const sma = talib.execute({
    name: 'SMA',
    startIdx: 0,
    endIdx: prices.length - 1,
    inReal: prices,
    optInTimePeriod: 5
  });
  const currentPrice = prices[prices.length - 1];
  const smaValue = sma.result.outReal[0] || currentPrice;

  let action = 'hold';
  let reason = '';

  if (signal.prediction === 'buy' && signal.confidence > 0.7 && currentPrice > smaValue) {
    action = 'buy';
    reason = 'Bullish signal + price above SMA';
  } else if (signal.prediction === 'sell' && signal.confidence > 0.7 && currentPrice < smaValue) {
    action = 'sell';
    reason = 'Bearish signal + price below SMA';
  } else {
    reason = 'Low confidence or neutral';
  }

  return { action, reason };
}