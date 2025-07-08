"use client";

import React, { useState, useEffect } from "react";
// COMMENTED OUT: Multi-chain wallet hooks - Removed for Hive-only focus
// import { useAccount, useBalance } from 'wagmi'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Users,
  ArrowUpRight,
} from "lucide-react";

const Dashboard = () => {
  // COMMENTED OUT: Multi-chain wallet connection - Removed for Hive-only focus
  // const { address } = useAccount()
  // const { data: balance } = useBalance({ address })

  // TODO: Implement Hive account connection
  const [hiveAccount, setHiveAccount] = useState("peakecorp-demo");

  // Updated portfolio data to reflect Hive/PeakeCoin only
  const [portfolioData, setPortfolioData] = useState([
    { name: "Jan", hive: 4000, hbd: 2400, peake: 3200 },
    { name: "Feb", hive: 3000, hbd: 1398, peake: 3800 },
    { name: "Mar", hive: 2000, hbd: 9800, peake: 4200 },
    { name: "Apr", hive: 2780, hbd: 3908, peake: 4800 },
    { name: "May", hive: 1890, hbd: 4800, peake: 5200 },
    { name: "Jun", hive: 2390, hbd: 3800, peake: 5800 },
    { name: "Jul", hive: 3490, hbd: 4300, peake: 6400 },
  ]);

  // Updated chain distribution for PeakeCorp ecosystem
  const [tokenDistribution, setTokenDistribution] = useState([
    { name: "HIVE", value: 40, color: "#E31337" },
    { name: "HBD", value: 35, color: "#00AA55" },
    { name: "PEAKE", value: 25, color: "#FF6B35" },
  ]);

  // Updated metrics for corporate/enterprise focus
  const [metrics, setMetrics] = useState({
    totalValue: 185000, // Corporate treasury value
    totalChange: 18.5,
    activeWorkflows: 31, // Business processes
    completedTransactions: 2847, // Operations completed
    avgResourceCost: 0.125, // Average RC cost per operation
    successRate: 99.2, // Process reliability
  });

  const StatCard = ({ title, value, change, icon: Icon, color = "blue" }) => {
    const isPositive = change >= 0;
    return (
      <div className="glass rounded-xl p-6 hover:bg-white/10 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-white mt-1">{value}</p>
            <div
              className={`flex items-center mt-2 ${
                isPositive ? "text-green-400" : "text-red-400"
              }`}
            >
              {isPositive ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingDown size={16} />
              )}
              <span className="ml-1 text-sm">{Math.abs(change)}%</span>
            </div>
          </div>
          <div className={`p-3 rounded-lg bg-${color}-500/20`}>
            <Icon className={`w-6 h-6 text-${color}-400`} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">
            Corporate Treasury Dashboard
          </h2>
          <p className="text-gray-400 mt-1">
            PeakeCorp Hive blockchain asset management and analytics
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors">
            Sync Treasury
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Treasury Value"
          value={`$${metrics.totalValue.toLocaleString()}`}
          change={metrics.totalChange}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Active Business Processes"
          value={metrics.activeWorkflows}
          change={12.8}
          icon={Activity}
          color="orange"
        />
        <StatCard
          title="Operations Completed"
          value={metrics.completedTransactions.toLocaleString()}
          change={24.3}
          icon={ArrowUpRight}
          color="blue"
        />
        <StatCard
          title="Process Reliability"
          value={`${metrics.successRate}%`}
          change={0.8}
          icon={Users}
          color="emerald"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Treasury Performance */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            Treasury Performance
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={portfolioData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="hive"
                  stroke="#E31337"
                  strokeWidth={2}
                  name="HIVE"
                />
                <Line
                  type="monotone"
                  dataKey="hbd"
                  stroke="#00AA55"
                  strokeWidth={2}
                  name="HBD"
                />
                <Line
                  type="monotone"
                  dataKey="peake"
                  stroke="#FF6B35"
                  strokeWidth={2}
                  name="PEAKE"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Token Distribution */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            Token Distribution
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tokenDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {tokenDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Corporate Activity */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          Recent Corporate Activity
        </h3>
        <div className="space-y-4">
          {[
            {
              type: "Payroll Distribution",
              chain: "Hive",
              amount: "+$8,450",
              time: "5 minutes ago",
              status: "success",
            },
            {
              type: "Vendor Payment",
              chain: "Hive → HBD",
              amount: "-$2,150",
              time: "20 minutes ago",
              status: "success",
            },
            {
              type: "Staking Rewards",
              chain: "PeakeCoin",
              amount: "+$385",
              time: "1 hour ago",
              status: "success",
            },
            {
              type: "Treasury Rebalancing",
              chain: "Hive",
              amount: "+$1,820",
              time: "3 hours ago",
              status: "success",
            },
            {
              type: "Compliance Report",
              chain: "Hive",
              amount: "Generated",
              time: "6 hours ago",
              status: "success",
            },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-2 h-2 rounded-full ${
                    activity.status === "success"
                      ? "bg-green-400"
                      : activity.status === "pending"
                      ? "bg-yellow-400"
                      : "bg-red-400"
                  }`}
                />
                <div>
                  <p className="text-white font-medium">{activity.type}</p>
                  <p className="text-gray-400 text-sm">{activity.chain}</p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`font-semibold ${
                    activity.amount.startsWith("+")
                      ? "text-green-400"
                      : activity.amount.startsWith("-")
                      ? "text-red-400"
                      : "text-blue-400"
                  }`}
                >
                  {activity.amount}
                </p>
                <p className="text-gray-400 text-sm">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
