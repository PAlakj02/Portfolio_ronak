import Placeholder from "../components/Placeholder.jsx";
import Carousel from "../components/Carousel.jsx";

const PROJECTS = [
  {
    title: "KIIT JEE",
    place: "Gurugram, India",
    link: "https://kiitjee.in/activities/",
    linkLabel: "kiitjee.in/activities",
    text: [
      "I taught graphic design workshops for KIIT JEE schools in Gurugram, India, introducing more than 100 students to Photoshop, Illustrator and core design principles like color theory, composition and the golden ratio.",
      "Building on those workshops, I designed a graphic design curriculum for three KIIT JEE schools in Haryana, the first formal Digital Arts program for KIIT JEE, reaching students from grades 6 to 9.",
    ],
    images: [
      { label: "Add a photo from the KIIT JEE workshops" },
      { label: "Add student work from the workshops" },
      { label: "Add a curriculum or certificate photo" },
    ],
  },
  {
    title: "Visual Arts Program, PAUSD",
    place: "Palo Alto",
    text: [
      "I volunteer my time and design expertise to support primary and middle schools through creative instruction, digital design education, and graphic design services.",
      "I help students discover their creative potential while supporting schools with visual communication, educational materials, and design needs.",
    ],
    images: [
      { label: "Add a photo from the PAUSD Visual Arts program" },
      { label: "Add a design I made for PAUSD" },
      { label: "Add another PAUSD photo" },
    ],
  },
  {
    title: "LitGrades",
    place: "AI Study Companion",
    link: "https://litgrades.com/",
    linkLabel: "litgrades.com",
    text: [
      "LitGrades is an AI-powered study companion that generates flashcards, worksheets, quizzes, and study notes on demand. Type what you want to learn, and LitGrades curates focused learning materials so you can spend less time organizing and more time actually studying.",
    ],
    images: [
      { src: "/img/litgrade.png", label: "LitGrades screenshot", contain: true },
    ],
  },
  {
    title: "Contour",
    place: "Accessible Web Game",
    link: "https://contour-second.vercel.app/",
    linkLabel: "contour-second.vercel.app",
    text: [
      "I built Contour, a web-based game for students with ASD and motor-related special needs to practice hand-eye coordination by tracing SVG forms with Bézier curves.",
      "It's deployed in Gurugram primary schools with 60+ student users.",
    ],
    images: [
      { src: "/img/contour.jpg", label: "Contour game start screen", contain: true },
      { label: "Add a gameplay screenshot" },
      { label: "Add a photo of students playing" },
    ],
  },
];

export default function Hci() {
  return (
    <>
      <section className="section hci-intro">
        <div className="container">
          <span className="eyebrow">HCI / Other Projects</span>
          <blockquote className="manifesto">
            I believe the true power of technology and design lies in their ability to break barriers, unlock
            potential, and create opportunities for every learner. Nowhere is this more important than in
            education, where accessible, thoughtfully designed experiences can transform how students learn,
            grow, and interact with the world!
          </blockquote>
        </div>
      </section>

      {PROJECTS.map((p, i) => (
        <section key={p.title} className={`section hci-project ${i % 2 === 0 ? "band-green" : "band-cream2"}`}>
          <div className={`container hci-grid ${i % 2 ? "flip" : ""}`}>
            <div className="hci-text">
              <span className="hci-num">0{i + 1}</span>
              <h2 className="h2">{p.title}</h2>
              <p className="hci-place">{p.place}</p>
              {p.text.map((t) => <p key={t} className="hci-body">{t}</p>)}
              {p.link && (
                <a className={`btn ${i % 2 === 0 ? "light" : ""}`} href={p.link} target="_blank" rel="noopener noreferrer">
                  Visit {p.linkLabel} ↗
                </a>
              )}
            </div>
            <div className="hci-media">
              <Carousel perView={1} label={`${p.title} images`} dark={i % 2 === 0}>
                {p.images.map((im, k) => (
                  <Placeholder key={k} src={im.src} alt={im.label} label={im.label} ratio="16 / 10" contain={im.contain} />
                ))}
              </Carousel>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
