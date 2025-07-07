/**
 * Corporate Dashboard Component
 * Main dashboard for PeakeCorp enterprise blockchain operations
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity, 
  Shield, 
  FileText,
  Zap,
  Target,
  Clock,
  Award
} from 'lucide-react';

// Mock data interfaces
interface CorporateMetrics {
  totalTransactionVolume: number;
  monthlyTransactionCount: number;
  costSavings: number;
  efficiencyScore: number;
  peakeCoinRewards: number;
  complianceScore: number;
  activeEmployees: number;
  averageTransactionCost: number;
}

interface RecentActivity {
  id: string;
  type: 'payroll' | 'expense' | 'reward' | 'compliance';
  description: string;
  amount: number;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
}

interface WorkflowMetrics {
  payrollAutomation: number;
  expenseProcessing: number;
  complianceReporting: number;
  treasuryOptimization: number;
}

export default function CorporateDashboard() {
  const [metrics, setMetrics] = useState<CorporateMetrics>({
    totalTransactionVolume: 125780.50,
    monthlyTransactionCount: 1247,
    costSavings: 18450.75,
    efficiencyScore: 87.5,
    peakeCoinRewards: 2150.25,
    complianceScore: 96.2,
    activeEmployees: 42,
    averageTransactionCost: 0.65
  });

  const [workflowMetrics, setWorkflowMetrics] = useState<WorkflowMetrics>({
    payrollAutomation: 95.2,
    expenseProcessing: 88.7,
    complianceReporting: 92.1,
    treasuryOptimization: 84.3
  });

  const [recentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'payroll',
      description: 'Monthly payroll distribution',
      amount: 25000,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'completed'
    },
    {
      id: '2',
      type: 'reward',
      description: 'PeakeCoin efficiency rewards',
      amount: 350,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      status: 'completed'
    },
    {
      id: '3',
      type: 'expense',
      description: 'Office supplies procurement',
      amount: 1250,
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      status: 'pending'
    },
    {
      id: '4',
      type: 'compliance',
      description: 'Q4 audit trail generation',
      amount: 0,
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      status: 'completed'
    }
  ]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'payroll':
        return <Users className="w-4 h-4" />;
      case 'expense':
        return <DollarSign className="w-4 h-4" />;
      case 'reward':
        return <Award className="w-4 h-4" />;
      case 'compliance':
        return <Shield className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Corporate Dashboard</h1>
          <p className="text-gray-600">Real-time enterprise blockchain operations overview</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm text-gray-500">Current Month Savings</div>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(metrics.costSavings)}
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Transaction Volume"
          value={formatCurrency(metrics.totalTransactionVolume)}
          change="+12.5%"
          icon={<TrendingUp className="w-6 h-6" />}
          color="blue"
        />
        <MetricCard
          title="Monthly Transactions"
          value={metrics.monthlyTransactionCount.toLocaleString()}
          change="+8.3%"
          icon={<Activity className="w-6 h-6" />}
          color="green"
        />
        <MetricCard
          title="Efficiency Score"
          value={formatPercentage(metrics.efficiencyScore)}
          change="+2.1%"
          icon={<Target className="w-6 h-6" />}
          color="purple"
        />
        <MetricCard
          title="PeakeCoin Rewards"
          value={metrics.peakeCoinRewards.toFixed(2)}
          change="+15.7%"
          icon={<Award className="w-6 h-6" />}
          color="orange"
        />
      </div>

      {/* Workflow Metrics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Workflow Automation Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <WorkflowMetric
            title="Payroll Automation"
            percentage={workflowMetrics.payrollAutomation}
            icon={<Users className="w-5 h-5" />}
          />
          <WorkflowMetric
            title="Expense Processing"
            percentage={workflowMetrics.expenseProcessing}
            icon={<DollarSign className="w-5 h-5" />}
          />
          <WorkflowMetric
            title="Compliance Reporting"
            percentage={workflowMetrics.complianceReporting}
            icon={<FileText className="w-5 h-5" />}
          />
          <WorkflowMetric
            title="Treasury Optimization"
            percentage={workflowMetrics.treasuryOptimization}
            icon={<Zap className="w-5 h-5" />}
          />
        </div>
      </div>

      {/* Recent Activity and Compliance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 border border-gray-100 rounded">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{activity.description}</div>
                    <div className="text-sm text-gray-500">
                      {activity.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {activity.amount > 0 && (
                    <div className="font-medium text-gray-900">
                      {formatCurrency(activity.amount)}
                    </div>
                  )}
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(activity.status)}`}>
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance & Security */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Compliance & Security</h2>
          <div className="space-y-4">
            <ComplianceMetric
              title="Overall Compliance Score"
              score={metrics.complianceScore}
              requirement="SOX Compliance"
            />
            <ComplianceMetric
              title="Audit Readiness"
              score={94.8}
              requirement="GAAP Standards"
            />
            <ComplianceMetric
              title="Security Rating"
              score={98.1}
              requirement="Enterprise Grade"
            />
            <ComplianceMetric
              title="Data Integrity"
              score={99.7}
              requirement="Blockchain Verified"
            />
          </div>
          
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800">Compliance Status: Excellent</span>
            </div>
            <p className="text-sm text-green-700">
              All regulatory requirements met. Ready for quarterly audit.
            </p>
          </div>
        </div>
      </div>

      {/* Cost Analysis */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Cost Analysis & Savings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {formatCurrency(metrics.costSavings)}
            </div>
            <div className="text-sm text-gray-600">Total Savings This Month</div>
            <div className="text-xs text-green-600 mt-1">↑ 18% vs last month</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              ${metrics.averageTransactionCost.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Average Transaction Cost</div>
            <div className="text-xs text-blue-600 mt-1">↓ 35% vs traditional methods</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {Math.round((metrics.costSavings / metrics.totalTransactionVolume) * 10000) / 100}%
            </div>
            <div className="text-sm text-gray-600">Cost Efficiency Ratio</div>
            <div className="text-xs text-purple-600 mt-1">↑ 12% efficiency gain</div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

function MetricCard({ title, value, change, icon, color }: MetricCardProps) {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    purple: 'text-purple-600 bg-purple-100',
    orange: 'text-orange-600 bg-orange-100'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        <span className="text-sm font-medium text-green-600">{change}</span>
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{title}</div>
    </div>
  );
}

interface WorkflowMetricProps {
  title: string;
  percentage: number;
  icon: React.ReactNode;
}

function WorkflowMetric({ title, percentage, icon }: WorkflowMetricProps) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center mb-3">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">
        {percentage.toFixed(1)}%
      </div>
      <div className="text-sm text-gray-600">{title}</div>
      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface ComplianceMetricProps {
  title: string;
  score: number;
  requirement: string;
}

function ComplianceMetric({ title, score, requirement }: ComplianceMetricProps) {
  const getScoreColor = (score: number): string => {
    if (score >= 95) return 'text-green-600';
    if (score >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="flex items-center justify-between p-3 border border-gray-100 rounded">
      <div>
        <div className="font-medium text-gray-900">{title}</div>
        <div className="text-xs text-gray-500">{requirement}</div>
      </div>
      <div className={`text-xl font-bold ${getScoreColor(score)}`}>
        {score.toFixed(1)}%
      </div>
    </div>
  );
}
