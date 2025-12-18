import React, { useMemo, useState, useEffect } from "react";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import Dots from '../../../public/assets/images/Dots.webp'

export default function PrivacyPolicy() {
  const sections = useMemo(
    () => [
      {
        id: "info-collect",
        title: "Information We Collect",
        paragraphs: [
          "We collect information to provide and improve our products and services. This may include:",
        ],
        listItems: [
          "Information You Provide to Us - Names, company name, email address, and phone number when you contact us, request a demo, or apply for a job. Any information you share through forms, chat, or customer support.",
          "Information Collected Automatically - Usage data such as IP address, browser type, pages visited, and time spent on our sites. Cookies and analytics data to enhance your experience and performance insights.",
          "Information from Third Parties - Data received through integrations, partners, or publicly available business sources, in compliance with applicable laws.",
        ],
      },
      {
        id: "share-info",
        title: "How We Share Your Information",
        paragraphs: ["We use your data to:"],
        listItems: [
          "Provide, operate, and improve AI-based products and services.",
          "Respond to inquiries, schedule demos, and deliver customer support.",
          "Send updates, newsletters, and marketing communications (only if you’ve opted in).",
          "Analyze usage to enhance functionality and user experience.",
          "Meet legal, regulatory, and security requirements.",
        ],
      },
      {
        id: "rights-choices",
        title: "Your Rights and Choices",
        paragraphs: ["We do not sell or rent your personal information. We may share limited data with:"],
        listItems: [
          "Service Providers - Trusted vendors who help us operate our platform, under strict confidentiality agreements.",
          "Business Partners - When relevant for integrations, collaborations, or joint customer engagements.",
          "Legal Authorities - If required by law, investigation, or regulations.",
          "All third-party partners are obligated to handle data securely and use it only for authorized purposes.",
        ],
      },
      {
        id: "cookies",
        title: "Cookies and Tracking Technologies",
        paragraphs: [
          "Ultrax uses cookies and similar technologies to enhance site performance and analytics.",
          "You can control cookie preferences through your browser settings or opt-out of tracking via third-party tools.",
        ],
      },
      {
        id: "third-party-links",
        title: "Third-Party Links",
        paragraphs: [
          "Our website may contain links to external sites not operated by Ultrax.",
          "We are not responsible for the privacy practices or content of such websites and encourage you to review their policies separately.",
        ],
      },
    ],
    []
  );

  const [activeId, setActiveId] = useState(sections[0].id);
  const [accordionOpen, setAccordionOpen] = useState(null);

  // Scrollspy for desktop
  useEffect(() => {
    const handleScroll = () => {
      let current = sections[0].id;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            current = section.id;
            break;
          }
        }
      }
      setActiveId(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const handleNavClick = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="bg-[#00081F] pt-[150px] mb-8 md:mb-0">
      <div className="container-fluid mx-auto px-2 md:px-13">
        <div className="relative w-full bg-[#1976D2] text-center py-16 md:py-20 px-6 overflow-hidden rounded-3xl mb-2 md:mb-12">
          <h2 className="text-3xl md:text-5xl text-[#DBF262] mb-20 relative z-10 font-semibold">
            Privacy Policy
          </h2>
          <div className="absolute top-0 opacity-80 left-0 w-full h-auto pointer-events-none">
            <img
              src={Dots}
              alt="banner-img"
              className="w-full object-contain mt-14"
            />
          </div>
        </div>
      </div>

      <div className="px-4 xl:px-12 2xl:px-22 py-10 bg-[#00081F]">
        <div className="hidden md:flex flex-col md:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className=" w-1/4 md:sticky md:top-24 self-start">
            <div className="rounded-2xl p-5 bg-gradient-to-b from-[#00162C] to-[#1269CD] shadow-inner shadow-blue-900/40">
              <h2 className="text-[#C8F560] text-sm font-semibold mb-4">
                Table of Content
              </h2>
              <div className="space-y-2 flex flex-col">
                {sections.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleNavClick(s.id)}
                    aria-current={activeId === s.id ? "true" : undefined}
                    className={`flex items-center justify-between px-4 py-3 rounded-md transition-all duration-200 text-sm font-medium ${
                      activeId === s.id
                        ? "bg-[#2563EB] text-white shadow-md"
                        : "text-gray-200 hover:bg-[#1E3A8A]/50"
                    }`}
                  >
                    <span>{s.title}</span>
                    <FaChevronRight
                      className={`transition-transform duration-200 ml-2 ${
                        activeId === s.id
                          ? "text-white"
                          : "text-gray-400 group-hover:text-gray-200"
                      }`}
                      size={12}
                    />
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Desktop Content */}
          <main className="px-0 w-3/4">
            <div className="p-5 md:p-8 shadow-md relative z-10">
              {sections.map((s, idx) => (
                <section
                  key={s.id}
                  id={s.id}
                  className="mb-10 first:mt-0 scroll-mt-28"
                >
                  <h2 className="text-2xl font-semibold mb-4 text-[#DBF262]">
                    {idx + 1}. {s.title}
                  </h2>
                  <div className="text-[#C3C3C3] leading-relaxed">
                    {s.paragraphs?.map((p, i) => (
                      <p key={i} className="mb-4">
                        {p}
                      </p>
                    ))}
                    {s.listItems && (
                      <ul className="list-disc list-inside mb-4 p-2 pt-0">
                        {s.listItems.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </section>
              ))}
            </div>
          </main>
        </div>

        {/* Mobile Accordion */}
        <div className="md:hidden flex flex-col gap-4">
          {sections.map((s, idx) => (
            <div
              key={s.id}
              className="rounded-2xl p-3 bg-gradient-to-b from-[#03182d] to-[#1c3f6c] shadow-lg overflow-hidden"
            >
              <button
                onClick={() =>
                  setAccordionOpen(accordionOpen === s.id ? null : s.id)
                }
                className={`w-full text-left px-5 py-4 flex justify-between items-center transition-all duration-200 font-semibold ${
                  accordionOpen === s.id ? "text-[#DBF262]" : "text-white"
                }`}
              >
                <span>{s.title}</span>
                <FaChevronDown
                  className={`transition-transform duration-300 ${
                    accordionOpen === s.id ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
              {accordionOpen === s.id && (
                <div className="px-5 pb-4 text-[#C3C3C3] leading-relaxed">
                  {s.paragraphs?.map((p, i) => (
                    <p key={i} className="mb-3">
                      {p}
                    </p>
                  ))}
                  {s.listItems && (
                    <ul className="list-disc list-inside mb-2">
                      {s.listItems.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
