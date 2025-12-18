import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

const categories = ["All", "Genie", "Connect", "Speech", "Others"];


const faqsData = {
  All: [
    { category: "Ubona", question: "How long does it take to implement HALO solutions?", answer: "Implementation time depends on scale and customization, but typically ranges between 2 to 6 weeks. Our deployment team ensures smooth integration with your existing infrastructure — including CRM, telephony, and data systems.", },
    { category: "Ubona", question: "What is Ubona and what does it do?", answer: "Ubona provides advanced AI-driven communication and automation solutions to enhance customer engagement and operational efficiency.", },
    { category: "Ubona", question: "Which industries does Ubona serve?", answer: "Ubona serves telecom, BFSI, healthcare, retail, and other customer-centric industries requiring intelligent automation.", },
    { category: "Ubona", question: "How can I request a demo or consultation?", answer: "You can request a demo or consultation through our website’s contact form or email us directly.", },
    { category: "Ubona", question: "What makes HALO different from other AI solutions?", answer: "HALO stands out due to its seamless integration capabilities, custom AI modules, and superior voice recognition technology.", },
  ],
  Genie: [
    {
      category: "Genie",
      question: "What is HALO Genie?",
      answer:
        "HALO Genie is a conversational AI platform that automates customer interactions across voice, chat, WhatsApp, and digital channels using low-code workflows.",
    },
    {
      category: "Genie",
      question: "Which channels does HALO Genie support?",
      answer:
        "HALO Genie works across IVR, web chat, WhatsApp, SMS, email, and other digital messaging platforms.",
    },
    {
      category: "Genie",
      question: "Can HALO Genie handle regional and multilingual conversations?",
      answer:
        "Yes, it supports major Indian and global languages with high-accuracy understanding and responses.",
    },
    {
      category: "Genie",
      question: "Can HALO Genie process secure transactions like payments?",
      answer:
        "Yes, the platform supports PCI-ready payment flows with encryption and tokenization for secure processing.",
    },
    {
      category: "Genie",
      question: "How does HALO Genie escalate conversations to live agents?",
      answer:
        "HALO Genie hands off complex interactions seamlessly to agents with full customer context and transcripts using HALO Connect.",
    },
    {
      category: "Genie",
      question: "How quickly can a HALO Genie pilot go live?",
      answer:
        "Most pilots can be launched within 4–6 weeks, depending on system integrations and customization needs.",
    },
  ],

  Connect: [
    {
      category: "Connect",
      question: "What is HALO Connect?",
      answer:
        "HALO Connect is a unified agent desktop that allows teams to manage voice and digital conversations from a single platform.",
    },
    {
      category: "Connect",
      question: "Does HALO Connect replace existing telephony systems?",
      answer:
        "No, it integrates with most telephony platforms and CRMs rather than replacing existing infrastructure.",
    },
    {
      category: "Connect",
      question: "How does HALO Connect support agents in real time?",
      answer:
        "AI assists agents with reply suggestions, call transcripts, summaries, and next-best-action prompts.",
    },
    {
      category: "Connect",
      question: "Can calls be routed based on skill, language, or priority?",
      answer:
        "Yes, intelligent routing automatically directs contacts to the most suitable agents.",
    },
    {
      category: "Connect",
      question: "Does HALO Connect provide supervisor and coaching tools?",
      answer:
        "Yes, it includes real-time dashboards, call monitoring, and coaching workflows.",
    },
    {
      category: "Connect",
      question: "Is HALO Connect suitable for large enterprises?",
      answer:
        "Yes, the platform is designed to scale to thousands of agents across multiple locations securely.",
    },
  ],

  Speech: [
    {
      category: "Speech",
      question: "What is HALO Speech?",
      answer:
        "HALO Speech is an AI-powered speech analytics engine that transcribes and analyzes customer calls in real time.",
    },
    {
      category: "Speech",
      question: "Does HALO Speech provide sentiment analysis?",
      answer:
        "Yes, it detects tone, sentiment, and emotional cues during conversations.",
    },
    {
      category: "Speech",
      question: "Can HALO Speech identify compliance issues?",
      answer:
        "Yes, keyword detection and compliance alerts flag potential policy violations or sensitive data exposure.",
    },
    {
      category: "Speech",
      question: "Are call summaries generated automatically?",
      answer:
        "Yes, the system produces structured summaries with calls, actions, and conversation highlights.",
    },
    {
      category: "Speech",
      question: "Can I search through past call recordings?",
      answer:
        "Absolutely — all transcripts and recordings are searchable by keywords and topics.",
    },
    {
      category: "Speech",
      question: "Is multi-language transcription supported?",
      answer:
        "Yes, HALO Speech supports multilingual transcription for regional and global languages.",
    },
  ],

  Others: [
    {
      category: "Others",
      question: "What is Ubona and what does it do?",
      answer:
        "Ubona is an enterprise conversational AI and contact-center platform providing automation, agent assistance, and speech intelligence through its HALO product suite.",
    },
    {
      category: "Others",
      question: "Which industries does Ubona serve?",
      answer:
        "Ubona supports banking, financial services, insurance, telecom, travel, e-commerce, logistics, and payments sectors.",
    },
    {
      category: "Others",
      question: "What makes HALO different from other AI solutions?",
      answer:
        "HALO combines automation, agent productivity tools, and speech intelligence on one enterprise-grade platform built for compliance, scalability, and business outcomes.",
    },
    {
      category: "Others",
      question: "How long does it take to implement HALO solutions?",
      answer:
        "Implementation typically takes 4–6 weeks for a pilot, with full production rollouts depending on integrations and scope.",
    },
    {
      category: "Others",
      question: "Can HALO integrate with existing systems?",
      answer:
        "Yes, HALO integrates with leading CRMs, telephony platforms, payment gateways, and internal enterprise systems.",
    },
    {
      category: "Others",
      question: "How secure is the HALO platform?",
      answer:
        "HALO follows enterprise-grade security standards including encryption, role-based access controls, audit logging, and compliance-ready workflows.",
    },
    {
      category: "Others",
      question: "How is pricing structured?",
      answer:
        "Pricing is usage-based and varies by channels, volume, and feature selection. A customized quote is provided during consultation.",
    },
    {
      category: "Others",
      question: "How can I request a demo or consultation?",
      answer:
        "You can request a demo by clicking the “Schedule a Demo” button on our website or by reaching out to the Ubona sales team directly.",
    },
  ],
};

