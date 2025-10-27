import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles/components/Slider.css";

const Slider = ({ images, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const validInterval = Math.max(interval, 100);
    const slideInterval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, validInterval);

    return () => clearInterval(slideInterval);
  }, [images, interval]);

  return (
    <div
      className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center overflow-hidden
                 rounded-3xl bg-gradient-to-tl from-[#010402] via-[#031d10] to-[#041f14]
                 border border-green-900/40 shadow-[0_0_60px_rgba(34,197,94,0.22)]
                 transition-all duration-700 hover:shadow-[0_0_90px_rgba(34,197,94,0.35)]"
    >
      {/* 🌌 Ambient gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-green-900/15 via-transparent to-black/80 opacity-80 pointer-events-none rounded-3xl" />

      {/* 🌿 Subtle top glow for depth */}
      <div className="absolute top-[-60px] right-1/3 w-[480px] h-[300px] bg-green-500/10 blur-[120px] rounded-full" />

      {/* 🎞️ Enhanced slow & deeper fade animation */}
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`Slide ${currentIndex}`}
          initial={{ opacity: 0, scale: 1.02, filter: "brightness(0.6)" }}
          animate={{ opacity: 1, scale: 1, filter: "brightness(1) " }}
          exit={{ opacity: 0, scale: 0.98, filter: "brightness(0.5)" }}
          transition={{
            duration: 3.6, // ⏳ slower, smoother fade
            ease: [0.33, 0.02, 0.16, 0.97],
          }}
          className="absolute w-auto max-w-full h-full object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.55)]"
        />
      </AnimatePresence>
    </div>
  );
};

export default Slider;
