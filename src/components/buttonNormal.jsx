import { useState } from "react";
import { Link } from "react-router-dom";

const ButtonNormal = ({
  to = "#",                   // link route
  text = "Click Me",          // button text
  icon = null,                // pass any JSX icon
  iconMail = null,            // pass any JSX icon
  bgColor = "#3BB67A",        // default background
  hoverColor = "#ACEF40",     // bubble/hover color
  textColor = "#fff",         // text color
  hoverTextColor = "#000",    // hover text color
  padding = "px-5 py-3",      // dynamic spacing (Tailwind classes)
  rounded = "rounded-md",     // rounded style
  textSize = "text-sm",       // text size
  stroke = "#fff",            // svg color
  hoverStroke = "#000",       // svg hover color
  onClick = null,             // onClick handler
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

  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick(e);
    }
  };

  return (
    <Link
      to={to}
      onClick={handleClick}
      onMouseEnter={handleEnter}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      className={`relative flex items-center justify-center gap-2.5 ${padding} ${textSize} font-normal ${rounded} leading-[34px] border border-[#F2F2F2]/30 overflow-hidden group transition-all ease-in-out duration-500`}
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
      {icon && (
        <span className="relative z-10">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M17.5 15V12.5C17.5 12.3342 17.4342 12.1753 17.3169 12.0581C17.1997 11.9408 17.0408 11.875 16.875 11.875C16.7092 11.875 16.5503 11.9408 16.4331 12.0581C16.3158 12.1753 16.25 12.3342 16.25 12.5V15C16.25 15.1658 16.1842 15.3247 16.0669 15.4419C15.9497 15.5592 15.7908 15.625 15.625 15.625H4.375C4.20924 15.625 4.05027 15.5592 3.93306 15.4419C3.81585 15.3247 3.75 15.1658 3.75 15V12.5C3.75 12.3342 3.68415 12.1753 3.56694 12.0581C3.44973 11.9408 3.29076 11.875 3.125 11.875C2.95924 11.875 2.80027 11.9408 2.68306 12.0581C2.56585 12.1753 2.5 12.3342 2.5 12.5V15C2.5 15.4973 2.69754 15.9742 3.04917 16.3258C3.40081 16.6775 3.87772 16.875 4.375 16.875H15.625C16.1223 16.875 16.5992 16.6775 16.9508 16.3258C17.3025 15.9742 17.5 15.4973 17.5 15ZM13.5125 11.7375L10.3875 14.2375C10.2772 14.3247 10.1406 14.3721 10 14.3721C9.85937 14.3721 9.72284 14.3247 9.6125 14.2375L6.4875 11.7375C6.37364 11.63 6.30426 11.4837 6.2931 11.3275C6.28195 11.1714 6.32982 11.0167 6.42725 10.8941C6.52468 10.7715 6.66457 10.69 6.81924 10.6656C6.97392 10.6412 7.1321 10.6758 7.2625 10.7625L9.375 12.45V3.75C9.375 3.58424 9.44085 3.42527 9.55806 3.30806C9.67527 3.19085 9.83424 3.125 10 3.125C10.1658 3.125 10.3247 3.19085 10.4419 3.30806C10.5592 3.42527 10.625 3.58424 10.625 3.75V12.45L12.7375 10.7625C12.8004 10.7031 12.875 10.6574 12.9565 10.6283C13.0381 10.5993 13.1247 10.5874 13.211 10.5936C13.2974 10.5998 13.3815 10.6238 13.458 10.6642C13.5346 10.7045 13.6019 10.7603 13.6558 10.8281C13.7096 10.8958 13.7488 10.974 13.7709 11.0577C13.7929 11.1414 13.7974 11.2288 13.7839 11.3143C13.7704 11.3998 13.7394 11.4815 13.6926 11.5544C13.6459 11.6272 13.5846 11.6896 13.5125 11.7375Z" fill="white"/>
          </svg>
        </span>
      )}
      {iconMail && (
        <span className="relative z-10">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M11.6714 12.2536C11.1739 12.5853 10.5959 12.7606 10 12.7606C9.40414 12.7606 8.82617 12.5853 8.32859 12.2536L0.133164 6.78977C0.0876953 6.75945 0.0433984 6.72785 0 6.69535V15.6484C0 16.6748 0.833008 17.4895 1.84113 17.4895H18.1588C19.1853 17.4895 20 16.6565 20 15.6484V6.69531C19.9565 6.72789 19.9121 6.75957 19.8665 6.78992L11.6714 12.2536Z" fill="#000B15"/>
            <path d="M0.783203 5.81414L8.97863 11.278C9.28887 11.4848 9.64441 11.5882 9.99996 11.5882C10.3555 11.5882 10.7111 11.4848 11.0214 11.278L19.2168 5.81414C19.7072 5.48738 20 4.94051 20 4.35027C20 3.33539 19.1743 2.50977 18.1595 2.50977H1.84051C0.825664 2.5098 0 3.33543 0 4.35125C0 4.94051 0.292812 5.48738 0.783203 5.81414Z" fill="#000B15"/>
          </svg>
        </span>
      )}
      {/* Content */}
      <span
        className="relative flex items-center gap-3 z-10 transition-all duration-500 group-hover:text-black"
        style={{ color: isHovered ? hoverTextColor : textColor }}
      >
        {text}
      </span>
    </Link>
  );
};

export default ButtonNormal;
