import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { coreValuesData } from "../../static/aboutData";
// Extracted card component for reusability
const ValueCard = ({ value }) => (
  <div className="bg-white rounded-2xl p-6 shadow-xs md:h-1/2">
    <div className="flex flex-col justify-between h-full gap-3">
      <div className="text-purple-600 text-3xl">
        <img
          src={value.icon}
          alt={value.alt}
          decoding="async"
          className="icon-image"
        />
      </div>
      <div>
        <h3 className="text-xl 2xl:text-2xl font-semibold text-gray-900 mt-8 2xl:mb-3">
          {value.title}
        </h3>
        <p className="text-gray-600 text-sm 2xl:text-lg leading-relaxed">
          {value.description}
        </p>
      </div>
    </div>
  </div>
);
function CoreValues() {
  const { heading, mainImage, values } = coreValuesData;
  // Pre-filter values for better performance
  const leftColumnValues = values.filter(item => item.column === 'left');
  const rightColumnValues = values.filter(item => item.column === 'right');
  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}      
      whileInView={{ opacity: 1, y: 0 }}    
      transition={{ duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }} 
     className="core-values-section bg-[rgba(151,158,243,0.1)] py-12 md:py-20 px-4 xl:px-12 2xl:px-22">
      {/* Heading Section */}
      <div className="core-values-heading">
        <div className="flex justify-center items-center mb-8.5 gap-6">
          <div className="h-[2px] w-28 bg-gradient-to-r from-white to-[#1269CD]"></div>
          <p className="text-sm whitespace-nowrap text-[#1269CD] font-normal tracking-wider">
            {heading.subtitle}
          </p>
          <div className="h-[2px] w-28 bg-gradient-to-r from-[#1269CD] to-white"></div>
        </div>
        <h2 className="text-[#001528] text-[24px] md:text-[42px] font-medium text-center mb-10 md:mb-20">
          The Principles That Power Our People{" "}
          <span className="inline md:block">{heading.titleBreak}</span>
        </h2>
      </div>
      {/* Content Grid - Clean and readable */}
      <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          {leftColumnValues.map((value) => (
            <ValueCard key={value.id} value={value} />
          ))}
        </div>
        {/* Center Image */}
        <div className=" order-none">
          <img
            src={mainImage.src}
            srcSet={mainImage.srcSet}
            sizes="100vw"
            alt={mainImage.alt}
            fetchPriority="high"
            decoding="async"
            className="w-full rounded-2xl object-cover shadow-lg"
          />
        </div>
        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {rightColumnValues.map((value) => (
            <ValueCard key={value.id} value={value} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
export default CoreValues;