/*
 * F46 and F46b (D-139): «presencia puntual» is drawn as an X and 70 % smaller (factor 0,3, minimum of 5 px
 * of diameter), and the texts about «sin producción» say «sin productos con ese tópico principal en
 * 2010–2025» with the words «tópico principal» as a link to OpenAlex in the foot of the panels and in the
 * help text (not in the tooltip). The first block needs no server; the second reads the real quyca and the
 * dev server of Luis (D-100) and only runs with E2E_LIVE=1. No screenshots are saved (D-139 8).
 */
import { test, expect } from "@playwright/test";

import { CATEGORY, computeCapacity, createDataset } from "../../lib/observatories/capacity";
import { CATEGORY_MARKS } from "../../lib/observatories/palette";
import { shapePath, xmark } from "../../lib/observatories/shapes";
import { PUNTUAL_MIN_SIZE, PUNTUAL_SIZE_FACTOR, pointRadius, sizeFor } from "../../lib/observatories/scatterSize";
import { PRIMARY_TOPIC_LINK_TEXT, PRIMARY_TOPIC_URL, SIZE_NOTE, noProductionTooltip, undrawnNote } from "../../app/observatories/vri-udea/board-1/components/boardTexts";

const URL_OPENALEX = "https://help.openalex.org/data/works/attributes/#primary_topic";

test.describe("X, size and wording (no server)", () => {
  test("punctual presence is an X: the shape is its own, the outline has 12 corners and no point is out of the square", () => {
    expect(CATEGORY_MARKS.punctual.shape).toBe("x");
    const commands = xmark(0, 0, 10);
    expect(commands).toHaveLength(13); // M, 11 L and Z
    const points = commands.filter((c) => c.length === 3);
    expect(points).toHaveLength(12);
    for (const [, x, y] of points) {
      expect(Math.abs(x)).toBeLessThanOrEqual(13);
      expect(Math.abs(y)).toBeLessThanOrEqual(13);
    }
    // the X is diagonal: the outermost corners (the ends of the strokes) lie away from both axes, as in no plus sign
    const norm = ([, x, y]) => Math.hypot(x, y);
    const farthest = [...points].sort((p, q) => norm(q) - norm(p)).slice(0, 8);
    for (const [, x, y] of farthest) {
      expect(Math.abs(x)).toBeGreaterThan(3);
      expect(Math.abs(y)).toBeGreaterThan(3);
    }
    expect(shapePath("x", 6).startsWith("M")).toBe(true);
  });

  test("the factor is 0,3 (70 % smaller) with a minimum of 5 px of diameter, read from the constants, and only for punctual presence", () => {
    expect(PUNTUAL_SIZE_FACTOR).toBe(0.3);
    expect(PUNTUAL_MIN_SIZE).toBe(5);
    // the other categories do not change
    for (const fwci of [0, 0.5, 2, 8, 30]) expect(pointRadius(fwci, false)).toBe(sizeFor(fwci));
    // above the minimum: 30 % of the diameter that the FWCI gives
    expect(2 * pointRadius(8, true)).toBeCloseTo(0.3 * 2 * sizeFor(8), 6);
    expect(2 * pointRadius(8, true)).toBeGreaterThanOrEqual(PUNTUAL_MIN_SIZE);
    // below it: the minimum of 5 px of diameter
    expect(2 * pointRadius(0, true)).toBe(PUNTUAL_MIN_SIZE);
    expect(2 * pointRadius(0.2, true)).toBe(PUNTUAL_MIN_SIZE);
    // always smaller than the normal point of the same FWCI
    for (const fwci of [0, 1, 4, 8]) expect(pointRadius(fwci, true)).toBeLessThan(pointRadius(fwci, false));
  });

  test("the note of the size legend says that punctual presence is drawn 70 % smaller, from the factor", () => {
    expect(SIZE_NOTE).toBe("Tamaño = FWCI (normalizado por tópico y año), solo productos con registro en OpenAlex; presencia puntual se dibuja 70 % más pequeña");
  });

  test("the wording of «sin producción»: «sin productos con ese tópico principal en 2010–2025»; the tooltip has the text and no link", () => {
    expect(PRIMARY_TOPIC_URL).toBe(URL_OPENALEX);
    expect(PRIMARY_TOPIC_LINK_TEXT).toBe("tópico principal");
    expect(noProductionTooltip({ otherYears: 811, never: 1284, noun: "tópicos" })).toBe("Tópicos sin productos con ese tópico principal en 2010–2025 (811 con producción anterior y 1.284 sin ninguna): no se dibujan en la gráfica");
    expect(noProductionTooltip({ otherYears: 1, never: 2, noun: "tópicos" })).not.toMatch(/<a|http/);
    expect(undrawnNote({ count: 2095, noun: "tópicos" })).toContain("sin productos con ese tópico principal en 2010–2025");
    /* F112: the definition is in the card of the panel 2, not in the block of help */
  });
});

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";
const PAGE = (query = "") => `/observatories/vri-udea/board-1${query ? `?${query}` : ""}`;

