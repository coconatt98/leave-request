import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  const filePath = path.resolve(process.cwd(), "../Template_code_review.md");
  const content = await fs.readFile(filePath, "utf-8");
  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": "attachment; filename=Template_code_review.md",
    },
  });
}
