import { test, expect } from "@playwright/test";
import {
  json,
  mockThemeApi,
  rerankHandler,
  tableRows,
} from "./theme-curation-helpers";

// ---------------------------------------------------------------------------
// 01 D-097 (with D-089, D-090): always the 120 nearest topics, shown once, in
// two phases. Phase 1: cosine list without buttons and with a notice. Phase 2:
// the same 120 reordered, with buttons, a visible position and a tooltip.
//
// [mock] Both endpoints are simulated with page.route, following the shapes of
// contract 02 version 8 (§3.1 and §3.10). These tests prove the interface, not
// the reranker: see theme-curation-live.spec.js for the checks against the
// real backend.
// ---------------------------------------------------------------------------

const PENDING_NOTICE =
  "Esta es una lista temporal, ordenada solo por similitud. La estamos reorganizando para recomendarte primero los tópicos más cercanos al eje (tarda unos 10 segundos).";
const FALLBACK_NOTICE =
  "No se pudo reorganizar la lista, así que se conserva el orden por similitud. Ya puedes clasificar los tópicos.";

const candidates = Array.from({ length: 120 }, (_, i) => ({
  topic_id: `c${i + 1}`,
  name: `Candidate topic ${i + 1}`,
  keywords: "alpha; beta",
  // Strictly descending cosine, so the cosine position of "Candidate topic N" is N.
  similarity_score: 0.9 - i * 0.003,
  rank: i + 1,
  cosine_rank: i + 1,
}));
const scores = Object.fromEntries(
  candidates.map((c) => [c.topic_id, c.similarity_score]),
);

let lastCandidatesBody;
const candidatesHandler = (extra = {}) => ({
  match: (url, request) =>
    url.pathname === "/theme/candidates" && request.method() === "POST",
  reply: (route, request) => {
    lastCandidatesBody = request.postDataJSON();
    return json(route, 200, {
      data: candidates,
      meta: { count: candidates.length },
      truncated: false,
      reranking_available: true,
      ...extra,
    });
  },
});

const unavailable = {
  status: 503,
  body: {
    error: "El servicio de reordenamiento no está disponible.",
    code: "reranker_unavailable",
  },
};

const toReviewScreen = async (page) => {
  await page.goto("/theme-curation/new");
  await page.getByPlaceholder(/^Ej\./).fill("Eje de prueba");
  await page.getByPlaceholder(/^Describe el eje/).fill("bioeconomía");
  await page.getByRole("button", { name: "Buscar tópicos candidatos" }).click();
};

const statusButtons = (page) =>
  page.getByRole("button", { name: /^Marcar como/ });

