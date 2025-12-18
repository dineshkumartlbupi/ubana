import { useEffect, useState } from "react";
import FAQSection from '../components/contact/Faq'

export default function Faq() {

  return (
    <div className="bg-[#00081F] text-white">
      {/* Hero banner */}
      <section
        className="relative overflow-hidden"
      >
        <div className="px-4 xl:px-12 2xl:px-22 pt-30 relative">
          <div className="bg-[#1269CD] h-54 p-15 md:p-10 rounded-[20px] backdrop-blur-xs flex flex-col relative bg-[url('/assets/images/blog/blog-dtl-bnr-bg.webp')] bg-no-repeat bg-bottom">
            <h1 className="relative text-[#DBF262] text-xl md:text-[2.75rem] font-normal leading-tight text-center md:w-1/2 mx-auto">Frequently Asked Question</h1>
          </div>
        </div>
      </section>
      <div className="px-4 xl:px-12 2xl:px-22 pb-16 mb-8 md:mb-0">
        <FAQSection/>
      </div>
    </div>
  );
}


