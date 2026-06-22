"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { LeaveRequestTable } from "@/components/leave/LeaveRequestTable";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useLeaveRequests } from "@/hooks/useLeaveRequests";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

type ConfirmAction = {
  type: "approve" | "reject" | "delete";
  id: string;
} | null;

export default function LeaveRequestsPage() {
  const router = useRouter();
  const {
    leaveRequests,
    statusFilter,
    setStatusFilter,
    approveRequest,
    rejectRequest,
    deleteLeaveRequest,
  } = useLeaveRequests();
  const auth = useAuth();

  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const canCreateRequest = auth.role === "ADMIN" || auth.role === "INPUTTER";

  const handleConfirm = async () => {
    if (!confirmAction) return;

    if (confirmAction.type === "approve") {
      await approveRequest(confirmAction.id);
      toast.success("Leave request approved");
    } else if (confirmAction.type === "reject") {
      await rejectRequest(confirmAction.id);
      toast.success("Leave request rejected");
    } else {
      await deleteLeaveRequest(confirmAction.id);
      toast.success("Leave request deleted");
    }
    setConfirmAction(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Leave Requests" 
        description="Manage employee leave requests"
      >
        {canCreateRequest && (
          <Link
            href="/leave/new"
            className={cn(buttonVariants({ variant: "default" }), "gap-2")}
          >
            <Plus className="h-4 w-4" />
            <span>New Request</span>
          </Link>
        )}
      </PageHeader>

      <div className="flex space-x-2 border-b border-slate-200 pb-4">
        {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((status) => (
          <Button
            key={status}
            variant={statusFilter === status ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(status)}
            className="capitalize"
          >
            {status.toLowerCase()}
          </Button>
        ))}
      </div>

      <LeaveRequestTable
        leaveRequests={leaveRequests}
        onApprove={(id) => setConfirmAction({ type: "approve", id })}
        onReject={(id) => setConfirmAction({ type: "reject", id })}
        onEdit={(id) => router.push(`/leave/edit/${id}`)}
        onDelete={(id) => setConfirmAction({ type: "delete", id })}
      />

      <ConfirmDialog
        open={!!confirmAction}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        title={
          confirmAction?.type === "approve"
            ? "Approve Request"
            : confirmAction?.type === "reject"
              ? "Reject Request"
              : "Delete Request"
        }
        description={`Are you sure you want to ${confirmAction?.type} this leave request?`}
        onConfirm={handleConfirm}
        confirmText={
          confirmAction?.type === "approve"
            ? "Approve"
            : confirmAction?.type === "reject"
              ? "Reject"
              : "Delete"
        }
        variant={
          confirmAction?.type === "reject" || confirmAction?.type === "delete"
            ? "destructive"
            : "default"
        }
      />
    </div>
  );
}
