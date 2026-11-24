/* F113 (D-250): the phrase «sin validación humana» is gone from every visible text of the three boards (no server). */
import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const DIRS = ["app", "lib"];
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(dir, e.name);
  if (e.isDirectory()) return e.name === "Data" || e.name === "node_modules" ? [] : walk(p);
  return /\.(js|jsx|ts|tsx)$/.test(e.name) ? [p] : [];
});

test("no source text says «validación humana»", () => {
  const hits = DIRS.flatMap((d) => walk(path.join(process.cwd(), d))).filter((f) => /validaci[oó]n humana/i.test(fs.readFileSync(f, "utf8")));
  expect(hits).toEqual([]);
});
