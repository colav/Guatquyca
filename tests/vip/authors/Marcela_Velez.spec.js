// @ts-check
import { test, expect } from "@playwright/test";

test.describe("Testing Claudia Marcela Vélez profile", () => {
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

    // Fill the search bar with the keyword "Claudia Marcela Velez".
    await test.step('Fill search bar with "Claudia Marcela Velez"', async () => {
      await page
        .getByPlaceholder("Búsqueda por palabra clave")
        .pressSequentially('"Claudia Marcela Velez"');
    });

    // Click on the search button to initiate the search.
    await test.step("Click on search button", async () => {
      await page.getByRole("button", { name: "search" }).click();
    });

    // Verify that the search results contain "Claudia Marcela Velez".
    await test.step('Verify search results contain "Claudia Marcela Velez"', async () => {
      await expect(
        page.getByText("Claudia Marcela Velez").first()
      ).toBeVisible();
    });

    // Click on the link for "Claudia Marcela Velez" to navigate to her profile page.
    await test.step('Click on "Claudia Marcela Velez" profile link', async () => {
      await page
        .getByRole("link", { name: "Claudia Marcela Velez" })
        .first()
        .click();
    });
  });

  test("Claudia Marcela Velez profile information is complete", async ({
    page,
  }) => {
    // Verify that the profile page for "Claudia Marcela Velez" is fully loaded by checking for the presence of the projects tab.
    await test.step("Verify 'Proyectos' tab is visible", async () => {
      await expect(page.getByText("Proyectos", { exact: true })).toBeVisible();
    });

    // Ensure the production list is visible and extract the number of products safely
    await test.step("Verify number of products is at least 117 with a 20% error margin", async () => {
      const productsElement = page.getByText(/^\d+ Productos?$/);
      await expect(productsElement).toBeVisible();

      const productsTextContent = await productsElement.textContent();
      const productsNumber = parseInt(
        productsTextContent.match(/(\d+)/)[0],
        10
      );

      const threshold = 117 * 0.8; // 20% error margin
      expect(productsNumber).toBeGreaterThan(threshold);
    });

    // Verify that the list of her affiliations is visible and correct.
    await test.step("Verify affiliations are correct", async () => {
      const affiliations = [
        "Universidad de Antioquia",
        "Departamento de Pediatría y Puericultura",
        "Facultad de Medicina",
        "Centro de Investigaciones Médicas",
        "Grupo Académico de Epidemiología Clínica",
        "Grupo de Investigación Clínica en Enfermedades del Niño y del Adolescente - Pediaciencias",
        "Rehabilitación en Salud",
      ];
      for (const affiliation of affiliations) {
        await test.step(`Verify affiliation: ${affiliation}`, async () => {
          await expect(
            page.getByText(affiliation, { exact: true })
          ).toBeVisible();
        });
      }
    });

    // Verify that the CVLAC link with her cod_rh is visible and correct.
    await test.step("Verify CVLAC link with COD_RH: 0001385569, is correct", async () => {
      await expect(
        page.locator(
          `a[href="https://scienti.minciencias.gov.co/cvlac/visualizador/generarCurriculoCv.do?cod_rh=0001385569"]`
        )
      ).toBeVisible();
    });

    // Verify that the ORCID link with her ID is visible and correct.
    await test.step("Verify ORCID link with ID: 0000-0002-7093-2634, is correct", async () => {
      await expect(
        page.locator(`a[href="https://orcid.org/0000-0002-7093-2634"]`)
      ).toBeVisible();
    });

    // Verify that the Scopus link with her ID is visible and correct.
    await test.step("Verify Scopus link with ID 55325137900, is correct", async () => {
      await expect(
        page.locator(
          `a[href="https://www.scopus.com/authid/detail.uri?authorId=55325137900"]`
        )
      ).toBeVisible();
    });

    // Verify that the Google Scholar link with her ID is visible and correct.
    await test.step("Verify Google Scholar link with ID: RuclEJkAAAAJ, is correct", async () => {
      await expect(
        page.locator(
          `a[href="https://scholar.google.com/citations?user=RuclEJkAAAAJ"]`
        )
      ).toBeVisible();
    });

    // Verify that the OpenAlex link no matter the ID, is visible.
    await test.step("Verify that the OpenAlex link no matter the ID, is visible.", async () => {
      await expect(page.locator("#external-profiles-OpenAlex")).toBeVisible();
    });
  });
});
