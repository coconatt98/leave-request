import { promises as fs } from "fs";
import path from "path";

type ReviewRow = {
  area: string;
  status: string;
  severity: string;
  finding: string;
  recommendation: string;
};

type ReviewStats = {
  total: number;
  bySeverity: Record<string, number>;
};

type ReviewDetails = Array<{ heading: string; body: string }>;

type ReviewData = {
  summary: string;
  rows: ReviewRow[];
  stats: ReviewStats;
  details: ReviewDetails;
};

const REVIEW_FILE = path.resolve(
  process.cwd(),
  "../code_review_employee_leave_system.md"
);

const REVIEW_TABLE_HEADER = "| Area | Status | Severity | Finding | Recommendation |";
const REVIEW_TABLE_DIVIDER = "| --- | --- | --- | --- | --- |";

async function readReviewFile(): Promise<string> {
  return fs.readFile(REVIEW_FILE, "utf-8");
}

function extractSummary(content: string): string {
  const lines = content.split("\n");
  const summaryIndex = lines.findIndex((line) => line.trim().toLowerCase() === "## summary");
  if (summaryIndex === -1) return "";
  const nextBlank = lines.slice(summaryIndex + 1).findIndex((line) => line.trim() === "");
  const summaryLines =
    nextBlank === -1
      ? lines.slice(summaryIndex + 1)
      : lines.slice(summaryIndex + 1, summaryIndex + 1 + nextBlank);
  return summaryLines.join("\n").trim();
}

function extractTableRows(content: string): ReviewRow[] {
  const tableStart = content.indexOf(REVIEW_TABLE_HEADER);
  if (tableStart === -1) return [];
  const tableSection = content.slice(tableStart).split("\n\n")[0];
  const lines = tableSection.split("\n").filter((line) => line.trim().length > 0);
  const dataLines = lines.filter(
    (line) => line.trim().startsWith("|") && line.trim() !== REVIEW_TABLE_HEADER && line.trim() !== REVIEW_TABLE_DIVIDER
  );

  return dataLines.map((line) => {
    const cells = line
      .split("|")
      .map((cell) => cell.trim())
      .filter((cell) => cell.length > 0);
    const [area = "", status = "", severity = "", finding = "", recommendation = ""] = cells;
    return { area, status, severity, finding, recommendation };
  });
}

function computeStats(rows: ReviewRow[]): ReviewStats {
  const bySeverity: Record<string, number> = {};
  rows.forEach((row) => {
    const key = row.severity.toUpperCase();
    bySeverity[key] = (bySeverity[key] || 0) + 1;
  });
  return { total: rows.length, bySeverity };
}

function extractDetails(content: string): ReviewDetails {
  const detailSections = content.split("## Detailed Findings")[1];
  if (!detailSections) return [];
  const matches = [...detailSections.matchAll(/^###\s+(.*)$/gm)];
  if (matches.length === 0) return [];

  return matches.map((match, index) => {
    const heading = match[1].trim();
    const start = match.index ?? 0;
    const end = index + 1 < matches.length ? matches[index + 1].index ?? detailSections.length : detailSections.length;
    const body = detailSections.slice(start + match[0].length, end).trim();
    return { heading, body };
  });
}

export async function getCodeReviewData(): Promise<ReviewData> {
  const content = await readReviewFile();
  const rows = extractTableRows(content);
  return {
    summary: extractSummary(content),
    rows,
    stats: computeStats(rows),
    details: extractDetails(content),
  };
}
