"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmployeeTable } from "@/components/employee/EmployeeTable";
import { EmployeeDeleteDialog } from "@/components/employee/EmployeeDeleteDialog";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { useEmployees } from "@/hooks/useEmployees";
import { useAuth } from "@/hooks/useAuth";
import { Employee } from "@/types/employee";
import { cn } from "@/lib/utils";

export default function EmployeesPage() {
  const { employees, isLoading, deleteEmployee, searchEmployees } = useEmployees();
  const { role } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchEmployees(query);
  };

  const confirmDelete = async () => {
    if (deleteTarget) {
      await deleteEmployee(deleteTarget.id);
      toast.success("Employee deleted successfully");
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Employees" 
        description="Manage your organization's employees"
      >
        {role === "ADMIN" && (
          <Link
            href="/employees/new"
            className={cn(buttonVariants({ variant: "default" }), "gap-2")}
          >
            <Plus className="h-4 w-4" />
            <span>Add Employee</span>
          </Link>
        )}
      </PageHeader>

      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search employees by name..."
          value={searchQuery}
          onChange={handleSearch}
          className="max-w-sm"
        />
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <EmployeeTable 
          employees={employees} 
          onDelete={(emp) => setDeleteTarget(emp)} 
        />
      )}

      <EmployeeDeleteDialog
        employee={deleteTarget}
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
