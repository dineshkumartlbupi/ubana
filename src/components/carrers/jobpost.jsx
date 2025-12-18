import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import ButtonArrow from "../buttonArrow";
import ButtonNormal from "../buttonNormal";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const API_BASE = import.meta.env.VITE_PAYLOAD_API_URL || "http://localhost:3011";

const tabs = [
  "All",
  "Engineering",
  "AI & Data Science",
  "Product & Design",
  "Operations",
  "Sales & Marketing",
  "Internships",
];

const CareersSection = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();


  const [showAll, setShowAll] = useState(false);
  const [cardsLimit, setCardsLimit] = useState(6);

  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [rect, setRect] = useState(null);

  const handleEnter = (e) => {
    setRect(e.currentTarget.getBoundingClientRect());
    setIsHovered(true);
  };

  const handleLeave = () => {
    setIsHovered(false);
    setRect(null);
  };

  const handleMouse = (e) => {
    if (!rect) return;
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };


  useEffect(() => {
    const updateLimit = () => {
      if (window.innerWidth < 640) {
        setCardsLimit(3);
      } else {
        setCardsLimit(6);
      }
    };

    updateLimit();
    window.addEventListener("resize", updateLimit);
    return () => window.removeEventListener("resize", updateLimit);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadJobs() {
      try {
        setLoading(true);
        const res = await fetch(
          `${API_BASE}/api/job-openings?where[status][equals]=published&sort=-publishedAt&limit=100`
        );
        if (!res.ok) throw new Error(`Failed to load jobs (${res.status})`);

        const json = await res.json();
        if (!isMounted) return;
        setJobs(json.docs || []);
      } catch (e) {
        if (!isMounted) return;
        console.error("Error loading jobs:", e);
        setError(e?.message || "Failed to load jobs");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadJobs();
    return () => {
      isMounted = false;
    };
  }, []);

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "1 day ago";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 14) return "1 week ago";
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 60) return "1 month ago";
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const filteredJobs =
    activeTab === "All"
      ? jobs
      : jobs.filter((job) => job.category === activeTab);


  const visibleJobs = showAll
    ? filteredJobs
    : filteredJobs.slice(0, cardsLimit);

  return (
    <motion.section
      id="careers-section"
      initial={{ opacity: 0, y: 30 }}      
      whileInView={{ opacity: 1, y: 0 }}    
      transition={{ duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}  
      className="min-h-screen bg-[#001528] text-white py-16 px-4 md:px-12">
      <div className="text-center mb-10">
          <div className="flex justify-center items-center mb-8.5 gap-6">
              <div className="h-[2px] w-14 md:w-28 bg-linear-to-r from-[#FFFFFF00] to-[#FFBF3C]"></div>
              <p className="text-sm text-[#FFBF3C] font-medium tracking-wider">Job Openings</p>
              <div className="h-[2px] w-14 md:w-28 bg-linear-to-r from-[#FFBF3C] to-[#FFFFFF00]"></div>
          </div>
      </div>
      <div className="flex justify-center mb-11.5 md:mb-20">
          <div className="flex items-center rounded-full border border-[#3B436E] scrollbar-hide overflow-x-auto px-2 py-2 md:py-1">
              {tabs.map((tab) => (
                  <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-5 py-2 rounded-full text-sm font-normal cursor-pointer whitespace-nowrap transition-all duration-300 ${activeTab === tab
                          ? "bg-[#B6D1F0] text-[#1269CD]"
                          : "text-[#C3C3C3] hover:text-white"
                          }`}
                  >
                      {tab}
                  </button>
              ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFBF3C] mx-auto mb-4"></div>
          <p className="text-gray-300">Loading jobs...</p>
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-400">
          <p className="text-lg">{error}</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-300 text-lg">
            No jobs found{activeTab !== "All" ? ` in ${activeTab}` : ""}
          </p>
        </div>
      ) : (
        <>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleJobs.map((job) => {
              const isHovered = hoveredCard === job.id;

              return (
                <div
                  key={job.id}
                  onMouseEnter={() => setHoveredCard(job.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`rounded-2xl transition-all duration-300 p-4 md:p-8 shadow-md border ${
                    isHovered
                      ? "bg-[#1269CD] border-[#1E64F0]"
                      : "bg-[#1269CD] md:bg-white/10 border-white/15"
                  }`}
                >

                  <h3
                    className={`text-lg font-semibold leading-tight mb-3.5 transition-colors duration-300 text-[#E1EFEB]`}
                  >
                    {job.title}
                  </h3>

                  <hr
                    className={`mb-4 transition-colors duration-300 ${
                      isHovered ? "border-blue-300/30" : "border-white/15"
                    }`}
                  />


                  <div
                    className={`flex items-center justify-between gap-5 text-sm mb-3.5 transition-colors duration-300 ${
                      isHovered ? "text-white" : "text-gray-400"
                    }`}
                  >

                    <div className="flex items-center gap-2 text-sm font-normal text-white">
                      <svg className="text-[#FAD892]" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16" fill="none">
                                        <g clipPath="url(#clip0_922_10811)">
                                            <path d="M7.99788 7.66495C9.44413 7.66495 10.6208 6.48848 10.6208 5.04242C10.6208 3.59636 9.44413 2.41992 7.99788 2.41992C6.55163 2.41992 5.375 3.59636 5.375 5.04242C5.375 6.48848 6.55163 7.66495 7.99788 7.66495ZM7.99788 3.3573C8.92719 3.3573 9.68325 4.11327 9.68325 5.04242C9.68325 5.97161 8.92722 6.72758 7.99788 6.72758C7.06853 6.72758 6.3125 5.97161 6.3125 5.04242C6.3125 4.11327 7.06856 3.3573 7.99788 3.3573Z" fill="#FAD892"/>
                                            <path d="M5.14339 9.75409C5.85386 10.7159 5.56842 10.3418 7.61483 13.2636C7.80083 13.5302 8.19636 13.5314 8.38342 13.264C10.4391 10.3284 10.1562 10.7002 10.8551 9.75406C11.5631 8.79556 12.2952 7.80444 12.6964 6.643C13.2771 4.96172 13.0261 3.29819 11.9897 1.95881C11.9897 1.95881 11.9897 1.95878 11.9897 1.95878C11.0404 0.73225 9.54861 0 7.99927 0C6.44992 0 4.95817 0.73225 4.00883 1.95884C2.97249 3.29822 2.72149 4.96178 3.30217 6.64306C3.7033 7.80447 4.43542 8.79559 5.14339 9.75409ZM4.75027 2.53247C5.52333 1.53369 6.73792 0.937375 7.99927 0.937375C9.26061 0.937375 10.4752 1.53369 11.2483 2.53247L11.2482 2.53244C12.0847 3.61344 12.2842 4.96462 11.8102 6.33706C11.4559 7.36294 10.7671 8.29541 10.101 9.19719C9.58239 9.89928 9.73761 9.68453 7.99927 12.1763C6.26274 9.68703 6.41599 9.89906 5.89752 9.19719C5.23142 8.29541 4.54264 7.36291 4.1883 6.33706C3.7143 4.96459 3.91386 3.61344 4.75027 2.53247Z" fill="#FAD892"/>
                                            <path d="M5.52964 11.7868C5.39139 11.568 5.10189 11.5026 4.88301 11.6409L3.5502 12.4827C3.25945 12.6663 3.25917 13.0913 3.5502 13.2752L7.7502 15.9279C7.90311 16.0245 8.09798 16.0245 8.25085 15.9279L12.4509 13.2752C12.7416 13.0915 12.7419 12.6665 12.4509 12.4827L11.118 11.6409C10.8991 11.5026 10.6096 11.568 10.4714 11.7868C10.3331 12.0057 10.3985 12.2951 10.6174 12.4334L11.3228 12.8789L8.00051 14.9773L4.67823 12.8789L5.38367 12.4334C5.60254 12.2952 5.66789 12.0057 5.52964 11.7868Z" fill="#FAD892"/>
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_922_10811">
                                            <rect width="16" height="16" fill="white"/>
                                            </clipPath>
                                        </defs>
                                    </svg> <span>{job.location}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm font-normal text-white">
                       <svg className="text-[#FAD892]" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16" fill="none">
                                        <g clipPath="url(#clip0_922_10818)">
                                            <path d="M16 4.83594C16 4.06053 15.3692 3.42969 14.5938 3.42969H12.0938V2.42103C12.0938 1.60731 11.4318 0.945312 10.6181 0.945312H5.38197C4.56825 0.945312 3.90625 1.60731 3.90625 2.42103V3.42969H1.40625C0.630844 3.42969 0 4.06053 0 4.83594V7.05459C0 7.46803 0.134625 7.98362 0.625 8.48938V13.6484C0.625 14.4238 1.25584 15.0547 2.03125 15.0547H13.9688C14.7442 15.0547 15.375 14.4238 15.375 13.6484V8.48938C15.8652 7.98391 16 7.46847 16 7.05459V4.83594ZM4.84375 2.42103C4.84375 2.12425 5.08519 1.88281 5.38197 1.88281H10.6181C10.9148 1.88281 11.1563 2.12425 11.1563 2.42103V3.42969H4.84375V2.42103ZM0.9375 4.83594C0.9375 4.57747 1.14778 4.36719 1.40625 4.36719H14.5938C14.8522 4.36719 15.0625 4.57747 15.0625 4.83594V7.05459C15.0625 8.20797 12.8498 9.14919 9.625 9.39578V8.96094C9.625 8.70206 9.41512 8.49219 9.15625 8.49219H6.84375C6.58488 8.49219 6.375 8.70206 6.375 8.96094V9.39563C3.15316 9.14872 0.9375 8.20503 0.9375 7.05459V4.83594ZM8.6875 9.42969V10.0391C8.6875 10.3751 8.41413 10.6484 8.07812 10.6484H7.92188C7.58588 10.6484 7.3125 10.3751 7.3125 10.0391V9.42969H8.6875ZM13.9688 14.1172H2.03125C1.77278 14.1172 1.5625 13.9069 1.5625 13.6484V9.17734C2.95825 9.89256 4.42506 10.1683 6.40425 10.3379C6.54391 11.0483 7.17119 11.5859 7.92188 11.5859H8.07812C8.82887 11.5859 9.45619 11.0482 9.59578 10.3378C11.2307 10.2194 12.7066 9.91928 13.7843 9.48322C14.0266 9.38516 14.2434 9.28272 14.4375 9.17725V13.6484C14.4375 13.9069 14.2272 14.1172 13.9688 14.1172Z" fill="#FAD892"/>
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_922_10818">
                                            <rect width="16" height="16" fill="white"/>
                                            </clipPath>
                                        </defs>
                                    </svg><span>{job.employmentType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-normal text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16" fill="none">
                                        <g clipPath="url(#clip0_922_10822)">
                                            <path d="M8 16C12.4107 16 16 12.4107 16 8C16 3.58934 12.4107 0 8 0C3.5893 0 0 3.58934 0 8C0 12.4107 3.58934 16 8 16ZM8 1.06665C11.824 1.06665 14.9334 4.17597 14.9334 8C14.9334 11.824 11.824 14.9334 8 14.9334C4.17597 14.9334 1.06665 11.824 1.06665 8C1.06665 4.17597 4.17602 1.06665 8 1.06665Z" fill="#FAD892"/>
                                            <path d="M10.3335 10.5486C10.4321 10.6285 10.5494 10.6659 10.6668 10.6659C10.8241 10.6659 10.9788 10.5966 11.0828 10.4659C11.2668 10.2366 11.2294 9.90055 11.0001 9.71654L8.53345 7.74321V3.73254C8.53345 3.43921 8.29346 3.19922 8.00012 3.19922C7.70678 3.19922 7.4668 3.43921 7.4668 3.73254V7.99923C7.4668 8.16191 7.54148 8.3139 7.66679 8.41521L10.3335 10.5486Z" fill="#FAD892"/>
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_922_10822">
                                            <rect width="16" height="16" fill="white"/>
                                            </clipPath>
                                        </defs>
                                    </svg><span>{getTimeAgo(job.publishedAt)}</span>
                    </div>
                  </div>

                  <hr
                    className={`mb-4 transition-colors duration-300 ${
                      isHovered ? "border-blue-300/30" : "border-white/15"
                    }`}
                  />
                  <div className="flex justify-end">
                    <Link
                      to={`/job/${job.slug}`}
                      onMouseEnter={handleEnter}
                      onMouseMove={handleMouse}
                      onMouseLeave={handleLeave}
                      className={`relative flex items-center justify-center pl-4 py-1 pr-1 w-auto text-base font-normal rounded-full leading-[34px] md:bg-transparent bg-[#FFBF3C] border border-[#FFBF3C] overflow-hidden group transition-all ease-in-out duration-500`}
                    >
                      {/* Bubble */}
                      <span
                        className="absolute rounded-full pointer-events-none group-hover:bg-[#FFBF3C] -translate-1/2 scale-0 group-hover:scale-100 transition-all duration-500 ease-in-out"
                        style={{
                          width: "400px",
                          height: "400px",
                          top: coords.y,
                          left: coords.x,
                        }}
                      ></span>

                      {/* Content */}
                      <span
                        className="relative flex items-center justify-center pr-11 md:pr-0 w-full gap-3 z-10 transition-all duration-500 text-black md:text-[#FFBF3C] group-hover:text-black"
                      >
                        View Details
                        <span className="absolute right-0 md:static md:w-0 w-8.5 md:h-0 h-8.5 group-hover:w-8.5 group-hover:h-8.5 bg-[#001935]/50 rounded-full backdrop-blur-md flex items-center justify-center scale-100 md:scale-0 group-hover:scale-100 transition-all duration-500 ease-in-out">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="17" viewBox="0 0 18 17" fill="none">
                            <path d="M16.1938 8.12561L11.3915 3.32329C11.2621 3.19832 11.0888 3.12917 10.9089 3.13073C10.7291 3.1323 10.557 3.20445 10.4298 3.33165C10.3026 3.45884 10.2304 3.63091 10.2289 3.81079C10.2273 3.99067 10.2965 4.16397 10.4214 4.29336L14.0527 7.9246H1.98787C1.80591 7.9246 1.63142 7.99688 1.50276 8.12554C1.3741 8.2542 1.30182 8.4287 1.30182 8.61065C1.30182 8.7926 1.3741 8.9671 1.50276 9.09576C1.63142 9.22442 1.80591 9.2967 1.98787 9.2967H14.0527L10.4214 12.9279C10.3559 12.9912 10.3036 13.0669 10.2677 13.1506C10.2317 13.2343 10.2128 13.3244 10.212 13.4154C10.2112 13.5065 10.2286 13.5969 10.2631 13.6812C10.2976 13.7655 10.3485 13.8421 10.4129 13.9065C10.4773 13.9709 10.5539 14.0219 10.6383 14.0564C10.7226 14.0909 10.8129 14.1082 10.904 14.1074C10.9951 14.1066 11.0851 14.0877 11.1688 14.0518C11.2525 14.0158 11.3282 13.9635 11.3915 13.898L16.1938 9.09568C16.3224 8.96703 16.3947 8.79256 16.3947 8.61065C16.3947 8.42873 16.3224 8.25427 16.1938 8.12561Z" fill="white"/>
                          </svg>
                        </span>
                      </span>
                    </Link>
                  </div>  
                </div>
              );
            })}
          </div>

          {filteredJobs.length > cardsLimit && (
            <div className="flex justify-center mt-10 ">
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-[#FAD892] text-lg font-medium flex items-center gap-2 cursor-pointer"
              >
                {showAll ? "Show less jobs" : "Show more jobs"}
                <span className="transition-transform duration-300">
                  {showAll ? <FaChevronUp className="inline ml-1" /> : <FaChevronDown className="inline ml-1" />}
                </span>
              </button>
            </div>
          )}
        </>
      )}

      <div className="w-full px-1 text-[#fff] flex flex-col md:flex-row items-center justify-between gap-10 mt-14 md:mt-20 md:bg-transparent bg-white/10 md:py-0 py-6 md:px-0 px-4 rounded-lg">
        <div className="flex-1 text-left">
          <p className="text-[#fff] text-xl max-w-xl">
            We are passionate about what we do and are always looking for
            driven, talented individuals to be a part of our journey.
          </p>
        </div>

        <div className="flex-shrink-0 md:text-right text-center w-full md:w-auto">
          <ButtonNormal
            to="mailto:careers@ubona.com"
            text="careers@ubona.com"
            bgColor="#FFBF3C"
            hoverColor="#fff"
            textColor="#000B15"
            hoverTextColor="#2D2D2D"
            borderColor="border-[#FFBF3C]"
            padding="px-4 py-1 w-full md:w-auto"
            rounded="rounded-full"
            textSize="text-base"
            iconMail={true}
          />
        </div>
      </div>
    </motion.section>
  );
};

export default CareersSection;
