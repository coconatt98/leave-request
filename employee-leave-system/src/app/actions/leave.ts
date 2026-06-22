"use server";

import { prisma } from "@/lib/db";
import { LeaveStatus } from "@prisma/client";

export async function getLeaveRequestsAction(statusFilter: string) {
  const where = statusFilter === "ALL" ? {} : { status: statusFilter as LeaveStatus };
  const leaves = await prisma.leaveRequest.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
  return leaves.map(l => ({
    ...l,
    startDate: l.startDate.toISOString(),
    endDate: l.endDate.toISOString(),
  }));
}

export async function getLeaveRequestByIdAction(id: string) {
  const l = await prisma.leaveRequest.findUnique({
    where: { id }
  });
  if (!l) return null;
  return {
    ...l,
    startDate: l.startDate.toISOString(),
    endDate: l.endDate.toISOString(),
  };
}

export async function createLeaveRequestAction(data: any) {
  const newLeave = await prisma.leaveRequest.create({
    data: {
      employeeId: data.employeeId,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      reason: data.reason,
      status: "PENDING"
    }
  });
  return { ...newLeave, startDate: newLeave.startDate.toISOString(), endDate: newLeave.endDate.toISOString() };
}

export async function updateLeaveRequestStatusAction(id: string, status: LeaveStatus, approvedBy?: string) {
  const updated = await prisma.leaveRequest.update({
    where: { id },
    data: { status, approvedBy }
  });
  return { ...updated, startDate: updated.startDate.toISOString(), endDate: updated.endDate.toISOString() };
}

export async function deleteLeaveRequestAction(id: string) {
  await prisma.leaveRequest.delete({ where: { id } });
}

export async function updateLeaveRequestAction(id: string, data: any) {
  const updated = await prisma.leaveRequest.update({
    where: { id },
    data: {
      employeeId: data.employeeId,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      reason: data.reason,
    }
  });
  return { ...updated, startDate: updated.startDate.toISOString(), endDate: updated.endDate.toISOString() };
}
