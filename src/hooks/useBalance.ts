import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getAssociatedTokenAddress, getAccount } from "@solana/spl-token";
import { rpcService } from "../services/rpcService";

export const useBalance = (tokenMint?: string) => {
  const { publicKey } = useWallet();
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!publicKey) {
        setSolBalance(null);
        setTokenBalance(null);
        return;
      }

      setLoading(true);
      try {
        // Fetch SOL balance
        const balance = await rpcService.getBalance(publicKey);
        setSolBalance(balance / LAMPORTS_PER_SOL);

        // Fetch token balance if tokenMint is provided
        if (tokenMint) {
          try {
            const mintPublicKey = new PublicKey(tokenMint);
            const associatedTokenAddress = await getAssociatedTokenAddress(
              mintPublicKey,
              publicKey
            );

            const balance = await rpcService.getTokenAccountBalance(
              associatedTokenAddress
            );
            setTokenBalance(balance);
          } catch (error) {
            // Token account doesn't exist or other error
            setTokenBalance(0);
          }
        } else {
          setTokenBalance(null);
        }
      } catch (error) {
        console.error("Error fetching balances:", error);
        setSolBalance(null);
        setTokenBalance(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
  }, [publicKey, tokenMint]);

  return { solBalance, tokenBalance, loading, refresh: () => setLoading(true) };
};
