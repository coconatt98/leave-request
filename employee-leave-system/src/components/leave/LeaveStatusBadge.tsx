import { LeaveStatus } from "@/types/leave";

type LeaveStatusBadgeProps = {
  status: LeaveStatus;
};

const STATUS_STYLES: Record<LeaveStatus, string> = {
  PENDING:
    "border border-[rgba(255,180,100,0.5)] bg-[rgba(255,180,100,0.15)] text-[#ffb870]",
  APPROVED:
    "border border-[rgba(100,255,150,0.5)] bg-[rgba(100,255,150,0.15)] text-[#7dffaa]",
  REJECTED:
    "border border-[rgba(255,90,95,0.5)] bg-[rgba(255,90,95,0.15)] text-[#ff949a]",
};

export function LeaveStatusBadge({ status }: LeaveStatusBadgeProps) {
  const label = status.charAt(0) + status.slice(1).toLowerCase();

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wide ${STATUS_STYLES[status]}`}
    >
      {label}
    </span>
  );
}
