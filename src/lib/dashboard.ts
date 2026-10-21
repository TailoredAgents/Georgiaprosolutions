import "server-only";
import { db } from "./db";
export type Inquiry = {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  location: string;
  message: string;
  status: string;
  created_at: string;
  notification_status: string;
};
export type DashboardData = {
  mode: "sample" | "live";
  connected: boolean;
  days: number;
  visits: number;
  pageviews: number;
  unique: number;
  quotes: number;
  daily: { date: string; visits: number; inquiries: number }[];
  pages: { name: string; value: number }[];
  sources: { name: string; value: number }[];
  devices: { name: string; value: number }[];
  inquiries: Inquiry[];
};
export function dateDays(days: number) {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - days + 1 + i);
    return d.toISOString().slice(0, 10);
  });
}
export function sampleDashboard(days: number): DashboardData {
  const dates = dateDays(days);
  const daily = dates.map((date, i) => ({
    date,
    visits: 24 + ((i * 13 + 7) % 36) + Math.floor(i / 7) * 3,
    inquiries: i % 3 === 0 ? 2 : i % 4 === 0 ? 1 : 0,
  }));
  const visits = daily.reduce((s, d) => s + d.visits, 0),
    quotes = daily.reduce((s, d) => s + d.inquiries, 0),
    pageviews = Math.round(visits * 1.74);
  const split = (total: number, weights: number[]) => {
    const values = weights.map((w) => Math.floor(total * w));
    values[0] += total - values.reduce((a, b) => a + b, 0);
    return values;
  };
  const pages = split(pageviews, [0.42, 0.25, 0.16, 0.1, 0.07]);
  const sources = split(visits, [0.46, 0.28, 0.18, 0.08]);
  const devices = split(visits, [0.68, 0.27, 0.05]);
  return {
    mode: "sample",
    connected: false,
    days,
    visits,
    pageviews,
    unique: Math.round(visits * 0.79),
    quotes,
    daily,
    pages: ["Home", "Services", "Contact", "Our Work", "About Us"].map(
      (name, i) => ({ name, value: pages[i] }),
    ),
    sources: ["Search", "Direct", "Social", "Referral"].map((name, i) => ({
      name,
      value: sources[i],
    })),
    devices: ["Mobile", "Desktop", "Tablet"].map((name, i) => ({
      name,
      value: devices[i],
    })),
    inquiries: Array.from({ length: 5 }, (_, i) => ({
      id: `sample-${i + 1}`,
      name: `Sample customer ${String.fromCharCode(65 + i)}`,
      phone: `(202) 555-010${i}`,
      email: `sample-${i + 1}@example.invalid`,
      service: [
        "lawn-care",
        "pressure-washing",
        "junk-removal",
        "lawn-care",
        "other",
      ][i],
      location: "Illustrative property location",
      message: [
        "I would like to discuss lawn care for my property.",
        "Interested in exterior cleaning. Please discuss suitable surfaces and availability.",
        "I have some unwanted items to remove. Can we discuss the materials and access?",
        "Looking for help keeping the yard maintained.",
        "I have a few different property projects to discuss.",
      ][i],
      status: ["new", "new", "contacted", "scheduled", "closed"][i],
      created_at: `${dates[Math.max(0, dates.length - 1 - i)]}T14:30:00Z`,
      notification_status: "off",
    })),
  };
}
export async function getDashboard(
  days: number,
  mode: "sample" | "live",
): Promise<DashboardData> {
  if (mode === "sample") return sampleDashboard(days);
  const empty: DashboardData = {
    mode,
    connected: false,
    days,
    visits: 0,
    pageviews: 0,
    unique: 0,
    quotes: 0,
    daily: dateDays(days).map((date) => ({ date, visits: 0, inquiries: 0 })),
    pages: [],
    sources: [],
    devices: [],
    inquiries: [],
  };
  if (!process.env.DATABASE_URL) return empty;
  const date = dateDays(days)[0];
  const pool = db();
  const [totals, leads, daily, pages, sources, devices] = await Promise.all([
    pool.query(
      `SELECT COUNT(*) FILTER (WHERE event_type='pageview')::int AS pageviews,COUNT(DISTINCT visit_hash)::int AS visits,COUNT(DISTINCT visitor_hash)::int AS unique FROM analytics_events WHERE created_at >= $1::date`,
      [date],
    ),
    pool.query(
      "SELECT * FROM inquiries WHERE created_at >= $1::date ORDER BY created_at DESC LIMIT 2000",
      [date],
    ),
    pool.query(
      `WITH events AS (SELECT (created_at AT TIME ZONE 'UTC')::date AS day,COUNT(DISTINCT visit_hash)::int AS visits FROM analytics_events WHERE event_type='pageview' AND created_at >= $1::date GROUP BY 1), leads AS (SELECT (created_at AT TIME ZONE 'UTC')::date AS day,COUNT(*)::int AS inquiries FROM inquiries WHERE created_at >= $1::date GROUP BY 1) SELECT to_char(d,'YYYY-MM-DD') AS date,COALESCE(e.visits,0)::int AS visits,COALESCE(l.inquiries,0)::int AS inquiries FROM generate_series($1::date,CURRENT_DATE,'1 day') d LEFT JOIN events e ON e.day=d LEFT JOIN leads l ON l.day=d ORDER BY d`,
      [date],
    ),
    pool.query(
      `SELECT path AS name,COUNT(*)::int AS value FROM analytics_events WHERE event_type='pageview' AND created_at >= $1::date GROUP BY path ORDER BY value DESC`,
      [date],
    ),
    pool.query(
      `SELECT source AS name,COUNT(*)::int AS value FROM (SELECT DISTINCT ON (visit_hash) visit_hash,source FROM analytics_events WHERE event_type='pageview' AND visit_hash IS NOT NULL AND created_at >= $1::date ORDER BY visit_hash,created_at) v GROUP BY source ORDER BY value DESC`,
      [date],
    ),
    pool.query(
      `SELECT device AS name,COUNT(*)::int AS value FROM (SELECT DISTINCT ON (visit_hash) visit_hash,device FROM analytics_events WHERE event_type='pageview' AND visit_hash IS NOT NULL AND created_at >= $1::date ORDER BY visit_hash,created_at) v GROUP BY device ORDER BY value DESC`,
      [date],
    ),
  ]);
  const quoteCount = await pool.query(
    "SELECT COUNT(*)::int AS count FROM inquiries WHERE created_at >= $1::date",
    [date],
  );
  return {
    ...empty,
    connected: true,
    ...totals.rows[0],
    quotes: quoteCount.rows[0].count,
    daily: daily.rows,
    pages: pages.rows,
    sources: sources.rows,
    devices: devices.rows,
    inquiries: leads.rows.map((i) => ({
      ...i,
      created_at: new Date(i.created_at).toISOString(),
    })),
  };
}
