import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LazyImage from "../lazyImage";
import { Link } from "react-router-dom";
import ButtonArrow from "../buttonArrow";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const ScrollRevealRight = ({ cards }) => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const expandedCardRef = useRef(null);

  const [expandedCard, setExpandedCard] = useState(null);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 1024 : false
  );

  const handleToggle = (index) =>
    setExpandedCard((prev) => (prev === index ? null : index));

  // Helper to calculate total width consistently
  const calculateTotalWidth = (isExpanded) => {
    const baseCardWidth = 374;
    const expandedCardWidth = 1162;
    const cardGap = 28;
    const padding = 160;
    const widthDiff = expandedCardWidth - baseCardWidth;

    return cards.length * baseCardWidth +
      (cards.length - 1) * cardGap +
      padding +
      (isExpanded ? widthDiff : 0);
  };

  const triggerRef = useRef(null);

  // --- Effect 1: State Change Handler and Scroll Back (Removed setTimeout) ---
  useEffect(() => {
    expandedCardRef.current = expandedCard;

    // Logic to prevent "jump to bottom" when collapsing (by scrolling back)
    if (expandedCard === null && triggerRef.current) {
      const newTotalWidth = calculateTotalWidth(false);
      const viewportWidth = window.innerWidth;
      const newMaxScroll = newTotalWidth - viewportWidth;

      const safeMaxScroll = Math.max(0, newMaxScroll);

      const currentScroll = window.scrollY;
      const start = triggerRef.current.start;
      const newEnd = start + safeMaxScroll;

      if (currentScroll > newEnd) {
        // Use GSAP.to for smooth scroll back
        gsap.to(window, {
          scrollTo: newEnd,
          duration: 0.5, // Faster scroll back on collapse feels better
          ease: "power2.out",
          overwrite: "auto"
        });
      }
    }
    // Removed: Delayed ScrollTrigger refresh - it's now in Effect 4's onComplete

  }, [expandedCard]);

  // --- Effect 2: Scroll-to-center logic ---
  useEffect(() => {
    if (isMobile || !containerRef.current || expandedCard === null || !triggerRef.current) return;

    const baseCardWidth = 374;
    const gap = 28;
    const expandedCardWidth = 1162;

    // 1. Calculate the ideal visual shift to center the card
    const cardLeft = expandedCard * (baseCardWidth + gap);
    const viewportWidth = window.innerWidth;
    const centerOffset = (viewportWidth - expandedCardWidth) / 2;
    const targetShift = -(cardLeft - centerOffset);

    // 2. Calculate the corresponding Scroll Position
    const totalMovement = -(containerRef.current.scrollWidth - viewportWidth);

    if (totalMovement === 0) return;

    let progress = targetShift / totalMovement;
    progress = Math.max(0, Math.min(1, progress));

    const start = triggerRef.current.start;
    const end = triggerRef.current.end;
    const totalScrollDistance = end - start;

    const targetScrollPos = start + (totalScrollDistance * progress);

    // 3. Animate scroll to that position
    gsap.to(window, {
      scrollTo: targetScrollPos,
      duration: 1, // MUST match card expansion duration
      ease: "power3.out",
      overwrite: "auto"
    });

  }, [expandedCard, isMobile]);

  const calculateCardShift = (index, expandedIndex) => {
    const baseCardWidth = 374;
    const expandedCardWidth = 1162;
    const widthDifference = expandedCardWidth - baseCardWidth;

    if (expandedIndex === null) return 0;
    if (index <= expandedIndex) return 0;

    return widthDifference;
  };

  // --- Effect 3: Initial Card Fade-in Animation (Unchanged) ---
  useEffect(() => {
    if (isMobile || !sectionRef.current || cards.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from(cardRefs.current, {
        opacity: 0,
        y: 120,
        scale: 0.92,
        duration: 1,
        stagger: 0.25,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: false,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [cards.length, isMobile]);

  // --- Effect 4: Card Width, Position Tweens, and ScrollTrigger Refresh (MODIFIED) ---
  useEffect(() => {
    if (!containerRef.current || cardRefs.current.length === 0 || isMobile)
      return;

    const baseCardWidth = 374;
    const expandedCardWidth = 1162;
    const isChanging = expandedCard !== null; // Flag to track if we need a refresh

    cards.forEach((_, i) => {
      const isExpanding = expandedCard === i;
      const newWidth = isExpanding ? expandedCardWidth : baseCardWidth;
      const xShift = calculateCardShift(i, expandedCard);

      gsap.to(cardRefs.current[i], {
        width: newWidth,
        x: xShift,
        duration: 1,
        ease: "power3.inOut",
      });
    });

    const totalWidth = calculateTotalWidth(expandedCard !== null);

    // Animate container width, and trigger refresh ONLY when this tween completes
    gsap.to(containerRef.current, {
      width: totalWidth,
      duration: 1,
      ease: "power3.inOut",
      onComplete: () => {
        // This fires after 1 second, when the layout shift is fully complete.
        // This is the smoothest time to tell ScrollTrigger to recalculate its range.
        ScrollTrigger.refresh();
      }
    });
  }, [expandedCard, isMobile, cards.length]);

  // --- Effect 5: Main ScrollTrigger Setup (Unchanged) ---
  useEffect(() => {
    if (isMobile || !sectionRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      if (!cardRefs.current.length) return;

      const getMaxScroll = () => {
        const isExpanded = expandedCardRef.current !== null;
        const viewportWidth = document.documentElement.clientWidth || window.innerWidth;

        const calculatedTotalWidth = calculateTotalWidth(isExpanded);

        return calculatedTotalWidth - viewportWidth;
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${getMaxScroll()}`,
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      triggerRef.current = tl.scrollTrigger;

      tl.to(containerRef.current, {
        x: () => -getMaxScroll(),
        ease: "none",
        duration: 1,
      });
    }, sectionRef);

    return () => {
      const currentX = gsap.getProperty(containerRef.current, "x");
      ctx.revert();
      gsap.set(containerRef.current, { x: currentX });
    };
  }, [cards.length, isMobile]);

  return (
    <section
      ref={sectionRef}
      className={`relative w-full nnn  ${isMobile ? "py-12.5 ml-10" : "min-h-screen pt-20"
        }`}
    >
      <div
        className={`relative w-full ${isMobile
          ? ""
          : "h-screen flex items-center justify-start"
          }`}
      >
        <div
          ref={containerRef}
          className={`relative w-full overflow-visible ${isMobile ? "flex flex-col gap-8 pr-4" : "h-[700px]"
            }`}
          style={
            !isMobile
              ? {
                display: "flex",
                gap: "28px",
                position: "relative",
                height: "100%"
              }
              : {}
          }
        >
          {cards.map((item, i) => {
            const isExpanded = expandedCard === i;
            const baseCardWidth = 374;
            const cardGap = 28;
            const initialLeft = i * (baseCardWidth + cardGap);
            const zIndex = isExpanded ? 1000 : cards.length - i;

            return (
              <div
                key={i}
                ref={(el) => (cardRefs.current[i] = el)}
                onClick={() => handleToggle(i)}
                className={`${isMobile ? "relative w-full!" : "absolute"
                  } rounded-2xl -ml-10 bg-[#E1E9FF] flex flex-col p-3.5 ${item.color}`}
                style={
                  isMobile
                    ? {
                      width: "100%",
                      minHeight: isExpanded ? "initial" : "330px",
                    }
                    : {
                      width: `${baseCardWidth}px`,
                      minHeight: "306px",
                      top: `${i === 0 ? 35 : i * 120}px`,
                      left: `${80 + initialLeft}px`,
                      zIndex: zIndex,
                      transformOrigin: "left center",
                    }
                }
              >
                <div
                  className={`bg-[#001528] rounded-lg p-6 min-h-[300px] md:min-h-[278px] flex relative overflow-hidden ${isMobile
                    ? isExpanded
                      ? "flex-col pr-0"
                      : "items-end"
                    : isExpanded
                      ? "items-start justify-between pr-0"
                      : "items-end"
                    }`}
                >
                  <button
                    className={`arrow-btn absolute sfsdf top-5 right-5 transition-all duration-300 z-20 ${isExpanded ? "opacity-0 scale-0" : "opacity-100 scale-100"
                      }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggle(i);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="34"
                      height="34"
                      viewBox="0 0 34 34"
                      fill="none"
                    >
                      <path
                        d="M28.4771 4.75266L17.5493 4.75261C17.1238 4.7197 16.7522 5.03791 16.7193 5.46343C16.6864 5.88889 17.0046 6.26054 17.4301 6.29341C17.4698 6.29646 17.5097 6.29651 17.5493 6.29341L26.6139 6.2989L4.98228 27.9305C4.68054 28.2323 4.68054 28.7216 4.98233 29.0233C5.28411 29.3251 5.77334 29.3251 6.07507 29.0233L27.7067 7.3917L27.7067 16.4508C27.6738 16.8763 27.992 17.2479 28.4175 17.2808C28.843 17.3137 29.2146 16.9955 29.2475 16.57C29.2506 16.5303 29.2506 16.4905 29.2475 16.4508V5.52296C29.2463 5.09811 28.9021 4.75393 28.4771 4.75266Z"
                        fill="#B6D1F0"
                      />
                    </svg>
                  </button>

                  {/* close */}
                  <button
                    className={`cross-btn absolute top-5 right-5 transition-all duration-300 z-20 ${isExpanded ? "opacity-100 scale-100" : "opacity-0 scale-0"
                      }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggle(i);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="34"
                      height="34"
                      viewBox="0 0 34 34"
                      fill="none"
                    >
                      <path
                        d="M25.5 8.5L8.5 25.5M8.5 8.5L25.5 25.5"
                        stroke="#B6D1F0"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  <div
                    className={`${isMobile ? "w-full" : isExpanded ? "w-[30%]" : ""
                      }`}
                  >
                    <h4
                      className={`text-2xl md:text-3xl text-[#FFBF3C] uppercase font-medium mb-3 ${isExpanded && !isMobile ? "text-4xl" : ""
                        }`}
                    >
                      {item.title}
                    </h4>

                    <p className="text-sm text-white mb-3">{item.percent}</p>

                    <p
                      className={`text-sm text-white ${isMobile
                        ? isExpanded
                          ? ""
                          : "line-clamp-2"
                        : isExpanded
                          ? "max-w-4xl"
                          : "max-w-sm line-clamp-2"
                        }`}
                    >
                      {item.desc}
                    </p>

                    {item?.btnText && item?.btnUrl && (
                      <div className="flex md:mt-5 mt-8">
                        <ButtonArrow
                          to={item.btnUrl}
                          text={item.btnText}
                          bgColor="#FFBF3C"
                          hoverColor="#1269CD"
                          textColor="#000"
                          hoverTextColor="#fff"
                          padding="pl-4 py-1 pr-1 w-full md:w-auto"
                          rounded="rounded-full"
                          textSize="text-base"
                        />
                      </div>
                    )}
                  </div>

                  {isExpanded && (
                    <div
                      className={`w-full animate-fadeIn flex ${isMobile ? "justify-center mt-6" : "pl-8 justify-end"
                        }`}
                    >
                      <Link to={item.url}>
                        <LazyImage
                          effect="blur"
                          src={item.image}
                          alt={item.alt}
                          wrapperClassName="block!"
                        />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ScrollRevealRight;