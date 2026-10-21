"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import {
  LayoutDashboard,
  Inbox,
  ArrowUpRight,
  ArrowDownToLine,
  LogOut,
  Globe,
  MousePointer2,
  Users,
  Send,
  Smartphone,
  Monitor,
  Tablet,
  ArrowRight,
  Search,
  CalendarDays,
  X,
  ChevronRight,
  FlaskConical,
  Activity,
  LoaderCircle,
  Check,
} from "lucide-react";
import { Logo } from "@/components/ui";
import type { DashboardData, Inquiry } from "@/lib/dashboard";
const colors = ["#244d40", "#e6a44d", "#a0b5a4", "#d8dfd3"];
const serviceLabel = (s: string) =>
  ({
    "lawn-care": "Lawn Care",
    "pressure-washing": "Pressure Washing",
    "junk-removal": "Junk Removal",
    other: "Other Service",
  })[s] || s;
const format = (n: number) => n.toLocaleString("en-US");
function dateLabel(date: string) {
  return new Date(date + "T12:00:00Z").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
export function Dashboard({
  initial,
  preview,
}: {
  initial: DashboardData;
  preview: boolean;
}) {
  const [data, setData] = useState(initial);
  const [tab, setTab] = useState("overview");
  const [days, setDays] = useState(initial.days);
  const [mode, setMode] = useState(initial.mode);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [saved, setSaved] = useState(false);
  const router = useRouter();
  const sample = mode === "sample";
  const conversion = data.visits
    ? ((data.quotes / data.visits) * 100).toFixed(1)
    : "0.0";
  async function load(nextDays: number, nextMode: "sample" | "live") {
    setBusy(true);
    setError("");
    try {
      const r = await fetch(
        `/api/admin/dashboard?days=${nextDays}&mode=${nextMode}`,
      );
      if (r.status === 401) {
        router.push("/admin/login");
        return;
      }
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setData(d);
      setDays(nextDays);
      setMode(nextMode);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load dashboard.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function logout() {
    setError("");
    try {
      const r = await fetch("/api/admin/logout", { method: "POST" });
      if (!r.ok) throw new Error("Unable to sign out. Please try again.");
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign out.");
    }
  }
  async function updateStatus(value: string) {
    if (!selected) return;
    setSaved(false);
    if (sample) {
      const next = { ...selected, status: value };
      setSelected(next);
      setData((d) => ({
        ...d,
        inquiries: d.inquiries.map((i) => (i.id === next.id ? next : i)),
      }));
      setSaved(true);
      return;
    }
    if (preview) {
      setError("Live inquiry changes are disabled in preview mode.");
      return;
    }
    try {
      const r = await fetch(`/api/admin/inquiries/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: value }),
      });
      const json = await r.json();
      if (!r.ok) throw new Error(json.error);
      const next = { ...selected, status: value };
      setSelected(next);
      setData((d) => ({
        ...d,
        inquiries: d.inquiries.map((i) => (i.id === next.id ? next : i)),
      }));
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save status.");
    }
  }
  const filtered = data.inquiries.filter(
    (i) =>
      (filter === "all" || i.status === filter) &&
      `${i.name} ${i.email} ${i.service} ${i.message}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  function openInquiry(i: Inquiry) {
    setSaved(false);
    setSelected(i);
  }
  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <Logo />
        <div className="dashboard-workspace">
          <span>BUSINESS WORKSPACE</span>
          <strong>Georgia Pro Solutions</strong>
          <small>
            <span />{" "}
            {sample ? "Demonstration workspace" : "Private administrator"}
          </small>
        </div>
        <div className="sidebar-group-label">WORKSPACE</div>
        <nav aria-label="Dashboard">
          <button
            onClick={() => setTab("overview")}
            aria-current={tab === "overview" ? "page" : undefined}
          >
            <LayoutDashboard size={18} /> Overview
          </button>
          <button
            onClick={() => setTab("inquiries")}
            aria-current={tab === "inquiries" ? "page" : undefined}
          >
            <Inbox size={18} /> Inquiries{" "}
            <span>
              {data.inquiries.filter((i) => i.status === "new").length}
            </span>
          </button>
        </nav>
        <div className="sidebar-help">
          <span className="sidebar-help-icon">
            <Activity size={22} />
          </span>
          <h3>
            Small details.
            <br />
            Useful insights.
          </h3>
          <p>See how visitors find you and turn interest into conversations.</p>
          <Link href="/" target="_blank">
            View your website <ArrowUpRight size={15} />
          </Link>
        </div>
        <div className="sidebar-bottom">
          <div className="admin-avatar">GP</div>
          <div>
            <strong>Business administrator</strong>
            <small>Private access</small>
          </div>
          <button onClick={logout} aria-label="Sign out">
            <LogOut size={17} />
          </button>
        </div>
      </aside>
      <div className="dashboard-main">
        <header className="dashboard-top">
          <div>
            Workspace <ChevronRight size={13} />{" "}
            <strong>{tab === "overview" ? "Overview" : "Inquiries"}</strong>
          </div>
          <div>
            <span className="private-dot" /> PRIVATE DASHBOARD{" "}
            <Link href="/" target="_blank">
              Visit website <ArrowUpRight size={14} />
            </Link>
            <button
              className="mobile-logout"
              onClick={logout}
              aria-label="Sign out"
            >
              <LogOut size={17} />
            </button>
          </div>
        </header>
        <main className="dashboard-content">
          <div className="dashboard-mobile-tabs">
            <button
              onClick={() => setTab("overview")}
              aria-pressed={tab === "overview"}
            >
              <LayoutDashboard size={16} />
              Overview
            </button>
            <button
              onClick={() => setTab("inquiries")}
              aria-pressed={tab === "inquiries"}
            >
              <Inbox size={16} />
              Inquiries
            </button>
          </div>
          <div className="dashboard-title">
            <div>
              <p>YOUR PROPERTY-SERVICES BUSINESS, IN FOCUS</p>
              <h1>
                {tab === "overview"
                  ? "A little insight. A lot of possibility."
                  : "Good conversations start here."}
              </h1>
              <span>
                {tab === "overview"
                  ? "Your website’s performance, thoughtfully put together."
                  : "Keep track of the people reaching out about their properties."}
              </span>
            </div>
            <div className="dashboard-controls">
              <select
                value={mode}
                aria-label="Analytics data mode"
                onChange={(e) =>
                  load(days, e.target.value as "sample" | "live")
                }
                disabled={busy}
              >
                <option value="sample">Sample analytics</option>
                <option value="live">Live analytics</option>
              </select>
              <div>
                <CalendarDays size={14} />
                <select
                  value={days}
                  aria-label="Date range"
                  onChange={(e) => load(Number(e.target.value), mode)}
                  disabled={busy}
                >
                  <option value={7}>Last 7 days</option>
                  <option value={30}>Last 30 days</option>
                  <option value={90}>Last 90 days</option>
                </select>
              </div>
            </div>
          </div>
          <div className={`data-notice ${sample ? "sample-notice" : ""}`}>
            <span className="data-notice-icon">
              {sample ? <FlaskConical size={19} /> : <Activity size={19} />}
            </span>
            <div>
              <strong>
                {sample
                  ? "Sample Analytics — Illustrative Data"
                  : data.connected
                    ? "Live analytics — Actual recorded activity"
                    : "Live analytics — Awaiting database setup"}
              </strong>
              <p>
                {sample
                  ? "Explore an example of your future dashboard. All figures and customer details shown are fictional."
                  : data.connected
                    ? "Only permitted visitor activity is measured. Dates use UTC. Unique visitors are estimates."
                    : "No database is connected. Zero values and empty states are shown; no activity is fabricated."}
              </p>
            </div>
            {sample && <span className="sample-badge">DEMO MODE</span>}
            {busy && <LoaderCircle className="spin" size={18} />}
          </div>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          {tab === "overview" ? (
            <>
              <div className="kpi-grid">
                {[
                  {
                    label: "Website visits",
                    value: format(data.visits),
                    Icon: Globe,
                    note: "Anonymous browsing sessions",
                  },
                  {
                    label: "Pageviews",
                    value: format(data.pageviews),
                    Icon: MousePointer2,
                    note: "Public pages viewed",
                  },
                  {
                    label: "Estimated visitors",
                    value: format(data.unique),
                    Icon: Users,
                    note: "Anonymous browser identifiers",
                  },
                  {
                    label: "Quote requests",
                    value: format(data.quotes),
                    Icon: Send,
                    note: `${conversion}% inquiry-to-visit ratio`,
                  },
                ].map((k, i) => (
                  <div className={`kpi kpi-${i}`} key={k.label}>
                    <div>
                      <span>{k.label}</span>
                      <k.Icon size={17} />
                    </div>
                    <strong>{k.value}</strong>
                    <p>{k.note}</p>
                  </div>
                ))}
              </div>
              <div className="dashboard-chart-grid">
                <section className="dashboard-panel visits-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Every visit is a possibility.</h2>
                      <p>Website visits over the last {days} days</p>
                    </div>
                    <span className="chart-key">
                      <i /> Visits
                    </span>
                  </div>
                  <div className="main-chart">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={data.daily}
                        margin={{ top: 10, right: 8, left: -28, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="visitsFill"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#a4b9a5"
                              stopOpacity={0.55}
                            />
                            <stop
                              offset="100%"
                              stopColor="#e8eee4"
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 5"
                          vertical={false}
                          stroke="#e6e9e1"
                        />
                        <XAxis
                          dataKey="date"
                          tickFormatter={dateLabel}
                          tickLine={false}
                          axisLine={false}
                          minTickGap={40}
                          tick={{ fontSize: 9, fill: "#7d897b" }}
                          dy={9}
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          tick={{ fontSize: 9, fill: "#7d897b" }}
                          allowDecimals={false}
                        />
                        <Tooltip
                          labelFormatter={(v) => dateLabel(String(v))}
                          contentStyle={{
                            fontSize: 11,
                            border: "1px solid #e1e6da",
                            borderRadius: 5,
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="visits"
                          name="Visits"
                          stroke="#244d40"
                          strokeWidth={2.5}
                          fill="url(#visitsFill)"
                          isAnimationActive={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="chart-footer">
                    <span>
                      {dateLabel(
                        data.daily[0]?.date ||
                          new Date().toISOString().slice(0, 10),
                      )}{" "}
                      —{" "}
                      {dateLabel(
                        data.daily.at(-1)?.date ||
                          new Date().toISOString().slice(0, 10),
                      )}
                    </span>
                    <span>
                      {sample
                        ? "Illustrative traffic"
                        : "UTC · Consent-based measurement"}
                    </span>
                  </div>
                </section>
                <section className="dashboard-panel devices-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>How they visit.</h2>
                      <p>Device categories</p>
                    </div>
                    <Smartphone size={17} />
                  </div>
                  {data.devices.length ? (
                    <>
                      <div className="device-donut">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={data.devices}
                              dataKey="value"
                              nameKey="name"
                              innerRadius="65%"
                              outerRadius="85%"
                              paddingAngle={4}
                              stroke="none"
                              isAnimationActive={false}
                            >
                              {data.devices.map((d, i) => (
                                <Cell key={d.name} fill={colors[i]} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{ fontSize: 11, borderRadius: 4 }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                        <div>
                          <strong>{format(data.visits)}</strong>
                          <span>VISITS</span>
                        </div>
                      </div>
                      <div className="device-legend">
                        {data.devices.map((d, i) => {
                          const Icon =
                            i === 0 ? Smartphone : i === 1 ? Monitor : Tablet;
                          return (
                            <div key={d.name}>
                              <i style={{ background: colors[i] }} />
                              <Icon size={13} />
                              <span>{d.name}</span>
                              <strong>
                                {data.visits
                                  ? Math.round((d.value / data.visits) * 100)
                                  : 0}
                                %
                              </strong>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <Empty text="Device insights appear after measured visits." />
                  )}
                </section>
              </div>
              <div className="dashboard-bottom-grid">
                <section className="dashboard-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>The pages they explore.</h2>
                      <p>Most popular pages</p>
                    </div>
                    <MousePointer2 size={17} />
                  </div>
                  {data.pages.length ? (
                    <div className="page-bars">
                      {data.pages.map((p, i) => (
                        <div key={p.name}>
                          <div>
                            <span>
                              <small>0{i + 1}</small>
                              {p.name}
                            </span>
                            <strong>{format(p.value)}</strong>
                          </div>
                          <div className="bar-track">
                            <i
                              style={{
                                width: `${Math.max(3, (p.value / Math.max(...data.pages.map((p) => p.value))) * 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Empty text="Your most-viewed pages will appear here." />
                  )}
                </section>
                <section className="dashboard-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Where interest begins.</h2>
                      <p>Traffic sources by visit</p>
                    </div>
                    <Globe size={17} />
                  </div>
                  {data.sources.length ? (
                    <div className="source-list">
                      {data.sources.map((s, i) => (
                        <div key={s.name}>
                          <span
                            className="source-icon"
                            style={{
                              background: [
                                "#edf1e8",
                                "#fff2df",
                                "#e7ecf0",
                                "#f4ece5",
                              ][i % 4],
                            }}
                          >
                            <ArrowUpRight size={16} />
                          </span>
                          <span>
                            {s.name}
                            <small>
                              {data.visits
                                ? Math.round((s.value / data.visits) * 100)
                                : 0}
                              % of visits
                            </small>
                          </span>
                          <strong>{format(s.value)}</strong>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Empty text="Source categories appear as visitors arrive." />
                  )}
                </section>
                <section className="dashboard-panel inquiry-chart-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Interest into action.</h2>
                      <p>Inquiries over time</p>
                    </div>
                    <Send size={17} />
                  </div>
                  <div className="inquiry-chart">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={data.daily}
                        margin={{ left: -30, right: 0, top: 8 }}
                      >
                        <CartesianGrid
                          vertical={false}
                          strokeDasharray="3 5"
                          stroke="#e6e9e1"
                        />
                        <XAxis
                          dataKey="date"
                          tickFormatter={dateLabel}
                          tickLine={false}
                          axisLine={false}
                          minTickGap={60}
                          tick={{ fontSize: 8, fill: "#7d897b" }}
                        />
                        <YAxis
                          allowDecimals={false}
                          tickLine={false}
                          axisLine={false}
                          tick={{ fontSize: 8, fill: "#7d897b" }}
                        />
                        <Tooltip
                          labelFormatter={(v) => dateLabel(String(v))}
                          contentStyle={{ fontSize: 10 }}
                        />
                        <Bar
                          dataKey="inquiries"
                          name="Inquiries"
                          fill="#e6a44d"
                          radius={[3, 3, 0, 0]}
                          maxBarSize={20}
                          isAnimationActive={false}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="conversion-note">
                    <strong>{conversion}%</strong>
                    <span>
                      Inquiry-to-visit ratio
                      <small>Requests ÷ measured visits</small>
                    </span>
                  </div>
                </section>
              </div>
              <section className="dashboard-panel recent-inquiries">
                <div className="panel-heading">
                  <div>
                    <h2>A conversation worth having.</h2>
                    <p>Recent estimate requests</p>
                  </div>
                  <button
                    className="dashboard-text-button"
                    onClick={() => setTab("inquiries")}
                  >
                    All inquiries <ArrowRight size={14} />
                  </button>
                </div>
                <InquiryTable
                  items={data.inquiries.slice(0, 4)}
                  onOpen={openInquiry}
                />
              </section>
            </>
          ) : (
            <section className="dashboard-panel inquiries-panel">
              <div className="inquiries-toolbar">
                <div className="inquiry-search">
                  <Search size={16} />
                  <input
                    placeholder="Search inquiries…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label="Search inquiries"
                  />
                </div>
                <select
                  aria-label="Filter inquiry status"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All statuses</option>
                  {["new", "contacted", "scheduled", "closed"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <a
                  className="dashboard-export"
                  href={`/api/admin/export?days=${days}&mode=${mode}`}
                >
                  <ArrowDownToLine size={15} />
                  Export CSV
                </a>
              </div>
              <InquiryTable items={filtered} onOpen={openInquiry} />
              <p className="table-note">
                Showing {filtered.length}{" "}
                {sample ? "illustrative sample" : "recent"} inquiries in the
                selected period. Up to 2,000 records per export.
              </p>
            </section>
          )}
          <footer className="dashboard-footer">
            <span>
              GEORGIA PRO SOLUTIONS <b>/</b> BUSINESS INSIGHTS
            </span>
            <span>
              {sample
                ? "Illustrative demonstration · No real customer data"
                : "Private first-party analytics · UTC dates"}
            </span>
          </footer>
        </main>
      </div>
      {selected && (
        <InquiryDrawer
          inquiry={selected}
          sample={sample}
          saved={saved}
          error={error}
          onClose={() => setSelected(null)}
          onChange={updateStatus}
        />
      )}
    </div>
  );
}
function Empty({ text }: { text: string }) {
  return (
    <div className="dashboard-empty">
      <Activity size={25} />
      <p>{text}</p>
    </div>
  );
}
function InquiryTable({
  items,
  onOpen,
}: {
  items: Inquiry[];
  onOpen: (i: Inquiry) => void;
}) {
  if (!items.length)
    return (
      <Empty text="No inquiries here yet. New estimate requests will appear here." />
    );
  return (
    <div className="inquiry-table-scroll">
      <table className="inquiry-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Service requested</th>
            <th>Received</th>
            <th>Status</th>
            <th aria-label="Open inquiry" />
          </tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.id}>
              <td>
                <button onClick={() => onOpen(i)} className="inquiry-name">
                  {i.name}
                  <small>{i.email}</small>
                </button>
              </td>
              <td>{serviceLabel(i.service)}</td>
              <td>{dateLabel(i.created_at.slice(0, 10))}</td>
              <td>
                <span className={`status-badge status-${i.status}`}>
                  {i.status}
                </span>
              </td>
              <td>
                <button
                  onClick={() => onOpen(i)}
                  aria-label={`Open inquiry from ${i.name}`}
                >
                  <ArrowUpRight size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
import { useEffect, useRef } from "react";
function InquiryDrawer({
  inquiry: i,
  sample,
  saved,
  error,
  onClose,
  onChange,
}: {
  inquiry: Inquiry;
  sample: boolean;
  saved: boolean;
  error: string;
  onClose: () => void;
  onChange: (s: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const last = document.activeElement as HTMLElement;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const nodes =
          ref.current?.querySelectorAll<HTMLElement>("button,a,select");
        if (!nodes?.length) return;
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", handler);
      last?.focus();
    };
  }, [onClose]);
  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div
        ref={ref}
        className="inquiry-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={`Inquiry from ${i.name}`}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-top">
          <span>
            {sample ? "ILLUSTRATIVE SAMPLE INQUIRY" : "ESTIMATE REQUEST"}
          </span>
          <button onClick={onClose} aria-label="Close inquiry">
            <X size={21} />
          </button>
        </div>
        <span className="drawer-avatar">
          {i.name
            .split(" ")
            .map((s) => s[0])
            .slice(0, 2)
            .join("")}
        </span>
        <h2>{i.name}</h2>
        <p>
          Received{" "}
          {new Date(i.created_at).toLocaleString("en-US", { timeZone: "UTC" })}{" "}
          UTC
        </p>
        <dl>
          <dt>Service requested</dt>
          <dd>{serviceLabel(i.service)}</dd>
          <dt>Phone</dt>
          <dd>
            {sample ? (
              i.phone
            ) : (
              <a href={`tel:${i.phone.replace(/[^+0-9]/g, "")}`}>{i.phone}</a>
            )}
          </dd>
          <dt>Email</dt>
          <dd>
            {sample ? i.email : <a href={`mailto:${i.email}`}>{i.email}</a>}
          </dd>
          <dt>Property location</dt>
          <dd>{i.location}</dd>
          <dt>Project details</dt>
          <dd className="inquiry-message">{i.message}</dd>
        </dl>
        <label>
          Inquiry status
          <select value={i.status} onChange={(e) => onChange(e.target.value)}>
            {["new", "contacted", "scheduled", "closed"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        {saved && (
          <p className="status-saved" role="status">
            <Check size={15} />
            {sample
              ? "Sample status updated for this session."
              : "Status saved."}
          </p>
        )}
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        {sample && (
          <p className="drawer-sample-note">
            Fictional customer information. Changes are not saved to the
            production database.
          </p>
        )}
        {!sample && (
          <p className="drawer-sample-note">
            Email notification:{" "}
            {i.notification_status === "sent"
              ? "accepted by provider"
              : i.notification_status === "failed"
                ? "failed — review directly here"
                : "not configured"}
          </p>
        )}
      </div>
    </div>
  );
}
