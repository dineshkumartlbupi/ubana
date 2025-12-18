import React, { useState, useEffect } from "react";
import ButtonArrow from "../buttonArrow";
import CaseStudies from "../caseStudies";
import { motion } from "framer-motion";
import { getImageUrl } from "../../utils/imageUtils.jsx";

const API_BASE = import.meta.env.VITE_PAYLOAD_API_URL || "http://localhost:3011";

const HCaseStudies = () => {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function loadCaseStudies() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/case-studies?sort=-publishedAt&limit=10`);
        if (!res.ok) throw new Error(`Failed to load case studies (${res.status})`);
        const json = await res.json();
        if (!isMounted) return;
        
        const docs = json?.docs || [];
        // Map API response to the format expected by CaseStudies component
        const mappedCaseStudies = docs.map((cs) => ({
          id: cs.id,
          rightbg: cs.rightbg || "bg-[#9BBAFF]", // Use admin-defined background color or default
          showCount: cs.showCount !== undefined ? cs.showCount : true,
          title: cs.title || "",
          desc: cs.excerpt || "",
          image: getImageUrl(cs?.coverImage?.url || cs?.coverImage?.sizes?.card?.url),
          slug: cs.slug || "",
          stats: cs.metrics || [], // Map metrics to stats
          // Optional testimonial fields (can be added to backend if needed)
          testiquote: cs.testiquote || null,
          testidesc: cs.testidesc || null,
          testilogo: cs.clientLogo ? getImageUrl(cs.clientLogo.url) : null,
          testilogoname: cs.testilogoname || null,
        }));
        
        setCaseStudies(mappedCaseStudies);
      } catch (e) {
        if (!isMounted) return;
        setError(e?.message || "Failed to load case studies");
        console.error("Error loading case studies:", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadCaseStudies();
    return () => { isMounted = false };
  }, []);

  return (
    <div className="px-4 xl:px-12 2xl:px-22 md:py-24 py-15">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}      
        whileInView={{ opacity: 1, y: 0 }}    
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.1 }} 
      >
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-[50%] mb-5 md:mb-0">
            <div className="flex justify-start items-center mb-5 gap-6">
              <p className="text-sm text-[#1269CD] font-normal tracking-wider">Our Case Studies</p>
              <div className="h-[2px] w-28 bg-linear-to-r from-[#1269CD] to-[#fff]"></div>
            </div>
            <h2 className="text-[2rem] md:text-[2.5rem] text-[#313131] font-medium tracking-tight">Proven Results from Industry Leaders</h2>
          </div>
          <div className="w-full md:w-[35%]">
            <p className="text-[#2E2E2E] text-lg font-normal opacity-80 mb-5 md:mb-3.5">See how businesses like yours achieved measurable improvements in customer satisfaction and cost efficiency using the HALO platform.</p>
            <div className="flex justify-start">
              <ButtonArrow
                to="/case-studies"
                text="View More Case Studies"
                bgColor="#1269CD"
                hoverColor="#FFBF3C"
                textColor="#fff"
                hoverTextColor="#000"
                padding="pl-4 py-1 pr-1 w-full md:w-auto"
                rounded="rounded-full"
                textSize="text-base"
              />
            </div>
          </div>
        </div>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, y: 30 }}      
        whileInView={{ opacity: 1, y: 0 }}    
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }} 
      >
        {loading ? (
          <div className="flex items-center justify-center h-[480px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1269CD]" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[480px] text-red-600">
            <p>{error}</p>
          </div>
        ) : caseStudies.length > 0 ? (
          <CaseStudies slides={caseStudies} />
        ) : (
          <div className="flex items-center justify-center h-[480px] text-gray-500">
            <p>No case studies available</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
export default HCaseStudies;