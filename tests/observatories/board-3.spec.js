/* Page tests of Board 3 (they use the dev server of Luis on localhost:3000, D-100). */
import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000";
const ROUTE = "/observatories/vri-udea/board-3";

test.beforeEach(async () => {
  let up = true;
  try {
    await fetch(BASE, { method: "HEAD", signal: AbortSignal.timeout(3000) });
  } catch {
    up = false;
  }
  test.skip(!up, "Nothing listens on localhost:3000: ask Luis to start `npm run dev`.");
});

test("Board 3 loads the test data, shows its panels and never the retired one or names", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const requests = [];
  page.on("request", (r) => { if (r.url().endsWith("/data")) requests.push(new URL(r.url()).pathname); });
  await page.goto(ROUTE);
  await expect(page.getByText("01 · Talento investigador por nivel")).toBeVisible({ timeout: 120000 });
  await expect(page.getByText("83.161 productos · 32.509 autores UdeA")).toBeVisible();
  for (const title of ["02 · Investigadores activos", "08 · Tesis", "11 · Profesores con productos compartidos", "17 · Acceso abierto", "18 · Cobertura", "c · Profesores por tipo de producto"]) {
    await expect(page.getByText(title, { exact: false }).first()).toBeVisible();
  }
  /* Panel 9 (Ondas) is retired; the cut-off footer and the provisional labels are visible; the evidence state is never named. */
  const text = await page.locator("main").innerText();
  expect(text).not.toMatch(/Ondas/);
  expect(text).not.toMatch(/ai_panel/);
  expect(text).not.toMatch(/Tablero \d/);
  expect(text).toContain("Datos consultados en octubre de 2026.");
  expect(text).toContain("provisional: se reemplazará por el nivel de formación de la planta");
  expect(text).toContain("profesores según la tabla de personal anterior");
  expect(requests).toEqual([`${ROUTE}/data`]);
  expect(errors).toEqual([]);
});

test("a filter in the URL applies and a change goes to the URL (rebound of 200 ms)", async ({ page }) => {
  await page.goto(`${ROUTE}?doc=1`);
  await expect(page.getByText("44.444 productos · 25.761 autores UdeA")).toBeVisible({ timeout: 120000 });
  await page.getByRole("button", { name: "Limpiar filtros" }).click();
  await expect(page.getByText("83.161 productos · 32.509 autores UdeA")).toBeVisible({ timeout: 10000 });
  await expect(page).not.toHaveURL(/doc=/);
});

test("the page uses the width up to 1,920 px", async ({ page }) => {
  await page.setViewportSize({ width: 2400, height: 1000 });
  await page.goto(ROUTE);
  await expect(page.getByText("01 · Talento investigador por nivel")).toBeVisible({ timeout: 120000 });
  const box = await page.locator("main").first().boundingBox();
  expect(box.width).toBeLessThanOrEqual(1920);
  expect(box.width).toBeGreaterThan(1800);
});
