"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LoaderCircle, Eye, EyeOff } from "lucide-react";
export function LoginForm({ configured }: { configured: boolean }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);
  const router = useRouter();
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const body = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const r = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error);
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in is unavailable.");
      setBusy(false);
    }
  }
  return (
    <form className="login-form" onSubmit={submit}>
      {!configured && (
        <div className="admin-setup-notice">
          Private access is not configured yet. The site administrator can run{" "}
          <code>npm run admin:setup</code> in the project folder.
        </div>
      )}
      <label>
        Email address
        <input
          type="email"
          name="email"
          autoComplete="username"
          required
          placeholder="Your administrator email"
          maxLength={254}
        />
      </label>
      <label>
        Password
        <div className="password-wrap">
          <input
            type={show ? "text" : "password"}
            name="password"
            autoComplete="current-password"
            required
            maxLength={256}
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </label>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button className="button" disabled={busy || !configured} type="submit">
        {busy ? "Signing in…" : "Sign In"}
        {busy ? (
          <LoaderCircle className="spin" size={17} />
        ) : (
          <ArrowRight size={18} />
        )}
      </button>
      <p>
        Private access for the business administrator.
        <br />
        No public registration.
      </p>
    </form>
  );
}
