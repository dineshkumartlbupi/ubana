import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

const CustomMarquee = ({
  items = [],
  speed = 70, // pixels per second
  bgColor = "bg-blue-600",
  textColor = "text-white",
  dotColor = "bg-lime-400",
  pauseOnHover = true,
  gap = 40, // px between items
  direction = "left", // or "right"
}) => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const [copies, setCopies] = useState(2);
  const [trackWidth, setTrackWidth] = useState(0);

  // measure and decide how many copies needed to fill screen
  useEffect(() => {
    if (containerRef.current && trackRef.current) {
      const containerW = containerRef.current.offsetWidth;
      const trackW = trackRef.current.scrollWidth;
      setTrackWidth(trackW);

      // ensure enough copies so container is always filled + 1 extra
      const needed = Math.ceil(containerW / trackW) + 2;
      setCopies(needed);
    }
  }, [items, gap]);

  const duration = trackWidth > 0 ? trackWidth / speed : 10; // seconds

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}      
      whileInView={{ opacity: 1, y: 0 }}    
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
      ref={containerRef}
      className={`relative w-full overflow-hidden py-5 ${bgColor} ${textColor}`}
      role="marquee"
    >
      <div
        className={`flex w-max whitespace-nowrap will-change-transform ${
          pauseOnHover ? "hover:[animation-play-state:paused]" : ""
        }`}
        style={{
          animationName: "marqueeScroll",
          animationDuration: `${duration}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          animationDirection: direction === "left" ? "normal" : "reverse",
        }}
      >
        {Array.from({ length: copies }).map((_, copyIndex) => (
          <div
            key={`copy-${copyIndex}`}
            ref={copyIndex === 0 ? trackRef : null}
            className="flex items-center gap-18 mr-18"
            style={{ gap }}
          >
            {items.map((text, i) => (
              <div key={`${copyIndex}-${i}`} className="flex items-center gap-18">
                <span
                  className={`inline-block h-4 w-4 rounded-full ${dotColor}`}
                ></span>
                <span className="font-normmal text-[2.5rem]">{text}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes marqueeScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-${trackWidth}px); }
        }
      `}</style>
    </motion.div>
  );
};

export default CustomMarquee;