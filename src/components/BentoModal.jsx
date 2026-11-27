import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

// Full screen bento grid of every image in a multi-page project, with a Go Back arrow.
export default function BentoModal({ work, bg, onClose }) {
  const backRef = useRef(null);
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    backRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // Rendered into <body> so no animated parent can trap it under the navbar.
  return createPortal(
    <div className="bento-modal" role="dialog" aria-modal="true" aria-label={work.title} style={{ "--modal-bg": bg }}>
      <div className="bento-head">
        <button ref={backRef} className="go-back" onClick={onClose}>
          <span aria-hidden="true">←</span> Go Back
        </button>
        <div className="bento-title">
          <span className="eyebrow light">{work.kind}</span>
          <h2>{work.title}</h2>
        </div>
      </div>
      {work.blurb && <p className="bento-blurb">{work.blurb}</p>}
      <div className="bento-grid">
        {work.set.map((it, i) => (
          <figure key={i} className={`bento-item ${it.span || ""}`} style={{ animationDelay: `${i * 70}ms` }}>
            {it.video ? (
              <video src={it.video} poster={it.poster} autoPlay muted loop playsInline controls />
            ) : (
              <a href={it.src} target="_blank" rel="noopener noreferrer" aria-label="Open full size image">
                <img src={it.src} alt={`${work.title} ${i + 1}`} loading="lazy" />
              </a>
            )}
          </figure>
        ))}
      </div>
    </div>,
    document.body
  );
}
