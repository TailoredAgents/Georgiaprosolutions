import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { Pool } from "pg";
import { randomUUID } from "node:crypto";
const qa = JSON.parse(readFileSync("qa/runtime.json", "utf8"));
const origin = "http://localhost:43189";
test.beforeAll(async () => {
  const p = new Pool({ connectionString: qa.databaseUrl });
  try {
    await p.query(
      "TRUNCATE inquiries,analytics_events,admin_sessions,rate_limits RESTART IDENTITY",
    );
  } finally {
    await p.end();
  }
});
test("production inquiry transaction, anonymous events, real analytics, lead management, CSV and session invalidation", async ({
  request,
}) => {
  const pool = new Pool({ connectionString: qa.databaseUrl });
  try {
    const valid = {
      name: "Production QA",
      phone: "2025550100",
      email: "qa@example.invalid",
      service: "lawn-care",
      location: "Allentown test location",
      message: "A test inquiry in the isolated QA database.",
      consent: "yes",
      website: "",
      startedAt: Date.now() - 10000,
    };
    const fail = await request.post(origin + "/api/inquiries", {
      headers: { Origin: origin },
      data: { ...valid, website: "spam.example" },
    });
    expect(fail.status()).toBe(400);
    expect(
      (await pool.query("SELECT COUNT(*)::int n FROM inquiries")).rows[0].n,
    ).toBe(0);
    const saved = await request.post(origin + "/api/inquiries", {
      headers: { Origin: origin },
      data: valid,
    });
    expect(saved.status()).toBe(200);
    expect(await saved.json()).toEqual({
      ok: true,
      preview: false,
      stored: true,
      emailSent: false,
    });
    const inquiry = (await pool.query("SELECT * FROM inquiries")).rows[0];
    expect(inquiry.name).toBe(valid.name);
    expect(inquiry.notification_status).toBe("off");
    expect(
      (
        await pool.query(
          "SELECT COUNT(*)::int n FROM analytics_events WHERE event_type='inquiry'",
        )
      ).rows[0].n,
    ).toBe(1);
    const event = {
      consent: true,
      type: "pageview",
      path: "/services",
      visitorId: randomUUID(),
      visitId: randomUUID(),
      device: "mobile",
      referrer: "google.com",
      utmSource: null,
    };
    const blocked = await request.post(origin + "/api/events", {
      headers: { Origin: origin, DNT: "1" },
      data: event,
    });
    expect(await blocked.json()).toEqual({ collected: false });
    expect(
      (
        await pool.query(
          "SELECT COUNT(*)::int n FROM analytics_events WHERE event_type='pageview'",
        )
      ).rows[0].n,
    ).toBe(0);
    const added = await request.post(origin + "/api/events", {
      headers: { Origin: origin },
      data: event,
    });
    expect(await added.json()).toEqual({ collected: true });
    const row = (
      await pool.query(
        "SELECT * FROM analytics_events WHERE event_type='pageview'",
      )
    ).rows[0];
    expect(row.visitor_hash).not.toBe(event.visitorId);
    expect(row.visit_hash).not.toBe(event.visitId);
    expect(row.source).toBe("search");
    expect(row).not.toHaveProperty("ip");
    const forbidden = await request.post(origin + "/api/events", {
      headers: { Origin: origin },
      data: { ...event, path: "/admin" },
    });
    expect(forbidden.status()).toBe(400);
    const login = await request.post(origin + "/api/admin/login", {
      headers: { Origin: origin },
      data: { email: qa.email, password: qa.password },
    });
    expect(login.status()).toBe(200);
    const session = (await pool.query("SELECT * FROM admin_sessions")).rows[0];
    expect(session.token_hash).toHaveLength(64);
    const cookie = login.headers()["set-cookie"].split(";")[0];
    expect(session.token_hash).not.toBe(cookie.split("=")[1]);
    const metrics = await request.get(
      origin + "/api/admin/dashboard?days=30&mode=live",
      { headers: { Cookie: cookie } },
    );
    const data = await metrics.json();
    expect(data.connected).toBe(true);
    expect(data.pageviews).toBe(1);
    expect(data.visits).toBe(1);
    expect(data.quotes).toBe(1);
    expect(data.inquiries).toHaveLength(1);
    const changed = await request.patch(
      origin + `/api/admin/inquiries/${inquiry.id}`,
      {
        headers: { Cookie: cookie, Origin: origin },
        data: { status: "contacted" },
      },
    );
    expect(changed.status()).toBe(200);
    expect(
      (await pool.query("SELECT status FROM inquiries")).rows[0].status,
    ).toBe("contacted");
    const sample = await request.get(
      origin + "/api/admin/dashboard?days=7&mode=sample",
      { headers: { Cookie: cookie } },
    );
    expect((await sample.json()).mode).toBe("sample");
    expect(
      (await pool.query("SELECT COUNT(*)::int n FROM inquiries")).rows[0].n,
    ).toBe(1);
    await pool.query("UPDATE inquiries SET name=$1 WHERE id=$2", [
      '=HYPERLINK("test")',
      inquiry.id,
    ]);
    const csv = await request.get(
      origin + "/api/admin/export?days=30&mode=live",
      { headers: { Cookie: cookie } },
    );
    expect(await csv.text()).toContain("\"'=HYPERLINK");
    const cross = await request.patch(
      origin + `/api/admin/inquiries/${inquiry.id}`,
      {
        headers: { Cookie: cookie, Origin: "https://evil.invalid" },
        data: { status: "closed" },
      },
    );
    expect(cross.status()).toBe(403);
    const logout = await request.post(origin + "/api/admin/logout", {
      headers: { Cookie: cookie, Origin: origin },
    });
    expect(logout.status()).toBe(200);
    expect(
      (await pool.query("SELECT COUNT(*)::int n FROM admin_sessions")).rows[0]
        .n,
    ).toBe(0);
    expect(
      (
        await request.get(origin + "/api/admin/dashboard?days=30&mode=live", {
          headers: { Cookie: cookie },
        })
      ).status(),
    ).toBe(401);
  } finally {
    await pool.end();
  }
});
test("single administrator login is durably rate limited", async ({
  request,
}) => {
  let last;
  for (let i = 0; i < 12; i++) {
    last = await request.post(origin + "/api/admin/login", {
      headers: { Origin: origin },
      data: { email: qa.email, password: "deliberately-incorrect-qa-only" },
    });
  }
  expect(last?.status()).toBe(429);
});
test("visitor measurement waits for consent and excludes dashboard", async ({
  page,
}) => {
  await page.goto(origin + "/");
  await expect(
    page.getByRole("region", { name: "Analytics preference" }),
  ).toBeVisible();
  const before = await page.request.get(origin + "/api/health");
  expect(before.status()).toBe(200);
  await page.getByRole("button", { name: "Allow", exact: true }).click();
  await page.waitForResponse((r) => r.url().endsWith("/api/events"));
  await expect(
    page.getByRole("region", { name: "Analytics preference" }),
  ).toHaveCount(0);
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Services", exact: true })
    .click();
  await expect(page).toHaveURL(origin + "/services");
});
