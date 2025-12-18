import React, { useRef, useState, useEffect } from "react";
import ButtonArrow from "../buttonArrow";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { getImageUrl } from "../../utils/imageUtils";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { MdOutlineNavigateNext, MdOutlineNavigateBefore } from "react-icons/md";

const API_BASE = import.meta.env.VITE_PAYLOAD_API_URL || "http://localhost:3011";

const BannerSlider = () => {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSlides() {
      try {
        setLoading(true);
        setError(null);

        // Try fetching all slides first, then filter by published
        // Add depth=2 to populate image relation
        const url = `${API_BASE}/api/banner-slides?limit=100&sort=order&depth=2`;
        console.log('Fetching banner slides from:', url);

        const response = await fetch(url);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error Response:', errorText);
          throw new Error(`Failed to fetch slides: ${response.status}`);
        }

        const data = await response.json();
        console.log('Banner slides API response:', data);

        if (data.docs && Array.isArray(data.docs)) {
          // Filter by published status and format slides
          const formattedSlides = data.docs
            .filter((slide) => slide.published !== false) // Include if published is true or undefined
            .map((slide) => {
              // Handle image URL - Payload returns full object with url property
              let imageUrl = "";
              if (slide.image) {
                if (typeof slide.image === 'string') {
                  // If it's just an ID, we'd need to fetch it, but typically Payload returns the full object
                  imageUrl = getImageUrl(slide.image);
                } else if (slide.image.url) {
                  imageUrl = getImageUrl(slide.image.url);
                } else if (slide.image.filename) {
                  imageUrl = getImageUrl(`/media/${slide.image.filename}`);
                }
              }

              return {
                id: slide.id,
                tag: slide.tag || "",
                title: slide.title || "",
                subtitle: slide.subtitle || "",
                img: imageUrl,
                btnText: slide.buttonText || "Explore Now",
                btnLink: slide.buttonLink || "/",
              };
            });

          console.log('Formatted slides:', formattedSlides);
          console.log('Number of slides:', formattedSlides.length);
          if (formattedSlides.length > 0) {
            console.log('First slide data:', formattedSlides[0]);
          }
          setSlides(formattedSlides);
        } else {
          console.warn('No docs in response:', data);
          setSlides([]);
        }
      } catch (err) {
        console.error("Error fetching slides:", err);
        setError(err.message);
        setSlides([]);
      } finally {
        setLoading(false);
      }
    }

    fetchSlides();
  }, []);

  if (loading) {
    return (
      <div className="relative w-full px-4 xl:px-12 2xl:px-22 pt-14 pb-24 md:py-14 bg-[#000001]">
        <div className="flex justify-center items-center h-[80vh]">
          <p className="text-white">Loading slides...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative w-full px-4 xl:px-12 2xl:px-22 pt-14 pb-24 md:py-14 bg-[#000001]">
        <div className="flex justify-center items-center h-[80vh]">
          <p className="text-red-500">Error loading slides: {error}</p>
        </div>
      </div>
    );
  }

  if (slides.length === 0 && !loading && !error) {
    // Show a message if no slides are available (for debugging)
    console.warn('No banner slides available');
    return (
      <div className="relative w-full px-4 xl:px-12 2xl:px-22 pt-14 pb-24 md:py-14 bg-[#000001]">
        <div className="flex flex-col justify-center items-center h-[80vh] gap-4">
          <p className="text-white text-lg">No banner slides available</p>
          <p className="text-gray-400 text-sm">Please add slides in the Payload CMS admin panel</p>
        </div>
      </div>
    );
  }

  // Get image URL with cache-busting to force browser to reload updated images
  const getImageUrlWithCacheBust = (imgUrl, slideId) => {
    if (!imgUrl) return '';
    // Add cache-busting query parameter using slide ID to ensure unique URLs
    // This forces the browser to reload the image when it changes
    const separator = imgUrl.includes('?') ? '&' : '?';
    return `${imgUrl}${separator}_v=${slideId || activeIndex}`;
  };

  const currentImageUrl = slides[activeIndex]?.img
    ? getImageUrlWithCacheBust(slides[activeIndex].img, slides[activeIndex].id)
    : '';

  return (
    <div className="recent-update-sec relative w-full px-4 xl:px-12 2xl:px-22 pt-14 pb-24 md:py-14">
      <div
        key={`bg-${activeIndex}-${slides[activeIndex]?.id || ''}`}
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: currentImageUrl
            ? `url(${currentImageUrl})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          transition: "opacity 0.6s ease-in-out",
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        className="relative z-10"
      >
        <div className="relative md:h-[75vh]">
          {/* Custom Navigation */}
          <div className="absolute right-12 -bottom-15 md:bottom-8 z-10 group cursor-pointer bg-[#3E5DA2] hover:bg-white hover:scale-120 flex items-center justify-center w-7 h-7 rounded-lg shadow-md transition-all ease-in-out duration-500" id="prev">
            <MdOutlineNavigateBefore className="text-2xl text-white group-hover:text-[#3E5DA2] transition-all ease-in-out duration-500" />
          </div>
          <div className="absolute right-0 -bottom-15 md:bottom-8 z-10 group cursor-pointer bg-[#3E5DA2] hover:bg-white hover:scale-120 flex items-center justify-center w-7 h-7 rounded-lg shadow-md transition-all ease-in-out duration-500" id="next">
            <MdOutlineNavigateNext className="text-2xl text-white group-hover:text-[#3E5DA2] transition-all ease-in-out duration-500" />
          </div>

          {/* Swiper */}
          <Swiper
            modules={[Navigation, Pagination]}
            pagination={{
              el: ".custom-pagination",
              clickable: true,
            }}
            navigation={{
              prevEl: "#prev",
              nextEl: "#next",
            }}
            loop={slides.length > 1}
            spaceBetween={50}
            slidesPerView={1}
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className="h-full"
          >
            {slides.map((slide, index) => {
              console.log(`Rendering slide ${index}:`, slide);
              return (
                <SwiperSlide key={slide.id || index}>
                  <div className="flex flex-col md:flex-row items-center justify-between h-full">
                    {/* Left Text */}
                    <div className="w-full md:w-[50%] text-left z-10">
                      {slide.tag && (
                        <div className="flex justify-start items-center mb-5 gap-6">
                          <p className="text-sm text-[#E1DD68] font-normal tracking-wider">{slide.tag}</p>
                          <div className="h-[2px] w-28 bg-linear-to-r from-[#E1DD68] to-[#434343]/0"></div>
                        </div>
                      )}
                      <h2 className="text-3xl md:text-[2.75rem] font-semibold tracking-wide text-white mb-3 md:mb-5">{slide.title || 'No Title'}</h2>
                      {slide.subtitle && (
                        <p className="text-base 2xl:text-lg text-white max-w-md mx-auto md:mx-0">{slide.subtitle}</p>
                      )}
                      <div className="hidden md:flex mt-7">
                        <ButtonArrow
                          to={slide.btnLink}
                          text={slide.btnText}
                          bgColor="#FFBF3C"
                          hoverColor="#1269CD"
                          textColor="#000"
                          hoverTextColor="#fff"
                          padding="pl-4 py-1 pr-1"
                          rounded="rounded-full"
                          textSize="text-base"
                        />
                      </div>
                    </div>

                    {/* Right Image */}
                    <div className="w-full md:w-[75%] mt-8 md:mt-0 md:flex justify-center z-10">
                      {/* {slide.img ? (
                        <img
                          src={slide.img}
                          alt={slide.title || 'Slide image'}
                          className="w-full md:w-[90%] h-[350px] md:h-[450px] object-cover rounded-2xl shadow-lg"
                          onError={(e) => {
                            console.error('Image failed to load:', slide.img);
                            e.target.style.display = 'none';
                          }}
                          onLoad={() => {
                            console.log('Image loaded successfully:', slide.img);
                          }}
                        />
                      ) : (
                        <div className="w-full md:w-[90%] h-[350px] md:h-[450px] bg-gray-800 rounded-2xl flex items-center justify-center">
                          <p className="text-gray-400">No image available</p>
                        </div>
                      )} */}
                      <div className="flex md:hidden mt-11">
                        <ButtonArrow
                          to={slide.btnLink}
                          text={slide.btnText}
                          bgColor="#FFBF3C"
                          hoverColor="#1269CD"
                          textColor="#000"
                          hoverTextColor="#fff"
                          padding="pl-4 py-1 pr-1 w-full md:w-auto"
                          rounded="rounded-full"
                          textSize="text-base"
                        />
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Custom Pagination */}
          <div className="absolute -bottom-12 md:bottom-8 left-4! md:left-1/2! md:-translate-x-1/2 flex gap-3 z-20">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => swiperRef.current?.slideToLoop(index)}
                className={`w-12 h-[2px] rounded-full cursor-pointer transition-all duration-500 ${activeIndex === index
                  ? "bg-white"
                  : "bg-white/20 hover:bg-white/70"
                  }`}
              ></button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BannerSlider;