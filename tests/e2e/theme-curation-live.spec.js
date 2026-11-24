import { test, expect } from "@playwright/test";

// Theme Curation against a REAL backend (read-only). Skipped unless E2E_LIVE
// is set, for example:  E2E_LIVE=1 npx playwright test theme-curation-live
//
// These tests only read: they open the first theme of the listing and ask for
// candidates (POST /theme/candidates computes, it stores nothing). They
// never reach the save step and never create or classify anything.

const LIVE = !!process.env.E2E_LIVE;

const STATUS_LABELS = {
  included: "Incluido",
  borderline: "Frontera",
  excluded: "Excluido",
};

const THEME_DETAIL_PATH = /^\/theme\/[0-9a-f-]{36}$/;

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
        new RegExp(`/theme/${detail.theme_id}/export\\?format=csv$`),
      );
      await expect(
        page.getByRole("link", { name: /Descargar JSON/ }),
      ).toHaveAttribute(
        "href",
        new RegExp(`/theme/${detail.theme_id}/export\\?format=json$`),
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
            new URL(r.url()).pathname === "/theme/candidates",
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
    request,
  }) => {
    // The manual search appears when the reordering ends (about 11 s, 01
    // D-097), and the reranker may still be busy with an earlier test.
    test.setTimeout(120000);
    await waitForIdleReranker(request);
    await page.goto("/theme-curation/new");
    await page.getByPlaceholder(/^Ej\./).fill("PRUEBA E2E no guardar");
    await page.getByPlaceholder(/^Describe el eje/).fill(syntheticSeed(150));
    await page
      .getByRole("button", { name: "Buscar tópicos candidatos" })
      .click();
    await expect(
      page.getByText("Revisar tópicos candidatos").first(),
    ).toBeVisible();
    await expect(page.getByPlaceholder("Buscar tópico en inglés...")).toBeVisible(
      { timeout: 60000 },
    );

    const [response] = await Promise.all([
      page.waitForResponse(
        (r) =>
          r.request().method() === "GET" &&
          new URL(r.url()).pathname === "/theme/search",
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

// ---------------------------------------------------------------------------
// Two-phase candidate list against the real backend (02 version 8, §3.1 and
// §3.10; 01 D-097). Read-only: /candidates and /candidates/rerank compute and
// store nothing, and the tests never reach the save step. Synthetic seeds.
//
// The reranker takes about 11 s with a GPU (02 §3.10.5) and handles one request
// at a time, so each test first waits for the service to be idle (its internal
// /health, E2E_RERANKER_HEALTH_URL, default http://127.0.0.1:11437/health; the
// wait is skipped when that address does not answer) so the timing measures a
// single request and not the queue left by an earlier test.
// ---------------------------------------------------------------------------
const RERANKER_HEALTH_URL =
  process.env.E2E_RERANKER_HEALTH_URL ?? "http://127.0.0.1:11437/health";

const waitForIdleReranker = async (request) => {
  const deadline = Date.now() + 90000;
  while (Date.now() < deadline) {
    try {
      const health = await (
        await request.get(RERANKER_HEALTH_URL, { timeout: 3000 })
      ).json();
      if (!health.busy && !health.queue) return;
    } catch {
      return; // not reachable from here: nothing to wait for
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
};

const isPath = (response, path, method = "POST") =>
  response.request().method() === method &&
  new URL(response.url()).pathname === path;

test.describe("Testing the two-phase candidate list against a real backend (read-only)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to run the checks against a real backend.");
  test.setTimeout(150000);

  const SEEDS = {
    "energy and transport": [SENTENCES[0], SENTENCES[1], SENTENCES[5]].join(" "),
    "bioeconomy and materials": [SENTENCES[2], SENTENCES[4]].join(" "),
  };

  for (const [label, seed] of Object.entries(SEEDS)) {
    test(`seed "${label}": phase 1, then phase 2 reorders the same 120 in about 11 s`, async ({
      page,
      request,
    }) => {
      await waitForIdleReranker(request);
      await page.goto("/theme-curation/new");
      await page.getByPlaceholder(/^Ej\./).fill("PRUEBA E2E no guardar");
      await page.getByPlaceholder(/^Describe el eje/).fill(seed);

      const phaseOnePromise = page.waitForResponse((r) =>
        isPath(r, "/theme/candidates"),
      );
      const rerankRequestPromise = page.waitForRequest((r) =>
        r.url().endsWith("/theme/candidates/rerank"),
      );
      const rerankResponsePromise = page.waitForResponse(
        (r) => isPath(r, "/theme/candidates/rerank"),
        { timeout: 90000 },
      );
      await page
        .getByRole("button", { name: "Buscar tópicos candidatos" })
        .click();

      // Phase 1.
      const phaseOne = await phaseOnePromise;
      expect(phaseOne.status()).toBe(200);
      const first = await phaseOne.json();
      expect(first.data).toHaveLength(120);
      expect(first.reranking_available).toBe(true);
      first.data.forEach((t, i) => {
        expect(t.rank).toBe(i + 1);
        expect(t.cosine_rank).toBe(i + 1);
      });
      await expect(page.locator(".ant-alert-info")).toBeVisible();
      await expect(
        page.getByRole("button", { name: /^Marcar como/ }),
      ).toHaveCount(0);

      // Phase 2: the request, its time, and the answer.
      const rerankRequest = await rerankRequestPromise;
      const startedAt = Date.now();
      expect(rerankRequest.postDataJSON()).toEqual({
        seed_text: seed,
        topic_ids: first.data.map((t) => t.topic_id),
      });
      const phaseTwo = await rerankResponsePromise;
      await phaseTwo.finished();
      const seconds = (Date.now() - startedAt) / 1000;
      test
        .info()
        .annotations.push({ type: "phase 2 seconds", description: String(seconds) });
      console.log(`[live] seed "${label}": phase 2 took ${seconds.toFixed(1)} s`);

      expect(phaseTwo.status()).toBe(200);
      const second = await phaseTwo.json();
      expect(second.data).toHaveLength(120);
      expect(second.data.map((t) => t.topic_id).sort()).toEqual(
        first.data.map((t) => t.topic_id).sort(),
      );
      const cosinePlace = Object.fromEntries(
        first.data.map((t, i) => [t.topic_id, i + 1]),
      );
      second.data.forEach((t, i) => {
        expect(t.rank).toBe(i + 1);
        expect(t.cosine_rank).toBe(cosinePlace[t.topic_id]);
        // Never the reranker's own score (D-090).
        expect(Object.keys(t).join(" ")).not.toMatch(
          /rerank|relevance|logit|prob/i,
        );
      });
      expect(
        second.data.some((t, i) => t.topic_id !== first.data[i].topic_id),
        "the reranker must change the order",
      ).toBe(true);
      expect(seconds).toBeLessThan(30);

      // The interface shows phase 2.
      await expect(page.locator(".ant-alert-info")).toHaveCount(0);
      await expect(
        page.getByRole("columnheader", { name: "Posición" }),
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: /^Marcar como/ }).first(),
      ).toBeVisible();
      await expect(page.locator(".ant-pagination-item-6")).toBeVisible();
      await expect(page.locator(".ant-pagination-item-7")).toHaveCount(0);

      const top = second.data[0];
      await page
        .locator("tbody tr.ant-table-row")
        .first()
        .locator("span", { hasText: "#1" })
        .hover();
      const tooltip = page.getByRole("tooltip");
      await expect(tooltip).toContainText(
        `Coseno: ${top.similarity_score.toFixed(2)}`,
      );
      await expect(tooltip).toContainText(
        `Puesto antes de reordenar: #${top.cosine_rank}`,
      );
    });
  }
});

// ---------------------------------------------------------------------------
// "Ver producción asociada" (01 D-101) against the real backend: the link of
// the topic modal opens ImpactU's works search filtered by the topic, in a new
// tab, and the search brings works. Read-only: it only opens pages.
// ---------------------------------------------------------------------------
test.describe("Testing the production link of the topic modal against a real backend (read-only)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to run the checks against a real backend.");
  test.setTimeout(120000);

  test("the link opens the works search for the topic and it brings works", async ({
    page,
    context,
  }) => {
    // A topic of the first theme in the listing that has a name.
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
    const named = (await response.json()).data.topics.find((t) => t.name);
    test.skip(!named, "The first theme has no named topics.");
    await page.getByRole("button", { name: named.name }).click();

    const production = page
      .locator(".ant-modal")
      .getByRole("link", { name: "Ver producción asociada" });
    await expect(production).toBeVisible();
    const expectedId = `https://openalex.org/T${named.topic_id}`;
    await expect(production).toHaveAttribute(
      "href",
      `/search/works?topics=${encodeURIComponent(expectedId)}`,
    );
    await expect(production).toHaveAttribute(
      "title",
      "Obras de ImpactU cuyo tópico principal es este",
    );

    // Open it: new tab, same site, filtered by the full id.
    const [popup] = await Promise.all([
      context.waitForEvent("page"),
      production.click(),
    ]);
    await popup.waitForLoadState("domcontentloaded");
    expect(new URL(popup.url()).origin).toBe(new URL(page.url()).origin);
    expect(new URL(popup.url()).pathname).toBe("/search/works");
    expect(new URL(popup.url()).searchParams.get("topics")).toBe(expectedId);

    // It brings works: at least one work item and a total above zero.
    await expect(popup.locator('li[class*="work_item"]').first()).toBeVisible({
      timeout: 90000,
    });
    const total = await popup
      .getByText(/^[\d.,]+\s+Productos?$/)
      .first()
      .innerText();
    const count = Number(total.split(/\s/)[0].replace(/[.,]/g, ""));
    console.log(
      `[live] production link: topic ${named.topic_id} -> ${total} (${popup.url()})`,
    );
    expect(count).toBeGreaterThan(0);
    await popup.close();
  });
});
