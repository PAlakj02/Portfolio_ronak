// Design Projects reel: slides 3 to 20 from the brief, in order.
// `set` marks a multi-page project: hovering shows the "explore" cursor and clicking opens a bento grid.
// span: "wide" (2 cols), "tall" (2 rows), "big" (2x2) controls the bento layout.
const w = (f) => `/work/${f}`;

export const WORKS = [
  {
    id: "allways", slide: 3, title: "ALLWAYS", kind: "Landscape & Public Space Design", src: w("allways-hero.jpg"),
    blurb: "ALLWAYS is a park to wander, discover and connect. Rather than dividing the park into fixed zones, I imagined it as a series of connected centers for sport, play and spectacle. The gazebos and pathways take their shape from the myelin sheath, linking every part of the park the way neurons link the mind.",
    set: [
      { src: w("allways-hero.jpg"), span: "big" },
      { src: w("allways-2.jpg"), span: "wide" },
      { src: w("allways-3.jpg"), span: "wide" },
      { src: w("allways-4.jpg"), span: "wide" },
      { src: w("allways-5.jpg"), span: "wide" },
    ],
  },
  {
    id: "glubi", slide: 6, title: "glubi", kind: "Product & Brand Identity", src: w("glubi-hero.jpg"),
    blurb: "glubi is a line of CGM comfort accessories for kids. It is a child friendly add-on for Continuous Glucose Monitoring applicators, designed to ease pain, needle fear and anxiety when a new sensor goes on. I paired playful animal mascots with Gate Control Therapy, then built the full brand: wordmark, colors, type and packaging.",
    set: [
      { src: w("glubi-hero.jpg"), span: "big" },
      { src: w("glubi-2.jpg"), span: "wide" },
      { src: w("glubi-3.jpg"), span: "wide" },
      { src: w("glubi-4.jpg"), span: "wide" },
      { src: w("glubi-5.jpg"), span: "wide" },
    ],
  },
  { id: "s8", slide: 8, title: "Coastline", kind: "3D Environment", src: w("slide8.jpg") },
  { id: "s9", slide: 9, title: "Night Forest", kind: "3D Environment", src: w("slide9.jpg") },
  { id: "s10", slide: 10, title: "Spectra Art", kind: "Logo Design", src: w("slide10.jpg"), contain: true },
  {
    id: "iifa", slide: 11, title: "IIFA Awards", kind: "3D Set & Stage Design", src: w("iifa-hero.jpg"),
    blurb: "A lounge and stage concept for the IIFA Awards. I modeled, lit and rendered the lounge spaces in 3D and animated the stage visuals, aiming for a warm, cinematic feel that celebrates the films on the walls.",
    set: [
      { src: w("iifa-hero.jpg"), span: "big" },
      { src: w("iifa-lounge.jpg"), span: "wide" },
      { video: w("iifa-stage.mp4"), poster: w("iifa-stage-poster.jpg"), span: "wide" },
    ],
  },
  {
    id: "telescope", slide: 13, title: "Telescope", kind: "UI / UX Design", src: w("telescope-hero.jpg"),
    blurb: "Flashcards are telescopes to new concepts. Telescope is a study app I designed for personalized learning through AI powered flashcards. I designed the landing page, the generate flow, the dashboard and the deck viewer.",
    set: [
      { src: w("telescope-hero.jpg"), span: "big" },
      { src: w("telescope-generate.jpg"), span: "wide" },
      { src: w("telescope-dashboard.jpg"), span: "wide" },
      { src: w("telescope-deck.jpg"), span: "wide" },
    ],
  },
  {
    id: "terrium", slide: 15, title: "Terrium", kind: "Architecture", src: w("terrium-hero.jpg"),
    blurb: "Terrium is an architectural concept I took from loose sketches to final renders. I explored how the building sits in its landscape, how people move through it and how light fills the interior.",
    set: [
      { src: w("terrium-hero.jpg"), span: "big" },
      { src: w("terrium-top.jpg"), span: "tall" },
      { src: w("terrium-interior.jpg") },
      { src: w("terrium-sketches.jpg") },
    ],
  },
  { id: "s19", slide: 19, title: "Hearth", kind: "3D Interior", src: w("slide19.jpg") },
  { id: "s20", slide: 20, title: "Abandoned", kind: "3D Environment", src: w("slide20.jpg") },
];
