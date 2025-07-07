/**
 * Hive Blockchain API Service
 * Handles all interactions with the Hive blockchain
 */

import { Client, PrivateKey, cryptoUtils } from '@hiveio/dhive';
import { 
  HiveAccount, 
  HiveTransaction, 
  HiveTransactionHistory, 
  HiveAccountBalance,
  PeakeCoinReward,
  BatchTransaction,
  TransactionResult 
} from '@/types/hive';

// Hive API endpoints
const DEFAULT_RPC_ENDPOINTS = [
  'https://api.hive.blog',
  'https://api.hivekings.com',
  'https://anyx.io',
  'https://api.openhive.network'
];

export class HiveAPIService {
  private client: Client;
  private currentEndpoint: string;

  constructor(rpcEndpoints: string[] = DEFAULT_RPC_ENDPOINTS) {
    this.currentEndpoint = rpcEndpoints[0];
    this.client = new Client(this.currentEndpoint);
  }

  /**
   * Get account information from Hive blockchain
   */
  async getAccount(username: string): Promise<HiveAccount | null> {
    try {
      const accounts = await this.client.database.getAccounts([username]);
      if (accounts.length === 0) return null;

      const account = accounts[0];
      const balance = await this.getAccountBalance(username);

      return {
        id: account.id,
        name: account.name,
        displayName: account.json_metadata ? 
          JSON.parse(account.json_metadata).profile?.name || account.name : 
          account.name,
        reputation: this.calculateReputation(account.reputation),
        balance: balance,
        votingPower: account.voting_power / 100, // Convert to percentage
        resourceCredits: account.rc_manabar?.current_mana || 0,
        createdAt: account.created,
        lastActive: account.last_activity || account.last_post,
        postCount: account.post_count,
        followerCount: account.follower_count || 0,
        followingCount: account.following_count || 0,
        metadata: account.json_metadata ? JSON.parse(account.json_metadata) : {}
      };
    } catch (error) {
      console.error('Error fetching account:', error);
      throw new Error(`Failed to fetch account information for ${username}`);
    }
  }

  /**
   * Get account balance (HIVE, HBD, and PeakeCoin)
   */
  async getAccountBalance(username: string): Promise<HiveAccountBalance> {
    try {
      const account = await this.client.database.getAccounts([username]);
      if (account.length === 0) {
        throw new Error(`Account ${username} not found`);
      }

      const accountData = account[0];
      
      // Parse balances
      const hiveBalance = parseFloat(accountData.balance.split(' ')[0]);
      const hbdBalance = parseFloat(accountData.hbd_balance.split(' ')[0]);
      const hivePowerBalance = parseFloat(accountData.vesting_shares.split(' ')[0]);
      
      // Get savings balances
      const hiveSavings = parseFloat(accountData.savings_balance?.split(' ')[0] || '0');
      const hbdSavings = parseFloat(accountData.savings_hbd_balance?.split(' ')[0] || '0');

      // TODO: Implement PeakeCoin balance lookup from custom tokens
      const peakeCoinBalance = await this.getPeakeCoinBalance(username);

      return {
        hive: hiveBalance,
        hbd: hbdBalance,
        hivePower: hivePowerBalance,
        hiveSavings: hiveSavings,
        hbdSavings: hbdSavings,
        peakeCoin: peakeCoinBalance,
        estimatedValue: await this.calculateEstimatedValue(hiveBalance, hbdBalance, hivePowerBalance, peakeCoinBalance)
      };
    } catch (error) {
      console.error('Error fetching account balance:', error);
      throw new Error(`Failed to fetch balance for ${username}`);
    }
  }

  /**
   * Get transaction history for an account
   */
  async getTransactionHistory(username: string, limit: number = 50): Promise<HiveTransactionHistory> {
    try {
      const history = await this.client.database.getAccountHistory(username, -1, limit);
      
      const transactions: HiveTransaction[] = history.map(([id, op]) => ({
        id: id.toString(),
        type: op.op[0],
        timestamp: op.timestamp,
        from: this.extractFromAddress(op.op),
        to: this.extractToAddress(op.op),
        amount: this.extractAmount(op.op),
        currency: this.extractCurrency(op.op),
        memo: this.extractMemo(op.op),
        blockNumber: op.block,
        transactionId: op.trx_id,
        status: 'completed', // Hive transactions are final when included in history
        resourceCost: this.calculateResourceCost(op.op),
        metadata: op.op[1]
      }));

      return {
        transactions,
        totalCount: history.length,
        hasMore: history.length === limit
      };
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      throw new Error(`Failed to fetch transaction history for ${username}`);
    }
  }

