// @ts-check
import { test, expect } from "@playwright/test";

test.describe("Testing Authors entity", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page before each test to ensure a consistent starting point.
    await page.goto("/");

    // Close the beta version prompt to ensure the UI is ready for testing.
    await page.getByRole("button", { name: "Probar versión beta" }).click();
  });

  test("authors search result pagination is working", async ({ page }) => {
    // Initiate a search by clicking the search button. Assumes "Autores" is the preselected filter.
    await page.getByRole("button", { name: "search" }).click();

    // Open the dropdown to select the number of search results per page.
    await page.getByText("/ page").click();

    // Select the option to display 50 results per page.
    await page.getByText("50 / page").click();

    // Verify that the "Afiliaciones" text is visible, indicating that the search results are displayed.
    await expect(page.getByText("Afiliaciones").nth(0)).toBeVisible();

    // Confirm that the URL reflects the search parameters for displaying 50 results per page.
    await expect(page).toHaveURL(
      "/search/person?max=50&page=1&sort=citations-",
      { timeout: 12000 }
    );

    // Navigate to the fifth page of search results using pagination.
    await page.locator('a:text-is("5")').click();

    // Ensure that the "Afiliaciones" text is still visible, confirming that the fifth page of results is displayed.
    await expect(page.getByText("Afiliaciones").nth(0)).toBeVisible();

    // Check that the URL is updated to reflect the navigation to the fifth page of results.
    await expect(page).toHaveURL(
      "/search/person?max=50&page=5&sort=citations-",
      { timeout: 12000 }
    );
  });

  test("random author search & profile is working", async ({ page }) => {
    // Initiate a search by clicking the search button without entering any keywords. Assumes "Autores" is the default prefilter.
    await page.getByRole("button", { name: "search" }).click();

    // Wait for the text indicating the number of "Autores" to appear and store its content.
    const authorsTextContent = await page.getByText(/Autores/).textContent();

    // Extract the number of authors from the stored text.
    const numberOfAuthors = parseInt(authorsTextContent.match(/(\d+)/)[0], 10);

    // Verify that the extracted number of authors is greater than 0.
    expect(numberOfAuthors).toBeGreaterThan(0);

    // Calculate a random page number within the range of available pages based on the total number of authors.
    const randomPage = Math.floor(Math.random() * (numberOfAuthors / 10)) + 1;

    // Navigate to the randomly selected page of search results.
    await page.goto(`/search/person?max=10&page=${randomPage}&sort=citations-`);

    // Wait for the search results to ensure the page has loaded.
    await page.waitForSelector("text=Autores");

    // Locate all links on the page with the class name 'searchResult_link'.
    const authorLinks = await page.$$(".searchResult_link");

    // Select a random link from the list of located links.
    const randomIndex = Math.floor(Math.random() * authorLinks.length);

    // Retrieve the text content of the randomly selected link.
    const authorName = await authorLinks[randomIndex].textContent();

    // Click on the randomly selected link to navigate to the corresponding author profile.
    await authorLinks[randomIndex].click();

    // Verify that the author's name is visible on the profile page, ensuring the navigation was successful.
    await expect(page.getByText(authorName)).toBeVisible();
  });

  test("authors search with keyword, & profile is working", async ({
    page,
  }) => {
    // Fill the search bar with the keyword "Diego Alejandro Restrepo".
    await page
      .getByPlaceholder("Búsqueda por palabra clave")
      .fill('"Diego Alejandro Restrepo"');

    // Click on the search button to initiate the search.
    await page.getByRole("button", { name: "search" }).click();

    // Verify that the search results contain "Diego Alejandro Restrepo Quintero".
    await expect(
      page.getByText("Diego Alejandro Restrepo Quintero")
    ).toBeVisible();

    // Click on the link for "Diego Alejandro Restrepo Quintero" to navigate to his profile page.
    await page
      .getByRole("link", { name: "Diego Alejandro Restrepo Quintero" })
      .click();

    // Verify that the profile page for "Diego Alejandro Restrepo Quintero" is displayed.
    await expect(
      page.getByText("Diego Alejandro Restrepo Quintero")
    ).toBeVisible();
  });
});
