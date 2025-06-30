import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://your-api-domain.com';
const API_KEY = process.env.REACT_APP_API_KEY || 'your_api_key_here';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY,
  },
});

export interface TradeRequest {
  protocolIdentifier?: string;
  token: string;
  amount: string;
  publicKey: string;
  action: 'buy' | 'sell';
  slippage?: string;
  paymentToken?: string;
  solPriorityFee?: string;
  enableValidation?: boolean;
  feePercentage?: number;
  feeAccount?: string;
}

export interface RateRequest {
  protocolIdentifier?: string;
  token: string;
  amount: string;
  action: 'buy' | 'sell';
  paymentToken?: string;
  slippage?: string;
  publicKey: string;
}

export interface RateResponse {
  expectedOutput: string;
  priceImpact: string;
  minimumReceived: string;
  protocolIdentifier: string;
  tokenDecimals: number;
}

export interface TradeResponse {
  txn: string;
  type: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export const apiService = {
  async getRate(request: RateRequest): Promise<RateResponse[]> {
    const response = await api.post<ApiResponse<RateResponse[]>>('/trade/rate', request);
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    return response.data.data;
  },

  async generateTrade(request: TradeRequest): Promise<TradeResponse> {
    const response = await api.post<ApiResponse<TradeResponse>>('/trade/', request);
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    return response.data.data;
  },
};