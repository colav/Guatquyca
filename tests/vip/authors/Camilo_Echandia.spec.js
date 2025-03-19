// @ts-check
import { test, expect } from "@playwright/test";

test.describe("Testing Camilo Echandia Castilla profile", () => {
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

    // Fill the search bar with the keyword "Camilo Echandia Castilla".
    await test.step('Fill search bar with "Camilo Echandia Castilla"', async () => {
      await page
        .getByPlaceholder("Búsqueda por palabra clave")
        .pressSequentially('"Camilo Echandia Castilla"');
    });

    // Click on the search button to initiate the search.
    await test.step("Click on search button", async () => {
      await page.getByRole("button", { name: "search" }).click();
    });

    // Verify that the search results contain "Camilo Echandia Castilla".
    await test.step('Verify search results contain "Camilo Echandia Castilla"', async () => {
      await expect(
        page.getByText("Camilo Echandia Castilla").first()
      ).toBeVisible();
    });

    // Click on the link for "Camilo Echandia Castilla" to navigate to his profile page.
    await test.step('Click on "Camilo Echandia Castilla" profile link', async () => {
      await page
        .getByRole("link", { name: "Camilo Echandia Castilla" })
        .first()
        .click();
    });
  });

  test("Camilo Echandia Castilla profile information is complete", async ({
    page,
  }) => {
    // Verify that the profile page for "Camilo Echandia Castilla" is fully loaded by checking for the presence of the projects tab.
    await test.step("Verify 'Proyectos' tab is visible", async () => {
      await expect(page.getByText("Proyectos", { exact: true })).toBeVisible();
    });

    // Ensure the production list is visible and extract the number of products safely
    await test.step("Verify number of products is at least 184 with a 20% error margin", async () => {
      const productsElement = page.getByText(/^\d+ Productos?$/);
      await expect(productsElement).toBeVisible();

      const productsTextContent = await productsElement.textContent();
      const productsNumber = parseInt(
        productsTextContent.match(/(\d+)/)[0],
        10
      );

      const threshold = 184 * 0.8; // 20% error margin
      expect(productsNumber).toBeGreaterThan(threshold);
    });

    // Verify that the list of his affiliations is visible and correct.
    await test.step("Verify affiliations are correct", async () => {
      const affiliations = [
        "Universidad Externado de Colombia",
        "Opera",
        "Facultad de Finanzas, Gobierno y Relaciones Internacionales - Cipe",
        "Opera - Observatorio de Políticas, Ejecución y Resultados de la Administración Pública",
        "Oasis - Observatorio de Análisis de los Sistemas Internacionales",
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
    await test.step("Verify CVLAC link with COD_RH: 0000169323, is correct", async () => {
      await expect(
        page.locator(
          `a[href="https://scienti.minciencias.gov.co/cvlac/visualizador/generarCurriculoCv.do?cod_rh=0000169323"]`
        )
      ).toBeVisible();
    });

    // Verify that the ORCID link with his ID is visible and correct.
    await test.step("Verify ORCID link with ID: 0000-0002-6536-9090, is correct", async () => {
      await expect(
        page.locator(`a[href="https://orcid.org/0000-0002-6536-9090"]`)
      ).toBeVisible();
    });

    // Verify that the Scopus link with his ID is visible and correct.
    await test.step("Verify Scopus link with ID 55965548500, is correct", async () => {
      await expect(
        page.locator(
          `a[href="https://www.scopus.com/authid/detail.uri?authorId=55965548500"]`
        )
      ).toBeVisible();
    });

    // Verify that the OpenAlex link no matter the ID, is visible.
    await test.step("Verify that the OpenAlex link no matter the ID, is visible.", async () => {
      await expect(page.locator("#external-profiles-OpenAlex")).toBeVisible();
    });
  });
});
