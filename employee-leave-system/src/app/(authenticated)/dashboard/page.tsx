"use client";

import { Users, Clock, CheckCircle, XCircle } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Skeleton } from "@/components/ui/skeleton";
import { LeaveStatusPieChart } from "@/components/dashboard/LeaveStatusPieChart";
import { DepartmentBarChart } from "@/components/dashboard/DepartmentBarChart";

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
            <Skeleton key={i} className="h-[90px] w-full rounded-2xl bg-slate-50 dark:bg-[#263646]" />
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {stats.isLoading ? (
          <>
            <Skeleton className="h-[380px] w-full rounded-2xl bg-slate-50 dark:bg-[#263646]" />
            <Skeleton className="h-[380px] w-full rounded-2xl bg-slate-50 dark:bg-[#263646]" />
          </>
        ) : (
          <>
            {/* Pie Chart Section */}
            <div className="rounded-2xl border border-slate-200 dark:border-[rgba(255,90,95,0.35)] bg-white dark:bg-[#1a1a1c] p-6 shadow-sm dark:shadow-[0_18px_40px_rgba(255,77,87,0.12)]">
              <h2 className="text-base font-semibold text-slate-800 dark:text-white mb-4">
                Leave Request Distribution
              </h2>
              <LeaveStatusPieChart 
                pending={stats.pendingRequests} 
                approved={stats.approvedRequests} 
                rejected={stats.rejectedRequests} 
              />
            </div>

            {/* Bar Chart Section */}
            <div className="rounded-2xl border border-slate-200 dark:border-[rgba(255,90,95,0.35)] bg-white dark:bg-[#1a1a1c] p-6 shadow-sm dark:shadow-[0_18px_40px_rgba(255,77,87,0.12)]">
              <h2 className="text-base font-semibold text-slate-800 dark:text-white mb-4">
                Employees by Department
              </h2>
              <DepartmentBarChart data={stats.departmentStats} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
