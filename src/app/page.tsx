"use client";

import React, { useState, useEffect } from "react";
// COMMENTED OUT: Multi-chain wallet connections - Removed for Hive-only focus
// import { ConnectButton } from '@rainbow-me/rainbowkit'
// import { useAccount, useBalance } from 'wagmi'
import Dashboard from "@/components/Dashboard";
import WorkflowTracker from "@/components/WorkflowTracker";
import Analytics from "@/components/Analytics";
// COMMENTED OUT: Non-Hive blockchain integrations - Removed for focus on Hive/PeakeCoin only
// import PolkadotIntegration from '@/components/PolkadotIntegration'
import BatchTransactionManager from "@/components/BatchTransactionManager";
import TimelineExtrapolationEngine from "@/components/TimelineExtrapolationEngine";
import ProjectManagementDashboard from "@/components/ProjectManagementDashboard";
import AdvancedAnalyticsDashboard from "@/components/AdvancedAnalytics";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  // COMMENTED OUT: Multi-chain wallet connection state - Removed for Hive-only focus
  // const { address, isConnected } = useAccount()

  // TODO: Implement Hive wallet connection state
  const [isHiveConnected, setIsHiveConnected] = useState(false);
  const [hiveAccount, setHiveAccount] = useState<string | null>(null);

  // TODO: Implement HiveKeychain connection logic
  const connectToHive = async () => {
    // Implementation for HiveKeychain integration
    console.log("Connecting to Hive blockchain...");
    // This will be implemented with HiveKeychain
    setIsHiveConnected(true);
    setHiveAccount("sample-hive-user");
  };

  const disconnectFromHive = () => {
    setIsHiveConnected(false);
    setHiveAccount(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation Header */}
      <nav className="glass border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PC</span>
            </div>
            <h1 className="text-2xl font-bold text-white">PeakeCorp</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex space-x-2">
              {[
                "dashboard",
                "workflows",
                "analytics",
                "advanced",
                "batch",
                "timeline",
                "projects",
              ].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    activeTab === tab
                      ? "bg-orange-600 text-white shadow-lg"
                      : "text-gray-300 hover:bg-white/10"
                  }`}
                >
                  {tab === "advanced"
                    ? "Advanced Analytics"
                    : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* TODO: Replace with HiveKeychain connect button */}
            <button
              onClick={isHiveConnected ? disconnectFromHive : connectToHive}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {isHiveConnected ? `Connected: ${hiveAccount}` : "Connect Hive"}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {!isHiveConnected ? (
          <div className="text-center py-20">
            <div className="glass rounded-2xl p-12 max-w-md mx-auto">
              <h2 className="text-3xl font-bold text-white mb-4">
                Connect to Hive Blockchain
              </h2>
              <p className="text-gray-300 mb-8">
                Connect your Hive wallet to start using PeakeCorp's enterprise
                workflow management system
              </p>
              <button
                onClick={connectToHive}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Connect with HiveKeychain
              </button>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            {activeTab === "dashboard" && <Dashboard />}
            {activeTab === "workflows" && <WorkflowTracker />}
            {activeTab === "analytics" && <Analytics />}
            {activeTab === "advanced" && <AdvancedAnalyticsDashboard />}
            {/* COMMENTED OUT: Non-Hive integration - Removed for Hive/PeakeCoin focus */}
            {/* {activeTab === 'polkadot' && <PolkadotIntegration />} */}
            {activeTab === "batch" && <BatchTransactionManager />}
            {activeTab === "timeline" && <TimelineExtrapolationEngine />}
            {activeTab === "projects" && <ProjectManagementDashboard />}
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-white/10 p-4">
        <div className="flex justify-around">
          {[
            "dashboard",
            "workflows",
            "analytics",
            "advanced",
            "batch",
            "timeline",
            "projects",
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`p-2 rounded-lg transition-all text-xs ${
                activeTab === tab ? "bg-orange-600 text-white" : "text-gray-300"
              }`}
            >
              {tab === "advanced"
                ? "Advanced"
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
