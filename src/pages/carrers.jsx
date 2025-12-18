import React, { useState, useEffect } from "react";
import useSEO from "../utils/useSEO";
import CareersBanner from '../components/carrers/carrersbanner'
import LifeAtUbona from '../components/carrers/lifeatubona'
import CareersSection from '../components/carrers/jobpost'
import TestimonialSection from '../components/home/testimonial'
import { Testimonials as FallbackTestimonials } from "../static/careerData";
import WhyUbona from '../components/carrers/whyubona'
import GreatCards from "../components/about/greatCards";

const API_BASE = import.meta.env.VITE_PAYLOAD_API_URL || "http://localhost:3011";

function Carrers() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [testimonials, setTestimonials] = useState(FallbackTestimonials);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024); // lg breakpoint
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/testimonials?where[type][equals]=employee&sort=order&limit=100`);
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
        console.error('Error fetching employee testimonials:', error);
        // Keep fallback testimonials on error
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  useSEO({
    title: "Join Ubona: Careers in Cloud-Based Call Center Solutions",
    description: "Explore exciting career opportunities at Ubona, a leader in AI based IVR, customer support chatbots, and the best cloud telephony solutions in India."
  });
  return (
    <div>
      <div className="bg-[#001528] pt-20.5 md:pt-0">
        <CareersBanner/>
      </div>
      <div className="">
        <GreatCards />
      </div>
      <LifeAtUbona/>
      <CareersSection/>
      {!loading && <TestimonialSection testimonials={testimonials} heading="Hear It From the People Who Make Ubona What It Is" buttonLink={false} />}
      <WhyUbona/>
    </div>
  )
}

export default Carrers
