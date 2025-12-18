import React from "react";
import GradientText from "../animation/GradientText";
import { mainBannerData } from "../../static/aboutData";
import ButtonArrow from "../../components/buttonArrow";
import ButtonNormal from "../../components/buttonNormal";
// Extracted card component for reusability
 const MainBanner = () => {
  return (
    <section className="about-us-banner-wrap bg-[#001528] relative md:h-[51.5rem] pt-20.5 md:pt-0 overflow-hidden">
      <img
        src={mainBannerData.netImage.mobile}
        alt={mainBannerData.netImage.alt}
        className="block md:hidden h-[180px] absolute top-20.5 object-cover left-0 transform translate-x-0 w-full z-20"
      />
      <img
        src={mainBannerData.netImage.desktop}
        alt={mainBannerData.netImage.alt}
        className="hidden md:block h-[260px] object-contain md:absolute left-1/2 transform -translate-x-1/2 w-[70%] top-[4%] opacity-50"
      />
      <img
        src={mainBannerData.backgroundImage.mobile}  
        alt={mainBannerData.backgroundImage.alt}
        fetchPriority="high"
        decoding="async"
        className="block md:hidden absolute w-full h-[500px] md:h-[100%] object-cover object-bottom z-10"
      />
      <img
        src={mainBannerData.backgroundImage.desktop}  
        alt={mainBannerData.backgroundImage.alt}
        fetchPriority="high"
        decoding="async"
        className="hidden md:block w-full h-[460px] md:h-[100%] object-cover object-bottom"
      />
      <div className="relative z-30 md:-mt-25 md:absolute md:left-1/2 md:top-1/2 md:-translate-1/2 w-full md:w-[70%] pt-20 md:pt-0 md:pb-0 pb-15">
        <div className="text-center">
          <div className="flex justify-center items-center mb-8 gap-6">
            <div className="h-[2px] w-20 md:w-28 bg-linear-to-r from-[#434343]/0 to-[#FAD892]"></div>
            <p className="text-sm text-[#FAD892] font-normal tracking-wider">
              {mainBannerData.subtitle}
            </p>
            <div className="h-[2px] w-20 md:w-28 bg-linear-to-r from-[#FAD892] to-[#434343]/0"></div>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-6xl text-white font-extralight mb-4">
            {mainBannerData.title}
          </h1>
          <h2 className="text-3xl md:text-4xl lg:text-[4rem] leading-tight sm:leading-[78px] font-bold tracking-[0px] sm:tracking-[-0.65px] text-white mb-14">
            <GradientText
              colors={["#FFEA60", "#A790F9", "#FFEA60", "#A790F9", "#FFEA60"]}
              animationSpeed={5}
              showBorder={false}
              className="text-3xl md:text-4xl lg:text-[4rem] leading-tight sm:leading-[78px] font-bold"
            >
              {mainBannerData.gradientText.text}
            </GradientText>
          </h2>
             <div className="flex flex-wrap justify-center gap-6 px-4">
              <ButtonArrow
                to="/careers"
                text="Join Our Team"
                bgColor="#FFBF3C"
                hoverColor="#1269CD"
                textColor="#000"
                hoverTextColor="#fff"
                padding="pl-4 py-1 pr-1 w-full sm:w-auto"
                rounded="rounded-full"
                textSize="text-base"
              />
              <ButtonArrow
                to="/blogs"
                text="Read Our Insights"
                bgColor="rgba(8, 36, 87, 0.50)"
                hoverColor="#1269CD"
                textColor="#FBFBFB"
                hoverTextColor="#fff"
                padding="pl-4 py-1 pr-1 w-full sm:w-auto"
                rounded="rounded-full"
                textSize="text-base"
              />
            </div>
        </div>
      </div>
    </section>
  );
};
export default MainBanner;