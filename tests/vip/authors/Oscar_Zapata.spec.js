// @ts-check
import { test, expect } from "@playwright/test";

test.describe("Testing Oscar Alberto Zapata Noreña profile", () => {
  test.beforeEach(async ({ page }) => {
    // Listen for all console messages in the browser
    page.on("console", (msg) => {
      if (msg.type() === "log") {
        console.log(`${msg.text()}`);
      }
    });

    // Navigate to the home page before each test to ensure a consistent starting point.
    await test.step("Navigate to the homepage", async () => {
      await page.goto("/");
    });

    // Fill the search bar with the keyword "Oscar Alberto Zapata Noreña".
    await test.step('Fill search bar with "Oscar Alberto Zapata Noreña"', async () => {
      await page
        .getByPlaceholder("Búsqueda por palabra clave")
        .pressSequentially('"Oscar Alberto Zapata Noreña"');
    });

    // Click on the search button to initiate the search.
    await test.step("Click on search button", async () => {
      await page.getByRole("button", { name: "search" }).click();
    });

    // Verify that the search results contain "Oscar Alberto Zapata Noreña".
    await test.step('Verify search results contain "Oscar Alberto Zapata Noreña"', async () => {
      await expect(
        page.getByText("Oscar Alberto Zapata Noreña").first()
      ).toBeVisible();
    });

    // Click on the link for "Oscar Alberto Zapata Noreña" to navigate to his profile page.
    await test.step('Click on "Oscar Alberto Zapata Noreña" profile link', async () => {
      await page
        .getByRole("link", {
          name: "Oscar Alberto Zapata Noreña",
        })
        .first()
        .click();
    });
  });

  test("Oscar Alberto Zapata Noreña profile information is complete", async ({
    page,
  }) => {
    // Verify that the profile page for "Oscar Alberto Zapata Noreña" is fully loaded by checking for the presence of the projects tab.
    await test.step("Verify 'Proyectos' tab is visible", async () => {
      await expect(page.getByText("Proyectos", { exact: true })).toBeVisible();
    });

    // Ensure the production list is visible and extract the number of products safely
    await test.step("Verify number of products is at least 254 with a 20% error margin", async () => {
      const productsElement = page.getByText(/^\d+ Productos?$/);
      await expect(productsElement).toBeVisible();

      const productsTextContent = await productsElement.textContent();
      const productsNumber = parseInt(
        productsTextContent.match(/(\d+)/)[0],
        10
      );

      const threshold = 92 * 0.8; // 20% error margin
      expect(productsNumber).toBeGreaterThan(threshold);
    });

    // Verify that the list of his affiliations is visible and correct.
    await test.step("Verify affiliations are correct", async () => {
      const affiliations = [
        "Universidad de Antioquia",
        "Instituto de Física",
        "Facultad de Ciencias Exactas y Naturales",
        "Grupo de Fenomenologia de Interacciones Fundamentales",
        "EIA Física Teórica y Aplicada",
        "Universidad EIA",
      ];
      for (const affiliation of affiliations) {
        await test.step(`Verify affiliation: ${affiliation}`, async () => {
          await expect(
            page.getByText(affiliation, { exact: true })
          ).toBeVisible();
        });
      }
    });

    // Verify that the CVLAC link with his cod_rh is visible and correct.
    await test.step("Verify CVLAC link with COD_RH: 0000707619, is correct", async () => {
      await expect(
        page.locator(
          `a[href="https://scienti.minciencias.gov.co/cvlac/visualizador/generarCurriculoCv.do?cod_rh=0000707619"]`
        )
      ).toBeVisible();
    });

    // Verify that the ORCID link with his ID is visible and correct.
    await test.step("Verify ORCID link with ID: 0000-0001-5533-4014, is correct", async () => {
      await expect(
        page.locator(`a[href="https://orcid.org/0000-0001-5533-4014"]`)
      ).toBeVisible();
    });

    // Verify that the OpenAlex link no matter the ID, is visible.
    await test.step("Verify that the OpenAlex link no matter the ID, is visible.", async () => {
      await expect(page.locator("#external-profiles-OpenAlex")).toBeVisible();
    });
  });
});
