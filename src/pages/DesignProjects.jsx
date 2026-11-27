import { useState, useEffect, useRef, useCallback } from "react";
import { WORKS } from "../works.js";
import { averageColor, rgb, invert, isLight } from "../color.js";
import BentoModal from "../components/BentoModal.jsx";

const AUTO_MS = 3800;
const N = WORKS.length;

// Shortest signed distance from the active slide, so the reel loops forever.
const offsetOf = (i, active) => {
  let d = i - active;
  if (d > N / 2) d -= N;
  if (d < -N / 2) d += N;
  return d;
};

export default function DesignProjects() {
  const [active, setActive] = useState(0);
  const [colors, setColors] = useState({});
  const [paused, setPaused] = useState(false);
  const [open, setOpen] = useState(null);
  const [cursor, setCursor] = useState({ on: false, x: 0, y: 0, color: [255, 255, 255] });
  const touch = useRef(null);
  const finePointer = useRef(typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches);

  // Sample the average color of every work once.
  useEffect(() => {
    WORKS.forEach((w) => averageColor(w.src).then((c) => setColors((m) => ({ ...m, [w.id]: c }))));
  }, []);

  // Page background follows the center image.
  const current = WORKS[active];
  const bgColor = colors[current.id] || [62, 74, 46];
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--reel-bg", rgb(bgColor));
    root.style.setProperty("--reel-fg", isLight(bgColor) ? "#1f2618" : "#fbf8ee");
  }, [bgColor]);
  useEffect(() => () => {
    document.documentElement.style.removeProperty("--reel-bg");
    document.documentElement.style.removeProperty("--reel-fg");
  }, []);

  // Deep link: /#glubi opens that project's bento grid.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    const i = WORKS.findIndex((w) => w.id === id && w.set);
    if (i >= 0) {
      setActive(i);
      setOpen(WORKS[i]);
    }
  }, []);
  useEffect(() => {
    const url = open ? `#${open.id}` : window.location.pathname;
    window.history.replaceState(null, "", url);
  }, [open]);

  const go = useCallback((i) => setActive(((i % N) + N) % N), []);

  // Auto scroll.
  useEffect(() => {
    if (paused || open) return;
    const t = setTimeout(() => go(active + 1), AUTO_MS);
    return () => clearTimeout(t);
  }, [active, paused, open, go]);

  // Keyboard arrows.
  useEffect(() => {
    if (open) return;
    const onKey = (e) => {
      if (e.key === "ArrowRight") go(active + 1);
      if (e.key === "ArrowLeft") go(active - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, open, go]);

  const onCardClick = (w, i) => {
    if (w.set) {
      setCursor((c) => ({ ...c, on: false }));
      setOpen(w);
    } else if (i !== active) go(i);
  };

  const moveCursor = (e, w) => {
    if (!finePointer.current || !w.set) return;
    setCursor({ on: true, x: e.clientX, y: e.clientY, color: colors[w.id] || [0, 0, 0] });
  };

  return (
    <section className="reel">
      <header className="reel-head">
        <span className="eyebrow">Design Projects</span>
        <span className="reel-count">
          {String(active + 1).padStart(2, "0")} <i>/</i> {String(N).padStart(2, "0")} works
        </span>
      </header>

      <div
        className="reel-stage"
        onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touch.current == null) return;
          const dx = e.changedTouches[0].clientX - touch.current;
          if (Math.abs(dx) > 40) go(active + (dx < 0 ? 1 : -1));
          touch.current = null;
        }}
      >
        {WORKS.map((w, i) => {
          const d = offsetOf(i, active);
          const hidden = Math.abs(d) > 2;
          return (
            <figure
              key={w.id}
              className={`reel-card ${d === 0 ? "center" : ""} ${w.set ? "multi" : ""}`}
              style={{
                transform: `translate(-50%, -50%) translateX(${d * 92}%) scale(${d === 0 ? 1 : 0.78})`,
                opacity: hidden ? 0 : d === 0 ? 1 : 0.55,
                zIndex: 10 - Math.abs(d),
                pointerEvents: hidden ? "none" : "auto",
              }}
              aria-hidden={d !== 0}
              onClick={() => onCardClick(w, i)}
              onMouseEnter={() => d === 0 && setPaused(true)}
              onMouseMove={(e) => moveCursor(e, w)}
              onMouseLeave={() => {
                setPaused(false);
                setCursor((c) => ({ ...c, on: false }));
              }}
            >
              <div className="reel-frame" style={{ background: colors[w.id] ? rgb(colors[w.id]) : undefined }}>
                <img src={w.src} alt={w.title} className={w.contain ? "contain" : ""} draggable="false" />
                {w.set && <span className="explore-badge">Explore</span>}
              </div>
            </figure>
          );
        })}
      </div>

      <div className="reel-info">
        <button className="arrow reel-arrow" onClick={() => go(active - 1)} aria-label="Previous work">←</button>
        <div className="reel-caption" aria-live="polite">
          <span className="reel-kind">{current.kind}</span>
          <h1 className="reel-title">{current.title}</h1>
          {current.set && (
            <button className="reel-open" onClick={() => setOpen(current)}>
              Explore the full project →
            </button>
          )}
        </div>
        <button className="arrow reel-arrow" onClick={() => go(active + 1)} aria-label="Next work">→</button>
      </div>

      <div className="reel-progress">
        {WORKS.map((w, i) => (
          <button
            key={w.id}
            className={i === active ? "on" : ""}
            onClick={() => go(i)}
            aria-label={`Show ${w.title}`}
          >
            {i === active && !paused && !open && <span key={active} style={{ animationDuration: `${AUTO_MS}ms` }} />}
          </button>
        ))}
      </div>

      {cursor.on && (
        <div
          className="explore-cursor"
          style={{
            transform: `translate(${cursor.x}px, ${cursor.y}px)`,
            background: rgb(invert(cursor.color)),
            color: rgb(cursor.color),
          }}
          aria-hidden="true"
        >
          explore
        </div>
      )}

      {open && (
        <BentoModal
          work={open}
          bg={rgb((colors[open.id] || [30, 30, 30]).map((v) => Math.round(v * 0.35)))}
          onClose={() => setOpen(null)}
        />
      )}
    </section>
  );
}
