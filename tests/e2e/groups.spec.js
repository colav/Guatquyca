// @ts-check
import { test, expect } from "@playwright/test";

test.describe("Testing Groups entity", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page to ensure a consistent starting point for each test.
    await page.goto("/");

    // Close the beta version modal to clear the way for test interactions.
    await page.getByRole("button", { name: "Probar versión beta" }).click();

    // Open the "Autor" prefilter dropdown to select a filter option.
    await page.getByTitle("Autor").click();

    // Choose the "Grupo" option from the prefilter dropdown to apply this filter.
    await page.getByTitle("Grupo", { exact: true }).locator("div").click();
  });

  test("Groups search result pagination is working", async ({ page }) => {
    // Initiate a search with the default prefilter (Autores) by clicking the search button.
    await page.getByRole("button", { name: "search" }).click();

    // Open the dropdown to select the number of search results displayed per page.
    await page.getByText("/ page").click();

    // Select to display 20 results per page from the dropdown options.
    await page.getByText("20 / page").click();

    // Verify that "Afiliaciones" text is visible, indicating that the search results are displayed.
    await expect(page.getByText("Afiliaciones").nth(0)).toBeVisible();

    // Confirm that the URL reflects the search parameters for displaying 20 results per page.
    await expect(page).toHaveURL(
      "/search/affiliations/group?max=20&page=1&sort=citations-",
      { timeout: 12000 }
    );

    // Navigate to the third page of the search results using pagination.
    await page.locator('a:text-is("3")').click();

    // Ensure that "Afiliaciones" text is still visible, confirming that the third page of results is displayed.
    await expect(page.getByText("Afiliaciones").nth(0)).toBeVisible();

    // Check that the URL is updated to reflect the navigation to the third page of results.
    await expect(page).toHaveURL(
      "/search/affiliations/group?max=20&page=3&sort=citations-",
      { timeout: 12000 }
    );
  });

  test("random group search & profile is working", async ({ page }) => {
    // Click on the Search button without entering any keyword; "Autores" is the default prefilter
    await page.getByRole("button", { name: "search" }).click();

    // Wait for the text indicating the number of "Grupos" to appear and store its content
    const groupsTextContent = await page.getByText(/Grupos/).textContent();

    // Extract the number of "Grupos" from the stored text
    const numberOfGroups = parseInt(groupsTextContent.match(/(\d+)/)[0], 10);

    // Verify that the extracted number of "Grupos" is greater than 0
    expect(numberOfGroups).toBeGreaterThan(0);

    // Calculate a random page number within the range of available pages based on the total number of "Grupos"
    const randomPage = Math.floor(Math.random() * (numberOfGroups / 10)) + 1;

    // Navigate to the randomly selected page of search results
    await page.goto(
      `/search/affiliations/group?max=10&page=${randomPage}&sort=citations-`
    );

    // Wait for the search results, specifically for the text "Grupos", to ensure the page has loaded
    await page.waitForSelector("text=Grupos");

    // Locate all links on the page with the class name 'searchResult_link'
    const groupLinks = await page.$$(".searchResult_link");

    // Select a random link from the list of located links
    const randomIndex = Math.floor(Math.random() * groupLinks.length);

    // Retrieve the text content of the randomly selected link
    const groupName = await groupLinks[randomIndex].textContent();

    // Click on the randomly selected link to navigate to the corresponding group profile
    await groupLinks[randomIndex].click();

    // Verify that the group name is visible on the profile page, ensuring the navigation was successful
    await expect(page.getByText(groupName)).toBeVisible();
  });

  test("Groups search with keyword, & profile are working", async ({
    page,
  }) => {
    // Fill the search bar with the keyword "Epidemiología"
    await page
      .getByPlaceholder("Búsqueda por palabra clave")
      .fill("Epidemiología");

    // Initiate the search by clicking the search button
    await page.getByRole("button", { name: "search" }).click();

    // Verify that the search results contain the keyword "Epidemiología"
    await expect(
      page.getByText("Epidemiología", { exact: true })
    ).toBeVisible();

    // Click on the search result link with the exact name "Epidemiología" to navigate to the group's profile page
    await page
      .getByRole("link", {
        name: "Epidemiología",
        exact: true,
      })
      .click();

    // Confirm that the group's profile page displays the name "Epidemiología"
    await expect(
      page.getByText("Epidemiología", { exact: true })
    ).toBeVisible();
  });
});
