/**
 * Hive Engine API Service
 * Handles interactions with Hive Engine for custom tokens like PeakeCoin
 */

import axios from 'axios';
import { PeakeCoinReward } from '@/types/hive';

// Hive Engine API endpoints
const HIVE_ENGINE_API = 'https://api.hive-engine.com/rpc';
const HIVE_ENGINE_CONTRACTS_API = 'https://api.hive-engine.com/rpc/contracts';

export interface HiveEngineToken {
  symbol: string;
  name: string;
  balance: string;
  stake: string;
  delegationsIn: string;
  delegationsOut: string;
  pendingUnstake: string;
}

export interface TokenMarketData {
  symbol: string;
  volume: number;
  volumeExpiration: number;
  lastDayPrice: number;
  lastDayPriceExpiration: number;
  lastPrice: number;
  lowestAsk: number;
  highestBid: number;
  priceChangeHive: number;
  priceChangePercent: number;
}

export class HiveEngineService {
  private apiUrl: string;
  private contractsUrl: string;

  constructor() {
    this.apiUrl = HIVE_ENGINE_API;
    this.contractsUrl = HIVE_ENGINE_CONTRACTS_API;
  }

  /**
   * Get token balances for a Hive account
   */
  async getTokenBalances(account: string): Promise<HiveEngineToken[]> {
    try {
      const response = await axios.post(this.contractsUrl, {
        jsonrpc: '2.0',
        method: 'find',
        params: {
          contract: 'tokens',
          table: 'balances',
          query: { account },
          limit: 1000,
          offset: 0,
          indexes: []
        },
        id: 1
      });

      return response.data.result || [];
    } catch (error) {
      console.error('Error fetching token balances:', error);
      throw new Error(`Failed to fetch token balances for ${account}`);
    }
  }

  /**
   * Get specific PeakeCoin balance for an account
   */
  async getPeakeCoinBalance(account: string): Promise<number> {
    try {
      const balances = await this.getTokenBalances(account);
      const peakeToken = balances.find(token => token.symbol === 'PEAKE');
      return peakeToken ? parseFloat(peakeToken.balance) : 0;
    } catch (error) {
      console.error('Error fetching PeakeCoin balance:', error);
      return 0;
    }
  }

  /**
   * Get PeakeCoin staked balance
   */
  async getPeakeCoinStake(account: string): Promise<number> {
    try {
      const balances = await this.getTokenBalances(account);
      const peakeToken = balances.find(token => token.symbol === 'PEAKE');
      return peakeToken ? parseFloat(peakeToken.stake) : 0;
    } catch (error) {
      console.error('Error fetching PeakeCoin stake:', error);
      return 0;
    }
  }

  /**
   * Get token market data
   */
  async getTokenMarketData(symbol: string): Promise<TokenMarketData | null> {
    try {
      const response = await axios.post(this.contractsUrl, {
        jsonrpc: '2.0',
        method: 'findOne',
        params: {
          contract: 'market',
          table: 'metrics',
          query: { symbol }
        },
        id: 1
      });

      return response.data.result;
    } catch (error) {
      console.error('Error fetching token market data:', error);
      return null;
    }
  }

  /**
   * Get PeakeCoin price in HIVE
   */
  async getPeakeCoinPrice(): Promise<number> {
    try {
      const marketData = await this.getTokenMarketData('PEAKE');
      return marketData?.lastPrice || 0.05; // Default fallback price
    } catch (error) {
      console.error('Error fetching PeakeCoin price:', error);
      return 0.05; // Fallback price
    }
  }

  /**
   * Get token transaction history
   */
  async getTokenHistory(account: string, symbol?: string, limit: number = 50): Promise<any[]> {
    try {
      const query: any = { account };
      if (symbol) {
        query.symbol = symbol;
      }

      const response = await axios.post(this.contractsUrl, {
        jsonrpc: '2.0',
        method: 'find',
        params: {
          contract: 'tokens',
          table: 'transfers',
          query,
          limit,
          offset: 0,
          indexes: [{ index: '_id', descending: true }]
        },
        id: 1
      });

      return response.data.result || [];
    } catch (error) {
      console.error('Error fetching token history:', error);
      return [];
    }
  }

  /**
   * Calculate PeakeCoin rewards based on transaction efficiency
   */
  calculatePeakeCoinRewards(
    transactionType: string,
    amount: number,
    isBatch: boolean,
    userTier: 'professional' | 'enterprise' | 'business-critical'
  ): PeakeCoinReward {
    // Base reward rates
    const baseRates = {
      transfer: 1,
      transfer_to_vesting: 2,
      custom_json: 0.5,
      comment: 3,
      vote: 0.1
    };

    // Tier multipliers
    const tierMultipliers = {
      professional: 1.0,
      enterprise: 1.5,
      'business-critical': 2.0
    };

    // Batch processing bonus
    const batchMultiplier = isBatch ? 1.25 : 1.0;

    const baseReward = (baseRates[transactionType as keyof typeof baseRates] || 1) * Math.min(amount / 100, 10);
    const tierMultiplier = tierMultipliers[userTier];
    const totalReward = baseReward * tierMultiplier * batchMultiplier;

    return {
      transactionId: '', // Will be set when transaction is processed
      baseReward,
      multiplier: tierMultiplier * batchMultiplier,
      bonusType: isBatch ? 'batch' : 'volume',
      totalReward,
      timestamp: new Date()
    };
  }

  /**
   * Issue PeakeCoin rewards (requires admin privileges)
   */
  async issuePeakeCoinRewards(
    toAccount: string,
    amount: number,
    memo: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // This would typically be done through a server-side process
      // with proper authentication and admin privileges
      // For now, return a mock response
      
      console.log(`Would issue ${amount} PEAKE to ${toAccount} with memo: ${memo}`);
      
      return {
        success: true
      };
    } catch (error) {
      console.error('Error issuing PeakeCoin rewards:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get token info
   */
  async getTokenInfo(symbol: string): Promise<any> {
    try {
      const response = await axios.post(this.contractsUrl, {
        jsonrpc: '2.0',
        method: 'findOne',
        params: {
          contract: 'tokens',
          table: 'tokens',
          query: { symbol }
        },
        id: 1
      });

      return response.data.result;
    } catch (error) {
      console.error('Error fetching token info:', error);
      return null;
    }
  }

  /**
   * Get all available tokens
   */
  async getAllTokens(): Promise<any[]> {
    try {
      const response = await axios.post(this.contractsUrl, {
        jsonrpc: '2.0',
        method: 'find',
        params: {
          contract: 'tokens',
          table: 'tokens',
          query: {},
          limit: 1000,
          offset: 0,
          indexes: []
        },
        id: 1
      });

      return response.data.result || [];
    } catch (error) {
      console.error('Error fetching all tokens:', error);
      return [];
    }
  }

  /**
   * Check if PeakeCoin token exists and get its details
   */
  async initializePeakeCoin(): Promise<boolean> {
    try {
      const tokenInfo = await this.getTokenInfo('PEAKE');
      
      if (!tokenInfo) {
        console.warn('PeakeCoin (PEAKE) token not found on Hive Engine');
        console.log('Token would need to be created with proper parameters');
        return false;
      }

      console.log('PeakeCoin token found:', tokenInfo);
      return true;
    } catch (error) {
      console.error('Error initializing PeakeCoin:', error);
      return false;
    }
  }
}

// Export singleton instance
export const hiveEngine = new HiveEngineService();
