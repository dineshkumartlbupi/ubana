import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiMinus } from "react-icons/fi";
import LazyImage from "../lazyImage";
import ButtonArrow from "../buttonArrow";
import ButtonNormal from "../buttonNormal";
import Breadcrumb from "../breadCrumb";
function Banner() {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  const items = [
    {
      tag: "AI Chat Agent",
      category: "Genie",
      title: "What services do you offer?",
      content: "Halo Genie streamlines customer and internal interactions with intelligent automation. It understands intent, responds instantly across voice and chat, and personalizes every exchange — empowering teams to deliver faster, smarter, and more human-like conversations.",
      buttontext1: "Explore more about Genie",
      buttontext2: "Schedule a Demo",
      image: "/assets/images/solution/solution-genie-phone.webp",
      alt: "halo phone sscreen",
     },
    {
      tag: "Unified Customer Platform",
      category: "Connect",
      title: "AI-powered Agent Assist Contact Center Solution",
      content: "Project timelines vary, but most websites take between 4–8 weeks from design to deployment.",
      buttontext1: "Explore more about Genie",
      buttontext2: "Schedule a Demo",
      image: "/assets/images/solution/solution-genie-phone.webp",
      alt: "halo phone sscreen",
    },
    {
      tag: "Conversation Intelligence",
      category: "Speech",
      title: "AI-powered Agent Assist Contact Center Solution",
      content: "Yes! We provide maintenance plans and on-demand support for all projects we deliver.",
      buttontext1: "Explore more about Genie",
      buttontext2: "Schedule a Demo",
      image: "/assets/images/solution/solution-genie-phone.webp",
      alt: "halo phone sscreen",
    },
  ];
  return (
    <div className="banr-wrap pt-50 pb-20 px-4 xl:px-12 2xl:px-22 bg-[#00081F] bg-[url('/assets/images/solution/solution-bnr-bg.webp')] bg-no-repeat bg-center-top relative overflow-hidden">
      <div className="flex justify-center">
        <Breadcrumb />
      </div>
      <div className="">
        <div className="text-center mb-50">
          <h1 className="text-3xl md:text-4xl lg:text-[4rem] text-white font-extralight mb-2">The HALO Platform</h1>
          <h2 className="text-3xl md:text-4xl lg:text-[4rem] leading-tight sm:leading-[78px] font-bold tracking-[0px] sm:tracking-[-0.65px] text-white mb-14">
            <span className="bg-clip-text! text-transparent"
              style={{
                background: "linear-gradient(rgba(234, 234, 234) 66%, rgba(0, 0, 0, .5) 100%)"
              }} 
            >
              One AI, 
            </span>{" "} Three Powerful Brains
            {/* <GradientText
              colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
              animationSpeed={3}
              showBorder={false}
              className="custom-class"
            >
              Customer Engagement
            </GradientText> */}
          </h2>
        </div>
        <div className="rounded-4xl p-25 flex backdrop-blur-xl mb-18" 
          style={{ background: "linear-gradient(180deg, rgba(0, 22, 44, 0.60) 28.51%, rgba(6, 98, 218, 0.60) 100%)"}}
        >
          <div className="flex flex-col w-full gap-y-17.5">
            {items.map((item, index) => {
              const isActive = activeIndex === index;
              return (
              <div key={index} className="flex flex-wrap">
                <div className="w-[30%]">
                  <div className="flex justify-start items-center mb-2.5 gap-4">
                    <p className="text-sm text-[#E1DD68] font-normal tracking-wider">{item.tag}</p>
                    <div className="h-[2px] w-28 bg-linear-to-r from-[#E1DD68] to-[#434343]/0"></div>
                  </div>
                  <div>
                    <img alt="" src="/assets/images/solution/halo-text.svg"/>
                  </div>
                  <p className="text-[3.375rem] text-white tracking-[-0.54px] font-medium">{item.category}</p>
                </div>
                <div className="w-[70%] pl-8">
                  <div className={` rounded-xl backdrop-blur-sm transition-all ease-in-out duration-500 ${
                    isActive
                      ? "bg-[#ECF8AC]"
                      : "bg-black/40"
                  }`}>
                    <button
                      className="w-full flex justify-between items-center text-left focus:outline-none cursor-pointer px-11 py-8 transition"
                      onClick={() => toggleAccordion(index)}
                    >
                      <span className={`font-medium text-2xl transition-all ease-in-out duration-500 ${
                        isActive
                          ? "text-[#111111]"
                          : "text-white"
                      }`}>{item.title}</span>
                      <motion.span
                        animate={{ rotate: isActive ? 180 : 0, scale: isActive ? 1.1 : 1 }}
                        transition={{ duration: 0.3 }}
                        className="text-gray-500"
                      >
                        {isActive ? (
                          <motion.div
                            key="minus"
                            initial={{ opacity: 0, rotate: -90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: 90 }}
                            transition={{ duration: 0.25 }}
                          >
                            <FiMinus className="text-[#111111]" size={26} />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="plus"
                            initial={{ opacity: 0, rotate: 90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: -90 }}
                            transition={{ duration: 0.25 }}
                          >
                            <FiPlus className="text-white" size={26} />
                          </motion.div>
                        )}
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {activeIndex === index && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                          className="overflow-hidden px-11 flex"
                        >
                          <div className="w-[60%] pb-4 pr-4">
                            <p className="text-[#2B2B2B] text-base font-normal mb-6.5">{item.content}</p>
                            <div className="flex flex-col items-start justify-start gap-6">
                              <ButtonArrow
                                to="/"
                                text={item.buttontext1}
                                bgColor="#FFBF3C"
                                hoverColor="#1269CD"
                                textColor="#000"
                                hoverTextColor="#fff"
                                padding="pl-4 py-1 pr-1"
                                rounded="rounded-full"
                                textSize="text-base"
                              />
                              <ButtonNormal
                                to="/"
                                text={item.buttontext2}
                                bgColor="#D4E770"
                                hoverColor="#1269CD"
                                textColor="#181818"
                                hoverTextColor="#fff"
                                padding="px-6 py-1"
                                rounded="rounded-full"
                                textSize="text-base"
                              />
                            </div>
                          </div>
                          <div className="w-[40%]">
                            <LazyImage effect="blur"
                              src={item.image}
                              alt={item.alt}
                              wrapperClassName="block!"
                              className=""
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
        <div className="">
          <h3 className="text-[1.75rem] font-medium text-white tracking-[-0.56px] mb-12">Transformative Outcomes</h3>
          <div className="flex flex-wrap">
            <div className="w-1/4 py-3 flex items-center pr-6 border-r border-dashed border-[#3560E2]/70">
              <div className="w-[32%]">
                <p className="text-[#DBF262] text-[3.125rem] font-light">89%</p>
              </div>
              <div className="w-[68%] pl-4">
                <p className="text-[#DBDBDB] text-base font-normal">Interaction Automation in All Languages</p>
              </div>
            </div>
            <div className="w-1/4 py-3 flex items-center px-6 border-r border-dashed border-[#3560E2]/70">
              <div className="w-[32%]">
                <p className="text-[#DBF262] text-[3.125rem] font-light">70%</p>
              </div>
              <div className="w-[68%] pl-4">
                <p className="text-[#DBDBDB] text-base font-normal">Enhanced Agent Efficiency with AI Assist</p>
              </div>
            </div>
            <div className="w-1/4 py-3 flex items-center px-6 border-r border-dashed border-[#3560E2]/70">
              <div className="w-[32%]">
                <p className="text-[#DBF262] text-[3.125rem] font-light">35%</p>
              </div>
              <div className="w-[68%] pl-4">
                <p className="text-[#DBDBDB] text-base font-normal">Improved Business KPIs with AI Analytics</p>
              </div>
            </div>
            <div className="w-1/4 py-3 flex items-center pl-6">
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
  );
}
export default Banner;