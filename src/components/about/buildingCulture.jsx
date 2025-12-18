import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { buildingCultureData  } from "../../static/aboutData";
const BuildingCultureSection = () => {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}      
      whileInView={{ opacity: 1, y: 0 }}    
      transition={{ duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}  
      className="building-culture-section px-4 xl:px-12 2xl:px-22 py-16 bg-white">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between">
        <h2 className="text-[1.75rem] md:text-[2.75rem] font-medium text-green-600 mb-6 md:mb-0">
          {buildingCultureData.title.line1}
          <br />
          {buildingCultureData.title.line2}
        </h2>
        <p className="max-w-md text-gray-700 text-sm leading-relaxed mt-0 md:mt-6">
          {buildingCultureData.description}
        </p>
      </div>
      {/* Image Grid */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {buildingCultureData.cards.map((card, index) => (
          <div key={index} className="overflow-hidden">
            <img
              src={card.image.src}
              alt={card.image.alt}
              className="w-full rounded-2xl object-cover"
            />
            <p className="text-[#1269CD] text-[1.25rem] text-left font-medium mt-3">
              {card.caption}
            </p>
          </div>
        ))}
      </div>
    </motion.section>
  );
};
export default BuildingCultureSection;