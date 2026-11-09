import { test } from "@playwright/test";
import fs from "node:fs";
test("foot", async ({ page }) => {
  test.setTimeout(200000);
  const out = {};
  for (const b of [1, 2, 3]) {
    await page.goto(`/observatories/vri-udea/board-${b}`);
    await page.getByTestId("method-notes").waitFor({ timeout: 120000 });
    await page.waitForTimeout(3000);
    out[b] = await page.getByTestId("method-notes").locator("li").allInnerTexts();
  }
  fs.writeFileSync(process.env.DUMP_OUT, JSON.stringify(out, null, 1));
});
