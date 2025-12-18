import React from "react";
import ButtonArrow from "../buttonArrow";
import GradientScrollText from "../animation/gradientScrollText";

const AboutSection = () => {
  return (
    <div className="min-h-[120vh] max-w-6xl mx-auto flex flex-col justify-center px-4 md:px-18 pb-36 bg-white">
      <GradientScrollText
        text="Ubona transforms customer communication with AI, turning contact centers from cost centers into automated, profit-driving engines. Powered by our HALO platform, we combine Generative AI and cognitive technologies to deliver human-like conversations across all channels. This creates intelligent, end-to-end experiences that help enterprises engage customers and drive growth."
        className="text-[1.625rem] md:text-[2rem] leading-[46px] md:leading-[65px] font-semibold"
      />
      <div className="mt-16 flex flex-col md:flex-row items-center gap-6">
        <ButtonArrow
          to="/our-solutions"
          text="View All Solutions"
          bgColor="#FFBF3C"
          hoverColor="#1269CD"
          textColor="#000"
          hoverTextColor="#fff"
          padding="pl-4 py-1 pr-1 w-full md:w-auto"
          rounded="rounded-full"
          textSize="text-base"
        />
        <ButtonArrow
          to="/about-us"
          text="Know About Us"
          bgColor="#1269CD"
          hoverColor="#FFBF3C"
          textColor="#fff"
          hoverTextColor="#000"
          padding="pl-4 py-1 pr-1 w-full md:w-auto"
          rounded="rounded-full"
          textSize="text-base"
        />
        <ButtonArrow
          to="/case-studies"
          text="Success Stories"
          bgColor="#BBDBFF66 "
          hoverColor="#1269CD"
          textColor="#1269CD"
          hoverTextColor="#fff"
          padding="pl-4 py-1 pr-1 w-full md:w-auto"
          rounded="rounded-full"
          textSize="text-base"
        />
      </div>
    </div>
  );
};

export default AboutSection;