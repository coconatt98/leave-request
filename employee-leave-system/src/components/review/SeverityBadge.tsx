import { cn } from "@/lib/utils";

type SeverityBadgeProps = {
  level: string;
};

const severityStyles: Record<string, string> = {
  CRITICAL: "bg-[#fee2e2] text-[#b91c1c]",
  HIGH: "bg-[#fef3c7] text-[#b45309]",
  MEDIUM: "bg-[#e0f2fe] text-[#0369a1]",
  LOW: "bg-[#e2e8f0] text-[#475569]",
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