  /**
   * Get PeakeCoin balance (custom implementation)
   */
  async getPeakeCoinBalance(username: string): Promise<number> {
    try {
      // TODO: Implement actual PeakeCoin balance lookup
      // This would typically involve:
      // 1. Querying a custom smart contract or token system
      // 2. Looking up balance in a side database
      // 3. Calculating based on activity/rewards
      
      // For now, return a calculated value based on account activity
      const account = await this.client.database.getAccounts([username]);
      if (account.length === 0) return 0;

      const accountData = account[0];
      const baseBalance = (accountData.post_count * 10) + (accountData.follower_count * 5);
      
      return Math.min(baseBalance, 10000); // Cap at 10k for demo
    } catch (error) {
      console.error('Error fetching PeakeCoin balance:', error);
      return 0;
    }
  }

  /**
   * Calculate estimated USD value of all holdings
   */
  async calculateEstimatedValue(hive: number, hbd: number, hivePower: number, peakeCoin: number): Promise<number> {
    try {
      // TODO: Implement real price fetching from exchanges
      // For now, use approximate values
      const hivePrice = 0.35; // USD
      const hbdPrice = 1.00; // USD (pegged to USD)
      const peakeCoinPrice = 0.05; // USD (estimated)

      return (hive * hivePrice) + (hbd * hbdPrice) + (hivePower * hivePrice) + (peakeCoin * peakeCoinPrice);
    } catch (error) {
      console.error('Error calculating estimated value:', error);
      return 0;
    }
  }

  /**
   * Submit a transaction to the Hive blockchain
   */
  async submitTransaction(transaction: BatchTransaction): Promise<TransactionResult> {
    try {
      // Note: This method requires private key or keychain integration
      // For security, transactions should be signed via HiveKeychain
      throw new Error('Direct transaction submission not implemented. Use HiveKeychain for signing.');
    } catch (error) {
      console.error('Error submitting transaction:', error);
      return {
        success: false,
        transactionId: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Process batch transactions
   */
  async processBatchTransactions(transactions: BatchTransaction[]): Promise<TransactionResult[]> {
    const results: TransactionResult[] = [];
    
    for (const transaction of transactions) {
      try {
        const result = await this.submitTransaction(transaction);
        results.push(result);
        
        // Add delay between transactions to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        results.push({
          success: false,
          transactionId: '',
          error: error instanceof Error ? error.message : 'Unknown error occurred'
        });
      }
    }
    
    return results;
  }

  /**
   * Calculate reputation score from raw reputation
   */
  private calculateReputation(rawReputation: string | number): number {
    const rep = typeof rawReputation === 'string' ? parseInt(rawReputation) : rawReputation;
    if (rep === 0) return 25;
    
    const score = Math.log10(Math.abs(rep)) - 9;
    return Math.max(Math.floor(score * 9 + 25), 1);
  }

  /**
   * Extract sender address from operation
   */
  private extractFromAddress(op: any): string {
    const [opType, opData] = op;
    switch (opType) {
      case 'transfer':
        return opData.from;
      case 'transfer_to_vesting':
        return opData.from;
      case 'withdraw_vesting':
        return opData.account;
      default:
        return opData.from || opData.account || '';
    }
  }

  /**
   * Extract recipient address from operation
   */
  private extractToAddress(op: any): string {
    const [opType, opData] = op;
    switch (opType) {
      case 'transfer':
        return opData.to;
      case 'transfer_to_vesting':
        return opData.to;
      default:
        return opData.to || '';
    }
  }

  /**
   * Extract amount from operation
   */
  private extractAmount(op: any): number {
    const [opType, opData] = op;
    if (opData.amount) {
      return parseFloat(opData.amount.split(' ')[0]);
    }
    return 0;
  }

  /**
   * Extract currency from operation
   */
  private extractCurrency(op: any): string {
    const [opType, opData] = op;
    if (opData.amount) {
      return opData.amount.split(' ')[1];
    }
    return 'HIVE';
  }

  /**
   * Extract memo from operation
   */
  private extractMemo(op: any): string {
    const [opType, opData] = op;
    return opData.memo || '';
  }

  /**
   * Calculate resource cost for operation
   */
  private calculateResourceCost(op: any): number {
    const [opType] = op;
    // Approximate RC costs for different operations
    switch (opType) {
      case 'transfer':
        return 100;
      case 'transfer_to_vesting':
        return 150;
      case 'comment':
        return 500;
      case 'vote':
        return 50;
      default:
        return 10;
    }
  }

  /**
   * Switch to a different RPC endpoint
   */
  async switchEndpoint(endpoint: string): Promise<void> {
    this.currentEndpoint = endpoint;
    this.client = new Client(endpoint);
  }

  /**
   * Get current blockchain info
   */
  async getBlockchainInfo() {
    try {
      const props = await this.client.database.getDynamicGlobalProperties();
      return {
        headBlockNumber: props.head_block_number,
        lastIrreversibleBlockNum: props.last_irreversible_block_num,
        totalVestingShares: props.total_vesting_shares,
        totalVestingFundHive: props.total_vesting_fund_hive,
        currentSupply: props.current_supply,
        virtualSupply: props.virtual_supply
      };
    } catch (error) {
      console.error('Error fetching blockchain info:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const hiveAPI = new HiveAPIService();
