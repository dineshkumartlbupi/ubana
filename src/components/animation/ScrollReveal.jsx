import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ScrollReveal = ({ cards }) => {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);

  const [isDesktop, setIsDesktop] = useState(false);

  // Sync cardRefs length - Safe approach: clear invalid refs before render or just rely on index
  // We don't need to pre-fill with nulls in an Effect, as that causes race conditions.

  // Detect desktop / mobile
  useEffect(() => {
    const update = () => setIsDesktop(window.innerWidth >= 1024);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // -------------------------------------------------------
  // GSAP ANIMATION (Desktop & Mobile)
  // -------------------------------------------------------
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Filter out null refs
      const validCards = cardRefs.current.filter((el) => el !== null);
      if (validCards.length === 0) return;

      // Set initial state
      gsap.set(validCards, {
        opacity: 0,
        y: 50,
        scale: 0.95
      });

      // Create timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%", // Starts when top of section hits 60% of viewport
          end: "bottom top",
          toggleActions: "play none none reverse", // Play on enter, Reverse on leave back (scroll up)
        }
      });

      tl.to(validCards, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        stagger: 0.7,
        ease: "power2.out"
      });

    }, sectionRef);

    return () => ctx.revert();
  }, [cards.length, isDesktop]);

  return (
    <section ref={sectionRef} className="overflow-hidden  pt-10">
      <h3 className="text-[1.75rem] text-[#003066] font-medium tracking-tight text-center md:text-left mb-10">
        Transformative Outcomes
      </h3>

      <div className="relative w-full flex justify-center overflow-visible">
        <div
          className={`w-full ${isDesktop
            ? "flex justify-between items-start gap-6 h-[600px]"
            : "relative h-[550px] overflow-visible"
            }`}
        >
          {cards.map((item, i) => {
            return (
              <div
                key={i}
                ref={(el) => (cardRefs.current[i] = el)}
                className={`flex flex-col justify-between 
                  w-full md:w-[24%]
                  h-[348px] md:h-[308px]
                  rounded-xl shadow-xl p-6
                  transition-all duration-700 
                  ${item.color} ${item.text}`}
                style={
                  isDesktop
                    ? {
                      position: "relative",
                      top: `${i * 60}px`,
                      opacity: 0, // Initial GSAP state handles this
                    }
                    : {
                      position: "absolute",
                      top: `${i * 60}px`,
                      left: 0,
                      right: 0,
                      margin: "auto",
                      zIndex: i,
                      opacity: 0, // Initial GSAP state handles this
                    }
                }
              >
                <div>
                  <h4 className="text-sm uppercase font-medium mb-3">
                    {item.title}
                  </h4>
                  <p className="text-[5.5rem] font-medium mb-3">
                    {item.percent}
                  </p>
                </div>
                <p className="text-base font-normal">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ScrollReveal;
