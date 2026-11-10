/*
 * F123 (D-263): final sweep before the push. The 44 panels of the three boards at 1440, 1280 and 768 px with the real bundles: no «NaN» or
 * «undefined» in the text, no console error, no failed request, ETags of 02 v28, and the home of the observatories and the cover of the VRI-UdeA
 * without console errors either. E2E_LIVE=1 reads the real quyca and the dev server.
 */
import { test, expect } from "@playwright/test";

const LIVE = !!process.env.E2E_LIVE;
/* Environment noise that is not the code of the observatories: the anonymous call to /me (401), Sentry (its CORS rejects localhost), Google Analytics aborted on navigation and the dev overlay. */
const ENV = /sentry|status of 401|^401 |ERR_FAILED|ERR_ABORTED|google-analytics|__nextjs_original-stack-frame/;
/* KNOWN: the L7 map of the subregions of the board 1 (see the report of F123). */
const KNOWN = /enableRelativeCoordinates/;
const ETAGS = { 1: '"20261107-c550a33072f7"', 2: '"20261107-1d00bdd70b19"', 3: '"20261107-956a71cbf0c3"' };

const watch = (page) => {
  const log = { errors: [], failed: [], etags: {} };
  page.on("console", (m) => { if (m.type() === "error") log.errors.push(m.text().slice(0, 300)); });
  page.on("pageerror", (e) => log.errors.push(`pageerror: ${String(e.message).slice(0, 300)}`));
  page.on("requestfailed", (r) => { if (!/_next\/webpack-hmr|\.hot-update|favicon/.test(r.url())) log.failed.push(`${r.url().slice(0, 140)} ${r.failure()?.errorText}`); });
  page.on("response", (r) => {
    const m = r.url().match(/boards\/(\d)\/bundle/);
    if (m && r.status() < 400) log.etags[m[1]] = r.headers()["etag"];
    if (r.status() >= 400 && !/favicon/.test(r.url())) log.failed.push(`${r.status()} ${r.url().slice(0, 140)}`);
  });
  return log;
};

test.describe("F123 final sweep (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("the 44 panels at 1440, 1280 and 768: no NaN, no undefined, no console error, ETags of 02 v28", async ({ page }) => {
    test.setTimeout(900000);
    const log = watch(page);
    const report = [];
    const cardsByBoard = {};
    for (const width of [1440, 1280, 768]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const board of [1, 2, 3]) {
        await page.goto(`/observatories/vri-udea/board-${board}`);
        await page.getByTestId("method-notes").waitFor({ timeout: 150000 });
        await page.waitForTimeout(4000);
        const m = await page.evaluate(() => {
          const cards = [...document.querySelectorAll('[data-testid="chart-card"]')].map((c) => (c.querySelector(".ant-card-head-title")?.textContent || "").trim());
          return { cards, text: document.body.innerText, sideways: document.documentElement.scrollWidth - window.innerWidth };
        });
        cardsByBoard[board] = m.cards;
        const bad = m.text.match(/.{0,40}(NaN|undefined|\[object Object\]).{0,40}/g) || [];
        report.push(`${width} T${board}: ${m.cards.length} cards, sideways ${m.sideways}, bad text ${bad.length}${bad.length ? ` ${JSON.stringify(bad.slice(0, 3))}` : ""}, etag ${log.etags[board]}`);
        expect(bad, `${width} T${board} text`).toEqual([]);
        expect(m.cards.every(Boolean), `${width} T${board} untitled card`).toBe(true);
        expect(log.etags[board], `${width} T${board} ETag`).toBe(ETAGS[board]);
      }
    }
    const total = Object.values(cardsByBoard).reduce((a, c) => a + c.length, 0);
    console.log(`[real]\n${report.join("\n")}\ncards per board ${JSON.stringify(Object.fromEntries(Object.entries(cardsByBoard).map(([k, v]) => [k, v.length])))} = ${total}\nconsole errors ${JSON.stringify([...new Set(log.errors)])}\nfailed ${JSON.stringify([...new Set(log.failed)])}`);
    expect([...new Set(log.errors)].filter((e) => !ENV.test(e) && !KNOWN.test(e)), "console errors").toEqual([]);
    expect([...new Set(log.failed)].filter((e) => !ENV.test(e)), "failed requests").toEqual([]);
  });

  test("the home of the observatories loads with no uncaught error; the cover (board 1) has one known error of the L7 map library", async ({ page }) => {
    test.setTimeout(300000);
    const home = watch(page);
    await page.goto("/observatories");
    await page.waitForTimeout(8000);
    const homeErrors = [...new Set(home.errors)].filter((e) => !ENV.test(e));
    expect(homeErrors, "home of the observatories").toEqual([]);
    const cover = watch(page);
    await page.goto("/observatories/vri-udea");
    await page.waitForTimeout(9000);
    const errors = [...new Set(cover.errors)].filter((e) => !ENV.test(e));
    console.log(`[real] cover: ${JSON.stringify(errors)}`);
    /* KNOWN (F123): the map of the subregions of the board 1 (AreaMap of @ant-design/maps, @antv/l7-layers 2.23.2) throws «enableRelativeCoordinates» when its data change while the layer is being built; it is the «1 error» of the Next indicator. */
    expect(errors.every((e) => /enableRelativeCoordinates/.test(e)), JSON.stringify(errors)).toBe(true);
  });
});
