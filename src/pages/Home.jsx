import React, { Suspense, lazy, useEffect, useState, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Banner from "../components/home/Banner";
import LogoSliderTabs from "../components/logoSliderTabs";
import TestimonialSection from "../components/home/testimonial";
import AboutSection from "../components/home/about";
import OutComes from "../components/home/outComes";
import BannerSlider from "../components/home/recentUpdate";
import HaloShowcase from "../components/home/haloShowcase";
import IndustriesSection from "../components/home/industriesSection";
import HCaseStudies from "../components/home/caseStudies";
import { Testimonials as FallbackTestimonials } from "../static/homeData";
import "../App.css";

const API_BASE = import.meta.env.VITE_PAYLOAD_API_URL || "http://localhost:3011";

gsap.registerPlugin(ScrollTrigger);

function Home() {
  const [testimonials, setTestimonials] = useState(FallbackTestimonials);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    window.scrollTo(0, 0);

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
      // Refresh ScrollTrigger to account for new content (Testimonials)
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);
    }
  }, [loading]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/testimonials?where[type][equals]=client&sort=order&limit=100`);
        if (response.ok) {
          const data = await response.json();
          if (data.docs && data.docs.length > 0) {
            // Transform Payload data to match component expectations
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
        // Keep fallback testimonials on error
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <div className="">
      <Banner />
      <LogoSliderTabs />
      {!loading && <TestimonialSection testimonials={testimonials} buttonLink={true} />}
      <AboutSection />
      <OutComes />
      <BannerSlider />
      <HaloShowcase />
      <IndustriesSection />
      <HCaseStudies />
    </div>
  );
}
export default Home;
