// @ts-check
const { test, expect } = require("@playwright/test");

test.describe("navigation", () => {
  test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test to ensure a fresh state.
    await page.goto("/");

    // Click on the modal button to close it, ensuring the home page is accessible for testing.
    await page.getByRole("button", { name: "Probar versión beta" }).click();
  });

  test("has title", async ({ page }) => {
    // Verify the page title contains "ImpactU" to ensure correct page is loaded.
    await expect(page).toHaveTitle(/ImpactU/);
  });

  test("has welcome heading", async ({ page }) => {
    // Check for the visibility of the welcome heading to confirm the page is correctly rendered.
    await page
      .getByRole("heading", { name: "Bienvenido a ImpactU" })
      .isVisible();
  });

  test("has manual download button", async ({ page }) => {
    // Prepare to capture the download event before triggering the download by clicking the link.
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("link", { name: "Descarga nuestro manual" }).click();

    // Wait for the download to start or complete, ensuring the file begins downloading.
    const download = await downloadPromise;

    // Verify the downloaded file's name matches the expected PDF filename.
    expect(await download.suggestedFilename()).toBe("Manual ImpactU.pdf");
  });
});
