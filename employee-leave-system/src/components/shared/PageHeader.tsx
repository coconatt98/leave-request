import React from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
};

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="mb-5 flex flex-col gap-3 rounded-[22px] border border-red-200 dark:border-[rgba(255,90,95,0.35)] bg-white dark:bg-[#1a1a1c] px-5 py-4 text-slate-900 dark:text-white shadow-sm dark:shadow-[0_18px_40px_rgba(255,77,87,0.12)] sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h1>
        {description && (
          <p className="mt-0.5 text-[0.85rem] text-slate-500 dark:text-[#cfcfd2]">{description}</p>
        )}
        <div className="mt-2 h-px w-16 bg-gradient-to-r from-[#ff4d57] via-[#ff949a] to-transparent" />
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
