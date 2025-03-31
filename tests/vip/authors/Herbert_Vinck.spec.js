// @ts-check
import { test, expect } from "@playwright/test";

test.describe("Testing Herbert Vinck Posada profile", () => {
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

    // Fill the search bar with the keyword "Herbert Vinck Posada".
    await test.step('Fill search bar with "Herbert Vinck Posada"', async () => {
      await page
        .getByPlaceholder("Búsqueda por palabra clave")
        .pressSequentially('"Herbert Vinck Posada"');
    });

    // Click on the search button to initiate the search.
    await test.step("Click on search button", async () => {
      await page.getByRole("button", { name: "search" }).click();
    });

    // Verify that the search results contain "Herbert Vinck Posada".
    await test.step('Verify search results contain "Herbert Vinck Posada"', async () => {
      await expect(
        page.getByText("Herbert Vinck Posada").first()
      ).toBeVisible();
    });

    // Click on the link for "Herbert Vinck Posada" to navigate to his profile page.
    await test.step('Click on "Herbert Vinck Posada" profile link', async () => {
      await page
        .getByRole("link", { name: "Herbert Vinck Posada" })
        .first()
        .click();
    });
  });

  test("Herbert Vinck Posada profile information is complete", async ({
    page,
  }) => {
    // Verify that the profile page for "Herbert Vinck Posada" is fully loaded by checking for the presence of the projects tab.
    await test.step("Verify 'Proyectos' tab is visible", async () => {
      await expect(page.getByText("Proyectos", { exact: true })).toBeVisible();
    });

    // Ensure the production list is visible and extract the number of products safely
    await test.step("Verify number of products is at least 323 with a 20% error margin", async () => {
      const productsElement = page.getByText(/^\d+ Productos?$/);
      await expect(productsElement).toBeVisible();

      const productsTextContent = await productsElement.textContent();
      const productsNumber = parseInt(
        productsTextContent.match(/(\d+)/)[0],
        10
      );

      const threshold = 323 * 0.8; // 20% error margin
      expect(productsNumber).toBeGreaterThan(threshold);
    });

    // Verify that the list of his affiliations is visible and correct.
    await test.step("Verify affiliations are correct", async () => {
      const affiliations = [
        "Universidad de Antioquia",
        "Instituto de Física",
        "Facultad de Ciencias Exactas y Naturales",
        "Grupo de Fisica Atomica y Molecular",
        "Grupo de Óptica e Información Cuántica",
        "Universidad Nacional de Colombia",
        "Enseñanza, conceptos y métodos en física",
        "Superconductividad y nanotecnología",
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
    await test.step("Verify CVLAC link with COD_RH: 0000178624, is correct", async () => {
      await expect(
        page.locator(
          `a[href="https://scienti.minciencias.gov.co/cvlac/visualizador/generarCurriculoCv.do?cod_rh=0000178624"]`
        )
      ).toBeVisible();
    });

    // Verify that the ORCID link with his ID is visible and correct.
    await test.step("Verify ORCID link with ID: 0000-0002-4771-1526, is correct", async () => {
      await expect(
        page.locator(`a[href="https://orcid.org/0000-0002-4771-1526"]`)
      ).toBeVisible();
    });

    // Verify that the Scopus link with his ID is visible and correct.
    await test.step("Verify Scopus link with ID 8357224800, is correct", async () => {
      await expect(
        page.locator(
          `a[href="https://www.scopus.com/authid/detail.uri?authorId=8357224800"]`
        )
      ).toBeVisible();
    });

    // Verify that the Google Scholar link with his ID is visible and correct.
    await test.step("Verify Google Scholar link with ID: PrGy6_IAAAAJ, is correct", async () => {
      await expect(
        page.locator(
          `a[href="https://scholar.google.com/citations?user=PrGy6_IAAAAJ"]`
        )
      ).toBeVisible();
    });

    // Verify that the OpenAlex link no matter the ID, is visible.
    await test.step("Verify that the OpenAlex link no matter the ID, is visible.", async () => {
      await expect(page.locator("#external-profiles-OpenAlex")).toBeVisible();
    });
  });
});
