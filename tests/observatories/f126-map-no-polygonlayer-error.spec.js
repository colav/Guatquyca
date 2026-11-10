/*
 * F126 (D-268): the map of the subregions (T1 panel 8) must not throw the exception of PolygonLayer
 * («Cannot read properties of undefined (reading 'enableRelativeCoordinates')», @antv/l7-layers 2.23.2).
 * E2E_LIVE=1 reads the real quyca and the dev server.
 */
import { test, expect } from "@playwright/test";

const LIVE = !!process.env.E2E_LIVE;
const L7 = /enableRelativeCoordinates/;

const watch = (page) => {
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text().slice(0, 300)); });
  page.on("pageerror", (e) => errors.push(`pageerror: ${String(e.message).slice(0, 300)}`));
  return errors;
};

test.describe("F126 map without PolygonLayer exception (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("board 1 loaded four times in a row: 0 exceptions of PolygonLayer; the map draws", async ({ page }) => {
    test.setTimeout(400000);
    const errors = watch(page);
    for (let i = 0; i < 4; i += 1) {
      await page.goto("/observatories/vri-udea/board-1");
      await page.getByTestId("method-notes").waitFor({ timeout: 150000 });
      await page.getByTestId("subregion-map").scrollIntoViewIfNeeded();
      await page.waitForTimeout(6000);
      await expect(page.getByTestId("subregion-map").locator("canvas").first()).toBeAttached();
    }
    expect(errors.filter((e) => L7.test(e)), "PolygonLayer exceptions").toEqual([]);
  });

  test("/observatories → board 1 → /observatories: no PolygonLayer exception", async ({ page }) => {
    test.setTimeout(300000);
    const errors = watch(page);
    await page.goto("/observatories");
    await page.getByTestId("board-link-board-1").click();
    await page.getByTestId("method-notes").waitFor({ timeout: 150000 });
    await page.getByTestId("subregion-map").scrollIntoViewIfNeeded();
    await page.waitForTimeout(6000);
    await page.goto("/observatories");
    await page.waitForTimeout(3000);
    expect(errors.filter((e) => L7.test(e)), "PolygonLayer exceptions").toEqual([]);
  });

  test("safety net: a failure of the map shows the message with «Reintentar», one console.error, and the retry draws the map again", async ({ page }) => {
    test.setTimeout(300000);
    const errors = watch(page);
    await page.goto("/observatories/vri-udea/board-1");
    await page.getByTestId("method-notes").waitFor({ timeout: 150000 });
    await page.getByTestId("subregion-map").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("subregion-map").locator("canvas").first()).toBeAttached({ timeout: 60000 });
    await page.evaluate(() => {
      const error = new Error("boom of the test");
      error.stack = "Error: boom of the test\n    at x (webpack-internal:///./node_modules/@antv/l7-layers/es/core/BaseLayer.js:1:1)";
      window.dispatchEvent(new ErrorEvent("error", { error, message: error.message, cancelable: true }));
    });
    await expect(page.getByTestId("map-error")).toBeVisible();
    await expect(page.getByTestId("map-error")).toContainText("No se pudo dibujar el mapa");
    expect(errors.filter((e) => /MapChart\] the map could not be drawn/.test(e))).toHaveLength(1);
    await page.getByTestId("map-error").getByRole("button", { name: "Reintentar" }).click();
    await expect(page.getByTestId("map-error")).toHaveCount(0);
    await expect(page.getByTestId("subregion-map").locator("canvas").first()).toBeAttached({ timeout: 60000 });
    expect(errors.filter((e) => L7.test(e)), "PolygonLayer exceptions").toEqual([]);
  });
});