const FAQSection = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState(null);


  const filteredFaqs =
    activeCategory === "All"
      ? Object.values(faqsData).flat()
      : faqsData[activeCategory] || [];

  return (
    <div id="faq" className="min-h-screen flex rounded-3xl justify-center text-white md:px-6 px-2 pt-8 md:pt-18 pb-10 mt-7.5 shadow-[inset_0_1px_16px_rgba(151,158,243,0.06)]"
      style={{
        background:
          "linear-gradient(180deg, rgba(0, 22, 44, 0.60) 28.51%, rgba(98, 70, 236, 0.60) 100%)",
      }}
    >

      <div className="w-full max-w-4xl rounded-3xl md:px-10 md:py-0">
        {/* Tabs */}
        <div className="flex justify-center mb-9">
          <div className="flex items-center rounded-full border border-[#3B436E] overflow-hidden px-2 py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setOpenIndex(null);
                }}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${activeCategory === cat
                  ? "bg-[#C7D4FF] text-[#0A0F2C]"
                  : "text-gray-300 hover:text-white"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-6">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`shadow-[inset_0_2px_10px_rgba(151,158,243,0.1)] rounded-2xl border border-[#909291]/24 overflow-hidden transition-all duration-500 ${isOpen ? "bg-[#979EF3]/10" : "bg-[#979EF3]/10"
                  }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className={`w-full flex justify-between items-center gap-4 cursor-pointer px-6 py-5 text-left text-base md:text-xl font-medium hover:text-[#FFBF3C] transition-all duration-500 ease-in-out outline-0 ${isOpen ? "text-[#FFBF3C]" : "text-white"
                    }`}
                >
                  {faq.question}
                  <span className="text-sm">
                    {isOpen ? 
                      <span className="transition-all duration-500 ease-in-out">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M8 12H16M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#FAD892" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </span>
                      : 
                      <span className="transition-all duration-500 ease-in-out">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M12 8V16M8 12H16M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#C3C3C3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </span>
                    }
                  </span>
                </button>
                <div
                  className={`
                    transition-all duration-500 ease-in-out
                    overflow-hidden
                    px-6
                    ${isOpen ? "max-h-40 opacity-100 pb-5" : "max-h-0 opacity-0 pb-0"}
                  `}
                >
                  <div className="text-sm md:text-lg text-white leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10 md:mt-18 text-sm text-[#C3C3C3]">
          <p>Have another question? Please contact our team!</p>
          <p className="mt-2 text-[#C3C3C3]">
            In case of any compliance issues please write to us at –{" "}
            <a href="mailto:info@ubona.com" className="text-[#C3C3C3]">
              info@ubona.com
            </a>{" "}
            or{" "}
            <a href="mailto:dpo@ubona.com" className="text-[#C3C3C3]">
              dpo@ubona.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
