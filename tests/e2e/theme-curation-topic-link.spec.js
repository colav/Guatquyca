import { test, expect } from "@playwright/test";
import {
  THEME,
  catalogFields,
  detailHandler,
  json,
  mockThemeApi,
  topic,
} from "./theme-curation-helpers";
import { topicProductionPath } from "../../app/theme-curation/lib/format";

// ---------------------------------------------------------------------------
// 01 D-101: the topic detail modal has a "Ver producción asociada" link, before
// the Wikipedia one (now "Ver tópico en Wikipedia"), that opens ImpactU's works
// search filtered by the topic in a new tab. No host in the link: it is a path
// of the same site. The works search needs the full OpenAlex id.
//
// Simulated API here; the link opening the real search and bringing works is
// checked in theme-curation-live.spec.js.
// ---------------------------------------------------------------------------

const HOVER_TITLE = "Obras de ImpactU cuyo tópico principal es este";

test.describe("Testing the production link builder (no browser)", () => {
  test("adds the full OpenAlex id to the number the theme API sends", () => {
    expect(topicProductionPath("10661")).toBe(
      "/search/works?topics=https%3A%2F%2Fopenalex.org%2FT10661",
    );
  });

  test("keeps an id that is already complete and fixes a short 'T' one", () => {
    const expected = "/search/works?topics=https%3A%2F%2Fopenalex.org%2FT10661";
    expect(topicProductionPath("https://openalex.org/T10661")).toBe(expected);
    expect(topicProductionPath("T10661")).toBe(expected);
    expect(topicProductionPath(10661)).toBe(expected);
  });

  test("gives nothing without an id and never a host", () => {
    expect(topicProductionPath(null)).toBeNull();
    expect(topicProductionPath(undefined)).toBeNull();
    expect(topicProductionPath("")).toBeNull();
    expect(topicProductionPath("10661")).toMatch(/^\/search\/works\?/);
  });
});

test.describe("Testing the topic modal links with simulated API", () => {
  const withoutWikipedia = {
    ...topic("20", "Delta topic", "included", "automatic", ""),
    ...catalogFields("Delta topic"),
    wikipedia_url: null,
  };
  const theme = { ...THEME, topics: [...THEME.topics, withoutWikipedia] };

  test.beforeEach(async ({ page }) => {
    await mockThemeApi(page, [detailHandler(theme)]);
    await page.goto("/theme-curation/t1");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("the modal has the production link, then the Wikipedia one", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Alpha topic" }).click();
    const modal = page.locator(".ant-modal");
    const production = modal.getByRole("link", {
      name: "Ver producción asociada",
    });
    const wikipedia = modal.getByRole("link", {
      name: "Ver tópico en Wikipedia",
    });
    await expect(production).toBeVisible();
    await expect(wikipedia).toBeVisible();

    // The old Wikipedia text is gone.
    await expect(modal.getByText("Ver en Wikipedia")).toHaveCount(0);

    // Production first, Wikipedia after it.
    const texts = await modal
      .locator("a")
      .evaluateAll((links) => links.map((a) => a.textContent.trim()));
    expect(texts.indexOf("Ver producción asociada")).toBeLessThan(
      texts.indexOf("Ver tópico en Wikipedia"),
    );
  });

  test("the production link is a same-site path with the full id, in a new tab and safe", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Alpha topic" }).click();
    const production = page
      .locator(".ant-modal")
      .getByRole("link", { name: "Ver producción asociada" });
    // Alpha topic has topic_id "12" in the fixture.
    await expect(production).toHaveAttribute(
      "href",
      "/search/works?topics=https%3A%2F%2Fopenalex.org%2FT12",
    );
    await expect(production).toHaveAttribute("target", "_blank");
    const rel = await production.getAttribute("rel");
    expect(rel).toContain("noopener");
    expect(rel).toContain("noreferrer");
    await expect(production).toHaveAttribute("title", HOVER_TITLE);

    // No host: it works the same on any site that serves the tool.
    const href = await production.getAttribute("href");
    expect(href.startsWith("/")).toBe(true);
    expect(new URL(href, "http://any.example").host).toBe("any.example");
  });

  test("the Wikipedia link keeps its address, new tab and safe rel", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Alpha topic" }).click();
    const wikipedia = page
      .locator(".ant-modal")
      .getByRole("link", { name: "Ver tópico en Wikipedia" });
    await expect(wikipedia).toHaveAttribute(
      "href",
      "https://en.wikipedia.org/wiki/X",
    );
    await expect(wikipedia).toHaveAttribute("target", "_blank");
    expect(await wikipedia.getAttribute("rel")).toContain("noopener");
  });

  test("without a Wikipedia address the production link still shows", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Delta topic" }).click();
    const modal = page.locator(".ant-modal");
    await expect(
      modal.getByRole("link", { name: "Ver producción asociada" }),
    ).toHaveAttribute(
      "href",
      "/search/works?topics=https%3A%2F%2Fopenalex.org%2FT20",
    );
    await expect(
      modal.getByRole("link", { name: "Ver tópico en Wikipedia" }),
    ).toHaveCount(0);
  });

  test("clicking the link opens a new tab on the same site and sends nothing to the theme API", async ({
    page,
    context,
  }) => {
    const writes = [];
    page.on("request", (request) => {
      if (
        request.method() !== "GET" &&
        new URL(request.url()).pathname.startsWith("/theme")
      )
        writes.push(request.url());
    });
    await page.getByRole("button", { name: "Alpha topic" }).click();
    // The new tab's page is not rendered here (it needs the real works API):
    // only its address is checked.
    await context.route("**/search/works**", (route) =>
      route.fulfill({ status: 200, contentType: "text/html", body: "ok" }),
    );
    const [popup] = await Promise.all([
      context.waitForEvent("page"),
      page
        .locator(".ant-modal")
        .getByRole("link", { name: "Ver producción asociada" })
        .click(),
    ]);
    const url = new URL(popup.url());
    expect(url.origin).toBe(new URL(page.url()).origin);
    expect(url.pathname).toBe("/search/works");
    expect(url.searchParams.get("topics")).toBe("https://openalex.org/T12");
    expect(writes).toEqual([]);
  });
});

test.describe("Testing the production link in the Screen 2 modal with simulated API", () => {
  test("a candidate's modal also has the link, with its topic_id", async ({
    page,
  }) => {
    await mockThemeApi(page, [
      {
        match: (url, request) =>
          url.pathname === "/theme/candidates" &&
          request.method() === "POST",
        reply: (route) =>
          json(route, 200, {
            data: [
              {
                topic_id: "10661",
                name: "Topic one",
                similarity_score: 0.5,
                ...catalogFields("Topic one"),
              },
            ],
            meta: { count: 1 },
            reranking_available: true,
          }),
      },
    ]);
    await page.goto("/theme-curation/new");
    await page.getByPlaceholder(/^Ej\./).fill("Eje de prueba");
    await page.getByPlaceholder(/^Describe el eje/).fill("bioeconomía");
    await page
      .getByRole("button", { name: "Buscar tópicos candidatos" })
      .click();
    await page.getByRole("button", { name: "Topic one" }).click();
    await expect(
      page
        .locator(".ant-modal")
        .getByRole("link", { name: "Ver producción asociada" }),
    ).toHaveAttribute(
      "href",
      "/search/works?topics=https%3A%2F%2Fopenalex.org%2FT10661",
    );
  });
});
