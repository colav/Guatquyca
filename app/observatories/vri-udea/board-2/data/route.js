/* Node */
import { promises as fs } from "fs";
import path from "path";

/* Next */
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/* Constants */
const MOCK_FILE = path.join(process.cwd(), "mock-data", "observatories", "vri-udea-board-2.json");

/**
 * [mock] Serves the test data of Board 2 (window.T2 of the published artifact) from a folder that
 * git ignores. Phase B replaces this route by the ClickHouse API; without the file it answers 404.
 */
export async function GET() {
  try {
    const body = await fs.readFile(MOCK_FILE, "utf8");
    return new NextResponse(body, {
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ error: "Board 2 test data not found." }, { status: 404 });
  }
}
