'use client'

import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, Activity, Target, Zap, Calendar, Filter } from 'lucide-react'

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d')
  const [selectedToken, setSelectedToken] = useState('all')
  
  // Updated performance data for Hive ecosystem
  const [performanceData, setPerformanceData] = useState([
    { name: 'Mon', hive: 4000, hbd: 2400, peake: 3200, operations: 45 },
    { name: 'Tue', hive: 3000, hbd: 1398, peake: 2800, operations: 38 },
    { name: 'Wed', hive: 2000, hbd: 9800, peake: 3500, operations: 52 },
    { name: 'Thu', hive: 2780, hbd: 3908, peake: 4200, operations: 41 },
    { name: 'Fri', hive: 1890, hbd: 4800, peake: 3800, operations: 47 },
    { name: 'Sat', hive: 2390, hbd: 3800, peake: 4100, operations: 33 },
    { name: 'Sun', hive: 3490, hbd: 4300, peake: 3900, operations: 39 },
  ])

  // Updated RC (Resource Credits) analytics for Hive
  const [resourceAnalytics, setResourceAnalytics] = useState([
    { time: '00:00', rcCost: 0.45, operations: 20, efficiency: 95 },
    { time: '04:00', rcCost: 0.32, operations: 15, efficiency: 92 },
    { time: '08:00', rcCost: 0.67, operations: 35, efficiency: 88 },
    { time: '12:00', rcCost: 0.89, operations: 42, efficiency: 85 },
    { time: '16:00', rcCost: 0.78, operations: 38, efficiency: 87 },
    { time: '20:00', rcCost: 0.56, operations: 28, efficiency: 90 },
  ])

  // Corporate performance metrics focused on business operations
  const [corporateMetrics, setCorporateMetrics] = useState([
    { metric: 'Efficiency', current: 95, target: 98, benchmark: 85, fullMark: 100 },
    { metric: 'Cost Control', current: 92, target: 95, benchmark: 80, fullMark: 100 },
    { metric: 'Compliance', current: 99, target: 99, benchmark: 95, fullMark: 100 },
    { metric: 'Process Speed', current: 88, target: 92, benchmark: 75, fullMark: 100 },
    { metric: 'Reliability', current: 96, target: 98, benchmark: 90, fullMark: 100 },
  ])

  // Updated KPIs for corporate focus
  const [kpis, setKpis] = useState({
    totalVolume: 3847639,
    totalOperations: 18847,
    successRate: 99.2,
    avgResourceCost: 0.125,
    activeProcesses: 1547,
    costSavings: 67328
  })

  const MetricCard = ({ title, value, change, icon: Icon, color, suffix = '' }) => {
    const isPositive = change >= 0
    return (
      <div className="glass rounded-xl p-6 hover:bg-white/10 transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg bg-${color}-500/20`}>
              <Icon className={`w-6 h-6 text-${color}-400`} />
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium">{title}</p>
              <p className="text-2xl font-bold text-white">{value}{suffix}</p>
            </div>
          </div>
          <div className={`flex items-center ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
            <span className="ml-1 text-sm font-medium">{Math.abs(change)}%</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Analytics Dashboard</h2>
          <p className="text-gray-400 mt-1">Comprehensive analytics across all blockchain networks</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:border-blue-500"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <select
            value={selectedChain}
            onChange={(e) => setSelectedChain(e.target.value)}
            className="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Chains</option>
            <option value="ethereum">Ethereum</option>
            <option value="polygon">Polygon</option>
            <option value="polkadot">Polkadot</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Total Volume"
          value={`$${kpis.totalVolume.toLocaleString()}`}
          change={12.5}
          icon={DollarSign}
          color="green"
        />
        <MetricCard
          title="Total Transactions"
          value={kpis.totalTransactions.toLocaleString()}
          change={8.7}
          icon={Activity}
          color="blue"
        />
        <MetricCard
          title="Success Rate"
          value={kpis.successRate}
          change={0.3}
          icon={Target}
          color="emerald"
          suffix="%"
        />
        <MetricCard
          title="Avg Gas Price"
          value={kpis.avgGasPrice}
          change={-5.2}
          icon={Zap}
          color="yellow"
          suffix=" gwei"
        />
        <MetricCard
          title="Active Wallets"
          value={kpis.activeWallets.toLocaleString()}
          change={15.8}
          icon={Calendar}
          color="purple"
        />
        <MetricCard
          title="Revenue Generated"
          value={`$${kpis.revenueGenerated.toLocaleString()}`}
          change={23.4}
          icon={TrendingUp}
          color="pink"
        />
      </div>

      {/* Performance Chart */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Multi-Chain Performance</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Area type="monotone" dataKey="ethereum" stackId="1" stroke="#627EEA" fill="#627EEA" fillOpacity={0.6} />
              <Area type="monotone" dataKey="polygon" stackId="1" stroke="#8247E5" fill="#8247E5" fillOpacity={0.6} />
              <Area type="monotone" dataKey="polkadot" stackId="1" stroke="#E6007A" fill="#E6007A" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gas Analytics */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Gas Price Analysis</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gasAnalytics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="ethereum" stroke="#627EEA" strokeWidth={2} />
                <Line type="monotone" dataKey="polygon" stroke="#8247E5" strokeWidth={2} />
                <Line type="monotone" dataKey="polkadot" stroke="#E6007A" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chain Comparison Radar */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Chain Performance Radar</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chainMetrics}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="chain" tick={{ fill: '#9CA3AF' }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#9CA3AF' }} />
                <Radar name="Ethereum" dataKey="ethereum" stroke="#627EEA" fill="#627EEA" fillOpacity={0.3} />
                <Radar name="Polygon" dataKey="polygon" stroke="#8247E5" fill="#8247E5" fillOpacity={0.3} />
                <Radar name="Polkadot" dataKey="polkadot" stroke="#E6007A" fill="#E6007A" fillOpacity={0.3} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Transaction Analytics */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Transaction Volume by Chain</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="ethereum" fill="#627EEA" />
              <Bar dataKey="polygon" fill="#8247E5" />
              <Bar dataKey="polkadot" fill="#E6007A" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights Section */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <h4 className="font-semibold text-blue-400 mb-2">Ethereum Performance</h4>
              <p className="text-gray-300 text-sm">Gas prices have decreased by 15% this week, making transactions more affordable. Consider increasing transaction volume.</p>
            </div>
            <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <h4 className="font-semibold text-purple-400 mb-2">Polygon Growth</h4>
              <p className="text-gray-300 text-sm">Polygon shows 40% increase in transaction volume. Strong performance in DeFi protocols.</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-pink-500/10 rounded-lg border border-pink-500/20">
              <h4 className="font-semibold text-pink-400 mb-2">Polkadot Staking</h4>
              <p className="text-gray-300 text-sm">Staking rewards have increased by 8%. Consider reallocating portfolio for higher yields.</p>
            </div>
            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <h4 className="font-semibold text-green-400 mb-2">Overall Performance</h4>
              <p className="text-gray-300 text-sm">Portfolio performance up 23% this month. Success rate remains above 98% across all chains.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
