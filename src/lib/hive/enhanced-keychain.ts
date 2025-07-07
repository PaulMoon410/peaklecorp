/**
 * Enhanced Hive Keychain Integration Service
 * Comprehensive service for HiveKeychain browser extension and Hive Engine integration
 */

import { hiveEngine } from './engine';

// Extend Window interface for Hive Keychain
declare global {
  interface Window {
    hive_keychain?: {
      isInstalled?: boolean;
      requestHandshake: (callback: () => void) => void;
      requestSignBuffer: (username: string, message: string, method: string, callback: (response: any) => void) => void;
      requestTransfer: (username: string, to: string, amount: string, memo: string, currency: string, callback: (response: any) => void) => void;
      requestPowerUp: (username: string, to: string, amount: string, callback: (response: any) => void) => void;
      requestCustomJson: (username: string, id: string, method: string, json: string, displayName: string, callback: (response: any) => void) => void;
      requestBroadcast: (username: string, operations: any[], method: string, callback: (response: any) => void) => void;
      requestAddAccountAuthority: (username: string, authorizedUsername: string, role: string, weight: number, callback: (response: any) => void) => void;
    };
  }
}

export interface KeychainResponse {
  success: boolean;
  message?: string;
  result?: any;
  error?: string;
  data?: any;
}

export interface BatchReward {
  to: string;
  amount: string;
  memo: string;
}

export interface CorporateTransaction {
  to: string;
  amount: string;
  currency: 'HIVE' | 'HBD';
  memo: string;
  category: 'payroll' | 'expense' | 'procurement' | 'treasury';
}

export interface AuthenticationData {
  username: string;
  timestamp: number;
  signature: string;
}

export class EnhancedHiveKeychainService {
  private static instance: EnhancedHiveKeychainService;
  private isAvailable: boolean = false;
  private currentUser: string | null = null;
  private isInitialized: boolean = false;
  private authData: AuthenticationData | null = null;

  private constructor() {
    this.initialize();
  }

  public static getInstance(): EnhancedHiveKeychainService {
    if (!EnhancedHiveKeychainService.instance) {
      EnhancedHiveKeychainService.instance = new EnhancedHiveKeychainService();
    }
    return EnhancedHiveKeychainService.instance;
  }

  /**
   * Initialize the service and check for Keychain availability
   */
  private async initialize(): Promise<void> {
    if (typeof window === 'undefined') return;
    
    // Check if already loaded
    if (window.hive_keychain?.isInstalled) {
      this.isAvailable = true;
      this.isInitialized = true;
      this.loadAuthenticationData();
      return;
    }

    // Wait for extension to load
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds
    
    while (attempts < maxAttempts && !window.hive_keychain?.isInstalled) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }

    this.isAvailable = !!window.hive_keychain?.isInstalled;
    this.isInitialized = true;
    
