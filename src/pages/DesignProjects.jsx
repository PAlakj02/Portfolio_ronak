import { useState, useEffect, useRef, useCallback } from "react";
import { WORKS } from "../works.js";
import { averageColor, rgb, invert, isLight } from "../color.js";
import BentoModal from "../components/BentoModal.jsx";

const AUTO_MS = 3000; // moves to the next design every 3 seconds
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
  const [open, setOpen] = useState(null);
  const touch = useRef(null);

  // Smooth custom cursor, driven by requestAnimationFrame instead of React state.
  const cursorRef = useRef(null);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const shown = useRef(false);
  const colorsRef = useRef({});
  colorsRef.current = colors;
  const finePointer = useRef(typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches);

  useEffect(() => {
    if (!finePointer.current) return;
    let raf;
    const tick = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.22;
      pos.current.y += (target.current.y - pos.current.y) * 0.22;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Only multi-page projects (the ones with a Drive folder) get the explore cursor.
  const showCursor = (e, w) => {
    if (!finePointer.current || !cursorRef.current || !w.set) return;
    target.current = { x: e.clientX, y: e.clientY };
    if (!shown.current) {
      pos.current = { x: e.clientX, y: e.clientY };
      shown.current = true;
    }
    const c = colorsRef.current[w.id] || [0, 0, 0];
    const fill = invert(c);
    const el = cursorRef.current;
    el.style.setProperty("--cur-bg", rgb(fill));
    el.style.setProperty("--cur-fg", isLight(fill) ? "#14180f" : "#fbf8ee");
    el.classList.add("show");
  };

  const hideCursor = () => {
    shown.current = false;
    cursorRef.current?.classList.remove("show");
  };

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

  // Deep link: /#glubi opens that project.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    const i = WORKS.findIndex((w) => w.id === id && w.set);
    if (i >= 0) {
      setActive(i);
      setOpen(WORKS[i]);
    }
  }, []);
  useEffect(() => {
    // Keep the router's history state so Back / Forward keep working.
    window.history.replaceState(window.history.state, "", open ? `#${open.id}` : window.location.pathname);
  }, [open]);

  const go = useCallback((i) => setActive(((i % N) + N) % N), []);

  // Auto scroll. Never pauses on hover; only stops while a project's grid is open.
  // Any arrow click changes `active`, which restarts the 3 second timer from there.
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => go(active + 1), AUTO_MS);
    return () => clearTimeout(t);
  }, [active, open, go]);

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

  // Multi-page projects open their bento grid; single works just slide to the center.
  const openWork = (w, i) => {
    if (w.set) {
      hideCursor();
      go(i);
      setOpen(w);
    } else if (i !== active) go(i);
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
              onClick={() => openWork(w, i)}
              onMouseEnter={(e) => showCursor(e, w)}
              onMouseMove={(e) => showCursor(e, w)}
              onMouseLeave={hideCursor}
            >
              <div className="reel-frame" style={{ background: colors[w.id] ? rgb(colors[w.id]) : undefined }}>
                <img src={w.src} alt={w.title} className={w.contain ? "contain" : ""} draggable="false" />
                {d === 0 && w.set && <span className="explore-badge">Tap to explore</span>}
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
              Explore <span className="hide-sm">the full </span>project →
            </button>
          )}
        </div>
        <button className="arrow reel-arrow" onClick={() => go(active + 1)} aria-label="Next work">→</button>
      </div>

      <div className="reel-progress">
        {WORKS.map((w, i) => (
          <button key={w.id} className={i === active ? "on" : ""} onClick={() => go(i)} aria-label={`Show ${w.title}`}>
            {i === active && !open && <span key={active} style={{ animationDuration: `${AUTO_MS}ms` }} />}
          </button>
        ))}
      </div>

      <div ref={cursorRef} className="explore-cursor" aria-hidden="true">
        <span>Explore</span>
      </div>

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
