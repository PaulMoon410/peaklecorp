'use client'

import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// COMMENTED OUT: Multi-chain providers (Ethereum, Polygon, Polkadot)
// Will be re-enabled after PeakeCorp/Hive functionality is fully implemented
/*
import { WagmiConfig, createConfig, configureChains, mainnet, polygon } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'

// Configure chains & providers
const { chains, publicClient } = configureChains(
  [mainnet, polygon],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID || '' }),
    publicProvider()
  ]
)

// Configure wallets
const { connectors } = getDefaultWallets({
  appName: 'PeakeCorp Workflow Analytics',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
  chains
})

// Create wagmi config
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})
*/

// TODO: Implement Hive blockchain connection and authentication
// This will include HiveKeychain integration and PeakeCoin wallet connectivity

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {/* HIVE/PEAKECORP PROVIDERS WILL BE IMPLEMENTED HERE */}
      {children}
    </QueryClientProvider>
  )
}
