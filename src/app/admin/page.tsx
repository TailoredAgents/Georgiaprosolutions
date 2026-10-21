import { authorized } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDashboard } from "@/lib/dashboard";
import { Dashboard } from "@/components/dashboard";
import { preview } from "@/lib/business";
export const dynamic = "force-dynamic";
export default async function Admin() {
  if (!(await authorized())) redirect("/admin/login");
  let data;
  try {
    data = await getDashboard(30, preview ? "sample" : "live");
  } catch {
    data = {
      ...(await getDashboard(30, "sample")),
      mode: "live" as const,
      connected: false,
      visits: 0,
      pageviews: 0,
      unique: 0,
      quotes: 0,
      inquiries: [],
      daily: [],
      pages: [],
      devices: [],
      sources: [],
    };
  }
  return <Dashboard initial={data} preview={preview} />;
}