    if (this.isAvailable) {
      this.loadAuthenticationData();
    }
  }

  /**
   * Load stored authentication data
   */
  private loadAuthenticationData(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem('peakecorp_auth');
      if (stored) {
        this.authData = JSON.parse(stored);
        this.currentUser = this.authData?.username || null;
      }
    } catch (error) {
      console.error('Error loading authentication data:', error);
    }
  }

  /**
   * Save authentication data
   */
  private saveAuthenticationData(data: AuthenticationData): void {
    if (typeof window === 'undefined') return;
    
    this.authData = data;
    this.currentUser = data.username;
    localStorage.setItem('peakecorp_auth', JSON.stringify(data));
  }

  /**
   * Ensure service is initialized
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }
  }

  /**
   * Get keychain availability status
   */
  async isKeychainAvailable(): Promise<boolean> {
    await this.ensureInitialized();
    return this.isAvailable;
  }

  /**
   * Request handshake with Keychain
   */
  async requestHandshake(): Promise<KeychainResponse> {
    await this.ensureInitialized();
    
    if (!this.isAvailable) {
      return {
        success: false,
        error: 'Hive Keychain extension not found. Please install it from the Chrome Web Store or Firefox Add-ons.'
      };
    }

    return new Promise((resolve) => {
      window.hive_keychain!.requestHandshake(() => {
        resolve({ success: true, message: 'Keychain handshake successful' });
      });
    });
  }

  /**
   * Authenticate user with enterprise-grade security
   */
  async authenticateUser(username: string, requireActive: boolean = false): Promise<KeychainResponse> {
    await this.ensureInitialized();
    
    if (!this.isAvailable) {
      return {
        success: false,
        error: 'Hive Keychain not available'
      };
    }

    const timestamp = Date.now();
    const nonce = Math.random().toString(36).substring(2);
    const message = `PeakeCorp Enterprise Authentication\nTimestamp: ${timestamp}\nNonce: ${nonce}\nSecurity Level: ${requireActive ? 'High' : 'Standard'}`;
    const method = requireActive ? 'Active' : 'Posting';

    return new Promise((resolve) => {
      window.hive_keychain!.requestSignBuffer(
        username,
        message,
        method,
        (response: KeychainResponse) => {
          if (response.success) {
            const authData: AuthenticationData = {
              username,
              timestamp,
              signature: response.result
            };
            this.saveAuthenticationData(authData);
          }
          resolve(response);
        }
      );
    });
  }

  /**
   * Check if current authentication is valid
   */
  isAuthenticated(): boolean {
    if (!this.authData) return false;
    
    const now = Date.now();
    const maxAge = 8 * 60 * 60 * 1000; // 8 hours for enterprise security
    
    return (now - this.authData.timestamp) < maxAge;
  }

  /**
   * Get current authenticated user
   */
  getCurrentUser(): string | null {
    return this.isAuthenticated() ? this.currentUser : null;
  }

  /**
   * Sign out current user
   */
  signOut(): void {
    this.currentUser = null;
    this.authData = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('peakecorp_auth');
    }
  }

  /**
   * Execute HIVE/HBD transfer
   */
  async transfer(
    username: string,
    to: string,
    amount: string,
    memo: string,
    currency: 'HIVE' | 'HBD' = 'HIVE'
  ): Promise<KeychainResponse> {
    await this.ensureInitialized();
    
    if (!this.isAvailable) {
      return { success: false, error: 'Hive Keychain not available' };
    }

    return new Promise((resolve) => {
      window.hive_keychain!.requestTransfer(
        username,
        to,
        amount,
        memo,
        currency,
        (response: KeychainResponse) => resolve(response)
      );
    });
  }

  /**
   * Power up HIVE to Hive Power
   */
  async powerUp(username: string, to: string, amount: string): Promise<KeychainResponse> {
    await this.ensureInitialized();
    
    if (!this.isAvailable) {
      return { success: false, error: 'Hive Keychain not available' };
    }

    return new Promise((resolve) => {
      window.hive_keychain!.requestPowerUp(
        username,
        to,
        amount,
        (response: KeychainResponse) => resolve(response)
      );
    });
  }

  /**
   * Execute custom JSON operation for Hive Engine
   */
  async customJson(
    username: string,
    id: string,
    json: any,
    displayName: string,
    method: 'Posting' | 'Active' = 'Posting'
  ): Promise<KeychainResponse> {
    await this.ensureInitialized();
    
    if (!this.isAvailable) {
      return { success: false, error: 'Hive Keychain not available' };
    }

    return new Promise((resolve) => {
      window.hive_keychain!.requestCustomJson(
        username,
        id,
        method,
        JSON.stringify(json),
        displayName,
        (response: KeychainResponse) => resolve(response)
      );
    });
  }

  /**
   * Transfer Hive Engine tokens (including PeakeCoin)
   */
  async transferToken(
    username: string,
    to: string,
    amount: string,
    symbol: string,
    memo: string = ''
  ): Promise<KeychainResponse> {
    const json = {
      contractName: 'tokens',
      contractAction: 'transfer',
      contractPayload: {
        symbol,
        to,
        quantity: amount,
        memo
      }
    };

    return this.customJson(
      username,
      'ssc-mainnet-hive',
      json,
      `Transfer ${amount} ${symbol} to ${to}`
    );
  }

  /**
   * Stake Hive Engine tokens
   */
  async stakeToken(
    username: string,
    amount: string,
    symbol: string
  ): Promise<KeychainResponse> {
    const json = {
      contractName: 'tokens',
      contractAction: 'stake',
      contractPayload: {
        to: username,
        symbol,
        quantity: amount
      }
    };

    return this.customJson(
      username,
      'ssc-mainnet-hive',
      json,
      `Stake ${amount} ${symbol}`
    );
  }

  /**
   * Unstake Hive Engine tokens
   */
  async unstakeToken(
    username: string,
    amount: string,
    symbol: string
  ): Promise<KeychainResponse> {
    const json = {
      contractName: 'tokens',
      contractAction: 'unstake',
      contractPayload: {
        symbol,
        quantity: amount
      }
    };

    return this.customJson(
      username,
      'ssc-mainnet-hive',
      json,
      `Unstake ${amount} ${symbol}`
    );
  }

  /**
   * Distribute PeakeCoin rewards in batch
   */
  async distributePeakeCoinRewards(
    username: string,
    rewards: BatchReward[]
  ): Promise<KeychainResponse[]> {
    const results: KeychainResponse[] = [];
    
    for (const reward of rewards) {
      try {
        const result = await this.transferToken(
          username,
          reward.to,
          reward.amount,
          'PEAKE',
          reward.memo
        );
        results.push(result);
        
        // Enterprise-grade rate limiting
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return results;
  }

  /**
   * Execute corporate workflow transactions
   */
  async executeCorporateWorkflow(
    username: string,
    workflowType: 'payroll' | 'expense' | 'procurement' | 'treasury',
    transactions: CorporateTransaction[]
  ): Promise<KeychainResponse[]> {
    const results: KeychainResponse[] = [];
    
    for (const tx of transactions) {
      try {
        const memoWithCategory = `[${workflowType.toUpperCase()}] ${tx.memo}`;
        const result = await this.transfer(
          username,
          tx.to,
          tx.amount,
          memoWithCategory,
          tx.currency
        );
        results.push(result);
        
        // Compliance-safe delays
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error.message : 'Transaction failed'
        });
      }
    }
    
    return results;
  }

  /**
   * Calculate and distribute corporate efficiency rewards
   */
  async distributeCorporateEfficiencyRewards(
    corporateAccount: string,
    employeeAccounts: string[],
    transactionVolume: number,
    efficiencyScore: number,
    complianceBonus: number = 0
  ): Promise<KeychainResponse[]> {
    // Enterprise reward calculation
    const baseRewardRate = 0.015; // 1.5% of transaction volume
    const baseReward = Math.floor(transactionVolume * baseRewardRate);
    const efficiencyBonus = Math.floor(baseReward * (efficiencyScore / 100));
    const totalRewards = baseReward + efficiencyBonus + complianceBonus;
    
    // Fair distribution among employees
    const rewardPerEmployee = Math.floor(totalRewards / employeeAccounts.length);
    
    if (rewardPerEmployee < 1) {
      return [{
        success: false,
        error: 'Insufficient rewards to distribute'
      }];
    }

    const rewards: BatchReward[] = employeeAccounts.map(account => ({
      to: account,
      amount: rewardPerEmployee.toString(),
      memo: `PeakeCorp Efficiency Reward - Volume: ${transactionVolume}, Score: ${efficiencyScore}%, Compliance: +${complianceBonus}`
    }));

    return this.distributePeakeCoinRewards(corporateAccount, rewards);
  }

  /**
   * Get comprehensive user balance including PeakeCoin
   */
  async getUserBalance(username: string): Promise<{
    hive: number;
    hbd: number;
    peakeCoin: number;
    peakeCoinStaked: number;
    estimatedValue: number;
  }> {
    try {
      const [peakeCoinBalance, peakeCoinStaked] = await Promise.all([
        hiveEngine.getPeakeCoinBalance(username),
        hiveEngine.getPeakeCoinStake(username)
      ]);

      // Note: HIVE/HBD balances would come from main Hive API
      return {
        hive: 0, // Would be fetched from Hive API
        hbd: 0,  // Would be fetched from Hive API
        peakeCoin: peakeCoinBalance,
        peakeCoinStaked: peakeCoinStaked,
        estimatedValue: peakeCoinBalance * 0.05 // Estimated PeakeCoin value
      };
    } catch (error) {
      console.error('Error fetching user balance:', error);
      return {
        hive: 0,
        hbd: 0,
        peakeCoin: 0,
        peakeCoinStaked: 0,
        estimatedValue: 0
      };
    }
  }

  /**
   * Create enterprise audit trail for transactions
   */
  async createAuditTrail(
    transactionId: string,
    transactionType: string,
    amount: number,
    participants: string[],
    complianceLevel: 'SOX' | 'GAAP' | 'IFRS' | 'INTERNAL'
  ): Promise<{
    auditId: string;
    timestamp: number;
    hash: string;
  }> {
    const auditRecord = {
      transactionId,
      transactionType,
      amount,
      participants,
      complianceLevel,
      timestamp: Date.now(),
      creator: this.currentUser
    };

    // In a real implementation, this would be stored securely
    const auditId = `audit_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    const hash = btoa(JSON.stringify(auditRecord)); // Simple hash for demo

    return {
      auditId,
      timestamp: auditRecord.timestamp,
      hash
    };
  }
}

// Export singleton instance
export const enhancedHiveKeychain = EnhancedHiveKeychainService.getInstance();
