import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ButtonArrow from "../buttonArrow";

const industryData = {
  Banking: [
    "AI Powered Contact Center",
    "Analytics",
    "Agent Assist",
    "Card Control & Pin Setting",
    "Curable Decline-Credit Cards & Loans",
    "Personal loan on Credit Card & FD",
    "Automation",
    "Customer Acquisition",
    "Authorization",
    "Regulatory"
  ],
  Insurance: [
    "AI Powered Contact Center",
    "Automation",
    "Agent Assist",
    "Analytics",
    "Collections",
    "PIVC & Welcome",
    "Upsell & Drop Off Journey",
    "APP Downloads",
    "Deep Lapse Renewal",
    "Claim Registration",
  ],
  "Travel & Leisure": [
    "AI Powered Contact Center",
    "Analytics",
    "Agent Assist",
    "Travel Insurance",
    "Reward Program",
    "Self-service",
    "Enquiry & Status",
    "Feedback",
  ],
  Telecom: [
    "AI Powered Contact Center",
    "Automation",
    "Agent Assist",
    "Analytics",
    "Prepaid to Postpaid",
    "Collections",
  ],
  "E-commerce": [
    "AI Powered Contact Center",
    "Automation",
    "Agent Assist",
    "Customer Servicing",
    "Feedback collections",
    "Self service",
    "Confirmation",
    "Verification",
    "Refund",
    "Cart Abandonment",
  ],
  NBFC: [
    "AI-Powered Contact Center",
    "Automation",
    "Agent Assist",
    "Analytics",
    "Collections",
    "Onboarding",
    "Welcome",
    "Upsell & CrossSell",
  ],
  "Government Services": [
    "AI Powered Contact Center",
    "Automation",
    "Agent Assist",
    "Analytics",
    "Self-Service",
    "Helpline",
    "Grievances",
    "Feedback Collection",
    "Verification",
    "Document Upload",
  ],
};

const IndustriesSection = () => {
  const [activeTab, setActiveTab] = useState("Banking");

  return (
    <section className="bg-[#000F1D] text-white pt-20 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}      
        whileInView={{ opacity: 1, y: 0 }}    
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }} 
      >
        <div className="max-w-5xl px-4 xl:px-12 2xl:px-22 mb-18">
          <div className="flex justify-left items-center mb-5 gap-6">
            <p className="text-sm text-[#E1DD68] font-normal tracking-wider">Core Industries</p>
            <div className="h-[2px] w-28 bg-linear-to-r from-[#E1DD68] to-[#000F1D]"></div>
          </div>
          <h2 className="text-3xl md:text-[2.75rem] font-medium leading-tight">
            Generative AI that handles complex interactions, empowers agents, and delivers actionable insights from every conversation.
          </h2>
        </div>
        <div className="flex flex-wrap relative pb-16 px-4 md:px-0">
          <div className="absolute left-0 bottom-0 w-[60%] h-full bg-[url('/assets/images/home/industry-lines.svg')] bg-no-repeat bg-left-top" style={{ backgroundSize: '85%' }}></div>
          {/* Left Side */}
          <div className="w-full md:w-[60%] relative md:pl-4 xl:pl-12 2xl:pl-22">
            <div className="scrollbar-hide flex md:flex-col overflow-x-auto border md:borde-0 md:border-none border-[#D0D0D0] rounded-4xl md:space-y-4 max-w-97.5 md:pr-13 p-2 ml-auto">
              {Object.keys(industryData).map((industry) => (
                <motion.button
                  key={industry}
                  onClick={() => setActiveTab(industry)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full text-sm md:text-xl text-center md:text-left whitespace-nowrap flex justify-between items-center px-6 md:px-8 py-2 md:py-3 rounded-4xl md:rounded-md cursor-pointer border transition-all duration-500 outline-0 ${
                    activeTab === industry
                      ? "md:bg-[#354DED] bg-[#B6D1F0] border-transparent md:border-blue-500 text-[#1269CD] md:text-[#F9F5F5]"
                      : "border-transparent hover:bg-blue-950 text-[#C8C8C8]"
                  }`}
                >
                  {industry}
                  <svg className="hidden md:block" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7.11192 4.14278C6.93875 4.13897 6.7687 4.18917 6.6254 4.28648C6.48211 4.38378 6.37269 4.52339 6.31236 4.68575C6.25204 4.84812 6.2438 5.02522 6.28879 5.19249C6.33378 5.35975 6.42978 5.50878 6.56342 5.61897L11.6627 9.98745L6.56342 14.3544C6.47097 14.4223 6.39355 14.5086 6.336 14.6079C6.27845 14.7071 6.24201 14.8172 6.22897 14.9312C6.21593 15.0452 6.22657 15.1606 6.26021 15.2703C6.29386 15.38 6.34979 15.4816 6.4245 15.5687C6.49921 15.6557 6.5911 15.7264 6.69441 15.7763C6.79771 15.8262 6.91021 15.8542 7.02486 15.8586C7.1395 15.8631 7.25383 15.8438 7.36067 15.802C7.46752 15.7602 7.56458 15.6968 7.64578 15.6158L13.484 10.6206C13.5757 10.5423 13.6493 10.4452 13.6998 10.3358C13.7503 10.2263 13.7764 10.1072 13.7764 9.98668C13.7764 9.86615 13.7503 9.74703 13.6998 9.63758C13.6493 9.52813 13.5757 9.43092 13.484 9.35268L7.64578 4.3527C7.4983 4.2217 7.30913 4.14742 7.11192 4.14278Z" fill="#F3F3F3"/>
                  </svg>
                </motion.button>
              ))}
            </div>
          </div>
          <div className="md:w-[1px] self-stretch" style={{
              background: "linear-gradient(180deg, #4F4F4F 0%, rgba(212, 212, 212, 0.80) 100%)"
            }}></div>
          {/* Right Side */}
          <div className="w-full md:w-[39%] flex flex-col justify-start relative rounded-xl py-5 md:py-0 pl-5 md:pl-13 pr-5 xl:pr-12 2xl:pr-22 mt-12 md:mt-0 md:bg-none bg-linear-to-t from-[#0662DA] to-[#00162C]">
            
            <AnimatePresence mode="wait">
              <motion.ul
                key={activeTab}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="space-y-4.5 mb-10 md:mb-24"
              >
                <h2 class="text-2xl font-medium text-[#FFBF3C] md:hidden">{activeTab}</h2>
                {industryData[activeTab].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center space-x-2 text-gray-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
                      <path d="M6.16003 14.5595L11.3871 19.5995L21.84 9.51953" stroke="#EBDE9C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-lg md:text-xl font-medium tracking-tight text-[#EBDE9C]">{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </AnimatePresence>

            <div className="flex flex-wrap justify-start gap-6">
              <ButtonArrow
                to="/our-solutions"
                text="View More Features"
                bgColor="#FFBF3C"
                hoverColor="#1269CD"
                textColor="#000"
                hoverTextColor="#fff"
                padding="pl-4 py-1 pr-1 w-full md:w-auto"
                rounded="rounded-full"
                textSize="text-base"
              />
              <ButtonArrow
                to="/case-studies"
                text="View Case Studies"
                bgColor="rgba(8, 36, 87, 0.50)"
                hoverColor="#1269CD"
                textColor="#FBFBFB"
                hoverTextColor="#fff"
                padding="pl-4 py-1 pr-1 w-full md:w-auto"
                rounded="rounded-full"
                textSize="text-base"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default IndustriesSection;