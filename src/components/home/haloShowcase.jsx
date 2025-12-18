import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, LayoutGroup } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import VideoCard from "../animation/VideoCard";

gsap.registerPlugin(ScrollTrigger);

const HaloShowcase = () => {
  const [active, setActive] = useState(0);
  const containerRef = useRef(null);
  const itemRefs = useRef([]); // Refs for scrolling to items on mobile
  const [sectionVisible, setSectionVisible] = useState(false);
  const progressHeight = useMotionValue("0%");
  const data = [
    {
      id: 0,
      number: "01",
      title: "HALO Genie",
      desc: "AI-powered conversational automation for faster self-service and frictionless customer journeys.",
      points: [
        {
          icon: "../assets/images/home/showcase-list-icon-one.svg",
          alt: "hexa icon",
          text: "Transforming Customer Experience with  intelligence",
        },
        {
          icon: "../assets/images/home/showcase-list-icon-two.svg",
          alt: "triangle icon",
          text: "AI-driven Conversation",
        },
        {
          icon: "../assets/images/home/showcase-list-icon-three.svg",
          alt: "circuit icon",
          text: "Data-driven Personalization",
        },
        {
          icon: "../assets/images/home/showcase-list-icon-four.svg",
          alt: "chat icon",
          text: "Infinite and On-demand Scale",
        },
      ],
      url: "/our-solution/genie",
      color: "#E6A93E",
      img: "../assets/images/home/halo-genie.webp",
    },
    {
      id: 1,
      number: "02",
      title: "HALO Connect",
      desc: "Unified communication layer connecting customers across channels and systems.",
      points: [
        {
          icon: "../assets/images/home/showcase-list-icon-one.svg",
          alt: "hexa icon",
          text: "Enabling Efficient and Effective Agent Communication with  Connect",
        },
        {
          icon: "../assets/images/home/showcase-list-icon-two.svg",
          alt: "triangle icon",
          text: "AI-powered Advanced Automation for Self-help, Biometric Support",
        },
        {
          icon: "../assets/images/home/showcase-list-icon-three.svg",
          alt: "circuit icon",
          text: "AI-powered Agent Assistance, Disposition Handling",
        },
        {
          icon: "../assets/images/home/showcase-list-icon-four.svg",
          alt: "chat icon",
          text: "Post Call Analytics, Speech Analytics",
        },
      ],
      url: "/our-solution/connect",
      color: "#E6A93E",
      img: "../assets/images/home/halo-connect.webp",
    },
    {
      id: 2,
      number: "03",
      title: "HALO Speech",
      desc: "Speech AI engine enabling real-time transcription, analytics, and emotion detection.",
      points: [
        {
          icon: "../assets/images/home/showcase-list-icon-one.svg",
          alt: "hexa icon",
          text: "Post Call Analytics, Speech Analytics",
        },
        {
          icon: "../assets/images/home/showcase-list-icon-two.svg",
          alt: "triangle icon",
          text: "Adherence, Summarization, Detection, Identification",
        },
        {
          icon: "../assets/images/home/showcase-list-icon-three.svg",
          alt: "circuit icon",
          text: "AI-powered Recommendation",
        },
        {
          icon: "../assets/images/home/showcase-list-icon-four.svg",
          alt: "chat icon",
          text: "Agent Feedback",
        },
      ],
      url: "/our-solution/speech",
      color: "#E6A93E",
      img: "../assets/images/home/halo-speech.webp",
    },
  ];

  // --- Scroll animation logic ---
  useEffect(() => {
    const total = data.length;

    const createScrollTrigger = () => {
      const isDesktop = window.innerWidth >= 768; // md breakpoint

      // Only create ScrollTrigger on desktop
      if (!isDesktop) {
        return { revert: () => { } }; // Return dummy context for mobile
      }

      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: () => window.innerWidth >= 1280 ? "top top+=96" : "top top+=80", // Offset for Navbar
          end: () => `+=${window.innerHeight * (total - 1)}`,
          pin: true,
          pinSpacing: true,
          invalidateOnRefresh: true, // Handle resize better
          scrub: 0.5, // Add a little scrub for smoothness if we were animating properties, but here it helps sync
          onUpdate: (self) => {
            // Calculate which section is currently in view based on scroll progress
            // We use a slightly more precise calculation to switch active state
            const progress = self.progress;

            // Update the progress bar height smoothly
            const startFraction = 1 / total;
            const currentFraction = startFraction + progress * ((total - 1) / total);
            progressHeight.set(`${currentFraction * 100}%`);

            // Map progress 0-1 to index 0-(total-1)
            const index = Math.round(progress * (total - 1));
            setActive(Math.min(index, total - 1));
          },
        });
      }, containerRef);

      return ctx;
    };

    let ctx = createScrollTrigger();

    // Debounced resize handler to avoid excessive re-renders
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        ctx.revert();
        ScrollTrigger.refresh();
        ctx = createScrollTrigger();
      }, 250); // Wait 250ms after resize ends
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
      ctx.revert();
    };
  }, []);

  // --- Handle click (scrolls to corresponding position) ---
  const handleClick = (index, event) => {
    const isDesktop = window.innerWidth >= 768;

    // On mobile, prevent any default scroll behavior
    if (!isDesktop) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      // Scroll to the clicked item with offset
      setTimeout(() => {
        const element = itemRefs.current[index];
        if (element) {
          const headerOffset = 100; // Adjust based on your header height
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      }, 300); // Wait for layout animation to settle
    }

    // Always set active state immediately for responsiveness
    setActive(index);

    // Only use scroll animation on desktop
    if (isDesktop) {
      const total = data.length;

      const triggerStart = containerRef.current.offsetTop;
      const duration = window.innerHeight * (total - 1);

      const scrollPosition = triggerStart + (index / (total - 1)) * duration;

      gsap.to(window, {
        scrollTo: { y: scrollPosition, autoKill: false },
        duration: 1,
        ease: "power2.out",
      });
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative z-10 w-full! bg-[#001528] overflow-hidden pt-8 xl:pt-6 2xl:pt-10 pb-22"
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{
          opacity: 1,
          transitionEnd: () => {
            setSectionVisible(true); // <-- Enable content AFTER animation completes
          },
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="w-full px-4 xl:px-12 2xl:px-22 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          {/* LEFT IMAGE */}
          <div className="hidden md:flex justify-center items-center relative sticky top-32">
            <AnimatePresence mode="wait">
              <motion.img
                key={data[active].img}
                src={data[active].img}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.6 }}
                className="rounded-2xl w-full md:w-[70%] shadow-2xl object-cover"
                alt={data[active].title}
              />
            </AnimatePresence>
          </div>

          {/* RIGHT CONTENT */}
          <div className="relative lg:pr-20 flex flex-col gap-y-7 xl:gap-y-8 2xl:gap-y-11">
            {/* Progress line */}
            <div className="absolute left-[4px] md:left-[10px] top-0 bottom-0 w-[2px] bg-gray-700 rounded-full">
              <motion.div
                className="absolute left-0 top-0 w-[2px] bg-linear-to-t from-[#FFF59E] to-[#001528] rounded-full"
                style={{
                  height: progressHeight,
                }}
              ></motion.div>
            </div>

            <LayoutGroup>
              {data.map((item, index) => (
                <motion.div
                  key={item.id}
                  ref={(el) => (itemRefs.current[index] = el)}
                  initial={false}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                  onClick={(e) => handleClick(index, e)}
                  className={`cursor-pointer pl-8 md:pl-9 transition-colors duration-500 ${active === index ? "" : " hover:border-gray-500"
                    }`}
                >
                  <div className="flex items-center gap-3 2xl:mb-6 xl:mb-3 mb-4 relative">
                    {/* <div
                    className={`w-3 h-3 rounded-full transition-all duration-500 ${
                      active === index ? "bg-yellow-400" : "bg-gray-500"
                    }`}
                  ></div> */}
                    <p className="absolute -left-[38px] top-0 bg-[#001528] text-base font-bold leading-[1.75rem] text-[#EFEFEF]">
                      {item.number}
                    </p>
                    <div className="w-9.5 h-9.5 relative">
                      <img
                        className={`absolute w-full h-full left-0 top-0 transition-all ease-in-out duration-500 ${active === index ? "opacity-0" : "opacity-100"
                          }`}
                        src="/assets/images/home/halo-gray.svg"
                        alt="halo gray icon"
                      />
                      <img
                        className={`absolute w-full h-full left-0 top-0 transition-all ease-in-out duration-500 ${active === index ? "opacity-100" : "opacity-0"
                          }`}
                        src="/assets/images/home/halo-color.svg"
                        alt="halo color icon"
                      />
                    </div>
                    <h3
                      className={`leading-[26px] font-semibold text-white transition-all ease-in-out duration-500 ${active === index
                        ? "text-2xl md:text-[1.625rem]"
                        : "text-2xl md:text-[1.375rem]"
                        }`}
                    >
                      {item.title}
                    </h3>
                  </div>

                  <AnimatePresence>
                    {sectionVisible && active === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                        className="space-y-3 pl-0 md:pl-12.5"
                      >
                        <p className="text-lg xl:text-base 2xl:text-lg font-normal text-white 2xl:mb-7.5 mb-4 pt-2">
                          {item.desc}
                        </p>
                        {/* Mobile image - shows only on mobile */}
                        <div className="md:hidden mb-4">
                          <AnimatePresence mode="wait">
                            <motion.img
                              key={item.img}
                              src={item.img}
                              initial={{ opacity: 0, y: 40 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -40 }}
                              transition={{ duration: 0.6 }}
                              className="rounded-2xl w-full shadow-2xl object-cover"
                              alt={item.title}
                            />
                          </AnimatePresence>
                        </div>
                        {item.points.map((point, i) => (
                          <div
                            key={i}
                            className="flex items-center bg-[#354DED]/20 text-base xl:text-sm 2xl:text-base leading-5 text-[#EBEBEB] xl:p-2 2xl:p-4 p-3 rounded-lg border border-[#1E2B56]"
                          >
                            <span className="mr-2 w-6 xl:w-5 2xl:w-6 h-6 xl:h-5 2xl:h-6">
                              <img src={point.icon} alt={point.alt} />
                            </span>{" "}
                            <span className="flex-1">{point.text}</span>
                          </div>
                        ))}
                        <div className="pb-2">
                          <Link
                            to={item.url}
                            style={{ backgroundColor: item.color }}
                            className="flex items-center justify-center w-full mt-4.5 px-6 py-2.5 text-base font-normal leading-5 rounded-full text-black"
                          >
                            Explore more
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </LayoutGroup>
          </div>
        </div>
      </motion.div>
      <VideoCard />
    </section>
  );
};

export default HaloShowcase;
