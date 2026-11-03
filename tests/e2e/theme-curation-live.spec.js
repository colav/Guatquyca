import { test, expect } from "@playwright/test";

// Theme Curation against a REAL backend (read-only). Skipped unless E2E_LIVE
// is set, for example:  E2E_LIVE=1 npx playwright test theme-curation-live
//
// These tests only read: they open the first theme of the listing and ask for
// candidates (POST /app/theme/candidates computes, it stores nothing). They
// never reach the save step and never create or classify anything.

const LIVE = !!process.env.E2E_LIVE;

const STATUS_LABELS = {
  included: "Incluido",
  borderline: "Frontera",
  excluded: "Excluido",
};

const THEME_DETAIL_PATH = /^\/app\/theme\/[0-9a-f-]{36}$/;

// Synthetic technical text written for these tests (no user data).
const SENTENCES = [
  "Sistemas fotovoltaicos con almacenamiento en baterías de ion de litio para microrredes rurales.",
  "Modelado de la eficiencia energética del transporte ferroviario eléctrico urbano.",
  "Biorrefinerías que convierten residuos agroindustriales en bioplásticos y biocombustibles avanzados.",
  "Optimización logística de flotas de vehículos eléctricos con algoritmos de enrutamiento.",
  "Análisis del ciclo de vida de materiales compuestos de origen biológico.",
  "Redes inteligentes, medición avanzada y gestión de la demanda en sistemas eléctricos.",
];

// Text of exactly `charCount` characters built from the sentences above.
const syntheticSeed = (charCount) => {
  let text = "";
  for (let i = 0; text.length < charCount; i += 1) {
    text += (i ? " " : "") + SENTENCES[i % SENTENCES.length];
  }
  return text.slice(0, charCount);
};

test.describe("Testing Theme Curation against a real backend (read-only)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to run the checks against a real backend.");

  test.describe("detail of the first theme in the listing", () => {
    let detail;

    test.beforeEach(async ({ page }) => {
      await page.goto("/theme-curation");
      const link = page.locator("tbody tr.ant-table-row a").first();
      await expect(link).toBeVisible();
      const [response] = await Promise.all([
        page.waitForResponse(
          (r) =>
            r.request().method() === "GET" &&
            THEME_DETAIL_PATH.test(new URL(r.url()).pathname),
        ),
        link.click(),
      ]);
      expect(response.status()).toBe(200);
      detail = (await response.json()).data;
      await expect(page.locator("h1")).toBeVisible();
    });

    test("the backend sends the D-009 fields in every topic", async () => {
      for (const field of [
        "name",
        "summary",
        "keywords",
        "subfield_id",
        "subfield_name",
        "field_id",
        "field_name",
        "domain_id",
        "domain_name",
        "wikipedia_url",
      ]) {
        for (const t of detail.topics) expect(t).toHaveProperty(field);
      }
    });

    test("shows the theme name and the counts from summary", async ({
      page,
    }) => {
      await expect(page.locator("h1")).toHaveText(detail.name);
      const body = page.locator("body");
      await expect(body).toContainText(`${detail.summary.included} incluidos`);
      await expect(body).toContainText(`${detail.summary.excluded} excluidos`);
    });

    test("lists every topic with its name, subfield, status and method", async ({
      page,
    }) => {
      const rows = page.locator("tbody tr.ant-table-row");
      await expect(rows).toHaveCount(detail.topics.length);
      for (const t of detail.topics) {
        const row = rows.filter({ hasText: t.name ?? t.topic_id });
        await expect(row).toHaveCount(1);
        await expect(row).toContainText(STATUS_LABELS[t.status]);
        await expect(row).toContainText(
          t.method === "manual" ? "Manual" : "Automático",
        );
        if (t.subfield_name) await expect(row).toContainText(t.subfield_name);
      }
    });

    test("does not show the missing-names notice", async ({ page }) => {
      await expect(
        page.locator("tbody tr.ant-table-row").first(),
      ).toBeVisible();
      await expect(page.locator("body")).not.toContainText(
        "Todavía no se puede mostrar el nombre",
      );
    });

    test("opens the modal of a named topic with its hierarchy", async ({
      page,
    }) => {
      const named = detail.topics.find((t) => t.name);
      test.skip(!named, "The first theme has no named topics.");
      await page.getByRole("button", { name: named.name }).click();
      const modal = page.locator(".ant-modal");
      await expect(modal).toContainText(/jerarquía/i);
      if (named.domain_name)
        await expect(modal).toContainText(named.domain_name);
      if (named.subfield_name)
        await expect(modal).toContainText(named.subfield_name);
    });

    test("links the exports to the same theme", async ({ page }) => {
      await expect(
        page.getByRole("link", { name: /Descargar CSV/ }),
      ).toHaveAttribute(
        "href",
        new RegExp(`/app/theme/${detail.theme_id}/export\\?format=csv$`),
      );
      await expect(
        page.getByRole("link", { name: /Descargar JSON/ }),
      ).toHaveAttribute(
        "href",
        new RegExp(`/app/theme/${detail.theme_id}/export\\?format=json$`),
      );
    });
  });

  test.describe("long-seed alert", () => {
    const search = async (page, seed) => {
      await page.goto("/theme-curation/new");
      await page.getByPlaceholder(/^Ej\./).fill("PRUEBA E2E no guardar");
      await page.getByPlaceholder(/^Describe el eje/).fill(seed);
      const [response] = await Promise.all([
        page.waitForResponse(
          (r) =>
            r.request().method() === "POST" &&
            new URL(r.url()).pathname === "/app/theme/candidates",
        ),
        page.getByRole("button", { name: "Buscar tópicos candidatos" }).click(),
      ]);
      return response;
    };

    test("a short seed is not truncated and shows no alert", async ({
      page,
    }) => {
      const response = await search(page, syntheticSeed(150));
      expect(response.status()).toBe(200);
      expect((await response.json()).truncated).toBe(false);
      await expect(
        page.getByText("Revisar tópicos candidatos").first(),
      ).toBeVisible();
      await expect(page.locator("body")).not.toContainText(
        "más larga de lo recomendado",
      );
    });

    // With Qwen the service cuts at 4,095 tokens: about 15,100 characters of
    // synthetic text (informes/2026-10-26_backend_b24-truncated.md), so 3.500
    // no longer truncates.
    test("a seed of 20.000 characters is truncated and shows the alert", async ({
      page,
    }) => {
      const response = await search(page, syntheticSeed(20000));
      expect(response.status()).toBe(200);
      expect((await response.json()).truncated).toBe(true);
      await expect(
        page.getByText("Revisar tópicos candidatos").first(),
      ).toBeVisible();
      await expect(page.locator("body")).toContainText(
        "La semilla superó el límite del modelo y se cortó",
      );
    });
  });
});

