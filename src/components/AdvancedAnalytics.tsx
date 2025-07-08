/**
 * Advanced Analytics Dashboard
 * Comprehensive data analytics for enterprise blockchain operations
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  DollarSign,
  Users,
  Clock,
  Target,
  Award,
  Shield,
  Zap,
  Filter,
  Download,
  Calendar,
  AlertTriangle
} from 'lucide-react';

// Analytics data interfaces
interface TransactionAnalytics {
  period: string;
  hiveTransactions: number;
  hbdTransactions: number;
  peakeCoinRewards: number;
  totalVolume: number;
  costSavings: number;
  efficiencyScore: number;
}

interface DepartmentAnalytics {
  department: string;
  transactionCount: number;
  totalSpend: number;
  avgTransactionSize: number;
  peakeCoinEarned: number;
  complianceScore: number;
  efficiency: number;
}

interface ComplianceAnalytics {
  auditType: string;
  passRate: number;
  findings: number;
  riskLevel: 'low' | 'medium' | 'high';
  lastAudit: string;
}

interface PredictiveInsights {
  metric: string;
  currentValue: number;
  predictedValue: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  recommendation: string;
}

export default function AdvancedAnalyticsDashboard() {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [analyticsView, setAnalyticsView] = useState<'overview' | 'transactions' | 'compliance' | 'predictive'>('overview');

  // Sample analytics data (in production, this would come from real APIs)
  const transactionAnalytics: TransactionAnalytics[] = [
    { period: 'Week 1', hiveTransactions: 120, hbdTransactions: 80, peakeCoinRewards: 450, totalVolume: 15000, costSavings: 750, efficiencyScore: 85 },
    { period: 'Week 2', hiveTransactions: 140, hbdTransactions: 95, peakeCoinRewards: 520, totalVolume: 18000, costSavings: 900, efficiencyScore: 88 },
    { period: 'Week 3', hiveTransactions: 165, hbdTransactions: 110, peakeCoinRewards: 610, totalVolume: 22000, costSavings: 1100, efficiencyScore: 92 },
    { period: 'Week 4', hiveTransactions: 180, hbdTransactions: 125, peakeCoinRewards: 680, totalVolume: 25000, costSavings: 1250, efficiencyScore: 94 }
  ];

  const departmentAnalytics: DepartmentAnalytics[] = [
    { department: 'Finance', transactionCount: 450, totalSpend: 125000, avgTransactionSize: 278, peakeCoinEarned: 890, complianceScore: 98, efficiency: 95 },
    { department: 'HR', transactionCount: 320, totalSpend: 85000, avgTransactionSize: 266, peakeCoinEarned: 640, complianceScore: 96, efficiency: 88 },
    { department: 'Operations', transactionCount: 280, totalSpend: 70000, avgTransactionSize: 250, peakeCoinEarned: 560, complianceScore: 94, efficiency: 85 },
    { department: 'IT', transactionCount: 150, totalSpend: 45000, avgTransactionSize: 300, peakeCoinEarned: 380, complianceScore: 92, efficiency: 82 }
  ];

  const complianceAnalytics: ComplianceAnalytics[] = [
    { auditType: 'SOX Compliance', passRate: 98.5, findings: 2, riskLevel: 'low', lastAudit: '2024-12-15' },
    { auditType: 'GAAP Standards', passRate: 96.8, findings: 4, riskLevel: 'low', lastAudit: '2024-12-10' },
    { auditType: 'Internal Controls', passRate: 94.2, findings: 6, riskLevel: 'medium', lastAudit: '2024-12-05' },
    { auditType: 'Security Audit', passRate: 99.1, findings: 1, riskLevel: 'low', lastAudit: '2024-12-20' }
  ];

  const predictiveInsights: PredictiveInsights[] = [
    { metric: 'Monthly Cost Savings', currentValue: 18450, predictedValue: 22800, confidence: 87, trend: 'up', recommendation: 'Increase batch processing frequency' },
    { metric: 'Transaction Volume', currentValue: 1247, predictedValue: 1580, confidence: 82, trend: 'up', recommendation: 'Scale infrastructure for growth' },
    { metric: 'Compliance Score', currentValue: 96.2, predictedValue: 97.8, confidence: 91, trend: 'up', recommendation: 'Continue current practices' },
    { metric: 'PeakeCoin Efficiency', currentValue: 87.5, predictedValue: 92.1, confidence: 85, trend: 'up', recommendation: 'Implement advanced automation' }
  ];

  const pieChartColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff88'];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getComplianceRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enterprise Analytics</h1>
          <p className="text-gray-600">Comprehensive blockchain operations intelligence</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Analytics Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { key: 'overview', label: 'Overview', icon: BarChart3 },
          { key: 'transactions', label: 'Transactions', icon: Activity },
          { key: 'compliance', label: 'Compliance', icon: Shield },
          { key: 'predictive', label: 'Predictive', icon: Target }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setAnalyticsView(key as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              analyticsView === key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Overview Analytics */}
      {analyticsView === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Transaction Volume Trends */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Transaction Volume Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={transactionAnalytics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip formatter={(value, name) => [
                  name === 'totalVolume' ? formatCurrency(Number(value)) : value,
                  name
                ]} />
                <Legend />
                <Bar yAxisId="left" dataKey="hiveTransactions" fill="#8884d8" name="HIVE Transactions" />
                <Bar yAxisId="left" dataKey="hbdTransactions" fill="#82ca9d" name="HBD Transactions" />
                <Line yAxisId="right" type="monotone" dataKey="totalVolume" stroke="#ff7300" name="Total Volume ($)" strokeWidth={3} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Department Performance */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Department Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentAnalytics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip formatter={(value) => [formatPercentage(Number(value)), 'Efficiency']} />
                <Legend />
                <Bar dataKey="efficiency" fill="#8884d8" name="Efficiency Score %" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Cost Savings Over Time */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Cost Savings Analysis</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={transactionAnalytics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Cost Savings']} />
                <Area type="monotone" dataKey="costSavings" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* PeakeCoin Rewards Distribution */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">PeakeCoin Rewards by Department</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentAnalytics}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ department, peakeCoinEarned }) => `${department}: ${peakeCoinEarned}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="peakeCoinEarned"
                >
                  {departmentAnalytics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieChartColors[index % pieChartColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Compliance Analytics */}
      {analyticsView === 'compliance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {complianceAnalytics.map((audit, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between mb-3">
                  <Shield className="w-8 h-8 text-blue-600" />
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getComplianceRiskColor(audit.riskLevel)}`}>
                    {audit.riskLevel.toUpperCase()}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{audit.auditType}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Pass Rate:</span>
                    <span className="font-medium">{formatPercentage(audit.passRate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Findings:</span>
                    <span className="font-medium">{audit.findings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Last Audit:</span>
                    <span className="font-medium text-xs">{audit.lastAudit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Predictive Analytics */}
      {analyticsView === 'predictive' && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-800">AI-Powered Insights & Predictions</h3>
            </div>
            <p className="text-blue-700">
              Based on historical data and machine learning models, here are predictions and recommendations for your enterprise operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {predictiveInsights.map((insight, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">{insight.metric}</h4>
                  {getTrendIcon(insight.trend)}
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Current Value:</span>
                    <span className="font-medium">
                      {insight.metric.includes('Cost') || insight.metric.includes('Volume') 
                        ? formatCurrency(insight.currentValue) 
                        : formatPercentage(insight.currentValue)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Predicted Value:</span>
                    <span className="font-medium text-green-600">
                      {insight.metric.includes('Cost') || insight.metric.includes('Volume')
                        ? formatCurrency(insight.predictedValue)
                        : formatPercentage(insight.predictedValue)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Confidence:</span>
                    <span className="font-medium">{formatPercentage(insight.confidence)}</span>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <p className="text-sm text-gray-700">
                      <strong>Recommendation:</strong> {insight.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Real-time Metrics Bar */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Live Analytics</span>
            </div>
            <div className="text-sm text-gray-600">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span>Transactions/min: <strong>12.4</strong></span>
            <span>Active Users: <strong>28</strong></span>
            <span>System Health: <strong className="text-green-600">Optimal</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