test.describe("Testing the two-phase candidate list (Screen 2) with simulated API [mock]", () => {
  test("Screen 1 has no topic count control and always asks for 120", async ({
    page,
  }) => {
    await mockThemeApi(page, [candidatesHandler()]);
    await page.goto("/theme-curation/new");
    await expect(page.getByText("Cantidad de tópicos")).toHaveCount(0);
    await expect(page.getByRole("spinbutton")).toHaveCount(0);

    await toReviewScreen(page);
    await expect(
      page.getByText("Candidate topic 1", { exact: true }),
    ).toBeVisible();
    expect(lastCandidatesBody.top_n).toBe(120);
  });

  test("phase 2 asks with the seed and the 120 ids in the order phase 1 gave them", async ({
    page,
  }) => {
    const calls = { bodies: [] };
    await mockThemeApi(page, [candidatesHandler(), rerankHandler({ calls })]);
    await toReviewScreen(page);
    await expect(statusButtons(page).first()).toBeVisible();

    expect(calls.bodies).toHaveLength(1);
    expect(Object.keys(calls.bodies[0]).sort()).toEqual([
      "seed_text",
      "topic_ids",
    ]);
    expect(calls.bodies[0].seed_text).toBe("bioeconomía");
    expect(calls.bodies[0].topic_ids).toEqual(candidates.map((c) => c.topic_id));
  });

  test("phase 1: cosine list with a spinner notice, no buttons and no way to continue", async ({
    page,
  }) => {
    await mockThemeApi(page, [
      candidatesHandler(),
      rerankHandler({ delayMs: 4000, scores }),
    ]);
    await toReviewScreen(page);

    const notice = page.locator(".ant-alert-info");
    await expect(notice).toContainText(PENDING_NOTICE);
    await expect(notice.locator(".ant-spin")).toBeVisible();

    // The cosine list, in cosine order, with its position and cosine.
    await expect(
      page.getByText("Candidate topic 1", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: "Similitud" }),
    ).toBeVisible();
    const rows = await tableRows(page);
    expect(rows).toHaveLength(20);
    expect(rows[0]).toContain("Candidate topic 1");
    expect(rows[0]).toContain("#1");
    expect(rows[0]).toContain("0.90");

    // No classification buttons or column, no manual search, no "load more".
    await expect(statusButtons(page)).toHaveCount(0);
    await expect(
      page.getByRole("columnheader", { name: "Clasificación" }),
    ).toHaveCount(0);
    await expect(page.getByPlaceholder(/^Buscar tópico/)).toHaveCount(0);
    await expect(page.getByRole("button", { name: /más/i })).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "Continuar y guardar eje" }),
    ).toBeDisabled();

    // All 120 at once, 20 per page: six pages and no seventh.
    await expect(page.locator(".ant-pagination-item-6")).toBeVisible();
    await expect(page.locator(".ant-pagination-item-7")).toHaveCount(0);
  });

  test("phase 2: the 120 reordered with buttons, a visible position and a tooltip without the reranker score", async ({
    page,
  }) => {
    await mockThemeApi(page, [
      candidatesHandler(),
      rerankHandler({ delayMs: 1500, scores }),
    ]);
    await toReviewScreen(page);
    await expect(page.locator(".ant-alert-info")).toBeVisible();

    // The notice goes away and the buttons come on.
    await expect(page.locator(".ant-alert-info")).toHaveCount(0);
    await expect(statusButtons(page).first()).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: "Posición" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Continuar y guardar eje" }),
    ).toBeEnabled();
    await expect(page.locator(".ant-pagination-item-6")).toBeVisible();
    await expect(page.locator(".ant-pagination-item-7")).toHaveCount(0);

    // Positions run 1..20 on the first page, in order, and the order is not
    // the cosine order any more.
    const rows = await tableRows(page);
    expect(rows).toHaveLength(20);
    rows.forEach((row, i) =>
      expect(row).toMatch(new RegExp(`#${i + 1}(?!\\d)`)),
    );
    const names = rows.map((row) => row.match(/Candidate topic (\d+)/)[1]);
    expect(names).not.toEqual(
      Array.from({ length: 20 }, (_, i) => String(i + 1)),
    );

    // The tooltip has the cosine and the place before reordering.
    const firstName = Number(names[0]);
    await page
      .locator("tbody tr.ant-table-row")
      .first()
      .locator("span", { hasText: "#1" })
      .hover();
    const tooltip = page.getByRole("tooltip");
    await expect(tooltip).toContainText(
      `Coseno: ${(0.9 - (firstName - 1) * 0.003).toFixed(2)}`,
    );
    await expect(tooltip).toContainText(
      `Puesto antes de reordenar: #${firstName}`,
    );
    await expect(tooltip).not.toContainText(/rerank|puntaje|score/i);
  });

  test("phase 2 buttons classify, and the cosine score is not shown in the cell", async ({
    page,
  }) => {
    await mockThemeApi(page, [candidatesHandler(), rerankHandler({ scores })]);
    await toReviewScreen(page);
    await expect(statusButtons(page).first()).toBeVisible();

    const firstRow = page.locator("tbody tr.ant-table-row").first();
    await expect(firstRow).not.toContainText(/0\.\d\d/);
    await firstRow
      .getByRole("button", { name: "Marcar como incluido" })
      .click();
    await expect(page.getByText("1 incluidos")).toBeVisible();
    await expect(page.getByText("119 sin clasificar")).toBeVisible();
  });

  test("going back during phase 1 drops the late reordering", async ({
    page,
  }) => {
    await mockThemeApi(page, [
      candidatesHandler(),
      rerankHandler({ delayMs: 1500 }),
    ]);
    await toReviewScreen(page);
    await expect(page.locator(".ant-alert-info")).toBeVisible();
    await page.getByRole("button", { name: "Volver" }).click();
    await expect(page.getByText("Descripción del eje")).toBeVisible();

    await page.waitForTimeout(2500);
    await expect(page.getByText("Descripción del eje")).toBeVisible();
    await expect(page.locator(".ant-alert-info")).toHaveCount(0);
  });

  for (const [label, fail] of [
    ["503 reranker_unavailable", unavailable],
    [
      "400 on a rejected request",
      { status: 400, body: { error: "topic_ids inválido" } },
    ],
    ["no connection", "abort"],
  ]) {
    test(`if phase 2 fails (${label}) the cosine list stays, with buttons and a notice`, async ({
      page,
    }) => {
      await mockThemeApi(page, [candidatesHandler(), rerankHandler({ fail })]);
      await toReviewScreen(page);

      await expect(page.locator(".ant-alert-warning")).toContainText(
        FALLBACK_NOTICE,
      );
      await expect(page.locator(".ant-alert-info")).toHaveCount(0);
      await expect(statusButtons(page).first()).toBeVisible();
      await expect(
        page.getByRole("columnheader", { name: "Similitud" }),
      ).toBeVisible();
      const rows = await tableRows(page);
      expect(rows[0]).toContain("Candidate topic 1");
      expect(rows[0]).toContain("#1");
      await expect(
        page.getByRole("button", { name: "Continuar y guardar eje" }),
      ).toBeEnabled();
    });
  }

  test("reranking_available: false never calls phase 2 and goes straight to the fallback", async ({
    page,
  }) => {
    const calls = { bodies: [] };
    await mockThemeApi(page, [
      candidatesHandler({ reranking_available: false }),
      rerankHandler({ delayMs: 4000, calls }),
    ]);
    await toReviewScreen(page);

    await expect(page.locator(".ant-alert-warning")).toContainText(
      FALLBACK_NOTICE,
    );
    await expect(page.locator(".ant-alert-info")).toHaveCount(0);
    await expect(statusButtons(page).first()).toBeVisible();
    await page.waitForTimeout(500);
    expect(calls.bodies).toHaveLength(0);
  });

  test("a backend without reranking_available (before version 8) still reorders", async ({
    page,
  }) => {
    await mockThemeApi(page, [
      candidatesHandler({ reranking_available: undefined }),
      rerankHandler({ scores }),
    ]);
    await toReviewScreen(page);
    await expect(
      page.getByRole("columnheader", { name: "Posición" }),
    ).toBeVisible();
  });
});
