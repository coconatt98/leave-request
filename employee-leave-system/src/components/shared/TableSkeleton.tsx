import { Skeleton } from "@/components/ui/skeleton";
import { tableCardClass } from "@/components/shared/telkomselStyles";

export function TableSkeleton() {
  return (
    <div className={tableCardClass}>
      <div className="w-full">
        {/* Header Skeleton */}
        <div className="border-b border-[rgba(255,90,95,0.25)] p-4 flex gap-4">
          <Skeleton className="h-6 w-12 bg-slate-50 dark:bg-[#263646]" />
          <Skeleton className="h-6 w-1/4 bg-slate-50 dark:bg-[#263646]" />
          <Skeleton className="h-6 w-1/4 bg-slate-50 dark:bg-[#263646]" />
          <Skeleton className="h-6 w-1/4 bg-slate-50 dark:bg-[#263646]" />
          <Skeleton className="h-6 w-12 ml-auto bg-slate-50 dark:bg-[#263646]" />
        </div>
        
        {/* Rows Skeleton */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="border-b border-[rgba(255,90,95,0.1)] p-4 flex items-center gap-4">
            <Skeleton className="h-5 w-8 bg-[#2b2b2d]" />
            <Skeleton className="h-5 w-1/4 bg-[#2b2b2d]" />
            <Skeleton className="h-5 w-1/4 bg-[#2b2b2d]" />
            <Skeleton className="h-5 w-1/4 bg-[#2b2b2d]" />
            <Skeleton className="h-8 w-8 ml-auto rounded-md bg-[#2b2b2d]" />
          </div>
        ))}
      </div>
    </div>
  );
}
