/* Page tests of Board 2 (they use the dev server of Luis on localhost:3000, D-100). */
import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000";
const PATH = "/observatories/vri-udea/board-2";

test.beforeEach(async () => {
  let up = true;
  try {
    await fetch(BASE, { method: "HEAD", signal: AbortSignal.timeout(3000) });
  } catch {
    up = false;
  }
  test.skip(!up, "Nothing listens on localhost:3000: ask Luis to start `npm run dev`.");
});

test("Board 2 loads the test data with the KPIs of the artifact and no 'Aplicar' button", async ({ page }) => {
  await page.goto(PATH);
  await expect(page.getByRole("heading", { name: "Colaboración, redes y hélices" }).first()).toBeVisible({ timeout: 90000 });
  await expect(page.getByText("51.093", { exact: false }).first()).toBeVisible();
  await expect(page.getByText("Datos de prueba · ensayo con limitaciones de datos")).toBeVisible();
  await expect(page.getByText("Datos consultados en octubre de 2026.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Aplicar" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Limpiar filtros" })).toBeVisible();
});

test("a filter applies at once and goes to the URL; the URL is read on load", async ({ page }) => {
  await page.goto(`${PATH}?from=2018&to=2022&scope=int`);
  await expect(page.getByText("5.115").first()).toBeVisible({ timeout: 90000 }); // numbers of the original page for that state
  await page.getByRole("button", { name: "Limpiar filtros" }).click();
  await expect(page).not.toHaveURL(/from=/, { timeout: 5000 });
  await expect(page.getByText("51.093").first()).toBeVisible();
});

test("the panels of the artifact are present and the evidence state is not named", async ({ page }) => {
  await page.goto(PATH);
  await expect(page.getByText("02 · Grafo de colaboración entre grupos")).toBeVisible({ timeout: 90000 });
  for (const title of ["01 · Transdisciplinariedad grupal", "10 · Colaboración internacional", "13 · Grupos de investigación con actores no académicos", "14 · Ejes Temáticos públicos por tipo de organización"]) {
    await expect(page.getByText(title, { exact: false }).first()).toBeVisible();
  }
  await expect(page.locator("body")).not.toContainText("ai_panel_unreviewed");
});
