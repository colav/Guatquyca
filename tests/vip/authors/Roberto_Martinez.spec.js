// @ts-check
import { test, expect } from "@playwright/test";

test.describe("Testing Roberto Martínez Vélez profile", () => {
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

    // Fill the search bar with the keyword "Roberto Enrique Martínez Martínez".
    await test.step('Fill search bar with "Roberto Enrique Martínez Martínez"', async () => {
      await page
        .getByPlaceholder("Búsqueda por palabra clave")
        .pressSequentially('"Roberto Enrique Martínez Martínez"');
    });

    // Click on the search button to initiate the search.
    await test.step("Click on search button", async () => {
      await page.getByRole("button", { name: "search" }).click();
    });

    // Verify that the search results contain "Roberto Enrique Martínez Martínez".
    await test.step('Verify search results contain "Roberto Enrique Martínez Martínez"', async () => {
      await expect(
        page.getByText(/Roberto Enrique Mart(i|í)nez Mart(i|í)nez/i).first()
      ).toBeVisible();
    });

    // Click on the link for "Roberto Enrique Martínez Martínez" to navigate to his profile page.
    await test.step('Click on "Roberto Enrique Martínez Martínez" profile link', async () => {
      await page
        .getByRole("link", {
          name: /Roberto Enrique Mart(i|í)nez Mart(i|í)nez/i,
        })
        .first()
        .click();
    });
  });

  test("Roberto Enrique Martínez Martínez profile information is complete", async ({
    page,
  }) => {
    // Verify that the profile page for "Roberto Enrique Martínez Martínez" is fully loaded by checking for the presence of the projects tab.
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

      const threshold = 254 * 0.8; // 20% error margin
      expect(productsNumber).toBeGreaterThan(threshold);
    });

    // Verify that the list of his affiliations is visible and correct.
    await test.step("Verify affiliations are correct", async () => {
      const affiliations = [
        "Universidad Nacional de Colombia",
        "Grupo de Física Teórica de Altas Energías",
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
    await test.step("Verify CVLAC link with COD_RH: 0000066214, is correct", async () => {
      await expect(
        page.locator(
          `a[href="https://scienti.minciencias.gov.co/cvlac/visualizador/generarCurriculoCv.do?cod_rh=0000066214"]`
        )
      ).toBeVisible();
    });

    // Temporary deactivation of the following tests due to lack of information in the profile
    /* // Verify that the OpenAlex link no matter the ID, is visible.
    await test.step("Verify that the OpenAlex link no matter the ID, is visible.", async () => {
      await expect(page.locator("#external-profiles-OpenAlex")).toBeVisible();
    }); */
  });
});
