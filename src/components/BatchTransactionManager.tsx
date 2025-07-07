'use client'

import React, { useState, useEffect } from 'react'
import { Clock, Package, DollarSign, TrendingUp, Calendar, Users, Plus, Trash2, Edit3, Save, X } from 'lucide-react'

interface BatchEntry {
  id: string
  description: string
  amount: number
  recipient: string
  resourceCost: number // Hive resource cost (RC - Resource Credits)
  priority: 'low' | 'medium' | 'high'
  category: string
  timestamp: Date
  token: 'HIVE' | 'PEAKE' | 'HBD' // Hive native tokens
  memo?: string // Hive transaction memo
  peakeRewards: number // PeakeCoin rewards for this transaction
  peakeMultiplier: number // Reward multiplier for using PeakeCoin
}

interface BatchGroup {
  id: string
  name: string
  entries: BatchEntry[]
  totalResourceCost: number
  totalAmount: number
  status: 'draft' | 'pending' | 'confirmed' | 'failed'
  estimatedSavings: number // Resource Credit savings
  scheduledTime?: Date
  peakeRewards: number // Total PeakeCoin rewards for this batch
  peakeBonus: number // Additional bonus for batching
  hivePower: number // Required Hive Power for batch execution
}

const BatchTransactionManager = () => {
  const [batches, setBatches] = useState<BatchGroup[]>([])
  const [selectedBatch, setSelectedBatch] = useState<BatchGroup | null>(null)
  const [newEntry, setNewEntry] = useState<Partial<BatchEntry>>({})
  const [editingEntry, setEditingEntry] = useState<string | null>(null)
  const [showNewBatchModal, setShowNewBatchModal] = useState(false)
  const [gasOptimizationMode, setGasOptimizationMode] = useState<'time' | 'cost'>('cost')

  useEffect(() => {
    // Initialize with sample data
    const sampleBatches: BatchGroup[] = [
      {
        id: '1',
        name: 'Monthly Payroll Batch',
        entries: [
          {
            id: '1',
            description: 'Employee salary payment',
            amount: 5000,
            recipient: '@employee1',
            resourceCost: 1200,
            priority: 'high',
            category: 'payroll',
            timestamp: new Date(),
            token: 'HIVE',
            memo: 'Monthly salary - December 2024',
            peakeRewards: 50,
            peakeMultiplier: 1.0
          },
          {
            id: '2',
            description: 'Contractor payment',
            amount: 2500,
            recipient: '@contractor1',
            resourceCost: 800,
            priority: 'medium',
            category: 'payroll',
            timestamp: new Date(),
            token: 'HBD',
            memo: 'Project completion bonus',
            peakeRewards: 25,
            peakeMultiplier: 1.2
          }
        ],
        totalResourceCost: 2000,
        totalAmount: 7500,
        status: 'draft',
        estimatedSavings: 400,
        scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
        peakeRewards: 75,
        peakeBonus: 15,
        hivePower: 150
      },
      {
        id: '2',
        name: 'PEAKE Token Distribution',
        entries: [
          {
            id: '3',
            description: 'Community rewards distribution',
            amount: 1200,
            recipient: '@community',
            resourceCost: 600,
            priority: 'high',
            category: 'rewards',
            timestamp: new Date(),
            token: 'PEAKE',
            memo: 'Weekly community engagement rewards',
            peakeRewards: 120,
            peakeMultiplier: 2.0
          }
        ],
        totalResourceCost: 600,
        totalAmount: 1200,
        status: 'pending',
        estimatedSavings: 120,
        scheduledTime: new Date(Date.now() + 48 * 60 * 60 * 1000),
        peakeRewards: 120,
        peakeBonus: 60,
        hivePower: 80
      }
    ]
    setBatches(sampleBatches)
  }, [])

  const calculateResourceSavings = (entries: BatchEntry[]) => {
    const individualRC = entries.length * 1000 // Individual RC cost
    const batchRC = 1000 + (entries.length - 1) * 200 // Estimated batch savings
    return individualRC - batchRC
  }

  const createNewBatch = (name: string) => {
    const newBatch: BatchGroup = {
      id: Date.now().toString(),
      name,
      entries: [],
      totalResourceCost: 0,
      totalAmount: 0,
      status: 'draft',
      estimatedSavings: 0,
      peakeRewards: 0,
      peakeBonus: 0,
      hivePower: 0
    }
    setBatches([...batches, newBatch])
    setSelectedBatch(newBatch)
    setShowNewBatchModal(false)
  }

  const addEntryToBatch = (batchId: string, entry: BatchEntry) => {
    setBatches(batches.map((batch: BatchGroup) => {
      if (batch.id === batchId) {
        const updatedEntries = [...batch.entries, entry]
        const totalPeakeRewards = updatedEntries.reduce((sum: number, e: BatchEntry) => sum + (e.peakeRewards || 0), 0)
        const peakeBonus = Math.floor(totalPeakeRewards * 0.2) // 20% bonus for batching
        return {
          ...batch,
          entries: updatedEntries,
          totalResourceCost: updatedEntries.reduce((sum: number, e: BatchEntry) => sum + e.resourceCost, 0),
          totalAmount: updatedEntries.reduce((sum: number, e: BatchEntry) => sum + e.amount, 0),
          estimatedSavings: calculateResourceSavings(updatedEntries),
          peakeRewards: totalPeakeRewards,
          peakeBonus: peakeBonus
        }
      }
      return batch
    }))
  }

  const removeEntryFromBatch = (batchId: string, entryId: string) => {
    setBatches(batches.map((batch: BatchGroup) => {
      if (batch.id === batchId) {
        const updatedEntries = batch.entries.filter((e: BatchEntry) => e.id !== entryId)
        const totalPeakeRewards = updatedEntries.reduce((sum: number, e: BatchEntry) => sum + (e.peakeRewards || 0), 0)
        const peakeBonus = Math.floor(totalPeakeRewards * 0.2) // 20% bonus for batching
        return {
          ...batch,
          entries: updatedEntries,
          totalResourceCost: updatedEntries.reduce((sum: number, e: BatchEntry) => sum + e.resourceCost, 0),
          totalAmount: updatedEntries.reduce((sum: number, e: BatchEntry) => sum + e.amount, 0),
          estimatedSavings: calculateResourceSavings(updatedEntries),
          peakeRewards: totalPeakeRewards,
          peakeBonus: peakeBonus
        }
      }
      return batch
    }))
  }

  const getChainColor = (chain: string) => {
    switch (chain) {
      case 'ethereum': return 'bg-blue-500'
      case 'polygon': return 'bg-purple-500'
      case 'polkadot': return 'bg-pink-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-gray-400 bg-gray-400/10'
      case 'pending': return 'text-yellow-400 bg-yellow-400/10'
      case 'confirmed': return 'text-green-400 bg-green-400/10'
      case 'failed': return 'text-red-400 bg-red-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">PeakeCoin Batch Manager</h2>
          <p className="text-gray-400 mt-1">Group Hive transactions to optimize Resource Credits and earn PeakeCoin rewards</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-4">
          <select
            value={gasOptimizationMode}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setGasOptimizationMode(e.target.value as 'time' | 'cost')}
            className="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:border-blue-500"
          >
            <option value="cost">Optimize for RC Cost</option>
            <option value="time">Optimize for Time</option>
          </select>
          <button
            onClick={() => setShowNewBatchModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center"
          >
            <Plus size={20} className="mr-2" />
            New Batch
          </button>
        </div>
      </div>

      {/* Optimization Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">RC Savings</p>
              <p className="text-2xl font-bold text-green-400">
                {batches.reduce((sum: number, batch: BatchGroup) => sum + batch.estimatedSavings, 0).toLocaleString()}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Batches</p>
              <p className="text-2xl font-bold text-blue-400">
                {batches.filter((b: BatchGroup) => b.status === 'draft' || b.status === 'pending').length}
              </p>
            </div>
            <Package className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Value</p>
              <p className="text-2xl font-bold text-white">
                {batches.reduce((sum: number, batch: BatchGroup) => sum + batch.totalAmount, 0).toLocaleString()} HIVE
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">PEAKE Rewards</p>
              <p className="text-2xl font-bold text-yellow-400">
                {batches.reduce((sum: number, batch: BatchGroup) => sum + batch.peakeRewards + batch.peakeBonus, 0).toLocaleString()}
              </p>
            </div>
            <Users className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Scheduled</p>
              <p className="text-2xl font-bold text-purple-400">
                {batches.filter((b: BatchGroup) => b.scheduledTime).length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Batch List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Batch Groups</h3>
          <div className="space-y-4">
            {batches.map((batch) => (
              <div
                key={batch.id}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  selectedBatch?.id === batch.id
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-600 bg-gray-800/50 hover:bg-gray-700/50'
                }`}
                onClick={() => setSelectedBatch(batch)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <h4 className="font-semibold text-white">{batch.name}</h4>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(batch.status)}`}>
                    {batch.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Entries:</span>
                    <span className="text-white ml-2">{batch.entries.length}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Platform:</span>
                    <span className="text-white ml-2">Hive</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Value:</span>
                    <span className="text-white ml-2">{batch.totalAmount.toLocaleString()} HIVE</span>
                  </div>
                  <div>
                    <span className="text-gray-400">RC Saved:</span>
                    <span className="text-green-400 ml-2">{batch.estimatedSavings.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">PEAKE Rewards:</span>
                    <span className="text-yellow-400 ml-2">{batch.peakeRewards.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">PEAKE Bonus:</span>
                    <span className="text-purple-400 ml-2">+{batch.peakeBonus.toLocaleString()}</span>
                  </div>
                </div>
                
                {batch.scheduledTime && (
                  <div className="mt-2 text-sm">
                    <span className="text-gray-400">Scheduled:</span>
                    <span className="text-white ml-2">{batch.scheduledTime.toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Selected Batch Details */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            {selectedBatch ? `${selectedBatch.name} Details` : 'Select a Batch'}
          </h3>
          
          {selectedBatch ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full bg-red-500" />
                  <span className="text-gray-400">Hive Blockchain</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
                    <Save size={16} className="mr-2" />
                    Execute Batch
                  </button>
                  <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
                    <Edit3 size={16} className="mr-2" />
                    Edit
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-800/50 rounded-lg">
                <div>
                  <p className="text-gray-400 text-sm">Total Entries</p>
                  <p className="text-white font-semibold">{selectedBatch.entries.length}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Value</p>
                  <p className="text-white font-semibold">{selectedBatch.totalAmount.toLocaleString()} HIVE</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">RC Cost</p>
                  <p className="text-white font-semibold">{selectedBatch.totalResourceCost.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">RC Savings</p>
                  <p className="text-green-400 font-semibold">{selectedBatch.estimatedSavings.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-white">Entries</h4>
                  <button
                    onClick={() => {
                      const newEntryId = Date.now().toString()
                      const entry: BatchEntry = {
                        id: newEntryId,
                        description: 'New transaction',
                        amount: 0,
                        recipient: '@username',
                        resourceCost: 1000,
                        priority: 'medium',
                        category: 'general',
                        timestamp: new Date(),
                        token: 'HIVE',
                        memo: 'Batch transaction',
                        peakeRewards: 0,
                        peakeMultiplier: 1.0
                      }
                      addEntryToBatch(selectedBatch.id, entry)
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition-colors flex items-center text-sm"
                  >
                    <Plus size={14} className="mr-1" />
                    Add Entry
                  </button>
                </div>
                
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedBatch.entries.map((entry: BatchEntry) => (
                    <div key={entry.id} className="p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(entry.priority)}`} />
                          <div>
                            <p className="text-white font-medium">{entry.description}</p>
                            <p className="text-gray-400 text-sm">{entry.recipient}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs bg-gray-700 px-2 py-1 rounded">{entry.token}</span>
                              {entry.peakeRewards && entry.peakeRewards > 0 && (
                                <span className="text-xs bg-yellow-600 px-2 py-1 rounded text-black">
                                  +{entry.peakeRewards} PEAKE
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-right">
                            <p className="text-white font-medium">{entry.amount.toLocaleString()} {entry.token}</p>
                            <p className="text-gray-400 text-sm">{entry.resourceCost.toLocaleString()} RC</p>
                          </div>
                          <button
                            onClick={() => removeEntryFromBatch(selectedBatch.id, entry.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              <Package size={48} className="mx-auto mb-4 opacity-50" />
              <p>Select a batch to view details and manage entries</p>
            </div>
          )}
        </div>
      </div>

      {/* New Batch Modal */}
      {showNewBatchModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Create New Batch</h3>
              <button
                onClick={() => setShowNewBatchModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target as HTMLFormElement)
                const name = formData.get('name') as string
                createNewBatch(name)
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Batch Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:border-blue-500"
                  placeholder="Enter batch name"
                />
              </div>
              
              <div className="text-sm text-gray-400">
                This batch will be created for the Hive blockchain with PeakeCoin rewards.
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Create Batch
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewBatchModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default BatchTransactionManager
