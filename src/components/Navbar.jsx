import { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { NAV } from "../pages.js";
import { openContact } from "../contact.js";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="/" className="brand">
          <span className="brand-name">Raunak Garhyan</span>
          <span className="brand-script">portfolio</span>
        </Link>
        <button
          className={`burger ${open ? "is-open" : ""}`}
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span /><span /><span />
        </button>
        <nav className={`nav-links ${open ? "open" : ""}`}>
          {NAV.map((n) =>
            n.to ? (
              <NavLink key={n.label} to={n.to} end className={({ isActive }) => (isActive ? "active" : "")}>
                {n.label}
              </NavLink>
            ) : n.action === "contact" ? (
              <button key={n.label} type="button" className="nav-btn" onClick={() => { setOpen(false); openContact(); }}>
                {n.label}
              </button>
            ) : (
              <a key={n.label} href={n.href} target="_blank" rel="noopener noreferrer">
                {n.label} <span className="ext" aria-hidden="true">↗</span>
              </a>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
