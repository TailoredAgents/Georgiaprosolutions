"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, X, ArrowLeft, ArrowRight, Expand } from "lucide-react";
import { gallery, type Project } from "@/lib/business";
export function Gallery({
  items = gallery,
  compact = false,
  filters = false,
}: {
  items?: readonly Project[];
  compact?: boolean;
  filters?: boolean;
}) {
  const [category, setCategory] = useState("All");
  const [active, setActive] = useState<number | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const visible = items.filter(
    (i) => category === "All" || i.category === category,
  );
  useEffect(() => {
    if (active === null) return;
    const last = document.activeElement as HTMLElement;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight")
        setActive((a) => (a === null ? null : (a + 1) % visible.length));
      if (e.key === "ArrowLeft")
        setActive((a) =>
          a === null ? null : (a - 1 + visible.length) % visible.length,
        );
      if (e.key === "Tab") {
        const nodes = dialog.current?.querySelectorAll<HTMLElement>("button");
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
      document.body.style.overflow = old;
      document.removeEventListener("keydown", handler);
      last?.focus();
    };
  }, [active, visible.length]);
  return (
    <>
      {filters && (
        <div
          className="gallery-filters"
          aria-label="Filter inspiration gallery"
        >
          {["All", "Lawn care", "Exterior cleaning", "Junk removal"].map(
            (c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
              >
                {c}
                {c === "All" && (
                  <span>{items.length.toString().padStart(2, "0")}</span>
                )}
              </button>
            ),
          )}
        </div>
      )}
      <div className={`gallery-grid ${compact ? "compact-gallery" : ""}`}>
        {visible.map((p, i) => (
          <button
            className={`gallery-item gallery-item-${i}`}
            key={p.id}
            onClick={(e) => {
              trigger.current = e.currentTarget;
              setActive(i);
            }}
            aria-label={`Enlarge ${p.title}`}
          >
            <Image
              src={p.image}
              alt={p.alt}
              fill
              sizes={
                compact
                  ? "(max-width:768px) 100vw, 50vw"
                  : "(max-width:768px) 100vw, 50vw"
              }
            />
            <span className="gallery-expand">
              <Expand size={19} />
            </span>
            <span className="gallery-label">
              <span>
                <small>{p.category} · Illustrative</small>
                <strong>{p.title}</strong>
              </span>
              <ArrowUpRight size={24} />
            </span>
          </button>
        ))}
      </div>
      {active !== null && visible[active] && (
        <div className="lightbox" onClick={() => setActive(null)}>
          <div
            ref={dialog}
            className="lightbox-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="lightbox-top">
              <span>PROPERTY CARE / INSPIRATION</span>
              <button
                onClick={() => setActive(null)}
                aria-label="Close image viewer"
                autoFocus
              >
                <X />
              </button>
            </div>
            <div className="lightbox-photo">
              <Image
                src={visible[active].image}
                alt={visible[active].alt}
                fill
                sizes="90vw"
                quality={90}
              />
            </div>
            <div className="lightbox-bottom">
              <div>
                <h3>{visible[active].title}</h3>
                <p>
                  Illustrative photography. Not a Georgia Pro Solutions project.
                </p>
              </div>
              <div>
                <button
                  aria-label="Previous image"
                  onClick={() =>
                    setActive((active - 1 + visible.length) % visible.length)
                  }
                >
                  <ArrowLeft />
                </button>
                <span>
                  {active + 1} / {visible.length}
                </span>
                <button
                  aria-label="Next image"
                  onClick={() => setActive((active + 1) % visible.length)}
                >
                  <ArrowRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export function BeforeAfter({
  before,
  after,
}: {
  before: string;
  after: string;
}) {
  const [value, setValue] = useState(50);
  return (
    <div className="comparison">
      <Image src={after} fill sizes="100vw" alt="After property service" />
      <div style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}>
        <Image src={before} fill sizes="100vw" alt="Before property service" />
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        aria-label="Compare before and after"
        onChange={(e) => setValue(Number(e.target.value))}
      />
      <span className="comparison-before">Before</span>
      <span className="comparison-after">After</span>
    </div>
  );
}
