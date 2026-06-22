"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmployeeForm } from "@/components/employee/EmployeeForm";
import { useEmployees } from "@/hooks/useEmployees";
import { EmployeeFormData } from "@/validators/employee-schema";

export default function NewEmployeePage() {
  const router = useRouter();
  const { createEmployee } = useEmployees();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: EmployeeFormData) => {
    setIsLoading(true);
    try {
      await createEmployee(data);
      toast.success("Employee created successfully");
      router.push("/employees");
    } catch {
      toast.error("Failed to create employee");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Add New Employee" 
        description="Enter the details of the new employee"
      />
      <div className="bg-[#263646] p-6 rounded-[10px] border border-[#627283] shadow-sm">
        <EmployeeForm onSubmit={onSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}
