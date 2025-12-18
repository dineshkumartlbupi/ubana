import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

// Global wrapper for lazy-loaded images
const LazyImage = ({ src, alt, className = "", effect = "blur", wrapperClassName = "", ...rest }) => {
  return (
    <LazyLoadImage
      src={src}
      alt={alt}
      effect={effect} 
      wrapperClassName={wrapperClassName}
      className={`${className} transition-all! duration-500 ease-in-out`}
      {...rest}
    />
  );
};

export default LazyImage;