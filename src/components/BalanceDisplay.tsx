import React from 'react';
import { useBalance } from '../hooks/useBalance';

interface BalanceDisplayProps {
  tokenMint?: string;
}

export const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ tokenMint }) => {
  const { solBalance, tokenBalance, loading } = useBalance(tokenMint);

  if (loading) {
    return (
      <div className="balance-display">
        <div className="balance-item">Loading balances...</div>
      </div>
    );
  }

  return (
    <div className="balance-display">
      <div className="balance-item">
        <span className="balance-label">SOL Balance:</span>
        <span className="balance-value">
          {solBalance !== null ? `${solBalance.toFixed(4)} SOL` : 'N/A'}
        </span>
      </div>
      {tokenMint && (
        <div className="balance-item">
          <span className="balance-label">Token Balance:</span>
          <span className="balance-value">
            {tokenBalance !== null ? tokenBalance.toLocaleString() : 'N/A'}
          </span>
        </div>
      )}
    </div>
  );
};