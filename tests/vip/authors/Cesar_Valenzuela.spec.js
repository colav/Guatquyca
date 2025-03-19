// @ts-check
import { test, expect } from "@playwright/test";

test.describe("Testing Cesar Alonso Valenzuela Toledo profile", () => {
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

    // Fill the search bar with the keyword "Cesar Alonso Valenzuela Toledo".
    await test.step('Fill search bar with "Cesar Alonso Valenzuela Toledo"', async () => {
      await page
        .getByPlaceholder("Búsqueda por palabra clave")
        .pressSequentially('"Cesar Alonso Valenzuela Toledo"');
    });

    // Click on the search button to initiate the search.
    await test.step("Click on search button", async () => {
      await page.getByRole("button", { name: "search" }).click();
    });

    // Verify that the search results contain "Cesar Alonso Valenzuela Toledo".
    await test.step('Verify search results contain "Cesar Alonso Valenzuela Toledo"', async () => {
      await expect(
        page.getByText("Cesar Alonso Valenzuela Toledo").first()
      ).toBeVisible();
    });

    // Click on the link for "Cesar Alonso Valenzuela Toledo" to navigate to his profile page.
    await test.step('Click on "Cesar Alonso Valenzuela Toledo" profile link', async () => {
      await page
        .getByRole("link", { name: "Cesar Alonso Valenzuela Toledo" })
        .first()
        .click();
    });
  });

  test("Cesar Alonso Valenzuela Toledo profile information is complete", async ({
    page,
  }) => {
    // Verify that the profile page for "Cesar Alonso Valenzuela Toledo" is fully loaded by checking for the presence of the projects tab.
    await test.step("Verify 'Proyectos' tab is visible", async () => {
      await expect(page.getByText("Proyectos", { exact: true })).toBeVisible();
    });

    // Ensure the production list is visible and extract the number of products safely
    await test.step("Verify number of products is at least 68 with a 20% error margin", async () => {
      const productsElement = page.getByText(/^\d+ Productos?$/);
      await expect(productsElement).toBeVisible();

      const productsTextContent = await productsElement.textContent();
      const productsNumber = parseInt(
        productsTextContent.match(/(\d+)/)[0],
        10
      );

      const threshold = 68 * 0.8; // 20% error margin
      expect(productsNumber).toBeGreaterThan(threshold);
    });

    // Verify that the list of his affiliations is visible and correct.
    await test.step("Verify affiliations are correct", async () => {
      const affiliations = [
        "Universidad del Valle",
        "Departamento de Fisica",
        "Facultad de Ciencias Naturales y Exactas",
        "Gravitación",
        "Greco",
        "Grupo de Investigación en Relatividad y Gravitación",
        "Universidad Industrial de Santander",
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
    await test.step("Verify CVLAC link with COD_RH: 0000706663, is correct", async () => {
      await expect(
        page.locator(
          `a[href="https://scienti.minciencias.gov.co/cvlac/visualizador/generarCurriculoCv.do?cod_rh=0000706663"]`
        )
      ).toBeVisible();
    });

    // Verify that the ORCID link with his ID is visible and correct.
    await test.step("Verify ORCID link with ID: 0000-0002-6380-2778, is correct", async () => {
      await expect(
        page.locator(`a[href="https://orcid.org/0000-0002-6380-2778"]`)
      ).toBeVisible();
    });

    // Verify that the Scopus link with his ID is visible and correct.
    await test.step("Verify Scopus link with ID 25650635800, is correct", async () => {
      await expect(
        page.locator(
          `a[href="https://www.scopus.com/authid/detail.uri?authorId=25650635800"]`
        )
      ).toBeVisible();
    });

    // Verify that the Google Scholar link with his ID is visible and correct.
    await test.step("Verify Google Scholar link with ID: J89OrSkAAAAJ, is correct", async () => {
      await expect(
        page.locator(
          `a[href="https://scholar.google.com/citations?user=J89OrSkAAAAJ"]`
        )
      ).toBeVisible();
    });

    // Verify that the OpenAlex link no matter the ID, is visible.
    await test.step("Verify that the OpenAlex link no matter the ID, is visible.", async () => {
      await expect(page.locator("#external-profiles-OpenAlex")).toBeVisible();
    });
  });
});
