// import React, { useEffect, useRef, useState } from "react";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// const ScrollReveal = ({ cards }) => {
//   const sectionRef = useRef(null);
//   const cardRefs = useRef([]);
//   const [isDesktop, setIsDesktop] = useState(false);

//   // --- Responsive Check ---
//   useEffect(() => {
//     const handleResize = () =>
//       setIsDesktop(window.innerWidth >= 1024);
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // --- GSAP/ScrollTrigger Setup ---
//   useEffect(() => {
//     if (cardRefs.current.length === 0 || !sectionRef.current) return;

//     const ctx = gsap.context(() => {
//       const cardElements = cardRefs.current.filter(Boolean);
//       const numCards = cardElements.length;
//       if (numCards === 0) return;

//       const [firstCard, ...restCards] = cardElements;

//       // Initial state for ALL cards: Hidden and slightly below
//       gsap.set(cardElements, { y: 100, opacity: 0, scale: 0.95 });

//       // --- Animation 1: First Card (Auto-reveal on enter) ---
//       gsap.to(firstCard, {
//         y: -50, // Parallax pull
//         opacity: 1,
//         scale: 1,
//         duration: 0.8,
//         ease: "power2.out",
//         scrollTrigger: {
//           trigger: sectionRef.current,
//           start: "top 75%", // Triggers when top of section hits 75% of viewport
//           toggleActions: "play none none reverse",
//         },
//       });

//       // --- Animation 2: Remaining Cards (Scrubbed with Pin) ---
//       if (restCards.length > 0) {
//         const tl = gsap.timeline({
//           scrollTrigger: {
//             trigger: sectionRef.current,
//             start: "top 15%",
//             end: () => `+=${restCards.length * 400}px`,
//             pin: true,
//             pinSpacing: true,
//             scrub: 0.5,
//           },
//         });

//         // Add a small initial pause so the user settles into the pin before 2nd card starts
//         tl.to({}, { duration: 0.2 });

//         restCards.forEach((card, i) => {
//           // Reveal Tween
//           tl.to(card, {
//             y: -50,
//             opacity: 1,
//             scale: 1,
//             duration: 0.5,
//             ease: "power2.out",
//           }, "<25%"); // Overlap slightly with previous action

//           // Pause Tween (keep visible for a bit)
//           tl.to({}, { duration: 0.8 });
//         });
//       }
//     }, sectionRef);

//     return () => {
//       ctx.revert();
//     };
//   }, [cards.length]);

//   // --- Render ---
//   return (
//      <section
//       ref={sectionRef}
//       className="overflow-hidden px-4"
//     >
//       <h3 className="text-[1.75rem] text-[#003066] font-medium tracking-tight text-center md:text-left mt-8 mb-24">Transformative Outcomes</h3>
//       {/* Wrapper with enough space */}
//       <div className="relative w-full  flex justify-center overflow-visible">
//         <div className="relative w-full h-[600px] overflow-visible">
//           {cards.map((item, i) => (
//             <div
//               key={i}
//               ref={(el) => (cardRefs.current[i] = el)} 
//               className={`absolute  flex flex-col justify-between w-full md:w-[23.5%] h-[348px] md:h-[308px] rounded-xl shadow-xl p-6 transition-all duration-700 ${item.color} ${item.text}`}
//               style={
//                 isDesktop
//                 ? {
//                     left: `${i * 25}%`,
//                     top: `${i * 55}px`,
//                     zIndex: 10 - i,
//                   }
//                 :  {
//                     top: `${i * 60}px`, // Stack offset for mobile
//                     left: 0,
//                     width: "100%",
//                     position: "absolute",
//                     zIndex: i, // Ensure later cards stack ON TOP of earlier ones
//                   }
//               }
//             >
//               <div>
//                 <h4 className="text-sm uppercase font-medium mb-3">
//                   {item.title}
//                 </h4>
//                 <p className="text-[5.5rem] font-medium mb-3">{item.percent}</p>
//               </div>
//               <p className="text-base font-normal">{item.desc}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ScrollReveal;