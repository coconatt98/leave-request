import Link from "next/link";
import { FileText, ClipboardList } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { buttonVariants } from "@/components/ui/button";
import { SeverityBadge } from "@/components/review/SeverityBadge";
import { getCodeReviewData } from "@/lib/review-data";
import { cn } from "@/lib/utils";

function formatLabel(label: string) {
  return label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
}

const STAT_ORDER = ["HIGH", "MEDIUM", "LOW"] as const;

export default async function CodeReviewPage() {
  const data = await getCodeReviewData();

  const severityStats = STAT_ORDER.map((level) => ({
    title: `${formatLabel(level)} Severity`,
    value: data.stats.bySeverity[level] ?? 0,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Code Review Dashboard"
        description="Latest review summary for the Employee Leave Management System"
      >
        <div className="flex gap-2">
          <Link
            href="/api/code-review/template"
            className={cn(buttonVariants({ variant: "secondary", size: "xs" }), "flex items-center gap-1")}
          >
            <ClipboardList className="h-3.5 w-3.5" />
            Template
          </Link>
          <Link
            href="/api/code-review/report"
            className={cn(buttonVariants({ size: "xs" }), "flex items-center gap-1")}
          >
            <FileText className="h-3.5 w-3.5" />
            Full Report
          </Link>
        </div>
      </PageHeader>

      <p className="rounded-2xl border border-white/70 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-3 text-sm text-[#0f1c2f] dark:text-slate-200 shadow-sm">
        {data.summary}
      </p>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <StatCard title="Total Findings" value={data.stats.total} icon={FileText} />
        {severityStats.map((stat) => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} icon={ClipboardList} />
        ))}
      </div>

      <section className="rounded-2xl border border-white/70 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#0f1c2f] dark:text-white">Review Matrix</h2>
            <p className="text-sm text-[#5a6270] dark:text-slate-400">
              Snapshot of each area, its status, and recommended remediation
            </p>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Area</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Finding</TableHead>
              <TableHead>Recommendation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.rows.map((row) => (
              <TableRow key={`${row.area}-${row.severity}`}>
                <TableCell className="font-semibold text-[#0f1c2f] dark:text-slate-200">{row.area}</TableCell>
                <TableCell className="dark:text-slate-300">{row.status}</TableCell>
                <TableCell>
                  <SeverityBadge level={row.severity} />
                </TableCell>
                <TableCell className="max-w-[320px] text-sm text-[#5a6270] dark:text-slate-300 whitespace-normal">
                  {row.finding.includes('•') ? (
                    <ul className="space-y-1.5">
                      {row.finding
                        .split('•')
                        .map(str => str.trim())
                        .filter(Boolean)
                        .map((point, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-[#0f62fe] dark:text-blue-400 mt-0.5">•</span>
                            <span className="leading-relaxed">{point}</span>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    row.finding
                  )}
                </TableCell>
                <TableCell className="max-w-[320px] text-sm text-[#0f1c2f] dark:text-slate-200 whitespace-normal">
                  {row.recommendation}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <section className="space-y-4">
        {data.details.map((detail) => (
          <article
            key={detail.heading}
            className="rounded-2xl border border-white/60 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-4 shadow-sm"
          >
            <h3 className="text-base font-semibold text-[#0f1c2f] dark:text-white">{detail.heading}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#5a6270] dark:text-slate-300 whitespace-pre-line">
              {detail.body}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
