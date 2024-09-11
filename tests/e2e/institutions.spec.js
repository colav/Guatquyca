// @ts-check
import { test, expect } from "@playwright/test";

import { PLOTS_BY_ENTITY } from "@/lib/constants";

const plotlist = PLOTS_BY_ENTITY.institution;

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
    // Initiate a search by clicking the search button.
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

    // Select the option to display 20 results per page.
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

    // Verify that the URL is updated to reflect the new parameters for displaying 20 results per page.
    await expect(page).toHaveURL(
      "/search/affiliations/institution?max=20&page=1&sort=products_desc",
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

    // Confirm that the URL is updated to reflect the navigation to the fifth page of results.
    await expect(page).toHaveURL(
      "/search/affiliations/institution?max=20&page=5&sort=products_desc",
      { timeout: 12000 }
    );

    // Ensure that the "Perfil externo" text is visible, confirming that the page has loaded correctly.
    await expect(page.getByText("Perfil externo").nth(0)).toBeVisible();
  });

  test("random institution search, profile page and product list displays correctly", async ({
    page,
  }) => {
    // Initiate a search by clicking the search button without entering any keywords.
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
      `/search/affiliations/institution?max=10&page=${randomPage}&sort=products_desc`
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

  test("institutions search by keyword, profile page and product list displays correctly", async ({
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
      page.getByText("Unidades académicas", { exact: true })
    ).toBeVisible();

    // Click on the research menu item to navigate to the research section of the profile.
    await page.getByRole("menuitem", { name: "Investigación" }).click();

    // Check that the production list is visible on the research page.
    await expect(page.getByText(/^\d+ Productos$/)).toBeVisible();
  });

  test("verify successful API responses for UdeA's metrics", async ({
    page,
  }) => {
    // Set the timeout for this test to 6 minutes
    test.setTimeout(60 * 1000 * 6);

    // Navigate to the search results page for the keyword "Antioquia".
    await page.goto(
      "/search/affiliations/institution?max=10&page=1&sort=products_desc&keywords=Antioquia"
    );

    // Verify that the search results contain "Universidad de Antioquia".
    await expect(page.getByText("Universidad de Antioquia")).toBeVisible();

    // Find the link element
    const linkElement = await page.getByRole("link", {
      name: "Universidad de Antioquia",
      exact: true,
    });

    // Extract the href attribute
    const href = await linkElement.getAttribute("href");

    // Use a regex to extract the ID from the URL
    const idMatch = href.match(/institution\/([a-zA-Z0-9]+)\//);
    if (!idMatch) {
      throw new Error("Institution ID not found in the URL");
    }
    const institutionId = idMatch[1];

    async function fetchAndMeasure(item) {
      // Construct the API URL
      const apiUrl = `${process.env.NEXT_PUBLIC_CLIENT_API}/app/affiliation/institution/${institutionId}/research/products?plot=${item.value}`;
      console.log(`API call for "${item.label}" Fetched at the URL: ${apiUrl}`);

      // Measure the time taken for the API to respond
      const startTime = Date.now(); // Start timing
      const response = await fetch(apiUrl);
      const endTime = Date.now(); // End timing
      const responseTime = (endTime - startTime) / 1000; // Convert to seconds

      // Check if the response status is not 200
      if (response.status !== 200) {
        throw new Error(
          `API responded with status code: ${response.status} for "${item.label}"`
        );
      }

      // Add the time taken for the API to respond to the browser report
      test.info().annotations.push({
        type: `API response time for "${item.label}"`,
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
