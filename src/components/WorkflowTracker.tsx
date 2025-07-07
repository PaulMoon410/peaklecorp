'use client'

import React, { useState, useEffect } from 'react'
import { Play, Pause, CheckCircle, Clock, AlertCircle, Plus, Filter, Search } from 'lucide-react'

interface BusinessProcess {
  id: string
  name: string
  description: string
  type: 'payroll' | 'vendor' | 'treasury' | 'compliance' | 'reporting'
  status: 'active' | 'paused' | 'completed' | 'failed'
  progress: number
  startDate: string
  estimatedCompletion: string
  operations: number
  resourceCost: number
  value: number
  department: string
}

const WorkflowTracker = () => {
  const [processes, setProcesses] = useState<BusinessProcess[]>([
    {
      id: '1',
      name: 'Monthly Payroll Distribution',
      description: 'Automated employee salary payments via Hive blockchain',
      type: 'payroll',
      status: 'active',
      progress: 85,
      startDate: '2024-01-15',
      estimatedCompletion: '2024-01-16',
      operations: 247,
      resourceCost: 0.125,
      value: 85000,
      department: 'HR'
    },
    {
      id: '2',
      name: 'Vendor Payment Processing',
      description: 'Automated supplier payments and invoice reconciliation',
      type: 'vendor',
      status: 'active',
      progress: 62,
      startDate: '2024-01-14',
      estimatedCompletion: '2024-01-17',
      operations: 89,
      resourceCost: 0.089,
      value: 125000,
      department: 'Finance'
    },
    {
      id: '3',
      name: 'Treasury Rebalancing',
      description: 'Automated HIVE/HBD portfolio rebalancing and optimization',
      type: 'treasury',
      status: 'completed',
      progress: 100,
      startDate: '2024-01-10',
      estimatedCompletion: '2024-01-13',
      operations: 156,
      resourceCost: 0.045,
      value: 75000,
      department: 'Finance'
    },
    {
      id: '4',
      name: 'Compliance Reporting',
      description: 'Automated financial compliance reports and audit trails',
      type: 'compliance',
      status: 'active',
      progress: 35,
      startDate: '2024-01-15',
      estimatedCompletion: '2024-01-18',
      operations: 23,
      resourceCost: 0.012,
      value: 0,
      department: 'Legal'
    }
  ])

  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'payroll': return 'bg-blue-500'
      case 'vendor': return 'bg-purple-500'
      case 'treasury': return 'bg-orange-500'
      case 'compliance': return 'bg-green-500'
      case 'reporting': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/10'
      case 'paused': return 'text-yellow-400 bg-yellow-400/10'
      case 'completed': return 'text-blue-400 bg-blue-400/10'
      case 'failed': return 'text-red-400 bg-red-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play size={16} />
      case 'paused': return <Pause size={16} />
      case 'completed': return <CheckCircle size={16} />
      case 'failed': return <AlertCircle size={16} />
      default: return <Clock size={16} />
    }
  }

  const filteredProcesses = processes.filter(process => {
    const matchesFilter = filter === 'all' || process.status === filter
    const matchesSearch = process.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         process.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Workflow Tracker</h2>
          <p className="text-gray-400 mt-1">Monitor and manage your automated blockchain workflows</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center">
            <Plus size={20} className="mr-2" />
            Create Workflow
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="glass rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-600 focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
          
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search workflows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 border border-gray-600 focus:outline-none focus:border-blue-500 min-w-64"
            />
          </div>
        </div>
      </div>

      {/* Workflow Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Workflows</p>
              <p className="text-2xl font-bold text-green-400">
                {workflows.filter(w => w.status === 'active').length}
              </p>
            </div>
            <Play className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Completed</p>
              <p className="text-2xl font-bold text-blue-400">
                {workflows.filter(w => w.status === 'completed').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Value</p>
              <p className="text-2xl font-bold text-white">
                ${workflows.reduce((sum, w) => sum + w.value, 0).toLocaleString()}
              </p>
            </div>
            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <span className="text-purple-400">$</span>
            </div>
          </div>
        </div>
        
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Gas Used</p>
              <p className="text-2xl font-bold text-yellow-400">
                {workflows.reduce((sum, w) => sum + w.gasUsed, 0).toFixed(3)} ETH
              </p>
            </div>
            <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <span className="text-yellow-400">⛽</span>
            </div>
          </div>
        </div>
      </div>

      {/* Workflow List */}
      <div className="space-y-4">
        {filteredWorkflows.map((workflow) => (
          <div key={workflow.id} className="glass rounded-xl p-6 hover:bg-white/10 transition-all">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`w-3 h-3 rounded-full ${getChainColor(workflow.chain)}`} />
                  <h3 className="text-xl font-semibold text-white">{workflow.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(workflow.status)}`}>
                    {getStatusIcon(workflow.status)}
                    <span className="ml-1 capitalize">{workflow.status}</span>
                  </span>
                </div>
                <p className="text-gray-400 mb-3">{workflow.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Chain:</span>
                    <span className="text-white ml-2 capitalize">{workflow.chain}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Transactions:</span>
                    <span className="text-white ml-2">{workflow.transactions}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Value:</span>
                    <span className="text-white ml-2">${workflow.value.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Gas Used:</span>
                    <span className="text-white ml-2">{workflow.gasUsed} ETH</span>
                  </div>
                </div>
              </div>
              
              <div className="lg:w-64 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white">{workflow.progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all"
                    style={{ width: `${workflow.progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Started: {workflow.startDate}</span>
                  <span>Est: {workflow.estimatedCompletion}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredWorkflows.length === 0 && (
        <div className="glass rounded-xl p-12 text-center">
          <p className="text-gray-400 text-lg">No workflows found matching your criteria</p>
        </div>
      )}
    </div>
  )
}

export default WorkflowTracker
