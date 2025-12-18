import React, { useState, useEffect, lazy } from "react";
import { motion } from "framer-motion";
import useSEO from "../utils/useSEO";
import GradientScrollText from "../components/animation/gradientScrollText";
import GreatCards from "../components/about/greatCards";
import AboutUsVisionMission from "../components/about/visionMissionCards";
import CoreValues from '../components/about/coreValues';
import MainBanner from '../components/about/mainBanner';
import BuildingCultureSection from '../components/about/buildingCulture';
import MeetVisionariesSection from '../components/about/meetVisionaries';
function AboutUs() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024); // lg breakpoint
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useSEO({
    title: "About Us | Ubona",
    description: "Learn about Ubona's mission and vision."
  });
  return (
    <div className="about-us-page-wrapper">
      <MainBanner />
      <section className="about-us-gradient-content-section min-h-[10vh] max-w-6xl mx-auto flex flex-col justify-center px-4 md:px-18 pb-18 md:pb-36 bg-transparent relative -mt-15 md:mt-[-25vh]">
        <GradientScrollText
          text="Ubona is an AI SaaS company building the future of customer communication. We provide a cloud platform that transforms customer interactions into intelligent, end-to-end experiences driving satisfaction and efficiency for large enterprises."
          className="text-[1.625rem] md:text-[2rem] leading-[46px] md:leading-[55px] font-semibold relative  justify-center"
        />
       <AboutUsVisionMission />
      </section>
      <CoreValues />
      <div className="">
        <GreatCards />
      </div>
      <BuildingCultureSection />
      <MeetVisionariesSection />
    </div>
  );
}
export default AboutUs;
