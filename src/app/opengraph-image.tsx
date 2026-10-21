import { ImageResponse } from "next/og";
import { preview } from "@/lib/business";

export const alt =
  "Georgia Pro Solutions — lawn care, pressure washing, and junk removal in Allentown, Georgia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: "#f7f6f1",
        color: "#18232b",
        padding: 64,
        flexDirection: "column",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          color: "#244d40",
        }}
      >
        <svg width="52" height="58" viewBox="0 0 42 44" fill="none">
          <path
            d="M5 12 21 3l16 9v19l-16 10L5 31V12Z"
            stroke="#244d40"
            strokeWidth="2"
          />
          <path
            d="m13 17 8-5 8 5-8 5-8-5Zm0 9 8 5 8-5M21 22v9"
            stroke="#244d40"
            strokeWidth="2"
          />
        </svg>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 26, letterSpacing: 2, fontWeight: 700 }}>
            GEORGIA PRO
          </span>
          <span style={{ fontSize: 12, letterSpacing: 7, marginTop: 4 }}>
            SOLUTIONS
          </span>
        </div>
        <span style={{ marginLeft: "auto", fontSize: 16, letterSpacing: 2 }}>
          ALLENTOWN, GEORGIA
        </span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: 45,
          fontSize: 86,
          fontWeight: 700,
          letterSpacing: -4,
          lineHeight: 1.1,
        }}
      >
        <span>One call.</span>
        <span style={{ color: "#244d40" }}>More solutions.</span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 25,
          marginTop: 38,
          fontSize: 22,
          color: "#244d40",
        }}
      >
        <span>Lawn care</span>
        <span style={{ color: "#b57b2e" }}>+</span>
        <span>Pressure washing</span>
        <span style={{ color: "#b57b2e" }}>+</span>
        <span>Junk removal</span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 68,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 64px",
          background: "#244d40",
          color: "#f7f6f1",
          fontSize: 15,
        }}
      >
        <span>GEORGIA PRO SOLUTIONS LLC</span>
        <span>
          {preview
            ? "PROPOSED WEBSITE CONCEPT"
            : "PROPERTY CARE, FROM EVERY ANGLE."}
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          top: 171,
          right: 64,
          width: 62,
          height: 6,
          background: "#e6a44d",
          display: "flex",
        }}
      />
    </div>,
    size,
  );
}
