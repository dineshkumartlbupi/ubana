import React from "react";
import LazyImage from "./lazyImage"; 
import { motion } from "framer-motion";

const LogosFeatured = ({ logos }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}      
      whileInView={{ opacity: 1, y: 0 }}    
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}>
      <div className="logo-sec mx-auto gap-8 px-4 2xl:px-22 xl:px-12 py-10 sm:py-20">
        {/* Heading */}
        <p className="text-xl font-normal text-[#2D2D2D] tracking-[.2px]">
          Our Featured Sponsors
        </p>

        {/* Gradient line */}
        <div
          className="h-[2px] my-5"
          style={{
            background:
              "linear-gradient(260deg, rgba(83, 100, 28, 0) 0%, rgba(191, 240, 39, 1) 50%, rgba(197, 231, 90, 0) 100%)",
          }}
        ></div>

        {/* Logo wrapper */}
        <div className="participant-logo-box-wrap flex items-center flex-nowrap overflow-x-auto sm:flex-wrap md:flex-nowrap justify-around pb-3">
          {logos.map((logo, index) => (
            <div
              key={index}
              className="participant-logo-box text-[0px] flex-none w-1/2 sm:w-auto md:w-1/6 lg:w-auto md:pr-5 lg:pr-0"
            >
              <LazyImage effect="blur" src={logo.src} alt={logo.alt} className="h-10" />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default LogosFeatured;