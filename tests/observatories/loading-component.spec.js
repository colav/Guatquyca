/*
 * The three boards, while they wait for their bundle, show the loading component of the site («Cargando información...», spinner of ImpactU)
 * and never the skeleton of Ant Design. The bundle is delayed on purpose. Needs the dev server of Luis on 3000.
 */
import { test, expect } from "@playwright/test";

test.beforeAll(async () => {
  let up = true;
  try {
    await fetch("http://localhost:3000/observatories");
  } catch {
    up = false;
  }
  test.skip(!up, "Nothing listens on localhost:3000: ask Luis to start `npm run dev`.");
});

for (const board of [1, 2, 3]) {
  test(`board ${board}: the site's loading component while the bundle arrives, no Ant skeleton`, async ({ page }) => {
    test.setTimeout(150000);
    await page.route("**/observatories/vri-udea/boards/*/bundle*", async (route) => {
      await new Promise((r) => setTimeout(r, 4000));
      await route.continue();
    });
    await page.goto(`/observatories/vri-udea/board-${board}`);
    await expect(page.getByText("Cargando información...")).toBeVisible({ timeout: 20000 });
    await expect(page.getByAltText("Spinner Logo of ImpactU")).toBeVisible();
    await expect(page.locator(".ant-skeleton")).toHaveCount(0);
    /* then the board loads */
    await expect(page.getByTestId("method-notes")).toBeVisible({ timeout: 120000 });
    await expect(page.getByText("Cargando información...")).toHaveCount(0);
  });
}
