"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight, Check, LoaderCircle, RotateCcw } from "lucide-react";
export function ContactForm({ preview }: { preview: boolean }) {
  const params = useSearchParams();
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");
  const [started] = useState(() => Date.now());
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, startedAt: started }),
      });
      const json = await res.json();
      if (!res.ok)
        throw new Error(
          json.error || "We couldn’t save your request. Please try again.",
        );
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    }
  }
  if (status === "success")
    return (
      <div className="form-success" role="status">
        <span className="success-icon">
          <Check size={28} />
        </span>
        <p className="eyebrow">
          {preview ? "PREVIEW COMPLETE" : "REQUEST RECEIVED"}
        </p>
        <h2>
          {preview ? "That’s how easy it can be." : "Thanks for reaching out."}
        </h2>
        <p>
          {preview
            ? "This was a preview interaction. Your details were not saved or emailed, and no estimate request was sent to Georgia Pro Solutions."
            : "Your request has been saved for Georgia Pro Solutions to review. No appointment is booked yet. If your project is time-sensitive, call the company directly."}
        </p>
        <button className="button outline" onClick={() => setStatus("idle")}>
          Try another request <RotateCcw size={16} />
        </button>
      </div>
    );
  return (
    <form onSubmit={submit} className="estimate-form">
      <div className="form-heading">
        <span>LET’S START WITH A FEW DETAILS</span>
        <span>01 / YOUR PROJECT</span>
      </div>
      <div className="form-grid">
        <label>
          Your name <span>*</span>
          <input
            name="name"
            autoComplete="name"
            placeholder="First and last name"
            required
            minLength={2}
            maxLength={100}
          />
        </label>
        <label>
          Phone number <span>*</span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="(478) 555-0123"
            required
            minLength={10}
            maxLength={30}
            pattern="[+0-9() .-]{10,30}"
            title="Please enter a phone number with at least 10 characters."
          />
        </label>
        <label>
          Email address <span>*</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            maxLength={254}
          />
        </label>
        <label>
          What can we help with? <span>*</span>
          <select
            name="service"
            required
            defaultValue={params.get("service") || ""}
          >
            <option value="" disabled>
              Select a service
            </option>
            <option value="lawn-care">Lawn Care</option>
            <option value="pressure-washing">Pressure Washing</option>
            <option value="junk-removal">Junk Removal</option>
            <option value="other">Other Property Service</option>
          </select>
        </label>
        <label className="full-field">
          Property location or ZIP <span>*</span>
          <input
            name="location"
            autoComplete="postal-code"
            placeholder="Town, address, or ZIP code"
            required
            minLength={2}
            maxLength={200}
          />
        </label>
        <label className="full-field">
          Tell us about your project <span>*</span>
          <textarea
            name="message"
            placeholder="A little about your property, the work you need, and any timing you have in mind…"
            rows={5}
            required
            minLength={10}
            maxLength={5000}
          />
        </label>
      </div>
      <div className="honeypot" aria-hidden="true">
        <label>
          Leave this field empty
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="consent">
        <input name="consent" type="checkbox" required value="yes" />
        <span>
          {preview
            ? "I understand this is a website preview and this request will not be sent."
            : "I agree that Georgia Pro Solutions may use these details to respond to my request."}{" "}
          <a href="/privacy">Privacy details</a>.
        </span>
      </label>
      {status === "error" && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button className="button" type="submit" disabled={status === "sending"}>
        {status === "sending" ? (
          <>
            Sending request <LoaderCircle className="spin" size={18} />
          </>
        ) : (
          <>
            {preview ? "Preview Estimate Request" : "Send Estimate Request"}
            <ArrowUpRight size={18} />
          </>
        )}
      </button>
      <p className="form-small">
        {preview
          ? "Preview only · No information is stored or emailed."
          : "Submitting a request does not confirm pricing, availability, or a booking."}
      </p>
    </form>
  );
}
