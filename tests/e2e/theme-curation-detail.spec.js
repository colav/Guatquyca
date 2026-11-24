import { test, expect } from "@playwright/test";
import {
  NOT_FOUND_THEME,
  topic,
  THEME,
  THEME_WITHOUT_CATALOG,
  json,
  mockThemeApi,
  detailHandler,
  tableRows,
} from "./theme-curation-helpers";

test.describe("Testing Theme Curation detail (Screen 5) with simulated API", () => {
  test.beforeEach(async ({ page }) => {
    await mockThemeApi(page, [detailHandler(THEME)]);
    await page.goto("/theme-curation/t1");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("shows the theme name as title", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("Movilidad sostenible");
  });

  test("falls back to 'Sin descripción' for an empty description", async ({
    page,
  }) => {
    await expect(page.locator("body")).toContainText("Sin descripción");
  });

  test("shows curator and creation date", async ({ page }) => {
    const body = page.locator("body");
    await expect(body).toContainText("Luis");
    await expect(body).toContainText(/22 de sep\w*\.? de 2026/);
  });

  test("shows the counts from summary", async ({ page }) => {
    const body = page.locator("body");
    await expect(body).toContainText("2 incluidos");
    await expect(body).toContainText("1 frontera");
    await expect(body).toContainText("1 excluidos");
    await expect(body).toContainText("1 agregados manualmente");
  });

  test("lists the five topics", async ({ page }) => {
    await expect(page.locator("tbody tr.ant-table-row")).toHaveCount(5);
  });

  test("sorts by status, then named topics before orphans, then by name", async ({
    page,
  }) => {
    await expect(page.locator("tbody tr.ant-table-row")).toHaveCount(5);
    const rows = await tableRows(page);
    expect(rows[0]).toMatch(/Alpha/);
    expect(rows[1]).toMatch(/Beta/);
    expect(rows[2]).toMatch(/^99/);
    expect(rows[3]).toMatch(/Gamma/);
    expect(rows[4]).toMatch(/Zeta/);
  });

  test("marks a topic without name as not found in the catalog", async ({
    page,
  }) => {
    await expect(page.locator("tbody tr.ant-table-row")).toHaveCount(5);
    const rows = await tableRows(page);
    expect(rows[2]).toContain("Tópico no encontrado en el catálogo");
  });

  test("does not show similarity_score", async ({ page }) => {
    await expect(page.locator("tbody tr.ant-table-row")).toHaveCount(5);
    const body = await page.locator("body").innerText();
    expect(body).not.toMatch(/0[.,]59|similitud|similarity/i);
  });

  test("does not show the missing-names notice when names are present", async ({
    page,
  }) => {
    await expect(page.locator("tbody tr.ant-table-row")).toHaveCount(5);
    await expect(page.locator("body")).not.toContainText(
      "Todavía no se puede mostrar el nombre",
    );
  });

  test("links to the CSV and JSON exports", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: /Descargar CSV/ }),
    ).toHaveAttribute("href", /\/theme\/t1\/export\?format=csv$/);
    await expect(
      page.getByRole("link", { name: /Descargar JSON/ }),
    ).toHaveAttribute("href", /\/theme\/t1\/export\?format=json$/);
  });

  test("opens the topic modal with hierarchy and summary", async ({ page }) => {
    await page.getByRole("button", { name: "Alpha topic" }).click();
    const modal = page.locator(".ant-modal");
    await expect(modal).toContainText("Physical Sciences");
    await expect(modal).toContainText("Summary of Alpha topic");
  });

  test("filters topics by name", async ({ page }) => {
    await page.getByPlaceholder(/Buscar tópico/).fill("gam");
    await expect(page.locator("tbody tr.ant-table-row")).toHaveCount(1);
  });

  test("shows the empty text when the search matches nothing", async ({
    page,
  }) => {
    await page.getByPlaceholder(/Buscar tópico/).fill("zzz");
    await expect(page.locator("body")).toContainText(
      "No hay tópicos que coincidan con la búsqueda.",
    );
  });

  test("filters topics by status from the header", async ({ page }) => {
    await page
      .getByRole("columnheader", { name: /Estado/ })
      .getByRole("button")
      .click();
    await page
      .locator(".ant-table-filter-dropdown .ant-dropdown-menu-item", {
        hasText: "Excluido",
      })
      .click();
    await page
      .locator(".ant-table-filter-dropdown")
      .getByRole("button", { name: /OK|Aceptar/ })
      .click();
    await expect(page.locator("tbody tr.ant-table-row")).toHaveCount(1);
    const rows = await tableRows(page);
    expect(rows[0]).toMatch(/Zeta/);
  });
});

test.describe("Testing Theme Curation detail with a backend without catalog fields", () => {
  test.beforeEach(async ({ page }) => {
    await mockThemeApi(page, [detailHandler(THEME_WITHOUT_CATALOG)]);
    await page.goto("/theme-curation/t1");
    await expect(page.locator("tbody tr.ant-table-row").first()).toBeVisible();
  });

  test("shows the missing-names notice", async ({ page }) => {
    await expect(page.locator("body")).toContainText(
      "Todavía no se puede mostrar el nombre ni la jerarquía",
    );
  });

  test("shows topic ids without calling them orphans", async ({ page }) => {
    const body = page.locator("body");
    await expect(body).not.toContainText("Tópico no encontrado en el catálogo");
    await expect(body).toContainText("12");
  });
});

