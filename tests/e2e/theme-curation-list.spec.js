import { test, expect } from "@playwright/test";
import {
  CORS,
  RATE_GENERAL,
  THEME,
  json,
  mockThemeApi,
} from "./theme-curation-helpers";

test.describe("Testing Theme Curation listing", () => {
  const bioThemes = ["Bioeconomía", "Gestión de proyectos", "Movilidad"].map(
    (name, i) => ({
      ...THEME,
      theme_id: `t${i + 1}`,
      name,
      topics: undefined,
    }),
  );

  test.beforeEach(async ({ page }) => {
    await mockThemeApi(page, [
      {
        match: (url) => url.pathname === "/app/theme",
        reply: (route) =>
          json(route, 200, { data: bioThemes, total_results: 3 }),
      },
    ]);
    await page.goto("/theme-curation");
    await expect(page.getByRole("link", { name: "Bioeconomía" })).toBeVisible();
  });

  test("the theme name links to the detail", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: "Bioeconomía" }),
    ).toHaveAttribute("href", "/theme-curation/t1");
  });

  test("has no 'Ver →' column or button", async ({ page }) => {
    await expect(page.locator("body")).not.toContainText("Ver →");
  });

  test("the arrow after the name is decorative", async ({ page }) => {
    const link = page.getByRole("link", { name: "Bioeconomía" });
    const arrow = link.locator(".anticon-arrow-right");
    await expect(arrow).toHaveCount(1);
    await expect(arrow).toHaveAttribute("aria-hidden", "true");
  });

  test("underlines the name on hover", async ({ page }) => {
    const text = page.locator("a[href='/theme-curation/t1'] span").first();
    await expect(text).toHaveCSS("text-decoration-line", "none");
    await page.getByRole("link", { name: "Bioeconomía" }).hover();
    await expect(text).toHaveCSS("text-decoration-line", "underline");
  });

  for (const query of ["bioeconomia", "BIOECONOMÍA", "  BioEconomía "]) {
    test(`filter finds 'Bioeconomía' with '${query}'`, async ({ page }) => {
      await page.getByPlaceholder("Buscar eje por nombre...").fill(query);
      await expect(page.locator("tbody tr.ant-table-row")).toHaveCount(1);
      await expect(
        page.getByRole("link", { name: "Bioeconomía" }),
      ).toBeVisible();
    });
  }

  test("filter without a match shows the empty text", async ({ page }) => {
    await page.getByPlaceholder("Buscar eje por nombre...").fill("zzz");
    await expect(page.locator("body")).toContainText(
      "No hay ejes que coincidan con la búsqueda.",
    );
  });

  test("shows the 429 text when the listing is rate limited", async ({
    page,
  }) => {
    await page.unroute(() => true);
    await mockThemeApi(page, [
      {
        match: (url) => url.pathname === "/app/theme",
        reply: (route) =>
          route.fulfill({
            status: 429,
            contentType: "text/html",
            headers: CORS,
            body: "10 per 1 second",
          }),
      },
    ]);
    await page.reload();
    await expect(
      page.locator(".ant-alert-error .ant-alert-message"),
    ).toHaveText(RATE_GENERAL);
  });
});
