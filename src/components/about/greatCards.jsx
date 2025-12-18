import React from "react";
import ScrollReveal from "../animation/ScrollRevealThreeCards";
import { ScrollCards } from "../../static/aboutData";
function GreatCards() {
  return (
    <div className="px-4 xl:px-12 2xl:px-22">
      <ScrollReveal cards={ScrollCards} />
    </div>
  );
}
export default GreatCards;