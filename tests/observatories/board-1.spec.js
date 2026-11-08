/* Page tests of the observatories (they use the dev server of Luis on localhost:3000, D-100). */
import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000";

test.beforeEach(async () => {
  let up = true;
  try {
    await fetch(BASE, { method: "HEAD", signal: AbortSignal.timeout(3000) });
  } catch {
    up = false;
  }
  test.skip(!up, "Nothing listens on localhost:3000: ask Luis to start `npm run dev`.");
});

test("the home lists the VRI-UdeA observatory", async ({ page }) => {
  await page.goto("/observatories");
  await expect(page.getByRole("heading", { name: "Observatorios" })).toBeVisible();
  await expect(page.getByText("VRI-UdeA").first()).toBeVisible();
});

test("the cover has three tabs, loads the first board and keeps the filters of each board apart", async ({ page }) => {
  await page.goto("/observatories/vri-udea?source=mock");
  const tabs = page.getByRole("tab");
  await expect(tabs).toHaveText(["Masa crítica temática", "Colaboración, redes y hélices", "Capacidades de base UdeA"]);
  await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
  await expect(page.getByText("Tablero 1")).toHaveCount(0);
  await expect(page.getByText("Datos de prueba · métrica de liderazgo")).toBeVisible({ timeout: 60000 });
  await page.goto("/observatories/vri-udea/board-1?doc=CONPES%204144");
  await page.getByRole("tab", { name: "Colaboración, redes y hélices" }).click();
  await expect(page).toHaveURL(/board-2$/, { timeout: 60000 });
  await page.getByRole("tab", { name: "Capacidades de base UdeA" }).click();
  await expect(page).toHaveURL(/board-3$/, { timeout: 60000 });
  await expect(page.getByRole("heading", { name: "Capacidades de base del sistema: talento, producción e infraestructura" })).toBeVisible({ timeout: 60000 });
});

test("Board 1 loads the test data and a filter applies at once and goes to the URL", async ({ page }) => {
  await page.goto("/observatories/vri-udea/board-1?source=mock");
  await expect(page.getByText("Datos de prueba · métrica de liderazgo")).toBeVisible({ timeout: 60000 });
  await expect(page.getByText(/Datos consultados en octubre de 2026|Fuentes y fechas de corte/).first()).toBeVisible();
  await expect(page.getByText("41.653", { exact: false }).first()).toBeVisible();
  await page.getByText("Subcampos", { exact: true }).click();
  await expect(page).toHaveURL(/dimension=subfield/, { timeout: 5000 });
  await expect(page.getByText("Subcampos con producción")).toBeVisible();
  await expect(page.getByRole("button", { name: "Aplicar" })).toHaveCount(0);
});

test("the filters are read from the URL", async ({ page }) => {
  await page.goto("/observatories/vri-udea/board-1?dimension=field&rule=slope");
  await expect(page.getByText("Campos con producción")).toBeVisible({ timeout: 60000 });
});

test("the evidence state is not named in any screen", async ({ page }) => {
  await page.goto("/observatories/vri-udea/board-1?source=mock");
  await expect(page.getByText("Datos de prueba")).toBeVisible({ timeout: 60000 });
  await expect(page.locator("body")).not.toContainText("ai_panel_unreviewed");
});

test("the pages use the full width up to 1,920 px, centered", async ({ page }) => {
  for (const [width, expected] of [[1400, 1400], [2400, 1920]]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/observatories");
    const box = await page.locator("main").first().boundingBox();
    expect(Math.round(box.width)).toBeGreaterThanOrEqual(expected - 40) /* the site container keeps 15 px per side */;
    expect(Math.round(box.width)).toBeLessThanOrEqual(expected);
    if (width > 1920) expect(Math.round(box.x)).toBeGreaterThan(200);
  }
});
