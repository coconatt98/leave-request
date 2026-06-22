"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { LeaveRequestForm } from "@/components/leave/LeaveRequestForm";
import { useLeaveRequests } from "@/hooks/useLeaveRequests";
import { LeaveRequest } from "@/types/leave";
import { LeaveFormData } from "@/validators/leave-schema";
import { getLeaveRequestByIdAction } from "@/app/actions/leave";
import { useAuth } from "@/hooks/useAuth";
import { useEmployees } from "@/hooks/useEmployees";

export default function EditLeaveRequestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { updateLeaveRequest } = useLeaveRequests();
  const { id } = use(params);
  const [request, setRequest] = useState<LeaveRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const auth = useAuth();
  const { employees, isLoading: isEmployeesLoading } = useEmployees();

  useEffect(() => {
    async function load() {
      if (isEmployeesLoading || !auth.role) return;

      const data = await getLeaveRequestByIdAction(id);
      if (!data) {
        toast.error("Leave request not found");
        router.push("/leave");
        return;
      }

      if (data.status !== "PENDING") {
        toast.error("Only pending requests can be edited");
        router.push("/leave");
        return;
      }

      const currentEmployee = employees.find(e => e.username === auth.username);
      const isOwner = currentEmployee?.id === data.employeeId;

      if (auth.role !== "ADMIN" && !isOwner) {
        toast.error("Unauthorized access");
        router.push("/leave");
        return;
      }

      setRequest(data as LeaveRequest);
      setIsLoading(false);
    }
    load();
  }, [id, router, auth.role, auth.username, employees, isEmployeesLoading]);

  const handleSubmit = async (formData: LeaveFormData) => {
    if (!request) return;
    setIsSaving(true);
    try {
      await updateLeaveRequest(request.id, formData);
      toast.success("Leave request updated successfully");
      router.push("/leave");
    } catch {
      toast.error("Failed to update leave request");
      setIsSaving(false);
    }
  };

  if (isLoading || !request) {
    return <div className="py-12 text-center text-slate-500">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Leave Request"
        description="Update the details of this leave request"
      />
      <div className="bg-[#263646] p-6 rounded-[10px] border border-[#627283] shadow-sm">
        <LeaveRequestForm
          defaultValues={{
            employeeId: request.employeeId,
            startDate: request.startDate,
            endDate: request.endDate,
            reason: request.reason,
          }}
          onSubmit={handleSubmit}
          isLoading={isSaving}
        />
      </div>
    </div>
  );
}
