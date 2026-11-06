/*
 * F51: controls in small size (one ConfigProvider), filter container with square top corners, and the third
 * element of topics[i].link. Reads the real quyca and the dev server of Luis (D-100): only with E2E_LIVE=1.
 */
import { test, expect } from "@playwright/test";

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";
const BOARD = (n) => `/observatories/vri-udea/board-${n}`;

test.describe("F51 against the real quyca (read-only)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  for (const n of [1, 2, 3]) {
    test(`Board ${n}: height of the filters at 1440 px (open and folded), small controls and square top corners`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(BOARD(n));
      const box = page.getByTestId("filters");
      await expect(box).toBeVisible({ timeout: 120000 });
      await page.waitForTimeout(1200);
      const open = Math.round((await box.boundingBox()).height);
      const rows = await box.locator(".ant-row").first().evaluate((el) => new Set([...el.children].map((c) => Math.round(c.getBoundingClientRect().top))).size);
      const controls = await box.evaluate((el) => ({
        selectSmall: el.querySelectorAll(".ant-select-sm").length,
        selectNormal: el.querySelectorAll(".ant-select:not(.ant-select-sm)").length,
        buttonNormal: el.querySelectorAll(".ant-btn:not(.ant-btn-sm)").length,
        segmentedNormal: el.querySelectorAll(".ant-segmented:not(.ant-segmented-sm)").length,
      }));
      const radius = await box.evaluate((el) => { const s = getComputedStyle(el); return [s.borderTopLeftRadius, s.borderTopRightRadius, s.borderBottomRightRadius, s.borderBottomLeftRadius]; });
      await page.getByTestId("filters-toggle").click();
      const folded = Math.round((await box.boundingBox()).height);
      const radiusFolded = await box.evaluate((el) => { const s = getComputedStyle(el); return [s.borderTopLeftRadius, s.borderTopRightRadius, s.borderBottomRightRadius, s.borderBottomLeftRadius]; });
      console.log(`[live] Board ${n} 1440 px: open ${open} px (${rows} rows), folded ${folded} px; selects small ${controls.selectSmall}/normal ${controls.selectNormal}, buttons normal ${controls.buttonNormal}, segmented normal ${controls.segmentedNormal}; radius open ${radius.join(" ")} folded ${radiusFolded.join(" ")}`);
      if (process.env.F51_AFTER) {
        expect(controls.selectNormal + controls.buttonNormal + controls.segmentedNormal).toBe(0);
        for (const r of [radius, radiusFolded]) {
          expect(r[0]).toBe("0px");
          expect(r[1]).toBe("0px");
          expect(r[2]).not.toBe("0px");
          expect(r[3]).not.toBe("0px");
        }
        expect(await box.evaluate((el) => getComputedStyle(el).boxShadow)).not.toBe("none");
      }
    });
  }

  test("topics[i].link: the third element (state) arrives in the bundle, in the dataset and in the code", async () => {
    const raw = await (await fetch(`${API}/observatories/vri-udea/boards/1/bundle`)).json();
    const lens = new Map();
    const states = new Map();
    for (const t of raw.topics) for (const l of t.link) { lens.set(l.length, (lens.get(l.length) || 0) + 1); states.set(l[2], (states.get(l[2]) || 0) + 1); }
    console.log(`[live] link lengths ${JSON.stringify([...lens])} states ${JSON.stringify([...states])}`);
    // the axis 67 of the order: included (0) and frontier (1)
    const axis67 = raw.topics.flatMap((t) => t.link.filter((l) => l[0] === 67)).reduce((a, l) => { a[l[2]] = (a[l[2]] || 0) + 1; return a; }, {});
    console.log(`[live] axis 67 states ${JSON.stringify(axis67)}`);
    expect([...lens.keys()]).toContain(3);
  });
});
