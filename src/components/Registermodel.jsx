import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MdEmail, MdPhone } from "react-icons/md";
import { FaChevronDown, FaLinkedin, FaMapMarkerAlt, FaTimes } from "react-icons/fa";
import { getCodeList } from "country-list";
import Swal from "sweetalert2";

const RegisterModal = ({ isOpen, onClose, children }) => {
  const [formData, setFormData] = useState({
    name: "",
    country: "India",
    phone: "",
    email: "",
    message: "",
  });

  const [countryCode, setCountryCode] = useState("INDIA");


  const countries = getCodeList();
  const countryArray = Object.entries(countries).sort((a, b) => {
    if (a[1] === "India") return -1;
    if (b[1] === "India") return 1;
    return a[1].localeCompare(b[1]);
  });


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.name.trim()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Full Name is required.",
        showConfirmButton: true,
      });
      return;
    }

    if (!formData.email || !formData.email.trim()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Email is required.",
        showConfirmButton: true,
      });
      return;
    }

    if (!formData.phone || !formData.phone.trim()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Phone Number is required.",
        showConfirmButton: true,
      });
      return;
    }

    const formDataToSend = {
      name: e.target[0].value,
      country: e.target[1].value,
      phone: e.target[2].value,
      email: e.target[3].value,
      message: e.target[4].value,
    };

    console.log("Sending form data:", formDataToSend);

    try {
      const API_BASE = import.meta.env.VITE_PAYLOAD_API_URL || "http://localhost:3011";
      const res = await fetch(`${API_BASE}/api/demo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formDataToSend),
      });

      const data = await res.json();
      console.log(" Response:", data);

      if (res.ok && data.success) {
        Swal.fire({
          icon: "success",
          title: "Message sent!",
          html: `<p style="font-size: 0.85rem;">Our team will contact you in a short time.</p>`,
          showConfirmButton: false,
          width: 400,
          showCloseButton: true,
          closeButtonHtml: "&times;",
          customClass: {
            popup: "rounded-xl shadow-lg",
            title: "text-green-600 text-lg",
            content: "text-gray-800",
            closeButton: "text-gray-600 hover:text-gray-800",
          },
          timer: 10000,
          timerProgressBar: true,
        });
        setFormData({
          name: "",
          country: "INDIA",
          phone: "",
          email: "",
          message: "",
        });

        e.target.reset();
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed to send",
          text: "Please try again later.",
          showConfirmButton: true,
        });
      }
    } catch (error) {
      console.error("Error while sending data:", error);
      Swal.fire({
        icon: "error",
        title: "Something went wrong!",
        text: "Please check your connection or try again later.",
        showConfirmButton: true,
      });
    }
  };

  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed top-20 md:top-24 left-0 w-full h-[calc(100vh_-_80px)] md:h-[calc(100vh_-_96px)] z-100 px-4 pb-4">
      <div className="relative w-full h-full flex flex-col items-center justify-center rounded-2xl md:rounded-3xl overflow-hidden">
        {/* Background blur */}
        <div
          className="absolute left-0 top-0 w-full h-full backdrop-blur-md"
          onClick={onClose}
          style={{
            background:
              "linear-gradient(180deg, rgba(0, 22, 44, 0.60) 28.51%, rgba(0, 58, 133, 0.60) 100%)",
          }}
        ></div>
        <button
          className="relative md:absolute top-3 right-3 md:top-6 md:right-6 flex items-center self-end justify-center w-5 md:w-6 h-5 md:h-6 rounded-full transition cursor-pointer z-20"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
            <g clip-path="url(#clip0_2462_4183)">
              <path d="M25.6131 4.39083C19.7639 -1.4584 10.2434 -1.4584 4.39416 4.39083C1.56078 7.22533 0 10.9931 0 15.0003C0 19.0074 1.56078 22.7752 4.39416 25.6086C7.31937 28.5338 11.1615 29.9958 15.0036 29.9958C18.8457 29.9958 22.6879 28.5338 25.613 25.6086C31.4623 19.7594 31.4623 10.2412 25.6131 4.39083ZM23.9698 23.9653C19.0259 28.9092 10.9813 28.9092 6.03744 23.9653C3.64339 21.5712 2.32432 18.3868 2.32432 15.0003C2.32432 11.6137 3.64339 8.42933 6.03744 6.03411C10.9813 1.09022 19.0259 1.09139 23.9698 6.03411C28.9125 10.978 28.9125 19.0225 23.9698 23.9653Z" fill="white" fill-opacity="0.7"/>
              <path d="M20.0092 18.2119L16.7191 14.9264L20.0092 11.641C20.4624 11.1877 20.4624 10.4521 20.0104 9.99764C19.556 9.54206 18.8203 9.54324 18.3659 9.99646L15.0735 13.2842L11.7811 9.99646C11.3267 9.54324 10.591 9.54206 10.1366 9.99764C9.68342 10.452 9.68342 11.1877 10.1378 11.641L13.428 14.9264L10.1378 18.2119C9.68342 18.6651 9.68342 19.4007 10.1366 19.8552C10.3633 20.0829 10.6619 20.1957 10.9595 20.1957C11.257 20.1957 11.5545 20.0818 11.7812 19.8563L15.0736 16.5685L18.366 19.8563C18.5926 20.0829 18.8901 20.1957 19.1877 20.1957C19.4852 20.1957 19.7839 20.0818 20.0105 19.8552C20.4636 19.4007 20.4636 18.6651 20.0092 18.2119Z" fill="white" fill-opacity="0.7"/>
            </g>
            <defs>
              <clipPath id="clip0_2462_4183">
                <rect width="30" height="30" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        </button>

        <div className="relative w-full max-w-2xl rounded-2xl pt-6 pb-4 md:pb-0 md:pt-0 px-2 sm:px-6 h-full md:h-auto overflow-y-auto z-10">
          <h2 className="text-xl md:text-3xl font-semibold text-center mb-2 md:mb-3 text-white">See HALO Platform in Action</h2>
          <p className="text-sm md:text-base font-normal tracking-[-0.16px] text-white/80 text-center mb-4 md:mb-6">Call <a href="tel:+91-9035063802" className="text-[#FFBF3C] font-semibold">+91-9035063802</a> or fill out the form to set up a meeting today</p>

          <div className="w-full rounded-2xl p-2.5 md:p-5"
            style={{
              background:
                "linear-gradient(180deg, #00162C 28.51%, #1269CD 100%)",
            }}
          >
              <form className="space-y-3" onSubmit={handleSubmit}>
                {/* Name Field */}
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full pl-4 py-2.5 text-sm rounded-lg bg-[#08254e] border border-[#FFFFFF33] 
                  text-white placeholder-gray-400 focus:outline-none hover:border-white"
                    required
                  />
                  {/* <span className="text-red-400 text-xs mt-1 block">* Required</span> */}
                </div>

                {/* Country + Phone + Email */}
                <div className="flex flex-col md:flex-row gap-3">

                  {/* Country Dropdown */}
                  <div className="relative w-full md:w-1/6">
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full appearance-none bg-[#08254e] border border-[#FFFFFF33] 
                    text-white py-2.5 text-sm pl-4 pr-10 rounded-lg focus:outline-none"
                    >
                      {countryArray.map(([code, name]) => (
                        <option key={code} value={code} className="text-black bg-[#fff]">
                          {name}
                        </option>
                      ))}
                    </select>

                    {/* Custom arrow */}
                      <FaChevronDown className="absolute right-3 top-6 -translate-y-1/2 pointer-events-none text-white" />
                  </div>

                  {/* Phone Field */}
                  <div className="relative w-full md:w-1/3">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone Number"
                      className="w-full pl-4 py-2.5 text-sm rounded-lg bg-[#08254e] border border-[#FFFFFF33] 
                    text-white placeholder-gray-400 focus:outline-none"
                      required
                    />
                    {/* <span className="text-red-400 text-xs mt-1 block">* Required</span> */}
                  </div>

                  {/* Email Field */}
                  <div className="relative w-full md:w-2/4">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className="w-full pl-4 py-2.5 text-sm rounded-lg bg-[#08254e] border border-[#FFFFFF33] 
                    text-white placeholder-gray-400 focus:outline-none"
                      required
                    />
                    {/* <span className="text-red-400 text-xs mt-1 block">* Required</span> */}
                  </div>
                </div>

                {/* Message Field */}
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  placeholder="How can we assist you"
                  className="w-full rounded-lg bg-[#08254e] border border-[#FFFFFF33] 
                text-white placeholder-gray-400 px-4 py-2.5 text-sm focus:outline-none"
                ></textarea>

                {/* Submit Button */}
              <button
                  type="submit"
                  className="w-full py-3 mt-3 md:mt-4 2xl:mt-6 bg-[#FFBF3C] text-[#2D2D2D] text-base font-normal 
                  rounded-full shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:text-white hover:bg-[#1269cd] cursor-pointer"
                >
                  Schedule My Free Demo
                </button>

              </form>

              <p className="text-xs text-white/80 mt-4 leading-relaxed text-center md:text-center">
                We will only use your personal information as outlined in our{" "}
                <Link to="/privacy-policy" onClick={onClose} className="text-yellow-400 hover:underline">
                  Privacy Policy
                </Link>
                .<br /> You can manage or withdraw your consent at any time by sending us
                an email at{" "}
                <Link to="mailto:network@ubona.com"
                  className="text-yellow-400 hover:underline"
                >
                  network@ubona.com
                </Link>
                .
              </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
