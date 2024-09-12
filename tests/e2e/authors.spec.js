// @ts-check
import { test, expect } from "@playwright/test";

import { PLOTS_BY_ENTITY } from "@/lib/constants";

const plotlist = PLOTS_BY_ENTITY.person;

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

    // Open the dropdown to select the number of search results per page.
    await page.getByText("/ page").click();

    // Select the option to display 50 results per page.
    await page.getByText("50 / page").click();

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

    // Verify that the "Afiliaciones" text is visible, indicating that the search results are displayed.
    await expect(page.getByText("Afiliaciones").nth(0)).toBeVisible();

    // Confirm that the URL reflects the search parameters for displaying 50 results per page.
    await expect(page).toHaveURL(
      "/search/person?max=50&page=1&sort=products_desc",
      { timeout: 12000 }
    );

    // Navigate to the fifth page of search results using pagination.
    await page.locator('a:text-is("5")').click();

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

    // Ensure that the "Afiliaciones" text is still visible, confirming that the fifth page of results is displayed.
    await expect(page.getByText("Afiliaciones").nth(0)).toBeVisible();

    // Check that the URL is updated to reflect the navigation to the fifth page of results.
    await expect(page).toHaveURL(
      "/search/person?max=50&page=5&sort=products_desc",
      { timeout: 12000 }
    );
  });

  test("random author search, profile page and product list displays correctly", async ({
    page,
  }) => {
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
    await page.goto(
      `/search/person?max=10&page=${randomPage}&sort=products_desc`
    );

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

    // Verify that the profile page for the random author is displayed.
    await expect(page.getByText("Proyectos", { exact: true })).toBeVisible({
      timeout: 15000,
    });

    // Verify that the author's name is visible on the profile page, ensuring the navigation was successful.
    await expect(page.getByRole("heading", { name: authorName })).toBeVisible();

    // Check that the production list is visible on the research page.
    await expect(page.getByText(/^\d+ Producto$/)).toBeVisible({
      timeout: 15000,
    });
  });

  test("author search by keyword, profile page and product list displays correctly", async ({
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
    await expect(page.getByText("Proyectos", { exact: true })).toBeVisible();

    // Check that the production list is visible on the research page.
    await expect(page.getByText(/^\d+ Productos$/)).toBeVisible();
  });

  test("verify successful API responses for Diego Alejandro Restrepo's author metrics", async ({
    page,
  }) => {
    // Set the timeout for this test to 6 minutes
    test.setTimeout(60 * 1000 * 6);

    // Navigate to the search results page for the keyword "Diego Alejandro Restrepo".
    await page.goto(
      '/search/person?max=10&page=1&sort=products_desc&keywords="Diego%20Alejandro%20Restrepo"'
    );

    // Verify that the search results contain "Diego Alejandro Restrepo Quintero".
    await expect(
      page.getByText("Diego Alejandro Restrepo Quintero")
    ).toBeVisible();

    // Find the link element
    const linkElement = await page.getByRole("link", {
      name: "Diego Alejandro Restrepo Quintero",
      exact: true,
    });

    // Extract the href attribute
    const href = await linkElement.getAttribute("href");

    // Use a regex to extract the ID from the URL
    const idMatch = href.match(/person\/([a-zA-Z0-9]+)\//);
    if (!idMatch) {
      throw new Error("Person ID not found in the URL");
    }
    const personId = idMatch[1];

    async function fetchAndMeasure(item) {
      // Construct the API URL
      const apiUrl = `${process.env.NEXT_PUBLIC_CLIENT_API}/app/person/${personId}/research/products?plot=${item}`;
      console.log(`API call for "${item}" Fetched at the URL: ${apiUrl}`);

      // Measure the time taken for the API to respond
      const startTime = Date.now(); // Start timing
      const response = await fetch(apiUrl);

      // Check if the response status is not ok (i.e., not in the range 200-299)
      if (!response.ok) {
        throw new Error(
          `Fetch failed with status: ${response.status} ${response.statusText}`
        );
      }
      const endTime = Date.now(); // End timing
      const responseTime = (endTime - startTime) / 1000; // Convert to seconds

      // Check if the response status is not 200
      if (response.status !== 200) {
        throw new Error(
          `API responded with status code: ${response.status} for "${item}"`
        );
      }

      // Add the time taken for the API to respond to the browser report
      test.info().annotations.push({
        type: `API response time for "${item}"`,
        description: `${responseTime} seconds`,
      });
    }

    async function runSequentially(plotlist) {
      console.log(plotlist);

      for (const item of plotlist) {
        console.log(item);

        await fetchAndMeasure(item);
      }
    }

    // Run the requests sequentially
    await runSequentially(plotlist);
  });
});
