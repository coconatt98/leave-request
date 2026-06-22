import { LayoutDashboard, Users, CalendarDays, ClipboardList, type LucideIcon } from "lucide-react";

export const STORAGE_KEYS = {
  EMPLOYEES: "employees",
  LEAVE_REQUESTS: "leaveRequests",
  AUTH_SESSION: "authSession",
} as const;

export const SESSION_CONFIG = {
  SECRET: "ELS_SESSION_SECRET_V1",
  DURATION_MINUTES: 60,
} as const;

export const APP_EVENTS = {
  DATA_CHANGE: "els:data-change",
  AUTH_CHANGE: "els:auth-change",
} as const;

export const MOCK_USERS = [
  { username: "admin", password: "admin123", role: "ADMIN" },
  { username: "inputter", password: "password", role: "INPUTTER" },
  { username: "approver", password: "password", role: "APPROVER" },
] as const;

export type UserRole = "ADMIN" | "INPUTTER" | "APPROVER";

export const LEAVE_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Employees", href: "/employees", icon: Users },
  { label: "Leave Requests", href: "/leave", icon: CalendarDays },
  { label: "Code Review", href: "/code-review", icon: ClipboardList },
];
