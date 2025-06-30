# Solana Token Trader

A React frontend application for trading Solana tokens using multiple DEX protocols. This application connects to your Solana Token Trading API to provide real-time rate comparisons and execute trades across PumpSwap, Pump.fun, Orca Whirlpool, and Raydium V4.

## Features

- 🔗 **Wallet Connection**: Connect using Phantom, Solflare, or Torus wallets
- 💰 **Balance Display**: View SOL and token balances in real-time
- 📊 **Rate Comparison**: Compare rates across multiple DEX protocols
- 🔄 **Buy/Sell Trading**: Execute buy and sell transactions
- ⚡ **Real-time Updates**: Automatic rate fetching and balance updates
- 🎯 **Configurable Slippage**: Adjust slippage tolerance for trades

## Setup

### Prerequisites

- Node.js 16+ and npm
- Your Solana Token Trading API running
- API key for your trading backend

### Installation

1. **Clone and install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API configuration:
   ```
   REACT_APP_API_BASE_URL=https://your-api-domain.com
   REACT_APP_API_KEY=your_api_key_here
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

## Usage

### Connecting Your Wallet

1. Click "Select Wallet" in the top-right corner
2. Choose your preferred wallet (Phantom, Solflare, or Torus)
3. Approve the connection in your wallet

### Trading Tokens

1. **Enter Token Address**: Paste the Solana token mint address you want to trade
2. **View Balances**: Your SOL and token balances will display automatically
3. **Set Amount**: Enter the amount you want to buy/sell
4. **Choose Action**: Select "Buy" or "Sell"
5. **Adjust Slippage**: Set your preferred slippage tolerance (default: 15%)
6. **Compare Rates**: The app will fetch rates from all supported DEX protocols
7. **Select Protocol**: Choose the best rate or your preferred protocol
8. **Execute Trade**: Click the trade button and sign the transaction in your wallet

### Supported Protocols

- **PumpSwap**: `pumpswap:solana`
- **Pump.fun**: `pump.fun:solana`
- **Orca Whirlpool**: `orca_whirlpool:solana`
- **Raydium V4**: `raydiumv4:solana`

## Project Structure

```
src/
├── components/          # React components
│   ├── BalanceDisplay.tsx    # SOL and token balance display
│   ├── RateDisplay.tsx       # Multi-protocol rate comparison
│   ├── TradeForm.tsx         # Main trading interface
│   └── WalletButton.tsx      # Wallet connection button
├── contexts/
│   └── WalletContext.tsx     # Solana wallet adapter setup
├── hooks/
│   └── useBalance.ts         # Balance fetching hook
├── services/
│   └── api.ts               # API service for backend calls
└── App.tsx                  # Main application component
```

## API Integration

The frontend integrates with your Solana Token Trading API using these endpoints:

- `POST /trade/rate` - Fetch rate information across protocols
- `POST /trade/` - Generate signed transactions for execution

## Available Scripts

- `npm start` - Start development server
- `npm test` - Run test suite
- `npm run build` - Build for production
- `npm run eject` - Eject from Create React App (not recommended)

## Security Notes

- Environment variables are used to store API credentials
- Private keys never leave your wallet
- All transactions are signed locally in your browser
- API keys should be kept secure and not exposed in client code

## Troubleshooting

### Common Issues

1. **Wallet Connection Failed**
   - Ensure your wallet extension is installed and unlocked
   - Try refreshing the page and reconnecting

2. **Rate Fetching Errors**
   - Verify your API key and base URL in `.env`
   - Check that your backend API is running and accessible

3. **Transaction Failures**
   - Ensure you have sufficient SOL for transaction fees
   - Check that slippage tolerance is appropriate for market conditions
   - Verify the token address is valid

4. **Balance Not Updating**
   - Try refreshing the page
   - Ensure your wallet is connected to Mainnet
   - Check that the token address is correct

## Development

This project uses:
- **React 18** with TypeScript
- **Solana Wallet Adapter** for wallet integration
- **@solana/web3.js** for Solana blockchain interaction
- **@solana/spl-token** for token operations
- **Axios** for API communication

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request