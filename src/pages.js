export const EMAIL = "r2garhyan@gmail.com";
export const CV_URL = "/Raunak_Garhyan_CV.pdf";

// Pages inside the site, in page-carousel order.
export const PAGES = [
  { path: "/", label: "Design Projects", blurb: "Every piece of design work, in one reel" },
  { path: "/about", label: "About", blurb: "Who I am and where my work has been shown" },
  { path: "/hci", label: "HCI / Other Projects", blurb: "Design and technology for every learner" },
];

// Nav items. Contact opens the contact box; CV opens in a new tab.
export const NAV = [
  { to: "/", label: "Design Projects" },
  { to: "/about", label: "About" },
  { to: "/hci", label: "HCI / Other Projects" },
  { action: "contact", label: "Contact" },
  { href: CV_URL, label: "CV" },
];
