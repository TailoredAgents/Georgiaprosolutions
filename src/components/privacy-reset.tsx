"use client";
import { useState } from "react";
export function PrivacyReset() {
  const [done, setDone] = useState(false);
  return (
    <>
      <button
        className="button outline"
        onClick={() => {
          ["gps-analytics-consent", "gps-visitor"].forEach((k) =>
            localStorage.removeItem(k),
          );
          sessionStorage.removeItem("gps-visit");
          setDone(true);
          window.dispatchEvent(new Event("storage"));
        }}
      >
        Reset analytics preference
      </button>
      {done && (
        <p role="status">
          Preference and anonymous identifiers removed. You can choose again
          now.
        </p>
      )}
    </>
  );
}
