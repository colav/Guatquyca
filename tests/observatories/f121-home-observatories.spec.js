/*
 * F121 (D-263): home of the observatories with the approved texts and the three boards as direct links, named as their tabs. Needs the dev
 * server of Luis on 3000 (no bundle is read).
 */
import { test, expect } from "@playwright/test";

import { BOARD_TABS } from "../../app/observatories/vri-udea/components/BoardTabs";

const LINKS = [
  ["board-1", "Masa crítica temática", "/observatories/vri-udea/board-1", "Capacidad de la UdeA en cada tópico frente a una institución de referencia, y su relación con ODS, territorios y actores no académicos."],
  ["board-2", "Colaboración, redes y hélices", "/observatories/vri-udea/board-2", "Con quién colabora: grupos, organizaciones no académicas, hélices, territorios y países."],
  ["board-3", "Capacidades de base UdeA", "/observatories/vri-udea/board-3", "Talento, producción e infraestructura abierta."],
];

test.beforeAll(async () => {
  let up = true;
  try {
    await fetch("http://localhost:3000/observatories");
  } catch {
    up = false;
  }
  test.skip(!up, "Nothing listens on localhost:3000: ask Luis to start `npm run dev`.");
});

test("the names of the links are the names of the tabs", () => {
  expect(BOARD_TABS.map((t) => [t.label, t.href])).toEqual(LINKS.map((l) => [l[1], l[2]]));
});

test("the home has the new texts and no old text", async ({ page }) => {
  await page.goto("/observatories");
  const main = page.locator("main, body").first();
  await expect(page.getByText("Espacios de consulta construidos con datos de ImpactU, en coordinación con dependencias e instituciones. Cada observatorio reúne tableros para explorar, filtrar y comparar.")).toBeVisible();
  await expect(page.getByText("Capacidades de investigación de la UdeA")).toBeVisible();
  await expect(page.getByText("VRI-UdeA", { exact: true })).toBeVisible();
  await expect(page.getByText("Dónde tiene la Universidad de Antioquia masa crítica, con quién colabora y qué bases sostienen su investigación. Producción 2010–2026 de ImpactU, con citas y referentes de OpenAlex.")).toBeVisible();
  await expect(page.getByText("Las fuentes y las fechas de corte están al pie de cada tablero.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Abrir observatorio" })).toHaveAttribute("href", "/observatories/vri-udea");
  const text = await main.innerText();
  expect(text).not.toMatch(/Aquí estarán|NaN|undefined/);
});

test("three links with their routes and descriptions; usable with the keyboard; no sideways scroll at 1440, 1280 and 768", async ({ page }) => {
  for (const width of [1440, 1280, 768]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/observatories");
    for (const [key, title, href, description] of LINKS) {
      const link = page.getByTestId(`board-link-${key}`);
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("href", href);
      await expect(link).toContainText(title);
      await expect(link).toContainText(description);
      await expect(page.getByRole("link", { name: new RegExp(title) })).toBeVisible();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth), `${width} sideways`).toBeLessThanOrEqual(0);
  }
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/observatories");
  await page.getByTestId("board-link-board-2").focus();
  await expect(page.getByTestId("board-link-board-2")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/observatories\/vri-udea\/board-2$/);
});
