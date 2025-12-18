import React from "react";

const GradientText = ({
  children,
  colors = ["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"],
  animationSpeed = 6,
  showBorder = false,
  className = "",
}) => {
  // Create gradient string from colors array
  const gradientColors = colors.join(", ");

  return (
    <span
      className={`inline-block ${className}`}
      style={{
        position: "relative",
      }}
    >
      <span
        style={{
          background: `linear-gradient(to right, ${gradientColors})`,
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
          animation: `gradient-animation ${animationSpeed}s ease infinite`,
        }}
      >
        {children}
      </span>
      {showBorder && (
        <span
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(to right, ${gradientColors})`,
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
            animation: `gradient-animation ${animationSpeed}s ease infinite`,
            filter: "blur(10px)",
            opacity: 0.5,
            zIndex: -1,
          }}
        >
          {children}
        </span>
      )}
      <style>
        {`
          @keyframes gradient-animation {
            0% {
              background-position: 0% center;
            }
            50% {
              background-position: 100% center;
            }
            100% {
              background-position: 0% center;
            }
          }
        `}
      </style>
    </span>
  );
};

export default GradientText;

