"use client";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
export function Analytics() {
  const pathname = usePathname();
  const params = useSearchParams();
  const [consent, setConsent] = useState<string | null>(null);
  const enabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true";
  useEffect(() => {
    if (!enabled) return;
    const read = () => {
      try {
        setConsent(localStorage.getItem("gps-analytics-consent") || "ask");
      } catch {
        setConsent("no");
      }
    };
    queueMicrotask(read);
    window.addEventListener("storage", read);
    return () => window.removeEventListener("storage", read);
  }, [enabled]);
  useEffect(() => {
    if (
      !enabled ||
      consent !== "yes" ||
      pathname.startsWith("/admin") ||
      navigator.doNotTrack === "1"
    )
      return;
    try {
      let visitor = localStorage.getItem("gps-visitor");
      if (!visitor) {
        visitor = crypto.randomUUID();
        localStorage.setItem("gps-visitor", visitor);
      }
      let visit = sessionStorage.getItem("gps-visit");
      if (!visit) {
        visit = crypto.randomUUID();
        sessionStorage.setItem("gps-visit", visit);
      }
      const body = {
        consent: true,
        type: "pageview",
        path: pathname,
        visitorId: visitor,
        visitId: visit,
        referrer: document.referrer
          ? new URL(document.referrer).hostname
          : "direct",
        utmSource: params.get("utm_source"),
        device: matchMedia("(max-width: 600px)").matches
          ? "mobile"
          : matchMedia("(max-width: 1000px)").matches
            ? "tablet"
            : "desktop",
      };
      fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        keepalive: true,
      }).catch(() => {});
    } catch {}
  }, [pathname, params, consent, enabled]);
  function choose(value: string) {
    try {
      localStorage.setItem("gps-analytics-consent", value);
    } catch {}
    setConsent(value);
  }
  if (!enabled || consent !== "ask") return null;
  return (
    <div
      className="privacy-choice"
      role="region"
      aria-label="Analytics preference"
    >
      <p>
        Allow anonymous visit measurement to help improve this website?{" "}
        <a href="/privacy">Privacy details</a>
      </p>
      <button onClick={() => choose("no")}>No thanks</button>
      <button onClick={() => choose("yes")}>Allow</button>
    </div>
  );
}
