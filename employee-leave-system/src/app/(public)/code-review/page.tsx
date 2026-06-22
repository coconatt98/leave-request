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

      <p className="rounded-2xl border border-white/70 bg-white/90 p-3 text-sm text-[#0f1c2f] shadow-[0_10px_25px_rgba(15,98,254,0.08)]">
        {data.summary}
      </p>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <StatCard title="Total Findings" value={data.stats.total} icon={FileText} />
        {severityStats.map((stat) => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} icon={ClipboardList} />
        ))}
      </div>

      <section className="rounded-2xl border border-white/70 bg-white/95 p-4 shadow-[0_20px_45px_rgba(15,98,254,0.12)]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#0f1c2f]">Review Matrix</h2>
            <p className="text-sm text-[#5a6270]">
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
                <TableCell className="font-semibold text-[#0f1c2f]">{row.area}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>
                  <SeverityBadge level={row.severity} />
                </TableCell>
                <TableCell className="max-w-[320px] text-sm text-[#5a6270]">
                  {row.finding}
                </TableCell>
                <TableCell className="max-w-[320px] text-sm text-[#0f1c2f]">
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
            className="rounded-2xl border border-white/60 bg-white/90 p-4 shadow-[0_12px_32px_rgba(15,98,254,0.08)]"
          >
            <h3 className="text-base font-semibold text-[#0f1c2f]">{detail.heading}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#5a6270] whitespace-pre-line">
              {detail.body}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
