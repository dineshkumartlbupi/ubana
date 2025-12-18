'use client';
import React, { useRef } from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";

import Image1 from "../../../public/assets/images/carrers/hands.svg";
import Image2 from "../../../public/assets/images/carrers/groups.svg";
import Image3 from "../../../public/assets/images/carrers/tick.svg";
import Image4 from "../../../public/assets/images/carrers/insurance.svg";
import Image5 from "../../../public/assets/images/carrers/globe.svg";
import Image6 from "../../../public/assets/images/carrers/timer.svg";

const benefits = [
  {
    title: "Cutting Edge Work",
    icon: Image2,
  },
  {
    title: "Open Culture",
    icon: Image1,
  },
  {
    title: "Flexibility in Work",
    icon: Image6,
  },
  {
    title: "Great Exposure",
    icon: Image5,
  },
  {
    title: "Health Insurance",
    icon: Image3,
  },
  {
    title: "Welfare",
    icon: Image4,
  },
];

const WhyUbona = () => {
  const sliderRef = useRef(null);

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: false,
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}      
      whileInView={{ opacity: 1, y: 0 }}    
      transition={{ duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }} 
      className="w-full bg-white py-18 md:py-22">
      <div className="max-w-8xl mx-auto px-6 md:px-12 md:text-center">
        <h2 className="text-[1.625rem] md:text-[2.625rem] font-medium tracking-tight text-[#001528] mb-3">
          Why Ubona — A Workplace Designed <br className="hidden sm:block" /> for Thinkers, Builders, and Dreamers
        </h2>

        <div className="hidden sm:grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 mt-10 md:mt-16">
          {benefits.map((item, index) => (
            <div
              key={index}
              className="bg-[#979EF333] rounded-lg shadow-sm py-4.5 px-6 flex flex-col items-center justify-center hover:shadow-md transition-all duration-300"
            >
              <div className="w-10 h-10 flex items-center justify-center mb-4.5">
                <img src={item.icon} alt={item.title} className="w-10 h-10" />
              </div>
              <h3 className="text-base 2xl:text-lg font-medium text-[#261B53]">
                {item.title}
              </h3>
            </div>
          ))}
        </div>

        <div className="sm:hidden mt-16">
          <Slider ref={sliderRef} {...settings}>
            {benefits.map((item, index) => (
              <div key={index} className="px-3">
                <div className="bg-[#979EF333] rounded-xl shadow-sm py-10 px-6 flex flex-col items-center justify-center transition-all duration-300">
                  <div className="w-10 h-10 flex items-center justify-center mb-4">
                    <img src={item.icon} alt={item.title} className="w-10 h-10" />
                  </div>
                  <h3 className="text-base 2xl:text-lg font-medium text-[#261B53]">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </motion.section>
  );
};

export default WhyUbona;
