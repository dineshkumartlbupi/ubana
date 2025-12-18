import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";

const API_BASE = import.meta.env.VITE_PAYLOAD_API_URL || "http://localhost:3011";

const LogoSliderTabs = () => {
  const tabsContainerRef = useRef(null);
  const swiperRef = useRef(null);
  const [isFewSlides, setIsFewSlides] = useState(false);

  const tabs = [
    { id: "all", label: "All Clients" },
    { id: "finance", label: "Banking & Finance" },
    { id: "insurance", label: "Insurance" },
    { id: "marketplace", label: "Marketplaces & E-commerce" },
    { id: "enterprise", label: "Other Large Enterprises" },
  ];

  const [activeTab, setActiveTab] = useState("all");
  const [logos, setLogos] = useState({
    all: [],
    finance: [],
    insurance: [],
    marketplace: [],
    enterprise: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch logo data
  useEffect(() => {
    async function fetchLogos() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE}/api/client-logos?limit=1000&sort=order`);
        if (!response.ok) throw new Error(`Failed to fetch logos: ${response.status}`);

        const data = await response.json();

        const grouped = {
          all: [],
          finance: [],
          insurance: [],
          marketplace: [],
          enterprise: [],
        };

        if (data.docs) {
          data.docs.forEach((logo) => {
            const category = logo.category || "all";
            const logoData = {
              id: logo.id,
              src: logo.logo?.url
                ? (logo.logo.url.startsWith("http") ? logo.logo.url : `${API_BASE}${logo.logo.url}`)
                : "",
              name: logo.name || "",
            };

            if (grouped[category] && category !== "all") {
              grouped[category].push(logoData);
            }
            grouped.all.push(logoData);
          });
        }

        setLogos(grouped);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchLogos();
  }, []);

  const currentLogos = logos[activeTab] || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="w-full pt-13 bg-white">
        {/* Section Header */}
        <div className="flex justify-center items-center mb-8.5 gap-6 px-4 md:px-0">
          <div className="h-[2px] md:w-28 w-16 bg-linear-to-r from-white to-[#1269CD]"></div>
          <p className="text-sm text-[#1269CD] font-medium tracking-wider">Trusted By</p>
          <div className="h-[2px] md:w-28 w-16 bg-linear-to-r from-[#1269CD] to-white"></div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8 px-4 md:px-0">
          <div
            ref={tabsContainerRef}
            className="gap-3 flex md:justify-center flex-nowrap overflow-x-auto scrollbar-hide border border-[#D0D0D0] rounded-[52px] p-2"
          >
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  setActiveTab(tab.id);

                  // Scroll selected tab into view (mobile)
                  if (window.innerWidth < 768 && tabsContainerRef.current) {
                    const container = tabsContainerRef.current;
                    const scrollLeft = e.currentTarget.offsetLeft - container.offsetLeft - 8;
                    container.scrollTo({ left: scrollLeft, behavior: "smooth" });
                  }
                }}
                className={`relative whitespace-nowrap px-3 py-2 rounded-full text-sm font-normal cursor-pointer transition-all duration-300 
                  ${
                    activeTab === tab.id
                      ? "bg-[#BBDBFF]/40 text-[#1269CD]"
                      : "bg-white text-[#575757] hover:text-[#1269CD]"
                  }`}
              >
                {tab.label}

                {activeTab === tab.id && (
                  <motion.span
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 rounded-full bg-[#BBDBFF]/40 opacity-10 z-0"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Slider Section */}
        <div className="bg-[#F2F2F2] py-8 px-4 xl:px-12 2xl:px-22">
          {loading ? (
            <div className="flex justify-center py-12 text-[#575757]">Loading logos...</div>
          ) : error ? (
            <div className="flex justify-center py-12 text-red-500">Error: {error}</div>
          ) : currentLogos.length === 0 ? (
            <div className="flex justify-center py-12 text-[#575757]">
              No logos in this category
            </div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              onMouseEnter={() => swiperRef.current?.autoplay.stop()}
              onMouseLeave={() => swiperRef.current?.autoplay.start()}
            >
              <Swiper key={activeTab}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
              
                  const perView = swiper.params.slidesPerView === "auto"
                    ? swiper.slidesPerViewDynamic()
                    : swiper.params.slidesPerView;
              
                  setIsFewSlides(currentLogos.length <= perView);
                }}
                onResize={(swiper) => {
                  const perView = swiper.params.slidesPerView === "auto"
                    ? swiper.slidesPerViewDynamic()
                    : swiper.params.slidesPerView;
              
                  setIsFewSlides(currentLogos.length <= perView);
                }}
                modules={[Autoplay]}
                loop={true}
                spaceBetween={15}
                autoplay={{
                  delay: 0,
                  disableOnInteraction: false,
                }}
                speed={3000}
                allowTouchMove={false}
                watchSlidesProgress={true}
                breakpoints={{
                  320: { slidesPerView: 2, spaceBetween: 20 },
                  640: { slidesPerView: 3, spaceBetween: 30 },
                  768: { slidesPerView: 4, spaceBetween: 30 },
                  1024: { slidesPerView: 6, spaceBetween: 40 },
                }}
                className={`select-none logo-tab-slider ${
                  isFewSlides ? "logo-slider--few" : ""
                }`}
              >
                {currentLogos.map((logo) => (
                  <SwiperSlide key={logo.id} className="flex justify-center items-center">
                    <div className="h-18.5 md:h-28 bg-white rounded-xl pt-4 md:pt-6 px-7 pb-3 flex flex-col justify-center items-center">
                      <div className="flex items-center justify-center h-6 md:h-10">
                        <img
                          src={logo.src}
                          alt={logo.name}
                          className="max-h-full object-contain"
                          onError={(e) => (e.target.style.display = "none")}
                        />
                      </div>

                      <p className="text-[8px] md:text-xs text-center text-[#5B5B5B] font-normal mt-2">
                        {logo.name}
                      </p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LogoSliderTabs;
