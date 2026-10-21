import { test, expect } from "@playwright/test";
import { readFileSync, mkdirSync } from "node:fs";
const qa = JSON.parse(readFileSync("qa/runtime.json", "utf8"));
const routes = ["/", "/services", "/our-work", "/about", "/contact"];
mkdirSync("qa/screenshots", { recursive: true });
for (const width of [375, 430, 768, 1440])
  test(`public pages render without overflow or missing images at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    for (const route of routes) {
      const res = await page.goto(route);
      expect(res?.status()).toBe(200);
      await expect(page.locator("h1")).toBeVisible();
      await page.evaluate(async () => {
        await document.fonts.ready;
        const images = Array.from(document.images);
        for (const img of images) {
          img.loading = "eager";
        }
        await Promise.all(images.map((img) => img.decode().catch(() => {})));
      });
      const bad = await page
        .locator("img")
        .evaluateAll((imgs) =>
          imgs
            .filter((i) => !(i as HTMLImageElement).naturalWidth)
            .map((i) => i.getAttribute("src")),
        );
      expect(bad).toEqual([]);
      const size = await page.evaluate(() => ({
        scroll: document.documentElement.scrollWidth,
        width: window.innerWidth,
      }));
      expect(size.scroll).toBeLessThanOrEqual(size.width);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.screenshot({
        path: `qa/screenshots/${route === "/" ? "home" : route.slice(1)}-${width}.png`,
        fullPage: true,
      });
    }
    if (width === 1440) {
      await page.goto("/");
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all(
          Array.from(document.images).map((i) => i.decode().catch(() => {})),
        );
      });
      await page.screenshot({ path: "qa/screenshots/home-desktop.png" });
    }
    expect(errors).toEqual([]);
  });
test("mobile menu, service anchors, gallery filters and keyboard lightbox", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Services" })
    .click();
  await expect(page).toHaveURL(/\/services$/);
  await page
    .locator(".service-jump")
    .getByRole("link", { name: "Pressure washing" })
    .click();
  await expect(page).toHaveURL(/#pressure-washing$/);
  await page.goto("/our-work");
  await page
    .getByRole("button", { name: "Exterior cleaning", exact: true })
    .click();
  await expect(page.locator(".gallery-item")).toHaveCount(1);
  await page.locator(".gallery-item").click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button", { name: /^All/ }).click();
  await page.locator(".gallery-item").first().click();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator(".lightbox-bottom")).toContainText("2 / 5");
  await page.keyboard.press("Escape");
});
test("estimate validates and previews without storing or sending", async ({
  page,
  request,
}) => {
  await page.goto("/contact?service=pressure-washing");
  await expect(page.locator("select[name=service]")).toHaveValue(
    "pressure-washing",
  );
  await page.getByRole("button", { name: "Preview Estimate Request" }).click();
  await expect(page.locator("input[name=name]:invalid")).toHaveCount(1);
  await page.getByLabel("Your name").fill("Preview Test");
  await page.getByLabel("Phone number").fill("2025550100");
  await page.getByLabel("Email address").fill("preview@example.invalid");
  await page.getByLabel("Property location or ZIP").fill("31003");
  await page
    .getByLabel("Tell us about your project")
    .fill("Illustrative preview project, no request should be stored.");
  await page.getByRole("checkbox").check();
  await page.waitForTimeout(1600);
  await page.getByRole("button", { name: "Preview Estimate Request" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Your details were not saved or emailed",
  );
  const bad = await request.post("/api/inquiries", {
    headers: { Origin: "http://localhost:43188" },
    data: { name: "A" },
  });
  expect(bad.status()).toBe(400);
  const cross = await request.post("/api/inquiries", {
    headers: { Origin: "https://unrelated.invalid" },
    data: {},
  });
  expect(cross.status()).toBe(403);
});
test("admin endpoints require authorization; login, sample dates, live empty, export, status, logout", async ({
  page,
  request,
}) => {
  for (const path of [
    "/api/admin/dashboard?days=30&mode=sample",
    "/api/admin/export?days=30&mode=sample",
  ])
    expect((await request.get(path)).status()).toBe(401);
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login$/);
  await page.getByLabel("Email address").fill(qa.email);
  await page
    .getByLabel("Password", { exact: true })
    .fill(qa.password + "wrong");
  await page.getByRole("button", { name: "Sign In", exact: true }).click();
  await expect(page.locator(".form-error[role=alert]")).toContainText(
    "incorrect",
  );
  await page.getByLabel("Password", { exact: true }).fill(qa.password);
  await page.getByRole("button", { name: "Sign In", exact: true }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await expect(
    page.getByText("Sample Analytics — Illustrative Data"),
  ).toBeVisible();
  for (const width of [375, 430, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.screenshot({
      path: `qa/screenshots/admin-${width}.png`,
      fullPage: true,
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.getByLabel("Date range").selectOption("7");
  await expect(
    page.getByText("Website visits over the last 7 days"),
  ).toBeVisible();
  await page.getByLabel("Analytics data mode").selectOption("live");
  await expect(
    page.getByText("Live analytics — Awaiting database setup"),
  ).toBeVisible();
  await expect(page.locator(".kpi-0>strong")).toHaveText("0");
  await page.getByLabel("Analytics data mode").selectOption("sample");
  await expect(
    page.getByText("Sample Analytics — Illustrative Data"),
  ).toBeVisible();
  await page.getByRole("button", { name: "All inquiries" }).click();
  await page
    .getByRole("button", { name: /Open inquiry from Sample customer A/ })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("combobox")
    .selectOption("contacted");
  await expect(page.getByRole("status")).toContainText("Sample status updated");
  await page.getByRole("button", { name: "Close inquiry" }).click();
  const csv = await page.request.get("/api/admin/export?mode=sample&days=7");
  expect(csv.status()).toBe(200);
  expect(await csv.text()).toContain("ILLUSTRATIVE SAMPLE");
  const cookie = (await page.context().cookies()).find(
    (c) => c.name === "__Host-gps_session",
  );
  expect(cookie?.httpOnly).toBe(true);
  expect(cookie?.sameSite).toBe("Strict");
  const oldCookie = `__Host-gps_session=${cookie?.value}`;
  await page
    .getByRole("button", { name: "Sign out", exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(/\/admin\/login$/);
  const invalidated = await request.get(
    "/api/admin/dashboard?days=30&mode=sample",
    { headers: { Cookie: oldCookie } },
  );
  expect(invalidated.status()).toBe(401);
});
test("preview remains noindex and does not collect analytics", async ({
  request,
}) => {
  const home = await request.get("/");
  expect(home.headers()["x-robots-tag"]).toContain("noindex");
  expect(await (await request.get("/robots.txt")).text()).toContain(
    "Disallow: /",
  );
  expect(await (await request.get("/sitemap.xml")).text()).not.toContain(
    "<loc>",
  );
  const event = await request.post("/api/events", {
    headers: { Origin: "http://localhost:43188" },
    data: {},
  });
  expect(await event.json()).toEqual({ collected: false });
});

test("public pages deliver unique server metadata, canonical URLs and branded sharing cards", async ({
  page,
  request,
}) => {
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  for (const route of [...routes, "/privacy"]) {
    const response = await page.goto(route);
    const html = await response!.text();
    // Search and sharing metadata must be present before browser JavaScript runs.
    expect(html).toContain('property="og:title"');
    expect(html).toContain('rel="canonical"');
    const title = await page.title();
    const description = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(title).toContain("Georgia Pro Solutions");
    expect(description!.length).toBeGreaterThan(60);
    titles.add(title);
    descriptions.add(description!);
    const canonical = await page
      .locator('link[rel="canonical"]')
      .getAttribute("href");
    const sharingUrl = await page
      .locator('meta[property="og:url"]')
      .getAttribute("content");
    expect(new URL(canonical!).href).toBe(
      new URL(route, "http://localhost:43188").href,
    );
    expect(new URL(sharingUrl!).href).toBe(
      new URL(route, "http://localhost:43188").href,
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      title,
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
    const image = await page
      .locator('meta[property="og:image"]')
      .first()
      .getAttribute("content");
    expect(image).toMatch(/^http:\/\/localhost:43188\/opengraph-image/);
  }
  expect(titles.size).toBe(routes.length + 1);
  expect(descriptions.size).toBe(routes.length + 1);
  const image = await request.get("/opengraph-image");
  expect(image.status()).toBe(200);
  expect(image.headers()["content-type"]).toContain("image/png");
  const body = await image.body();
  expect(body.readUInt32BE(16)).toBe(1200);
  expect(body.readUInt32BE(20)).toBe(630);
  await page.goto("/");
  const hero = page.locator(".hero-main-photo img");
  await expect(hero).toHaveAttribute("loading", "eager");
  await expect(hero).toHaveAttribute("fetchpriority", "high");
});
