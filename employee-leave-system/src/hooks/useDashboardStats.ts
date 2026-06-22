"use client";

import { useCallback, useEffect, useState } from "react";
import { getDashboardStatsAction } from "@/app/actions/stats";

export type DashboardStats = {
  totalEmployees: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
};

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
  });

  const loadStats = useCallback(async () => {
    try {
      const data = await getDashboardStatsAction();
      setStats(data);
    } catch (e) {
      console.error("Failed to load stats", e);
    }
  }, []);

  useEffect(() => {
    loadStats();
    
    // Auto-refresh every 10 seconds to keep stats updated
    const interval = setInterval(loadStats, 10000);
    
    return () => clearInterval(interval);
  }, [loadStats]);

  return stats;
}
