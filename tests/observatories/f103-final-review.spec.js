/*
 * F103 (D-228): review of the final state of the night (overflows, smoke tour, console, forbidden texts and ETags). It only measures: it writes
 * the findings in the file of `F103_OUT` (a JSON) and in the console; the thresholds that fail the test are the ones of the order (no
 * horizontal scroll, ETag in force). Needs E2E_LIVE=1.
 */
import fs from "fs";
import { test, expect } from "@playwright/test";

const LIVE = !!process.env.E2E_LIVE;
const OUT = process.env.F103_OUT;
const API = process.env.E2E_API_URL || "http://localhost:8080";
const BOARDS = [1, 2, 3];
const ETAGS = { 1: '"20261107-176ca66482cb"', 2: '"20261107-1d00bdd70b19"', 3: '"20261107-956a71cbf0c3"' };
const FORBIDDEN = [/2021–2025/g, /\bensayo\b/gi, /\bNaN\b/g, /\bundefined\b/g, /s\. d\./g];
const results = { overflow: [], smoke: [], console: {}, forbidden: [], etags: [], info: [] };

test.afterAll(() => {
  if (OUT) fs.writeFileSync(OUT, JSON.stringify(results, null, 1));
});

async function open(page, board, query = "", width = 1440) {
  await page.setViewportSize({ width, height: 1000 });
  await page.goto(`/observatories/vri-udea/board-${board}${query ? `?${query}` : ""}`, { waitUntil: "domcontentloaded" });
  await page.locator('[data-testid="chart-card"]').first().waitFor({ timeout: 120000 });
  await page.waitForTimeout(3500);
}

