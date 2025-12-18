import React, { useEffect, useState } from "react";

export default function TermsOfUse() {
  const sections = [
    {
      id: "intro",
      title: "Introduction",
      jsx: (
        <>
          <p className="mb-4">
            Welcome to <strong>[Your Company/App Name]</strong>. These Terms and
            Conditions (“Terms”) govern your use of our website, application,
            and services (“Services”). By accessing or using our Services, you
            agree to comply with and be bound by these Terms. Please read them
            carefully before using our platform.
          </p>
          <p className="mb-4">
            We are committed to protecting your privacy and ensuring that your
            personal information is handled responsibly. This document explains
            the types of data we collect, how we use it, and the purposes for
            which it is processed.
          </p>
        </>
      ),
    },
    {
      id: "policy-apply",
      title: "What Kinds of Personal Information Do We Collect and Use?",
      jsx: (
        <>
          <p className="mb-2">
            When you interact with our Services, we may collect the following
            types of personal information:
          </p>
          <ul className="list-disc list-inside mb-2 p-2 pt-0">
            <li>
              Account Information – such as your name, email address, phone
              number, and login details.
            </li>
            <li>
              Identity Information – such as date of birth, government-issued ID
              (where required).
            </li>
            <li>
              Contact Information – including your address and communication
              preferences.
            </li>
            <li>
              Transaction Information – including payment details, billing
              records, and order history.
            </li>
            <li>
              Device and Technical Information – IP address, browser type,
              operating system, app usage data, and cookies.
            </li>
            <li>
              User Content – information you provide when contacting support,
              submitting feedback, or using interactive features.
            </li>
          </ul>
          <p>
            We only collect personal information that is relevant, necessary,
            and lawful to deliver and improve our Services.
          </p>
        </>
      ),
    },
    {
      id: "choices",
      title: "For What Purposes Do We Use Your Personal Information?",
      jsx: (
        <>
          <p className="mb-3">
            We use the personal information we collect for the following
            purposes:
          </p>
          <ul className="list-disc list-inside mb-2 p-2 pt-0">
            <li>
              To Provide and Improve Services – enabling account creation,
              processing transactions, and your experience.
            </li>
            <li>
              To Communicate With You – sending updates, notifications,
              promotional offers, and responding to inquiries.
            </li>
            <li>
              To Ensure Security – detecting fraud, preventing unauthorized
              access, and maintaining the integrity of our platform.
            </li>
            <li>
              To Comply With Legal Obligations – meeting regulatory, tax, and
              auditing requirements.
            </li>
            <li>
              For Analytics and Development – monitoring service performance,
              conducting research, and improving usability.
            </li>
          </ul>
          <p>
            With Your Consent – using your data for specific purposes that you
            have expressly agreed to.
          </p>
        </>
      ),
    },
    {
      id: "protection",
      title: "How Do We Protect Your Personal Information?",
      jsx: (
        <>
          <p className="mb-3">
            We implement appropriate technical and organizational measures to
            protect your personal data against unauthorized access, loss,
            misuse, or disclosure. These include encrypted storage, access
            controls, and regular security reviews.
          </p>
        </>
      ),
    },
  ];

  const [activeId, setActiveId] = useState(sections[0].id);

  // Scrollspy effect
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
    <div className="mt-[100px] bg-[#fff8f5]">
      {/* Banner / Header (big blue gradient) */}
      <header className="bg-gradient-to-r from-blue-950 to-blue-700 text-white py-30">
        <div className="px-4 xl:px-12 2xl:px-22">
          <h1 className="text-5xl md:text-6xl font-semibold">Terms of Use</h1>
        </div>
      </header>

      {/* Main body */}
      <div className="px-4 xl:px-12 2xl:px-22 py-10 bg-[#FFF6F0]">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left navigation */}
          <aside className="md:w-1/4 sticky top-24 self-start">
            <div className="p-5 space-y-3">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleNavClick(s.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-shadow duration-150 text-sm cursor-pointer ${
                    activeId === s.id
                      ? "bg-blue-100 text-blue-700 font-medium shadow"
                      : "bg-white text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </div>
          </aside>


          {/* Content area */}
          <main className=" px-4 md:px-0 md:w-3/4">
            <div className="bg-white rounded-2xl p-5 md:p-8 shadow-md relative z-10">
              {sections.map((s, idx) => (
                <section
                  key={s.id}
                  id={s.id}
                  className="mb-10 first:mt-0 scroll-mt-28 bg-white"
                >
                  <h2 className="text-2xl font-semibold mb-4">
                    {idx + 1}. {s.title}
                  </h2>
                  <div className="text-gray-700 leading-relaxed">{s.jsx}</div>
                </section>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
