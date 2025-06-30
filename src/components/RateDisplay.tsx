import React from "react";
import { RateResponse } from "../services/api";
import { formatUnits } from "ethers";

interface RateDisplayProps {
  rates: RateResponse[];
  loading: boolean;
  error?: string;
}

export const RateDisplay: React.FC<RateDisplayProps> = ({
  rates,
  loading,
  error,
}) => {
  if (loading) {
    return (
      <div className="rate-display">
        <h3>Fetching rates...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rate-display error">
        <h3>Error fetching rates</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (rates.length === 0) {
    return null;
  }

  return (
    <div className="rate-display">
      <h3>Available Rates</h3>
      {rates.map((rate, index) => (
        <div key={index} className="rate-item">
          <div className="rate-protocol">
            <strong>{rate.protocolIdentifier}</strong>
          </div>
          <div className="rate-details">
            <div className="rate-detail">
              <span className="label">Expected Output:</span>
              <span className="value">
                {formatUnits(rate.expectedOutput, rate.tokenDecimals)}
              </span>
            </div>

            <div className="rate-detail">
              <span className="label">Minimum Received:</span>
              <span className="value">
                {formatUnits(rate.minimumReceived, rate.tokenDecimals)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
