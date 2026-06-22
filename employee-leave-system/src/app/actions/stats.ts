"use server";

import { prisma } from "@/lib/db";

export async function getDashboardStatsAction() {
  const [totalEmployees, pendingRequests, approvedRequests, rejectedRequests] = await Promise.all([
    prisma.employee.count(),
    prisma.leaveRequest.count({ where: { status: "PENDING" } }),
    prisma.leaveRequest.count({ where: { status: "APPROVED" } }),
    prisma.leaveRequest.count({ where: { status: "REJECTED" } }),
  ]);

  return {
    totalEmployees,
    pendingRequests,
    approvedRequests,
    rejectedRequests,
  };
}
