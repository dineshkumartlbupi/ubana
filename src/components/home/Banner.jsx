import react, { useState } from "react";
import ButtonArrow from "../buttonArrow";
import GradientText from "../animation/GradientText";
import RegisterModal from "../Registermodel";
function Banner() {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div className="banr-wrap bg-black relative h-screen md:h-[100vh] md:pt-18 overflow-hidden">
      <img
        src="/assets/images/home/h-banner.webp"
        srcSet="/assets/images/home/h-banner-mob.webp 600w,
                /assets/images/home/h-banner.webp 1200w"
        sizes="100vw"
        alt="Defining Future Banner"
        fetchPriority="high"
        decoding="async"
        className="w-full h-[1000px] md:h-full object-cover relative bottom-0 md:mb-0"
      />
      <div className="absolute left-1/2 top-1/2 -translate-1/2 w-full md:w-[70%]">
        <div className="text-center">
          <div className="flex justify-center items-center px-4 md:px-0 mb-11 md:mb-8 gap-4">
            <div className="h-[2px] w-16 md:w-28 bg-linear-to-r from-[#434343]/0 to-[#E1DD68]"></div>
            <p className="text-sm text-[#E1DD68] font-normal tracking-wider">Drive Outstanding Experience For Customers</p>
            <div className="h-[2px] w-16 md:w-28 bg-linear-to-r from-[#E1DD68] to-[#434343]/0"></div>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-6xl text-white font-extralight mb-4 px-4">Customer Experience, Perfected by AI</h1>
          <h2 className="text-3xl md:text-4xl lg:text-[4rem] leading-tight sm:leading-[78px] font-bold tracking-[0px] sm:tracking-[-0.65px] text-white px-4 md:px-0 mb-18 md:mb-14">
            <span className="bg-clip-text! text-transparent"
              style={{
                background: "linear-gradient(rgba(234, 234, 234) 66%, rgba(0, 0, 0, .5) 100%)"
              }} 
            >
              Automate. Assist. Analyze.
            </span>{" "}<br className="md:hidden" />
            <GradientText
              colors={["#FFEA60", "#A790F9", "#FFEA60", "#A790F9", "#FFEA60"]}
              animationSpeed={5}
              showBorder={false}
              className="text-3xl md:text-4xl lg:text-[4rem] leading-tight sm:leading-[78px] font-bold"
            >
              With Generative AI
            </GradientText>
          </h2> 
          <div className="flex flex-wrap justify-center gap-6 px-4">
            <ButtonArrow
              onClick={() => {setOpenModal(true);}}
              text="Book a Free Demo"
              bgColor="#FFBF3C"
              hoverColor="#1269CD"
              textColor="#000"
              hoverTextColor="#fff"
              padding="pl-4 py-1 pr-1 w-full sm:w-auto"
              rounded="rounded-full"
              textSize="text-base"
            />
            <ButtonArrow
              to="/our-solutions"
              text="View All Solutions"
              bgColor="rgba(8, 36, 87, 0.50)"
              hoverColor="#1269CD"
              textColor="#FBFBFB"
              hoverTextColor="#fff"
              padding="pl-4 py-1 pr-1 w-full sm:w-auto"
              rounded="rounded-full"
              textSize="text-base"
            />
          </div>
        </div>
      </div>
      {/* Modal */}
      <RegisterModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
}
export default Banner;