import { test, expect } from "@playwright/test";

test.describe("Testing Sources Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the sources landing page before each test.
    await page.goto("/sources");
  });

  test("should display hero section with search bar", async ({ page }) => {
    // Verify the main hero heading is visible.
    await expect(
      page.getByRole("heading", { name: /Encuentra fuentes académicas/ }),
    ).toBeVisible();

    // Verify the subheading with accent is visible.
    await expect(page.getByText(/a nivel mundial/)).toBeVisible();

    // Verify the search bar placeholder is present.
    await expect(
      page.getByPlaceholder(/Búsqueda por palabra clave/),
    ).toBeVisible();

    // Verify the hero hint text is visible.
    await expect(
      page.getByText(/Escribe el nombre de una revista/),
    ).toBeVisible();
  });

  test("should display stats bar with source statistics", async ({ page }) => {
    // Verify stats bar is visible and contains expected statistics labels.
    await expect(
      page.locator('[class*="stat_label"]').filter({ hasText: /^Revistas$/ }),
    ).toBeVisible();
    await expect(
      page
        .locator('[class*="stat_label"]')
        .filter({ hasText: /^Fuentes en Acceso abierto$/ }),
    ).toBeVisible();
    await expect(
      page
        .locator('[class*="stat_label"]')
        .filter({ hasText: /^Revistas Q1 \(Scimago\)$/ }),
    ).toBeVisible();
    await expect(
      page
        .locator('[class*="stat_label"]')
        .filter({ hasText: /^Fuentes con licencias abiertas$/ }),
    ).toBeVisible();

    // Verify that statistics values are displayed (numbers formatted in Spanish locale).
    const statsItems = page.locator('[class*="stat_item"]');
    await expect(statsItems).toHaveCount(4);
  });

  test("should display source types section with all source types", async ({
    page,
  }) => {
    // Verify the source types section title.
    await expect(
      page.getByRole("heading", { name: "Tipos de fuentes" }),
    ).toBeVisible();

    // Verify the section subtitle.
    await expect(page.getByText(/Navega por categoría/)).toBeVisible();

    // Verify all source type cards are displayed.
    await expect(page.locator('[class*="type_card"]')).toHaveCount(6);
    await expect(
      page.locator('[class*="type_label"]').filter({ hasText: /^Revistas$/ }),
    ).toBeVisible();
    await expect(
      page
        .locator('[class*="type_label"]')
        .filter({ hasText: /^Plataforma de libros electrónicos$/ }),
    ).toBeVisible();
    await expect(
      page
        .locator('[class*="type_label"]')
        .filter({ hasText: /^Conferencias$/ }),
    ).toBeVisible();
    await expect(
      page
        .locator('[class*="type_label"]')
        .filter({ hasText: /^Series de libros$/ }),
    ).toBeVisible();
    await expect(
      page
        .locator('[class*="type_label"]')
        .filter({ hasText: /^Repositorios$/ }),
    ).toBeVisible();
    await expect(
      page
        .locator('[class*="type_label"]')
        .filter({ hasText: /^Otras fuentes$/ }),
    ).toBeVisible();
  });

  test("should navigate to filtered search when clicking source type", async ({
    page,
  }) => {
    // Click on the "Revistas" (Journals) card.
    const journalLink = page
      .locator('a[href*="/search/sources?source_types=journal"]')
      .first();
    await journalLink.click();

    // Verify navigation to search results page with correct filter.
    await expect(page).toHaveURL(/\/search\/sources\?source_types=journal/);

    // Verify search results are displayed.
    await expect(page.getByText(/^\d+ Fuentes/)).toBeVisible();
  });

  test("should display highlights section with four features", async ({
    page,
  }) => {
    // Verify the highlights section title.
    await expect(
      page.getByRole("heading", { name: /Herramientas para investigadores/ }),
    ).toBeVisible();

    // Verify all four highlight cards are displayed.
    await expect(page.locator('[class*="highlight_card"]')).toHaveCount(4);
    await expect(
      page.getByRole("heading", { name: "Filtros avanzados" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Cobertura global" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Métricas responsables" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Datos abiertos" }),
    ).toBeVisible();

    // Verify each highlight has a description.
    const highlightCards = page.locator('[class*="highlight_card"]');
    expect(await highlightCards.count()).toBe(4);
  });

  test("should display filters section with description and mockup", async ({
    page,
  }) => {
    // Verify the filters section title.
    await expect(
      page.getByRole("heading", {
        name: /Encuentra exactamente lo que buscas/,
      }),
    ).toBeVisible();

    // Verify the filters section badge and description.
    const filtersSection = page.locator("section").filter({
      has: page.getByRole("heading", {
        name: /Encuentra exactamente lo que buscas/,
      }),
    });

    await expect(
      filtersSection.getByText("Filtros avanzados", { exact: true }),
    ).toBeVisible();
    await expect(page.getByText(/Combina múltiples criterios/)).toBeVisible();

    // Verify filter list items are displayed.
    await expect(page.locator('[class*="filter_item"]')).toHaveCount(7);
    await expect(
      page.getByText("Tópicos de investigación", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText(/Cuartil SCImago/, { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText("Tipo de licencia", { exact: true }),
    ).toBeVisible();

    // Verify the CTA button is present.
    const filterCtaButton = page.getByRole("link", {
      name: /Explorar con filtros/,
    });
    await expect(filterCtaButton).toBeVisible();
  });

  test("should navigate to filtered search from filters CTA", async ({
    page,
  }) => {
    // Click the "Explorar con filtros" CTA button.
    await page.getByRole("link", { name: /Explorar con filtros/ }).click();

    // Verify navigation to search page with expected parameters.
    await expect(page).toHaveURL(
      /\/search\/sources\?max=10&page=1&sort=products_desc/,
    );

    // Verify search results page is loaded.
    await expect(page.getByText(/^\d+ Fuentes/)).toBeVisible();
  });

  test("should render all page sections in order", async ({ page }) => {
    // Verify hero section appears first (with search bar).
    const searchBar = page.getByPlaceholder(/Búsqueda por palabra clave/);
    await expect(searchBar).toBeInViewport();

    // Scroll down and verify stats bar is visible.
    const journalStatLabel = page
      .locator('[class*="stat_label"]')
      .filter({ hasText: /^Revistas$/ });
    await journalStatLabel.scrollIntoViewIfNeeded();
    await expect(journalStatLabel).toBeInViewport();

    // Continue scrolling and verify source types section.
    await page
      .getByRole("heading", { name: "Tipos de fuentes" })
      .scrollIntoViewIfNeeded();
    await expect(
      page.getByRole("heading", { name: "Tipos de fuentes" }),
    ).toBeInViewport();

    // Verify featured sources section.
    const featuredHeading = page.getByRole("heading", {
      name: "Fuentes destacadas",
    });
    if (await featuredHeading.count()) {
      await featuredHeading.scrollIntoViewIfNeeded();
      await expect(featuredHeading).toBeInViewport();
    }

    // Verify highlights section.
    await page
      .getByRole("heading", { name: /Herramientas para investigadores/ })
      .scrollIntoViewIfNeeded();
    await expect(
      page.getByRole("heading", { name: /Herramientas para investigadores/ }),
    ).toBeInViewport();

    // Verify filters section at bottom.
    await page
      .getByRole("heading", { name: /Encuentra exactamente lo que buscas/ })
      .scrollIntoViewIfNeeded();
    await expect(
      page.getByRole("heading", {
        name: /Encuentra exactamente lo que buscas/,
      }),
    ).toBeInViewport();
  });

  test("should check for API errors during page load", async ({ page }) => {
    // Track API responses for error codes.
    /** @type {Array<{url: string, errorCode: string}>} */
    const apiErrors = [];
    page.on("response", (response) => {
      const url = response.url();
      const errorCodeMatch = url.match(/\+204\+|\+404\+|\+500\+|\+503\+/);

      if (errorCodeMatch) {
        apiErrors.push({
          url,
          errorCode: errorCodeMatch[0],
        });
      }
    });

    // Load the page and wait for network to be idle.
    await page.goto("/sources");
    await page.waitForLoadState("networkidle");

    // Verify no API errors occurred.
    expect(apiErrors).toEqual([]);
  });

  test("should have proper page title", async ({ page }) => {
    // Verify the page title contains expected keywords.
    await expect(page).toHaveTitle(/ImpactU/);
  });
});
