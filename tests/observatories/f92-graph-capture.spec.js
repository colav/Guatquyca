/*
 * F92 (Q-25, D-206, D-208): captures of the collaboration graph (panel 2 of Board 2) for Luis to compare. This is the ONLY order in which
 * screenshots are saved. `Q25_VARIANT` names the file (ref, A, B, C); `Q25_DIR` is the folder (informes\capturas_q25). Needs E2E_LIVE=1.
 */
import { test } from "@playwright/test";

const LIVE = !!process.env.E2E_LIVE;
const DIR = process.env.Q25_DIR;
const VARIANT = process.env.Q25_VARIANT || "ref";

test.describe("F92 captures of the graph (one run per variant)", () => {
  test.skip(!LIVE || !DIR, "Set E2E_LIVE=1 and Q25_DIR to save the capture.");

  test(`capture of the variant ${VARIANT}`, async ({ page }) => {
    test.setTimeout(200000);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`/observatories/vri-udea/board-2${VARIANT === "ref" || VARIANT === "ref0" ? "" : `?grafo=${VARIANT}`}`);
    const card = page.getByTestId("chart-card").filter({ hasText: "2 · Grafo de colaboración entre grupos" }).first();
    await card.waitFor({ timeout: 120000 });
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(6000);
    await card.screenshot({ path: `${DIR}/grafo_${VARIANT}.png` });
  });
});
