# x402 AI Trading Bot
Autonomous bot that pays for AI signals via x402 and executes trades.
This is complete, open-source starter project for an AI Trading Bot that autonomously pays for premium trading signals/data using the x402 protocol. This is inspired by projects like AIXBT in the x402 ecosystem but fully custom and self-contained.

## Core Functionality
 - The bot fetches paid signals (e.g., AI-generated BTC price predictions) from a mock provider via x402 micropayments (~$0.01 USDC per signal on Base testnet).
 - Uses a simple "AI" decision engine (rule-based with moving averages from free data + paid signal) to simulate trades (buy/sell BTC).
 - Integrates Coinbase Advanced Trade API for real/simulated trades (use sandbox for testing).
 - Handles x402 payments autonomously: Detects 402 response, pays USDC, verifies settlement, then accesses data.

## Tech Stack
 - Node.js/TypeScript (for x402 compatibility).
 - @x402/client and @x402/server from Coinbase's repo.
 - Axios for HTTP, Ethers.js for wallet/on-chain.
 - Simple AI: Custom logic using TA-Lib (via node-talib) for technical indicators.

## Chain
 Base Sepolia testnet (chain ID 84532) for dev; easy swap to mainnet.

## Risks
 This is educational—simulates trades only. Real trading involves losses; test with tiny amounts. Not financial advice.

## Cost
 ~$0.0001 per x402 tx on Base; $0.01 per signal.

## Setup
1. `npm install`
2. Copy `.env.example` to `.env` and configure (use Base Sepolia faucet for test USDC).
3. `npm run provider` (start mock signals server).
4. `npm start` (run bot).

