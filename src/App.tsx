import React from 'react';
import { WalletContextProvider } from './contexts/WalletContext';
import { WalletButton } from './components/WalletButton';
import { TradeForm } from './components/TradeForm';
import './App.css';

function App() {
  return (
    <WalletContextProvider>
      <div className="App">
        <header className="App-header">
          <h1>Solana Token Trader</h1>
          <WalletButton />
        </header>
        <main className="App-main">
          <TradeForm />
        </main>
      </div>
    </WalletContextProvider>
  );
}

export default App;
