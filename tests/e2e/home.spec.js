// @ts-check
import { test, expect } from "@playwright/test";

test.describe("Testing ImpactU Homepage", () => {
  test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test to ensure a fresh state.
    await page.goto("/");
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
    // Wait for the popup event when clicking the manual link
    const [popup] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByRole("link", { name: "Descarga nuestro manual" }).click(),
    ]);

    // Verify the new tab's URL is the expected PDF URL
    await expect(popup).toHaveURL("https://data.colav.co/Manual_impactu.pdf");
  });
  // Verify the Scroll to Top button is visible when the page is at the bottom.
  test("scroll to top button is working", async ({ page }) => {
    // Scroll the footer into view, forcing the button "Scroll to Top" to appear.
    await page.getByText("Fundadores:").scrollIntoViewIfNeeded();
    await page.getByRole("button", { name: "vertical-align-top" }).click();

    // Check if the page has scrolled to the top
    // Wait for the text to be visible on the screen
    await expect(
      page.getByText("La información puede ser consultada por autores")
    ).toBeInViewport();
  });
});
