// ScrollToTop.jsx
import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    // Disable browser's default scroll restoration to avoid conflicts
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    if (hash) {
      // For hash navigation (anchor links), wait for DOM then smooth scroll
      const id = hash.replace("#", "");
      let tries = 0;

      const scrollToElement = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        } else if (tries < 50) { // Increased tries
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

    // Optional: Re-enable auto restoration on cleanup if needed, but manual is usually better for SPA
    // return () => { window.history.scrollRestoration = 'auto'; };
  }, [pathname, hash]);

  return null;
}