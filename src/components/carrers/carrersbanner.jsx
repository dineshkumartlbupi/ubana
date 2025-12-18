'use client';
import React from "react";
import CarrersImage from "../../../public/assets/images/carrers/career-bnr.webp";
import { FaArrowRight } from "react-icons/fa";
import ButtonArrow from "../buttonArrow";
function CareersBanner() {
  return (
    <section className={`w-full flex flex-col h-[90vh] md:h-[120vh] items-center text-center bg-white pt-10 md:pt-26 bg-[url('/assets/images/carrers/career-bnr.webp')] bg-cover bg-center`}>
      
      <div className="w-full flex flex-col justify-center items-center px-4">
        <div className="flex items-center justify-center mb-4 gap-4">
          <div className="h-[1.5px] w-12 md:w-24 bg-gradient-to-r from-transparent to-[#1269CD]" />
          <p className="text-[#1269CD] font-medium tracking-wider text-sm md:text-base uppercase">
            At UBONA
          </p>
          <div className="h-[1.5px] w-12 md:w-24 bg-gradient-to-r from-[#1269CD] to-transparent" />
        </div>

        <h1 className="text-[2.625rem] md:text-7xl font-extralight text-[#000B15] leading-tight drop-shadow-lg">
          Create. Collaborate. Innovate.
        </h1>
        <h2 className="text-[2.625rem] md:text-6xl font-semibold text-[#000B15] mt-3 drop-shadow-lg">
          The Ubona Way
        </h2>
        <div className="mt-8 w-full md:w-auto">
          <ButtonArrow
              onClick={() => {
                const section = document.getElementById("careers-section");
                if (section) {
                  const yOffset = -96; // adjust for fixed header
                  const y =
                    section.getBoundingClientRect().top + window.pageYOffset + yOffset;
            
                  window.scrollTo({ top: y, behavior: "smooth" });
                }
              }}
              text="Join our Journey"
              bgColor="#1269CD"
              hoverColor="#FFBF3C"
              textColor="#fff"
              hoverTextColor="#000"
              padding="pl-4 py-1 pr-1 w-full sm:w-auto"
              rounded="rounded-full"
              textSize="text-base"
            />
        </div>
      </div>

      {/* <div className="w-full h-auto">
        <img
          src={CarrersImage}
          alt="Careers at Ubona"
          className="w-full h-auto object-cover"
        />
      </div> */}
    </section>
  );
}

export default CareersBanner;
