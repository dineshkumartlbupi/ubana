// ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // For hash navigation (anchor links), wait for DOM then smooth scroll
      const id = hash.replace("#", "");
      let tries = 0;

      const scrollToElement = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        } else if (tries < 10) {
          tries++;
          requestAnimationFrame(scrollToElement);
        }
      };

      // Small delay to ensure page is ready
      setTimeout(scrollToElement, 100);
    } else {
      // For page navigation, instant scroll to top
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}