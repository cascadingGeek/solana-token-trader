import React, { useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { VersionedTransaction } from "@solana/web3.js";
import { apiService, RateResponse } from "../services/api";
import { RateDisplay } from "./RateDisplay";
import { BalanceDisplay } from "./BalanceDisplay";
import { formatUnits, parseUnits } from "ethers";
import { rpcService } from "../services/rpcService";
import { sleep } from "../services/utils";

export const TradeForm: React.FC = () => {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();

  const [tokenAddress, setTokenAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [action, setAction] = useState<"buy" | "sell">("buy");
  const [slippage, setSlippage] = useState("15");
  const [rates, setRates] = useState<RateResponse[]>([]);
  const [selectedProtocol, setSelectedProtocol] = useState("");

  const [loadingRates, setLoadingRates] = useState(false);
  const [loadingTrade, setLoadingTrade] = useState(false);
  const [rateError, setRateError] = useState<string | undefined>();
  const [tradeStatus, setTradeStatus] = useState<string>("");

  const fetchRates = async () => {
    if (!tokenAddress || !amount || !publicKey) return;

    setLoadingRates(true);
    setRateError(undefined);

    try {
      const tokenDecimal = await rpcService.getTokenDecimals(tokenAddress);

      const rateData = await apiService.getRate({
        token: tokenAddress,
        amount:
          action === "buy"
            ? (parseFloat(amount) * 1e9).toString()
            : parseUnits(amount, tokenDecimal).toString(),
        action,
        slippage,
        publicKey: publicKey.toString(),
      });

      setRates(rateData);
      if (rateData.length > 0) {
        setSelectedProtocol(rateData[0].protocolIdentifier);
      }
    } catch (error) {
      setRateError(
        error instanceof Error ? error.message : "Failed to fetch rates"
      );
      setRates([]);
    } finally {
      setLoadingRates(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (tokenAddress && amount && publicKey) {
        fetchRates();
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [tokenAddress, amount, action, slippage, publicKey]);

  const executeTrade = async () => {
    if (!publicKey || !signTransaction) {
      setTradeStatus("Wallet not connected");
      return;
    }

    if (!tokenAddress || !amount) {
      setTradeStatus("Please enter token address and amount");
      return;
    }

    setLoadingTrade(true);
    setTradeStatus("Generating transaction...");

    try {
      const tokenDecimal = await rpcService.getTokenDecimals(tokenAddress);
      const tradeData = await apiService.generateTrade({
        protocolIdentifier: selectedProtocol,
        token: tokenAddress,
        amount:
          action === "buy"
            ? (parseFloat(amount) * 1e9).toString()
            : parseUnits(amount, tokenDecimal).toString(),
        publicKey: publicKey.toString(),
        action,
        slippage,
        solPriorityFee: "0.001",
      });

      setTradeStatus("Please sign the transaction...");

      const serializedTransactionBuffer = Buffer.from(tradeData.txn, "base64");

      if (tradeData.type === "v0") {
        const transaction = VersionedTransaction.deserialize(
          serializedTransactionBuffer
        );
        const signedTransaction = await signTransaction(transaction);

        setTradeStatus("Sending transaction...");

        const signature = await rpcService.sendRawTransaction(
          signedTransaction.serialize(),
          { skipPreflight: true }
        );

        setTradeStatus("Confirming transaction...");

        await sleep(3); //just to give time for the transaction to be confirmed

        await rpcService.confirmTransaction(signature);

        setTradeStatus(`Transaction confirmed! Signature: ${signature}`);

        // Reset form
        setTimeout(() => {
          setTradeStatus("");
          fetchRates(); // Refresh rates
        }, 5000);
      } else {
        throw new Error("Only v0 transactions are supported");
      }
    } catch (error) {
      setTradeStatus(
        `Trade failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      setTimeout(() => setTradeStatus(""), 5000);
    } finally {
      setLoadingTrade(false);
    }
  };

  return (
    <div className="trade-form">
      <h2>Solana Token Trader</h2>

      <BalanceDisplay tokenMint={tokenAddress} />

      <div className="form-group">
        <label htmlFor="tokenAddress">Token Address:</label>
        <input
          id="tokenAddress"
          type="text"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          placeholder="Enter token mint address"
        />
      </div>

      <div className="form-group">
        <label htmlFor="amount">Amount:</label>
        <input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={action === "buy" ? "Amount in SOL" : "Amount in tokens"}
        />
      </div>

      <div className="form-group">
        <label htmlFor="action">Action:</label>
        <select
          id="action"
          value={action}
          onChange={(e) => setAction(e.target.value as "buy" | "sell")}
        >
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="slippage">Slippage (%):</label>
        <input
          id="slippage"
          type="number"
          value={slippage}
          onChange={(e) => setSlippage(e.target.value)}
          min="0"
          max="100"
          step="0.1"
        />
      </div>

      <RateDisplay rates={rates} loading={loadingRates} error={rateError} />

      {rates.length > 0 && (
        <div className="form-group">
          <label htmlFor="protocol">Select Protocol:</label>
          <select
            id="protocol"
            value={selectedProtocol}
            onChange={(e) => setSelectedProtocol(e.target.value)}
          >
            {rates.map((rate) => (
              <option
                key={rate.protocolIdentifier}
                value={rate.protocolIdentifier}
              >
                {rate.protocolIdentifier} -{" "}
                {formatUnits(rate.expectedOutput, rate.tokenDecimals)} tokens
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        onClick={executeTrade}
        disabled={!publicKey || loadingTrade || rates.length === 0}
        className="trade-button"
      >
        {loadingTrade ? "Processing..." : `${action.toUpperCase()} Token`}
      </button>

      {tradeStatus && (
        <div
          className={`trade-status ${
            tradeStatus.includes("failed") || tradeStatus.includes("Error")
              ? "error"
              : ""
          }`}
        >
          {tradeStatus}
        </div>
      )}
    </div>
  );
};
