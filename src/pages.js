export const EMAIL = "r2garhyan@gmail.com";
export const CV_URL = "/Raunak_Garhyan_CV.pdf";

// Pages inside the site, in page-carousel order.
export const PAGES = [
  { path: "/", label: "Design Projects", blurb: "Every piece of design work, in one reel" },
  { path: "/about", label: "About", blurb: "Who I am and where my work has been shown" },
  { path: "/hci", label: "HCI / Other Projects", blurb: "Design and technology for every learner" },
];

// Nav items. Contact and CV open in a new tab, as requested in the brief.
export const NAV = [
  { to: "/", label: "Design Projects" },
  { to: "/about", label: "About" },
  { to: "/hci", label: "HCI / Other Projects" },
  { href: `mailto:${EMAIL}`, label: "Contact" },
  { href: CV_URL, label: "CV" },
];