async function open(page, width = 1280, query) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(PAGE(query));
  await expect(page.getByTestId("category-legend")).toBeVisible({ timeout: 120000 });
  await page.waitForTimeout(1500);
}

test.describe("X, size and links against the real quyca (read-only)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  let raw;
  test.beforeAll(async () => {
    raw = await (await fetch(`${API}/observatories/vri-udea/boards/1/bundle`)).json();
  });

  test("sizes of the punctual points before and after (text): the minimum diameter holds and the noise goes down", async () => {
    const result = computeCapacity(createDataset(raw));
    const punctual = result.units.filter((u) => u.category === CATEGORY.PUNCTUAL && u.products > 0);
    const others = result.units.filter((u) => u.category !== CATEGORY.PUNCTUAL && u.products > 0);
    const fwci = (u) => (Number.isFinite(u.fwci) ? u.fwci : 0);
    const median = (list) => [...list].sort((a, b) => a - b)[Math.floor(list.length / 2)];
    const before = punctual.map((u) => 2 * sizeFor(fwci(u)));
    const after = punctual.map((u) => 2 * pointRadius(fwci(u), true));
    console.log(`[live] ${punctual.length} punctual points: diameter median ${median(before).toFixed(1)} px before and ${median(after).toFixed(1)} px after; minimum ${Math.min(...before).toFixed(1)} before and ${Math.min(...after).toFixed(1)} after; maximum ${Math.max(...before).toFixed(1)} before and ${Math.max(...after).toFixed(1)} after`);
    console.log(`[live] the ${others.length} points of the other categories keep a median diameter of ${median(others.map((u) => 2 * sizeFor(fwci(u)))).toFixed(1)} px`);
    expect(punctual.length).toBeGreaterThan(0);
    expect(Math.min(...after)).toBeGreaterThanOrEqual(PUNTUAL_MIN_SIZE);
    expect(median(after)).toBeLessThan(median(before));
    for (let i = 0; i < after.length; i++) expect(after[i]).toBeLessThan(before[i]);
  });

  test("the links of «tópico principal» are in the foot of the panels 1 and 2, open in a new tab and carry the OpenAlex address", async ({ page }) => {
    await open(page);
    const links = page.getByTestId("primary-topic-link");
    expect(await links.count()).toBe(2); // foot of the panel 1, foot of the panel 2 (F112: not in the block of help)
    for (let i = 0; i < 2; i++) {
      const link = links.nth(i);
      await expect(link).toHaveText("tópico principal");
      await expect(link).toHaveAttribute("href", URL_OPENALEX);
      await expect(link).toHaveAttribute("target", "_blank");
      expect(await link.getAttribute("rel")).toContain("noopener");
      expect(await link.getAttribute("rel")).toContain("noreferrer");
    }
    // the sentences
    await expect(page.getByTestId("undrawn-note")).toContainText("sin productos con ese tópico principal en 2010–2025 no se dibujan");
    await expect(page.getByText("«Sin producción» = sin productos con ese tópico principal en 2010–2025.", { exact: false })).toBeVisible();
    // the click opens the page of OpenAlex in a new tab
    const [popup] = await Promise.all([page.context().waitForEvent("page", { timeout: 20000 }), page.getByTestId("undrawn-note").getByTestId("primary-topic-link").click()]);
    expect(popup.url()).toContain("help.openalex.org/data/works/attributes");
    await popup.close();
  });

  test("the tooltip of the legend has the text without a link", async ({ page }) => {
    await open(page);
    await page.locator('[data-category="none"]').hover();
    const tip = page.locator(".ant-tooltip:not(.ant-tooltip-hidden)");
    await expect(tip).toContainText("sin productos con ese tópico principal en 2010–2025");
    expect(await tip.locator("a").count()).toBe(0);
    expect(await tip.innerText()).not.toMatch(/https?:/);
  });

  test("the legend of sizes says that punctual presence is drawn 70 % smaller and the X is the shape of its button and of the row of the table", async ({ page }) => {
    await open(page);
    await expect(page.getByText("presencia puntual se dibuja 70 % más pequeña")).toBeVisible();
    const buttonPath = await page.locator('button[data-category="punctual"] svg path').getAttribute("d");
    const tablePath = await page.getByLabel("Reglas de clasificación").locator("tr", { hasText: "Presencia puntual" }).locator("svg path").getAttribute("d");
    const expected = shapePath("x", 12 / 2 - 1.5);
    expect(buttonPath).toBe(expected);
    expect(tablePath).toBe(shapePath("x", 14 / 2 - 1.5));
  });

  test("the legend still fits in two lines with the longer note of sizes", async ({ page }) => {
    for (const width of [1280, 768]) {
      await open(page, width);
      const report = await page.getByTestId("category-legend").evaluate((box) => ({ height: Math.round(box.getBoundingClientRect().height), clipped: box.scrollHeight > box.clientHeight + 1 }));
      expect(report.height).toBe(61);
      expect(report.clipped).toBe(false);
    }
  });
});
