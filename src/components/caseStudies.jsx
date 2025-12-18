import React, { useState } from "react";
import { motion } from "framer-motion";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import ButtonArrow from "../components/buttonArrow";

const CaseStudies = ({ slides }) => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const nextSlide = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto h-[100vh] md:h-[480px] flex items-center justify-center perspective-[1200px] pt-15 mt-10 md:mt-12 mb-16">
      {slides.map((slide, i) => {
        // const isActive = i === index;
        // const isPrev =
        //   i === (index - 1 + slides.length) % slides.length;
        const isActive = i === index;
        const isNext = i === (index + 1) % slides.length;
        const isPrev = i === (index - 1 + slides.length) % slides.length;

        return (
          <motion.div
            key={slide.id}
            initial={false}
            animate={{
              scale: isActive ? 1 : isPrev ? 0.93 : 0.9,
              opacity: isActive ? 1 : isPrev ? 0.5 : 0,
              zIndex: isActive ? 2 : isPrev ? 1 : 0,
              y: isActive ? 0 : isPrev ? -60 : -60,
              filter: isActive ? "blur(0px)" : isPrev ? "blur(1px)" : "blur(2px)",
            }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            onClick={() => {
              if (isNext) nextSlide();
              if (isPrev) prevSlide();
            }}
            className={`absolute top-15 w-full h-full rounded-3xl overflow-hidden flex flex-wrap bg-white ${
              isPrev ? "cursor-pointer" : ""
            }`}
          >
            {/* Left Image */}
            <div className="w-full md:w-1/2 relative">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover rounded-2xl md:rounded-none"
              />
            </div>

            {/* Right Content */}
            <div className={`w-full md:w-1/2 ${slide.rightbg} flex flex-col md:justify-center py-5.5 px-3 md:p-20 rounded-2xl md:rounded-none`}>
              {slide.showCount && (
                <p className="text-sm font-semibold text-[#001B57] mb-8 md:mb-8">
                  {i + 1}/{slides.length}
                </p>
              )}
              {slide?.testiquote && (
                <img className="w-12.5" src={slide.testiquote} alt="quote icon" />
              )}
              {slide?.title && (
                <h2 className="text-2xl md:text-3xl font-medium mb-8 md:mb-8 text-[#001645]">
                  {slide.title}
                </h2>
              )}
              {slide?.desc && (
                <p className="text-base md:text-sm text-[#00143F]/80 md:mb-8 mb-8">{slide.desc}</p>
              )}
              {slide?.testidesc && (
                <p className="text-base md:text-xl text-[#002007] font-medium mt-6">{slide.testidesc}</p>
              )}
              {slide?.testilogo && slide?.testilogoname && (
                <img className="w-max h-8 my-6" src={slide.testilogo} alt={slide.testilogoname} />
              )}
              {/* {isActive && ( */}
                <div className="flex">
                  <ButtonArrow
                    to={`/case-studies/${slide.slug}`}
                    text="Read Case Study"
                    bgColor="#fff"
                    hoverColor="#1269CD"
                    textColor="#050505"
                    hoverTextColor="#fff"
                    padding="pl-4 py-1 pr-1 w-full md:w-auto"
                    rounded="rounded-full"
                    textSize="text-base"
                  />
                </div>
              {/* )} */}
            </div>
          </motion.div>
        );
      })}

      {/* Controls */}
      <div className="absolute -bottom-9 right-5 flex gap-2 z-30">
        <button
          onClick={prevSlide}
          className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#3E5DA2] hover:bg-black outline-0 cursor-pointer transition-all ease-in-out duration-500"
        >
          <IoChevronBack className="text-white" size={20} />
        </button>
        <button
          onClick={nextSlide}
          className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#3E5DA2] hover:bg-black outline-0 cursor-pointer transition-all ease-in-out duration-500"
        >
          <IoChevronForward className="text-white" size={20} />
        </button>
      </div>
    </div>
  );
}
export default CaseStudies;