// @ts-check
import { test, expect } from "@playwright/test";

test.describe("'Determination of the IMF...' article information is complete", () => {
  test("'Determination of the IMF...' article information is complete", async ({
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
    await test.step("Search for 'Determination of the IMF in the LMC stellar cluster NGC 2156' using the search bar", async () => {
      const searchInput = page.getByPlaceholder("Búsqueda por palabra clave");
      await searchInput.pressSequentially(
        '"Determination of the IMF in the LMC stellar cluster NGC 2156"'
      );
      await page.getByRole("button", { name: "search" }).click();
    });

    // Verify the search result is visible and click it
    await test.step("Verify that the search result for the article appears and click to open the details modal", async () => {
      const articleTitle =
        "Determination of the IMF in the LMC stellar cluster NGC 2156";
      await expect(page.getByText(articleTitle).nth(0)).toBeVisible({
        timeout: 30000,
      });
      await page
        .getByText(
          "Determination of the IMF in the LMC stellar cluster NGC 2156"
        )
        .nth(0)
        .click();
    });

    // Handle any dialog that appears
    page.on("dialog", (dialog) => dialog.accept());

    // Verify the article modal opens correctly
    const modal = page.getByRole("dialog");
    await test.step("Ensure the article details modal opens and displays the expected title", async () => {
      await expect(
        modal.getByText(
          "Determination of the IMF in the LMC stellar cluster NGC 2156"
        )
      ).toBeVisible();
    });

    // Verify that external links (JSON) are present
    await test.step("Confirm the presence of external file format links (JSON) within the modal", async () => {
      const links = ["file-text JSON"];
      for (const link of links) {
        await expect(page.getByRole("link", { name: link })).toBeVisible();
      }
    });

    // Verify author list
    await test.step("Check that the listed authors match the expected names, ignoring accents and sorting alphabetically", async () => {
      const expectedAuthors = [
        "esteban silva villa",
        "marco sirianni",
        "jorge ivan zuluaga callejas",
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
    await test.step("Ensure the publication date is correctly displayed as 'Publicado: 2008' in the article modal", async () => {
      await expect(modal.getByText("Publicado: 2008")).toBeVisible();
    });

    // Verify OpenAlex citation count
    await test.step("Check that the OpenAlex citation count is displayed and that at least one citation elements exist", async () => {
      const citations = await modal.locator('img[alt^="Citations:"]').all();
      if (citations.length < 1)
        throw new Error("Less than 1 citation elements found.");

      const altText = await citations[0].getAttribute("alt");

      const match = altText.match(/Citations: (\d+)/);
      const citationCount = parseInt(match[1], 10);
      expect(citationCount).toBeGreaterThanOrEqual(2);
    });

    // Verify Scienti IDs
    const scientiIDs = ["0000517062-8", "0000144800-28"];
    await test.step(
      "Ensure that the Scienti IDs (" +
        scientiIDs.join(", ") +
        ") are visible in the modal",
      async () => {
        for (const id of scientiIDs) {
          await expect(modal.locator(`text=${id}`).first()).toBeVisible();
        }
      }
    );

    // Verify external research links
    const externalLinks = ["Scholar URL", "OpenAlex URL"];
    await test.step("Confirm the presence of external research profile links (Scholar, OpenAlex,)", async () => {
      for (const link of externalLinks) {
        await expect(modal.getByText(link)).toBeVisible();
      }
    });
  });
});
