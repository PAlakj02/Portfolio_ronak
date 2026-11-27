import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import PageCarousel from "./components/PageCarousel.jsx";
import Footer from "./components/Footer.jsx";
import DesignProjects from "./pages/DesignProjects.jsx";
import About from "./pages/About.jsx";
import Hci from "./pages/Hci.jsx";

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  useEffect(() => {
    document.body.classList.toggle("on-reel", pathname === "/");
  }, [pathname]);
  return (
    <>
      <Navbar />
      <main key={pathname} className="page-enter">
        <Routes>
          <Route path="/" element={<DesignProjects />} />
          <Route path="/about" element={<About />} />
          <Route path="/hci" element={<Hci />} />
          <Route path="*" element={<DesignProjects />} />
        </Routes>
      </main>
      <PageCarousel />
      <Footer />
    </>
  );
}
