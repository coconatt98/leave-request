import { cn } from "@/lib/utils";

type SeverityBadgeProps = {
  level: string;
};

const severityStyles: Record<string, string> = {
  CRITICAL: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  HIGH: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  MEDIUM: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  LOW: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
};

export function SeverityBadge({ level }: SeverityBadgeProps) {
  const normalized = level.toUpperCase();
  const styles = severityStyles[normalized] ?? severityStyles.MEDIUM;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
        styles
      )}
    >
      {normalized}
    </span>
  );
}
