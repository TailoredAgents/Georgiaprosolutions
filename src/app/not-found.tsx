import Link from "next/link";
export default function NotFound() {
  return (
    <main
      className="container section"
      style={{
        minHeight: "75vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <p className="eyebrow">A SMALL DETOUR</p>
      <h1>
        Let’s get you
        <br />
        <span>back on track.</span>
      </h1>
      <p style={{ margin: "25px 0" }}>
        We couldn’t find that page. Your next property project starts here.
      </p>
      <Link className="button" href="/">
        Back to Home ↗
      </Link>
    </main>
  );
}
