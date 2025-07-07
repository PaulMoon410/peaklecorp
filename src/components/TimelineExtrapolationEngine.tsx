'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ScatterChart, Scatter } from 'recharts'
import { Clock, TrendingUp, Calendar, Target, AlertTriangle, CheckCircle, Calculator, Zap, Users, DollarSign } from 'lucide-react'

interface ProjectInput {
  id: string
  name: string
  description: string
  category: 'development' | 'deployment' | 'audit' | 'testing' | 'integration'
  complexity: 'low' | 'medium' | 'high' | 'enterprise'
  estimatedHours: number
  actualHours?: number
  startDate: Date
  targetDate: Date
  completionDate?: Date
  team: {
    size: number
    experience: 'junior' | 'mid' | 'senior' | 'mixed'
  }
  requirements: {
    blockchains: string[]
    integrations: string[]
    customFeatures: number
  }
  risks: {
    technical: number
    timeline: number
    resource: number
  }
  dependencies: string[]
  costEstimate: number
  actualCost?: number
}

interface TimelinePrediction {
  projectId: string
  predictedDuration: number
  confidenceLevel: number
  riskFactors: string[]
  recommendations: string[]
  costPrediction: number
  resourceRequirements: {
    developers: number
    auditors: number
    testers: number
  }
  milestones: {
    name: string
    estimatedDate: Date
    confidence: number
    dependencies: string[]
  }[]
}

interface HistoricalData {
  category: string
  complexity: string
  avgDuration: number
  avgCost: number
  successRate: number
  commonRisks: string[]
}

