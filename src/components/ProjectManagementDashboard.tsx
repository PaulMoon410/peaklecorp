"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Package,
  Users,
  Target,
  Zap,
} from "lucide-react";

interface ProjectQuote {
  id: string;
  clientName: string;
  projectName: string;
  description: string;
  requirements: {
    blockchains: string[];
    features: string[];
    complexity: "low" | "medium" | "high" | "enterprise";
    timeline: number; // in weeks
  };
  estimatedCost: number;
  proposedTimeline: number;
  confidenceLevel: number;
  riskFactors: string[];
  batchSavings: number;
  status: "draft" | "sent" | "approved" | "declined";
  createdDate: Date;
  responseDate?: Date;
}

const ProjectManagementDashboard = () => {
  const [quotes, setQuotes] = useState<ProjectQuote[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<ProjectQuote | null>(null);
  const [showNewQuoteModal, setShowNewQuoteModal] = useState(false);

  useEffect(() => {
    // Initialize with sample quotes
    const sampleQuotes: ProjectQuote[] = [
      {
        id: "1",
        clientName: "TechCorp Industries",
        projectName: "Hive Corporate Payment Gateway",
        description:
          "Develop a comprehensive payment gateway using Hive blockchain and PeakeCoin rewards",
        requirements: {
          blockchains: ["hive"],
          features: [
            "Payment Processing",
            "Multi-Sig Wallets",
            "Analytics Dashboard",
            "Admin Panel",
          ],
          complexity: "high",
          timeline: 16,
        },
        estimatedCost: 185000,
        proposedTimeline: 18,
        confidenceLevel: 85,
        riskFactors: [
          "Multi-chain complexity",
          "Regulatory compliance",
          "Third-party integrations",
        ],
        batchSavings: 12000,
        status: "sent",
        createdDate: new Date("2024-01-15"),
        responseDate: new Date("2024-01-25"),
      },
      {
        id: "2",
        clientName: "DeFi Innovations",
        projectName: "Yield Farming Protocol",
        description:
          "Build automated yield farming and liquidity management protocol",
        requirements: {
          blockchains: ["hive"],
          features: [
            "Smart Contracts",
            "Frontend Interface",
            "Analytics",
            "Security Audit",
          ],
          complexity: "enterprise",
          timeline: 24,
        },
        estimatedCost: 320000,
        proposedTimeline: 28,
        confidenceLevel: 78,
        riskFactors: [
          "Smart contract security",
          "Market volatility impact",
          "Audit requirements",
        ],
        batchSavings: 18000,
        status: "approved",
        createdDate: new Date("2024-01-20"),
        responseDate: new Date("2024-02-05"),
      },
      {
        id: "3",
        clientName: "Enterprise Solutions LLC",
        projectName: "Corporate Wallet Management",
        description:
          "Enterprise-grade wallet management system with multi-approval workflows",
        requirements: {
          blockchains: ["hive"],
          features: [
            "Multi-Sig Wallets",
            "Approval Workflows",
            "Reporting",
            "Compliance Tools",
          ],
          complexity: "medium",
          timeline: 12,
        },
        estimatedCost: 145000,
        proposedTimeline: 14,
        confidenceLevel: 92,
        riskFactors: [
          "Compliance requirements",
          "Integration with existing systems",
        ],
        batchSavings: 8500,
        status: "draft",
        createdDate: new Date("2024-02-01"),
      },
    ];
    setQuotes(sampleQuotes);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-500/20 text-gray-400";
      case "sent":
        return "bg-blue-500/20 text-blue-400";
      case "approved":
        return "bg-green-500/20 text-green-400";
      case "declined":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "low":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "high":
        return "bg-orange-500";
      case "enterprise":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return "text-green-400";
    if (confidence >= 70) return "text-yellow-400";
    return "text-red-400";
  };

  const totalQuoteValue = quotes.reduce(
    (sum, quote) => sum + quote.estimatedCost,
    0
  );
  const approvedQuotes = quotes.filter((q) => q.status === "approved");
  const approvedValue = approvedQuotes.reduce(
    (sum, quote) => sum + quote.estimatedCost,
    0
  );
  const totalBatchSavings = quotes.reduce(
    (sum, quote) => sum + quote.batchSavings,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">
            Project Management Dashboard
          </h2>
          <p className="text-gray-400 mt-1">
            Manage client quotes, timelines, and project delivery
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            onClick={() => setShowNewQuoteModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center"
          >
            <Package size={20} className="mr-2" />
            New Quote
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Quote Value</p>
              <p className="text-2xl font-bold text-white">
                ${totalQuoteValue.toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Approved Value</p>
              <p className="text-2xl font-bold text-green-400">
                ${approvedValue.toLocaleString()}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Batch Savings</p>
              <p className="text-2xl font-bold text-blue-400">
                ${totalBatchSavings.toLocaleString()}
              </p>
            </div>
            <Package className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Win Rate</p>
              <p className="text-2xl font-bold text-purple-400">
                {Math.round(
                  (approvedQuotes.length /
                    quotes.filter((q) => q.status !== "draft").length) *
                    100
                )}
                %
              </p>
            </div>
            <Target className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Quotes List and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quotes List */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            Client Quotes
          </h3>
          <div className="space-y-4">
            {quotes.map((quote) => (
              <div
                key={quote.id}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  selectedQuote?.id === quote.id
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-gray-600 bg-gray-800/50 hover:bg-gray-700/50"
                }`}
                onClick={() => setSelectedQuote(quote)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${getComplexityColor(
                        quote.requirements.complexity
                      )}`}
                    />
                    <h4 className="font-semibold text-white">
                      {quote.projectName}
                    </h4>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                      quote.status
                    )}`}
                  >
                    {quote.status}
                  </span>
                </div>

                <p className="text-gray-400 text-sm mb-3">{quote.clientName}</p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Value:</span>
                    <span className="text-white ml-2">
                      ${quote.estimatedCost.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Timeline:</span>
                    <span className="text-white ml-2">
                      {quote.proposedTimeline} weeks
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Confidence:</span>
                    <span
                      className={`ml-2 ${getConfidenceColor(
                        quote.confidenceLevel
                      )}`}
                    >
                      {quote.confidenceLevel}%
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Savings:</span>
                    <span className="text-green-400 ml-2">
                      ${quote.batchSavings.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quote Details */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            {selectedQuote
              ? `${selectedQuote.projectName} - Details`
              : "Select a Quote"}
          </h3>

          {selectedQuote ? (
            <div className="space-y-6">
              {/* Client Info */}
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <h4 className="font-medium text-white mb-2">
                  Client Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Client:</span>
                    <span className="text-white ml-2">
                      {selectedQuote.clientName}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Created:</span>
                    <span className="text-white ml-2">
                      {selectedQuote.createdDate.toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Status:</span>
                    <span
                      className={`ml-2 px-2 py-1 rounded text-xs ${getStatusColor(
                        selectedQuote.status
                      )}`}
                    >
                      {selectedQuote.status}
                    </span>
                  </div>
                  {selectedQuote.responseDate && (
                    <div>
                      <span className="text-gray-400">Response:</span>
                      <span className="text-white ml-2">
                        {selectedQuote.responseDate.toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Project Requirements */}
              <div>
                <h4 className="font-medium text-white mb-3">Requirements</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Blockchains:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedQuote.requirements.blockchains.map(
                        (chain, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs capitalize"
                          >
                            {chain}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm mb-2">Features:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedQuote.requirements.features.map(
                        (feature, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs"
                          >
                            {feature}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <p className="text-gray-400 text-sm">Estimated Cost</p>
                  <p className="text-2xl font-bold text-white">
                    ${selectedQuote.estimatedCost.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <p className="text-gray-400 text-sm">Batch Savings</p>
                  <p className="text-2xl font-bold text-green-400">
                    ${selectedQuote.batchSavings.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Timeline Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <p className="text-gray-400 text-sm">Proposed Timeline</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {selectedQuote.proposedTimeline} weeks
                  </p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <p className="text-gray-400 text-sm">Confidence Level</p>
                  <p
                    className={`text-2xl font-bold ${getConfidenceColor(
                      selectedQuote.confidenceLevel
                    )}`}
                  >
                    {selectedQuote.confidenceLevel}%
                  </p>
                </div>
              </div>

              {/* Risk Factors */}
              <div>
                <h4 className="font-medium text-white mb-3">Risk Factors</h4>
                <div className="space-y-2">
                  {selectedQuote.riskFactors.map((risk, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 p-2 bg-red-500/10 rounded-lg"
                    >
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span className="text-red-300 text-sm">{risk}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-4">
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors">
                  Generate Proposal
                </button>
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                  Update Quote
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              <Package size={48} className="mx-auto mb-4 opacity-50" />
              <p>
                Select a quote to view detailed information and manage project
                delivery
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Timeline Optimization Insights */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          Timeline Optimization Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <div className="flex items-center space-x-3 mb-2">
              <Clock className="w-6 h-6 text-blue-400" />
              <h4 className="font-semibold text-blue-400">
                Batch Processing Benefits
              </h4>
            </div>
            <p className="text-gray-300 text-sm">
              Grouping similar transactions can reduce gas costs by up to 40%
              and improve delivery timelines by 15%.
            </p>
          </div>

          <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
            <div className="flex items-center space-x-3 mb-2">
              <TrendingUp className="w-6 h-6 text-green-400" />
              <h4 className="font-semibold text-green-400">
                Accuracy Improvement
              </h4>
            </div>
            <p className="text-gray-300 text-sm">
              Our AI-powered timeline predictions show 87% accuracy, helping
              provide more reliable delivery dates to clients.
            </p>
          </div>

          <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <div className="flex items-center space-x-3 mb-2">
              <Zap className="w-6 h-6 text-purple-400" />
              <h4 className="font-semibold text-purple-400">
                Resource Optimization
              </h4>
            </div>
            <p className="text-gray-300 text-sm">
              Smart resource allocation based on project complexity can reduce
              costs by 25% while maintaining quality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectManagementDashboard;
