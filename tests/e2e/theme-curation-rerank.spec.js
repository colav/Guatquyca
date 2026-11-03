import { test, expect } from "@playwright/test";
import { json, mockThemeApi, tableRows } from "./theme-curation-helpers";

// ---------------------------------------------------------------------------
// 01 D-097 (with D-089, D-090): always the 120 nearest topics, shown once, in
// two phases. Phase 1: cosine list without buttons and with a notice. Phase 2:
// the same 120 reordered, with buttons, a visible position and a tooltip.
//
// [mock] Everything here is simulated: the candidates with page.route and the
// reranker with lib/rerankMock.js (the endpoint `candidates/rerank` of contract
// 02 version 8 does not exist yet). Nothing here proves the real reranker.
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
}));

let lastCandidatesBody;
const candidatesHandler = (extra = {}) => ({
  match: (url, request) =>
    url.pathname === "/app/theme/candidates" && request.method() === "POST",
  reply: (route, request) => {
    lastCandidatesBody = request.postDataJSON();
    return json(route, 200, {
      data: candidates,
      total_results: candidates.length,
      ...extra,
    });
  },
});

const toReviewScreen = async (page) => {
  await page.goto("/theme-curation/new");
  await page.getByPlaceholder(/^Ej\./).fill("Eje de prueba");
  await page.getByPlaceholder(/^Describe el eje/).fill("bioeconomía");
  await page.getByRole("button", { name: "Buscar tópicos candidatos" }).click();
};

const statusButtons = (page) =>
  page.getByRole("button", { name: /^Marcar como/ });

test.describe("Testing the two-phase candidate list (Screen 2) with simulated API and reranker [mock]", () => {
  test("Screen 1 has no topic count control and always asks for 120", async ({
    page,
  }) => {
    await mockThemeApi(page, [candidatesHandler()]);
    await page.goto("/theme-curation/new");
    await expect(page.getByText("Cantidad de tópicos")).toHaveCount(0);
    await expect(page.getByRole("spinbutton")).toHaveCount(0);

    await toReviewScreen(page);
    await expect(page.getByText("Candidate topic 1", { exact: true })).toBeVisible();
    expect(lastCandidatesBody.top_n).toBe(120);
  });

  test("phase 1: cosine list with a spinner notice, no buttons and no way to continue", async ({
    page,
  }) => {
    await mockThemeApi(page, [candidatesHandler()], { rerankDelayMs: 4000 });
    await toReviewScreen(page);

    const notice = page.locator(".ant-alert-info");
    await expect(notice).toContainText(PENDING_NOTICE);
    await expect(notice.locator(".ant-spin")).toBeVisible();

    // The cosine list, in cosine order, with its position and cosine.
    await expect(page.getByText("Candidate topic 1", { exact: true })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Similitud" })).toBeVisible();
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

    // All 120 at once: six pages of 20 and no seventh.
    await expect(page.locator(".ant-pagination-item-6")).toBeVisible();
    await expect(page.locator(".ant-pagination-item-7")).toHaveCount(0);
  });

  test("phase 2: the 120 reordered with buttons, a visible position and a tooltip without the reranker score", async ({
    page,
  }) => {
    await mockThemeApi(page, [candidatesHandler()], { rerankDelayMs: 1500 });
    await toReviewScreen(page);
    await expect(page.locator(".ant-alert-info")).toBeVisible();

    // The notice goes away and the buttons come on.
    await expect(page.locator(".ant-alert-info")).toHaveCount(0);
    await expect(statusButtons(page).first()).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Posición" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Continuar y guardar eje" }),
    ).toBeEnabled();
    await expect(page.locator(".ant-pagination-item-6")).toBeVisible();
    await expect(page.locator(".ant-pagination-item-7")).toHaveCount(0);

    // Positions run 1..20 on the first page, in order, and the order is not
    // the cosine order any more.
    const rows = await tableRows(page);
    expect(rows).toHaveLength(20);
    rows.forEach((row, i) => expect(row).toMatch(new RegExp(`#${i + 1}(?!\\d)`)));
    const names = rows.map((row) => row.match(/Candidate topic (\d+)/)[1]);
    expect(names).not.toEqual(Array.from({ length: 20 }, (_, i) => String(i + 1)));

    // The tooltip has the cosine and the place before reordering.
    const firstName = Number(names[0]);
    await page.locator("tbody tr.ant-table-row").first().locator("span", { hasText: "#1" }).hover();
    const tooltip = page.getByRole("tooltip");
    await expect(tooltip).toContainText(
      `Coseno: ${(0.9 - (firstName - 1) * 0.003).toFixed(2)}`,
    );
    await expect(tooltip).toContainText(`Puesto antes de reordenar: #${firstName}`);
    await expect(tooltip).not.toContainText(/rerank|puntaje|score/i);
  });

  test("phase 2 buttons classify, and the cosine score is not shown in the cell", async ({
    page,
  }) => {
    await mockThemeApi(page, [candidatesHandler()]);
    await toReviewScreen(page);
    await expect(statusButtons(page).first()).toBeVisible();

    const firstRow = page.locator("tbody tr.ant-table-row").first();
    await expect(firstRow).not.toContainText(/0\.\d\d/);
    await firstRow.getByRole("button", { name: "Marcar como incluido" }).click();
    await expect(page.getByText("1 incluidos")).toBeVisible();
    await expect(page.getByText("119 sin clasificar")).toBeVisible();
  });

  test("going back during phase 1 drops the late reordering", async ({
    page,
  }) => {
    await mockThemeApi(page, [candidatesHandler()], { rerankDelayMs: 1500 });
    await toReviewScreen(page);
    await expect(page.locator(".ant-alert-info")).toBeVisible();
    await page.getByRole("button", { name: "Volver" }).click();
    await expect(page.getByText("Descripción del eje")).toBeVisible();

    await page.waitForTimeout(2500);
    await expect(page.getByText("Descripción del eje")).toBeVisible();
    await expect(page.locator(".ant-alert-info")).toHaveCount(0);
  });

  test("if the reordering fails the cosine list stays, with buttons and a notice", async ({
    page,
  }) => {
    await mockThemeApi(page, [candidatesHandler()], { rerankFails: true });
    await toReviewScreen(page);

    await expect(page.locator(".ant-alert-warning")).toContainText(FALLBACK_NOTICE);
    await expect(statusButtons(page).first()).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Similitud" })).toBeVisible();
    const rows = await tableRows(page);
    expect(rows[0]).toContain("Candidate topic 1");
    expect(rows[0]).toContain("#1");
  });

  test("reranking_available: false skips phase 1 and goes straight to the fallback", async ({
    page,
  }) => {
    await mockThemeApi(page, [candidatesHandler({ reranking_available: false })], {
      rerankDelayMs: 4000,
    });
    await toReviewScreen(page);

    await expect(page.locator(".ant-alert-warning")).toContainText(FALLBACK_NOTICE);
    await expect(page.locator(".ant-alert-info")).toHaveCount(0);
    await expect(statusButtons(page).first()).toBeVisible();
  });
});
