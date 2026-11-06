/*
 * F48b (D-143): (1) the container of the filters is fixed at the top (under the site header), with the shadow
 * and the radius of the cards; (2) the note of the centre filter is in its help tooltip; (3) the panel 6 labels
 * the 8 axes of the Misión de sabios 2019 «Sin meta superior definida» and the other bars with the end of the
 * route of the goal; (4) the title of a panel is not cut by its note. The first block needs no server; the
 * second reads the real quyca and the dev server of Luis (D-100) and only runs with E2E_LIVE=1. No screenshots.
 */
import { test, expect } from "@playwright/test";

import { CARD_SHADOW } from "../../lib/observatories/layout";
import { createDataset, rankGoals } from "../../lib/observatories/capacity";
import { centerCoverageNote, CENTER_TOOLTIP, NO_PARENT_GOAL_LABEL, NO_PARENT_GOAL_TOOLTIP, goalRows } from "../../app/observatories/vri-udea/board-1/components/boardTexts";

const axis = (id, agenda, meta) => ({ id, agenda, meta });

test.describe("panel 6 labels (no server)", () => {
  const axes = [
    axis(0, "PDD dptal Antioquia", "Línea estratégica 3. Inversión desde la confianza › Componente 3.2. Desarrollo agropecuario y rural › Programa 3.2.3. Reconversión productiva y modernización de la ganadería en Antioquia"),
    axis(1, "PDD dptal Antioquia", "Línea estratégica 3. Inversión desde la confianza › Componente 3.2. Desarrollo agropecuario y rural › Programa 3.2.3. Reconversión productiva y modernización de la ganadería en Antioquia"),
    axis(2, "PDD dptal Antioquia", "Línea estratégica 3. Inversión desde la confianza › Componente 3.1. Ciencia y tecnología"),
    axis(3, "Misión de sabios 2019", ""),
    axis(4, "Misión de sabios 2019", ""),
  ];
  const rows = goalRows(rankGoals({ axes }, { axisFilter: null }));

  test("the counts do not change: one row per goal with the number of axes", () => {
    expect(rows.map((r) => r.value)).toEqual([2, 2, 1]);
    expect(rows.reduce((a, r) => a + r.value, 0)).toBe(5);
  });

  test("the axes without a goal above them are «Sin meta superior definida» with the agenda below and the explanation in the tooltip", () => {
    const row = rows.find((r) => r.label.startsWith(NO_PARENT_GOAL_LABEL));
    expect(row.label).toBe("Sin meta superior definida\nMisión de sabios 2019");
    expect(row.fullLabel).toBe("Los ejes de la Misión de sabios 2019 son en sí mismos metas y retos; no tienen una meta superior");
    expect(row.fullLabel).toBe(NO_PARENT_GOAL_TOOLTIP);
    expect(row.detail).toBe("Misión de sabios 2019");
    expect(row.value).toBe(2);
  });

  test("the other bars are labelled with what follows the last « › », and the full route and the agenda stay for the tooltip", () => {
    const programme = rows.find((r) => r.label.startsWith("Programa 3.2.3."));
    expect(programme.label).toBe("Programa 3.2.3. Reconversión productiva y modernización de la ganadería en Antioquia");
    expect(programme.fullLabel).toContain("Línea estratégica 3. Inversión desde la confianza › Componente 3.2.");
    expect(programme.detail).toBe("PDD dptal Antioquia");
    expect(rows.find((r) => r.label === "Componente 3.1. Ciencia y tecnología")).toBeTruthy();
  });

  test("the labels that were identical at the start («Línea estratégica 3. Inversión desde l…») are different at the end", () => {
    const same = [axis(0, "A", "Línea estratégica 3. Inversión desde la confianza › Componente 3.1. X"), axis(1, "A", "Línea estratégica 3. Inversión desde la confianza › Componente 3.2. Y")];
    const labels = goalRows(rankGoals({ axes: same }, { axisFilter: null })).map((r) => r.label.slice(0, 40));
    expect(new Set(labels).size).toBe(2);
  });
});

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";
const BOARD = (n, query = "") => `/observatories/vri-udea/board-${n}${query ? `?${query}` : ""}`;

async function open(page, n, width, height) {
  await page.setViewportSize({ width, height });
  await page.goto(BOARD(n));
  await expect(page.getByTestId("filters")).toBeVisible({ timeout: 120000 });
  await page.waitForTimeout(1500);
}

