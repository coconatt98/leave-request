"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { LeaveRequestForm } from "@/components/leave/LeaveRequestForm";
import { useLeaveRequests } from "@/hooks/useLeaveRequests";
import { useAuth } from "@/hooks/useAuth";
import { LeaveFormData } from "@/validators/leave-schema";
import { useEffect } from "react";

export default function NewLeaveRequestPage() {
  const router = useRouter();
  const auth = useAuth();
  const { createLeaveRequest } = useLeaveRequests();
  const [isLoading, setIsLoading] = useState(false);

  // All roles (ADMIN, INPUTTER, APPROVER) can access this page

  const onSubmit = async (data: LeaveFormData) => {
    setIsLoading(true);
    try {
      await createLeaveRequest(data);
      toast.success("Leave request submitted successfully");
      router.push("/leave");
    } catch {
      toast.error("Failed to submit leave request");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="New Leave Request" 
        description="Submit a new request for time off"
      />
      <div className="bg-slate-50 dark:bg-[#263646] p-6 rounded-[10px] border border-slate-200 dark:border-[#627283] shadow-sm">
        <LeaveRequestForm onSubmit={onSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}