test.describe("Testing the manual topic search against a real backend (read-only)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to run the checks against a real backend.");

  test("reads the full name of at least one result for 'bioeco'", async ({
    page,
  }) => {
    await page.goto("/theme-curation/new");
    await page.getByPlaceholder(/^Ej\./).fill("PRUEBA E2E no guardar");
    await page.getByPlaceholder(/^Describe el eje/).fill(syntheticSeed(150));
    await page
      .getByRole("button", { name: "Buscar tópicos candidatos" })
      .click();
    await expect(
      page.getByText("Revisar tópicos candidatos").first(),
    ).toBeVisible();

    const [response] = await Promise.all([
      page.waitForResponse(
        (r) =>
          r.request().method() === "GET" &&
          new URL(r.url()).pathname === "/app/theme/search",
      ),
      page.getByPlaceholder("Buscar tópico en inglés...").fill("bioeco"),
    ]);
    expect(response.status()).toBe(200);
    const topics = (await response.json()).data;
    expect(topics.length).toBeGreaterThan(0);

    const names = page
      .locator(".ant-select-item-option .ant-select-item-option-content span")
      .first();
    await expect(names).toBeVisible();
    const shown = await page
      .locator(".ant-select-item-option")
      .evaluateAll((rows) => rows.map((row) => row.innerText.trim()));
    const fullName = topics.find((t) => shown.includes(t.name));
    expect(
      fullName,
      "a result row must read the complete topic name",
    ).toBeTruthy();
    const clipped = await page
      .locator(".ant-select-item-option", { hasText: fullName.name })
      .first()
      .evaluate((row) => {
        const el = row.querySelector(".ant-select-item-option-content");
        return el.scrollWidth > el.clientWidth + 1;
      });
    expect(clipped).toBe(false);
  });
});
