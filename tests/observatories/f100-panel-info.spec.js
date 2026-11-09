/*
 * F100 (D-221, D-222, D-223): button (i) in the header of every panel of the three boards. The first block needs no server (the help
 * texts); the second (E2E_LIVE=1) opens every button in the real pages at 1.440, 1.280 and 768 px.
 */
import { test, expect } from "@playwright/test";

import { PANEL_HELP as HELP1 } from "../../app/observatories/vri-udea/board-1/components/panelHelp";
import { PANEL_HELP as HELP2 } from "../../app/observatories/vri-udea/board-2/components/panelHelp";
import { PANEL_HELP as HELP3 } from "../../app/observatories/vri-udea/board-3/components/panelHelp";

const LIVE = !!process.env.E2E_LIVE;
const BOARDS = [
  { n: 1, help: HELP1 },
  { n: 2, help: HELP2 },
  { n: 3, help: HELP3 },
];

test.describe("F100 help texts (no server)", () => {
  for (const { n, help } of BOARDS) {
    test(`Board ${n}: every entry says what the chart shows and how to read it, with no figure written by hand`, () => {
      const entries = Object.entries(help);
      expect(entries.length).toBeGreaterThan(8);
      for (const [key, e] of entries) {
        expect(e.what, `${n}/${key} what`).toBeTruthy();
        expect(e.how, `${n}/${key} how`).toBeTruthy();
        expect(e.look, `${n}/${key} look`).toBeTruthy();
        const text = [e.what, e.how, e.look, e.care].flat().filter(Boolean).join(" ");
        expect(text, `${n}/${key} has a digit`).not.toMatch(/\d/);
        expect(text, `${n}/${key} mentions a decision or a test text`).not.toMatch(/ensayo|provisional|D-\d|F\d\d|\bQ-\d/i);
      }
    });
  }

  test("only the calculator panels of the Board 1 are marked to review with F101", () => {
    expect(Object.entries(HELP1).filter(([, e]) => e.review).map(([k]) => k)).toEqual(["p1", "p2"]);
  });
});

async function openBoard(page, n, width) {
  await page.setViewportSize({ width, height: 1000 });
  await page.goto(`/observatories/vri-udea/board-${n}`, { waitUntil: "domcontentloaded" });
  await page.locator('[data-testid="chart-card"]').first().waitFor({ timeout: 120000 });
  await page.waitForTimeout(2500);
}

