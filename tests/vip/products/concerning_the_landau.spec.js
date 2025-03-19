// @ts-check
import { test, expect } from "@playwright/test";

test.describe("'Concerning the Landau pole...' article information is complete", () => {
  test("'Concerning the Landau pole...' article information is complete", async ({
    page,
  }) => {
    // Navigate to the home page
    await page.goto("/");

    // Select "Productos" from the prefilter dropdown
    await test.step("Select 'Productos' from the prefilter dropdown", async () => {
      await page.getByTitle("Autor").click();
      await page
        .getByTitle("Productos", { exact: true })
        .locator("div")
        .click();
    });

    // Search for the specific article
    await test.step("Search for 'Concerning the Landau pole in 3-3-1 models' using the search bar", async () => {
      const searchInput = page.getByPlaceholder("Búsqueda por palabra clave");
      await searchInput.pressSequentially(
        '"Concerning the Landau pole in 3-3-1 models"'
      );
      await page.getByRole("button", { name: "search" }).click();
    });

    // Verify the search result is visible and click it
    await test.step("Verify that the search result for the article appears and click to open the details modal", async () => {
      const articleTitle = "Concerning the Landau pole in 3-3-1 models";
      await expect(page.getByText(articleTitle).nth(0)).toBeVisible();
      await page
        .getByText("Concerning the Landau pole in 3-3-1 models")
        .nth(0)
        .click();
    });

    // Handle any dialog that appears
    page.on("dialog", (dialog) => dialog.accept());

    // Verify the article modal opens correctly
    const modal = page.getByRole("dialog");
    await test.step("Ensure the article details modal opens and displays the expected title", async () => {
      await expect(
        modal.getByText("Concerning the Landau pole in 3-3-1 models")
      ).toBeVisible();
    });

    // Verify that external links (PDF, JSON, HTML) are present
    await test.step("Confirm the presence of external file format links (PDF, JSON, and HTML) within the modal", async () => {
      const links = ["file-pdf PDF", "file-text JSON", "desktop HTML"];
      for (const link of links) {
        await expect(page.getByRole("link", { name: link })).toBeVisible();
      }
    });

    // Verify author list
    await test.step("Check that the listed authors match the expected names, ignoring accents and sorting alphabetically", async () => {
      const expectedAuthors = [
        "alex g dias",
        "roberto enrique martinez martinez",
        "v pleitez",
      ].sort();

      const authorList = await modal
        .locator('button[type="button"]')
        .evaluateAll((buttons) =>
          buttons
            .map((btn) => btn.textContent?.trim().toLowerCase())
            .filter((text) => text && text !== "ver más." && text !== "cerrar")
            .map((text) =>
              text.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            ) // Remove accents
            .sort()
        );

      expect(authorList).toEqual(expectedAuthors);
    });

    // Verify publication date
    await test.step("Ensure the publication date is correctly displayed as 'Publicado: 2004' in the article modal", async () => {
      await expect(modal.getByText("Publicado: 2004")).toBeVisible();
    });

    // Verify OpenAlex citation count
    await test.step("Check that the OpenAlex citation count is displayed and that at least two citation elements exist", async () => {
      const citations = await modal.locator('img[alt^="Citations:"]').all();
      if (citations.length < 2)
        throw new Error("Less than 2 citation elements found.");

      const altText = await citations[1].getAttribute("alt");
      const citationCount = parseInt(
        altText?.match(/Citations: (\d+)/)?.[1],
        10
      );
      expect(citationCount).toBeGreaterThanOrEqual(97);
    });

    // Verify DOI link
    await test.step("Verify that the DOI link (https://doi.org/10.1140/epjc/s2004-02083-0) is present in the modal", async () => {
      await expect(
        modal
          .locator('a[href="https://doi.org/10.1140/epjc/s2004-02083-0"]')
          .nth(1)
      ).toBeVisible();
    });

    // Verify external research links
    const externalLinks = ["Scholar URL", "OpenAlex URL", "Perfil OpenAlex"];
    await test.step("Confirm the presence of external research profile links (Scholar, OpenAlex, Perfil OpenAlex)", async () => {
      for (const link of externalLinks) {
        await expect(modal.getByText(link)).toBeVisible();
      }
    });

    // Verify journal information
    await test.step("Check that the correct journal name ('The European Physical Journal C') is displayed", async () => {
      await expect(
        modal.getByText("The European Physical Journal C", {
          exact: true,
        })
      ).toBeVisible();
    });
  });
});
