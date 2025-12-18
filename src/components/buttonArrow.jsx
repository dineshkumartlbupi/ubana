import { useState } from "react";
import { Link } from "react-router-dom";

const ButtonArrow = ({
  to = "#",    // link route
  onClick = null,               
  text = "Click Me",          // button text
  icon = null,                // pass any JSX icon
  bgColor = "#3BB67A",        // default background
  hoverColor = "#ACEF40",     // bubble/hover color
  textColor = "#fff",         // text color
  hoverTextColor = "#000",    // hover text color
  padding = "px-5 py-3",      // dynamic spacing (Tailwind classes)
  rounded = "rounded-md",     // rounded style
  textSize = "text-sm",       // text size
  borderColor= "border-white/20", // border color
  stroke = "#fff",            // svg color
  hoverStroke = "#000",       // svg hover color
  className=""
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
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={handleEnter}
        onMouseMove={handleMouse}
        onMouseLeave={handleLeave}
        className={`relative flex items-center justify-center cursor-pointer ${padding} ${textSize} font-normal ${rounded} leading-[34px] border ${borderColor} overflow-hidden group transition-all ease-in-out duration-500 ${className}`}
        style={{ backgroundColor: bgColor, color: textColor }}
      >
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
          className="relative flex items-center justify-center w-full gap-3 z-10 transition-all duration-500 group-hover:text-black"
          style={{ color: isHovered ? hoverTextColor : textColor }}
        >
          {text}
          <span className="absolute right-0 md:static md:w-0 w-8.5 md:h-0 h-8.5 group-hover:w-8.5 group-hover:h-8.5 bg-[#001935]/50 rounded-full backdrop-blur-md flex items-center justify-center scale-100 md:scale-0 group-hover:scale-100 transition-all duration-500 ease-in-out">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="17" viewBox="0 0 18 17" fill="none">
              <path d="M16.1938 8.12561L11.3915 3.32329C11.2621 3.19832 11.0888 3.12917 10.9089 3.13073C10.7291 3.1323 10.557 3.20445 10.4298 3.33165C10.3026 3.45884 10.2304 3.63091 10.2289 3.81079C10.2273 3.99067 10.2965 4.16397 10.4214 4.29336L14.0527 7.9246H1.98787C1.80591 7.9246 1.63142 7.99688 1.50276 8.12554C1.3741 8.2542 1.30182 8.4287 1.30182 8.61065C1.30182 8.7926 1.3741 8.9671 1.50276 9.09576C1.63142 9.22442 1.80591 9.2967 1.98787 9.2967H14.0527L10.4214 12.9279C10.3559 12.9912 10.3036 13.0669 10.2677 13.1506C10.2317 13.2343 10.2128 13.3244 10.212 13.4154C10.2112 13.5065 10.2286 13.5969 10.2631 13.6812C10.2976 13.7655 10.3485 13.8421 10.4129 13.9065C10.4773 13.9709 10.5539 14.0219 10.6383 14.0564C10.7226 14.0909 10.8129 14.1082 10.904 14.1074C10.9951 14.1066 11.0851 14.0877 11.1688 14.0518C11.2525 14.0158 11.3282 13.9635 11.3915 13.898L16.1938 9.09568C16.3224 8.96703 16.3947 8.79256 16.3947 8.61065C16.3947 8.42873 16.3224 8.25427 16.1938 8.12561Z" fill="white"/>
            </svg>
          </span>
        </span>
      </button>
    );
  }
  return (
    <Link
      to={to}
      onMouseEnter={handleEnter}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      className={`relative flex items-center justify-center ${padding} ${textSize} font-normal ${rounded} leading-[34px] border ${borderColor} overflow-hidden group transition-all ease-in-out duration-500`}
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
        className="relative flex items-center justify-center w-full gap-3 z-10 transition-all duration-500 group-hover:text-black"
        style={{ color: isHovered ? hoverTextColor : textColor }}
      >
        {text}
        <span className="absolute right-0 md:static md:w-0 w-8.5 md:h-0 h-8.5 group-hover:w-8.5 group-hover:h-8.5 bg-[#001935]/50 rounded-full backdrop-blur-md flex items-center justify-center scale-100 md:scale-0 group-hover:scale-100 transition-all duration-500 ease-in-out">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="17" viewBox="0 0 18 17" fill="none">
            <path d="M16.1938 8.12561L11.3915 3.32329C11.2621 3.19832 11.0888 3.12917 10.9089 3.13073C10.7291 3.1323 10.557 3.20445 10.4298 3.33165C10.3026 3.45884 10.2304 3.63091 10.2289 3.81079C10.2273 3.99067 10.2965 4.16397 10.4214 4.29336L14.0527 7.9246H1.98787C1.80591 7.9246 1.63142 7.99688 1.50276 8.12554C1.3741 8.2542 1.30182 8.4287 1.30182 8.61065C1.30182 8.7926 1.3741 8.9671 1.50276 9.09576C1.63142 9.22442 1.80591 9.2967 1.98787 9.2967H14.0527L10.4214 12.9279C10.3559 12.9912 10.3036 13.0669 10.2677 13.1506C10.2317 13.2343 10.2128 13.3244 10.212 13.4154C10.2112 13.5065 10.2286 13.5969 10.2631 13.6812C10.2976 13.7655 10.3485 13.8421 10.4129 13.9065C10.4773 13.9709 10.5539 14.0219 10.6383 14.0564C10.7226 14.0909 10.8129 14.1082 10.904 14.1074C10.9951 14.1066 11.0851 14.0877 11.1688 14.0518C11.2525 14.0158 11.3282 13.9635 11.3915 13.898L16.1938 9.09568C16.3224 8.96703 16.3947 8.79256 16.3947 8.61065C16.3947 8.42873 16.3224 8.25427 16.1938 8.12561Z" fill="white"/>
          </svg>
        </span>
      </span>
    </Link>
  );
};

export default ButtonArrow;
