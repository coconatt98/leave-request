"use server";

import { prisma } from "@/lib/db";

export async function getDashboardStatsAction() {
  const [totalEmployees, pendingRequests, approvedRequests, rejectedRequests] = await Promise.all([
    prisma.employee.count(),
    prisma.leaveRequest.count({ where: { status: "PENDING" } }),
    prisma.leaveRequest.count({ where: { status: "APPROVED" } }),
    prisma.leaveRequest.count({ where: { status: "REJECTED" } }),
  ]);

  const employeesByDepartment = await prisma.employee.groupBy({
    by: ['department'],
    _count: { id: true },
  });

  const departmentStats = employeesByDepartment.map(d => ({
    department: d.department,
    count: d._count.id
  }));

  return {
    totalEmployees,
    pendingRequests,
    approvedRequests,
    rejectedRequests,
    departmentStats,
  };
}
