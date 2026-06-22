import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const tableCardClass =
  "rounded-2xl border border-[rgba(255,90,95,0.35)] bg-[#1a1a1c] shadow-[0_18px_40px_rgba(255,77,87,0.12)]";

export const tableHeaderCellClass =
  "px-4 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#cfcfd2]";

export const tableRowClass =
  "border-b border-[rgba(255,90,95,0.25)] transition-colors hover:bg-[rgba(255,77,87,0.1)]";

export const iconActionClasses = cn(
  buttonVariants({ variant: "ghost", size: "icon" }),
  "rounded-xl border-2 border-[#ff4d57] bg-[#2b2b2d] text-white shadow-[0_8px_20px_rgba(255,77,87,0.15)] hover:bg-[#ff4d57] hover:text-white focus-visible:ring-[#ff949a]"
);

export const formSectionClass = "space-y-1.5";
