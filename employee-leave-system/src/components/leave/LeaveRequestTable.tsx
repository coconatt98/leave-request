"use client";

import { useEffect, useState } from "react";
import { Check, X, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  iconActionClasses,
  tableCardClass,
  tableHeaderCellClass,
  tableRowClass,
} from "@/components/shared/telkomselStyles";
import { LeaveRequest } from "@/types/leave";
import { Employee } from "@/types/employee";
import { useEmployees } from "@/hooks/useEmployees";
import { useAuth } from "@/hooks/useAuth";
import { LeaveStatusBadge } from "./LeaveStatusBadge";

type LeaveRequestTableProps = {
  leaveRequests: LeaveRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export function LeaveRequestTable({
  leaveRequests,
  onApprove,
  onReject,
  onEdit,
  onDelete,
}: LeaveRequestTableProps) {
  const { employees } = useEmployees();
  const auth = useAuth();
  
  const currentEmployee = employees.find(e => e.username === auth.username);
  const myEmployeeId = currentEmployee?.id;

  const [employeeMap, setEmployeeMap] = useState<Map<string, string>>(
    new Map()
  );

  useEffect(() => {
    const map = new Map<string, string>(
      employees.map((emp: Employee) => [emp.id, emp.name])
    );
    setEmployeeMap(map);
  }, [leaveRequests, employees]);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  if (leaveRequests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 dark:border-[rgba(255,90,95,0.35)] bg-white dark:bg-[#1a1a1c] py-16 text-center text-slate-500 dark:text-[#cfcfd2] shadow-sm dark:shadow-[0_18px_40px_rgba(255,77,87,0.12)]">
        <p className="text-lg font-semibold text-white">No leave requests found</p>
        <p className="mt-1 text-sm">
          There are no requests matching the current filter.
        </p>
      </div>
    );
  }

  return (
    <div className={tableCardClass}>
      <Table>
        <TableHeader>
          <TableRow className="border-b border-[rgba(255,90,95,0.25)] bg-transparent">
            <TableHead className={cn(tableHeaderCellClass, "w-12 text-left")}>#</TableHead>
            <TableHead className={tableHeaderCellClass}>Employee</TableHead>
            <TableHead className={tableHeaderCellClass}>Start Date</TableHead>
            <TableHead className={tableHeaderCellClass}>End Date</TableHead>
            <TableHead className={tableHeaderCellClass}>Reason</TableHead>
            <TableHead className={tableHeaderCellClass}>Status</TableHead>
            <TableHead className={cn(tableHeaderCellClass, "text-right")}>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaveRequests.map((request, index) => {
            const isOwner = myEmployeeId === request.employeeId;
            const canApproveReject = auth.role === "ADMIN" || auth.role === "APPROVER";
            const canEdit = auth.role === "ADMIN" || isOwner;
            const canDelete = auth.role === "ADMIN" || (isOwner && request.status === "PENDING");

            return (
              <TableRow key={request.id} className={cn(tableRowClass, "last:border-0")}> 
                <TableCell className="px-4 py-2.5 text-xs text-slate-500 dark:text-[#cfcfd2]">
                  {index + 1}
                </TableCell>
                <TableCell className="px-4 py-2.5 text-sm font-semibold text-white">
                  {employeeMap.get(request.employeeId) ?? request.employeeId}
                </TableCell>
                <TableCell className="px-4 py-2.5 text-sm text-slate-500 dark:text-[#cfcfd2]">
                  <span className="animate-in fade-in duration-200" style={{ animationDelay: `${index * 20}ms` }}>
                    {formatDate(request.startDate)}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-2.5 text-sm text-slate-500 dark:text-[#cfcfd2]">
                  <span className="animate-in fade-in duration-200" style={{ animationDelay: `${index * 20 + 40}ms` }}>
                    {formatDate(request.endDate)}
                  </span>
                </TableCell>
                <TableCell className="max-w-[240px] px-4 py-2.5 text-sm text-slate-500 dark:text-[#cfcfd2]">
                  {request.reason}
                </TableCell>
                <TableCell className="px-4 py-2.5">
                  <div className="animate-in fade-in zoom-in-50 duration-300 flex flex-col gap-1 items-start">
                    <LeaveStatusBadge status={request.status} />
                    {request.approvedBy && request.status !== "PENDING" && (
                      <span className="text-[10px] text-slate-400 dark:text-[#7b7b81] italic">
                        by {request.approvedBy}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="px-4 py-2.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {canEdit && (
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Edit request"
                        disabled={request.status !== "PENDING"}
                        onClick={() => onEdit(request.id)}
                        className={cn(iconActionClasses, "disabled:opacity-50 disabled:border-[#5a5a5d]")}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    {request.status === "PENDING" && canApproveReject && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onApprove(request.id)}
                          aria-label="Approve request"
                          className={iconActionClasses}
                        >
                          <Check className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onReject(request.id)}
                          aria-label="Reject request"
                          className={iconActionClasses}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </>
                    )}
                    {canDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(request.id)}
                        aria-label="Delete request"
                        className={iconActionClasses}
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
