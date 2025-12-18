import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import RegisterModal from "../Registermodel";
import React from "react";
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const resourcesRef = useRef<HTMLButtonElement | null>(null);
  // Define routes where header is always light
  const lightHeaderRoutes = ["/careers", "/terms-and-conditions", "/success"]; 
  // 👆 Add any paths here that should start with white background + color logo

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close Resources dropdown on outside click or Escape (DESKTOP ONLY)
  useEffect(() => {
    if (!resourcesOpen) return;

    const isDesktop = window.innerWidth >= 768; // md breakpoint

    if (!isDesktop) return; // ❗ Skip outside-click on mobile

    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;

      const isOutsideButton =
        resourcesRef.current && !resourcesRef.current.contains(target);

      const megaMenuPanel = document.getElementById("resources-megamenu");
      const isOutsidePanel =
        megaMenuPanel && !megaMenuPanel.contains(target);

      if (isOutsideButton && isOutsidePanel) {
        setResourcesOpen(false);
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setResourcesOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [resourcesOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";  
    } else {
      document.body.style.overflow = "";      
    }
  
    return () => {
      document.body.style.overflow = "";       
    };
  }, [isMenuOpen]);  

  // Decide if current page is a "light header" page
  const isLightPage = lightHeaderRoutes.includes(location.pathname);
  const isLightHeader = isLightPage || scrolled;
  const isResourcePage = ["/blogs", "/case-studies", "/news"].includes(location.pathname);

  // Decide logo
  const getLogo = () => {
    if (isLightPage) {
      return "/color-logo.svg"; // always color logo
    }
    return scrolled ? "/color-logo.svg" : "/color-logo.svg"; // other pages
  };
  // Menu list and link
  const navItems = [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/about-us" },
    { label: "Our Solutions", path: "/our-solutions" },
    { label: "Careers", path: "/careers" },
    { label: "Contact Us", path: "/contact-us" },
  ];
  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition duration-300 ${
        scrolled
          ? "bg-black shadow-md"
          : isLightPage
          ? "bg-transparent"
          : "bg-transparent" // dark header for other pages
      }`}>
      <div className="mx-auto relative flex h-20 xl:h-24 items-center justify-between px-4 xl:px-12 2xl:px-22">
        {/* Logo */}
        <Link to="/" className="block md:w-40" aria-label="Ubona Logo">
          <img
            className="h-13 transition duration-300"
            src={getLogo()}
            alt="Ubona logo"
          />
        </Link>
        {/* <Link to="/" className="block order-1 lg:order-1">
          <img className="h-10" src="/logo.svg" alt="Logo" />
        </Link> */}
      {/* CTA removed as per request */}
        {/* Toggle Button (mobile only) */}
        <button
          className="lg:hidden text-gray-600 order-3 lg:order-2 outline-0"
          onClick={() => {setIsMenuOpen(!isMenuOpen); setOpenModal(false);}}
        >
          <span className="sr-only">Toggle menu</span>
          {isMenuOpen ? (
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="#FFF"
              viewBox="0 0 24 24"
              // className={`${ scrolled
              //     ? "bg-white shadow-md"
              //     : isLightPage
              //     ? "bg-white"
              //     : "bg-transparent" // dark header for other pages
              // }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 25"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 5.3C6 4.64 6.54 4.1 7.2 4.1H22.8C23.46 4.1 24 4.64 24 5.3C24 5.96 23.46 6.5 22.8 6.5H7.2C6.54 6.5 6 5.96 6 5.3ZM22.8 11.3H1.2C0.54 11.3 0 11.84 0 12.5C0 13.16 0.54 13.7 1.2 13.7H22.8C23.46 13.7 24 13.16 24 12.5C24 11.84 23.46 11.3 22.8 11.3ZM22.8 18.5H12C11.34 18.5 10.8 19.04 10.8 19.7C10.8 20.36 11.34 20.9 12 20.9H22.8C23.46 20.9 24 20.36 24 19.7C24 19.04 23.46 18.5 22.8 18.5Z"
                fill="#FFF"
              />
            </svg>
          )}
        </button>

        {/* Backdrop overlay for mobile menu */}
        {isMenuOpen && (
          <div 
            className="fixed top-20 inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* Shared Menu (desktop always visible, mobile toggle) */}
        <nav
          className={`absolute lg:static top-20 right-0 w-full lg:w-auto h-[calc(100vh_-_80px)] md:h-auto bg-[#001528] lg:bg-transparent shadow-md lg:shadow-none z-50 
            transform transition-transform duration-500 ease-in-out lg:transform-none
            ${isMenuOpen ? "translate-x-0 overflow-y-auto" : "translate-x-full"} lg:translate-x-0`}
        >
          <ul className="flex flex-col lg:flex-row items-start lg:items-center gap-3.5 md:gap-8 p-4 md:p-6 lg:p-0 text-sm">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const isLightPage = lightHeaderRoutes.includes(location.pathname);
              const useDarkColors = isLightPage ? (scrolled || isMenuOpen) : true;
              // scrolled or "light page" => dark header style
              // otherwise => dark header (white menu)

              return (
                <li key={item.path} className="w-full md:w-auto">
                  <Link
                    to={item.path}
                    onClick={() => {setIsMenuOpen(false); setResourcesOpen(false); setOpenModal(false);}}
                    className={`block text-xl md:text-sm 2xl:text-xl transition duration-300 ease-in-out py-4 md:py-1 px-4.5 md:px-3.5 border border-transparent rounded-lg md:rounded-full hover:font-medium text-right md:text-center
                      ${
                        isActive
                          ? useDarkColors
                            ? // ACTIVE: dark header (dark page OR light page scrolled)
                              "text-[#FBFBFB] hover:text-[#fff] border-[#929292]! bg-[#1269CD] md:bg-[#808080]/20 backdrop-blur-lg font-medium"
                            : // ACTIVE: light page top (white header)
                              "text-[#000B15] hover:text-[#1269CD] border-[#929292]! bg-[#1269CD] md:bg-[#808080]/20 backdrop-blur-lg font-medium"
                          : useDarkColors
                          ? // INACTIVE: dark header (dark page OR light page scrolled)
                            "text-[#BFBFBF] hover:text-[#fff] bg-[#0662DA]/10 md:bg-transparent inset-shadow-lg inset-shadow-indigo-500"
                          : // INACTIVE: light page top (white header)
                            "text-[#000B15] hover:text-[#1269CD] bg-[#0662DA]/10 md:bg-transparent inset-shadow-lg inset-shadow-indigo-500"
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            {/* Resources dropdown trigger (desktop) */}
            <li className={`w-full md:w-auto transition-all py-4 md:py-1 px-4.5 md:px-0 rounded-lg md:rounded-full ${
                resourcesOpen ? "bg-[#0662DA]/10 md:bg-transparent" : "bg-[#0662DA]/10 md:bg-transparent inset-shadow-lg inset-shadow-indigo-500"
            }`}>
              <button
                ref={resourcesRef}
                onClick={() => {setResourcesOpen(prev => !prev); setOpenModal(false);}}
                className={`flex flex-row-reverse md:flex-row items-center justify-between w-full md:w-auto gap-2 text-xl md:text-sm 2xl:text-xl py-0 md:px-4 rounded-full cursor-pointer transition ${
                    isLightPage && !scrolled
                      ? // 🌕 Light page top → white header
                        resourcesOpen
                          ? "text-[#FFBF3C]"
                          : "text-white md:text-[#000B15] hover:text-[#1269CD]"
              
                      : // 🌑 Light page scrolled → DARK HEADER (should behave like dark mode!)
                      isLightPage && scrolled
                      ? resourcesOpen
                        ? "text-[#FFBF3C]"
                        : "text-white hover:text-[#fff]"
              
                      : // 🌚 Dark page normal + dark page scrolled
                      resourcesOpen
                        ? "text-[#FFBF3C]"
                        : "text-[#BFBFBF] hover:text-white"
                  }`
                }
              >
                Resources
                <svg className={`transition-all duration-500 ease-in-out w-5 md:w-4 h-5 md:h-4 ${resourcesOpen ? "rotate-180 text-[#FFBF3C]" : "rotate-0"}`} width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {resourcesOpen && (
                <div className="md:hidden mt-2 border-t border-[#244E7E]/60">
                  {[
                    { to: "/blogs", label: "Blogs" },
                    { to: "/case-studies", label: "Case Studies" },
                    { to: "/news", label: "Newsroom" },
                  ].map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => {
                        // close sub-menu + full mobile menu
                        setResourcesOpen(false);
                        setIsMenuOpen(false);
                        setOpenModal(false);
                      }}
                      className={`block text-lg w-full py-4 text-right border-b border-[#244E7E]
                        ${
                          location.pathname === item.to
                            ? "text-[#FFBF3C]"   // ACTIVE
                            : "text-white hover:text-[#FFBF3C]"
                        }
                      `}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </li>
            {/* CTA inside same menu */}
            <li className="lg:hidden w-full">
              <button onClick={() => {setOpenModal(true); setResourcesOpen(false);}}
                className="flex items-center justify-center w-full cursor-pointer gap-2 text-sm font-semibold text-white px-6 py-3 rounded-full shadow-lg cursor-pointer"
                style={{
                  boxShadow:
                    "inset 0rem 0.063rem 0.063rem 0rem #ffffff26, inset 0rem -0.063rem 0.125rem 0rem #0000001A",
                  background:
                    "radial-gradient(72.52% 92.19% at 52.17% 7.81%, #CD97FF 0%, #5A40EB 100%)",
                }}>
                  Book a Free Demo
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M2.5 8H13.5"
                      stroke="#fff"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 3.5L13.5 8L9 12.5"
                      stroke="#fff"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
              </button>
            </li>
          </ul>
        </nav>

        {/* Megamenu outside nav - full width */}
        {resourcesOpen && (
          <div className="fixed left-0 top-20 xl:top-24 w-full z-[9999] px-4 xl:px-12 2xl:px-22">
            <div id="resources-megamenu"
              className="hidden md:block rounded-[36px] backdrop-blur-lg h-[75vh] border border-[#B6D1F0]/10"
              style={{ background: "linear-gradient(180deg, rgba(0, 22, 44, 0.60) 28.51%, rgba(0, 58, 133, 0.60) 100%)" }}
            >
              <div className="p-12.5 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    to: "/blogs",
                    title: "Blogs",
                    desc: "Explore insights, trends, and ideas shaping the future of AI-driven communication.",
                  },
                  {
                    to: "/case-studies",
                    title: "Case Studies",
                    desc: "Discover how Ubona's AI solutions have transformed businesses across industries.",
                  },
                  {
                    to: "/news",
                    title: "Newsroom",
                    desc: "Stay updated with Ubona's latest announcements, partnerships, and product innovations.",
                  },
                ].map((item) => {
                  const isActive = location.pathname === item.to;

                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setResourcesOpen(false)}
                      className={`group block h-full text-center rounded-3xl py-11 2xl:py-15 px-6 2xl:px-10 bg-no-repeat bg-center bg-cover transition-all duration-400 ease-in-out 
                        ${
                          isActive
                            ? "bg-[url('/assets/images/megamenu-item-bg-active.svg')] shadow-lg"
                            : "bg-[url('/assets/images/megamenu-item-bg.svg')] hover:bg-[url('/assets/images/megamenu-item-bg-active.svg')]"
                        }`}
                    >
                      <p
                        className={`text-2xl 2xl:text-4xl font-semibold mb-3 transition-colors duration-300 ${
                          isActive ? "text-[#FFBF3C]" : "text-[#FFBF3C] group-hover:text-[#FFBF3C]"
                        }`}
                      >
                        {item.title}
                      </p>
                      <p className="text-sm 2xl:text-xl text-white leading-relaxed">{item.desc}</p>
                    </Link>
                  );
                })}
              </div>
            </div>

          </div>
        )}


        {/* Right: Schedule Demo CTA (desktop) */}
        <div className="hidden lg:flex justify-self-end">
          <button onClick={() => {setOpenModal(true); setResourcesOpen(false);}}
            className="inline-flex items-center cursor-pointer gap-2 text-sm 2xl:text-xl font-semibold text-white px-6 py-3 rounded-full shadow-lg group hover:scale-105 transition-all ease-in-out duration-500"
            style={{
              boxShadow:
                "inset 0rem 0.063rem 0.063rem 0rem #ffffff26, inset 0rem -0.063rem 0.125rem 0rem #0000001A",
              background:
                "radial-gradient(72.52% 92.19% at 52.17% 7.81%, #CD97FF 0%, #5A40EB 100%)",
            }}
          >
            Book a Free Demo
            <svg className="ml-1.5 group-hover:translate-x-2 group-hover:scale-120 transition-all ease-in-out duration-500"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M2.5 8H13.5"
                stroke="#fff"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 3.5L13.5 8L9 12.5"
                stroke="#fff"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
      {/* Modal */}
      <RegisterModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      />
    </header>
  );
};
export default Header;
