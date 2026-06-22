"use server";

import { prisma } from "@/lib/db";

export async function verifyLoginAction(username: string, password: string) {
  const employee = await prisma.employee.findFirst({
    where: { username, password }
  });
  if (employee) {
    return { username: employee.username, role: employee.role };
  }
  return null;
}
