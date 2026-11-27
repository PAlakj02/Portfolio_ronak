// Image slot. Pass `src` to show a real image, otherwise a labelled placeholder is shown.
export default function Placeholder({ src, alt = "", label = "Add image here", ratio = "4 / 3", className = "", contain = false }) {
  if (src) {
    return (
      <div className={`img-slot ${className}`} style={{ aspectRatio: ratio }}>
        <img src={src} alt={alt} loading="lazy" style={{ objectFit: contain ? "contain" : "cover" }} />
      </div>
    );
  }
  return (
    <div className={`img-slot ph ${className}`} style={{ aspectRatio: ratio }} role="img" aria-label={label}>
      <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="9" cy="10" r="2" />
        <path d="M21 17l-5-5-9 8" />
      </svg>
      <span>{label}</span>
    </div>
  );
}
