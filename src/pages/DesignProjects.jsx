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

// Every work opens in the modal: multi-page projects show their full set,
// single works show the one image large.
const setOf = (w) => w.set || [{ src: w.src, span: "solo", contain: w.contain }];

export default function DesignProjects() {
  const [active, setActive] = useState(0);
  const [colors, setColors] = useState({});
  const [paused, setPaused] = useState(false);
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

  const showCursor = (e, w) => {
    if (!finePointer.current || !cursorRef.current) return;
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
    const i = WORKS.findIndex((w) => w.id === id);
    if (i >= 0) {
      setActive(i);
      setOpen(WORKS[i]);
    }
  }, []);
  useEffect(() => {
    window.history.replaceState(null, "", open ? `#${open.id}` : window.location.pathname);
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

  const openWork = (w, i) => {
    hideCursor();
    go(i);
    setOpen(w);
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
              className={`reel-card ${d === 0 ? "center" : ""}`}
              style={{
                transform: `translate(-50%, -50%) translateX(${d * 92}%) scale(${d === 0 ? 1 : 0.78})`,
                opacity: hidden ? 0 : d === 0 ? 1 : 0.55,
                zIndex: 10 - Math.abs(d),
                pointerEvents: hidden ? "none" : "auto",
              }}
              aria-hidden={d !== 0}
              onClick={() => openWork(w, i)}
              onMouseEnter={(e) => {
                if (d === 0) setPaused(true);
                showCursor(e, w);
              }}
              onMouseMove={(e) => showCursor(e, w)}
              onMouseLeave={() => {
                setPaused(false);
                hideCursor();
              }}
            >
              <div className="reel-frame" style={{ background: colors[w.id] ? rgb(colors[w.id]) : undefined }}>
                <img src={w.src} alt={w.title} className={w.contain ? "contain" : ""} draggable="false" />
                {d === 0 && <span className="explore-badge">Tap to explore</span>}
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
          <button className="reel-open" onClick={() => setOpen(current)}>
            {current.set ? "Explore the full project →" : "View it larger →"}
          </button>
        </div>
        <button className="arrow reel-arrow" onClick={() => go(active + 1)} aria-label="Next work">→</button>
      </div>

      <div className="reel-progress">
        {WORKS.map((w, i) => (
          <button key={w.id} className={i === active ? "on" : ""} onClick={() => go(i)} aria-label={`Show ${w.title}`}>
            {i === active && !paused && !open && <span key={active} style={{ animationDuration: `${AUTO_MS}ms` }} />}
          </button>
        ))}
      </div>

      <div ref={cursorRef} className="explore-cursor" aria-hidden="true">
        <span>Explore</span>
      </div>

      {open && (
        <BentoModal
          work={{ ...open, set: setOf(open) }}
          bg={rgb((colors[open.id] || [30, 30, 30]).map((v) => Math.round(v * 0.35)))}
          onClose={() => setOpen(null)}
        />
      )}
    </section>
  );
}
