import React, { useState, useEffect } from "react";
import { FiX, FiChevronDown, FiChevronUp } from "react-icons/fi";

const CookieConsent = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState("necessary");
  const [showMore, setShowMore] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    performance: false,
    advertisement: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consentGiven = localStorage.getItem("cookieConsent");
    if (!consentGiven) {
      // Show cookie icon after a small delay for better UX
      setTimeout(() => {
        setShowIcon(true);
      }, 1000);
    } else {
      // Load saved preferences
      const savedPreferences = JSON.parse(consentGiven);
      setPreferences(savedPreferences);
    }
  }, []);

  const toggleCategory = (category) => {
    if (category === "necessary") return; // Cannot toggle necessary cookies
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const handlePreferenceChange = (category, value) => {
    if (category === "necessary") return; // Cannot change necessary cookies
    setPreferences((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      performance: true,
      advertisement: true,
    };
    setPreferences(allAccepted);
    localStorage.setItem("cookieConsent", JSON.stringify(allAccepted));
    setShowPopup(false);
    setShowIcon(false);
  };

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      performance: false,
      advertisement: false,
    };
    setPreferences(onlyNecessary);
    localStorage.setItem("cookieConsent", JSON.stringify(onlyNecessary));
    setShowPopup(false);
    setShowIcon(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem("cookieConsent", JSON.stringify(preferences));
    setShowPopup(false);
    setShowIcon(false);
  };

  const handleClose = () => {
    // If user closes without making a choice, default to necessary only
    const defaultPreferences = {
      necessary: true,
      analytics: false,
      performance: false,
      advertisement: false,
    };
    localStorage.setItem("cookieConsent", JSON.stringify(defaultPreferences));
    setShowPopup(false);
    setShowIcon(false);
  };

  const handleIconClick = () => {
    setShowPopup(true);
  };

  // Cookie Icon Component
  const CookieIcon = () => (
    <button
      onClick={handleIconClick}
      className="fixed bottom-6 left-6 z-40 w-8 h-8 rounded-full bg-[#FAD892] shadow-md hover:scale-115 transition-transform duration-500 flex items-center justify-center group cursor-pointer"
      aria-label="Cookie Preferences"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <g clipPath="url(#clip0_2462_4179)">
          <path d="M9.99172 20C9.91847 20 9.84523 19.9993 9.77161 19.9977C7.02291 19.9392 4.48192 18.789 2.6174 16.7593C-0.855844 12.9784 -0.862981 7.04904 2.60163 3.26103C4.87556 0.776004 8.21772 -0.396644 11.5377 0.119816C11.9449 0.182919 12.2401 0.550638 12.2093 0.956294C12.159 1.63314 12.4046 2.29609 12.8831 2.77499C13.0837 2.97519 13.3136 3.13444 13.5653 3.24825C13.8327 3.36883 14.0122 3.6156 14.046 3.9082C14.1039 4.43029 14.3337 4.90468 14.7101 5.28142C15.079 5.64989 15.568 5.88577 16.0856 5.94549C16.3763 5.97892 16.622 6.15846 16.7429 6.42552C16.8571 6.67868 17.0156 6.90705 17.2132 7.105C17.6924 7.58352 18.361 7.82692 19.0318 7.77921C19.4495 7.74916 19.8048 8.04402 19.8687 8.45117C20.3585 11.5976 19.3083 14.8196 17.0584 17.0703C15.1638 18.9648 12.6615 20 9.99172 20ZM9.96092 0.780134C7.38875 0.780134 4.9319 1.85325 3.16955 3.78012C-0.0283812 7.27628 -0.0219967 12.7493 3.18382 16.2394C4.90523 18.1129 7.25053 19.1744 9.78813 19.2285C12.34 19.2871 14.7184 18.3225 16.5145 16.5264C18.5916 14.4485 19.5615 11.4745 19.1085 8.56987C18.1837 8.60706 17.3063 8.28591 16.6693 7.64888C16.4056 7.3852 16.1945 7.08021 16.042 6.74254C15.3081 6.63023 14.6583 6.31622 14.1662 5.82568C13.6719 5.331 13.3579 4.68083 13.2813 3.99459C12.9124 3.79739 12.6067 3.58555 12.34 3.31924C11.7022 2.68146 11.3755 1.79953 11.4416 0.898825C10.9465 0.8192 10.4515 0.780134 9.96092 0.780134ZM14.0205 15.6753C13.1213 15.6753 12.3896 14.9436 12.3896 14.0444C12.3896 13.1444 13.1213 12.4127 14.0205 12.4127C14.9197 12.4127 15.6514 13.1444 15.6514 14.0444C15.6514 14.9436 14.9197 15.6753 14.0205 15.6753ZM14.0205 13.182C13.5457 13.182 13.1588 13.5688 13.1588 14.0444C13.1588 14.5191 13.5457 14.906 14.0205 14.906C14.4953 14.906 14.8821 14.5191 14.8821 14.0444C14.8821 13.5688 14.4953 13.182 14.0205 13.182ZM6.68975 14.8609C5.47653 14.8609 4.48943 13.8738 4.48943 12.6606C4.48943 11.4474 5.47653 10.4603 6.68975 10.4603C7.90334 10.4603 8.89043 11.4474 8.89043 12.6606C8.89043 13.8738 7.90333 14.8609 6.68975 14.8609ZM6.68975 11.2296C5.90059 11.2296 5.25868 11.8718 5.25868 12.6606C5.25868 13.4494 5.90059 14.0917 6.68975 14.0917C7.4789 14.0917 8.12119 13.4494 8.12119 12.6606C8.12119 11.8718 7.4789 11.2296 6.68975 11.2296ZM11.6046 9.66815C10.7136 9.66815 9.98871 8.94322 9.98871 8.05228C9.98871 7.16134 10.7136 6.43642 11.6046 6.43642C12.4955 6.43642 13.2204 7.16134 13.2204 8.05228C13.2204 8.94322 12.4955 9.66815 11.6046 9.66815ZM11.6046 7.20566C11.1381 7.20566 10.758 7.5854 10.758 8.05228C10.758 8.51916 11.1381 8.8989 11.6046 8.8989C12.0711 8.8989 12.4512 8.51916 12.4512 8.05228C12.4512 7.5854 12.0711 7.20566 11.6046 7.20566ZM5.68086 7.24811C4.9319 7.24811 4.32229 6.63849 4.32229 5.88916C4.32229 5.14019 4.9319 4.53058 5.68086 4.53058C6.4302 4.53058 7.03981 5.14019 7.03981 5.88916C7.03981 6.63849 6.4302 7.24811 5.68086 7.24811ZM5.68086 5.29983C5.35596 5.29983 5.09153 5.56426 5.09153 5.88916C5.09153 6.21443 5.35596 6.47886 5.68086 6.47886C6.00614 6.47886 6.27057 6.21443 6.27057 5.88916C6.27057 5.56426 6.00614 5.29983 5.68086 5.29983Z" fill="black"/>
        </g>
        <defs>
          <clipPath id="clip0_2462_4179">
            <rect width="20" height="20" fill="white"/>
          </clipPath>
        </defs>
      </svg>
    </button>
  );

  return (
    <>
      {/* Cookie Icon Button - shown when user hasn't given consent */}
      {showIcon && !showPopup && <CookieIcon />}

      {/* Cookie Consent Popup */}
      {showPopup && (
    <div className="fixed w-full h-full p-4 md:p-5 inset-0 z-50 flex items-center justify-center">
      <div className="relative w-full h-full flex items-center justify-center rounded-2xl md:rounded-3xl p-2 md:p-4 overflow-hidden">
        {/* Background blur */}
        <div
          className="absolute left-0 top-0 w-full h-full backdrop-blur-md"
          style={{
            background:
              "linear-gradient(180deg, rgba(0, 22, 44, 0.60) 28.51%, rgba(0, 58, 133, 0.60) 100%)",
          }}
        ></div>
        <div className="relative w-full max-w-2xl rounded-2xl px-4 pb-2 sm:p-7.5 z-10"
          style={{
            background:
              "linear-gradient(181deg, rgba(0, 36, 71, 0.7) 13.25%, #1269CD 99.33%)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between pt-2 md:pt-0 pb-3 md:pb-5 mb-3 md:mb-5 border-b border-white/30">
            <h2 className="text-lg md:text-xl font-semibold text-white tracking-[-0.2px]">
              Customise Consent Preferences
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <g clipPath="url(#clip0_2505_1329)">
                  <path d="M17.0754 2.92657C13.1759 -0.97292 6.82893 -0.97292 2.92944 2.92657C1.04052 4.81624 0 7.3281 0 9.99953C0 12.671 1.04052 15.1828 2.92944 17.0717C4.87958 19.0219 7.44101 19.9965 10.0024 19.9965C12.5638 19.9965 15.1253 19.0219 17.0754 17.0717C20.9749 13.1723 20.9749 6.8268 17.0754 2.92657ZM15.9798 15.9762C12.6839 19.2721 7.32089 19.2721 4.02496 15.9762C2.42893 14.3802 1.54955 12.2572 1.54955 9.99953C1.54955 7.74181 2.42893 5.6189 4.02496 4.02209C7.32089 0.726159 12.6839 0.72694 15.9798 4.02209C19.275 7.31802 19.275 12.681 15.9798 15.9762Z" fill="white" fill-opacity="0.7"/>
                  <path d="M13.3395 12.1412L11.1461 9.95094L13.3395 7.76065C13.6416 7.4585 13.6416 6.96806 13.3403 6.66509C13.0373 6.36138 12.5469 6.36216 12.244 6.66431L10.049 8.85617L7.85407 6.66431C7.55113 6.36216 7.0607 6.36138 6.75777 6.66509C6.45561 6.96802 6.45561 7.45846 6.75855 7.76065L8.95197 9.95094L6.75855 12.1412C6.45561 12.4434 6.45561 12.9338 6.75777 13.2368C6.90886 13.3886 7.10796 13.4638 7.30633 13.4638C7.50469 13.4638 7.70301 13.3879 7.8541 13.2375L10.049 11.0457L12.244 13.2375C12.3951 13.3886 12.5934 13.4638 12.7918 13.4638C12.9901 13.4638 13.1892 13.3878 13.3403 13.2368C13.6424 12.9338 13.6424 12.4434 13.3395 12.1412Z" fill="white" fill-opacity="0.7"/>
                </g>
                <defs>
                  <clipPath id="clip0_2505_1329">
                    <rect width="20" height="20" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[60vh] overflow-y-auto pr-2">
            <p className="text-white mb-4 text-sm leading-relaxed">
              We use cookies to help you navigate efficiently and perform certain
              functions. You will find detailed information about all cookies
              under each consent category below.
            </p>

            <p className="text-white mb-4 md:mb-8 text-sm leading-relaxed">
              The cookies that are categorised as "Necessary" are stored on your
              browser as they are essential for enabling the basic functionalities
              of the site.
            </p>

            {!showMore && (
              <button
                onClick={() => setShowMore(true)}
                className="text-[#FFBF3C] hover:text-[#FFD966] text-sm flex items-center gap-1 mb-8 cursor-pointer transition-colors"
              >
                Show more
                <FiChevronDown />
              </button>
            )}

            {showMore && (
              <div className="space-y-3.5 mb-8">
                {/* Necessary Cookies */}
                <div onClick={() => toggleCategory("necessary")} className="bg-[#979EF3]/10 border border-[#909291]/24 p-4 rounded-xl overflow-hidden cursor-pointer">
                  <button onClick={() => toggleCategory("necessary")}
                    className={`w-full flex items-center justify-between transition-all ease-in-out duration-500 cursor-pointer 
                      ${
                        expandedCategory === "necessary"
                          ? "text-[#FFBF3C] font-semibold"
                          : "text-[#F2F2F2] font-normal"
                      }`}
                  >
                    <span>Necessary</span>
                    {expandedCategory === "necessary" ? (
                      <FiChevronUp className="text-[#FFBF3C]" />
                    ) : (
                      <FiChevronDown className="text-[#FAD892]" />
                    )}
                  </button>
                  {expandedCategory === "necessary" && (
                    <div className={`mt-2.5 overflow-hidden transition-all duration-300 ease-out
                      ${expandedCategory === "necessary" ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
                    `}>
                      <p className="text-white text-sm leading-relaxed">
                        Necessary cookies are required to enable the basic
                        features of this site, such as providing secure log-in or
                        adjusting your consent preferences. These cookies do not
                        store any personally identifiable data.
                      </p>
                      <div className="mt-3 flex items-center">
                        <input
                          type="checkbox"
                          checked={preferences.necessary}
                          disabled
                          className="w-4 h-4 rounded border-gray-600 bg-[#1a2a4a] text-[#FFBF3C] focus:ring-[#FFBF3C] cursor-not-allowed"
                        />
                        <label className="ml-2 text-sm text-gray-300">
                          Always Active
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Analytics Cookies */}
                <div onClick={() => toggleCategory("analytics")} className="bg-[#979EF3]/10 border border-[#909291]/24 p-4 rounded-xl overflow-hidden cursor-pointer">
                  <button
                    onClick={() => toggleCategory("analytics")}
                    className={`w-full flex items-center justify-between transition-all ease-in-out duration-500 cursor-pointer 
                      ${
                        expandedCategory === "analytics"
                          ? "text-[#FFBF3C] font-semibold"
                          : "text-[#F2F2F2] font-normal"
                      }`}
                  >
                    <span>Analytics</span>
                    {expandedCategory === "analytics" ? (
                      <FiChevronUp className="text-[#FFBF3C]" />
                    ) : (
                      <FiChevronDown className="text-[#FAD892]" />
                    )}
                  </button>
                  {expandedCategory === "analytics" && (
                    <div className={`mt-2.5 verflow-hidden transition-all duration-300 ease-out
                      ${expandedCategory === "analytics" ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
                    `}>
                      <p className="text-white text-sm leading-relaxed mb-3">
                        Analytics cookies help us understand how visitors interact
                        with our website by collecting and reporting information
                        anonymously.
                      </p>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={preferences.analytics}
                          onChange={(e) =>
                            handlePreferenceChange("analytics", e.target.checked)
                          }
                          className="w-4 h-4 rounded border-gray-600 bg-[#1a2a4a] text-[#FFBF3C] focus:ring-[#FFBF3C] cursor-pointer"
                        />
                        <label className="ml-2 text-sm text-gray-300">
                          Enable Analytics Cookies
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Performance Cookies */}
                <div onClick={() => toggleCategory("performance")} className="bg-[#979EF3]/10 border border-[#909291]/24 p-4 rounded-xl overflow-hidden cursor-pointer">
                  <button
                    onClick={() => toggleCategory("performance")}
                    className={`w-full flex items-center justify-between transition-all ease-in-out duration-500 cursor-pointer 
                      ${
                        expandedCategory === "performance"
                          ? "text-[#FFBF3C] font-semibold"
                          : "text-[#F2F2F2] font-normal"
                      }`}
                  >
                    <span>Performance</span>
                    {expandedCategory === "performance" ? (
                      <FiChevronUp className="text-[#FFBF3C]" />
                    ) : (
                      <FiChevronDown className="text-[#FAD892]" />
                    )}
                  </button>
                  {expandedCategory === "performance" && (
                    <div className={`mt-2.5 verflow-hidden transition-all duration-300 ease-out
                      ${expandedCategory === "performance" ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
                    `}>
                      <p className="text-white text-sm leading-relaxed mb-3">
                        Performance cookies allow us to improve the website's
                        functionality and performance by collecting information
                        about how visitors use the site.
                      </p>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={preferences.performance}
                          onChange={(e) =>
                            handlePreferenceChange("performance", e.target.checked)
                          }
                          className="w-4 h-4 rounded border-gray-600 bg-[#1a2a4a] text-[#FFBF3C] focus:ring-[#FFBF3C] cursor-pointer"
                        />
                        <label className="ml-2 text-sm text-gray-300">
                          Enable Performance Cookies
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Advertisement Cookies */}
                <div onClick={() => toggleCategory("advertisement")} className="bg-[#979EF3]/10 border border-[#909291]/24 p-4 rounded-xl overflow-hidden cursor-pointer">
                  <button
                    onClick={() => toggleCategory("advertisement")}
                    className={`w-full flex items-center justify-between transition-all ease-in-out duration-500 cursor-pointer 
                      ${
                        expandedCategory === "advertisement"
                          ? "text-[#FFBF3C] font-semibold"
                          : "text-[#F2F2F2] font-normal"
                      }`}
                  >
                    <span>Advertisement</span>
                    {expandedCategory === "advertisement" ? (
                      <FiChevronUp className="text-[#FFBF3C]" />
                    ) : (
                      <FiChevronDown className="text-[#FAD892]" />
                    )}
                  </button>
                  {expandedCategory === "advertisement" && (
                    <div className={`mt-2.5 verflow-hidden transition-all duration-300 ease-out
                      ${expandedCategory === "advertisement" ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
                    `}>
                      <p className="text-white text-sm leading-relaxed mb-3">
                        Advertisement cookies are used to deliver personalized
                        advertisements and track the effectiveness of our
                        advertising campaigns.
                      </p>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={preferences.advertisement}
                          onChange={(e) =>
                            handlePreferenceChange(
                              "advertisement",
                              e.target.checked
                            )
                          }
                          className="w-4 h-4 rounded border-gray-600 bg-[#1a2a4a] text-[#FFBF3C] focus:ring-[#FFBF3C] cursor-pointer"
                        />
                        <label className="ml-2 text-sm text-gray-300">
                          Enable Advertisement Cookies
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-between flex-wrap md:flex-nowrap gap-2 md:gap-4 pt-2.5">
            <button
              onClick={handleRejectAll}
              className="flex-auto order-1 text-center px-6 py-2.5 bg-[#082457]/50 hover:bg-[#DBF262] text-sm md:text-base text-white hover:text-[#536109] rounded-full font-normal cursor-pointer transition-all ease-in-out duration-500"
            >
              Reject All
            </button>
            <button
              onClick={handleSavePreferences}
              className="w-full md:w-auto md:flex-auto order-3 md:order-2 text-center px-6 py-2.5 bg-[#082457]/50 hover:bg-[#DBF262] text-sm md:text-base text-white hover:text-[#536109] rounded-full font-normal cursor-pointer transition-all ease-in-out duration-500"
            >
              Save My Preferences
            </button>
            <button
              onClick={handleAcceptAll}
              className="flex-auto order-2 md:order-3 text-center px-6 py-2.5 bg-[#DBF262] hover:bg-[#FFBF3C] text-sm md:text-base text-[#536109] hover:text-black rounded-full font-normal cursor-pointer transition-all ease-in-out duration-500"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
      )}
    </>
  );
};

export default CookieConsent;
