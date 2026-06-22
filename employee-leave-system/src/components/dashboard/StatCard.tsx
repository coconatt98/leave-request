import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: number;
  icon: LucideIcon;
  className?: string;
  iconClassName?: string;
};

export function StatCard({
  title,
  value,
  icon: Icon,
  className,
  iconClassName,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-2xl border border-red-200 dark:border-[rgba(255,90,95,0.35)] bg-white dark:bg-[#1a1a1c] p-4 shadow-sm dark:shadow-[0_18px_40px_rgba(255,77,87,0.12)]",
        className
      )}
    >
      <div className="space-y-0.5">
        <span className="text-[0.68rem] font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-[#cfcfd2]">
          {title}
        </span>
        <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{value}</div>
      </div>
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-2xl border border-red-200 dark:border-[rgba(255,77,87,0.5)] bg-red-50 dark:bg-[rgba(255,77,87,0.15)] text-red-500 dark:text-[#ff4d57] shadow-sm dark:shadow-[0_6px_16px_rgba(255,77,87,0.25)]",
          iconClassName
        )}
      >
        <Icon className="h-[18px] w-[18px]" />
      </div>
    </div>
  );
}
