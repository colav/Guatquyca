import { test } from "@playwright/test";
import fs from "node:fs";
test("dump", async ({ page }) => {
  test.setTimeout(500000);
  await page.setViewportSize({ width: 1440, height: 1000 });
  const out = {};
  for (const b of [1, 2, 3]) {
    await page.goto(`/observatories/vri-udea/board-${b}`);
    await page.getByTestId("chart-card").first().waitFor({ timeout: 120000 });
    await page.waitForTimeout(4000);
    const n = await page.getByTestId("chart-card").count();
    const rows = [];
    for (let i = 0; i < n; i++) {
      const card = page.getByTestId("chart-card").nth(i);
      await card.scrollIntoViewIfNeeded();
      const title = (await card.locator("xpath=.//*[self::h1 or self::h2 or self::h3 or self::h4 or self::h5 or contains(@class,'ant-card-head-title')]").first().innerText().catch(() => "")).trim();
      const notes = await card.locator(".ant-typography-secondary").allInnerTexts();
      const btn = card.getByTestId("panel-info");
      let sections = null;
      if (await btn.count()) {
        await btn.first().click();
        await page.waitForTimeout(300);
        sections = {};
        for (const k of ["note", "what", "how", "look", "care"]) {
          const el = page.getByTestId(`panel-info-${k}`);
          if (await el.count()) sections[k] = (await el.first().innerText()).replace(/^[^\n]*\n/, "");
        }
        await page.keyboard.press("Escape");
        await page.waitForTimeout(150);
      }
      rows.push({ i, title, notes, sections });
    }
    out[b] = rows;
  }
  fs.writeFileSync(process.env.DUMP_OUT, JSON.stringify(out, null, 1));
});
