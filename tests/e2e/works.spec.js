// @ts-check
import { test, expect } from "@playwright/test";

test.describe("Testing Works entity", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page to ensure each test starts from the same state.
    await page.goto("/");

    // Open the prefilter dropdown by clicking on the "Autor" option.
    await page.getByTitle("Autor").click();

    // Select the "Productos" option from the prefilter dropdown.
    await page.getByTitle("Productos", { exact: true }).locator("div").click();
  });

  test("Works search result pagination is working", async ({ page }) => {
    // Click on the SearchBar Button to initiate search; "Autores" is the default prefilter
    await page.getByRole("button", { name: "search" }).click();

    // Open the dropdown to select the number of results displayed per page
    await page.getByText("/ pág.").click();

    // Select "20 results per page" from the dropdown options
    await page.getByText("20 / pág.").click();

    // Verify that the text "Autores" is visible, indicating the correct page content is loaded
    await expect(page.getByText("Autores").nth(0)).toBeVisible();

    // Ensure the URL reflects the selected option for 20 results per page, on the first page
    await expect(page).toHaveURL(
      "/search/works?max=20&page=1&sort=citations_desc",
      { timeout: 12000 }
    );

    // Navigate to the third page of the search results
    await page.locator('a:text-is("3")').click();

    // Verify that the text "Autores" is still visible, indicating the page content is consistent
    await expect(page.getByText("Autores").nth(0)).toBeVisible();

    // Confirm the URL is updated to reflect the navigation to the third page of results
    await expect(page).toHaveURL(
      "/search/works?max=20&page=3&sort=citations_desc",
      { timeout: 12000 }
    );
  });

  test("random works search & profile is working", async ({ page }) => {
    test.slow();

    // Click on the Search button without entering any keyword.
    await page.getByRole("button", { name: "search" }).click();

    // Wait for the text indicating the number of "Productos" to appear and store its content
    const worksTextContent = await page
      .getByText(/\d+ Productos/)
      .textContent();

    // Extract the number of "Productos" from the stored text
    const numberOfWorks = parseInt(worksTextContent.match(/(\d+)/)[0], 10);

    // Verify that the extracted number of "Productos" is greater than 0
    expect(numberOfWorks).toBeGreaterThan(0);

    // Calculate a random page number within the range of available pages based on the total number of "Productos"
    const randomPage = Math.floor(Math.random() * (numberOfWorks / 10)) + 1;

    // Navigate to the randomly selected page of search results
    await page.goto(
      `/search/works?max=10&page=${randomPage}&sort=citations_desc`
    );

    // Wait for the search results, specifically for the text "Autores", to ensure the page has loaded
    await page.waitForSelector("text=Autores");

    // Locate all links on the page that are designated as type="link"
    const worksLinks = await page.locator('a[type="link"]').all();

    // Select a random link from the list of located links
    const randomIndex = Math.floor(Math.random() * worksLinks.length);

    // Retrieve the text content of the randomly selected link
    const worksName = await worksLinks[randomIndex].textContent();

    // Ensure the randomly selected link is visible on the page
    await expect(worksLinks[randomIndex]).toBeVisible();

    // Introduce a delay of 1 second before proceeding to click the link
    await page.waitForTimeout(1500);

    // Click on the randomly selected link to navigate to the corresponding "Producto" profile
    await worksLinks[randomIndex].click();

    // Set up a listener for any dialog that appears and automatically accept it
    page.on("dialog", async (dialog) => await dialog.accept());

    // Introduce another delay of 1 second after clicking, before performing the next action
    await page.waitForTimeout(1000);

    // Verify that the product name is visible on the profile page, ensuring the navigation was successful
    await expect(page.getByRole("dialog").getByText(worksName)).toBeVisible({
      timeout: 10000,
    });

    // Veryfy that the text "Abstract" is visible on the work modal
    await expect(
      page.getByRole("heading", { name: "Abstract:" })
    ).toBeVisible();
  });

  test("Works search with keyword, & profile are working", async ({ page }) => {
    // Fill the SearchBar with a specific research paper title
    await page
      .getByPlaceholder("Búsqueda por palabra clave")
      .pressSequentially(
        '"Radiative seesaw model: Warm dark matter, collider signatures, and lepton flavor violating signals"'
      );

    // Click on the Search button to initiate the search
    await page.getByRole("button", { name: "search" }).click();

    // Verify that the search results contain the specified paper title
    await expect(page.getByText("Radiative seesaw model: warm")).toBeVisible();

    // Click on the search result to navigate to the detailed profile of the work
    await page.getByText("Radiative seesaw model: warm").click();

    // Set up a listener for any dialog that appears and automatically accept it
    page.on("dialog", (dialog) => dialog.accept());

    // Verify that the detailed profile page for the work displays the beginning of the work's title
    await expect(
      page.getByRole("dialog").getByText("Radiative seesaw model: Warm")
    ).toBeVisible();
  });
});
