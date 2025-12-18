import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const VideoCard = () => {
  const [play, setPlay] = useState(false);
  const videoRef = useRef(null);

  const videoUrl = "https://deorcw9qk0e0g.cloudfront.net/videos/Ubona%20Promo%20(%20Final%20Video%20).mp4";

  // Optional: your own custom thumbnail
  const thumbnail = "/assets/images/home/ubona-bnr-thumb.webp"; 
  // If you don't have a thumbnail, I can generate one automatically.

  // 👇 Auto-pause when video goes out of view
  useEffect(() => {
    if (!play || !videoRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          videoRef.current.pause();
        }
      },
      { threshold: 0.3 } // video must be at least 30% visible to keep playing
    );

    observer.observe(videoRef.current);

    return () => observer.disconnect();
  }, [play]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="pt-20 md:pt-32 px-4 xl:px-12 2xl:px-22 pb-20 md:pb-22">

        <div className="relative h-48 md:h-[504px] 2xl:h-[580px] bg-[#021E37] border border-white rounded-2xl overflow-hidden">

          {/* Thumbnail */}
          {!play && (
            <motion.img
              key="thumbnail"
              src={thumbnail}
              alt="Video thumbnail"
              className="absolute inset-0 w-full h-full object-cover rounded-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            />
          )}

          {/* Overlay + Play button */}
          {!play && (
            <motion.div
              key="overlay"
              className="absolute inset-0 bg-black/50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <button
                onClick={() => setPlay(true)}
                className="w-14 md:w-20 h-14 md:h-20 rounded-full bg-white cursor-pointer flex items-center justify-center shadow-xl hover:scale-110 transition duration-300"
              >
                <svg className="w-7 md:w-10 h-7 md:h-10" width="40" height="40" viewBox="0 0 24 24" fill="black">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </motion.div>
          )}

          {/* Video */}
          <AnimatePresence>
            {play && (
              <motion.video
                key="video"
                ref={videoRef} 
                src={videoUrl}
                controls
                autoPlay
                className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              />
            )}
          </AnimatePresence>

        </div>

      </div>
    </motion.div>
  );
};

export default VideoCard;