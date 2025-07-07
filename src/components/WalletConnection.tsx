/**
 * HiveKeychain Wallet Connection Component
 * Provides UI for connecting to Hive Keychain and managing corporate authentication
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Wallet, Shield, Users, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { enhancedHiveKeychain } from '@/lib/hive/enhanced-keychain';
import { hiveEngine } from '@/lib/hive/engine';

interface WalletConnectionProps {
  onConnect?: (username: string) => void;
  onDisconnect?: () => void;
}

interface UserBalance {
  hive: number;
  hbd: number;
  peakeCoin: number;
  peakeCoinStaked: number;
  estimatedValue: number;
}

export default function WalletConnection({ onConnect, onDisconnect }: WalletConnectionProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [balance, setBalance] = useState<UserBalance | null>(null);
  const [keychainAvailable, setKeychainAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authLevel, setAuthLevel] = useState<'none' | 'posting' | 'active'>('none');

  useEffect(() => {
    checkKeychainStatus();
    checkExistingAuth();
  }, []);

  const checkKeychainStatus = async () => {
    try {
      const available = await enhancedHiveKeychain.isKeychainAvailable();
      setKeychainAvailable(available);
      
      if (!available) {
        setError('Hive Keychain extension not detected. Please install it to continue.');
      }
    } catch (error) {
      console.error('Error checking keychain status:', error);
      setError('Failed to check Hive Keychain status');
    }
  };

  const checkExistingAuth = () => {
    const user = enhancedHiveKeychain.getCurrentUser();
    const isAuth = enhancedHiveKeychain.isAuthenticated();
    
    if (user && isAuth) {
      setCurrentUser(user);
      setIsConnected(true);
      setAuthLevel('posting');
      loadUserBalance(user);
      onConnect?.(user);
    }
  };

  const loadUserBalance = async (username: string) => {
    try {
      const userBalance = await enhancedHiveKeychain.getUserBalance(username);
      setBalance(userBalance);
    } catch (error) {
      console.error('Error loading balance:', error);
    }
  };

  const handleConnect = async (username: string, requireActive: boolean = false) => {
    if (!username.trim()) {
      setError('Please enter a valid Hive username');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // First establish handshake
      const handshake = await enhancedHiveKeychain.requestHandshake();
      if (!handshake.success) {
        throw new Error(handshake.error || 'Failed to establish connection');
      }

      // Authenticate user
      const auth = await enhancedHiveKeychain.authenticateUser(username, requireActive);
      if (auth.success) {
        setCurrentUser(username);
        setIsConnected(true);
        setAuthLevel(requireActive ? 'active' : 'posting');
        await loadUserBalance(username);
        onConnect?.(username);
      } else {
        throw new Error(auth.error || 'Authentication failed');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Connection failed');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    enhancedHiveKeychain.signOut();
    setCurrentUser(null);
    setIsConnected(false);
    setBalance(null);
    setAuthLevel('none');
    setError(null);
    onDisconnect?.();
  };

  const upgradeToActiveAuth = async () => {
    if (!currentUser) return;
    
    setIsConnecting(true);
    try {
      const auth = await enhancedHiveKeychain.authenticateUser(currentUser, true);
      if (auth.success) {
        setAuthLevel('active');
      } else {
        setError(auth.error || 'Failed to upgrade authentication');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Authentication upgrade failed');
    } finally {
      setIsConnecting(false);
    }
  };

  if (!keychainAvailable) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600" />
          <h3 className="text-lg font-semibold text-red-800">Hive Keychain Required</h3>
        </div>
        <p className="text-red-700 mb-4">
          PeakeCorp Enterprise requires Hive Keychain for secure blockchain operations.
        </p>
        <div className="space-y-2">
          <a
            href="https://chrome.google.com/webstore/detail/hive-keychain/jcacnejopjdphbnjgfaaobbfafkihpep"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Install Chrome Extension
          </a>
          <a
            href="https://addons.mozilla.org/en-US/firefox/addon/hive-keychain/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors ml-2"
          >
            Install Firefox Add-on
          </a>
        </div>
      </div>
    );
  }

  if (isConnected && currentUser) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold text-green-800">Connected to PeakeCorp</h3>
              <p className="text-green-700">@{currentUser}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              authLevel === 'active' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {authLevel === 'active' ? 'Active Key' : 'Posting Key'}
            </span>
            <button
              onClick={handleDisconnect}
              className="text-green-600 hover:text-green-800 font-medium"
            >
              Disconnect
            </button>
          </div>
        </div>

        {balance && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-white p-3 rounded border">
              <div className="text-xs text-gray-500 uppercase tracking-wide">PeakeCoin</div>
              <div className="text-lg font-semibold text-purple-600">
                {balance.peakeCoin.toFixed(2)}
              </div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="text-xs text-gray-500 uppercase tracking-wide">Staked</div>
              <div className="text-lg font-semibold text-blue-600">
                {balance.peakeCoinStaked.toFixed(2)}
              </div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="text-xs text-gray-500 uppercase tracking-wide">HIVE</div>
              <div className="text-lg font-semibold text-red-600">
                {balance.hive.toFixed(3)}
              </div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="text-xs text-gray-500 uppercase tracking-wide">HBD</div>
              <div className="text-lg font-semibold text-green-600">
                {balance.hbd.toFixed(3)}
              </div>
            </div>
          </div>
        )}

        {authLevel !== 'active' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-yellow-800">
                  Upgrade to Active Key for enterprise features
                </span>
              </div>
              <button
                onClick={upgradeToActiveAuth}
                disabled={isConnecting}
                className="text-yellow-600 hover:text-yellow-800 font-medium text-sm"
              >
                {isConnecting ? 'Upgrading...' : 'Upgrade Auth'}
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div className="text-center mb-6">
        <Wallet className="w-12 h-12 text-blue-600 mx-auto mb-3" />
        <h3 className="text-xl font-semibold text-blue-800 mb-2">
          Connect to PeakeCorp Enterprise
        </h3>
        <p className="text-blue-700">
          Secure corporate blockchain operations powered by Hive
        </p>
      </div>

      <ConnectForm 
        onConnect={handleConnect}
        isConnecting={isConnecting}
        error={error}
      />

      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div className="flex flex-col items-center">
          <Shield className="w-6 h-6 text-blue-600 mb-2" />
          <span className="text-xs text-blue-700">Enterprise Security</span>
        </div>
        <div className="flex flex-col items-center">
          <Users className="w-6 h-6 text-blue-600 mb-2" />
          <span className="text-xs text-blue-700">Team Management</span>
        </div>
        <div className="flex flex-col items-center">
          <TrendingUp className="w-6 h-6 text-blue-600 mb-2" />
          <span className="text-xs text-blue-700">Cost Optimization</span>
        </div>
      </div>
    </div>
  );
}

interface ConnectFormProps {
  onConnect: (username: string, requireActive?: boolean) => void;
  isConnecting: boolean;
  error: string | null;
}

function ConnectForm({ onConnect, isConnecting, error }: ConnectFormProps) {
  const [username, setUsername] = useState('');
  const [requireActive, setRequireActive] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConnect(username, requireActive);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-blue-800 mb-1">
          Hive Username
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your Hive username"
          className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isConnecting}
          required
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="requireActive"
          checked={requireActive}
          onChange={(e) => setRequireActive(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="requireActive" className="ml-2 text-sm text-blue-700">
          Use Active Key (required for treasury operations)
        </label>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-3">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isConnecting || !username.trim()}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isConnecting ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Connecting...
          </span>
        ) : (
          'Connect Wallet'
        )}
      </button>
    </form>
  );
}
