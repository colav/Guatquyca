import { test, expect } from "@playwright/test";
import {
  CORS,
  NOT_FOUND_THEME,
  NETWORK,
  RATE_SEARCH,
  RATE_GENERAL,
  BAD_CANDIDATES,
  BAD_SEARCH,
  BAD_CREATE,
  BAD_OTHER,
  SERVER_PROBLEM,
  html429,
  json,
  mockThemeApi,
} from "./theme-curation-helpers";

test.describe("Testing status texts for the other backend errors", () => {
  const post = (reply) => ({
    match: (url, request) =>
      url.pathname === "/app/theme/candidates" && request.method() === "POST",
    reply,
  });

  const submit = async (page) => {
    await page.goto("/theme-curation/new");
    await page.getByPlaceholder(/^Ej\./).fill("Eje de prueba");
    await page.getByPlaceholder(/^Describe el eje/).fill("energía solar");
    await page
      .getByRole("button", { name: "Buscar tópicos candidatos" })
      .click();
  };

  test("candidates 429 shows the rate limit text", async ({ page }) => {
    await mockThemeApi(page, [
      post((route) =>
        route.fulfill({
          status: 429,
          contentType: "text/html",
          headers: CORS,
          body: "x",
        }),
      ),
    ]);
    await submit(page);
    await expect(page.locator(".ant-alert-error")).toHaveText(
      "Demasiadas búsquedas seguidas. Espera un momento e inténtalo de nuevo.",
    );
  });

  test("candidates 500 shows the service problem text", async ({ page }) => {
    await mockThemeApi(page, [
      post((route) => json(route, 500, { error: "Internal server error" })),
    ]);
    await submit(page);
    await expect(page.locator(".ant-alert-error")).toHaveText(
      "El servicio tuvo un problema. Inténtalo de nuevo.",
    );
  });

  test("detail 500 shows the service problem text", async ({ page }) => {
    await mockThemeApi(page, [
      {
        match: (url) => url.pathname === "/app/theme/t1",
        reply: (route) => json(route, 500, { error: "Internal server error" }),
      },
    ]);
    await page.goto("/theme-curation/t1");
    await expect(page.locator(".ant-alert-error")).toContainText(
      "El servicio tuvo un problema. Inténtalo de nuevo.",
    );
  });
});

