import { test, expect } from "@playwright/test";
import {
  LONG_SEED_ALERT,
  TRUNCATED_SEED_ALERT,
  json,
  mockThemeApi,
} from "./theme-curation-helpers";

test.describe("Testing the long-seed alert (truncated) with simulated API", () => {
  const candidates = (truncated) => ({
    match: (url, request) =>
      url.pathname === "/theme/candidates" && request.method() === "POST",
    reply: (route) =>
      json(route, 200, {
        data: [
          {
            topic_id: "1",
            name: "Topic one",
            similarity_score: 0.51,
            subfield_name: "S",
          },
          {
            topic_id: "2",
            name: "Topic two",
            similarity_score: 0.42,
            subfield_name: "S",
          },
        ],
        total_results: 2,
        ...(truncated === undefined ? {} : { truncated }),
      }),
  });

  const cases = [
    { label: "truncated true", truncated: true, alert: true },
    { label: "truncated false", truncated: false, alert: false },
    { label: "truncated absent", truncated: undefined, alert: false },
  ];

  for (const { label, truncated, alert } of cases) {
    test.describe(label, () => {
      test.beforeEach(async ({ page }) => {
        await mockThemeApi(page, [candidates(truncated)]);
        await page.goto("/theme-curation/new");
        await page.getByPlaceholder(/^Ej\./).fill("Eje de prueba");
        await page
          .getByPlaceholder(/^Describe el eje/)
          .fill("energia solar fotovoltaica");
      });

      test("step 1 shows no alert with a short seed", async ({ page }) => {
        await expect(page.locator("body")).not.toContainText(
          "más larga de lo recomendado",
        );
      });

      test(`step 2 ${alert ? "shows" : "does not show"} the alert`, async ({
        page,
      }) => {
        await page
          .getByRole("button", { name: "Buscar tópicos candidatos" })
          .click();
        await expect(page.getByText("Topic one")).toBeVisible();
        if (alert) {
          await expect(page.locator("body")).toContainText(TRUNCATED_SEED_ALERT);
        } else {
          await expect(page.locator("body")).not.toContainText(
            TRUNCATED_SEED_ALERT,
          );
        }
      });

      if (alert) {
        test("going back keeps the alert on step 1", async ({ page }) => {
          await page
            .getByRole("button", { name: "Buscar tópicos candidatos" })
            .click();
          await expect(page.getByText("Topic one")).toBeVisible();
          await page.getByRole("button", { name: "Volver" }).click();
          await expect(page.getByPlaceholder(/^Describe el eje/)).toBeVisible();
          await expect(page.locator("body")).toContainText(TRUNCATED_SEED_ALERT);
        });

        test("editing the seed drops the stale alert", async ({ page }) => {
          await page
            .getByRole("button", { name: "Buscar tópicos candidatos" })
            .click();
          await expect(page.getByText("Topic one")).toBeVisible();
          await page.getByRole("button", { name: "Volver" }).click();
          await page
            .getByPlaceholder(/^Describe el eje/)
            .fill("energia solar fotovoltaica y almacenamiento");
          await expect(page.locator("body")).not.toContainText(
            TRUNCATED_SEED_ALERT,
          );
        });
      }
    });
  }

  test.describe("character count", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/theme-curation/new");
    });

    test("alerts once, with the exact text, over 1.800 characters", async ({
      page,
    }) => {
      await page.getByPlaceholder(/^Describe el eje/).fill("x".repeat(1801));
      await expect(
        page.locator(".ant-alert-message", { hasText: LONG_SEED_ALERT }),
      ).toHaveCount(1);
    });

    test("a seed over 1.800 characters that the backend also truncated shows only the truncated alert", async ({
      page,
    }) => {
      await mockThemeApi(page, [candidates(true)]);
      await page.getByPlaceholder(/^Ej\./).fill("Eje de prueba");
      await page.getByPlaceholder(/^Describe el eje/).fill("x".repeat(1801));
      await page
        .getByRole("button", { name: "Buscar tópicos candidatos" })
        .click();
      await expect(page.getByText("Topic one")).toBeVisible();
      await page.getByRole("button", { name: "Volver" }).click();
      await expect(
        page.locator(".ant-alert-message", { hasText: TRUNCATED_SEED_ALERT }),
      ).toHaveCount(1);
      await expect(page.locator("body")).not.toContainText(LONG_SEED_ALERT);
    });

    test("does not alert at exactly 1.800 characters", async ({ page }) => {
      await page.getByPlaceholder(/^Describe el eje/).fill("x".repeat(1800));
      await expect(page.locator("body")).not.toContainText(
        "más larga de lo recomendado",
      );
    });

    test("shows the counter in characters with a dot as thousands separator", async ({
      page,
    }) => {
      await page.getByPlaceholder(/^Describe el eje/).fill("x".repeat(1234));
      await expect(page.locator("body")).toContainText(
        "1.234/1.800 caracteres",
      );
    });

    test("counts line breaks as characters", async ({ page }) => {
      await page.getByPlaceholder(/^Describe el eje/).fill("ab\ncd");
      await expect(page.locator("body")).toContainText("5/1.800 caracteres");
    });
  });
});
