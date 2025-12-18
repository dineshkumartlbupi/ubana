import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiMinus } from "react-icons/fi";
import LazyImage from "../lazyImage";
import ButtonArrow from "../buttonArrow";
import Breadcrumb from "../breadCrumb";
import GradientText from "../animation/GradientText";
import RegisterModal from "../Registermodel";
function Banner() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  const toggleAccordion = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
  
      // Scroll the clicked accordion into view smoothly
      setTimeout(() => {
        const element = document.getElementById(`accordion-${index}`);
        if (element) {
          const yOffset = -150; // adjust this to your sticky header height
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 350); // delay matches animation duration
    }
  };
  const items = [
    {
      tag: "AI Chat Agent",
      category: "Genie",
      title: "The AI that holds human-like conversations.",
      content: "Automate complex support, payment, and sales journeys with an AI and guided browsing that understands nuance and context, just like a human agent would.",
      buttontext1: "Explore More",
      url1: "/our-solutions/halo-genie",
      buttontext2: "Schedule a Demo",
      image: "/assets/images/solution/solution-genie-phone.webp",
      alt: "halo phone sscreen",
     },
    {
      tag: "Unified Customer Platform",
      category: "Connect",
      title: "The Contact Center of the AI Age.",
      content: "Get the most state-of-the-art cloud contact center, built from the ground up with AI. It suggests responses, automates tasks, and empowers every agent to perform at their best.",
      buttontext1: "Explore More",
      url1: "/our-solutions/halo-connect",
      buttontext2: "Schedule a Demo",
      image: "/assets/images/solution/solution-connect-girl.webp",
      alt: "halo phone sscreen",
    },
    {
      tag: "Conversation Intelligence",
      category: "Speech",
      title: "The AI that turns conversations into your greatest asset.",
      content: "Analyze 100% of customer calls to track sentiment, feedback, interest, ensure compliance, and uncover hidden reasons for churn and satisfaction.",
      buttontext1: "Explore More",
      url1: "/our-solutions/halo-speech",
      buttontext2: "Schedule a Demo",
      image: "/assets/images/solution/solution-speech-laptop.webp",
      alt: "halo phone sscreen",
    },
  ];
  return (
    <div className="banr-wrap pb-20 bg-[#00081F] relative overflow-hidden">
      <div className="pt-50 px-4 xl:px-12 2xl:px-22 bg-[url('/assets/images/solution/solution-bnr-bg.svg')] bg-no-repeat bg-[center_-100px]">
        <div className="flex justify-center">
          <Breadcrumb />
        </div>
        <div className="">
          <div className="text-center mb-50">
            <h1 className="text-3xl md:text-4xl lg:text-[4rem] text-white font-extralight mb-2">The HALO Platform</h1>
            <h2 className="text-3xl md:text-4xl lg:text-[4rem] leading-tight sm:leading-[78px] font-bold tracking-[0px] sm:tracking-[-0.65px] text-white md:mb-14">
              <span className="bg-clip-text! text-transparent"
                style={{
                  background: "linear-gradient(rgba(234, 234, 234) 66%, rgba(0, 0, 0, .5) 100%)"
                }} 
              >
                AI-Powered Brain for 
              </span>{" "} <br className="md:hidden" />
              <GradientText
                colors={["#FFEA60", "#A790F9", "#FFEA60", "#A790F9", "#FFEA60"]}
                animationSpeed={6}
                showBorder={false}
                className="text-3xl md:text-4xl lg:text-[4rem] leading-tight sm:leading-[78px] font-bold"
              >
                 Customer Experience
              </GradientText>
            </h2>
          </div>
          <div className="rounded-4xl p-4 md:p-25 flex backdrop-blur-xl md:mb-18 mb-23" 
            style={{ background: "linear-gradient(180deg, rgba(0, 22, 44, 0.60) 28.51%, rgba(6, 98, 218, 0.60) 100%)"}}
          >
            <div className="flex flex-col w-full gap-y-10 md:gap-y-17.5 py-2 md:py-0">
              {items.map((item, index) => {
                const isActive = activeIndex === index;
                return (
                <div key={index} id={`accordion-${index}`} className="flex flex-wrap">
                  <div className="w-full md:w-[30%]">
                    <div className="flex justify-start items-center mb-2.5 gap-4">
                      <p className="text-sm text-[#E1DD68] font-normal tracking-wider">{item.tag}</p>
                      <div className="h-[2px] md:w-28 w-16 bg-linear-to-r from-[#E1DD68] to-[#434343]/0"></div>
                    </div>
                    <div className="flex items-center md:block mb-8 md:mb-0">
                      <div>
                        <img className="w-24 md:w-auto" alt="" src="/assets/images/solution/halo-text.svg"/>
                      </div>
                      <p className="text-3xl md:text-[3.375rem] text-white tracking-[-0.54px] font-medium ml-2.5 md:ml-0">{item.category}</p>
                    </div>
                  </div>
                  <div className="w-full md:w-[70%] md:pl-8">
                    <div className={` rounded-xl backdrop-blur-sm transition-all ease-in-out duration-500 ${
                      isActive
                        ? "bg-[#ECF8AC]"
                        : "bg-black/40"
                    }`}>
                      <button
                        className="w-full flex flex-nowrap justify-between items-center text-left focus:outline-none cursor-pointer px-4 md:px-11 py-8 transition"
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
                            className="overflow-hidden pl-4 md:pl-11 flex flex-wrap"
                          >
                            <div className="w-full md:w-[54%] pb-4 pr-4">
                              <p className="text-[#2B2B2B] text-base font-normal mb-6.5">{item.content}</p>
                              <div className="flex flex-col items-start justify-start gap-6 md:pb-8">
                                <ButtonArrow
                                  to={item.url1}
                                  text={item.buttontext1}
                                  bgColor="#FFBF3C"
                                  hoverColor="#1269CD"
                                  textColor="#000"
                                  hoverTextColor="#fff"
                                  padding="pl-4 py-1 pr-1 w-full md:w-auto"
                                  rounded="rounded-full"
                                  textSize="text-base"
                                />
                                <ButtonArrow
                                  onClick={() => {setOpenModal(true);}}
                                  text={item.buttontext2}
                                  bgColor="#D4E770"
                                  hoverColor="#1269CD"
                                  textColor="#181818"
                                  hoverTextColor="#fff"
                                  padding="pl-4 py-1 pr-1 w-full md:w-auto"
                                  rounded="rounded-full"
                                  textSize="text-base"
                                />
                              </div>
                            </div>
                            <div className="w-full md:w-[46%] md:flex md:items-end">
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
        </div>
      </div>
      <div className="px-4 xl:px-12 2xl:px-22">
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
      {/* Modal */}
      <RegisterModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
}
export default Banner;