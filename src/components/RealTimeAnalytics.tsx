/**
 * Real-Time Analytics Component
 * Live blockchain metrics and enterprise KPIs for PeakeCorp
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Clock,
  Zap,
  Shield,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

import { blockchainAnalytics } from '@/lib/blockchain-analytics';
import type { RealTimeMetrics, CorporateKPIs } from '@/lib/blockchain-analytics';

interface LiveDataPoint {
  timestamp: string;
  transactions: number;
  volume: number;
  efficiency: number;
  peakeCoinPrice: number;
}

export default function RealTimeAnalytics() {
  const [realTimeMetrics, setRealTimeMetrics] = useState<RealTimeMetrics | null>(null);
  const [corporateKPIs, setCorporateKPIs] = useState<CorporateKPIs | null>(null);
  const [liveData, setLiveData] = useState<LiveDataPoint[]>([]);
  const [isConnected, setIsConnected] = useState(true);

  // Simulate real-time data updates
  useEffect(() => {
    const fetchRealTimeData = async () => {
      try {
        const [metrics, kpis] = await Promise.all([
          blockchainAnalytics.getRealTimeMetrics(),
          blockchainAnalytics.calculateCorporateKPIs('peakecorp-demo')
        ]);

        setRealTimeMetrics(metrics);
        setCorporateKPIs(kpis);

        // Add new data point to live chart
        const newDataPoint: LiveDataPoint = {
          timestamp: new Date().toLocaleTimeString(),
          transactions: metrics.activeTransactions,
          volume: metrics.marketCap / 1000, // Scale down for chart
          efficiency: (metrics.successRate / 100) * 95, // Convert to efficiency score
          peakeCoinPrice: metrics.peakeCoinPrice
        };

        setLiveData(prev => {
          const newData = [...prev, newDataPoint];
          // Keep only last 20 data points
          return newData.slice(-20);
        });

        setIsConnected(true);
      } catch (error) {
        console.error('Error fetching real-time data:', error);
        setIsConnected(false);
      }
    };

    // Initial fetch
    fetchRealTimeData();

    // Set up interval for live updates
    const interval = setInterval(fetchRealTimeData, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  const getStatusColor = (value: number, threshold: number) => 
    value >= threshold ? 'text-green-600' : 'text-red-600';

  const getStatusIcon = (value: number, threshold: number) => 
    value >= threshold ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <AlertCircle className="w-5 h-5 text-red-600" />
    );

  if (!realTimeMetrics || !corporateKPIs) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
          <span className="font-medium">
            {isConnected ? 'Live Connection Active' : 'Connection Lost'}
          </span>
        </div>
        <div className="text-sm text-gray-600">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Live Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{realTimeMetrics.activeTransactions}</p>
            </div>
            <Activity className="w-8 h-8 text-blue-600" />
          </div>
          <div className="mt-2 flex items-center gap-1">
            {getStatusIcon(realTimeMetrics.activeTransactions, 10)}
            <span className={`text-sm ${getStatusColor(realTimeMetrics.activeTransactions, 10)}`}>
              {realTimeMetrics.activeTransactions >= 10 ? 'Healthy' : 'Low Activity'}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">{formatPercentage(realTimeMetrics.successRate)}</p>
            </div>
            <Zap className="w-8 h-8 text-green-600" />
          </div>
          <div className="mt-2 flex items-center gap-1">
            {getStatusIcon(realTimeMetrics.successRate, 95)}
            <span className={`text-sm ${getStatusColor(realTimeMetrics.successRate, 95)}`}>
              {realTimeMetrics.successRate >= 95 ? 'Excellent' : 'Needs Attention'}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">PeakeCoin Price</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(realTimeMetrics.peakeCoinPrice)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-yellow-600" />
          </div>
          <div className="mt-2 flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600">+2.3%</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Daily Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{realTimeMetrics.dailyActiveUsers}</p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
          <div className="mt-2 flex items-center gap-1">
            {getStatusIcon(realTimeMetrics.dailyActiveUsers, 100)}
            <span className={`text-sm ${getStatusColor(realTimeMetrics.dailyActiveUsers, 100)}`}>
              {realTimeMetrics.dailyActiveUsers >= 100 ? 'Growing' : 'Stable'}
            </span>
          </div>
        </div>
      </div>

      {/* Live Performance Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Live Performance Metrics</h3>
        {liveData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={liveData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="transactions" 
                stroke="#8884d8" 
                strokeWidth={2}
                name="Active Transactions"
              />
              <Line 
                type="monotone" 
                dataKey="efficiency" 
                stroke="#82ca9d" 
                strokeWidth={2}
                name="Efficiency Score"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">
            Collecting live data...
          </div>
        )}
      </div>

      {/* Corporate KPIs Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Enterprise KPIs</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Cost Reduction</span>
              <span className="font-semibold text-green-600">
                {formatPercentage(corporateKPIs.costReduction)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Automation Rate</span>
              <span className="font-semibold">
                {formatPercentage(corporateKPIs.automationRate)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Compliance Score</span>
              <span className="font-semibold">
                {formatPercentage(corporateKPIs.complianceScore)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Employee Efficiency</span>
              <span className="font-semibold">
                {formatPercentage(corporateKPIs.employeeEfficiency)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Risk & Sustainability</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Risk Score</span>
              <span className={`font-semibold ${corporateKPIs.riskScore < 20 ? 'text-green-600' : 'text-yellow-600'}`}>
                {formatPercentage(corporateKPIs.riskScore)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Treasury Optimization</span>
              <span className="font-semibold">
                {formatPercentage(corporateKPIs.treasuryOptimization)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Sustainability Index</span>
              <span className="font-semibold text-green-600">
                {formatPercentage(corporateKPIs.sustainabilityIndex)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Network Health Indicators */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Network Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Average Block Time</p>
            <p className="text-xl font-bold">{(realTimeMetrics.averageBlockTime / 1000).toFixed(1)}s</p>
          </div>
          <div className="text-center">
            <Activity className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Network Latency</p>
            <p className="text-xl font-bold">{Math.round(realTimeMetrics.networkLatency)}ms</p>
          </div>
          <div className="text-center">
            <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Error Rate</p>
            <p className="text-xl font-bold">{formatPercentage(realTimeMetrics.errorRate)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
