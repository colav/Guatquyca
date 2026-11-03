/* Tests of the colours of the observatories: they must come from the palettes of lib/constants.js. */
import fs from "fs";
import path from "path";
import { test, expect } from "@playwright/test";

import { MAP_PALETTE, OPEN_ACCESS_PALETTE, PALETTE } from "../../lib/constants";
import { CATEGORY_COLORS, CATEGORY_ORDER } from "../../lib/observatories/capacity";
import { QUARTILE_COLORS, RANKING_COLOR, SCATTER_COLORS, TYPE_COLORS, accessColor, sequentialTile } from "../../lib/observatories/palette";

test("capacity categories use distinct colours of PALETTE", () => {
  const colors = CATEGORY_ORDER.map((c) => CATEGORY_COLORS[c]);
  expect(new Set(colors).size).toBe(CATEGORY_ORDER.length);
  colors.forEach((c) => expect(PALETTE).toContain(c));
});

test("every other chart colour comes from the palettes of lib/constants.js", () => {
  [RANKING_COLOR, ...TYPE_COLORS, ...Object.values(SCATTER_COLORS)].forEach((c) => expect(PALETTE).toContain(c));
  QUARTILE_COLORS.forEach((c) => expect([...PALETTE, ...MAP_PALETTE]).toContain(c));
  ["Sin dato OA", "Diamante", "Dorada", "Híbrida", "Verde", "Bronce", "Cerrado"].forEach((l) => expect(Object.values(OPEN_ACCESS_PALETTE)).toContain(accessColor(l)));
  expect(MAP_PALETTE).toContain(sequentialTile(0.5).background);
});

test("no chart component of the observatories writes a hex colour", () => {
  const roots = ["app/observatories", "lib/observatories"].map((r) => path.join(__dirname, "..", "..", r));
  const offenders = [];
  const walk = (dir) =>
    fs.readdirSync(dir, { withFileTypes: true }).forEach((e) => {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) return walk(p);
      if (!p.endsWith(".js") || p.endsWith("palette.js")) return;
      if (/#[0-9a-fA-F]{3,8}\b/.test(fs.readFileSync(p, "utf8"))) offenders.push(p);
    });
  roots.forEach(walk);
  expect(offenders).toEqual([]);
});
