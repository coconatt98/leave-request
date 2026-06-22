"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  iconActionClasses,
  tableCardClass,
  tableHeaderCellClass,
  tableRowClass,
} from "@/components/shared/telkomselStyles";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Employee } from "@/types/employee";
import { useAuth } from "@/hooks/useAuth";

type EmployeeTableProps = {
  employees: Employee[];
  onDelete: (employee: Employee) => void;
};

export function EmployeeTable({ employees, onDelete }: EmployeeTableProps) {
  const { role } = useAuth();

  if (employees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-[rgba(255,90,95,0.35)] bg-[#1a1a1c] py-16 text-center text-[#cfcfd2] shadow-[0_18px_40px_rgba(255,77,87,0.12)]">
        <p className="text-lg font-semibold text-white">No employees found</p>
        <p className="mt-1 text-sm">Add a new employee to get started.</p>
      </div>
    );
  }

  return (
    <div className={tableCardClass}>
      <Table>
        <TableHeader>
          <TableRow className="border-b border-[#f7d7db] bg-transparent">
            <TableHead className={cn(tableHeaderCellClass, "w-12 text-left")}>#</TableHead>
            <TableHead className={tableHeaderCellClass}>Name</TableHead>
            <TableHead className={tableHeaderCellClass}>Department</TableHead>
            <TableHead className={tableHeaderCellClass}>Position</TableHead>
            <TableHead className={tableHeaderCellClass}>Role</TableHead>
            {role === "ADMIN" && (
              <TableHead className={cn(tableHeaderCellClass, "text-right")}>Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee, index) => (
            <TableRow key={employee.id} className={cn(tableRowClass, "last:border-0")}> 
              <TableCell className="px-4 py-2.5 text-xs text-[#cfcfd2]">
                {index + 1}
              </TableCell>
              <TableCell className="px-4 py-2.5 text-sm font-semibold text-white">
                {employee.name}
              </TableCell>
              <TableCell className="px-4 py-2.5 text-sm text-[#cfcfd2]">
                <span className="animate-in fade-in duration-200" style={{ animationDelay: `${index * 20}ms` }}>
                  {employee.department}
                </span>
              </TableCell>
              <TableCell className="px-4 py-2.5 text-sm text-[#cfcfd2]">
                <span className="animate-in fade-in duration-200" style={{ animationDelay: `${index * 20 + 40}ms` }}>
                  {employee.position}
                </span>
              </TableCell>
              <TableCell className="px-4 py-2.5 text-sm text-[#cfcfd2]">
                <span className="animate-in fade-in duration-200" style={{ animationDelay: `${index * 20 + 60}ms` }}>
                  {employee.role}
                </span>
              </TableCell>
              {role === "ADMIN" && (
                <TableCell className="px-4 py-2.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/employees/edit/${employee.id}`}
                      className={iconActionClasses}
                      aria-label={`Edit ${employee.name}`}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(employee)}
                      className={iconActionClasses}
                      aria-label={`Delete ${employee.name}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
