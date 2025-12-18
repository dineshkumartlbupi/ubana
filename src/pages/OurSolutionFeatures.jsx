import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Link, useParams } from "react-router-dom";
import LazyImage from "../components/lazyImage";
import ButtonArrow from "../components/buttonArrow";
import ButtonNormal from "../components/buttonNormal";
import Breadcrumb from "../components/breadCrumb";
import TestimonialSection from "../components/home/testimonial";
import { solutionFeatureData } from "../static/solutionDataFeature";
import { Testimonials as FallbackTestimonials } from "../static/homeData";
import "../App.css";

const API_BASE = import.meta.env.VITE_PAYLOAD_API_URL || "http://localhost:3011";

function OurSolutionFeatures() {
  const { slug } = useParams(); // e.g. /our-solution/genie/key-feature
  const pageData = solutionFeatureData[slug];
  const featureCards = pageData?.featureCards || [];
  const [testimonials, setTestimonials] = useState(FallbackTestimonials);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/testimonials?where[type][equals]=client&sort=order&limit=100`);
        if (response.ok) {
          const data = await response.json();
          if (data.docs && data.docs.length > 0) {
            const transformed = data.docs.map((item) => ({
              name: item.name,
              text: item.text,
              position: item.position || '',
              company: item.company || '',
            }));
            setTestimonials(transformed);
          }
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Force scroll to top immediately and repeatedly
    window.scrollTo(0, 0);

    // Keep forcing it for the first 500ms to fight any auto-scroll/restoration
    const intervalId = setInterval(() => {
      window.scrollTo(0, 0);
    }, 10);

    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
    }, 500);

    return () => {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      // Force scroll again when content loads
      window.scrollTo(0, 0);
    }
  }, [loading]);

  const handleDownloadPDF = () => {
    if (!pageData?.pdfDownload) return;

    const link = document.createElement("a");
    link.href = pageData.pdfDownload;
    link.download = pageData.pdfDownload.split("/").pop(); // auto file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="">
      <div className="banr-wrap pt-50 bg-[#00081F] relative overflow-hidden">
        <div className="flex justify-center">
          <Breadcrumb />
        </div>
        <div className="text-center mb-10">
          <div className="">
            <img src="/assets/images/solution/solution-sub-bnr.webp" alt="halo rays banner" />
          </div>
        </div>
        <div className="px-4 xl:px-12 2xl:px-22">
          <div className="rounded-4xl flex justify-center backdrop-blur-xl overflow-hidden"
            style={{ background: "linear-gradient(180deg, rgba(0, 22, 44, 0.60) 28.51%, rgba(153, 14, 89, 0.60) 100%)" }}
          >
            <div className={`py-21 ${pageData?.ftrbnrBgWidthClass}`}>
              <div className={`flex flex-wrap justify-center gap-12 bg-no-repeat bg-center-top pb-170 ${pageData?.ftrbannerBgClass} ${pageData?.ftrbnrPdClass}`}>
                {featureCards.map((card) => (
                  <div
                    key={card.id}
                    className="small-box border border-white/60 rounded-2xl backdrop-blur-2xl py-4.25 px-4 flex flex-col items-center justify-center gap-4 w-[166px] min-h-[148px] hover:scale-105 transition-transform duration-300"
                    style={{ background: "linear-gradient(180deg, rgba(18, 105, 205, 1) 16.94%, rgba(98, 70, 236, 1) 99.97%)" }}
                  >
                    <div className="">
                      <LazyImage effect="blur" src={card.icon} alt={card.iconalt} className="w-full" />
                    </div>
                    <h3 className="text-[#FFEECA] text-base 2xl:text-lg font-normal text-center">{card.title}</h3>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-6 -mt-35">
                <ButtonArrow
                  to="/contact-us"
                  text="Schedule Tailored Demo"
                  bgColor="#FFBF3C"
                  hoverColor="#1269CD"
                  textColor="#000"
                  hoverTextColor="#fff"
                  padding="pl-4 py-1 pr-1"
                  rounded="rounded-full"
                  textSize="text-base"
                />
                <ButtonNormal
                  to="#"
                  text="Download Feature list"
                  bgColor="#ABABAB/30"
                  hoverColor="#1269CD"
                  textColor="#FBFBFB"
                  hoverTextColor="#fff"
                  padding="px-6 py-1"
                  rounded="rounded-full"
                  textSize="text-base"
                  icon={true}
                  onClick={handleDownloadPDF}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {!loading && <TestimonialSection testimonials={testimonials} />}
      {/* <div className="flex flex-wrap">
        <div className="rounded-2xl border border-[#D9D9D9] bg-white p-3.5">
          <div className="rounded-lg border border-[#D9D9D9] bg-[#FFF9E9] px-6 py-8">
            <div>
              <p>Overview</p>
              <LazyImage effect="blur" src={card.icon} alt={card.iconalt} className="w-full" />
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}
export default OurSolutionFeatures;