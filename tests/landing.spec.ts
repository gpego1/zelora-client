import { test, expect } from "@playwright/test";

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`layout and real anchor destinations at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    expect(
      await page.locator('a[href^="#"]').evaluateAll((links) =>
        links.every((link) => {
          const id = link.getAttribute("href")?.slice(1);
          return !!id && !!document.getElementById(id);
        }),
      ),
    ).toBe(true);
    expect(errors).toEqual([]);
    if (width === 320 || width === 1440) {
      await page.screenshot({
        path: `.artifacts/landing-${width}.png`,
        fullPage: true,
      });
      await page.screenshot({ path: `.artifacts/hero-${width}.png` });
      await page
        .locator(".preview-scene")
        .screenshot({ path: `.artifacts/preview-${width}.png` });
      await page
        .locator(".interest-layout")
        .screenshot({ path: `.artifacts/form-${width}.png` });
    }
  });
}

test("demo validates, preserves input, and never sends a lead", async ({
  page,
}) => {
  const posts: string[] = [];
  page.on("request", (request) => {
    if (request.method() === "POST") posts.push(request.url());
  });
  await page.goto("/");
  const form = page.locator("form");
  await form.getByRole("button").click();
  await expect(page.getByLabel("Seu nome")).toBeFocused();
  await expect(
    page.getByText("Informe um e-mail válido, como nome@exemplo.com."),
  ).toBeVisible();
  await page.getByLabel("Seu nome").fill("Ana Teste");
  await page.getByRole("textbox", { name: /E-mail/ }).fill("ana@example.com");
  await page.getByLabel("Tipo de estabelecimento").selectOption("Barbearia");
  await page.getByLabel("WhatsApp").fill("123");
  await form.getByRole("button").click();
  await expect(page.getByLabel("WhatsApp")).toBeFocused();
  await expect(page.getByLabel("Seu nome")).toHaveValue("Ana Teste");
  await page.getByLabel("WhatsApp").fill("+55 (11) 99999-9999");
  await form.getByRole("button").click();
  await expect(page.getByRole("status")).toContainText(
    "Nenhum dado foi enviado ou armazenado",
  );
  await form.getByRole("button").click();
  expect(posts).toEqual([]);
  expect(await page.evaluate(() => localStorage.length)).toBe(0);
  await page.getByLabel("WhatsApp").fill("");
  await form.getByRole("button").click();
  await expect(page.getByRole("status")).toContainText("Campos validados");
});

test("mobile menu and FAQ support keyboard interaction", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Abrir menu" });
  await menu.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("button", { name: "Fechar menu" }),
  ).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Tab");
  await expect(
    page
      .getByRole("navigation", { name: "Navegação no celular" })
      .getByRole("link")
      .first(),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await menu.click();
  await page
    .getByRole("navigation", { name: "Navegação no celular" })
    .getByRole("link", { name: "Como funciona" })
    .click();
  await expect(page).toHaveURL(/#como-funciona$/);
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  const summary = page.locator("summary").first();
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("details").first()).toHaveAttribute("open", "");
  await page.keyboard.press("Enter");
  await expect(page.locator("details").first()).not.toHaveAttribute("open");
});

test("metadata, language and reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page).toHaveTitle(/Zelora/);
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Pular para o conteúdo" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    /Zelora/,
  );
});
