// Hive blockchain types and interfaces
export interface HiveAccount {
  id?: number
  name: string
  displayName: string
  balance: HiveAccountBalance
  votingPower: number
  resourceCredits: number
  reputation: number
  createdAt: string
  lastActive: string
  postCount: number
  followerCount: number
  followingCount: number
  metadata: any
}

export interface HiveAccountBalance {
  hive: number
  hbd: number
  hivePower: number
  hiveSavings: number
  hbdSavings: number
  peakeCoin: number
  estimatedValue: number
}

export interface HiveTransaction {
  id: string
  type: string
  from: string
  to: string
  amount: number
  currency: 'HIVE' | 'HBD' | 'PEAKE'
  memo?: string
  timestamp: string
  blockNumber: number
  transactionId: string
  resourceCost: number
  peakeRewards?: number
  status: 'pending' | 'confirmed' | 'failed' | 'completed'
  metadata?: any
}

export interface HiveTransactionHistory {
  transactions: HiveTransaction[]
  totalCount: number
  hasMore: boolean
}

export interface BatchTransaction {
  id: string
  type: 'transfer' | 'transfer_to_vesting' | 'custom_json'
  from: string
  to: string
  amount: number
  currency: 'HIVE' | 'HBD' | 'PEAKE'
  memo?: string
  metadata?: any
}

export interface TransactionResult {
  success: boolean
  transactionId: string
  error?: string
  blockNumber?: number
}

export interface PeakeCoinReward {
  transactionId: string
  baseReward: number
  multiplier: number
  bonusType: 'batch' | 'frequency' | 'volume' | 'loyalty'
  totalReward: number
  timestamp: Date
}

export interface BatchOperation {
  id: string
  name: string
  transactions: HiveTransaction[]
  estimatedSavings: number
  actualSavings?: number
  peakeBonus: number
  status: 'draft' | 'scheduled' | 'executing' | 'completed' | 'failed'
  scheduledTime?: Date
  executionTime?: Date
  resourceCostEstimate: number
  actualResourceCost?: number
}

export interface CorporateAccount {
  hiveAccount: string
  companyName: string
  tier: 'professional' | 'enterprise' | 'business-critical'
  monthlyTransactionLimit: number
  currentMonthUsage: number
  peakeBalance: number
  totalSavings: number
  complianceSettings: {
    requireApproval: boolean
    auditTrailRequired: boolean
    multiSigRequired: boolean
    approvers: string[]
  }
}

export interface ComplianceRecord {
  id: string
  transactionId: string
  type: 'SOX' | 'GAAP' | 'IFRS' | 'INTERNAL'
  description: string
  approver?: string
  approvalDate?: Date
  auditTrail: string[]
  riskLevel: 'low' | 'medium' | 'high'
  status: 'pending' | 'approved' | 'rejected'
}
