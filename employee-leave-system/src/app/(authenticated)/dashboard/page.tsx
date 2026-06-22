"use client";

import { Users, Clock, CheckCircle, XCircle } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const stats = useDashboardStats();

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard" 
        description="Overview of employee leave management" 
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[90px] w-full rounded-2xl bg-[#263646]" />
          ))
        ) : (
          <>
            <StatCard
              title="Total Employees"
              value={stats.totalEmployees}
              icon={Users}
              iconClassName="bg-blue-100 text-blue-600"
            />
            <StatCard
              title="Pending Requests"
              value={stats.pendingRequests}
              icon={Clock}
              iconClassName="bg-amber-100 text-amber-600"
            />
            <StatCard
              title="Approved Requests"
              value={stats.approvedRequests}
              icon={CheckCircle}
              iconClassName="bg-green-100 text-green-600"
            />
            <StatCard
              title="Rejected Requests"
              value={stats.rejectedRequests}
              icon={XCircle}
              iconClassName="bg-red-100 text-red-600"
            />
          </>
        )}
      </div>
    </div>
  );
}
