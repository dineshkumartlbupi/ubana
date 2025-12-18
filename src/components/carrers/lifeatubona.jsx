'use client';
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";

// Import Swiper styles
import "swiper/css";
import "swiper/css/autoplay";

// Images
import Carreres from "../../../public/assets/images/carrers/carrersubona.webp";

const LifeAtUbona = () => {
  const images = [
    { src: "/assets/images/carrers/image6.webp", caption: "Speech Tech Summit - Driving Adaptation" },
    { src: "/assets/images/carrers/image7.webp", caption: "Best CX Company of the Year" },
    { src: "/assets/images/carrers/image9.webp", caption: "Team Collaboration at Work" },
    { src: "/assets/images/carrers/image8.webp", caption: "Innovation & Growth Summit" },
  ];
  const effectiveSlides =
  images.length < 6 ? [...images, ...images] : images;
  return (
    <>
      {/* Section Header */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}      
        whileInView={{ opacity: 1, y: 0 }}    
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }} 
        className="w-full bg-white pt-12 md:pb-12 pb-10">
        <div className="w-full px-4 md:px-12 flex flex-col md:flex-row items-center justify-between gap-10">
          
          <div className="flex-1 text-left">
            <h2 className="text-[2rem] md:text-5xl font-semibold text-[#40B77E] mb-3 md:mb-4">
              Life at Ubona
            </h2>
            <p className="text-[#000B15] text-base md:text-lg leading-relaxed max-w-3xl">
              Life at Ubona is about growth—both for our technology and our people.
              In our collaborative and open environment, your ideas are valued,
              your work has impact, and you're empowered to do your best work.
            </p>
          </div>

          {/* <div className="flex-shrink-0 hidden md:flex justify-end">
            <img src={Carreres} alt="Life at Ubona" className="w-24 h-auto inline-block" />
          </div> */}
        </div>
      </motion.section>

      {/* Swiper Slider */}
      <section className="w-full bg-white md:pt-6 md:pb-6 pb-16">
        <Swiper
          modules={[Autoplay]}
          // slidesPerView={3}
          spaceBetween={16}
          loop={true}
          // loopAdditionalSlides={3} 
          centeredSlides={true}
          observer={true}
          observeParents={true}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          speed={900}
          breakpoints={{
            0: { slidesPerView: 1.25 },   // mobile
            768: { slidesPerView: 3 }, // tablet / desktop
          }}
          className=""
        >
          {effectiveSlides.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="relative overflow-hidden shadow group">
                <img
                  src={item.src}
                  alt={item.caption}
                  className="w-full h-[280px] md:h-[340px] object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="
                    absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-end opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500
                  "
                >
                  <p className="text-white text-sm md:text-base font-medium p-4">
                    {item.caption}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </>
  );
};

export default LifeAtUbona;
