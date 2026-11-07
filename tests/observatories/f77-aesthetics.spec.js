/*
 * F77 (D-182): shared pieces, treemaps with PALETTE, rings with the total at the centre, filter panel in three rows.
 * The first blocks need no server; the last one drives the three boards once (E2E_LIVE=1).
 */
import { test, expect } from "@playwright/test";

import { PALETTE } from "../../lib/constants";
import { BRAND, contrastRatio, paletteColor, textOn } from "../../lib/observatories/palette";

test.describe("treemap colours (no server)", () => {
  test("the colour comes from PALETTE by the stable position, never from the data", () => {
    for (let slot = 0; slot < 17; slot++) expect(paletteColor(slot)).toBe(PALETTE[slot]);
    // the ODS 7 is slot 6 whatever the filters hide
    expect(paletteColor(6)).toBe(PALETTE[6]);
  });

  test("the text reads on every fill the treemaps can have (4,5:1 at least)", () => {
    for (let slot = 0; slot < 17; slot++) {
      const bg = paletteColor(slot);
      const fg = textOn(bg);
      expect([BRAND.white, BRAND.text]).toContain(fg);
      expect(contrastRatio(fg, bg), `slot ${slot} ${bg}`).toBeGreaterThanOrEqual(4.5);
    }
  });
});
