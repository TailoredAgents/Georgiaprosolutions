import Link from "next/link";
import { ArrowLeft, ChartNoAxesCombined, ShieldCheck } from "lucide-react";
import { Logo, Photo } from "@/components/ui";
import { LoginForm } from "@/components/login-form";
import { authorized, authConfigured } from "@/lib/auth";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
export default async function Login() {
  if (await authorized()) redirect("/admin");
  return (
    <main className="login-page">
      <div className="login-left">
        <Logo light />
        <div className="login-editorial">
          <span className="login-icon">
            <ChartNoAxesCombined size={28} />
          </span>
          <p className="eyebrow light">YOUR BUSINESS, AT A GLANCE</p>
          <h1>
            A clearer picture.
            <br />A stronger <span>business.</span>
          </h1>
          <p>
            Understand your website. Keep up with inquiries.
            <br />
            Make your next move with a little more clarity.
          </p>
        </div>
        <div className="login-left-bottom">
          <ShieldCheck size={16} /> PRIVATE BUSINESS DASHBOARD
        </div>
        <Photo
          src="/images/home-hero.jpg"
          alt="Illustrative well-kept property"
        />
      </div>
      <div className="login-right">
        <Link className="login-back" href="/">
          <ArrowLeft size={15} /> Back to website
        </Link>
        <div className="login-content">
          <span className="login-mini-label">
            GEORGIA PRO / BUSINESS INSIGHTS
          </span>
          <h2>Welcome back.</h2>
          <p>A little insight goes a long way.</p>
          <LoginForm configured={authConfigured()} />
        </div>
        <p className="login-bottom">
          Georgia Pro Solutions LLC · Allentown, Georgia
        </p>
      </div>
    </main>
  );
}
