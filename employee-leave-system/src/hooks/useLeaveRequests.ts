"use client";

import { useState, useEffect, useCallback } from "react";
import { LeaveRequest, LeaveStatus } from "@/types/leave";
import { 
  getLeaveRequestsAction, 
  createLeaveRequestAction, 
  updateLeaveRequestStatusAction, 
  deleteLeaveRequestAction, 
  updateLeaveRequestAction 
} from "@/app/actions/leave";
import { useAuth } from "@/hooks/useAuth";

type StatusFilter = LeaveStatus | "ALL";

export function useLeaveRequests() {
  const auth = useAuth();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const loadLeaveRequests = useCallback(
    async (filter: StatusFilter = statusFilter) => {
      setIsLoading(true);
      try {
        const data = await getLeaveRequestsAction(filter);
        setLeaveRequests(data as LeaveRequest[]);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    },
    [statusFilter]
  );

  useEffect(() => {
    loadLeaveRequests(statusFilter);
  }, [loadLeaveRequests, statusFilter]);

  const createLeaveRequest = useCallback(
    async (data: Omit<LeaveRequest, "id" | "status">): Promise<LeaveRequest> => {
      const newRequest = await createLeaveRequestAction(data);
      await loadLeaveRequests();
      return newRequest as LeaveRequest;
    },
    [loadLeaveRequests]
  );

  const approveRequest = useCallback(
    async (id: string): Promise<LeaveRequest> => {
      const approverName = auth.username || "System";
      const updated = await updateLeaveRequestStatusAction(id, "APPROVED", approverName);
      await loadLeaveRequests();
      return updated as LeaveRequest;
    },
    [loadLeaveRequests, auth.username]
  );

  const rejectRequest = useCallback(
    async (id: string): Promise<LeaveRequest> => {
      const approverName = auth.username || "System";
      const updated = await updateLeaveRequestStatusAction(id, "REJECTED", approverName);
      await loadLeaveRequests();
      return updated as LeaveRequest;
    },
    [loadLeaveRequests, auth.username]
  );

  const updateLeaveRequest = useCallback(
    async (id: string, data: Omit<LeaveRequest, "id" | "status">): Promise<LeaveRequest> => {
      const updated = await updateLeaveRequestAction(id, data);
      await loadLeaveRequests();
      return updated as LeaveRequest;
    },
    [loadLeaveRequests]
  );

  const deleteLeaveRequest = useCallback(
    async (id: string): Promise<void> => {
      await deleteLeaveRequestAction(id);
      await loadLeaveRequests();
    },
    [loadLeaveRequests]
  );

  const handleSetStatusFilter = useCallback((status: StatusFilter) => {
    setStatusFilter(status);
  }, []);

  return {
    leaveRequests,
    isLoading,
    statusFilter,
    createLeaveRequest,
    approveRequest,
    rejectRequest,
    updateLeaveRequest,
    deleteLeaveRequest,
    setStatusFilter: handleSetStatusFilter,
    refreshLeaveRequests: loadLeaveRequests,
  };
}
