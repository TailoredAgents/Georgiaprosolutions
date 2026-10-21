"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="container section">
      <p className="eyebrow">LET’S TRY THAT AGAIN</p>
      <h1>
        A brief <span>interruption.</span>
      </h1>
      <p style={{ margin: "25px 0" }}>
        This page couldn’t load. Please try again, or call (478) 484-7213.
      </p>
      <button className="button" onClick={reset}>
        Try Again
      </button>
    </section>
  );
}
