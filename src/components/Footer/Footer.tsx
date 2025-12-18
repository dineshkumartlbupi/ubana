import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ButtonArrow from "../buttonArrow";
import ButtonNormal from "../buttonNormal";
import RegisterModal from "../Registermodel";
const Footer = () => {
  const [openModal, setOpenModal] = useState(false);
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  return (
    <footer className="relative bg-white md:p-3 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}      
        whileInView={{ opacity: 1, y: 0 }}    
        transition={{ duration: 0.4, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.1 }}  
        className="relative rounded-2xl md:rounded-3xl mx-auto pt-2.5 md:pt-3 pb-9 lg:pb-5 px-4 sm:px-3 z-1 bg-[#000724]">
        <div className="bg-[#040018] rounded-lg md:rounded-3xl relative xl:h-155 2xl:h-160 px-4 pt-12 pb-8 md:py-16.5 mb-14 overflow-hidden"
          style={{
            boxShadow: "0 591.715px 165.68px 0 rgba(99, 74, 191, 0.00), 0 378.698px 151.273px 0 rgba(99, 74, 191, 0.03), 0 213.017px 127.605px 0 rgba(99, 74, 191, 0.11), 0 94.674px 94.674px 0 rgba(99, 74, 191, 0.19), 0 23.669px 52.483px 0 rgba(99, 74, 191, 0.22)"
          }}
        >
          <div className="text-center mb-35 xl:mb-40 px-8 md:px-0">
            <div className="flex justify-center mb-12 md:mb-16.5">
              <img
                className="h-19 md:h-31 transition duration-300"
                src="/assets/images/footer-halo-icon.svg"
                alt="halo icon"
              />
            </div>
            <h2 className="text-4xl lg:text-[4rem] leading-12 font-medium bg-clip-text! text-transparent"
              style={{
                background: "linear-gradient(180deg, #5523B1 0%, #A983F0 100%)"
              }} 
            >See HALO in Action</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-6 relative z-10">
            <ButtonArrow
              onClick={() => {setOpenModal(true);}}
              text="Book a Free Demo"
              bgColor="#FFBF3C"
              hoverColor="#1269CD"
              textColor="#000"
              hoverTextColor="#fff"
              padding="pl-4 py-1 pr-1 w-full md:w-auto"
              rounded="rounded-full"
              textSize="text-base"
            />
            <ButtonArrow
              to="/faq"
              text="See FAQ"
              bgColor="rgba(48, 23, 138, 0.5)"
              hoverColor="#1269CD"
              textColor="#FBFBFB"
              hoverTextColor="#fff"
              padding="pl-4 py-1 pr-1 w-full md:w-auto"
              rounded="rounded-full"
              textSize="text-base"
            />
          </div>
          <div className="absolute bottom-34 lg:bottom-0 left-0 w-full h-[25%] lg:h-[270px] xl:h-[54%] bg-[url('/assets/images/footer-globe-btm.svg')] bg-[center_105%] lg:bg-bottom bg-no-repeat bg-cover"></div>
        </div>
        <div className="flex flex-wrap px-0 sm:px-3 lg:px-5 xl:px-6 2xl:px-16">
          <div className="w-full sm:w-1/5 mb-16 md:mb-0">
            <div className="flex">
              <img
                className="h-26.5 transition duration-300"
                src="/color-logo.svg"
                alt="ubona logo footer"
              />
            </div>
            <p className="my-7 md:my-6.5 text-sm text-white font-medium capitalize">
              Superior Customer Experience through Intelligent Communication
            </p>
            <ul className="flex items-center gap-1.5">
              <li>
                <Link to="https://www.instagram.com/halobyubona?igsh=MXA4NDNvNnR6bWMzNw==" target="_blanks" aria-label="facebook" className="group flex items-center justify-center w-10 md:w-7.5 h-10 md:h-7.5 bg-[#fff]/10 hover:bg-[#1269CD] backdrop-blur-sm rounded-full transition-all ease-in-out duration-500">
                  <svg className="group-hover:animate-bounce" xmlns="http://www.w3.org/2000/svg" width="14" height="13" viewBox="0 0 14 13" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M4.42161 0.0769083C5.07688 0.0467426 5.2858 0.0400391 6.95497 0.0400391C8.62415 0.0400391 8.83307 0.0473012 9.48778 0.0769083C10.1425 0.106515 10.5894 0.210978 10.9804 0.362366C11.3899 0.517105 11.7614 0.75899 12.0686 1.07182C12.3815 1.3785 12.6228 1.74943 12.777 2.15946C12.9289 2.5505 13.0328 2.9974 13.063 3.65099C13.0931 4.30738 13.0999 4.5163 13.0999 6.18492C13.0999 7.85353 13.0926 8.06301 13.063 8.71828C13.0334 9.37187 12.9289 9.81877 12.777 10.2098C12.6227 10.6199 12.381 10.9914 12.0686 11.2986C11.7614 11.6114 11.3899 11.8527 10.9804 12.0069C10.5894 12.1589 10.1425 12.2628 9.4889 12.2929C8.83307 12.3231 8.62415 12.3298 6.95497 12.3298C5.2858 12.3298 5.07688 12.3225 4.42161 12.2929C3.76802 12.2633 3.32112 12.1589 2.93008 12.0069C2.52003 11.8527 2.1485 11.6109 1.84132 11.2986C1.52881 10.9916 1.28691 10.6203 1.13242 10.2104C0.981036 9.81933 0.877132 9.37243 0.846966 8.71884C0.8168 8.06246 0.810097 7.85353 0.810097 6.18492C0.810097 4.5163 0.817359 4.30682 0.846966 3.65211C0.876573 2.9974 0.981036 2.5505 1.13242 2.15946C1.28707 1.74951 1.52917 1.37817 1.84188 1.07126C2.14868 0.758822 2.51982 0.516923 2.92952 0.362366C3.32056 0.210978 3.76802 0.107074 4.42161 0.0769083ZM9.4375 1.18299C8.7895 1.15338 8.5951 1.14723 6.95441 1.14723C5.31373 1.14723 5.11933 1.15338 4.47133 1.18299C3.87192 1.21036 3.5468 1.31035 3.33006 1.39471C3.04348 1.50643 2.83846 1.63882 2.62339 1.8539C2.41934 2.05209 2.26242 2.29359 2.1642 2.56056C2.07985 2.7773 1.97986 3.10242 1.95249 3.70183C1.92288 4.34983 1.91673 4.54423 1.91673 6.18492C1.91673 7.8256 1.92288 8.02 1.95249 8.668C1.97986 9.26741 2.07985 9.59253 2.1642 9.80928C2.26252 10.0757 2.4195 10.3176 2.62339 10.5159C2.82171 10.7198 3.06359 10.8768 3.33006 10.9751C3.5468 11.0595 3.87192 11.1595 4.47133 11.1868C5.11933 11.2165 5.31317 11.2226 6.95441 11.2226C8.59566 11.2226 8.7895 11.2165 9.4375 11.1868C10.0369 11.1595 10.362 11.0595 10.5788 10.9751C10.8654 10.8634 11.0704 10.731 11.2854 10.5159C11.4893 10.3176 11.6463 10.0757 11.7446 9.80928C11.829 9.59253 11.929 9.26741 11.9563 8.668C11.986 8.02 11.9921 7.8256 11.9921 6.18492C11.9921 4.54423 11.986 4.34983 11.9563 3.70183C11.929 3.10242 11.829 2.7773 11.7446 2.56056C11.6329 2.27398 11.5005 2.06897 11.2854 1.8539C11.0872 1.64985 10.8457 1.49292 10.5788 1.39471C10.362 1.31035 10.0369 1.21036 9.4375 1.18299ZM6.16955 8.07921C6.60788 8.26168 7.09596 8.28631 7.55043 8.14889C8.0049 8.01147 8.39756 7.72053 8.66136 7.32576C8.92515 6.931 9.0437 6.45689 8.99678 5.98443C8.94985 5.51196 8.74034 5.07044 8.40405 4.73528C8.18967 4.52104 7.93045 4.35699 7.64506 4.25495C7.35967 4.15291 7.05521 4.11541 6.75359 4.14516C6.45197 4.17491 6.16069 4.27116 5.90074 4.427C5.64078 4.58283 5.41861 4.79436 5.25022 5.04635C5.08183 5.29835 4.9714 5.58456 4.92689 5.88435C4.88239 6.18415 4.9049 6.49009 4.99283 6.78014C5.08075 7.07019 5.23188 7.33714 5.43536 7.56177C5.63883 7.7864 5.88958 7.96312 6.16955 8.07921ZM4.72159 3.95153C5.01488 3.65824 5.36307 3.42559 5.74628 3.26686C6.12948 3.10813 6.5402 3.02643 6.95497 3.02643C7.36975 3.02643 7.78047 3.10813 8.16367 3.26686C8.54688 3.42559 8.89507 3.65824 9.18836 3.95153C9.48165 4.24482 9.7143 4.59301 9.87303 4.97622C10.0318 5.35942 10.1135 5.77014 10.1135 6.18492C10.1135 6.59969 10.0318 7.01041 9.87303 7.39362C9.7143 7.77682 9.48165 8.12501 9.18836 8.4183C8.59603 9.01063 7.79266 9.3434 6.95497 9.3434C6.11729 9.3434 5.31392 9.01063 4.72159 8.4183C4.12926 7.82597 3.79649 7.0226 3.79649 6.18492C3.79649 5.34723 4.12926 4.54386 4.72159 3.95153ZM10.814 3.49681C10.8866 3.42825 10.9448 3.3458 10.9851 3.25435C11.0253 3.1629 11.0468 3.06431 11.0483 2.9644C11.0497 2.8645 11.0311 2.76532 10.9935 2.67273C10.956 2.58015 10.9002 2.49604 10.8296 2.42539C10.7589 2.35474 10.6748 2.29898 10.5822 2.26142C10.4896 2.22386 10.3905 2.20526 10.2906 2.20671C10.1907 2.20817 10.0921 2.22966 10.0006 2.2699C9.90916 2.31015 9.82672 2.36833 9.75816 2.44101C9.62482 2.58236 9.55182 2.77011 9.55465 2.9644C9.55748 3.1587 9.63592 3.34424 9.77333 3.48164C9.91073 3.61904 10.0963 3.69749 10.2906 3.70032C10.4849 3.70315 10.6726 3.63015 10.814 3.49681Z" fill="white"/>
                  </svg>
                </Link>
              </li>
              {/* <li>
                <Link to="/" target="_blanks" aria-label="twitter" className="group flex items-center justify-center w-10 md:w-7.5 h-10 md:h-7.5 bg-[#fff]/10 hover:bg-[#1269CD] backdrop-blur-sm rounded-full transition-all ease-in-out duration-500">
                  <svg className="group-hover:animate-bounce" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <g clipPath="url(#clip0_2721_12)">
                      <path d="M8.30509 5.92804L13.4048 0H12.1964L7.76825 5.14724L4.23153 0H0.152344L5.50056 7.78354L0.152344 14H1.36089L6.03709 8.56434L9.77212 14H13.8513L8.30479 5.92804H8.30509ZM6.64982 7.85211L6.10793 7.07705L1.79635 0.909771H3.6526L7.1321 5.88696L7.67399 6.66202L12.1969 13.1316H10.3407L6.64982 7.85241V7.85211Z" fill="white"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_2721_12">
                        <rect width="14" height="14" fill="white"/>
                      </clipPath>
                    </defs>
                  </svg>
                </Link>
              </li> */}
              <li>
                <Link to="https://www.linkedin.com/company/ubona/" target="_blanks" aria-label="instagram" className="group flex items-center justify-center w-10 md:w-7.5 h-10 md:h-7.5 bg-[#fff]/10 hover:bg-[#1269CD] backdrop-blur-sm rounded-full transition-all ease-in-out duration-500">
                  <svg className="group-hover:animate-bounce" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M4.56693 4.3224H6.84914V5.45921C7.17789 4.80539 8.02097 4.21794 9.28743 4.21794C11.7153 4.21794 12.2917 5.51943 12.2917 7.90733V12.3298H9.83371V8.45115C9.83371 7.09129 9.50496 6.32441 8.66802 6.32441C7.50726 6.32441 7.02488 7.15089 7.02488 8.45053V12.3298H4.56693V4.3224ZM0.352161 12.2253H2.81011V4.21794H0.352161V12.2253ZM3.16221 1.60698C3.16231 1.81301 3.12145 2.01699 3.04201 2.20708C2.96258 2.39718 2.84615 2.56959 2.6995 2.71429C2.55242 2.86061 2.37795 2.97651 2.18605 3.05538C1.99416 3.13425 1.7886 3.17453 1.58114 3.17393C1.16304 3.17299 0.761972 3.00819 0.463998 2.7149C0.317934 2.56967 0.201939 2.39706 0.122648 2.20695C0.0433571 2.01684 0.00232644 1.81296 0.00190353 1.60698C0.00190353 1.19098 0.167815 0.792787 0.464613 0.499062C0.761842 0.20465 1.16339 0.0396555 1.58175 0.0400397C2.00083 0.0400397 2.40271 0.205337 2.6995 0.499062C2.9963 0.792787 3.16221 1.19098 3.16221 1.60698Z" fill="white"/>
                  </svg>
                </Link>
              </li>  
              <li>
                <Link to="https://www.facebook.com/share/16GNphLEsD/?mibextid=wwXIfr" target="_blanks" aria-label="linkedin" className="group flex items-center justify-center w-10 md:w-7.5 h-10 md:h-7.5 bg-[#fff]/10 hover:bg-[#1269CD] backdrop-blur-sm rounded-full transition-all ease-in-out duration-500">
                  <svg className="group-hover:animate-bounce" xmlns="http://www.w3.org/2000/svg" width="10" height="16" viewBox="0 0 10 16" fill="none">
                    <path d="M3.42993 15.2447V9.55607H1.25759C1.1448 9.55607 1.03664 9.51116 0.956885 9.43123C0.877133 9.3513 0.832329 9.24289 0.832329 9.12985V6.87988C0.832329 6.76684 0.877133 6.65843 0.956885 6.57849C1.03664 6.49856 1.1448 6.45366 1.25759 6.45366H3.42134V4.27564C3.36958 3.75913 3.43128 3.23753 3.6021 2.74747C3.77292 2.25741 4.04872 1.81077 4.41013 1.43893C4.77153 1.0671 5.20979 0.77907 5.6941 0.59509C6.17842 0.411109 6.69705 0.335634 7.21358 0.373966H9.02386C9.13772 0.373743 9.2471 0.418388 9.32841 0.498271C9.40972 0.578154 9.45643 0.686871 9.45848 0.800968V2.70605C9.45603 2.81995 9.40916 2.92835 9.32792 3.00802C9.24668 3.08769 9.13752 3.1323 9.02386 3.13227H7.89243C6.67049 3.13227 6.43562 3.71256 6.43562 4.56578V6.45287H9.34066C9.40103 6.45087 9.46112 6.46207 9.51674 6.4857C9.57236 6.50933 9.62218 6.54482 9.66273 6.5897C9.70327 6.63458 9.73358 6.68778 9.75154 6.74559C9.76949 6.8034 9.77466 6.86444 9.7667 6.92445L9.50374 9.18303C9.49057 9.28647 9.44001 9.38149 9.36164 9.4501C9.28327 9.5187 9.18253 9.55612 9.07848 9.55528H6.45357V15.2439C6.45504 15.3445 6.43637 15.4442 6.39865 15.5374C6.36093 15.6305 6.30493 15.7151 6.23398 15.7861C6.16302 15.8572 6.07856 15.9132 5.9856 15.9509C5.89263 15.9886 5.79306 16.0073 5.69278 16.0057H4.18135C4.08186 16.006 3.9833 15.9864 3.89142 15.9482C3.79955 15.9099 3.7162 15.8537 3.64625 15.7828C3.5763 15.7118 3.52114 15.6277 3.484 15.5352C3.44686 15.4427 3.42848 15.3444 3.42993 15.2447Z" fill="white"/>
                  </svg>
                </Link>    
              </li>
            </ul>
          </div>
          <div className="w-full sm:w-4/5 flex items-start flex-wrap md:justify-end gap-13 md:gap-25">
            <div className="w-full sm:max-w-max text-left sm:text-left">
              <p className="text-2xl md:text-xl leading-5 font-medium text-white mb-6">Solutions</p>
              <ul className="">
                <li className="mb-4.5">
                  <Link to="/our-solutions/halo-genie" className={`text-lg md:text-sm font-medium tracking-[0.064px] transition-all ease-in-out duration-500 ${isActive("/our-solutions/genie") ? "text-[#FFBF3C] opacity-100" : "text-[#fff] md:opacity-70 hover:text-[#FFBF3C] hover:opacity-100"}`}>
                    HALO Genie
                  </Link>
                </li>
                <li className="mb-4.5">
                  <Link to="/our-solutions/halo-connect" className={`text-lg md:text-sm font-medium tracking-[0.064px] transition-all ease-in-out duration-500 ${isActive("/our-solutions/connect") ? "text-[#FFBF3C] opacity-100" : "text-[#fff] md:opacity-70 hover:text-[#FFBF3C] hover:opacity-100"}`}>
                    HALO Connect
                  </Link>
                </li>
                <li className="md:mb-4.5">
                  <Link to="/our-solutions/halo-speech" className={`text-lg md:text-sm font-medium tracking-[0.064px] transition-all ease-in-out duration-500 ${isActive("/our-solutions/speech") ? "text-[#FFBF3C] opacity-100" : "text-[#fff] md:opacity-70 hover:text-[#FFBF3C] hover:opacity-100"}`}>
                    HALO Speech
                  </Link>
                </li>
              </ul>
            </div>
            <div className="w-full sm:max-w-max text-left sm:text-left">
              <p className="text-2xl md:text-xl leading-5 font-medium text-white mb-6">Company</p>
              <ul className="">
                <li className="mb-4.5">
                  <Link to="/about-us" className={`text-lg md:text-sm font-medium tracking-[0.064px] transition-all ease-in-out duration-500 ${isActive("/about-us") ? "text-[#FFBF3C] opacity-100" : "text-[#fff] md:opacity-70 hover:text-[#FFBF3C] hover:opacity-100"}`}>
                    About Us
                  </Link>
                </li>
                <li className="mb-4.5">
                  <Link to="/careers" className={`text-lg md:text-sm font-medium tracking-[0.064px] transition-all ease-in-out duration-500 ${isActive("/careers") ? "text-[#FFBF3C] opacity-100" : "text-[#fff] md:opacity-70 hover:text-[#FFBF3C] hover:opacity-100"}`}>
                    Careers
                  </Link>
                </li>
                <li className="mb-4.5">
                  <Link to="/contact-us" className={`text-lg md:text-sm font-medium tracking-[0.064px] transition-all ease-in-out duration-500 ${isActive("/contact") ? "text-[#FFBF3C] opacity-100" : "text-[#fff] md:opacity-70 hover:text-[#FFBF3C] hover:opacity-100"}`}>
                    Contact Us
                  </Link>
                </li>
                <li className="md:mb-4.5">
                  <Link to="/faq" className={`text-lg md:text-sm font-medium tracking-[0.064px] transition-all ease-in-out duration-500 ${isActive("/contact") ? "text-[#FFBF3C] opacity-100" : "text-[#fff] md:opacity-70 hover:text-[#FFBF3C] hover:opacity-100"}`}>
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div className="w-full sm:max-w-max text-left sm:text-left">
              <p className="text-2xl md:text-xl leading-5 font-medium text-white mb-6">Resources</p>
              <ul className="">
                <li className="mb-4.5">
                  <Link to="/blogs" className={`text-lg md:text-sm font-medium tracking-[0.064px] transition-all ease-in-out duration-500 ${isActive("/blogs") ? "text-[#FFBF3C] opacity-100" : "text-[#fff] md:opacity-70 hover:text-[#FFBF3C] hover:opacity-100"}`}>
                    Blogs
                  </Link>
                </li>
                <li className="mb-4.5">
                  <Link to="/case-studies" className={`text-lg md:text-sm font-medium tracking-[0.064px] transition-all ease-in-out duration-500 ${isActive("/case-studies") ? "text-[#FFBF3C] opacity-100" : "text-[#fff] md:opacity-70 hover:text-[#FFBF3C] hover:opacity-100"}`}>
                    Case Studies
                  </Link>
                </li>
                <li className="md:mb-4.5">
                  <Link to="/news" className={`text-lg md:text-sm font-medium tracking-[0.064px] transition-all ease-in-out duration-500 ${isActive("/news") ? "text-[#FFBF3C] opacity-100" : "text-[#fff] md:opacity-70 hover:text-[#FFBF3C] hover:opacity-100"}`}>
                    In the News
                  </Link>
                </li>
              </ul>
            </div>
            <div className="w-65 sm:max-w-53.5 flex flex-wrap gap-x-3.5 gap-y-5">
              <div className="">
                <img
                  className="h-15 transition duration-300"
                  src="/assets/images/aicpa-soc.webp"
                  alt="aicpa soc logo"
                />
              </div>
              <div className="">
                <img
                  className="h-15 transition duration-300"
                  src="/assets/images/dpdpa-compliant.webp"
                  alt="dpdpa compliant logo"
                />
              </div>
              <div className="">
                <img
                  className="h-15 transition duration-300"
                  src="/assets/images/rbi-sar-dl.webp"
                  alt="rbi sar dl logo"
                />
              </div>
              <div className="">
                <img
                  className="h-15 transition duration-300"
                  src="/assets/images/iso-9001.webp"
                  alt="tuv sud iso 9001 logo"
                />
              </div>
              <div className="">
                <img
                  className="h-15 transition duration-300"
                  src="/assets/images/pci-dss.webp"
                  alt="pci dss logo"
                />
              </div>
              <div className="">
                <img
                  className="h-15 transition duration-300"
                  src="/assets/images/iso-27017.webp"
                  alt="tuv sud iso 27017 logo"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-11 md:mt-17 border-t border-t-white py-5 mx-0 sm:mx-3 lg:mx-5 xl:mx-6 2xl:mx-16 flex flex-wrap justify-between">
          <div className="mb-2.5 md:mb-0">
            <p className="text-base text-white/70 font-normal">© 2025 Ubona. All Rights Reserved.</p>
          </div>
          <ul className="flex items-center flex-wrap gap-2.5 md:gap-4">
            <li className="w-full md:w-auto">
              <Link
                className={`text-base font-normal transition-all ease-in-out duration-300 ${isActive("/privacy-policy") ? "text-[#FFBF3C] opacity-100" : "text-white opacity-70 hover:text-[#FFBF3C] hover:opacity-100"}`}
                to="/privacy-policy"
              >
                Privacy Policy
              </Link>
            </li>
            {/* <li className="w-full md:w-auto">
              <Link
                className={`text-base font-normal transition-all ease-in-out duration-300 ${isActive("/terms-and-conditions") ? "text-[#FFBF3C] opacity-100" : "text-white opacity-70 hover:text-[#FFBF3C] hover:opacity-100"}`}
                to="/terms-and-conditions"
              >
                Terms & Conditions
              </Link>
            </li> */}
          </ul>
        </div>
        {/* <p className="text-[1.75rem]  sm:text-[3.25rem] md:text-[4.25rem] xl:text-[7.5rem] 2xl:text-[8.95rem] text-white/40 font-extrabold text-center tracking-[0.23px] sm:tracking-[-1.23px] md:tracking-[-1.23px] xl:tracking-[-4.23px]">DEFINING THE FUTURE</p> */}
      </motion.div>
      {/* Modal */}
        <RegisterModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      />
    </footer>
  );
};
export default Footer;