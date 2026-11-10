/*
 * Board 1 against a REAL quyca (read-only). Skipped unless E2E_LIVE is set, for example:
 *   E2E_LIVE=1 npx playwright test tests/observatories/board-1-live.spec.js -c playwright.observatories.config.js
 *
 * They only read: GET /observatories/vri-udea/boards/1/bundle and /cut (02 §3.11 and §3.12). They
 * check the shape, the headers, the error states and that the filters stack on the counts. They
 * do not assert exact figures of the real data (those change with every load).
 */
import { test, expect } from "@playwright/test";

import { CALCULATOR_FONT_SIZE, CALCULATOR_LABEL_WIDTH, CATEGORY_LABELS, CATEGORY_ORDER, computeCapacity, createDataset, rankActors, rankAxes, rankOds } from "../../lib/observatories/capacity";

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";
const BUNDLE = `${API}/observatories/vri-udea/boards/1/bundle`;

test.describe("Board 1 against a real quyca (read-only)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");
  test.describe.configure({ mode: "serial" });

  let raw;
  let etag;

  test("the bundle answers 200 with ETag, gzip and the shape the board reads (02 §3.11)", async () => {
    const started = Date.now();
    const response = await fetch(BUNDLE, { headers: { "Accept-Encoding": "gzip" } });
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(response.headers.get("cache-control")).toContain("no-cache");
    etag = response.headers.get("etag");
    expect(etag).toMatch(/^"\d+-[0-9a-f]+"$/);
    raw = await response.json();
    console.log(`[live] bundle 1: ${Date.now() - started} ms, ETag ${etag}`);
    for (const key of ["meta", "topics", "facs", "deps", "cens", "groups", "ejes", "facts", "pies", "subregiones", "actores", "ods", "afils", "actor_tipos", "obs"]) {
      expect(raw, `key ${key}`).toHaveProperty(key);
    }
    // No envelope: it is not a list, so there is no meta.count (02 §3.11).
    expect(raw.meta).not.toHaveProperty("count");
    // facts[0..9] keep their positions; 10 to 13 are the new ones.
    expect(raw.facts[0].length).toBeGreaterThanOrEqual(14); // [14] (record in OpenAlex) arrives with B97
    expect(raw.facts[0][1]).toBeGreaterThanOrEqual(raw.meta.years[0]);
    expect(raw.facts.length).toBe(raw.meta.n_topic);
  });

  test("If-None-Match with the same ETag answers 304", async () => {
    const response = await fetch(BUNDLE, { headers: { "If-None-Match": etag } });
    expect(response.status).toBe(304);
    expect((await response.arrayBuffer()).byteLength).toBe(0);
  });

  test("an unknown observatory or board is a 404 with the error of 02 §3.11", async () => {
    const response = await fetch(`${API}/observatories/otro/boards/1/bundle`);
    expect(response.status).toBe(404);
    expect(await response.json()).toHaveProperty("error");
    expect((await fetch(`${API}/observatories/vri-udea/boards/9/bundle`)).status).toBe(404);
  });

  test("/cut gives the footer text (02 §3.12)", async () => {
    const response = await fetch(`${API}/observatories/vri-udea/cut`);
    expect(response.status).toBe(200);
    const { data } = await response.json();
    expect(typeof data.texto).toBe("string");
    expect(data.texto.length).toBeGreaterThan(0);
    expect(data.load_id).toBeGreaterThan(0);
  });

  test("the dataset of the bundle computes and the counts stack with the filters", async () => {
    const dataset = createDataset(raw);
    expect(dataset.hasFactDetails).toBe(true);
    const all = computeCapacity(dataset);
    expect(all.products).toBeGreaterThan(0);

    const sum = (arr) => [...arr].reduce((a, b) => a + b, 0);
    const byYears = computeCapacity(dataset, { yearFrom: 2018, yearTo: 2022 });
    const byFaculty = computeCapacity(dataset, { facultyIndex: raw.facts.find((f) => f[6].length)[6][0] });
    const stacked = computeCapacity(dataset, { yearFrom: 2018, yearTo: 2022, facultyIndex: raw.facts.find((f) => f[6].length)[6][0] });

    // Each added filter can only remove products, and the complements follow in the same pass.
    expect(byYears.products).toBeLessThan(all.products);
    expect(stacked.products).toBeLessThanOrEqual(Math.min(byYears.products, byFaculty.products));
    expect(sum(stacked.subregionCounts)).toBeLessThanOrEqual(sum(byYears.subregionCounts));
    expect(sum(stacked.odsCounts)).toBeLessThanOrEqual(sum(byYears.odsCounts));
    expect(sum(stacked.actorCounts.values())).toBeLessThanOrEqual(sum(byYears.actorCounts.values()));
    expect(sum(all.subregionCounts)).toBeGreaterThan(0);
    expect(rankOds(dataset, all).length).toBe(17);
    expect(rankActors(dataset, all).length).toBeGreaterThan(0);
    // The ODS cut (score >= 0.40) leaves fewer assignments than the raw rows.
    expect(sum(all.odsCounts)).toBeLessThanOrEqual(raw.facts.reduce((n, f) => n + f[11].length, 0));
  });

  test("the axis–work pairs count by confidence: high and medium by default, low only on request, and filters stack", async () => {
    const dataset = createDataset(raw);
    const total = (r) => r.axisPairCounts.reduce((a, b) => a + b, 0);
    const core = computeCapacity(dataset);
    const all = computeCapacity(dataset, { pairLevel: "all" });
    expect(core.filters.pairLevel).toBe("core");
    expect(total(core)).toBeGreaterThan(0);
    expect(total(all)).toBeGreaterThan(total(core));
    // Same totals as counting the pairs of the bundle by hand.
    const byHand = (max) => raw.facts.reduce((n, f) => n + f[12].filter((p) => p[1] <= max).length, 0);
    expect(total(core)).toBe(byHand(1));
    expect(total(all)).toBe(byHand(2));
    // The ranking comes from the pairs, sorted, at most 15 rows, and low confidence can only add.
    const rows = rankAxes(dataset, core);
    expect(rows.length).toBeLessThanOrEqual(15);
    expect(rows.map((r) => r.value)).toEqual([...rows.map((r) => r.value)].sort((a, b) => b - a));
    expect(rankAxes(dataset, all)[0].value).toBeGreaterThanOrEqual(rows[0].value);
    // Stacked filters: years and a scope only remove pairs.
    const byYears = computeCapacity(dataset, { yearFrom: 2018, yearTo: 2022 });
    const stacked = computeCapacity(dataset, { yearFrom: 2018, yearTo: 2022, scope: dataset.scopes[0] });
    expect(total(byYears)).toBeLessThan(total(core));
    expect(total(stacked)).toBeLessThanOrEqual(total(byYears));
  });

  test("the confidence control goes to the URL (?pairs=all) and keeps the other parameters", async ({ page }) => {
    await page.goto("/observatories/vri-udea/board-1");
    await expect(page.getByText("Confianza de la asignación a ejes")).toBeVisible({ timeout: 120000 });
    await page.getByText("Incluir baja", { exact: true }).click();
    await expect(page).toHaveURL(/pairs=all/, { timeout: 5000 });
    /* F100 (D-223): the note of the header of the panel 4 moved into its information window */
    await page.getByTestId("chart-card").filter({ hasText: "4 · Ejes Temáticos públicos" }).first().getByTestId("panel-info").click();
    await expect(page.getByTestId("panel-info-note").last()).toContainText("productos con asignación de cualquier confianza (incluye baja)");
    await page.keyboard.press("Escape");
    await page.getByText("Alta y media", { exact: true }).click();
    await expect(page).not.toHaveURL(/pairs=/, { timeout: 5000 });
    await page.getByTestId("chart-card").filter({ hasText: "4 · Ejes Temáticos públicos" }).first().getByTestId("panel-info").click();
    await expect(page.getByTestId("panel-info-note").last()).toContainText("productos con asignación de confianza alta o media");
    await page.keyboard.press("Escape");
  });

  test("the model of D-121 and D-122 with the real bundle: reference counts, FWCI over the works with a record", async () => {
    expect(raw.facts[0]).toHaveLength(16); // facts[14]: record in OpenAlex (B97); facts[15]: expected citations by topic and year (B156)
    const dataset = createDataset(raw);
    expect(dataset.hasCapacityModel).toBe(true);
    const colombia = computeCapacity(dataset);
    const world = computeCapacity(dataset, { ratioBasis: "global" });
    const sum = (r) => CATEGORY_ORDER.reduce((n, c) => n + r.categoryCounts[c], 0);
    expect(sum(colombia)).toBe(colombia.units.length);
    expect(sum(world)).toBe(world.units.length);
    // With the world as reference almost nobody reaches 0.50 of the referent (D-135 d): no leader or consolidated and 99 % below it.
    expect(world.categoryCounts.leader).toBe(0);
    expect(world.categoryCounts.consolidated).toBeLessThanOrEqual(2); // B110: 1 topic of the world reaches 0,75
    const withProduction = world.units.length - world.categoryCounts.none;
    expect(world.categoryCounts.emerging + world.categoryCounts.lowCapacity + world.categoryCounts.punctual).toBeGreaterThan(0.99 * withProduction);
    // Colombia is more demanding on ties: it has leaders.
    expect(colombia.categoryCounts.leader).toBeGreaterThan(0);
    // The 2021-2025 window does not depend on the years filter.
    const narrow = computeCapacity(dataset, { yearFrom: 2010, yearTo: 2015 });
    expect(narrow.categoryCounts.none).toBe(colombia.categoryCounts.none);
    // FWCI: only over the works with record; the two groups add up to the products.
    expect(colombia.fwciBasis.withRecord + colombia.fwciBasis.withoutRecord).toBe(colombia.products);
    expect(colombia.fwciBasis.withoutRecord).toBeGreaterThan(0);
    expect(colombia.setFwci).toBeGreaterThan(1);
    expect(colombia.indicativeUnits).toBeLessThanOrEqual(colombia.unitsInWindow);
  });

  test("the calculator is horizontal bars: eight complete labels in order, figures that match the calculation, zeros with the world as reference", async ({ page }) => {
    await page.goto("/observatories/vri-udea/board-1");
    const chart = page.getByTestId("calculator-bars");
    await expect(chart).toBeVisible({ timeout: 120000 });
    const dataset = createDataset(raw);
    const parse = async () => {
      const label = await chart.getAttribute("aria-label");
      const rows = label.split(". ")[1].split("; ").map((s) => s.split(": "));
      return rows;
    };
    const expectFrom = async (result) => {
      const rows = await parse();
      expect(rows.map((r) => r[0])).toEqual(CATEGORY_ORDER.map((c) => CATEGORY_LABELS[c])); // the eight labels, complete, in order
      const figures = rows.map((r) => Number(r[1].replace(/\./g, "")));
      expect(figures).toEqual(CATEGORY_ORDER.map((c) => result.categoryCounts[c]));
      expect(figures.reduce((a, b) => a + b, 0)).toBe(result.units.length);
    };
    await expectFrom(computeCapacity(dataset));
    // A canvas is drawn and the longest label fits in the room that the chart reserves for them.
    const box = await chart.locator("canvas").first().boundingBox();
    expect(box.width).toBeGreaterThan(200);
    const longest = await page.evaluate(
      ([labels, size]) => {
        const ctx = document.createElement("canvas").getContext("2d");
        ctx.font = size + "px sans-serif";
        return Math.max(...labels.map((l) => ctx.measureText(l).width));
      },
      [CATEGORY_ORDER.map((c) => CATEGORY_LABELS[c]), CALCULATOR_FONT_SIZE],
    );
    expect(longest).toBeLessThan(CALCULATOR_LABEL_WIDTH - 20);
    // Reference "Mundo": the two highest categories at 0 and the figures still match (D-135 d: almost nobody reaches 0,50).
    await page.getByText("Mundo", { exact: true }).click();
    await expect(page).toHaveURL(/basis=global/, { timeout: 5000 });
    await expect.poll(async () => (await parse()).map((r) => r[1]).join(","), { timeout: 10000 }).toMatch(/^0,/); // nobody leads with the world as referent
    const world = computeCapacity(dataset, { ratioBasis: "global" });
    await expectFrom(world);
    expect(world.categoryCounts.leader + world.categoryCounts.consolidated).toBeLessThanOrEqual(2);
    // The footer follows the reference and the indicative count.
    await expect(page.getByText("Referente: Mundo").first()).toBeVisible();
    await expect(page.getByText("con tendencia indicativa (*)").first()).toBeVisible();
  });

  test("the tooltip of the scatter has one labelled line per datum (F34)", async ({ page }) => {
    await page.goto("/observatories/vri-udea/board-1");
    const card = page.locator(".ant-card", { hasText: "Dispersión de tópicos" }).first();
    await expect(card.locator("canvas").first()).toBeVisible({ timeout: 120000 });
    await page.waitForTimeout(2000);
    await card.evaluate((el) => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 120));
    await page.waitForTimeout(500);
    const box = await card.locator("canvas").first().boundingBox();
    let text = "";
    // Sweep the plot area until the tooltip of a point appears (the tooltip fills in a moment after the first hover).
    for (let y = box.y + 40; y < box.y + box.height - 60 && !text; y += 8) {
      for (let x = box.x + 80; x < box.x + box.width - 20 && !text; x += 8) {
        await page.mouse.move(x, y);
        const tip = page.locator(".g2-tooltip:visible").first();
        if (await tip.count()) {
          const t = (await tip.innerText().catch(() => "")) || "";
          if (t.includes("Categoría")) text = t;
        }
      }
    }
    expect(text, "a tooltip appeared").not.toBe("");
    for (const label of ["Tópico", "Subcampo", "Campo", "Productos", "Citas", "FWCI", "Tendencia", "Productos por año (2010–2025)", "Razón de capacidad (Colombia)", "Categoría"]) {
      expect(text, label).toContain(label);
    }
    // F39 (11): Citas on its own line, and the ratio says what it was calculated from.
    expect(text).not.toMatch(/Productos[^\n]*Citas/);
    /* the point under the cursor depends on the layout: either the ratio with its basis or, when the UdeA is the referent (F73), its own sentence */
    expect(text).toMatch(/\(citas de la UdeA [\d.]+ frente a [\d.]+ de [^)]+\)|La UdeA es la institución con más citas/);
    // The sixteen yearly counts of the window 2010–2025 (F101).
    const years = text.split("Productos por año (2010–2025)")[1].split("\n").map((s) => s.trim()).filter(Boolean)[0];
    expect(years.split(",").map((n) => n.trim())).toHaveLength(16);
    expect(text).toMatch(/creciente|estable|decreciente/);
  });

  test("the page loads the bundle, shows the footer from /cut and no 'Datos de prueba'", async ({ page }) => {
    await page.goto("/observatories/vri-udea/board-1");
    await expect(page.getByText("Datos de ImpactU · capacidad frente a la institución más citada")).toBeVisible({ timeout: 120000 });
    await expect(page.getByText("Datos de prueba")).toHaveCount(0);
    await expect(page.getByText("Fuentes y fechas de corte:")).toBeVisible();
    await expect(page.getByText("Producción por ODS")).toBeVisible();
    await expect(page.locator("body")).not.toContainText("ai_panel_unreviewed");
  });
});