test.describe("fixed filters, help of the centre filter, panel 6 and titles against the real quyca (read-only)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  for (const n of [1, 2, 3]) {
    test(`Board ${n}: the filters stay at the top under the site header, with the shadow and the radius of the cards`, async ({ page }) => {
      await open(page, n, 1280, 720);
      const filters = page.getByTestId("filters");
      const style = await filters.evaluate((el) => {
        const cs = getComputedStyle(el);
        const card = document.querySelector(".ant-card");
        const cc = getComputedStyle(card);
        return { position: cs.position, z: cs.zIndex, shadow: cs.boxShadow, radius: cs.borderRadius, background: cs.backgroundColor, cardRadius: cc.borderRadius, height: Math.round(el.getBoundingClientRect().height) };
      });
      expect(style.position).toBe("sticky");
      expect(+style.z).toBeLessThan(198); // under the site header
      expect(+style.z).toBeGreaterThan(10); // over the charts
      expect(style.radius).toBe(style.cardRadius);
      expect(style.background).not.toMatch(/rgba\(0, 0, 0, 0\)|transparent/);
      expect(style.shadow).not.toBe("none");
      // the card shadow (same constant): compare with a card of the page
      const cardShadow = await page.locator(".ant-card").first().evaluate((el) => getComputedStyle(el).boxShadow);
      expect(style.shadow).toBe(cardShadow);
      expect(CARD_SHADOW.length).toBeGreaterThan(10);
      // after scrolling the container is right under the header
      await page.mouse.wheel(0, 2200);
      await page.waitForTimeout(500);
      const where = await page.evaluate(() => {
        const f = document.querySelector('[data-testid="filters"]').getBoundingClientRect();
        const stack = document.elementsFromPoint(Math.floor(innerWidth / 2), 2);
        const header = stack.find((e) => getComputedStyle(e).position === "sticky" && !e.closest('[data-testid="filters"]'));
        return { filtersTop: Math.round(f.top), headerBottom: header ? Math.round(header.getBoundingClientRect().bottom) : 0 };
      });
      expect(where.headerBottom).toBeGreaterThan(0);
      expect(Math.abs(where.filtersTop - where.headerBottom)).toBeLessThanOrEqual(2);
      console.log(`[live] board ${n}: filters ${style.height} px high at 1280x720 (${Math.round((100 * style.height) / 720)} % of the window), header ${where.headerBottom} px`);
    });
  }

  test("height of the filters at 768 px, dropdowns over them, and the title of a card is not hidden by an anchor", async ({ page }) => {
    await open(page, 1, 768, 900);
    const height = await page.getByTestId("filters").evaluate((el) => Math.round(el.getBoundingClientRect().height));
    console.log(`[live] board 1: filters ${height} px high at 768 px wide (${Math.round((100 * height) / 900)} % of 900 px)`);
    // a dropdown opens over the container and over the cards
    await page.mouse.wheel(0, 1800);
    await page.waitForTimeout(400);
    await page.getByTestId("filters").locator(".ant-select").first().click();
    await page.waitForTimeout(400);
    const covered = await page.evaluate(() => {
      const el = [...document.querySelectorAll(".ant-select-dropdown")].find((d) => !d.className.includes("hidden"));
      if (!el) return "no dropdown";
      const r = el.getBoundingClientRect();
      const top = document.elementFromPoint(r.left + r.width / 2, r.top + Math.min(20, r.height / 2));
      return !el.contains(top);
    });
    expect(covered, "something covers the dropdown").toBe(false);
    await page.keyboard.press("Escape");
    // arriving at a card by an anchor leaves its title below the filters
    await page.getByTestId("chart-card").nth(3).evaluate((el) => el.scrollIntoView());
    await page.waitForTimeout(500);
    const gap = await page.evaluate(() => {
      const f = document.querySelector('[data-testid="filters"]').getBoundingClientRect();
      const t = document.querySelectorAll('[data-testid="chart-card"]')[3].getBoundingClientRect();
      return Math.round(t.top - f.bottom);
    });
    expect(gap).toBeGreaterThanOrEqual(0);
  });

  for (const n of [1, 2, 3]) {
    test(`Board ${n}: the note of the centre filter is in the help tooltip (keyboard) and not under the control`, async ({ page }) => {
      await open(page, n, 1280, 720);
      const raw = await (await fetch(`${API}/observatories/vri-udea/boards/${n}/bundle`)).json();
      const field = page.locator("label", { hasText: /Centro de investigación/ }).first().locator("xpath=../..");
      const help = field.getByTestId("filter-help");
      await expect(help).toBeVisible();
      await expect(help).toHaveAttribute("aria-label", /Ayuda del filtro .*Centro de investigación/);
      const note = await field.innerText();
      expect(note).not.toContain("están en algún centro de investigación");
      await help.focus(); // the keyboard focus opens it
      await expect(page.getByText(/productos \(\d+,\d %\) están en algún centro de investigación/)).toBeVisible({ timeout: 5000 });
      await expect(page.getByText(CENTER_TOOLTIP).last()).toBeVisible();
      expect(raw.groups.length).toBeGreaterThan(0);
      expect(centerCoverageNote({ withCenter: 1, total: 2 })).toContain("50,0 %");
    });
  }

  test("the title of no card is cut by its note, at 1280 and 768 px, in the three boards", async ({ page }) => {
    test.setTimeout(150000);
    for (const n of [1, 2, 3]) {
      for (const [w, h] of [[1280, 720], [768, 900]]) {
        await open(page, n, w, h);
        const cut = await page.evaluate(() => [...document.querySelectorAll('[data-testid="chart-card"] .ant-card-head-title')].filter((t) => t.scrollWidth > t.clientWidth + 1).map((t) => t.innerText.slice(0, 50)));
        expect(cut, `board ${n} at ${w}`).toEqual([]);
      }
    }
  });

  test("panel 6: the bar of the Misión de sabios says «Sin meta superior definida» and the figures are the ones of the bundle", async ({ page }) => {
    const raw = await (await fetch(`${API}/observatories/vri-udea/boards/1/bundle`)).json();
    const rows = goalRows(rankGoals(createDataset(raw), { axisFilter: null }));
    const values = rows.map((r) => r.value);
    expect(values.slice(0, 3)).toEqual([8, 7, 5]); // 8, 7, 5, 2 x 5, 1 x 4 (D-143)
    expect(rows[0].label).toBe("Sin meta superior definida\nMisión de sabios 2019");
    expect(rows[0].fullLabel).toBe(NO_PARENT_GOAL_TOOLTIP);
    expect(rows.filter((r) => r.value === 2)).toHaveLength(5);
    expect(rows.filter((r) => r.value === 1)).toHaveLength(4);
    const ends = rows.slice(1).map((r) => r.label.slice(0, 30));
    expect(rows.slice(1).every((r) => !r.label.includes(" › "))).toBe(true);
    expect(ends.length).toBeGreaterThan(0);
    await open(page, 1, 1280, 720);
    await expect(page.getByText("6 · Meta / reto / programa / estrategia")).toBeVisible();
  });
});
