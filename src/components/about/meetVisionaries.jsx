import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { meetVisionariesData   } from "../../static/aboutData";
const MeetVisionariesSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}      
      whileInView={{ opacity: 1, y: 0 }}    
      transition={{ duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }} 
      className="meet-visionaries-section bg-[#001528] text-white mb-8 md:mb-0 py-12 lg:py-25 px-4 xl:px-12 2xl:px-22">
      {/* Visionaries Section */}
      <div className="flex flex-col md:flex-row gap-8 xl:gap-16 mb-10 xl:mb-18">
         <h4 className="text-[2rem] text-[#DBF262] font-medium mb-4 block md:hidden">
            {meetVisionariesData.visionaries.title}
          </h4>
        <div className="w-full md:w-1/3">
          <img
            src={meetVisionariesData.visionaries.image.src}
            alt={meetVisionariesData.visionaries.image.alt}
            className="w-full h-full rounded-[36px] object-cover"
          />
        </div>
        <div className="md:w-2/3">
          <h4 className="text-2xl text-[#DBF262] font-medium mb-10 hidden md:block">
            {meetVisionariesData.visionaries.title}
          </h4>
          <div className="bg-[rgba(16,44,87,0.65)] backdrop-blur-[8px] border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-2px_10px_rgba(0,0,0,0.25)] p-4 md:p-7.5 rounded-lg">
            <div className="mb-9.5 md:mb-14">
              <img
                src={meetVisionariesData.visionaries.quoteIcon.src}
                alt={meetVisionariesData.visionaries.quoteIcon.alt}
                className="object-cover"
              />
            </div>
            {meetVisionariesData.visionaries.quoteText.map((paragraph, index) => (
              <p 
                key={index} 
                className="text-lg xl:text-[1.375rem] font-normal leading-loose text-[#E6E6E6]"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
      {/* Team Section */}
      <div className="flex flex-col md:flex-row items-end gap-8 lg:gap-16">
        <div className="md:w-2/3">
          {/* <h4 className="text-[2rem] md:text-[1.5rem] text-[#DBF262] font-medium mb-10">
            {meetVisionariesData.team.title}
          </h4> */}
           <img
          src={meetVisionariesData.team.image.src}
          alt={meetVisionariesData.team.image.alt}
          className="w-full md:w-1/3 rounded-[36px] object-cover block md:hidden mb-8"
        />
            <div className="bg-[rgba(16,44,87,0.65)] backdrop-blur-[8px] border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-2px_10px_rgba(0,0,0,0.25)] p-4 md:p-7.5 rounded-lg">
              <p className="text-gray-200 text-lg xl:text-[1.375rem] font-normal leading-loose text-[#E6E6E6]">
                {meetVisionariesData.team.description}
              </p>
              <p className="text-[#FFBF3C] font-semibold mt-10 text-[1.75rem]">
                {meetVisionariesData.team.signature}
              </p>
            </div>
        </div>
        <img
          src={meetVisionariesData.team.image.src}
          alt={meetVisionariesData.team.image.alt}
          className="w-full md:w-1/3 rounded-[36px] object-cover hidden md:block"
        />
      </div>
    </motion.section>
  );
};
export default MeetVisionariesSection;