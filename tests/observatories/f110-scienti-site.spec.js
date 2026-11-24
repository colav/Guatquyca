/* F110 (D-245) point 2: «ScienTI» in the visible texts of the main site (identifiers, keys, routes and URLs keep their form). No server. */
import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const FILES = ["app/open-source/page.js", "app/about/TabFuentes.js", "lib/constants.js", "app/about/QualityMetrics/rowBuilders.js"];

test("the visible texts of the main site write ScienTI", () => {
  for (const f of FILES) {
    const text = fs.readFileSync(path.join(process.cwd(), f), "utf8");
    const visible = text.split(/\r?\n/).filter((l) => !/https?:\/\/|key:|value:|scienti_|\.scienti|scienti:|"scienti"/.test(l));
    expect(visible.filter((l) => /\bScienti\b|\bSCIENTI\b/.test(l)), f).toEqual([]);
  }
});
