import { createPaymentPayload } from '@x402/client';
import axios from 'axios';
import { Wallet, JsonRpcProvider } from 'ethers';
import dotenv from 'dotenv';
dotenv.config();

const provider = new JsonRpcProvider(`https://sepolia.base.org`); // Base Sepolia RPC
const wallet = new Wallet(process.env.PRIVATE_KEY!, provider);
const USDC_ABI = ['function transfer(address to, uint256 amount) public returns (bool)']; // Simplified
const usdc = new ethers.Contract(process.env.USDC_ADDRESS!, USDC_ABI, wallet);

export async function fetchWithX402(url: string, signalPrice: number): Promise<any> {
  let response = await axios.get(url);
  if (response.status === 402) {
    const reqs = response.data.accepts[0];
    const payload = await createPaymentPayload(reqs, process.env.PRIVATE_KEY!); // Signs EIP-3009
    const xPayment = Buffer.from(JSON.stringify({
      x402Version: 1,
      scheme: reqs.scheme,
      network: reqs.network,
      payload
    })).toString('base64');

    // Pay and settle
    const payResponse = await axios.get(url, { headers: { 'X-PAYMENT': xPayment } });
    const settlement = JSON.parse(Buffer.from(payResponse.headers['x-payment-response'] || '', 'base64').toString());
    if (!settlement.success) throw new Error('Payment failed');

    // Retry fetch after payment
    response = await axios.get(url, { headers: { 'X-PAYMENT': xPayment } });
  }
  return response.data;
}