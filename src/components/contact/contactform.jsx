import { MdPerson, MdPhone, MdEmail } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";

const ContactSection = () => {
  return (
    <section className="w-full bg-[#011937] text-white py-14 px-6 md:px-12 rounded-3xl relative overflow-hidden">
      {/* Gradient background with glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#012a63] to-[#0b7dff61] opacity-95"></div>

      <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10">
        {/* Left: Form Section */}
        <div className="w-full md:w-2/3 bg-[#011d43]/80 rounded-2xl p-8 shadow-[0_0_25px_rgba(0,0,0,0.3)] backdrop-blur-md border border-[#123d6d]/40">
          <p className="text-gray-300 mb-6 text-sm md:text-base">
            Please fill out the form below and we’ll get back to you.
          </p>

          <form className="space-y-4">
            <div className="relative">
              <MdPerson className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full pl-10 pr-4 py-2.5 rounded-md bg-[#08254e] border border-[#1b437a] text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <select className="w-full md:w-1/4 bg-[#08254e] border border-[#1b437a] text-white rounded-md py-2 px-2 focus:outline-none focus:border-yellow-400">
                <option className="text-black" value="US">US</option>
                <option className="text-black" value="CA">Canada</option>
                <option className="text-black" value="IN">India</option>
              </select>

              <div className="relative w-full md:w-1/3">
                <MdPhone className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Phone Number"
                  className="w-full pl-10 pr-4 py-2.5 rounded-md bg-[#08254e] border border-[#1b437a] text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div className="relative w-full md:w-2/5">
                <MdEmail className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your work email"
                  className="w-full pl-10 pr-4 py-2.5 rounded-md bg-[#08254e] border border-[#1b437a] text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                />
              </div>
            </div>

            <textarea
              rows="3"
              placeholder="How can we assist you"
              className="w-full rounded-md bg-[#08254e] border border-[#1b437a] text-white placeholder-gray-400 p-3 focus:outline-none focus:border-yellow-400"
            ></textarea>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#f5b400] to-[#ffca28] text-black font-semibold rounded-full shadow-md hover:shadow-lg hover:from-[#ffca28] hover:to-[#f5b400] transition-all"
            >
              Submit
            </button>
          </form>

          <p className="text-xs text-gray-400 mt-5 leading-relaxed text-center md:text-left">
            We will only use your personal information as outlined in our{" "}
            <a href="#" className="text-yellow-400 hover:underline">
              Privacy Policy
            </a>
            . You can manage or withdraw your consent at any time by sending us
            an email at{" "}
            <a
              href="mailto:infoexec@ubona.com"
              className="text-yellow-400 hover:underline"
            >
              infoexec@ubona.com
            </a>
            .
          </p>
        </div>

        {/* Right: Map Section */}
        <div className="w-full md:w-1/3 flex flex-col items-center md:items-start">
          <div className="flex items-start gap-3 mb-4">
            <FaMapMarkerAlt className="text-yellow-400 text-2xl mt-1" />
            <div>
              <h3 className="font-semibold text-white">
                Ubona Technologies Pvt. Ltd.
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                #442, 1st Floor & 3rd Floor, 17th Cross, Sector 4,
                <br />
                HSR Layout, Bengaluru – 560102, India.
              </p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-lg w-full h-[250px] border border-[#123d6d]/40">
            <iframe
              title="Ubona Technologies Map"
              src="https://www.google.com/maps?q=Ubona%20Technologies%20Pvt.%20Ltd.&output=embed"
              width="100%"
              height="100%"
              allowFullScreen=""
              loading="lazy"
              className="border-0"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
