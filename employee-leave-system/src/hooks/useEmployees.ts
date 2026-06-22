"use client";

import { useState, useEffect, useCallback } from "react";
import { Employee } from "@/types/employee";
import { 
  getEmployeesAction, 
  createEmployeeAction, 
  updateEmployeeAction, 
  deleteEmployeeAction 
} from "@/app/actions/employee";

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadEmployees = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getEmployeesAction();
      setEmployees(data as Employee[]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const createEmployee = useCallback(
    async (data: Omit<Employee, "id">): Promise<Employee> => {
      const newEmployee = await createEmployeeAction(data);
      await loadEmployees();
      return newEmployee as Employee;
    },
    [loadEmployees]
  );

  const updateEmployee = useCallback(
    async (id: string, data: Omit<Employee, "id">): Promise<Employee> => {
      const updated = await updateEmployeeAction(id, data);
      await loadEmployees();
      return updated as Employee;
    },
    [loadEmployees]
  );

  const deleteEmployee = useCallback(
    async (id: string): Promise<void> => {
      await deleteEmployeeAction(id);
      await loadEmployees();
    },
    [loadEmployees]
  );

  const searchEmployees = useCallback(
    async (query: string): Promise<void> => {
      if (!query.trim()) {
        await loadEmployees();
      } else {
        const data = await getEmployeesAction();
        const lowerQuery = query.toLowerCase();
        const results = data.filter((emp) =>
          emp.name.toLowerCase().includes(lowerQuery)
        );
        setEmployees(results as Employee[]);
      }
    },
    [loadEmployees]
  );

  return {
    employees,
    isLoading,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    searchEmployees,
    refreshEmployees: loadEmployees,
  };
}
