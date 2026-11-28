import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { EMAIL } from "../pages.js";

// Messages are delivered to my inbox through FormSubmit (no backend needed).
const ENDPOINT = `https://formsubmit.co/ajax/${EMAIL}`;

export default function ContactModal() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const firstRef = useRef(null);

  useEffect(() => {
    const onOpen = () => {
      setStatus("idle");
      setOpen(true);
    };
    window.addEventListener("open-contact", onOpen);
    return () => window.removeEventListener("open-contact", onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    setTimeout(() => firstRef.current?.focus(), 50);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
          _subject: `Portfolio message from ${form.name}`,
          _template: "table",
          _captcha: "false",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || String(data.success) === "false") throw new Error(data.message || "failed");
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const mailtoFallback = `mailto:${EMAIL}?subject=${encodeURIComponent(
    `Portfolio message from ${form.name || "a visitor"}`
  )}&body=${encodeURIComponent(form.message)}`;

  return createPortal(
    <div className="contact-overlay" onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}>
      <div className="contact-box" role="dialog" aria-modal="true" aria-labelledby="contact-title">
        <button className="contact-close" onClick={() => setOpen(false)} aria-label="Close">×</button>

        <div className="contact-side">
          <span className="eyebrow light">Get in touch</span>
          <h2 id="contact-title">
            Contact <span className="script">me</span>
          </h2>
          <p>Have a project, a collaboration or just want to say hi? Drop me a message and I'll get back to you.</p>
          <a className="contact-mail" href={`mailto:${EMAIL}`}>
            <span>Email</span>
            {EMAIL}
          </a>
          <div className="contact-mail">
            <span>Based in</span>
            Palo Alto, CA
          </div>
        </div>

        {status === "sent" ? (
          <div className="contact-done">
            <span className="contact-check" aria-hidden="true">✓</span>
            <h3>Message sent!</h3>
            <p>Thank you for reaching out. I'll reply as soon as I can.</p>
            <button className="btn" onClick={() => setOpen(false)}>Close</button>
          </div>
        ) : (
          <form className="contact-fields" onSubmit={submit}>
            <label>
              <span>Your name</span>
              <input ref={firstRef} required value={form.name} onChange={set("name")} placeholder="Jane Doe" />
            </label>
            <label>
              <span>Your email</span>
              <input type="email" required value={form.email} onChange={set("email")} placeholder="jane@example.com" />
            </label>
            <label>
              <span>Message</span>
              <textarea required rows={5} value={form.message} onChange={set("message")} placeholder="Tell me about your idea..." />
            </label>
            {status === "error" && (
              <p className="contact-error">
                Something went wrong sending that. You can{" "}
                <a href={mailtoFallback}>send it from your email app</a> instead.
              </p>
            )}
            <button className="btn" type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Sending..." : "Send message →"}
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
