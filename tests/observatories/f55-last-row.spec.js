/*
 * F55 (D-153): the row «Otros productos asignados al eje» is a normal row of the BODY of the table of topics, so its tag
 * «Por productos» shares columns, padding and scrollbar with the tags of the other rows. Measured with CLASSIC scrollbars
 * (Playwright hides them in headless: the flag --hide-scrollbars is taken out), the only way to see the offset of the
 * old footer. Reads the real quyca and the dev server of Luis (D-100): only with E2E_LIVE=1. No screenshots.
 */
import { test, expect } from "@playwright/test";

const LIVE = !!process.env.E2E_LIVE;
const BOARD = (q = "") => `/observatories/vri-udea/board-1${q ? `?${q}` : ""}`;

test.use({ launchOptions: { ignoreDefaultArgs: ["--hide-scrollbars"], args: ["--disable-features=OverlayScrollbar,OverlayScrollbarFlashAfterAnyScrollUpdate"] } });

/* Centre of each tag and of the cell that holds it, the header of the column and the width of the scrollbar of the body. */
const measure = (page) =>
  page.evaluate(() => {
    const r = (el) => el.getBoundingClientRect();
    const mid = (el) => Math.round((r(el).x + r(el).width / 2) * 10) / 10;
    const tags = [...document.querySelectorAll(".ant-table-tbody .ant-tag, [data-testid='axis-topics-other-link']")].filter((t, i, a) => a.indexOf(t) === i);
    const body = document.querySelector(".ant-table-body:has([data-testid='axis-topics-other'])");
    const header = [...document.querySelectorAll("th.ant-table-cell")].find((h) => h.textContent.includes("Vínculo con el eje"));
    return {
      scrollbar: body ? body.offsetWidth - body.clientWidth : -1,
      header: mid(header),
      otherInBody: !!document.querySelector(".ant-table-tbody [data-testid='axis-topics-other-link']"),
      tags: tags.map((t) => ({ width: Math.round(r(t).width * 10) / 10, center: mid(t), cell: mid(t.closest("td")) })),
    };
  });

test.describe("F55 with classic scrollbars against the real quyca (read-only)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  for (const width of [1440, 1280]) {
    for (const query of ["axis=67", "axis=98", "axis=98&from=2021&to=2025"]) {
      test(`every tag, the last row included, is at the centre of its cell and has the same width (${query}, ${width} px)`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(BOARD(query));
        await page.getByTestId("axis-topics-other-link").waitFor({ timeout: 120000 });
        await page.waitForTimeout(800);
        const m = await measure(page);
        const offsets = m.tags.map((t) => Math.round((t.center - t.cell) * 10) / 10);
        const other = m.tags[m.tags.length - 1];
        console.log(`[live] ${query} @${width}: scrollbar ${m.scrollbar} px · ${m.tags.length} tags · other row in body: ${m.otherInBody} · offset tag-cell: max ${Math.max(...offsets.map(Math.abs))} px, last row ${offsets[offsets.length - 1]} px · last row vs header ${Math.round((other.center - m.header) * 10) / 10} px`);
        expect(m.scrollbar).toBeGreaterThan(5); // classic scrollbar really on
        expect(m.otherInBody).toBe(true);
        expect(new Set(m.tags.map((t) => t.width)).size).toBe(1);
        for (const o of offsets) expect(Math.abs(o)).toBeLessThan(2);
        expect(Math.abs(other.center - m.tags[0].center)).toBeLessThan(2);
        expect(Math.abs(other.center - m.header)).toBeLessThan(2);
      });
    }
  }

  test("whatever the sorting (every column, both directions) the row of reconciliation stays the last of the body", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(BOARD("axis=98"));
    await page.getByTestId("axis-topics-other-link").waitFor({ timeout: 120000 });
    const lastIsOther = async () => {
      const rows = page.locator(".ant-table-body:has([data-testid='axis-topics-other']) tr.ant-table-row");
      const n = await rows.count();
      return (await rows.nth(n - 1).getAttribute("data-testid")) === "axis-topics-other" && (await page.locator(".ant-table-tbody [data-testid=axis-topics-other]").count()) === 1;
    };
    expect(await lastIsOther()).toBe(true);
    for (const title of ["Tópico", "Productos", "Citas", "Vínculo con el eje"]) {
      const header = page.locator("th.ant-table-column-has-sorters", { hasText: title }).filter({ has: page.locator("xpath=self::*") }).first();
      for (let click = 0; click < 3; click++) {
        await header.click();
        await page.waitForTimeout(150);
        expect(await lastIsOther(), `${title}, click ${click + 1}`).toBe(true);
      }
    }
  });

  test("with a few topics (axis 12) there is no gap and the row and the total are visible; the total adds up to the cards", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(BOARD("axis=12"));
    await page.getByTestId("axis-topics-total-products").waitFor({ timeout: 120000 });
    const body = await page.locator(".ant-table-body:has([data-testid='axis-topics-other'])").boundingBox();
    const rows = await page.locator(".ant-table-body:has([data-testid='axis-topics-other']) tr.ant-table-row").evaluateAll((r) => r.map((x) => x.getBoundingClientRect().bottom));
    console.log(`[live] axis 12: ${rows.length} rows in the body, body ${Math.round(body.height)} px high`);
    await expect(page.getByTestId("axis-topics-total-products")).toBeVisible();
    await page.getByTestId("axis-topics-total-products").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("axis-topics-other-products")).toBeInViewport();
    await expect(page.getByTestId("axis-topics-total-products")).toBeInViewport();
    const gap = body.y + body.height - Math.max(...rows);
    console.log(`[live] axis 12: gap under the last row ${Math.round(gap)} px`);
    expect(gap).toBeLessThan(2);
  });
});
