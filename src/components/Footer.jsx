import { EMAIL } from "../pages.js";
export default function Footer() {
  return (
    <footer className="footer">
      <span>© {new Date().getFullYear()} Raunak Garhyan</span>
      <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
    </footer>
  );
}
