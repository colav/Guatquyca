/* Board 1: the source of the data (?source=mock) survives a change of filters. Needs the dev server of Luis (D-100) and mock-data/. */
import { test, expect } from "@playwright/test";

test("a filter change keeps ?source=mock in the URL (it does not flip to the API)", async ({ page }) => {
  await page.goto("/observatories/vri-udea/board-1?source=mock");
  await expect(page.getByText("Datos de prueba · métrica de liderazgo")).toBeVisible({ timeout: 120000 });
  await page.getByText("Subcampos", { exact: true }).click();
  await expect(page).toHaveURL(/dimension=subfield/, { timeout: 5000 });
  await expect(page).toHaveURL(/source=mock/);
  // The artifact has no axis–work pairs: the control of confidence is not shown and the tag stays.
  await expect(page.getByText("Confianza de la asignación a ejes")).toHaveCount(0);
  await expect(page.getByText("Datos de prueba · métrica de liderazgo")).toBeVisible();
});
