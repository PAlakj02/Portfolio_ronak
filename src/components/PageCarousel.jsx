import { useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PAGES, CV_URL } from "../pages.js";
import { openContact } from "../contact.js";

// Page to page carousel shown at the bottom of every page.
export default function PageCarousel() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const trackRef = useRef(null);
  const i = Math.max(0, PAGES.findIndex((p) => p.path === pathname));
  const prev = PAGES[(i - 1 + PAGES.length) % PAGES.length];
  const next = PAGES[(i + 1) % PAGES.length];

  useEffect(() => {
    const t = trackRef.current;
    const el = t?.children[i];
    if (el) t.scrollTo({ left: el.offsetLeft - t.clientWidth / 2 + el.clientWidth / 2, behavior: "smooth" });
  }, [i]);

  return (
    <section className="page-carousel" aria-label="Page navigation">
      <div className="pc-head">
        <div>
          <span className="eyebrow light">Keep exploring</span>
          <h2 className="pc-title">Next up: <span className="script">{next.label}</span></h2>
        </div>
        <div className="pc-arrows">
          <button className="arrow light" onClick={() => navigate(prev.path)} aria-label={`Previous page: ${prev.label}`}>←</button>
          <button className="arrow light" onClick={() => navigate(next.path)} aria-label={`Next page: ${next.label}`}>→</button>
        </div>
      </div>
      <div className="pc-track" ref={trackRef}>
        {PAGES.map((p, idx) => (
          <Link key={p.path} to={p.path} className={`pc-card ${idx === i ? "current" : ""}`}>
            <span className="pc-num">0{idx + 1}</span>
            <span className="pc-label">{p.label}</span>
            <span className="pc-blurb">{p.blurb}</span>
            <span className="pc-go">{idx === i ? "You are here" : "Go →"}</span>
          </Link>
        ))}
        <button type="button" className="pc-card" onClick={openContact}>
          <span className="pc-num">04</span>
          <span className="pc-label">Contact</span>
          <span className="pc-blurb">Have a project? Let's create something great</span>
          <span className="pc-go">Message me →</span>
        </button>
        <a className="pc-card" href={CV_URL} target="_blank" rel="noopener noreferrer">
          <span className="pc-num">05</span>
          <span className="pc-label">CV</span>
          <span className="pc-blurb">My full resume as a PDF</span>
          <span className="pc-go">Open ↗</span>
        </a>
      </div>
    </section>
  );
}
