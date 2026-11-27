import { useState, useRef, useEffect, Children } from "react";

// Generic slide carousel with arrows, dots, swipe and keyboard support.
// perView: how many slides are visible at once on wide screens.
export default function Carousel({ children, perView = 1, label = "carousel", dark = false, autoplay = 0 }) {
  const slides = Children.toArray(children);
  const [view, setView] = useState(perView);
  const [index, setIndex] = useState(0);
  const touch = useRef(null);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setView(w < 640 ? 1 : w < 960 ? Math.min(2, perView) : perView);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [perView]);

  const max = Math.max(0, slides.length - view);
  useEffect(() => { if (index > max) setIndex(max); }, [max, index]);

  const go = (i) => setIndex(i < 0 ? max : i > max ? 0 : i);

  useEffect(() => {
    if (!autoplay) return;
    const t = setInterval(() => setIndex((i) => (i >= max ? 0 : i + 1)), autoplay);
    return () => clearInterval(t);
  }, [autoplay, max]);

  return (
    <div
      className={`carousel ${dark ? "dark" : ""}`}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(index + 1);
        if (e.key === "ArrowLeft") go(index - 1);
      }}
    >
      <div
        className="carousel-viewport"
        onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touch.current == null) return;
          const dx = e.changedTouches[0].clientX - touch.current;
          if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
          touch.current = null;
        }}
      >
        <div className="carousel-track" style={{ transform: `translateX(-${(index * 100) / view}%)` }}>
          {slides.map((s, i) => (
            <div className="carousel-slide" key={i} style={{ flex: `0 0 ${100 / view}%` }} aria-hidden={i < index || i >= index + view}>
              {s}
            </div>
          ))}
        </div>
      </div>
      {max > 0 && (
        <div className="carousel-controls">
          <button className="arrow" onClick={() => go(index - 1)} aria-label="Previous slide">←</button>
          <div className="dots">
            {Array.from({ length: max + 1 }).map((_, i) => (
              <button key={i} className={i === index ? "on" : ""} onClick={() => setIndex(i)} aria-label={`Go to slide ${i + 1}`} />
            ))}
          </div>
          <button className="arrow" onClick={() => go(index + 1)} aria-label="Next slide">→</button>
        </div>
      )}
    </div>
  );
}
