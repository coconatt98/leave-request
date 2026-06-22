"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmployeeForm } from "@/components/employee/EmployeeForm";
import { EmployeeFormData } from "@/validators/employee-schema";
import { Employee } from "@/types/employee";
import { getEmployeeByIdAction, updateEmployeeAction } from "@/app/actions/employee";
import { useAuth } from "@/hooks/useAuth";

export default function EditEmployeePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { role } = useAuth();

  useEffect(() => {
    if (role && role !== "ADMIN") {
      toast.error("Unauthorized access");
      router.push("/employees");
      return;
    }

    async function load() {
      const data = await getEmployeeByIdAction(id);
      if (!data) {
        toast.error("Employee not found");
        router.push("/employees");
        return;
      }
      setEmployee(data as Employee);
      setIsLoading(false);
    }
    load();
  }, [id, router, role]);

  const onSubmit = async (data: EmployeeFormData) => {
    setIsSaving(true);
    try {
      await updateEmployeeAction(id, data);
      toast.success("Employee updated successfully");
      router.push("/employees");
    } catch {
      toast.error("Failed to update employee");
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="py-12 text-center text-slate-500">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Edit Employee" 
        description="Update employee details"
      />
      <div className="bg-[#263646] p-6 rounded-[10px] border border-[#627283] shadow-sm">
        {employee && (
          <EmployeeForm 
            defaultValues={employee as unknown as EmployeeFormData} 
            onSubmit={onSubmit} 
            isLoading={isSaving} 
          />
        )}
      </div>
    </div>
  );
}
