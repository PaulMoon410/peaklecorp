/**
 * HiveKeychain Integration
 * Handles browser extension connection, authentication, and transaction signing
 */

import {
  HiveAccount,
  HiveTransaction,
  HiveKeychainRequestResponse,
} from "@/types/hive";

declare global {
  interface Window {
    hive_keychain?: {
      isInstalled?: boolean;
      requestSignBuffer: (
        username: string,
        message: string,
        method: string,
        callback: (response: HiveKeychainRequestResponse) => void
      ) => void;
      requestBroadcast: (
        username: string,
        operations: any[],
        method: string,
        callback: (response: HiveKeychainRequestResponse) => void
      ) => void;
      requestSignTx: (
        username: string,
        tx: any,
        method: string,
        callback: (response: HiveKeychainRequestResponse) => void
      ) => void;
      requestTransfer: (
        username: string,
        to: string,
        amount: string,
        memo: string,
        currency: string,
        callback: (response: HiveKeychainRequestResponse) => void
      ) => void;
      requestAddAccountAuthority: (
        username: string,
        authorizedUsername: string,
        role: string,
        weight: number,
        callback: (response: HiveKeychainRequestResponse) => void
      ) => void;
    };
  }
}

export class HiveKeychainService {
  private static instance: HiveKeychainService;
  private isConnected: boolean = false;
  private connectedAccount: string | null = null;

  private constructor() {}

  public static getInstance(): HiveKeychainService {
    if (!HiveKeychainService.instance) {
      HiveKeychainService.instance = new HiveKeychainService();
    }
    return HiveKeychainService.instance;
  }

  /**
   * Check if HiveKeychain extension is installed
   */
  public isKeychainInstalled(): boolean {
    return (
      typeof window !== "undefined" &&
      window.hive_keychain?.isInstalled === true
    );
  }

  /**
   * Initialize connection to HiveKeychain
   */
  public async initialize(): Promise<boolean> {
    try {
      if (!this.isKeychainInstalled()) {
        throw new Error("HiveKeychain extension not installed");
      }

      // HiveKeychain is always "connected" when extension is installed
      // It's available immediately if installed
      this.isConnected = true;
      return true;
    } catch (error) {
      console.error("Failed to initialize HiveKeychain:", error);
      return false;
    }
  }

  /**
   * Request user authentication/login
   */
  public async requestLogin(
    username: string
  ): Promise<{ success: boolean; username?: string; error?: string }> {
    return new Promise((resolve) => {
      if (!this.isKeychainInstalled()) {
        resolve({ success: false, error: "HiveKeychain not installed" });
        return;
      }

      const message = `Login to PeakeCorp at ${new Date().toISOString()}`;

      window.hive_keychain!.requestSignBuffer(
        username,
        message,
        "Posting",
        (response: HiveKeychainRequestResponse) => {
          if (response.success) {
            this.connectedAccount = username;
            resolve({ success: true, username });
          } else {
            resolve({
              success: false,
              error: response.message || "Login failed",
            });
          }
        }
      );
    });
  }

  /**
   * Sign and broadcast a transaction
   */
  public async broadcastTransaction(
    username: string,
    operations: any[],
    method: string = "active"
  ): Promise<{ success: boolean; result?: any; error?: string }> {
    return new Promise((resolve) => {
      if (!this.isKeychainInstalled()) {
        resolve({ success: false, error: "HiveKeychain not installed" });
        return;
      }

      window.hive_keychain!.requestBroadcast(
        username,
        operations,
        method,
        (response: HiveKeychainRequestResponse) => {
          if (response.success) {
            resolve({ success: true, result: response.result });
          } else {
            resolve({
              success: false,
              error: response.message || "Transaction failed",
            });
          }
        }
      );
    });
  }

  /**
   * Transfer HIVE, HBD, or PEAKE tokens
   */
  public async transfer(
    from: string,
    to: string,
    amount: string,
    memo: string,
    currency: "HIVE" | "HBD" | "PEAKE" = "HIVE"
  ): Promise<{ success: boolean; result?: any; error?: string }> {
    return new Promise((resolve) => {
      if (!this.isKeychainInstalled()) {
        resolve({ success: false, error: "HiveKeychain not installed" });
        return;
      }

      window.hive_keychain!.requestTransfer(
        from,
        to,
        amount,
        memo,
        currency,
        (response: HiveKeychainRequestResponse) => {
          if (response.success) {
            resolve({ success: true, result: response.result });
          } else {
            resolve({
              success: false,
              error: response.message || "Transfer failed",
            });
          }
        }
      );
    });
  }

  /**
   * Get connected account
   */
  public getConnectedAccount(): string | null {
    return this.connectedAccount;
  }

  /**
   * Check if user is connected
   */
  public isUserConnected(): boolean {
    return this.isConnected && this.connectedAccount !== null;
  }

  /**
   * Disconnect user
   */
  public disconnect(): void {
    this.connectedAccount = null;
    this.isConnected = false;
  }

  /**
   * Create PeakeCoin reward transaction
   */
  public async createPeakeCoinReward(
    username: string,
    rewardAmount: number,
    workflowId: string,
    taskDescription: string
  ): Promise<{ success: boolean; result?: any; error?: string }> {
    const memo = `PeakeCorp Reward - Workflow: ${workflowId} - Task: ${taskDescription}`;

    return this.transfer(
      "peakecorp-treasury", // Treasury account
      username,
      `${rewardAmount.toFixed(3)} PEAKE`,
      memo,
      "PEAKE"
    );
  }

  /**
   * Batch process multiple transactions
   */
  public async processBatchTransactions(
    username: string,
    transactions: HiveTransaction[]
  ): Promise<{ success: boolean; results: any[]; errors: string[] }> {
    const results: any[] = [];
    const errors: string[] = [];

    for (const tx of transactions) {
      try {
        const result = await this.broadcastTransaction(
          username,
          tx.operations,
          tx.method
        );
        if (result.success) {
          results.push(result.result);
        } else {
          errors.push(result.error || "Unknown error");
        }
      } catch (error) {
        errors.push(error instanceof Error ? error.message : "Unknown error");
      }
    }

    return {
      success: errors.length === 0,
      results,
      errors,
    };
  }
}

export const hiveKeychain = HiveKeychainService.getInstance();
