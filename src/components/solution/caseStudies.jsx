import React, { useState } from "react";
import CaseStudies from "../caseStudies";
import { caseStudies } from "../../static/solutionData";

const HCaseStudies = () => {
  return (
    <div className="px-4 xl:px-12 2xl:px-22 pb-14">
      <CaseStudies slides={caseStudies} />
    </div>
  );
}
export default HCaseStudies;