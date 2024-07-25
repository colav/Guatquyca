// @ts-check
import { test, expect } from "@playwright/test";

test.describe("Testing Institutions entity", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page before each test to ensure a consistent starting point.
    await page.goto("/");

    // Close the beta version modal to ensure the home page is fully accessible for testing.
    await page.getByRole("button", { name: "Probar versión beta" }).click();

    // Open the prefilter dropdown to select a specific filter.
    await page.getByTitle("Autor").click();

    // Select the "Institución" option from the prefilter dropdown.
    await page.getByTitle("Institución").locator("div").click();
  });

  test("institutions search result pagination is working", async ({ page }) => {
    // Initiate a search by clicking the search button. Assumes "Autores" is the preselected filter.
    await page.getByRole("button", { name: "search" }).click();

    // Open the dropdown to select the number of search results per page.
    await page.getByText("/ page").click();

    // Select the option to display 20 results per page.
    await page.getByText("20 / page").click();

    // Verify that the URL is updated to reflect the new parameters for displaying 20 results per page.
    await expect(page).toHaveURL(
      "/search/affiliations/institution?max=20&page=1&sort=citations-",
      { timeout: 12000 }
    );

    // Navigate to the fifth page of search results using pagination.
    await page.locator('a:text-is("5")').click();

    // Confirm that the URL is updated to reflect the navigation to the fifth page of results.
    await expect(page).toHaveURL(
      "/search/affiliations/institution?max=20&page=5&sort=citations-",
      { timeout: 12000 }
    );

    // Ensure that the "Perfil externo" text is visible, confirming that the page has loaded correctly.
    await expect(page.getByText("Perfil externo").nth(0)).toBeVisible();
  });

  test("random institution search & profile is working", async ({ page }) => {
    // Initiate a search by clicking the search button without entering any keywords. Assumes "Autores" is the default prefilter.
    await page.getByRole("button", { name: "search" }).click();

    // Wait for the text indicating the number of "Instituciones" to appear and store its content.
    const institutionsTextContent = await page
      .getByText(/Instituciones/)
      .textContent();

    // Extract the number of institutions from the stored text.
    const numberOfInstitutions = parseInt(
      institutionsTextContent.match(/(\d+)/)[0],
      10
    );

    // Verify that the extracted number of institutions is greater than 0.
    expect(numberOfInstitutions).toBeGreaterThan(0);

    // Calculate a random page number within the range of available pages based on the total number of institutions.
    const randomPage =
      Math.floor(Math.random() * (numberOfInstitutions / 10)) + 1;

    // Navigate to the randomly selected page of search results.
    await page.goto(
      `/search/affiliations/institution?max=10&page=${randomPage}&sort=citations-`
    );

    // Wait for the search results to ensure the page has loaded.
    await page.waitForSelector("text=Instituciones");

    // Locate all links on the page with the class name 'searchResult_link'.
    const institutionLinks = await page.$$(".searchResult_link");

    // Select a random link from the list of located links.
    const randomIndex = Math.floor(Math.random() * institutionLinks.length);

    // Retrieve the text content of the randomly selected link.
    const institutionName = await institutionLinks[randomIndex].textContent();

    // Click on the randomly selected link to navigate to the corresponding institution profile.
    await institutionLinks[randomIndex].click();

    // Verify that the institution name is visible on the profile page, ensuring the navigation was successful.
    await expect(page.getByText(institutionName)).toBeVisible();
  });

  test("institutions search with keyword, & profile is working", async ({
    page,
  }) => {
    // Fill the search bar with the keyword "Antioquia".
    await page.getByPlaceholder("Búsqueda por palabra clave").fill("Antioquia");

    // Click on the search button to initiate the search.
    await page.getByRole("button", { name: "search" }).click();

    // Verify that the search results contain "Universidad de Antioquia".
    await expect(page.getByText("Universidad de Antioquia")).toBeVisible();

    // Click on the link for "Universidad de Antioquia" to navigate to its profile page.
    await page
      .getByRole("link", { name: "Universidad de Antioquia", exact: true })
      .click();

    // Verify that the profile page for "Universidad de Antioquia" is displayed.
    await expect(
      page.getByText("Universidad de Antioquia", { exact: true })
    ).toBeVisible();
  });
});
