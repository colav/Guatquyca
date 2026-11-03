import { test, expect } from "@playwright/test";
import {
  NETWORK,
  RATE_GENERAL,
  SERVER_PROBLEM,
  html429,
  THEME,
  json,
  mockThemeApi,
} from "./theme-curation-helpers";

test.describe("Testing the Screen 3 success view spacing", () => {
  const saveOk = {
    match: (url, request) =>
      url.pathname === "/app/theme" && request.method() === "POST",
    reply: (route) =>
      json(route, 201, { data: { ...THEME, topics: undefined } }),
  };
  const candidatesOk = {
    match: (url, request) =>
      url.pathname === "/app/theme/candidates" && request.method() === "POST",
    reply: (route) =>
      json(route, 200, {
        data: [{ topic_id: "1", name: "Topic one", similarity_score: 0.5 }],
        total_results: 1,
      }),
  };

  const buttonGaps = async (page) => {
    const boxes = [];
    for (const name of [
      "Descargar CSV",
      "Descargar JSON",
      "Curar otro eje temático",
      "Ver todos los ejes",
    ]) {
      const box = await page
        .locator(".ant-btn", { hasText: name })
        .boundingBox();
      boxes.push({ name, ...box });
    }
    return boxes.slice(1).map((b, i) => {
      const prev = boxes[i];
      const sameRow = Math.abs(b.y - prev.y) < 4;
      return sameRow
        ? b.x - (prev.x + prev.width)
        : b.y - (prev.y + prev.height);
    });
  };

  for (const width of [1280, 700]) {
    test(`the four buttons keep the same gap at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await mockThemeApi(page, [candidatesOk, saveOk]);
      await page.goto("/theme-curation/new");
      await page.getByPlaceholder(/^Ej\./).fill("Eje de prueba");
      await page.getByPlaceholder(/^Describe el eje/).fill("energía solar");
      await page
        .getByRole("button", { name: "Buscar tópicos candidatos" })
        .click();
      await expect(page.getByText("Topic one")).toBeVisible();
      await page
        .getByRole("button", { name: "Continuar y guardar eje" })
        .click();
      await page
        .getByRole("button", { name: "Continuar", exact: true })
        .click();
      await page.getByPlaceholder(/^Ej\. Equipo/).fill("Luis");
      await page.getByRole("button", { name: "Guardar eje temático" }).click();
      await expect(page.getByText("Eje temático guardado")).toBeVisible();
      const gaps = await buttonGaps(page);
      expect(gaps).toHaveLength(3);
      for (const gap of gaps) expect(Math.abs(gap - gaps[0])).toBeLessThan(1.5);
      expect(gaps[0]).toBeGreaterThan(8);
    });
  }
});

test.describe("Testing the reason of a failed save or retry (D-052)", () => {
  let bulkReply;
  const bulkOk = (route) =>
    json(route, 200, {
      data: { succeeded: [{ topic_id: "1" }], failed: [] },
    });

  test.beforeEach(async ({ page }) => {
    bulkReply = html429;
    await mockThemeApi(page, [
      {
        match: (url, request) =>
          url.pathname === "/app/theme/candidates" &&
          request.method() === "POST",
        reply: (route) =>
          json(route, 200, {
            data: [{ topic_id: "1", name: "Topic one", similarity_score: 0.5 }],
            total_results: 1,
          }),
      },
      {
        match: (url, request) =>
          url.pathname === "/app/theme" && request.method() === "POST",
        reply: (route) =>
          json(route, 201, { data: { ...THEME, topics: undefined } }),
      },
      {
        match: (url) => url.pathname === "/app/theme/t1/topics/bulk",
        reply: (route) => bulkReply(route),
      },
    ]);
    await page.goto("/theme-curation/new");
    await page.getByPlaceholder(/^Ej\./).fill("Eje de prueba");
    await page.getByPlaceholder(/^Describe el eje/).fill("energía solar");
    await page
      .getByRole("button", { name: "Buscar tópicos candidatos" })
      .click();
    await expect(page.getByText("Topic one")).toBeVisible();
    await page.getByRole("button", { name: "Marcar como incluido" }).click();
    await page.getByRole("button", { name: "Continuar y guardar eje" }).click();
    await page.getByPlaceholder(/^Ej\. Equipo/).fill("Luis");
    await page.getByRole("button", { name: "Guardar eje temático" }).click();
    await expect(page.getByText("Eje temático guardado")).toBeVisible();
  });

  const reason = (page) => page.getByTestId("save-failure-reason");
  const warning = (page) => page.locator(".ant-alert-warning");

  test("a 429 on saving the topics shows its reason next to the usual text", async ({
    page,
  }) => {
    await expect(warning(page)).toContainText(
      "1 tópico(s) no se pudieron guardar",
    );
    await expect(reason(page)).toHaveText(RATE_GENERAL);
    await expect(
      warning(page).getByRole("button", { name: "Reintentar" }),
    ).toBeVisible();
  });

  test("a 500 on retry shows the service problem text", async ({ page }) => {
    bulkReply = (route) => json(route, 500, { error: "x" });
    await warning(page).getByRole("button", { name: "Reintentar" }).click();
    await expect(reason(page)).toHaveText(SERVER_PROBLEM);
  });

  test("no connection on retry shows the connection text", async ({ page }) => {
    bulkReply = (route) => route.abort();
    await warning(page).getByRole("button", { name: "Reintentar" }).click();
    await expect(reason(page)).toHaveText(NETWORK);
  });

  test("the reason changes with each failed retry", async ({ page }) => {
    await expect(reason(page)).toHaveText(RATE_GENERAL);
    bulkReply = (route) => json(route, 503, { error: "x" });
    await warning(page).getByRole("button", { name: "Reintentar" }).click();
    await expect(reason(page)).toHaveText(SERVER_PROBLEM);
    bulkReply = (route) => route.abort();
    await warning(page).getByRole("button", { name: "Reintentar" }).click();
    await expect(reason(page)).toHaveText(NETWORK);
  });

  test("the reason disappears when the retry works", async ({ page }) => {
    await expect(reason(page)).toBeVisible();
    bulkReply = bulkOk;
    await warning(page).getByRole("button", { name: "Reintentar" }).click();
    await expect(warning(page)).toHaveCount(0);
    await expect(reason(page)).toHaveCount(0);
  });
});
