// @ts-check
import { test, expect } from "@playwright/test";

import { PLOTS_BY_ENTITY } from "@/lib/constants";

const plotlist = PLOTS_BY_ENTITY.group;

test.describe("Testing Groups entity", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page to ensure a consistent starting point for each test.
    await page.goto("/");

    // Open the "Autor" prefilter dropdown to select a filter option.
    await page.getByTitle("Autor").click();

    // Choose the "Grupo" option from the prefilter dropdown to apply this filter.
    await page.getByTitle("Grupo", { exact: true }).locator("div").click();
  });

  test("Groups search result pagination is working", async ({ page }) => {
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

    // Open the dropdown to select the number of search results displayed per page.
    await page.getByText("/ pág.").click();

    // Select to display 20 results per page from the dropdown options.
    await page.getByText("20 / pág.").click();

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

    // Verify that "Afiliaciones" text is visible, indicating that the search results are displayed.
    await expect(page.getByText("Afiliaciones").nth(0)).toBeVisible();

    // Confirm that the URL reflects the search parameters for displaying 20 results per page.
    await expect(page).toHaveURL(
      "/search/affiliations/group?max=20&page=1&sort=products_desc",
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
      "/search/affiliations/group?max=20&page=3&sort=products_desc",
      { timeout: 12000 }
    );
  });

  test("random group search & profile is working", async ({ page }) => {
    // Initiate a search by clicking the search button without entering any keywords.
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
      `/search/affiliations/group?max=10&page=${randomPage}&sort=products_desc`
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

  test("group search by keyword, profile page and product list displays correctly", async ({
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

    // Verify that the profile page for "Epidemiología" is displayed.
    await expect(page.getByText("Autores", { exact: true })).toBeVisible();

    // Click on the research menu item to navigate to the research section of the profile.
    await page.getByRole("menuitem", { name: "Investigación" }).click();

    // Check that the production list is visible on the research page.
    await expect(page.getByText(/^\d+ Productos?$/)).toBeVisible();
  });

  test("verify successful API responses for Epidemiología's metrics", async ({
    page,
  }) => {
    // Set the timeout for this test to 6 minutes
    test.setTimeout(60 * 1000 * 6);

    // Navigate to the search results page for the keyword "Epidemiología".
    await page.goto(
      "/search/affiliations/group?max=10&page=1&sort=products_desc&keywords=Epidemiología"
    );

    // Verify that the search results contain "Epidemiología".
    await expect(
      page.getByText("Epidemiología", { exact: true })
    ).toBeVisible();

    // Find the link element
    const linkElement = await page.getByRole("link", {
      name: "Epidemiología",
      exact: true,
    });

    // Extract the href attribute
    const href = await linkElement.getAttribute("href");

    // Use a regex to extract the ID from the URL
    const idMatch = href.match(/group\/([a-zA-Z0-9]+)\//);
    if (!idMatch) {
      throw new Error("Group ID not found in the URL");
    }
    const groupId = idMatch[1];

    async function fetchAndMeasure(item) {
      // Construct the API URL
      const apiUrl = `${process.env.NEXT_PUBLIC_CLIENT_API}/app/affiliation/group/${groupId}/research/products?plot=${item}`;
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
