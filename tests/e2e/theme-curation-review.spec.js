import { test, expect } from "@playwright/test";
import {
  CORS,
  RATE_SEARCH,
  topic,
  json,
  mockThemeApi,
} from "./theme-curation-helpers";

// ---------------------------------------------------------------------------
// F17 (01 D-052): fixed header, notice, strip inside the dropdown, save errors
// ---------------------------------------------------------------------------

const NOTICE_PLURAL = (n) =>
  `Se agregaron ${n} tópicos correctamente. Los encontrarás al final de la lista, en la última página.`;
const NOTICE_SINGULAR =
  "Se agregó 1 tópico correctamente. Lo encontrarás al final de la lista, en la última página.";
// The title changes with the phase (similitud, then relevancia; 01 D-097), so only its start is fixed.
const TITLE = /^Tópicos candidatos \(ordenados por/;

const manyResults = Array.from({ length: 30 }, (_, i) => ({
  topic_id: `m${i + 1}`,
  name: `Manual candidate topic number ${i + 1} of a deliberately long list`,
  keywords: "alpha; beta",
  domain_name: "Life Sciences",
}));

const reviewApi = (getSearchReply) => [
  {
    match: (url, request) =>
      url.pathname === "/theme/candidates" && request.method() === "POST",
    reply: (route) =>
      json(route, 200, {
        data: [{ topic_id: "1", name: "Topic one", similarity_score: 0.5 }],
        meta: { count: 1 },
      }),
  },
  {
    match: (url) => url.pathname === "/theme/search",
    reply: (route) => getSearchReply()(route),
  },
];

const toReviewScreen = async (page) => {
  await page.goto("/theme-curation/new");
  await page.getByPlaceholder(/^Ej\./).fill("Eje de prueba");
  await page.getByPlaceholder(/^Describe el eje/).fill("bioeconomía");
  await page.getByRole("button", { name: "Buscar tópicos candidatos" }).click();
  await expect(page.getByText("Topic one")).toBeVisible();
};

test.describe("Testing the manual topic search (Screen 2) with simulated API", () => {
  const LONG_NAME =
    "General Agricultural and Biological Sciences and the Bioeconomy of Sustainable Rural Development";
  const results = [
    {
      topic_id: "r1",
      name: LONG_NAME,
      keywords: "bioeconomy; rural development; agriculture",
      domain_name: "Life Sciences",
      field_name: "Agricultural and Biological Sciences",
      subfield_name: "General Agricultural and Biological Sciences",
    },
    { topic_id: "r2", name: "Health Policy", keywords: "policy; health" },
    { topic_id: "r3", name: "Bare Topic" },
    { topic_id: "r4", name: "Only Path", domain_name: "Social Sciences" },
    { topic_id: "1", name: "Topic one" },
  ];
  let searchReply;

  test.beforeEach(async ({ page }) => {
    searchReply = (route) =>
      json(route, 200, { data: results, meta: { count: results.length } });
    await mockThemeApi(page, [
      {
        match: (url, request) =>
          url.pathname === "/theme/candidates" &&
          request.method() === "POST",
        reply: (route) =>
          json(route, 200, {
            data: [{ topic_id: "1", name: "Topic one", similarity_score: 0.5 }],
            meta: { count: 1 },
          }),
      },
      {
        match: (url) => url.pathname === "/theme/search",
        reply: (route) => searchReply(route),
      },
    ]);
    await page.goto("/theme-curation/new");
    await page.getByPlaceholder(/^Ej\./).fill("Eje de prueba");
    await page.getByPlaceholder(/^Describe el eje/).fill("bioeconomía");
    await page
      .getByRole("button", { name: "Buscar tópicos candidatos" })
      .click();
    await expect(page.getByText("Topic one")).toBeVisible();
  });

  const search = (page, text = "bioeco") =>
    page.getByPlaceholder("Buscar tópico en inglés...").fill(text);

  test("the placeholder says the search is in English", async ({ page }) => {
    await expect(
      page.getByPlaceholder("Buscar tópico en inglés..."),
    ).toBeVisible();
  });

  for (const width of [1280, 700, 420]) {
    test(`shows the full name of a long topic at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await search(page);
      const name = page.locator(
        `.ant-select-item-option-content >> text="${LONG_NAME}"`,
      );
      await expect(name).toBeVisible();
      const clipped = await name.evaluate(
        (el) => el.scrollWidth > el.clientWidth + 1,
      );
      expect(clipped).toBe(false);
      const box = await name.boundingBox();
      const view = page.viewportSize();
      expect(box.x + box.width).toBeLessThanOrEqual(view.width);
    });
  }

  test("the row has no hierarchy tag", async ({ page }) => {
    await search(page);
    await expect(page.locator(".ant-select-item-option .ant-tag")).toHaveCount(
      0,
    );
  });

  test("hover shows the hierarchy and then the keywords", async ({ page }) => {
    await search(page);
    await page
      .locator(".ant-select-item-option", { hasText: LONG_NAME })
      .hover();
    const tip = page.getByRole("tooltip");
    await expect(tip).toContainText(
      "Jerarquía: Life Sciences › Agricultural and Biological Sciences › General Agricultural and Biological Sciences",
    );
    await expect(tip).toContainText(
      "Palabras clave: bioeconomy, rural development, agriculture",
    );
    const text = await tip.innerText();
    expect(text.indexOf("Jerarquía:")).toBeLessThan(
      text.indexOf("Palabras clave:"),
    );
    const bold = await tip.locator("strong").allInnerTexts();
    expect(bold).toEqual(["Jerarquía:", "Palabras clave:"]);
  });

  test("omits the hierarchy when the topic has none", async ({ page }) => {
    await search(page);
    await page
      .locator(".ant-select-item-option", { hasText: "Health Policy" })
      .hover();
    const tip = page.getByRole("tooltip");
    await expect(tip).toContainText("Palabras clave: policy, health");
    await expect(tip).not.toContainText("Jerarquía:");
    await expect(tip).not.toContainText("›");
  });

  test("omits the keywords label when the topic has no keywords", async ({
    page,
  }) => {
    await search(page);
    await page
      .locator(".ant-select-item-option", { hasText: "Only Path" })
      .hover();
    const tip = page.getByRole("tooltip");
    await expect(tip).toContainText("Jerarquía: Social Sciences");
    await expect(tip).not.toContainText("Palabras clave:");
  });

  test("shows no tooltip when the topic has neither hierarchy nor keywords", async ({
    page,
  }) => {
    await search(page);
    await page
      .locator(".ant-select-item-option", { hasText: "Bare Topic" })
      .hover();
    await page.waitForTimeout(600);
    await expect(page.getByRole("tooltip")).toHaveCount(0);
  });

  const option = (page, text) =>
    page.locator(".ant-select-item-option", { hasText: text });
  // The only add button and the list of chosen topics live in the dropdown.
  const addButton = (page) =>
    page
      .locator(".ant-select-dropdown")
      .getByRole("button", { name: /Agregar \d+ tópicos?$/ });
  const selection = (page) =>
    page.locator(
      ".ant-select-dropdown [aria-label='Tópicos seleccionados en el desplegable']",
    );

  test("the add button starts disabled with a count of zero", async ({
    page,
  }) => {
    await search(page);
    await expect(addButton(page)).toBeDisabled();
    await expect(addButton(page)).toHaveText(/Agregar 0 tópicos/);
  });

  test("a click adds the topic to a selection and not to the table", async ({
    page,
  }) => {
    await search(page);
    await option(page, "Health Policy").click();
    await expect(selection(page)).toContainText("Health Policy");
    await expect(addButton(page)).toHaveText(/Agregar 1 tópico$/);
    await expect(addButton(page)).toBeEnabled();
    await expect(page.locator("tbody tr.ant-table-row")).toHaveCount(1);
  });

  test("the dropdown stays open after choosing", async ({ page }) => {
    await search(page);
    await option(page, "Health Policy").click();
    await expect(page.locator(".ant-select-dropdown")).toBeVisible();
    await option(page, "Bare Topic").click();
    await expect(selection(page)).toContainText("Bare Topic");
  });

  test("the count follows the selection", async ({ page }) => {
    await search(page);
    await option(page, "Health Policy").click();
    await option(page, "Bare Topic").click();
    await expect(addButton(page)).toHaveText(/Agregar 2 tópicos$/);
  });

  test("a chosen result carries a mark in the dropdown", async ({ page }) => {
    await search(page);
    await option(page, "Health Policy").click();
    await expect(
      option(page, "Health Policy").getByLabel("Elegido"),
    ).toBeVisible();
    await expect(option(page, "Bare Topic").getByLabel("Elegido")).toHaveCount(
      0,
    );
  });

  test("a second click on a chosen result removes it", async ({ page }) => {
    await search(page);
    await option(page, "Health Policy").click();
    await option(page, "Health Policy").click();
    await expect(selection(page)).toHaveCount(0);
    await expect(addButton(page)).toBeDisabled();
    await expect(
      option(page, "Health Policy").getByLabel("Elegido"),
    ).toHaveCount(0);
  });

  test("the x on a chosen topic removes it", async ({ page }) => {
    await search(page);
    await option(page, "Health Policy").click();
    await option(page, "Bare Topic").click();
    await selection(page)
      .locator(".ant-tag", { hasText: "Health Policy" })
      .locator(".ant-tag-close-icon")
      .click();
    await expect(selection(page)).not.toContainText("Health Policy");
    await expect(selection(page)).toContainText("Bare Topic");
    await expect(addButton(page)).toHaveText(/Agregar 1 tópico$/);
  });

  test("shows the full name of a long chosen topic", async ({ page }) => {
    await search(page);
    await option(page, LONG_NAME).click();
    const tag = selection(page).locator(".ant-tag", { hasText: LONG_NAME });
    await expect(tag).toBeVisible();
    const clipped = await tag.evaluate(
      (el) => el.scrollWidth > el.clientWidth + 1,
    );
    expect(clipped).toBe(false);
  });

  test("a topic already in the table reads 'Ya agregado' and cannot be chosen", async ({
    page,
  }) => {
    await search(page);
    const row = option(page, "Topic one");
    await expect(row).toContainText("Ya agregado");
    await expect(row).toHaveClass(/ant-select-item-option-disabled/);
    await row.click({ force: true });
    await expect(selection(page)).toHaveCount(0);
    await expect(addButton(page)).toBeDisabled();
  });

  test("the selection accumulates across different searches", async ({
    page,
  }) => {
    await search(page, "bioeco");
    await option(page, LONG_NAME).click();
    searchReply = (route) =>
      json(route, 200, {
        data: [{ topic_id: "z1", name: "Zebra Studies", keywords: "zoology" }],
        meta: { count: 1 },
      });
    await search(page, "zebra");
    await option(page, "Zebra Studies").click();
    await expect(selection(page)).toContainText(LONG_NAME);
    await expect(selection(page)).toContainText("Zebra Studies");
    await expect(addButton(page)).toHaveText(/Agregar 2 tópicos$/);
  });

  test("adding sends the whole selection to the table and empties it", async ({
    page,
  }) => {
    await search(page, "bioeco");
    await option(page, "Health Policy").click();
    await option(page, "Bare Topic").click();
    await addButton(page).click();
    await expect(page.locator("tbody tr.ant-table-row")).toHaveCount(3);
    await expect(
      page.locator("tbody tr.ant-table-row", { hasText: "Health Policy" }),
    ).toContainText("manual");
    await search(page, "bioeco");
    await expect(selection(page)).toHaveCount(0);
    await expect(addButton(page)).toBeDisabled();
    await expect(addButton(page)).toHaveText(/Agregar 0 tópicos/);
  });

  test("added topics show 'Ya agregado' in a later search", async ({
    page,
  }) => {
    await search(page, "bioeco");
    await option(page, "Health Policy").click();
    await addButton(page).click();
    await search(page, "health");
    await expect(option(page, "Health Policy")).toContainText("Ya agregado");
  });

  test("nothing is sent to the backend by choosing or adding", async ({
    page,
  }) => {
    const writes = [];
    page.on("request", (req) => {
      if (
        ["POST", "PATCH", "PUT", "DELETE"].includes(req.method()) &&
        /\/theme/.test(req.url()) &&
        !req.url().endsWith("/candidates")
      )
        writes.push(req.url());
    });
    await search(page);
    await option(page, "Health Policy").click();
    await addButton(page).click();
    expect(writes).toEqual([]);
  });

  test("an empty list says the catalog is in English", async ({ page }) => {
    searchReply = (route) => json(route, 200, { data: [], meta: { count: 0 } });
    await search(page, "bioeconomia");
    await expect(page.locator(".ant-select-dropdown")).toContainText(
      "Sin resultados. Recuerda que el catálogo de tópicos está en inglés.",
    );
  });

  test("a 429 shows the rate limit text, not 'Sin resultados'", async ({
    page,
  }) => {
    searchReply = (route) =>
      route.fulfill({
        status: 429,
        contentType: "text/html",
        headers: CORS,
        body: "10 per 1 second",
      });
    await search(page);
    const dropdown = page.locator(".ant-select-dropdown");
    await expect(dropdown).toContainText(RATE_SEARCH);
    await expect(dropdown).not.toContainText("Sin resultados");
  });

  for (const status of [500, 502, 503]) {
    test(`a ${status} shows the service problem text`, async ({ page }) => {
      searchReply = (route) => json(route, status, { error: "boom" });
      await search(page);
      const dropdown = page.locator(".ant-select-dropdown");
      await expect(dropdown).toContainText(
        "El servicio tuvo un problema. Inténtalo de nuevo.",
      );
      await expect(dropdown).not.toContainText("Sin resultados");
      await expect(dropdown).not.toContainText("boom");
    });
  }

  test("a later successful search clears the error text", async ({ page }) => {
    searchReply = (route) => json(route, 500, { error: "boom" });
    await search(page, "bio");
    await expect(page.locator(".ant-select-dropdown")).toContainText(
      "El servicio tuvo un problema.",
    );
    searchReply = (route) =>
      json(route, 200, { data: results, meta: { count: results.length } });
    await search(page, "bioeco");
    await expect(page.getByText("Health Policy")).toBeVisible();
    await expect(page.locator(".ant-select-dropdown")).not.toContainText(
      "El servicio tuvo un problema.",
    );
  });
});

test.describe("Testing Screen 2: fixed header, notice and dropdown strip", () => {
  let searchReply;
  const reply30 = (route) =>
    json(route, 200, { data: manyResults, meta: { count: 30 } });

  test.beforeEach(async ({ page }) => {
    searchReply = reply30;
    await mockThemeApi(
      page,
      reviewApi(() => searchReply),
    );
  });

  const searchBox = (page) =>
    page.getByPlaceholder("Buscar tópico en inglés...");
  const openList = async (page) => {
    await searchBox(page).fill("manual");
    await expect(page.locator(".ant-select-item-option").first()).toBeVisible();
  };
  const choose = async (page, count) => {
    for (let i = 1; i <= count; i += 1) {
      await page
        .locator(".ant-select-item-option", {
          hasText: `topic number ${i} of`,
        })
        .click();
    }
  };
  const footerButton = (page) =>
    page
      .locator(".ant-select-dropdown")
      .getByRole("button", { name: /Agregar \d+ tópicos?$/ });
  const strip = (page) =>
    page.locator(
      ".ant-select-dropdown [aria-label='Tópicos seleccionados en el desplegable']",
    );
  const closeDropdown = (page) => page.locator("h1").click();

  // --- 1. fixed header ---
  for (const width of [1280, 700]) {
    test(`the title keeps its position with an empty and a full selection at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await toReviewScreen(page);
      const title = page.getByText(TITLE);
      const before = (await title.boundingBox()).y;
      await openList(page);
      await choose(page, 30);
      await closeDropdown(page);
      await expect(page.getByText("30 seleccionados")).toBeVisible();
      const after = (await title.boundingBox()).y;
      expect(Math.abs(after - before)).toBeLessThanOrEqual(1);
    });
  }

  test("at 1280px the title is centered on the search box", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await toReviewScreen(page);
    const title = await page.getByText(TITLE).boundingBox();
    const input = await searchBox(page).boundingBox();
    const titleCenter = title.y + title.height / 2;
    const inputCenter = input.y + input.height / 2;
    expect(Math.abs(titleCenter - inputCenter)).toBeLessThanOrEqual(1);
  });

  // --- 2. notice ---
  test("adding several topics shows the plural notice for 6 seconds", async ({
    page,
  }) => {
    await toReviewScreen(page);
    await openList(page);
    await choose(page, 3);
    await footerButton(page).click();
    const notice = page.locator(".ant-message-notice", {
      hasText: NOTICE_PLURAL(3),
    });
    await expect(notice).toBeVisible();
    await page.waitForTimeout(5000);
    await expect(notice).toBeVisible();
    await expect(notice).toBeHidden({ timeout: 4000 });
  });

  test("adding one topic shows the singular notice", async ({ page }) => {
    await toReviewScreen(page);
    await openList(page);
    await choose(page, 1);
    await footerButton(page).click();
    await expect(
      page.locator(".ant-message-notice", { hasText: NOTICE_SINGULAR }),
    ).toBeVisible();
  });

  test("the button in the dropdown also shows the notice", async ({ page }) => {
    await toReviewScreen(page);
    await openList(page);
    await choose(page, 2);
    await footerButton(page).click();
    await expect(
      page.locator(".ant-message-notice", { hasText: NOTICE_PLURAL(2) }),
    ).toBeVisible();
  });

  // --- 3. strip inside the dropdown ---
  test("the strip appears with chosen topics, with its title and tags", async ({
    page,
  }) => {
    await toReviewScreen(page);
    await openList(page);
    await expect(page.getByText(/^Seleccionados \(/)).toHaveCount(0);
    await choose(page, 2);
    await expect(page.getByText("Seleccionados (2)")).toBeVisible();
    await expect(strip(page).locator(".ant-tag")).toHaveCount(2);
  });

  test("the x in the strip removes a topic without closing the dropdown", async ({
    page,
  }) => {
    await toReviewScreen(page);
    await openList(page);
    await choose(page, 2);
    await strip(page)
      .locator(".ant-tag", { hasText: "topic number 1 of" })
      .locator(".ant-tag-close-icon")
      .click();
    await expect(page.getByText("Seleccionados (1)")).toBeVisible();
    await expect(page.locator(".ant-select-dropdown")).toBeVisible();
    await expect(page.locator(".ant-select-item-option").first()).toBeVisible();
  });

  test("the button at the foot adds the selection and empties it", async ({
    page,
  }) => {
    await toReviewScreen(page);
    await openList(page);
    await expect(footerButton(page)).toBeDisabled();
    await choose(page, 2);
    await expect(footerButton(page)).toHaveText(/Agregar 2 tópicos$/);
    await footerButton(page).click();
    await expect(page.locator("tbody tr.ant-table-row")).toHaveCount(3);
    await expect(page.getByText(/seleccionados?$/)).toHaveCount(0);
    await openList(page);
    await expect(page.getByText(/^Seleccionados \(/)).toHaveCount(0);
    await expect(footerButton(page)).toBeDisabled();
  });

  for (const [width, height, maxStrip] of [
    [1280, 720, 120],
    [420, 800, 88],
  ]) {
    test(`with 30 chosen topics the strip is capped at ${maxStrip}px, the list and the button stay visible at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height });
      await toReviewScreen(page);
      await openList(page);
      await choose(page, 30);
      await expect(page.getByText("Seleccionados (30)")).toBeVisible();
      const stripBox = await strip(page).boundingBox();
      expect(stripBox.height).toBeLessThanOrEqual(maxStrip + 1);
      const overflows = await strip(page).evaluate(
        (el) => el.scrollHeight > el.clientHeight + 1,
      );
      expect(overflows).toBe(true);
      // The title and the button do not scroll with the strip.
      await strip(page).evaluate((el) => el.scrollTo(0, el.scrollHeight));
      await expect(page.getByText("Seleccionados (30)")).toBeInViewport();
      // The list of results stays visible.
      const option = page.locator(".ant-select-item-option").first();
      await expect(option).toBeVisible();
      expect((await option.boundingBox()).height).toBeGreaterThan(10);
      // The dropdown does not leave the window.
      const popup = await page.locator(".ant-select-dropdown").boundingBox();
      expect(popup.x).toBeGreaterThanOrEqual(-1);
      expect(popup.x + popup.width).toBeLessThanOrEqual(width + 1);
      const button = await footerButton(page).boundingBox();
      expect(button.y).toBeGreaterThanOrEqual(0);
      expect(button.y + button.height).toBeLessThanOrEqual(height);
      await expect(footerButton(page)).toBeInViewport();
    });
  }

  // --- D-055: simplified search box ---
  const option = (page, text) =>
    page.locator(".ant-select-item-option", { hasText: text });
  // The whole search box (with the pending tag inside), not the header one.
  const searchArea = (page) =>
    page.locator(".ant-select-auto-complete", { has: searchBox(page) });
  const pendingTag = (page) =>
    page.getByRole("button", { name: /^\d+ seleccionados?$/ });

  test("there is no add button or list of chosen topics outside the dropdown", async ({
    page,
  }) => {
    await toReviewScreen(page);
    await openList(page);
    await choose(page, 2);
    await expect(footerButton(page)).toHaveCount(1);
    await expect(
      page.getByRole("button", { name: /Agregar \d+ tópicos?$/ }),
    ).toHaveCount(1);
    await closeDropdown(page);
    await expect(
      page.getByRole("button", { name: /Agregar \d+ tópicos?$/ }),
    ).toHaveCount(0);
    await expect(page.getByLabel("Tópicos elegidos")).toHaveCount(0);
    await expect(page.locator("[class*=manualSelection]:visible")).toHaveCount(
      0,
    );
  });

  test("the pending tag is absent without chosen topics", async ({ page }) => {
    await toReviewScreen(page);
    await openList(page);
    await expect(pendingTag(page)).toHaveCount(0);
    await choose(page, 1);
    await expect(pendingTag(page)).toHaveCount(1);
    await choose(page, 1);
    await expect(pendingTag(page)).toHaveCount(0);
  });

  test("the pending tag says '1 seleccionado' and 'N seleccionados'", async ({
    page,
  }) => {
    await toReviewScreen(page);
    await openList(page);
    await choose(page, 1);
    await expect(pendingTag(page)).toHaveText("1 seleccionado");
    await option(page, "topic number 2 of").click();
    await option(page, "topic number 3 of").click();
    await expect(pendingTag(page)).toHaveText("3 seleccionados");
  });

  test("the pending tag sits inside the search box", async ({ page }) => {
    await toReviewScreen(page);
    await openList(page);
    await choose(page, 2);
    const tag = await pendingTag(page).boundingBox();
    const input = await searchArea(page).boundingBox();
    expect(tag.x).toBeGreaterThanOrEqual(input.x);
    expect(tag.x + tag.width).toBeLessThanOrEqual(input.x + input.width);
    expect(tag.y).toBeGreaterThanOrEqual(input.y);
    expect(tag.y + tag.height).toBeLessThanOrEqual(input.y + input.height);
    // On the right half of the box.
    expect(tag.x).toBeGreaterThan(input.x + input.width / 2);
  });

  test("the pending tag reopens the dropdown with the results", async ({
    page,
  }) => {
    await toReviewScreen(page);
    await openList(page);
    await choose(page, 2);
    await closeDropdown(page);
    await expect(page.locator(".ant-select-dropdown")).toBeHidden();
    await pendingTag(page).click();
    await expect(page.locator(".ant-select-dropdown")).toBeVisible();
    await expect(page.getByText("Seleccionados (2)")).toBeVisible();
    await expect(page.locator(".ant-select-item-option").first()).toBeVisible();
  });

  test("with no results the dropdown opens with only the strip and the button", async ({
    page,
  }) => {
    await toReviewScreen(page);
    await openList(page);
    await choose(page, 2);
    await searchBox(page).fill("");
    await closeDropdown(page);
    await expect(page.locator(".ant-select-item-option")).toHaveCount(0);
    await pendingTag(page).click();
    await expect(page.getByText("Seleccionados (2)")).toBeVisible();
    await expect(footerButton(page)).toHaveText(/Agregar 2 tópicos$/);
    await expect(page.locator(".ant-select-item-option")).toHaveCount(0);
    await footerButton(page).click();
    await expect(page.locator("tbody tr.ant-table-row")).toHaveCount(3);
    await expect(pendingTag(page)).toHaveCount(0);
  });

  test("the pending tag opens with the keyboard", async ({ page }) => {
    await toReviewScreen(page);
    await openList(page);
    await choose(page, 1);
    await closeDropdown(page);
    await pendingTag(page).focus();
    await page.keyboard.press("Enter");
    await expect(page.getByText("Seleccionados (1)")).toBeVisible();
  });

  for (const width of [1280, 700, 420]) {
    test(`the search box takes the free space up to the table edge at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await toReviewScreen(page);
      const input = await searchArea(page).boundingBox();
      const table = await page.locator(".ant-table-wrapper").boundingBox();
      expect(
        Math.abs(input.x + input.width - (table.x + table.width)),
      ).toBeLessThanOrEqual(1);
      if (width === 1280) expect(input.width).toBeGreaterThan(440);
      // The page does not scroll sideways.
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1,
      );
      expect(overflow).toBe(false);
    });

    test(`the dropdown is at least as wide as the search box at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await toReviewScreen(page);
      await openList(page);
      const input = await searchArea(page).boundingBox();
      const popup = await page.locator(".ant-select-dropdown").boundingBox();
      expect(popup.width).toBeGreaterThanOrEqual(input.width - 1);
      expect(popup.x + popup.width).toBeLessThanOrEqual(width + 1);
    });
  }

  test("at 1280px the title stays centered on the wider search box", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await toReviewScreen(page);
    await openList(page);
    await choose(page, 30);
    await closeDropdown(page);
    const title = await page.getByText(TITLE).boundingBox();
    const input = await searchBox(page).boundingBox();
    expect(
      Math.abs(title.y + title.height / 2 - (input.y + input.height / 2)),
    ).toBeLessThanOrEqual(1);
  });

  test("keeps F16 behavior: 'Ya agregado' and an open dropdown while choosing", async ({
    page,
  }) => {
    searchReply = (route) =>
      json(route, 200, {
        data: [
          { topic_id: "1", name: "Topic one" },
          { topic_id: "n2", name: "Fresh topic" },
        ],
        meta: { count: 2 },
      });
    await toReviewScreen(page);
    await searchBox(page).fill("topic");
    await expect(
      page.locator(".ant-select-item-option", { hasText: "Topic one" }),
    ).toContainText("Ya agregado");
    await page
      .locator(".ant-select-item-option", { hasText: "Fresh topic" })
      .click();
    await expect(page.locator(".ant-select-dropdown")).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Keywords under the topic name (Screen 2): first 5 plus an ellipsis, all in
// the native tooltip, nothing when the topic has none.
// ---------------------------------------------------------------------------

test.describe("Testing the keywords line under the topic name (Screen 2) with simulated API", () => {
  const MANY =
    "Ecotourism; Sustainable Development; Environmental Education; Forest Genetic Diversity; Community Participation; Public Policies; Rural Tourism";

  test.beforeEach(async ({ page }) => {
    await mockThemeApi(page, [
      {
        match: (url, request) =>
          url.pathname === "/theme/candidates" &&
          request.method() === "POST",
        reply: (route) =>
          json(route, 200, {
            data: [
              {
                topic_id: "k1",
                name: "Finance, Taxation, and Governance",
                similarity_score: 0.5,
                keywords: MANY,
              },
              {
                topic_id: "k2",
                name: "Short keywords topic",
                similarity_score: 0.4,
                keywords: "policy; health;  ",
              },
              {
                topic_id: "k3",
                name: "No keywords topic",
                similarity_score: 0.3,
                keywords: null,
              },
            ],
            meta: { count: 3 },
          }),
      },
    ]);
    await page.goto("/theme-curation/new");
    await page.getByPlaceholder(/^Ej\./).fill("Eje de prueba");
    await page.getByPlaceholder(/^Describe el eje/).fill("ecoturismo");
    await page
      .getByRole("button", { name: "Buscar tópicos candidatos" })
      .click();
    await expect(page.getByText("No keywords topic")).toBeVisible();
  });

  const rowOf = (page, name) =>
    page.locator("tbody tr.ant-table-row", { hasText: name });

  test("shows the first 5 keywords and an ellipsis under the name", async ({
    page,
  }) => {
    const line = rowOf(page, "Finance, Taxation").getByTestId("topic-keywords");
    await expect(line).toHaveText(
      "Ecotourism, Sustainable Development, Environmental Education, Forest Genetic Diversity, Community Participation…",
    );
    const text = await line.innerText();
    expect(text).not.toContain("Public Policies");
  });

  test("the native tooltip lists all the keywords", async ({ page }) => {
    const line = rowOf(page, "Finance, Taxation").getByTestId("topic-keywords");
    await expect(line).toHaveAttribute(
      "title",
      "Ecotourism, Sustainable Development, Environmental Education, Forest Genetic Diversity, Community Participation, Public Policies, Rural Tourism",
    );
  });

  test("shows all the keywords without an ellipsis when there are 5 or fewer", async ({
    page,
  }) => {
    const line = rowOf(page, "Short keywords").getByTestId("topic-keywords");
    await expect(line).toHaveText("policy, health");
  });

  test("shows no keywords line when the topic has none", async ({ page }) => {
    await expect(
      rowOf(page, "No keywords topic").getByTestId("topic-keywords"),
    ).toHaveCount(0);
  });

  test("the keywords line is one line and does not widen the row", async ({
    page,
  }) => {
    const line = rowOf(page, "Finance, Taxation").getByTestId("topic-keywords");
    const box = await line.boundingBox();
    expect(box.height).toBeLessThan(24);
    expect(box.width).toBeLessThanOrEqual(481);
  });

  test("clicking the name still opens the detail modal", async ({ page }) => {
    await page
      .getByRole("button", { name: "Finance, Taxation, and Governance" })
      .click();
    await expect(page.getByRole("dialog")).toContainText("Palabras clave:");
  });
});
