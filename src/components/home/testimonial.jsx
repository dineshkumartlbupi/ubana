import React, { useRef } from "react";
import ButtonArrow from "../buttonArrow";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";

const TestimonialSection = ({ 
  testimonials, 
  heading = "What Our Clients Say About Ubona",
  buttonLink = null,
}) => {
  const swiperRef = useRef(null);
  return (
    <section className="w-full sm:px-4 xl:px-12 2xl:px-22" 
      style={{ background: "linear-gradient(179deg, #000C24 5.64%, #000B48 99.1%)" }}
    >
      <motion.div 
        initial={{ opacity: 0, y: 30 }}      
        whileInView={{ opacity: 1, y: 0 }}    
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }} 
      >
        <div className="flex flex-col lg:flex-row items-center md:gap-10">
          {/* LEFT BLOCK */}
          <div className="lg:text-left w-full md:w-[41%] px-4 md:px-0 py-8 md:py-0 bg-white md:bg-transparent">
            <h2 className="text-3xl md:text-[2.625rem] font-medium tracking-tight text-[#252525] md:text-white text-center md:text-left mb-5 md:mb-10">
              {heading}
            </h2>
            {buttonLink && (
              <div className="flex md:justify-start justify-center">
                <ButtonArrow
                  to="/case-studies"
                  text="View Success Stories"
                  bgColor="#FFBF3C"
                  hoverColor="#1269CD"
                  textColor="#000"
                  hoverTextColor="#fff"
                  padding="pl-4 py-1 pr-1 w-full md:w-auto"
                  rounded="rounded-full"
                  textSize="text-base"
                />
              </div>
            )}
          </div>

          {/* RIGHT BLOCK */}
          <div className="w-full md:w-[59%] flex justify-end px-4 md:px-0">
            <div className="w-134 relative"
              onMouseEnter={() => swiperRef.current?.autoplay?.stop()}   
              onMouseLeave={() => swiperRef.current?.autoplay?.start()}
            >
              <div className="absolute top-0 left-0 w-full h-25 md:h-53 z-10"
              style={{ background: "linear-gradient(180deg, #000B1F 10.44%, rgba(28, 39, 38, 0.00) 99.8%)" }}
              ></div>
              <Swiper
                direction="vertical"
                loop={true}
                slidesPerView={1.5}
                centeredSlides={true}
                spaceBetween={24}
                speed={4000}
                allowTouchMove={true}
                simulateTouch={true}
                touchStartPreventDefault={true}
                touchReleaseOnEdges={true}   
                passiveListeners={false}
                grabCursor={true}
                autoplay={{
                  delay: 1,
                  disableOnInteraction: false,
                  reverseDirection: false,
                  pauseOnMouseEnter: false,
                }}
                breakpoints={{
                  640: {
                    slidesPerView: 1.8,
                  },
                  768: {
                    slidesPerView: 2,
                  },
                  1024: {
                    slidesPerView: 2.2,
                  },
                }}
                modules={[Autoplay]}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                className="md:h-200 h-170 mr-0!"
              >
                {testimonials.map((item, index) => (
                  <SwiperSlide key={index}>
                    <div className="bg-white h-full md:h-88 shadow-md rounded-2xl p-5 md:p-8 flex flex-col justify-between">
                      <span className="w-9 md:w-12 h-9 md:h-12 flex">
                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
                          <path d="M22.1161 9.5334V28.2377L15.9217 40.6217C15.4952 41.3778 14.71 41.8625 13.8423 41.9061H8.4429C7.64794 41.9061 7.28442 41.339 7.64794 40.6217L13.8035 28.2377H2.68953C1.89468 28.2377 1.25 27.5931 1.25 26.7982V9.5334C1.25 8.73852 1.89468 8.09387 2.68953 8.09387H20.6766C21.4714 8.09387 22.1161 8.73852 22.1161 9.5334Z" fill="#656FF2"/>
                          <path d="M48.7489 9.53328V28.2376L42.5594 40.6215C42.128 41.3777 41.3428 41.8624 40.4751 41.906H35.0806C34.2807 41.906 33.9221 41.3389 34.2807 40.6215L40.4412 28.2376H29.3223C28.5275 28.2376 27.8828 27.593 27.8828 26.7981V9.53328C27.8828 8.7384 28.5275 8.09375 29.3223 8.09375H47.3094C48.1042 8.09375 48.7489 8.7384 48.7489 9.53328Z" fill="#656FF2"/>
                        </svg>
                      </span>
                      <div>
                        <p className="text-xl font-normal text-[#393939] leading-[30px] mb-4">“{item.text}”</p>
                        <h4 className="text-xl font-medium text-[#656565] leading-[30px] tracking-tight mb-1">{item.name}</h4>
                        {item.position && (
                          <p className="text-base font-medium text-[#656565] leading-[20px] tracking-tight mb-1">{item.position}</p>
                        )}
                        {item.company && (
                          <p className="text-base font-medium text-[#656565] leading-[20px] tracking-tight">{item.company}</p>
                        )}
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="absolute bottom-0 left-0 w-full h-25 md:h-53 z-10"
              style={{ background: "linear-gradient(0deg, #010B46 10.44%, rgba(28, 39, 38, 0.00) 99.8%)" }}
              ></div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default TestimonialSection;
