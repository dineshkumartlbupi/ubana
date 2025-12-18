import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import LazyImage from "../components/lazyImage";
import Breadcrumb from "../components/breadCrumb";
import RevealParagraph from "../components/animation/revealParagraph";
import ButtonArrow from "../components/buttonArrow";
import ScrollRevealRight from "../components/animation/ScrollRevealRight";
import LogoSliderTabs from "../components/logoSliderTabs";
import { solutionSubData } from "../static/solutionDataSub";
import GradientText from "../components/animation/GradientText";
import HCaseStudies from "../components/home/caseStudies";
import RegisterModal from "../components/Registermodel";
import "../App.css";

function OurSolutionSub() {
  const [openModal, setOpenModal] = useState(false);
  const { slug } = useParams(); // e.g. /conference/smartCities
  const pageData = solutionSubData[slug];

  const ScrollCards = pageData?.ScrollCards || [];

  return (
    <div className="">
      <div className="banr-wrap pt-30 pb-20 bg-[#00081F] relative overflow-hidden">
        <div className="flex justify-center">
          <Breadcrumb />
        </div>
        <div className="text-center mb-20 md:mb-12 2xl:mb-22">
          <h1 className="text-3xl md:text-4xl lg:text-[3.5rem] text-white font-extralight mb-2">{pageData.bnrtitle}</h1>
          <h2 className="text-3xl md:text-4xl lg:text-[3.5rem] leading-tight sm:leading-[78px] font-bold tracking-[0px] sm:tracking-[-0.65px] text-white mb-6 md:mb-8 2xl:mb-11 md:px-22">
            <span className="bg-clip-text! text-transparent"
              style={{
                background: "linear-gradient(rgba(234, 234, 234) 66%, rgba(0, 0, 0, .5) 100%)"
              }}
            >
              {pageData.bnrsubtitle1}
            </span>{" "}
            <GradientText
              colors={["#FFEA60", "#A790F9", "#FFEA60", "#A790F9", "#FFEA60"]}
              animationSpeed={3}
              showBorder={false}
              className="text-3xl md:text-4xl lg:text-[4rem] leading-tight sm:leading-[78px] font-bold"
            >
              {pageData.bnrsubtitle2}
            </GradientText>
          </h2>
          <div className="">
            <img className="w-full object-cover md:h-auto h-24" src="/assets/images/solution/solution-sub-bnr.webp" alt="halo rays banner" />
          </div>
        </div>
        <div className="px-4 xl:px-12 2xl:px-22">
          <div className="rounded-4xl md:pl-21 pl-0 flex flex-wrap items-end backdrop-blur-xl mb-18 overflow-hidden"
            style={{ background: "linear-gradient(180deg, rgba(0, 22, 44, 0.60) 28.51%, rgba(66, 8, 193, 0.60) 100%)" }}
          >
            <div className="md:w-[65%] w-full py-7 md:py-21 md:pr-18 px-4 md:pl-0">
              <RevealParagraph
                text={pageData.bnrDesc}
                mainColor="#fff"
                delayPerWord={0.09}
                className="text-2xl md:text-[2rem] leading-[46px] md:leading-[56px] font-semibold"
              />
              <div className={`w-full md:w-106.5 md:rounded-[20px] rounded-xl md:mt-13 mt-10 md:p-6 p-4 ${pageData.bnrcardbg}`}
                style={{ boxShadow: "0 125px 35px 0 rgba(97, 97, 97, 0.00), 0 80px 32px 0 rgba(97, 97, 97, 0.01), 0 45px 27px 0 rgba(97, 97, 97, 0.05), 0 20px 20px 0 rgba(97, 97, 97, 0.09), 0 5px 11px 0 rgba(97, 97, 97, 0.10)" }}
              >
                <p className="text-xs md:text-sm text-[#204100] text-medium uppercase md:mb-3 mb-2">{pageData.bnrcardTtl}</p>
                {/* <h3 className="text-[2rem] md:text-[3.25rem] text-[#1C3900] font-bold md:mb-4.5 mb-3">₹20 Cr</h3> */}
                <p className="text-sm md:text-base text-[#383838] font-normal md:mb-11.5 mb-8">{pageData.bnrcardPara}</p>
                <div className="flex flex-wrap md:flex-nowrap gap-4">
                  <ButtonArrow
                    to={pageData.bnrcaselink}
                    text="Read Case Study"
                    bgColor="#FFBF3C"
                    hoverColor="#1269CD"
                    textColor="#000"
                    hoverTextColor="#fff"
                    padding="pl-4 py-1 pr-1 w-full md:w-auto"
                    rounded="rounded-full"
                    textSize="text-base"
                  />
                  <ButtonArrow
                    onClick={() => { setOpenModal(true); }}
                    text="Book a Free Demo"
                    bgColor="#FFF"
                    hoverColor="#1269CD"
                    textColor="#000"
                    hoverTextColor="#fff"
                    padding="pl-4 py-1 pr-1 w-full md:w-auto"
                    rounded="rounded-full"
                    textSize="text-base"
                  />
                </div>
              </div>
            </div>
            <div className="md:w-[35%] w-full flex">
              <img src={pageData.bnrcardsrc} alt={pageData.bnrcardalt} className="w-full" />
            </div>
          </div>
          <div className="">
            <h3 className="text-[1.75rem] font-medium text-white tracking-[-0.56px] mb-6 md:mb-12">Transformative Outcomes</h3>
            <div className="flex flex-wrap">
              <div className="md:w-1/4 w-full py-4 md:py-3 flex items-center md:pr-6 border-b md:border-b-0 md:border-r border-dashed border-[#3560E2]/70">
                <div className="w-[32%]">
                  <p className="text-[#DBF262] text-[3.125rem] font-light">89%</p>
                </div>
                <div className="w-[68%] pl-4">
                  <p className="text-[#DBDBDB] text-base font-normal">Interaction Automation in All Languages</p>
                </div>
              </div>
              <div className="md:w-1/4 w-full py-4 md:py-3 flex items-center md:px-6 border-b md:border-b-0 md:border-r border-dashed border-[#3560E2]/70">
                <div className="w-[32%]">
                  <p className="text-[#DBF262] text-[3.125rem] font-light">70%</p>
                </div>
                <div className="w-[68%] pl-4">
                  <p className="text-[#DBDBDB] text-base font-normal">Enhanced Agent Efficiency with AI Assist</p>
                </div>
              </div>
              <div className="md:w-1/4 w-full py-4 md:py-3 flex items-center md:px-6 border-b md:border-b-0 md:border-r border-dashed border-[#3560E2]/70">
                <div className="w-[32%]">
                  <p className="text-[#DBF262] text-[3.125rem] font-light">35%</p>
                </div>
                <div className="w-[68%] pl-4">
                  <p className="text-[#DBDBDB] text-base font-normal">Improved Business KPIs with AI Analytics</p>
                </div>
              </div>
              <div className="md:w-1/4 w-full py-4 md:py-3 flex items-center md:pl-6">
                <div className="w-[32%]">
                  <p className="text-[#DBF262] text-[3.125rem] font-light">36%</p>
                </div>
                <div className="w-[68%] pl-4">
                  <p className="text-[#DBDBDB] text-base font-normal">Overall Cost Reduction in Business Spend</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pl-4 xl:pl-12 2xl:pl-22 overflow-hidden">
        <ScrollRevealRight cards={ScrollCards} />
      </div>
      <LogoSliderTabs />
      {/* Case Studies Section */}
      <HCaseStudies />
      {/* Modal */}
      <RegisterModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
}
export default OurSolutionSub;