test.describe("Testing Theme Curation detail errors", () => {
  let attempts;

  test.beforeEach(async ({ page }) => {
    attempts = 0;
    await mockThemeApi(page, [
      {
        match: (url) => url.pathname === "/theme/t404",
        reply: (route) => {
          attempts += 1;
          return attempts === 1
            ? json(route, 404, {
                error: "El eje temático con id t404 no existe.",
              })
            : json(route, 200, { data: { ...THEME, topics: [] } });
        },
      },
    ]);
    await page.goto("/theme-curation/t404");
  });

  test("shows the dedicated text on a 404 when opening a theme", async ({
    page,
  }) => {
    await expect(
      page.locator(".ant-alert-error .ant-alert-message"),
    ).toHaveText(NOT_FOUND_THEME);
    await expect(page.locator(".ant-alert-error")).not.toContainText(
      "no existe.",
    );
  });

  test("retry loads the theme and shows the empty table text", async ({
    page,
  }) => {
    await expect(page.locator(".ant-alert-error")).toBeVisible();
    await page.getByRole("button", { name: "Reintentar" }).click();
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("body")).toContainText(
      "Este eje todavía no tiene tópicos clasificados.",
    );
  });
});

test.describe("Testing Theme Curation detail: subfield column, seed row and filter", () => {
  const LONG_SEED = Array.from(
    { length: 60 },
    (_, i) => `término${i} de vocabulario técnico específico`,
  ).join(" ");
  const bioTopics = [
    topic("21", "Bioeconomía circular", "included", "automatic", ""),
    topic("22", "Biodiversity Conservation", "included", "automatic", ""),
  ];

  test.beforeEach(async ({ page }) => {
    await mockThemeApi(page, [
      detailHandler({
        ...THEME,
        seed_text: LONG_SEED,
        topics: bioTopics,
        summary: { included: 2, excluded: 0, borderline: 0, manual: 0 },
      }),
    ]);
    await page.goto("/theme-curation/t1");
    await expect(page.locator("tbody tr.ant-table-row")).toHaveCount(2);
  });

  test("the column is called 'Subcampo de conocimiento'", async ({ page }) => {
    await expect(
      page.getByRole("columnheader", { name: "Subcampo de conocimiento" }),
    ).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: "Jerarquía" }),
    ).toHaveCount(0);
  });

  test("the subfield tag keeps the full path in its tooltip", async ({
    page,
  }) => {
    await page
      .locator(".ant-tag", { hasText: "Renewable Energy" })
      .first()
      .hover();
    await expect(page.getByRole("tooltip")).toContainText(
      "Physical Sciences › Energy › Renewable Energy",
    );
  });

  test("the seed has its own full-width row below curator and date", async ({
    page,
  }) => {
    const curator = await page.getByText("Curado por").boundingBox();
    const date = await page.getByText("Fecha de creación").boundingBox();
    const seedLabel = await page
      .getByText("Semilla", { exact: true })
      .boundingBox();
    const card = await page.locator(".ant-card").first().boundingBox();
    expect(Math.abs(curator.y - date.y)).toBeLessThan(8);
    expect(seedLabel.y).toBeGreaterThan(curator.y + curator.height);
    expect(seedLabel.x - card.x).toBeLessThan(40);
  });

  test("shows 5 lines of the seed and toggles 'Ver más' and 'Ver menos'", async ({
    page,
  }) => {
    const seed = page.locator(".ant-typography", { hasText: "término0 de" });
    const lineHeight = await seed.evaluate((el) =>
      parseFloat(getComputedStyle(el).lineHeight),
    );
    const collapsed = (await seed.boundingBox()).height;
    expect(collapsed).toBeLessThan(lineHeight * 5.5);
    expect(collapsed).toBeGreaterThan(lineHeight * 4.5);
    await page.getByText("Ver más").click();
    expect((await seed.boundingBox()).height).toBeGreaterThan(
      collapsed + lineHeight,
    );
    await page.getByText("Ver menos").click();
    expect((await seed.boundingBox()).height).toBeLessThan(lineHeight * 5.5);
  });

  for (const query of ["bioeconomia", "BIOECONOMÍA"]) {
    test(`the table filter finds 'Bioeconomía circular' with '${query}'`, async ({
      page,
    }) => {
      await page.getByPlaceholder(/Buscar tópico/).fill(query);
      await expect(page.locator("tbody tr.ant-table-row")).toHaveCount(1);
      await expect(
        page.getByRole("button", { name: "Bioeconomía circular" }),
      ).toBeVisible();
    });
  }
});

test.describe("Testing the keywords line under the topic name (Screen 5) with simulated API", () => {
  test.beforeEach(async ({ page }) => {
    await mockThemeApi(page, [detailHandler(THEME)]);
    await page.goto("/theme-curation/t1");
    await expect(page.locator("tbody tr.ant-table-row")).toHaveCount(5);
  });

  test("every named topic shows its keywords under the name", async ({
    page,
  }) => {
    const lines = page.getByTestId("topic-keywords");
    await expect(lines).toHaveCount(4);
    for (const text of await lines.allInnerTexts()) {
      expect(text).toBe("a, b, c");
    }
  });

  test("an orphan topic shows no keywords line", async ({ page }) => {
    const orphan = page.locator("tbody tr.ant-table-row", {
      hasText: "Tópico no encontrado en el catálogo",
    });
    await expect(orphan.getByTestId("topic-keywords")).toHaveCount(0);
  });

  test("the name still opens the modal", async ({ page }) => {
    await page.getByRole("button", { name: "Alpha topic" }).click();
    await expect(page.getByRole("dialog")).toContainText("Palabras clave:");
  });
});
