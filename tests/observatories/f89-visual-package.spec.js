/*
 * F89 (D-202): visual package of the three boards. The first block needs no server; the second (E2E_LIVE=1) measures in the
 * browser (numbers only, no screenshots are saved). Q-02: order of the bars; Q-05: total at the end of every bar.
 */
import { test, expect } from "@playwright/test";

import { barsDescending, segmentsTotal, stackedTotal } from "../../lib/observatories/barOrder";

test.describe("Q-02 order of the bars (no server)", () => {
  test("from the largest to the smallest; equal values keep their order; keepOrder leaves the rows as they come", () => {
    const rows = [{ label: "a", value: 3 }, { label: "b", value: 9 }, { label: "c", value: 3 }, { label: "d", value: 0 }];
    expect(barsDescending(rows, (r) => r.value).map((r) => r.label)).toEqual(["b", "a", "c", "d"]);
    expect(barsDescending(rows, (r) => r.value, true)).toBe(rows);
  });

  test("stacked rows are ordered by the total of their segments (Board 3 and Board 2)", () => {
    const b3 = [{ label: "x", values: [1, 1] }, { label: "y", values: [5, 4] }];
    expect(barsDescending(b3, stackedTotal).map((r) => r.label)).toEqual(["y", "x"]);
    const b2 = [{ label: "x", segments: [{ value: 2 }] }, { label: "y", segments: [{ value: 1 }, { value: 7 }] }];
    expect(barsDescending(b2, segmentsTotal).map((r) => r.label)).toEqual(["y", "x"]);
  });
});
