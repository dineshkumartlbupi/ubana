import React from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const RevealParagraph = ({
  text = "This is a sample paragraph that reveals each word beautifully as you scroll.",
  mainColor = "#001B57",
  delayPerWord = 0.05,
  className = "",
}) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  React.useEffect(() => {
    if (inView) controls.start("visible");
  }, [controls, inView]);

  const words = text.split(" ");

  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: delayPerWord },
    },
  };

  const wordAnim = {
    hidden: { color: "#959595", fontWeight: 400 }, // Tailwind gray-400
    visible: { color: mainColor, fontWeight: 600, transition: { duration: 0.6 } },
  };

  return (
    <motion.div
      ref={ref}
      variants={container}
      initial="hidden"
      animate={controls}
      className={`text-lg leading-relaxed ${className}`}
    >
      {words.map((word, i) => (
        <motion.span key={i} variants={wordAnim} className="inline-block mr-1.5">
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default RevealParagraph;