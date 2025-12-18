import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MdKeyboardArrowRight } from "react-icons/md";

const Breadcrumb = () => {
  const location = useLocation();

  // Split current path into array
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <div className="flex justify-center items-center mb-4 md:gap-4 gap-2">
      <div className="h-[2px] w-10 md:w-28 bg-linear-to-r from-[#434343]/0 to-[#6BFDA5]"></div>
        <nav>
          <ol className="flex flex-wrap items-center justify-center">
            {/* Home link */}
            <li>
              <Link to="/" className="text-sm font-medium text-white/70 hover:text-[#6BFDA5] tracking-wider transition-all duration-500 ease-in-out">
                Home
              </Link>
            </li>

            {/* Loop through each path segment */}
            {pathnames.map((name, index) => {
              const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
              const isLast = index === pathnames.length - 1;

              // Capitalize first letter for clean display
              const label = name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, " ");

              return (
                <li key={name} className="flex items-center">
                  <svg className="mx-1" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M4.06836 11.3594L8.76636 6.8817C8.81665 6.83153 8.85655 6.77194 8.88377 6.70634C8.91099 6.64074 8.925 6.5704 8.925 6.49938C8.925 6.42835 8.91099 6.35802 8.88377 6.29241C8.85655 6.22681 8.81665 6.16722 8.76636 6.11705L4.06836 1.63938" stroke="white" strokeOpacity="0.7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {isLast ? (
                    <span className="text-sm font-medium text-[#6BFDA5] capitalize tracking-wider">{label}</span>
                  ) : (
                    <Link to={routeTo} className="text-sm font-medium text-white/70 hover:text-[#6BFDA5] tracking-wider capitalize transition-all duration-500 ease-in-out">
                      {label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      <div className="h-[2px] md:w-28 w-10 bg-linear-to-r from-[#6BFDA5] to-[#434343]/0"></div>
    </div>
  );
};

export default Breadcrumb;