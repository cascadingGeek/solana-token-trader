import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { getMint } from "@solana/spl-token";

const SOLANA_RPC_URL =
  "https://solana-mainnet.g.alchemy.com/v2/RhBVSuyzHuc_bra75JaPW4P80NweRVvu";

class RPCService {
  private connection: Connection;
  private customRpcUrl?: string;

  constructor() {
    // Default to mainnet
    const defaultEndpoint = SOLANA_RPC_URL;
    this.connection = new Connection(defaultEndpoint);
  }

  setCustomRpcUrl(rpcUrl: string) {
    this.customRpcUrl = rpcUrl;
    this.connection = new Connection(rpcUrl);
  }

  resetToDefault() {
    this.customRpcUrl = undefined;
    const defaultEndpoint = SOLANA_RPC_URL;
    this.connection = new Connection(defaultEndpoint);
  }

  getConnection(): Connection {
    return this.connection;
  }

  getCurrentRpcUrl(): string {
    return this.customRpcUrl || SOLANA_RPC_URL;
  }

  async getBalance(publicKey: PublicKey): Promise<number> {
    return await this.connection.getBalance(publicKey);
  }

  async sendRawTransaction(txHash: any, opts: any): Promise<string> {
    return await this.connection.sendRawTransaction(txHash, opts);
  }

  async getTokenAccountBalance(publicKey: PublicKey): Promise<number | null> {
    return (await this.connection.getTokenAccountBalance(publicKey)).value
      .uiAmount;
  }

  async getTokenDecimals(mint: string): Promise<number> {
    if (mint === "So11111111111111111111111111111111111111112") {
      // tokenCache[mintAddress] = { decimals: 9 };
      return 9;
    }

    const mintInfo = await getMint(this.connection, new PublicKey(mint));

    return mintInfo.decimals;
  }

  async confirmTransaction(signature: string): Promise<any> {
    return await this.connection.getTransaction(signature, {
      maxSupportedTransactionVersion: 0,
    });
  }
}

export const rpcService = new RPCService();
