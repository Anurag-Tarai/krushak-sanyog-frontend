import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ImageSlider = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0)
    return (
      <div className="w-full h-[340px] bg-gray-900/70 border border-gray-800 rounded-2xl flex items-center justify-center text-gray-500 backdrop-blur-md">
        No Images
      </div>
    );

  return (
    <div className="relative flex items-center gap-5">
      {/* LEFT THUMBNAILS */}
      <div className="hidden md:flex flex-col gap-3">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`relative w-16 h-16 rounded-xl overflow-hidden transition-all duration-300 border ${
              i === currentIndex
                ? "border-green-500 ring-2 ring-green-500/50 scale-110 shadow-[0_0_12px_rgba(34,197,94,0.4)]"
                : "border-gray-800 hover:border-gray-700 opacity-80 hover:opacity-100"
            }`}
            aria-label={`View image ${i + 1}`}
          >
            <img
              src={img}
              alt={`thumb-${i}`}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              draggable={false}
            />
          </button>
        ))}
      </div>

      {/* MAIN IMAGE */}
      <div className="relative w-full h-[340px] aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#111] to-[#151515] border border-gray-800 shadow-[0_0_25px_rgba(0,0,0,0.6)] backdrop-blur-sm flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <img
              src={images[currentIndex]}
              alt={`slide-${currentIndex}`}
              className="max-w-full max-h-full object-contain rounded-xl"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                backgroundColor: "#0a0a0a",
              }}
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrentIndex((prev) =>
                  prev === 0 ? images.length - 1 : prev - 1
                )
              }
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-gray-950/70 hover:bg-gray-900/80 text-gray-200 rounded-full p-2.5 border border-gray-700/60 shadow-lg backdrop-blur-md transition-all hover:scale-110"
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              onClick={() =>
                setCurrentIndex((prev) => (prev + 1) % images.length)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-gray-950/70 hover:bg-gray-900/80 text-gray-200 rounded-full p-2.5 border border-gray-700/60 shadow-lg backdrop-blur-md transition-all hover:scale-110"
              aria-label="Next image"
            >
              ›
            </button>
          </>
        )}

        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === currentIndex
                    ? "bg-green-500 scale-125 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                    : "bg-gray-600/70 hover:bg-gray-500"
                }`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageSlider;
