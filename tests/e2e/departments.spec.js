// @ts-check
import { test, expect } from "@playwright/test";

test.describe("Testing Departments entity", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page to ensure a consistent starting point for each test.
    await page.goto("/");

    // Close the beta version modal to ensure the home page is fully accessible for testing.
    await page.getByRole("button", { name: "Probar versión beta" }).click();

    // Open the prefilter dropdown to select a specific filter option.
    await page.getByTitle("Autor").click();

    // Select the "Subunidad Académica" option from the prefilter dropdown to apply this filter for the tests.
    await page
      .getByTitle("Subunidad Académica", { exact: true })
      .locator("div")
      .click();
  });

  test("Departments search result pagination is working", async ({ page }) => {
    // Initiate a search by clicking the search button without entering any keywords. Assumes "Autores" is the default prefilter.
    await page.getByRole("button", { name: "search" }).click();

    // Open the dropdown to select the number of search results displayed per page.
    await page.getByText("/ page").click();

    // Select to display 20 results per page from the dropdown options.
    await page.getByText("20 / page").click();

    // Verify that the text "Afiliaciones" is visible, indicating that the search results are displayed.
    await expect(page.getByText("Afiliaciones").nth(0)).toBeVisible();

    // Confirm that the URL reflects the search parameters for displaying 20 results per page.
    await expect(page).toHaveURL(
      "/search/affiliations/department?max=20&page=1&sort=citations-",
      { timeout: 12000 }
    );

    // Navigate to the third page of the search results using pagination.
    await page.locator('a:text-is("3")').click();

    // Ensure that "Afiliaciones" text is still visible, confirming that the third page of results is displayed.
    await expect(page.getByText("Afiliaciones").nth(0)).toBeVisible();

    // Check that the URL is updated to reflect the navigation to the third page of results.
    await expect(page).toHaveURL(
      "/search/affiliations/department?max=20&page=3&sort=citations-",
      { timeout: 12000 }
    );
  });

  test("random department search & profile is working", async ({ page }) => {
    // Initiate a search by clicking the search button without entering any keywords. Assumes "Autores" is the default prefilter.
    await page.getByRole("button", { name: "search" }).click();

    // Wait for the text indicating the number of "Subunidades académicas" to appear and store its content.
    const departmentsTextContent = await page
      .getByText(/Subunidades académicas/)
      .textContent();

    // Extract the number of departments from the stored text.
    const numberOfDepartments = parseInt(
      departmentsTextContent.match(/(\d+)/)[0],
      10
    );

    // Verify that the extracted number of departments is greater than 0.
    expect(numberOfDepartments).toBeGreaterThan(0);

    // Calculate a random page number within the range of available pages based on the total number of departments.
    const randomPage =
      Math.floor(Math.random() * (numberOfDepartments / 10)) + 1;

    // Navigate to the randomly selected page of search results.
    await page.goto(
      `/search/affiliations/department?max=10&page=${randomPage}&sort=citations-`
    );

    // Wait for the search results to ensure the page has loaded.
    await page.waitForSelector("text=Unidades académicas");

    // Locate all links on the page with the class name 'searchResult_link'.
    const departmentLinks = await page.$$(".searchResult_link");

    // Select a random link from the list of located links.
    const randomIndex = Math.floor(Math.random() * departmentLinks.length);

    // Retrieve the text content of the randomly selected link.
    const departmentName = await departmentLinks[randomIndex].textContent();

    // Click on the randomly selected link to navigate to the corresponding department profile.
    await departmentLinks[randomIndex].click();

    // Verify that the department name is visible on the profile page, ensuring the navigation was successful.
    await expect(page.getByText(departmentName)).toBeVisible();
  });

  test("Departments search with keyword, & profile are working", async ({
    page,
  }) => {
    // Fill the search bar with the specific department name "Instituto de Física"
    await page
      .getByPlaceholder("Búsqueda por palabra clave")
      .fill("Instituto de Física");

    // Initiate the search by clicking the search button
    await page.getByRole("button", { name: "search" }).click();

    // Verify that the search results contain the department "Instituto de Física"
    await expect(page.getByText("Instituto de Física")).toBeVisible();

    // Click on the department name "Instituto de Física" in the search results to navigate to its profile page
    await page
      .getByRole("link", {
        name: "Instituto de Física",
        exact: true,
      })
      .click();

    // Confirm that the department's profile page displays the name "Instituto de Física"
    await expect(page.getByText("Instituto de Física")).toBeVisible();
  });
});