test.describe("Testing the error texts by context (D-049)", () => {
  const candidatesPost = (reply) => ({
    match: (url, request) =>
      url.pathname === "/app/theme/candidates" && request.method() === "POST",
    reply,
  });
  const searchGet = (reply) => ({
    match: (url) => url.pathname === "/app/theme/search",
    reply,
  });
  const listGet = (reply) => ({
    match: (url) => url.pathname === "/app/theme",
    reply,
  });
  const candidatesOk = (route) =>
    json(route, 200, {
      data: [{ topic_id: "1", name: "Topic one", similarity_score: 0.5 }],
      total_results: 1,
    });

  const toCandidates = async (page) => {
    await page.goto("/theme-curation/new");
    await page.getByPlaceholder(/^Ej\./).fill("Eje de prueba");
    await page.getByPlaceholder(/^Describe el eje/).fill("energía solar");
    await page
      .getByRole("button", { name: "Buscar tópicos candidatos" })
      .click();
  };
  const toReview = async (page) => {
    await toCandidates(page);
    await expect(page.getByText("Topic one")).toBeVisible();
  };
  const toSave = async (page) => {
    await toReview(page);
    await page.getByRole("button", { name: "Continuar y guardar eje" }).click();
    await page.getByRole("button", { name: "Continuar", exact: true }).click();
    await page.getByPlaceholder(/^Ej\. Equipo/).fill("Luis");
    await page.getByRole("button", { name: "Guardar eje temático" }).click();
  };
  const createPost = (reply) => ({
    match: (url, request) =>
      url.pathname === "/app/theme" && request.method() === "POST",
    reply,
  });
  const alertText = (page) =>
    page.locator(".ant-alert-error .ant-alert-message");
  const typeSearch = (page) =>
    page.getByPlaceholder("Buscar tópico en inglés...").fill("bioeco");
  const dropdown = (page) => page.locator(".ant-select-dropdown");

  // --- no connection, everywhere ---
  test("no connection when asking for candidates", async ({ page }) => {
    await mockThemeApi(page, [candidatesPost((route) => route.abort())]);
    await toCandidates(page);
    await expect(alertText(page)).toHaveText(NETWORK);
  });

  test("no connection in the manual search is not 'Sin resultados'", async ({
    page,
  }) => {
    await mockThemeApi(page, [
      candidatesPost(candidatesOk),
      searchGet((route) => route.abort()),
    ]);
    await toReview(page);
    await typeSearch(page);
    await expect(dropdown(page)).toContainText(NETWORK);
    await expect(dropdown(page)).not.toContainText("Sin resultados");
  });

  test("no connection in the listing", async ({ page }) => {
    await mockThemeApi(page, [listGet((route) => route.abort())]);
    await page.goto("/theme-curation");
    await expect(alertText(page)).toHaveText(NETWORK);
  });

  test("no connection opening a theme", async ({ page }) => {
    await mockThemeApi(page, [
      {
        match: (url) => url.pathname === "/app/theme/t1",
        reply: (route) => route.abort(),
      },
    ]);
    await page.goto("/theme-curation/t1");
    await expect(alertText(page)).toHaveText(NETWORK);
  });

  test("no connection creating the theme", async ({ page }) => {
    await mockThemeApi(page, [
      candidatesPost(candidatesOk),
      createPost((route) => route.abort()),
    ]);
    await toSave(page);
    await expect(alertText(page)).toHaveText(NETWORK);
  });

  // --- 404 ---
  test("a 404 opening a theme has its own text", async ({ page }) => {
    await mockThemeApi(page, [
      {
        match: (url) => url.pathname === "/app/theme/t9",
        reply: (route) => json(route, 404, { error: "no existe" }),
      },
    ]);
    await page.goto("/theme-curation/t9");
    await expect(alertText(page)).toHaveText(NOT_FOUND_THEME);
  });

  test("other 404s keep the server message", async ({ page }) => {
    await mockThemeApi(page, [
      candidatesPost((route) => json(route, 404, { error: "Not found here" })),
    ]);
    await toCandidates(page);
    await expect(alertText(page)).toHaveText("Not found here");
  });

  // --- 429 ---
  test("429 asking for candidates uses the 'búsquedas' text", async ({
    page,
  }) => {
    await mockThemeApi(page, [candidatesPost(html429)]);
    await toCandidates(page);
    await expect(alertText(page)).toHaveText(RATE_SEARCH);
  });

  test("429 in the manual search uses the 'búsquedas' text", async ({
    page,
  }) => {
    await mockThemeApi(page, [
      candidatesPost(candidatesOk),
      searchGet(html429),
    ]);
    await toReview(page);
    await typeSearch(page);
    await expect(dropdown(page)).toContainText(RATE_SEARCH);
  });

  test("429 opening a theme uses the general text", async ({ page }) => {
    await mockThemeApi(page, [
      {
        match: (url) => url.pathname === "/app/theme/t1",
        reply: html429,
      },
    ]);
    await page.goto("/theme-curation/t1");
    await expect(alertText(page)).toHaveText(RATE_GENERAL);
  });

  test("429 creating the theme uses the general text", async ({ page }) => {
    await mockThemeApi(page, [
      candidatesPost(candidatesOk),
      createPost(html429),
    ]);
    await toSave(page);
    await expect(alertText(page)).toHaveText(RATE_GENERAL);
  });

  // --- 400 ---
  test("400 asking for candidates", async ({ page }) => {
    await mockThemeApi(page, [
      candidatesPost((route) =>
        json(route, 400, {
          error: "top_n must be an integer between 1 and 4516.",
        }),
      ),
    ]);
    await toCandidates(page);
    await expect(alertText(page)).toHaveText(BAD_CANDIDATES);
  });

  test("400 in the manual search is not 'Sin resultados'", async ({ page }) => {
    await mockThemeApi(page, [
      candidatesPost(candidatesOk),
      searchGet((route) => json(route, 400, { error: "limit must be ..." })),
    ]);
    await toReview(page);
    await typeSearch(page);
    await expect(dropdown(page)).toContainText(BAD_SEARCH);
    await expect(dropdown(page)).not.toContainText("Sin resultados");
  });

  test("400 creating the theme", async ({ page }) => {
    await mockThemeApi(page, [
      candidatesPost(candidatesOk),
      createPost((route) =>
        json(route, 400, { error: "name es obligatorio." }),
      ),
    ]);
    await toSave(page);
    await expect(alertText(page)).toHaveText(BAD_CREATE);
  });

  test("400 anywhere else uses the general action text", async ({ page }) => {
    await mockThemeApi(page, [
      listGet((route) => json(route, 400, { error: "bad" })),
    ]);
    await page.goto("/theme-curation");
    await expect(alertText(page)).toHaveText(BAD_OTHER);
  });

  // --- 5xx unchanged; empty 200 keeps its text ---
  test("5xx keeps the service problem text in the listing", async ({
    page,
  }) => {
    await mockThemeApi(page, [
      listGet((route) => json(route, 503, { error: "x" })),
    ]);
    await page.goto("/theme-curation");
    await expect(alertText(page)).toHaveText(SERVER_PROBLEM);
  });

  test("'Sin resultados...' only for an empty 200", async ({ page }) => {
    await mockThemeApi(page, [
      candidatesPost(candidatesOk),
      searchGet((route) => json(route, 200, { data: [], total_results: 0 })),
    ]);
    await toReview(page);
    await typeSearch(page);
    await expect(dropdown(page)).toContainText(
      "Sin resultados. Recuerda que el catálogo de tópicos está en inglés.",
    );
  });
});
