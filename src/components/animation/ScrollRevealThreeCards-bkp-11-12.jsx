// import React, { useEffect, useRef, useState } from "react";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// gsap.registerPlugin(ScrollTrigger);

// const ScrollReveal = ({ cards }) => {
//   const [isDesktop, setIsDesktop] = useState(false);
//   const sectionRef = useRef(null);
//   const cardRefs = useRef([]);

//   // Initialize all cards as hidden on mount (except first one maybe? or all hidden)
//   // Let's hide them all initially and let the timeline reveal them.
//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       gsap.set(cardRefs.current, { y: 100, opacity: 0 });
//     }, sectionRef);

//     return () => ctx.revert();
//   }, [cards]);


//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       const section = sectionRef.current;
//       const cardElements = cardRefs.current;

//       // Only run complex animation on desktop
//       if (isDesktop) {
//         const tl = gsap.timeline({
//           scrollTrigger: {
//             trigger: section,
//             start: "top top", // Pin when section top hits viewport top
//             end: "+=300%", // Fixed scroll distance (3x viewport height)
//             pin: true,
//             pinSpacing: true,
//             scrub: 0.5, // Slightly faster scrub
//             invalidateOnRefresh: true, // Handle resize better
//           },
//         });

//         // Animate cards sequentially
//         cards.forEach((_, i) => {
//           if (!cardElements[i]) return;

//           // Reveal card
//           tl.to(
//             cardElements[i],
//             {
//               y: 0,
//               opacity: 1,
//               duration: 1,
//               ease: "power2.out",
//             },
//             i * 1.5 // Stagger start times
//           );
//         });

//         // Add a longer hold at the end so the user sees the final state before unpinning
//         tl.to({}, { duration: 2 });
//       } else {
//         // Mobile: Simple scroll trigger for each card (no pinning)
//         cardElements.forEach((card, i) => {
//           if (!card) return;

//           gsap.fromTo(
//             card,
//             { y: 50, opacity: 0 },
//             {
//               y: 0,
//               opacity: 1,
//               duration: 0.6,
//               scrollTrigger: {
//                 trigger: card,
//                 start: "top 85%",
//                 toggleActions: "play none none reverse",
//               },
//             }
//           );
//         });
//       }

//     }, sectionRef);

//     return () => ctx.revert();
//   }, [cards, isDesktop]);

//   useEffect(() => {
//     const handleResize = () => setIsDesktop(window.innerWidth >= 1024); // lg breakpoint
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <section
//       ref={sectionRef}
//       className={`relative w-full overflow-hidden pt-10 ${isDesktop ? "mb-[-200px] h-screen flex items-center" : ""}`}
//     >
//       {/* Wrapper with enough space */}
//       <div className="relative w-full flex justify-center overflow-visible">
//         <div className={`relative w-full ${isDesktop ? "h-[480px]" : "h-auto flex flex-col gap-6"} overflow-visible`}>
//           {cards.map((item, i) => (
//             <div
//               key={i}
//               ref={(el) => (cardRefs.current[i] = el)}
//               className={`
//                 ${isDesktop ? "absolute" : "relative"} 
//                 flex flex-col justify-between 
//                 w-full md:w-[31.5%] 
//                 h-[348px] md:h-[260px] 
//                 rounded-xl shadow-xl p-6 
//                 ${item.color} ${item.text}
//               `}
//               style={
//                 isDesktop
//                   ? {
//                     left: `${i * 34}%`,
//                     top: `${i * 90}px`, // Staggered vertical layout
//                     zIndex: 10 - i,
//                   }
//                   : {
//                     width: "100%",
//                   }
//               }
//             >
//               <div>
//                 <h4 className="text-[2.5rem] md:text-[3rem] font-medium mb-3">
//                   {item.title}
//                 </h4>
//               </div>
//               <img
//                 src={item.image}
//                 alt={item.title}
//                 className="absolute right-[0] bottom-[0] object-cover"
//               />
//               <p className="text-base font-normal">{item.desc}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ScrollReveal;