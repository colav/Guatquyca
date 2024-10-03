// @ts-check
import { test, expect } from "@playwright/test";

import { PLOTS_BY_ENTITY } from "@/lib/constants";

const plotlist = PLOTS_BY_ENTITY.department;

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
    // Initiate a search by clicking the search button without entering any keywords.
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

    // Open the dropdown to select the number of search results displayed per page.
    await page.getByText("/ page").click();

    // Select to display 20 results per page from the dropdown options.
    await page.getByText("20 / page").click();

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

    // Verify that the text "Afiliaciones" is visible, indicating that the search results are displayed.
    await expect(page.getByText("Afiliaciones").nth(0)).toBeVisible();

    // Confirm that the URL reflects the search parameters for displaying 20 results per page.
    await expect(page).toHaveURL(
      "/search/affiliations/department?max=20&page=1&sort=products_desc",
      { timeout: 12000 }
    );

    // Navigate to the third page of the search results using pagination.
    await page.locator('a:text-is("3")').click();

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

    // Ensure that "Afiliaciones" text is still visible, confirming that the third page of results is displayed.
    await expect(page.getByText("Afiliaciones").nth(0)).toBeVisible();

    // Check that the URL is updated to reflect the navigation to the third page of results.
    await expect(page).toHaveURL(
      "/search/affiliations/department?max=20&page=3&sort=products_desc",
      { timeout: 12000 }
    );
  });

  test("random department search, profile page and product list displays correctly", async ({
    page,
  }) => {
    // Initiate a search by clicking the search button without entering any keywords.
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
      `/search/affiliations/department?max=10&page=${randomPage}&sort=products_desc`
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

  test("Department search by keyword, profile page and product list displays correctly", async ({
    page,
  }) => {
    // Fill the search bar with the specific department name "Instituto de Física"
    await page
      .getByPlaceholder("Búsqueda por palabra clave")
      .fill('"Instituto de Física"');

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

    // Verify that the profile page for "Instituto de Física" is displayed.
    await expect(page.getByText("Autores", { exact: true })).toBeVisible();

    // Click on the research menu item to navigate to the research section of the profile.
    await page.getByRole("menuitem", { name: "Investigación" }).click();

    // Confirm that the department's profile page displays the name "Instituto de Física"
    await expect(page.getByText("Instituto de Física")).toBeVisible();

    // Check that the production list is visible on the research page.
    await expect(page.getByText(/^\d+ Productos?$/)).toBeVisible({
      timeout: 30000,
    });
  });

  test("verify successful API responses for Instituto de Física's metrics", async ({
    page,
  }) => {
    // Set the timeout for this test to 6 minutes
    test.setTimeout(60 * 1000 * 6);

    // Navigate to the search results page for the keyword "Instituto de Física".
    await page.goto(
      '/search/affiliations/department?max=10&page=1&sort=products_desc&keywords="Instituto%20de%20Física"'
    );

    // Verify that the search results contain "Instituto de Física".
    await expect(page.getByText("Instituto de Física")).toBeVisible();

    // Find the link element
    const linkElement = await page.getByRole("link", {
      name: "Instituto de Física",
      exact: true,
    });

    // Extract the href attribute
    const href = await linkElement.getAttribute("href");

    // Use a regex to extract the ID from the URL
    const idMatch = href.match(/department\/([a-zA-Z0-9]+)\//);
    if (!idMatch) {
      throw new Error("department ID not found in the URL");
    }
    const departmentId = idMatch[1];

    async function fetchAndMeasure(item) {
      // Construct the API URL
      const apiUrl = `${process.env.NEXT_PUBLIC_CLIENT_API}/app/affiliation/department/${departmentId}/research/products?plot=${item}`;
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
