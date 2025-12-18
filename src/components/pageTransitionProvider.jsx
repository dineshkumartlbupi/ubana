// PageTransitionProvider.jsx
import React, { createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

const PageTransitionContext = createContext();

export const usePageTransition = () => useContext(PageTransitionContext);

// ✨ Variant sets
const fadeVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.4, ease: "easeInOut" },
};

const slideVariant = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -40 },
  transition: { duration: 0.5, ease: "easeInOut" },
};

const zoomVariant = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.05 },
  transition: { duration: 0.5, ease: "easeInOut" },
};

// 👉 Change this to "fadeVariant", "slideVariant", or "zoomVariant"
const ACTIVE_VARIANT = zoomVariant;

export const PageTransitionProvider = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigateWithTransition = (to) => {
    navigate(to);
  };

  return (
    <PageTransitionContext.Provider value={{ navigateWithTransition }}>
      <AnimatePresence mode="wait">
        <div className="bg-[#001330]">
          <motion.div
            key={location.pathname}
            {...ACTIVE_VARIANT}
            className="min-h-screen w-full bg-white"
          >
            {children}
          </motion.div>
        </div>
      </AnimatePresence>
    </PageTransitionContext.Provider>
  );
};
