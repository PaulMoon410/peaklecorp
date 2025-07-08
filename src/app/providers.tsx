"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// COMMENTED OUT: Multi-chain providers - Removed for Hive-only focus
// This app now focuses exclusively on Hive blockchain and PeakeCoin

// TODO: Implement Hive blockchain connection and authentication
// This will include HiveKeychain integration and PeakeCoin wallet connectivity

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {/* HIVE/PEAKECORP PROVIDERS WILL BE IMPLEMENTED HERE */}
      {children}
    </QueryClientProvider>
  );
}
