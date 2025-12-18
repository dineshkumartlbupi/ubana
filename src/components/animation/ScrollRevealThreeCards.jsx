import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const ScrollReveal = ({ cards }) => {
  const [isDesktop, setIsDesktop] = useState(false);
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);

  // Hide cards initially
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(cardRefs.current, { y: 100, opacity: 0 });
    }, sectionRef);

    return () => ctx.revert();
  }, [cards]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const cardElements = cardRefs.current;

      // DESKTOP — auto timed reveal, first card starts at section 50% view
      if (isDesktop) {
        ScrollTrigger.create({
          trigger: section,
          start: "top 50%", // When section reaches middle of viewport
          once: true,       // Play only once
          onEnter: () => {
            const tl = gsap.timeline();

            cards.forEach((_, i) => {
              tl.to(
                cardElements[i],
                {
                  y: 0,
                  opacity: 1,
                  duration: 1,
                  ease: "power2.out",
                },
                i * 0.5 // delay between cards
              );
            });
          },
        });
      }

      // MOBILE – keep old scroll-based reveal
      else {
        cardElements.forEach((card, i) => {
          if (!card) return;

          gsap.fromTo(
            card,
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [cards, isDesktop]);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`relative w-full overflow-hidden pt-14 md:pt-20 ${isDesktop ? "flex items-center" : ""
        }`}
    >
      <div className="relative w-full flex justify-center overflow-visible">
        <div
          className={`relative w-full ${isDesktop ? "min-h-[480px]" : "h-auto flex flex-col gap-6"
            } overflow-visible`}
        >
          {cards.map((item, i) => (
            <div
              key={i}
              ref={(el) => (cardRefs.current[i] = el)}
              className={`${isDesktop ? "absolute" : "relative"
                } flex flex-col justify-between 
                w-full md:w-[31.5%] 
                h-[348px] md:h-[260px] 
                rounded-xl shadow-xl p-6 
                ${item.color} ${item.text}
              `}
              style={
                isDesktop
                  ? {
                    left: `${i * 34}%`,
                    top: `${i * 90}px`,
                    zIndex: 10 - i,
                  }
                  : { width: "100%" }
              }
            >
              <div>
                <h4 className="text-[2.5rem] md:text-[3rem] font-medium mb-3">
                  {item.title}
                </h4>
              </div>
              <img
                src={item.image}
                alt={item.title}
                className="absolute right-[0] bottom-[0] object-cover"
              />
              <p className="text-base font-normal">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScrollReveal;
