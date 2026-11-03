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

test("the cover shows Board 1 active and Boards 2 and 3 as coming soon", async ({ page }) => {
  await page.goto("/observatories/vri-udea");
  await expect(page.getByRole("link", { name: "Abrir tablero" })).toHaveCount(1);
  await expect(page.getByText("Próximamente")).toHaveCount(2);
});

test("Board 1 loads the test data and a filter applies at once and goes to the URL", async ({ page }) => {
  await page.goto("/observatories/vri-udea/board-1");
  await expect(page.getByText("Datos de prueba · métrica de liderazgo provisional")).toBeVisible({ timeout: 60000 });
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
  await page.goto("/observatories/vri-udea/board-1");
  await expect(page.getByText("Datos de prueba")).toBeVisible({ timeout: 60000 });
  await expect(page.locator("body")).not.toContainText("ai_panel_unreviewed");
});
