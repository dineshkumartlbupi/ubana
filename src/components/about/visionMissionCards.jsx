import React from "react";
import { visionMissionData } from "../../static/aboutData";
const VisionMissionCard = ({ item, index }) => (
  <div className={`w-full md:w-1/2 flex-auto  mt-0 md:mt-24 ${ 
    index === 0 ? 'pr-0 md:pr-2' : 'pl-0 md:pl-2'
  }`}>
    <div className={`${item.bgColor} text-white rounded-lg p-6 shadow-lg w-full h-full flex flex-col justify-between`}>
      <div className="">
        <div className="flex items-center gap-2.5 mb-4">
          <img
            src={item.icon}
            alt={item.alt}
            decoding="async"
            className="w-6 h-6"
          />
          <span className="text-xl font-medium capitalize">
            {item.type}
          </span>
        </div>
        <h2 className="text-[30px] md:text-[3rem] font-medium leading-tight my-8 md:my-15 whitespace-pre-line">
          {item.title}
        </h2>
      </div>
      <p className="text-base font-normal text-white">
        {item.description}
      </p>
    </div>
  </div>
);
function AboutUsVisionMission() {
  return (
    <div className="about-us-vision-mission-wrapper w-full">
      <div className="flex flex-col md:flex-row items-stretch justify-center xl:max-w-[91%] 2xl:max-w-[100%] mx-auto mt-15 md:mt-0 gap-8 md:gap-0">
        {visionMissionData.map((item, index) => (
          <VisionMissionCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </div>
  );
}
export default AboutUsVisionMission;