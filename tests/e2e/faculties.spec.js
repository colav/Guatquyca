// @ts-check
import { test, expect } from "@playwright/test";

test.describe("Testing Faculties entity", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page before each test to ensure a consistent starting point.
    await page.goto("/");

    // Close the beta version prompt to ensure the UI is ready for testing.
    await page.getByRole("button", { name: "Probar versión beta" }).click();

    // Open the prefilter dropdown menu to select a specific filter.
    await page.getByTitle("Autor").click();

    // Choose the "Unidad Académica" option from the prefilter dropdown.
    await page
      .getByTitle("Unidad Académica", { exact: true })
      .locator("div")
      .click();
  });

  test("Faculties search result pagination is working", async ({ page }) => {
    // Initiate a search by clicking the search button; "Autores" is the preselected filter.
    await page.getByRole("button", { name: "search" }).click();

    // Open the dropdown to select the number of search results per page.
    await page.getByText("/ page").click();

    // Select the option to display 20 results per page.
    await page.getByText("20 / page").click();

    // Verify that the "Afiliaciones" text is visible, indicating that the search results are displayed.
    await expect(page.getByText("Afiliaciones").nth(0)).toBeVisible();

    // Confirm that the URL reflects the search parameters for displaying 20 results per page.
    await expect(page).toHaveURL(
      "/search/affiliations/faculty?max=20&page=1&sort=citations-",
      { timeout: 12000 }
    );

    // Navigate to the third page of search results using pagination.
    await page.locator('a:text-is("3")').click();

    // Ensure that the "Afiliaciones" text is still visible, confirming that the third page of results is displayed.
    await expect(page.getByText("Afiliaciones").nth(0)).toBeVisible();

    // Check that the URL is updated to reflect the navigation to the third page of results.
    await expect(page).toHaveURL(
      "/search/affiliations/faculty?max=20&page=3&sort=citations-",
      { timeout: 12000 }
    );
  });

  test("random faculty search & profile is working", async ({ page }) => {
    // Click on the search button without entering any keywords. Assumes "Autores" is the default prefilter.
    await page.getByRole("button", { name: "search" }).click();

    // Wait for the text indicating the number of "Unidades académicas" to appear and store its content.
    const facultiesTextContent = await page
      .getByText(/Unidades académicas/)
      .textContent();

    // Extract the number of faculties from the stored text.
    const numberOfFaculties = parseInt(
      facultiesTextContent.match(/(\d+)/)[0],
      10
    );

    // Verify that the extracted number of faculties is greater than 0.
    expect(numberOfFaculties).toBeGreaterThan(0);

    // Calculate a random page number within the range of available pages based on the total number of faculties.
    const randomPage = Math.floor(Math.random() * (numberOfFaculties / 10)) + 1;

    // Navigate to the randomly selected page of search results.
    await page.goto(
      `/search/affiliations/faculty?max=10&page=${randomPage}&sort=citations-`
    );

    // Wait for the search results to ensure the page has loaded.
    await page.waitForSelector("text=Unidades académicas");

    // Locate all links on the page with the class name 'searchResult_link'.
    const facultyLinks = await page.$$(".searchResult_link");

    // Select a random link from the list of located links.
    const randomIndex = Math.floor(Math.random() * facultyLinks.length);

    // Retrieve the text content of the randomly selected link.
    const facultyName = await facultyLinks[randomIndex].textContent();

    // Click on the randomly selected link to navigate to the corresponding faculty profile.
    await facultyLinks[randomIndex].click();

    // Verify that the faculty name is visible on the profile page, ensuring the navigation was successful.
    await expect(page.getByText(facultyName)).toBeVisible();
  });

  test("Faculties search with keyword, & profile is working", async ({
    page,
  }) => {
    // Fill the search bar with the faculty name "Facultad de Ciencias Exactas y Naturales"
    await page
      .getByPlaceholder("Búsqueda por palabra clave")
      .fill("Facultad de Ciencias Exactas y Naturales");

    // Initiate the search by clicking the search button
    await page.getByRole("button", { name: "search" }).click();

    // Verify that the search results contain the faculty "Facultad de Ciencias Exactas y Naturales"
    await expect(
      page.getByText("Facultad de Ciencias Exactas y Naturales")
    ).toBeVisible();

    // Click on the faculty name "Facultad de Ciencias Exactas y Naturales" in the search results to navigate to its profile page
    await page
      .getByRole("link", {
        name: "Facultad de Ciencias Exactas y Naturales",
        exact: true,
      })
      .click();

    // Confirm that the faculty's profile page displays the name "Facultad de Ciencias Exactas y Naturales"
    await expect(
      page.getByText("Facultad de Ciencias Exactas y Naturales")
    ).toBeVisible();
  });
});