test.describe("F100 buttons (i) in the pages (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  for (const { n, help } of BOARDS) {
    test(`Board ${n}: one button per panel, in its header, no overflow at 1440, 1280 and 768`, async ({ page }) => {
      test.setTimeout(280000);
      const report = {};
      for (const width of [1440, 1280, 768]) {
        await openBoard(page, n, width);
        const m = await page.evaluate(() => {
          const cards = [...document.querySelectorAll('[data-testid="chart-card"]')];
          const rows = cards.map((card) => {
            const header = card.querySelector(".ant-card-head");
            const button = card.querySelector('[data-testid="panel-info"]');
            const title = card.querySelector(".ant-card-head-title");
            const h = header?.getBoundingClientRect();
            const b = button?.getBoundingClientRect();
            const t = title?.getBoundingClientRect();
            return {
              title: title?.innerText.trim().slice(0, 40),
              has: !!button,
              inside: !!(h && b && b.left >= h.left - 0.5 && b.right <= h.right + 0.5 && b.top >= h.top - 0.5 && b.bottom <= h.bottom + 0.5),
              right: !!(h && b && b.right > h.right - 40),
              visible: !!(b && b.left >= 0 && b.right <= window.innerWidth),
              overlapsTitle: !!(t && b && b.left < t.right - 0.5 && b.right > t.left + 0.5 && b.top < t.bottom && b.bottom > t.top),
              headerText: header?.innerText.trim().replace(/\s+/g, " ").slice(0, 80),
            };
          });
          return { rows, scrollW: document.documentElement.scrollWidth, innerW: window.innerWidth };
        });
        report[width] = { cards: m.rows.length, buttons: m.rows.filter((r) => r.has).length, outside: m.rows.filter((r) => !r.inside).map((r) => r.title), overlapping: m.rows.filter((r) => r.overlapsTitle).map((r) => r.title), notRight: m.rows.filter((r) => !r.right).map((r) => r.title), scrollW: m.scrollW, innerW: m.innerW };
        expect(m.rows.length, `${width}: panels`).toBeGreaterThanOrEqual(Object.keys(help).length - 1);
        expect(m.rows.filter((r) => !r.has).map((r) => r.title), `${width}: panels without button`).toEqual([]);
        expect(m.rows.filter((r) => !r.inside).map((r) => r.title), `${width}: button outside its header`).toEqual([]);
        expect(m.rows.filter((r) => r.overlapsTitle).map((r) => r.title), `${width}: button over the title`).toEqual([]);
        expect(m.rows.filter((r) => !r.visible).map((r) => r.title), `${width}: button outside the screen`).toEqual([]);
      }
      console.log(`[live] T${n} ${JSON.stringify(report)}`);
    });

    test(`Board ${n}: every button opens with click and with the keyboard, shows its text, and closes with Esc, outside click and the button`, async ({ page }) => {
      test.setTimeout(290000);
      await openBoard(page, n, 1440);
      const buttons = page.getByTestId("panel-info");
      const count = await buttons.count();
      expect(count).toBeGreaterThanOrEqual(Object.keys(help).length - 1);
      const seen = [];
      for (let i = 0; i < count; i++) {
        const button = buttons.nth(i);
        await button.evaluate((el) => el.scrollIntoView({ block: "center" }));
        await button.click();
        const content = page.getByTestId("panel-info-content").last();
        await expect(content).toBeVisible();
        const box = await content.boundingBox();
        const vp = page.viewportSize();
        expect(box.x, `popup ${i} left`).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width, `popup ${i} right`).toBeLessThanOrEqual(vp.width + 1);
        await expect(content.getByTestId("panel-info-what")).toBeVisible();
        await expect(content.getByTestId("panel-info-how")).toBeVisible();
        seen.push(await content.getByTestId("panel-info-what").innerText());
        await page.keyboard.press("Escape");
        await expect(page.getByTestId("panel-info-content")).toHaveCount(0);
        await expect(button).toBeFocused();
      }
      expect(new Set(seen).size, "every panel has its own text").toBe(count);
      // keyboard: focus, Enter opens, Esc closes; outside click closes; the button toggles
      const first = buttons.first();
      await first.evaluate((el) => el.scrollIntoView({ block: "center" }));
      await first.focus();
      await page.keyboard.press("Enter");
      await expect(page.getByTestId("panel-info-content")).toHaveCount(1);
      await page.keyboard.press("Escape");
      await expect(page.getByTestId("panel-info-content")).toHaveCount(0);
      await first.click();
      await expect(page.getByTestId("panel-info-content")).toHaveCount(1);
      await first.locator("xpath=ancestor::*[@data-testid='chart-card']").locator(".ant-card-head-title").click();
      await expect(page.getByTestId("panel-info-content")).toHaveCount(0);
      await first.click();
      await first.click();
      await expect(page.getByTestId("panel-info-content")).toHaveCount(0);
    });
  }

  test("Board 1: the notes of the headers moved into the button and the header keeps only the title", async ({ page }) => {
    test.setTimeout(200000);
    await openBoard(page, 1, 1440);
    const info = await page.evaluate(() => [...document.querySelectorAll('[data-testid="chart-card"]')].map((c) => ({ head: c.querySelector(".ant-card-head")?.innerText.trim().replace(/\s+/g, " "), title: c.querySelector(".ant-card-head-title")?.innerText.trim().replace(/\s+/g, " ") })));
    for (const c of info) expect(c.head, `header of ${c.title}`).toBe(c.title);
    // panel 4: the note that was cut («Productos con asignación de confianza alta o m…») is the first thing in its window
    const card = page.getByTestId("chart-card").filter({ hasText: "4 · Ejes Temáticos públicos" }).first();
    await card.getByTestId("panel-info").click();
    await expect(page.getByTestId("panel-info-note").last()).toContainText(/productos con asignación de confianza/i);
    await page.keyboard.press("Escape");
  });
});
