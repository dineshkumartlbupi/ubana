import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const ScrollHoldGradientText = ({
  text,
  gradient = "linear-gradient(0deg, #00A571, #1A8BC7)",
  grey = "#C3C3C3",
  className = "",
}) => {
  const words = text.split(" ");
  const ref = useRef(null);

  // ---------- MOBILE DETECTION ----------
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ---------- ALWAYS INITIALIZE HOOKS (NO CONDITIONAL HOOKS) ----------
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.6", "end 0.4"],
  });

  // Precompute transforms for all words (safe)
  const transforms = words.map((_, i) => {
    const start = (i / words.length) * 0.85;
    const end = start + (0.15 / words.length) + 0.05;

    return {
      greyOpacity: useTransform(scrollYProgress, [start, end], [1, 0]),
      colorOpacity: useTransform(scrollYProgress, [start, end], [0, 1]),
    };
  });

  // ---------- MOBILE RENDER ----------
  if (isMobile) {
    return (
      <section className="pt-15 flex items-start justify-center">
        <p className={`flex flex-wrap gap-x-1 ${className}`}>
          {words.map((word, i) => (
            <span
              key={i}
              style={{
                background: gradient,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {word}&nbsp;
            </span>
          ))}
        </p>
      </section>
    );
  }

  // ---------- DESKTOP RENDER ----------
  return (
    <section
      ref={ref}
      className="relative h-[150vh] pt-15 md:pt-25 flex items-start justify-center"
    >
      <div className="sticky top-[20vh]">
        <p className={`flex flex-wrap gap-x-1 ${className}`}>
          {words.map((word, i) => (
            <span key={i} className="relative inline-block">
              {/* Grey layer */}
              <motion.span
                style={{
                  color: grey,
                  opacity: transforms[i].greyOpacity,
                  position: "absolute",
                  left: 0,
                  top: 0,
                  right: 0,
                }}
                className="font-normal"
              >
                {word}
              </motion.span>

              {/* Gradient reveal layer */}
              <motion.span
                style={{
                  background: gradient,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  opacity: transforms[i].colorOpacity,
                }}
              >
                {word}
              </motion.span>

              &nbsp;
            </span>
          ))}
        </p>
      </div>
    </section>
  );
};

export default ScrollHoldGradientText;
