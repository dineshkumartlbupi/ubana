import { useState } from "react";
import { Link } from "react-router-dom";

const BubbleButton = ({
  to = "#",                   // link route
  text = "Click Me",          // button text
  icon = null,                // pass any JSX icon
  bgColor = "#3BB67A",        // default background
  hoverColor = "#ACEF40",     // bubble/hover color
  textColor = "#fff",         // text color
  hoverTextColor = "#000",    // hover text color
  padding = "px-5 py-3",      // dynamic spacing (Tailwind classes)
  rounded = "rounded-md",     // rounded style
  textSize = "text-sm",       // text size
  stroke = "#fff",            // svg color
  hoverStroke = "#000",       // svg hover color
}) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [rect, setRect] = useState(null);

  const handleEnter = (e) => {
    setRect(e.currentTarget.getBoundingClientRect());
    setIsHovered(true);
  };

  const handleLeave = () => {
    setIsHovered(false);
    setRect(null);
  };

  const handleMouse = (e) => {
    if (!rect) return;
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <Link
      to={to}
      onMouseEnter={handleEnter}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      className={`relative flex items-center justify-center ${padding} ${textSize} font-medium ${rounded} overflow-hidden group transition-all ease-in-out duration-300`}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {/* Bubble */}
      <span
        className="absolute rounded-full pointer-events-none transition-transform duration-500 ease-out"
        style={{
          width: "400px",
          height: "400px",
          top: coords.y,
          left: coords.x,
          transform: `translate(-50%, -50%) scale(${isHovered ? 1 : 0})`,
          backgroundColor: hoverColor,
        }}
      ></span>

      {/* Content */}
      <span
        className="relative flex items-center z-10 transition-all duration-500 group-hover:text-black"
        style={{ color: isHovered ? hoverTextColor : textColor }}
      >
        {text}
        <span className="ml-1.5">
          <svg
            className="group-hover:translate-x-2 transition-all ease-in-out duration-500"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              className="transition-all ease-in-out duration-500"
              d="M2.5 8H13.5"
              stroke={isHovered ? hoverStroke : stroke}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              className="transition-all ease-in-out duration-500"
              d="M9 3.5L13.5 8L9 12.5"
              stroke={isHovered ? hoverStroke : stroke}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </span>
    </Link>
  );
};

export default BubbleButton;
