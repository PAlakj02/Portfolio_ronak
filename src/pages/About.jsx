import { EMAIL } from "../pages.js";
import { openContact } from "../contact.js";

const LOGOS = [
  { src: "/logos/scholastic.png", name: "Scholastic Art & Writing Awards" },
  { src: "/logos/iama.png", name: "International Art Museum of America" },
  { src: "/logos/youngarts.png", name: "YoungArts" },
  { src: "/logos/bowseat.png", name: "Bow Seat Ocean Awareness" },
  { src: "/logos/pausd.png", name: "Palo Alto Unified School District" },
  { src: "/logos/cca.png", name: "California College of the Arts" },
];

export default function About() {
  return (
    <>
      <section className="section about-hello">
        <div className="container hello-grid">
          <div>
            <h1 className="hello">HELLO,</h1>
            <p className="script big">Raunak here!</p>
            <p className="lead">
              I'm Raunak Garhyan, founder of <b>The Design Collective</b>, an initiative for the proliferation
              of design, branding and rebranding, and architecture via education in schools internationally.
            </p>
            <p className="lead">
              A graphic designer and HCI enthusiast available for freelance and contract work across branding
              &amp; rebranding, graphic design, UI/UX development, and marketing visuals.
            </p>
            <p className="lead">
              Whether you're building a brand from scratch or taking an existing one to the next level, I bring
              creative vision and human-centered design to turn ideas into compelling visual experiences.
            </p>
            <p className="lead strong">Have a project? Let's create something great.</p>
            <div className="btn-row">
              <button type="button" className="btn" onClick={openContact}>Let's talk →</button>
            </div>
          </div>
          <aside className="contact-card">
            <span className="cc-tag">Palo Alto, CA</span>
            <div className="img-slot" style={{ aspectRatio: "1 / 1" }}>
              <img src="/img/portrait.jpg" alt="Portrait of Raunak Garhyan" />
            </div>
            <div className="cc-body">
              <h3>CONTACT :</h3>
              <p>Gunn High School</p>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </div>
          </aside>
        </div>
      </section>

      <section className="band-green logos-band" aria-label="Work exhibited, showcased and awarded">
        <div className="marquee">
          <div className="marquee-track">
            {[...LOGOS, ...LOGOS].map((l, i) => (
              <div className="logo-tile" key={i} aria-hidden={i >= LOGOS.length}>
                <img src={l.src} alt={i < LOGOS.length ? l.name : ""} />
              </div>
            ))}
          </div>
        </div>
        <p className="logos-caption">Work Exhibited, Showcased and Awarded</p>
      </section>
    </>
  );
}
