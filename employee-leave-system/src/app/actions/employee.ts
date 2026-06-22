"use server";

import { prisma } from "@/lib/db";
import { Employee } from "@/types/employee";
import { Role } from "@prisma/client";

export async function getEmployeesAction() {
  console.log("=== DEBUG DATABASE_URL ===", process.env.DATABASE_URL);
  const employees = await prisma.employee.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return employees.map(emp => ({
    ...emp,
    role: emp.role as string,
    username: emp.username || undefined,
    password: emp.password || undefined,
  }));
}

export async function getEmployeeByIdAction(id: string) {
  const emp = await prisma.employee.findUnique({
    where: { id }
  });
  if (!emp) return null;
  return {
    ...emp,
    role: emp.role as string,
    username: emp.username || undefined,
    password: emp.password || undefined,
  };
}

export async function createEmployeeAction(data: Omit<Employee, "id">) {
  const newEmp = await prisma.employee.create({
    data: {
      name: data.name,
      department: data.department,
      position: data.position,
      role: data.role as Role || "INPUTTER",
      username: data.username,
      password: data.password,
    }
  });
  return {
    ...newEmp,
    role: newEmp.role as string,
    username: newEmp.username || undefined,
    password: newEmp.password || undefined,
  };
}

export async function updateEmployeeAction(id: string, data: Omit<Employee, "id">) {
  const updated = await prisma.employee.update({
    where: { id },
    data: {
      name: data.name,
      department: data.department,
      position: data.position,
      role: data.role as Role || "INPUTTER",
      username: data.username,
      password: data.password,
    }
  });
  return {
    ...updated,
    role: updated.role as string,
    username: updated.username || undefined,
    password: updated.password || undefined,
  };
}

export async function deleteEmployeeAction(id: string) {
  await prisma.employee.delete({
    where: { id }
  });
}
