import React from "react";
import ScrollReveal from "../animation/ScrollReveal";
import { ScrollCards } from "../../static/homeData";
function OutComes() {
  return (
    <div className="px-4 xl:px-12 2xl:px-22">
      <ScrollReveal cards={ScrollCards} />
    </div>
  );
}
export default OutComes;