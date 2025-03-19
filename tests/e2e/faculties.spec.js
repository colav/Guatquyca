// @ts-check
import { test, expect } from "@playwright/test";

import { PLOTS_BY_ENTITY } from "@/lib/constants";

const plotlist = PLOTS_BY_ENTITY.faculty;

test.describe("Testing Faculties entity", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page before each test to ensure a consistent starting point.
    await page.goto("/");

    // Open the prefilter dropdown menu to select a specific filter.
    await page.getByTitle("Autor").click();

    // Choose the "Unidad Académica" option from the prefilter dropdown.
    await page
      .getByTitle("Unidad Académica", { exact: true })
      .locator("div")
      .click();
  });

  test("Faculties search result pagination is working", async ({ page }) => {
    // Initiate a search by clicking the search button
    await page.getByRole("button", { name: "search" }).click();

    // Code snippet to capture API responses with error codes after navigation.
    page.on("response", (response) => {
      const url = response.url();
      const errorCodeMatch = url.match(/\+204\+|\+404\+|\+500\+|\+503\+/);

      if (errorCodeMatch) {
        throw new Error(
          `API response with error code: ${errorCodeMatch} from URL: ${url}`
        );
      }
    });

    // Choose the third page of search results by clicking on the corresponding pagination button.
    await page.getByRole("listitem", { name: "3" }).locator("a").click();

    // Code snippet to capture API responses with error codes after navigation.
    page.on("response", (response) => {
      const url = response.url();
      const errorCodeMatch = url.match(/\+204\+|\+404\+|\+500\+|\+503\+/);

      if (errorCodeMatch) {
        throw new Error(
          `API response with error code: ${errorCodeMatch} from URL: ${url}`
        );
      }
    });

    // Confirm that the URL reflects the search parameters for displaying 20 results per page.
    await expect(page).toHaveURL(
      "/search/affiliations/faculty?max=10&page=3&sort=products_desc",
      { timeout: 12000 }
    );

    // Ensure that the "Afiliaciones" text is still visible, confirming that the third page of results is displayed.
    await expect(page.getByText("Afiliaciones").nth(0)).toBeVisible();
  });

  test("random faculty search, profile page and product list displays correctly", async ({
    page,
  }) => {
    // Click on the search button without entering any keywords.
    await page.getByRole("button", { name: "search" }).click();

    // Wait for the text indicating the number of "Unidades académicas" to appear and store its content.
    const facultiesTextContent = await page
      .getByText(/^\d+ Unidades académicas/)
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
      `/search/affiliations/faculty?max=10&page=${randomPage}&sort=products_desc`
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

  test("Faculties search by keyword, profile page and product list displays correctly", async ({
    page,
  }) => {
    // Fill the search bar with the faculty name "Facultad de Ciencias Exactas y Naturales"
    await page
      .getByPlaceholder("Búsqueda por palabra clave")
      .pressSequentially('"Facultad de Ciencias Exactas y Naturales"');

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

    // Verify that the profile page for "Facultad de Ciencias Exactas y Naturales" is displayed.
    await expect(page.getByText("Autores", { exact: true })).toBeVisible();

    // Click on the research menu item to navigate to the research section of the profile.
    await page.getByRole("menuitem", { name: "Investigación" }).click();

    // Confirm that the faculty's profile page displays the name "Facultad de Ciencias Exactas y Naturales"
    await expect(
      page.getByText("Facultad de Ciencias Exactas y Naturales")
    ).toBeVisible();

    // Check that the production list is visible on the research page.
    await expect(page.getByText(/^\d+ Productos?$/)).toBeVisible({
      timeout: 30000,
    });
  });

  test("verify successful API responses for Facultad de Ciencias Exactas y Naturales's metrics", async ({
    page,
  }) => {
    // Set the timeout for this test to 6 minutes
    test.setTimeout(60 * 1000 * 6);

    // Navigate to the search results page for the keyword "Facultad de Ciencias Exactas y Naturales".
    await page.goto(
      '/search/affiliations/faculty?max=10&page=1&sort=products_desc&keywords="Facultad%20de%20Ciencias%20Exactas%20y%20Naturales"'
    );

    // Verify that the search results contain Facultad de Ciencias Exactas y Naturales".
    await expect(
      page.getByText("Facultad de Ciencias Exactas y Naturales")
    ).toBeVisible();

    // Find the link element
    const linkElement = await page.getByRole("link", {
      name: "Facultad de Ciencias Exactas y Naturales",
      exact: true,
    });

    // Extract the href attribute
    const href = await linkElement.getAttribute("href");

    // Use a regex to extract the ID from the URL
    const idMatch = href.match(/faculty\/([a-zA-Z0-9_]+)\//);
    if (!idMatch) {
      throw new Error("Faculty ID not found in the URL");
    }
    const facultyId = idMatch[1];

    async function fetchAndMeasure(item) {
      // Construct the API URL
      const apiUrl = `${process.env.NEXT_PUBLIC_CLIENT_API}/app/affiliation/faculty/${facultyId}/research/products?plot=${item}`;
      console.log(`API call for "${item}" Fetched at the URL: ${apiUrl}`);

      // Measure the time taken for the API to respond
      const startTime = Date.now(); // Start timing
      const response = await fetch(apiUrl);
      const endTime = Date.now(); // End timing
      const responseTime = (endTime - startTime) / 1000; // Convert to seconds

      // Check if the response status is not 200
      if (response.status !== 200) {
        throw new Error(
          `Fetch failed with status: ${response.status} ${response.statusText} for "${item}"`
        );
      }

      // Add the time taken for the API to respond to the browser report
      test.info().annotations.push({
        type: `API response time for "${item}"`,
        description: `${responseTime} seconds`,
      });
    }

    async function runSequentially(plotlist) {
      for (const item of plotlist) {
        await fetchAndMeasure(item);
      }
    }

    // Run the requests sequentially
    await runSequentially(plotlist);
  });
});
