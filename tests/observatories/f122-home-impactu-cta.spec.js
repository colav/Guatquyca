/*
 * F122 (D-263): call to action to the observatories in the home of ImpactU, between «Nuestros datos» and «Boletines ImpactU». The rest of the
 * home keeps its sections and its order. Needs the dev server of Luis on 3000 (and the API of ImpactU that the home reads).
 */
import { test, expect } from "@playwright/test";

test.beforeAll(async () => {
  let up = true;
  try {
    await fetch("http://localhost:3000/");
  } catch {
    up = false;
  }
  test.skip(!up, "Nothing listens on localhost:3000: ask Luis to start `npm run dev`.");
});

test("the section is between «Nuestros datos» and «Boletines ImpactU»; the other headings keep their order", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("observatories-cta").waitFor({ timeout: 90000 });
  const headings = await page.locator("main h1, main h2, h1, h2").evaluateAll((els) => [...new Set(els.map((e) => e.textContent.replace(/\s+/g, " ").trim()))]);
  const i = (re) => headings.findIndex((h) => re.test(h));
  const [data, cta, news, ask] = [i(/^Nuestros datos/), i(/^Observatorios ImpactU/), i(/^Boletines ImpactU/), i(/^¿Quieres descubrir/)];
  expect([data, cta, news, ask].every((n) => n >= 0), JSON.stringify(headings)).toBe(true);
  expect(data).toBeLessThan(cta);
  expect(cta).toBe(data + 1);
  expect(news).toBe(cta + 1);
  expect(news).toBeLessThan(ask);
  /* without the new heading the sequence is the one of before */
  const without = headings.filter((_, k) => k !== cta);
  expect(without.indexOf("Bienvenido a ImpactU")).toBeLessThan(without.findIndex((h) => /^Nuestros datos/.test(h)));
  expect(without.findIndex((h) => /^Nuestros datos/.test(h)) + 1).toBe(without.findIndex((h) => /^Boletines ImpactU/.test(h)));
});

test("texts, chips and the two links; usable with the keyboard; no sideways scroll at 1440, 1280 and 768", async ({ page }) => {
  for (const width of [1440, 1280, 768]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const cta = page.getByTestId("observatories-cta");
    await expect(cta).toContainText("Observatorios ImpactU");
    await expect(cta).toContainText("Explora cómo investiga la Universidad de Antioquia: sus capacidades por tema, sus colaboraciones y las bases que sostienen su producción.");
    const chips = await cta.getByRole("listitem").allInnerTexts();
    expect(chips).toEqual(["Masa crítica temática", "Colaboración, redes y hélices", "Capacidades de base UdeA"]);
    await expect(cta.getByRole("link", { name: /Explorar el observatorio/ })).toHaveAttribute("href", "/observatories/vri-udea");
    await expect(cta.getByRole("link", { name: "Ver todos los observatorios" })).toHaveAttribute("href", "/observatories");
    expect(await cta.innerText()).not.toMatch(/NaN|undefined/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth), `${width} sideways`).toBeLessThanOrEqual(0);
  }
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  await page.getByTestId("observatories-cta").getByRole("link", { name: "Ver todos los observatorios" }).focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/observatories$/, { timeout: 90000 });
});

test("contrast of the texts on the band (4.5:1 or more) and the animation is off with prefers-reduced-motion", async ({ browser }) => {
  const measure = (page) =>
    page.getByTestId("observatories-cta").evaluate((el) => {
      const lum = ([r, g, b]) => [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }).reduce((a, v, k) => a + v * [0.2126, 0.7152, 0.0722][k], 0);
      const rgb = (s) => s.match(/[\d.]+/g).slice(0, 3).map(Number);
      const ratio = (fg, bg) => { const [a, b] = [lum(fg), lum(bg)].sort((x, y) => y - x); return (a + 0.05) / (b + 0.05); };
      /* worst case: the darkest end of the gradient, #dbe9f5 */
      const bg = [0xdb, 0xe9, 0xf5];
      const p = el.querySelector("p");
      const link = el.querySelector("a:last-of-type");
      const btn = el.querySelector("button");
      return {
        text: ratio(rgb(getComputedStyle(p).color), bg),
        link: ratio(rgb(getComputedStyle(link).color), bg),
        /* gradient #2b5f9e → #0b7a89: the lightest point is the turquoise end */
        button: ratio(rgb(getComputedStyle(btn).color), [0x0b, 0x7a, 0x89]),
        buttonImage: getComputedStyle(btn).backgroundImage,
        animation: getComputedStyle(el, "::before").animationName,
      };
    });
  const normal = await browser.newPage();
  await normal.goto("http://localhost:3000/");
  const a = await measure(normal);
  await normal.close();
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const reduced = await ctx.newPage();
  await reduced.goto("http://localhost:3000/");
  const b = await measure(reduced);
  await ctx.close();
  console.log(`[real] contrast text ${a.text.toFixed(2)}, link ${a.link.toFixed(2)}, button ${a.button.toFixed(2)}; animation normal «${a.animation}», reduced «${b.animation}»`);
  for (const k of ["text", "link", "button"]) expect(a[k], k).toBeGreaterThanOrEqual(4.5);
  expect(a.buttonImage).toContain("linear-gradient");
  expect(a.animation).not.toBe("none");
  expect(b.animation).toBe("none");
});

/* The site's primary color is orange: the button of the section keeps its gradient on hover, focus and press. */
test("the button keeps the blue-turquoise gradient and white text on hover, keyboard focus and press", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  const btn = page.getByTestId("observatories-cta").getByRole("button", { name: /Explorar el observatorio/ });
  const style = () => btn.evaluate((el) => { const s = getComputedStyle(el); return { image: s.backgroundImage, color: s.color, border: s.borderTopWidth }; });
  const states = {};
  states.rest = await style();
  await btn.hover();
  await page.waitForTimeout(400);
  states.hover = await style();
  await page.mouse.move(0, 0);
  await btn.focus();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Shift+Tab");
  await page.waitForTimeout(400);
  states.focus = await style();
  await page.mouse.move(0, 0);
  await btn.hover();
  await page.mouse.down();
  await page.waitForTimeout(300);
  states.press = await style();
  await page.mouse.up();
  console.log(`[real] ${JSON.stringify(states)}`);
  for (const [name, s] of Object.entries(states)) {
    expect(s.image, name).toContain("linear-gradient");
    expect(s.image, name).not.toMatch(/255, 140|orange/i);
    expect(s.color, name).toBe("rgb(255, 255, 255)");
    expect(s.border, name).toBe("0px");
  }
  /* the hover lightens: its first color is lighter than the one at rest */
  const first = (img) => img.match(/[0-9]+/g).slice(1, 4).map(Number).reduce((a, v) => a + v, 0); /* the three numbers of the first rgb(...) after «135deg» */
  expect(first(states.hover.image)).toBeGreaterThan(first(states.rest.image) + 60);
  expect(states.hover.image).toContain("rgb(51, 128, 208)");
});