const TimelineExtrapolationEngine = () => {
  const [projects, setProjects] = useState<ProjectInput[]>([])
  const [predictions, setPredictions] = useState<TimelinePrediction[]>([])
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([])
  const [selectedProject, setSelectedProject] = useState<ProjectInput | null>(null)
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)
  const [predictionMode, setPredictionMode] = useState<'conservative' | 'aggressive' | 'realistic'>('realistic')

  useEffect(() => {
    // Initialize with sample historical data
    const sampleHistoricalData: HistoricalData[] = [
      {
        category: 'development',
        complexity: 'low',
        avgDuration: 240, // hours
        avgCost: 24000,
        successRate: 95,
        commonRisks: ['scope creep', 'unclear requirements']
      },
      {
        category: 'development',
        complexity: 'medium',
        avgDuration: 480,
        avgCost: 60000,
        successRate: 85,
        commonRisks: ['integration challenges', 'third-party dependencies']
      },
      {
        category: 'development',
        complexity: 'high',
        avgDuration: 960,
        avgCost: 150000,
        successRate: 75,
        commonRisks: ['technical complexity', 'team coordination', 'changing requirements']
      },
      {
        category: 'audit',
        complexity: 'medium',
        avgDuration: 120,
        avgCost: 25000,
        successRate: 90,
        commonRisks: ['security vulnerabilities', 'code quality issues']
      }
    ]

    const sampleProjects: ProjectInput[] = [
      {
        id: '1',
        name: 'Multi-Chain DEX Integration',
        description: 'Integrate DEX functionality across Ethereum, Polygon, and Polkadot',
        category: 'development',
        complexity: 'high',
        estimatedHours: 800,
        actualHours: 920,
        startDate: new Date('2024-01-01'),
        targetDate: new Date('2024-03-15'),
        completionDate: new Date('2024-03-22'),
        team: {
          size: 5,
          experience: 'mixed'
        },
        requirements: {
          blockchains: ['ethereum', 'polygon', 'polkadot'],
          integrations: ['1inch', 'Uniswap', 'SushiSwap'],
          customFeatures: 8
        },
        risks: {
          technical: 7,
          timeline: 6,
          resource: 4
        },
        dependencies: ['smart contract audit', 'UI/UX design'],
        costEstimate: 120000,
        actualCost: 135000
      },
      {
        id: '2',
        name: 'Corporate Staking Dashboard',
        description: 'Build enterprise-grade staking management interface',
        category: 'development',
        complexity: 'medium',
        estimatedHours: 400,
        startDate: new Date('2024-02-01'),
        targetDate: new Date('2024-03-01'),
        team: {
          size: 3,
          experience: 'senior'
        },
        requirements: {
          blockchains: ['ethereum', 'polkadot'],
          integrations: ['Lido', 'RocketPool'],
          customFeatures: 5
        },
        risks: {
          technical: 4,
          timeline: 3,
          resource: 2
        },
        dependencies: ['API integrations'],
        costEstimate: 65000
      }
    ]

    setHistoricalData(sampleHistoricalData)
    setProjects(sampleProjects)
    
    // Generate predictions for existing projects
    const predictions = sampleProjects.map(project => generatePrediction(project, sampleHistoricalData))
    setPredictions(predictions)
  }, [])

  const generatePrediction = (project: ProjectInput, historical: HistoricalData[]): TimelinePrediction => {
    const relevantHistory = historical.find(h => 
      h.category === project.category && h.complexity === project.complexity
    )

    const baseMultiplier = {
      conservative: 1.3,
      realistic: 1.1,
      aggressive: 0.9
    }[predictionMode]

    const complexityMultiplier = {
      low: 1.0,
      medium: 1.5,
      high: 2.2,
      enterprise: 3.0
    }[project.complexity]

    const teamExperienceMultiplier = {
      junior: 1.4,
      mid: 1.1,
      senior: 0.8,
      mixed: 1.0
    }[project.team.experience]

    const blockchainComplexityMultiplier = 1 + (project.requirements.blockchains.length - 1) * 0.2

    let predictedDuration = project.estimatedHours
    if (relevantHistory) {
      predictedDuration = relevantHistory.avgDuration
    }

    predictedDuration *= baseMultiplier * complexityMultiplier * teamExperienceMultiplier * blockchainComplexityMultiplier

    const riskMultiplier = 1 + (project.risks.technical + project.risks.timeline + project.risks.resource) / 30

    predictedDuration *= riskMultiplier

    const confidenceLevel = Math.max(50, 100 - (project.risks.technical + project.risks.timeline) * 5)

    const costPrediction = predictedDuration * 150 // $150/hour average

    return {
      projectId: project.id,
      predictedDuration: Math.round(predictedDuration),
      confidenceLevel: Math.round(confidenceLevel),
      riskFactors: generateRiskFactors(project),
      recommendations: generateRecommendations(project),
      costPrediction: Math.round(costPrediction),
      resourceRequirements: {
        developers: Math.ceil(predictedDuration / 160), // Assuming 160 hours per month per dev
        auditors: project.requirements.blockchains.length,
        testers: Math.ceil(project.requirements.customFeatures / 3)
      },
      milestones: generateMilestones(project, predictedDuration)
    }
  }

  const generateRiskFactors = (project: ProjectInput): string[] => {
    const risks: string[] = []
    
    if (project.risks.technical > 6) risks.push('High technical complexity')
    if (project.requirements.blockchains.length > 2) risks.push('Multi-chain integration complexity')
    if (project.requirements.customFeatures > 5) risks.push('Extensive custom development')
    if (project.team.experience === 'junior') risks.push('Junior team experience')
    if (project.dependencies.length > 2) risks.push('Multiple external dependencies')
    
    return risks
  }

  const generateRecommendations = (project: ProjectInput): string[] => {
    const recommendations: string[] = []
    
    if (project.risks.technical > 6) recommendations.push('Consider proof-of-concept phase')
    if (project.requirements.blockchains.length > 2) recommendations.push('Implement sequential chain integration')
    if (project.team.size < 3) recommendations.push('Consider expanding team size')
    if (project.risks.timeline > 5) recommendations.push('Add 20% buffer to timeline')
    
    return recommendations
  }

  const generateMilestones = (project: ProjectInput, duration: number): TimelinePrediction['milestones'] => {
    const milestones = [
      { name: 'Requirements Analysis', percentage: 0.15, dependencies: [] },
      { name: 'Technical Design', percentage: 0.25, dependencies: ['Requirements Analysis'] },
      { name: 'Core Development', percentage: 0.60, dependencies: ['Technical Design'] },
      { name: 'Integration Testing', percentage: 0.80, dependencies: ['Core Development'] },
      { name: 'Security Audit', percentage: 0.90, dependencies: ['Integration Testing'] },
      { name: 'Deployment', percentage: 1.0, dependencies: ['Security Audit'] }
    ]

    return milestones.map(milestone => ({
      name: milestone.name,
      estimatedDate: new Date(project.startDate.getTime() + (duration * milestone.percentage * 60 * 60 * 1000)),
      confidence: Math.max(60, 100 - project.risks.timeline * 5),
      dependencies: milestone.dependencies
    }))
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'bg-green-500'
      case 'medium': return 'bg-yellow-500'
      case 'high': return 'bg-orange-500'
      case 'enterprise': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-400'
    if (confidence >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const performanceData = projects.map(project => {
    const prediction = predictions.find(p => p.projectId === project.id)
    return {
      name: project.name.slice(0, 10) + '...',
      estimated: project.estimatedHours,
      predicted: prediction?.predictedDuration || 0,
      actual: project.actualHours || 0,
      confidence: prediction?.confidenceLevel || 0
    }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Timeline Extrapolation Engine</h2>
          <p className="text-gray-400 mt-1">AI-powered project timeline prediction and cost estimation</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-4">
          <select
            value={predictionMode}
            onChange={(e) => setPredictionMode(e.target.value as 'conservative' | 'aggressive' | 'realistic')}
            className="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:border-blue-500"
          >
            <option value="conservative">Conservative</option>
            <option value="realistic">Realistic</option>
            <option value="aggressive">Aggressive</option>
          </select>
          <button
            onClick={() => setShowNewProjectModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center"
          >
            <Calculator size={20} className="mr-2" />
            New Prediction
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg Accuracy</p>
              <p className="text-2xl font-bold text-green-400">87.3%</p>
            </div>
            <Target className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Predictions</p>
              <p className="text-2xl font-bold text-blue-400">{predictions.length}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Cost Variance</p>
              <p className="text-2xl font-bold text-yellow-400">±12%</p>
            </div>
            <DollarSign className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">On-Time Delivery</p>
              <p className="text-2xl font-bold text-purple-400">78%</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Prediction vs Actual Performance</h3>
        <div className="h-80">
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
              <Bar dataKey="estimated" fill="#3B82F6" name="Original Estimate" />
              <Bar dataKey="predicted" fill="#10B981" name="AI Prediction" />
              <Bar dataKey="actual" fill="#F59E0B" name="Actual" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Project List and Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project List */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Projects</h3>
          <div className="space-y-4">
            {projects.map((project) => {
              const prediction = predictions.find(p => p.projectId === project.id)
              return (
                <div
                  key={project.id}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    selectedProject?.id === project.id
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-600 bg-gray-800/50 hover:bg-gray-700/50'
                  }`}
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getComplexityColor(project.complexity)}`} />
                      <h4 className="font-semibold text-white">{project.name}</h4>
                    </div>
                    {prediction && (
                      <span className={`text-sm font-medium ${getConfidenceColor(prediction.confidenceLevel)}`}>
                        {prediction.confidenceLevel}% confidence
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-3">{project.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Complexity:</span>
                      <span className="text-white ml-2 capitalize">{project.complexity}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Team Size:</span>
                      <span className="text-white ml-2">{project.team.size}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Estimated:</span>
                      <span className="text-white ml-2">{project.estimatedHours}h</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Predicted:</span>
                      <span className="text-blue-400 ml-2">{prediction?.predictedDuration || 'N/A'}h</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Prediction Details */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            {selectedProject ? `${selectedProject.name} - Prediction` : 'Select a Project'}
          </h3>
          
          {selectedProject ? (
            <div className="space-y-6">
              {(() => {
                const prediction = predictions.find(p => p.projectId === selectedProject.id)
                if (!prediction) return <div>No prediction available</div>
                
                return (
                  <>
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-800/50 rounded-lg">
                        <p className="text-gray-400 text-sm">Predicted Duration</p>
                        <p className="text-2xl font-bold text-blue-400">{prediction.predictedDuration}h</p>
                        <p className="text-gray-400 text-xs">vs {selectedProject.estimatedHours}h estimated</p>
                      </div>
                      <div className="p-4 bg-gray-800/50 rounded-lg">
                        <p className="text-gray-400 text-sm">Cost Prediction</p>
                        <p className="text-2xl font-bold text-green-400">${prediction.costPrediction.toLocaleString()}</p>
                        <p className="text-gray-400 text-xs">vs ${selectedProject.costEstimate.toLocaleString()} estimated</p>
                      </div>
                    </div>

                    {/* Resource Requirements */}
                    <div>
                      <h4 className="font-medium text-white mb-3">Resource Requirements</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                          <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                          <p className="text-white font-semibold">{prediction.resourceRequirements.developers}</p>
                          <p className="text-gray-400 text-sm">Developers</p>
                        </div>
                        <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                          <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
                          <p className="text-white font-semibold">{prediction.resourceRequirements.auditors}</p>
                          <p className="text-gray-400 text-sm">Auditors</p>
                        </div>
                        <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                          <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                          <p className="text-white font-semibold">{prediction.resourceRequirements.testers}</p>
                          <p className="text-gray-400 text-sm">Testers</p>
                        </div>
                      </div>
                    </div>

                    {/* Risk Factors */}
                    <div>
                      <h4 className="font-medium text-white mb-3">Risk Factors</h4>
                      <div className="space-y-2">
                        {prediction.riskFactors.map((risk, index) => (
                          <div key={index} className="flex items-center space-x-2 p-2 bg-red-500/10 rounded-lg">
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                            <span className="text-red-300 text-sm">{risk}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <h4 className="font-medium text-white mb-3">Recommendations</h4>
                      <div className="space-y-2">
                        {prediction.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-center space-x-2 p-2 bg-green-500/10 rounded-lg">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-green-300 text-sm">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Timeline Milestones */}
                    <div>
                      <h4 className="font-medium text-white mb-3">Predicted Milestones</h4>
                      <div className="space-y-3">
                        {prediction.milestones.map((milestone, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                            <div>
                              <p className="text-white font-medium">{milestone.name}</p>
                              <p className="text-gray-400 text-sm">{milestone.estimatedDate.toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <p className={`font-medium ${getConfidenceColor(milestone.confidence)}`}>
                                {milestone.confidence}%
                              </p>
                              <p className="text-gray-400 text-xs">confidence</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )
              })()}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              <Calculator size={48} className="mx-auto mb-4 opacity-50" />
              <p>Select a project to view timeline predictions and insights</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TimelineExtrapolationEngine
