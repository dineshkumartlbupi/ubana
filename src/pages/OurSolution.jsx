import React from "react";
import Banner from "../components/solution/Banner";
import LogoSliderTabs from "../components/logoSliderTabs";
// import HCaseStudies from "../components/solution/caseStudies";
import HCaseStudies from "../components/home/caseStudies";

import "../App.css";
function OurSolution() {
  return (
    <div className="">
      <Banner />
      <LogoSliderTabs />
      <HCaseStudies />
    </div>
  );
}
export default OurSolution;