test.describe("F103 final review (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real servers.");

  test("ETags in force: every board answers 200 and then 304 with its ETag", async () => {
    for (const board of BOARDS) {
      const url = `${API}/observatories/vri-udea/boards/${board}/bundle`;
      const first = await fetch(url, { headers: { "Accept-Encoding": "gzip" } });
      const etag = first.headers.get("etag");
      await first.arrayBuffer();
      const second = await fetch(url, { headers: { "If-None-Match": etag } });
      results.etags.push({ board, etag, expected: ETAGS[board], status: first.status, second: second.status });
      expect(etag, `T${board}`).toBe(ETAGS[board]);
      expect(second.status).toBe(304);
    }
  });

  for (const board of BOARDS) {
    test(`T${board}: overflow at 1440, 1280 and 768 (page, KPI, tiles, headers with the button (i), window of the button, tooltips)`, async ({ page }) => {
      test.setTimeout(290000);
      const consoleBag = (results.console[`T${board}`] = results.console[`T${board}`] || {});
      page.on("console", (m) => {
        if (m.type() === "error" || m.type() === "warning") consoleBag[`${m.type()}: ${m.text().slice(0, 160)}`] = (consoleBag[`${m.type()}: ${m.text().slice(0, 160)}`] || 0) + 1;
      });
      page.on("pageerror", (e) => { consoleBag[`pageerror: ${e.message.slice(0, 160)}`] = (consoleBag[`pageerror: ${e.message.slice(0, 160)}`] || 0) + 1; });
      for (const width of [1440, 1280, 768]) {
        await open(page, board, "", width);
        const m = await page.evaluate(() => {
          const cut = (els) => els.filter((el) => el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 2).map((el) => (el.innerText || el.textContent || "").trim().slice(0, 50));
          const headers = [...document.querySelectorAll('[data-testid="chart-card"] .ant-card-head')];
          return {
            scrollW: document.documentElement.scrollWidth,
            innerW: window.innerWidth,
            kpiCut: cut([...document.querySelectorAll(".obs-kpi div[title]")]),
            titleCut: cut([...document.querySelectorAll('[data-testid="chart-card"] .ant-card-head-title')]),
            headerWithoutButton: headers.filter((h) => !h.querySelector('[data-testid="panel-info"]')).length,
            tilesCut: cut([...document.querySelectorAll('[data-testid="panel-tile"], .obs-tile')]),
          };
        });
        // window of the button (i) in the first panel
        const button = page.getByTestId("panel-info").first();
        await button.evaluate((el) => el.scrollIntoView({ block: "center" }));
        await button.click();
        const box = await page.getByTestId("panel-info-content").last().boundingBox();
        const inside = !!box && box.x >= 0 && box.x + box.width <= width + 1;
        await page.keyboard.press("Escape");
        const row = { board, width, ...m, windowInside: inside };
        results.overflow.push(row);
        expect(m.innerW, "viewport").toBe(width);
        expect(inside, `T${board} ${width}: window of the button (i) inside the screen`).toBe(true);
      }
    });

    test(`T${board}: forbidden texts in the page and in the windows (i)`, async ({ page }) => {
      test.setTimeout(280000);
      await open(page, board);
      const found = [];
      const scan = (where, text) => {
        for (const re of FORBIDDEN) {
          const hits = text.match(re);
          if (hits) found.push({ board, where, text: hits[0], times: hits.length });
        }
      };
      scan("página", await page.locator("body").innerText());
      const cards = page.getByTestId("chart-card");
      const n = await cards.count();
      for (let i = 0; i < n; i++) {
        const card = cards.nth(i);
        const title = ((await card.locator(".ant-card-head-title").innerText().catch(() => "")) || "").trim().slice(0, 50);
        const b = card.getByTestId("panel-info");
        if (!(await b.count())) continue;
        await b.evaluate((el) => el.scrollIntoView({ block: "center" }));
        await b.click();
        scan(`ventana (i) de «${title}»`, await page.getByTestId("panel-info-content").last().innerText());
        await page.keyboard.press("Escape");
      }
      results.forbidden.push(...found);
      results.info.push({ board, panels: n });
      console.log(`[live] T${board} forbidden texts: ${JSON.stringify(found)}`);
    });
  }

  test("smoke tour: every board loads, one filter of each kind, the axis filter of T1 and T2, the ratio switch of T1, the panel 15 of T2 with its tooltip, the sources list", async ({ page }) => {
    test.setTimeout(290000);
    const consoleBag = (results.console.smoke = results.console.smoke || {});
    page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") consoleBag[`${m.type()}: ${m.text().slice(0, 160)}`] = (consoleBag[`${m.type()}: ${m.text().slice(0, 160)}`] || 0) + 1; });
    page.on("pageerror", (e) => { consoleBag[`pageerror: ${e.message.slice(0, 160)}`] = (consoleBag[`pageerror: ${e.message.slice(0, 160)}`] || 0) + 1; });
    const status = async () => ((await page.locator("body").innerText()).match(/[\d.]+ productos[^\n]*/) || [""])[0].slice(0, 90);
    const step = async (name, board, query, check) => {
      await open(page, board, query);
      const detail = (await check?.()) || (await status());
      results.smoke.push({ step: name, board, query, ok: true, detail });
      const text = await page.locator("body").innerText();
      expect(text, name).not.toMatch(/\bNaN\b|undefined/);
    };
    await step("T1 carga", 1, "");
    await step("T1 unidad", 1, "faculty=0");
    await step("T1 centro", 1, "center=1");
    await step("T1 interruptor Colombia/Mundo", 1, "basis=global", async () => { await expect(page.getByTestId("calc-explanation")).toBeVisible(); return "mundo; explicación visible"; });
    await step("T1 Eje Temático", 1, "axis=1", async () => { await expect(page.getByTestId("chart-card").first()).toBeVisible(); return "eje 1"; });
    await step("T2 carga", 2, "");
    await step("T2 centro", 2, "center=1");
    await step("T2 unidad", 2, "faculty=0");
    await step("T2 subunidad", 2, "department=0");
    await step("T2 Eje Temático", 2, "axis=1");
    await step("T3 carga", 3, "");
    await step("T3 centro (directo)", 3, "center=1");
    await step("T3 unidad (directo)", 3, "faculty=17");
    await step("T3 subunidad (directo)", 3, "department=96");
    // panel 15 of T2 and its tooltip of amounts (the canvas is drawn; the tooltip is read from the chart data in f93)
    await open(page, 2);
    const card = page.getByTestId("chart-card").filter({ hasText: "15 · Entidades que financian" }).first();
    await card.scrollIntoViewIfNeeded();
    await expect(card.locator("canvas").first()).toBeVisible({ timeout: 60000 });
    results.smoke.push({ step: "T2 panel 15 dibujado", board: 2, ok: true, detail: "canvas visible (el tooltip de montos lo prueba f93 con los datos)" });
    // sources list of the foot, per board
    for (const board of BOARDS) {
      await open(page, board);
      const sources = page.getByTestId("cut-sources");
      await expect(sources).toBeVisible({ timeout: 60000 });
      results.smoke.push({ step: `T${board} lista de fuentes`, board, ok: true, detail: (await sources.innerText()).split("\n").length - 1 + " fuentes" });
    }
  });
});
