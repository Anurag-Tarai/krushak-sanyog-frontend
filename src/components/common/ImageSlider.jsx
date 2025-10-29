import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ImageSlider = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0)
    return (
      <div className="w-full h-[300px] bg-gray-800 flex items-center justify-center text-gray-500 rounded-xl">
        No Images
      </div>
    );

  return (
    <div className="relative flex items-center gap-4">
      {/* LEFT THUMBNAILS (no scroll) */}
      <div className="hidden md:flex flex-col gap-2">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 transition-all focus:outline-none ${
              i === currentIndex
                ? "ring-2 ring-green-500 scale-105"
                : "opacity-80 hover:opacity-100"
            }`}
            aria-label={`View image ${i + 1}`}
          >
            <img
              src={img}
              alt={`thumb-${i}`}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </button>
        ))}
      </div>

      {/* MAIN IMAGE */}
      <div className="relative w-full h-[300px] aspect-[4/3] flex items-center justify-center overflow-hidden rounded-xl bg-gray-900">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`slide-${currentIndex}`}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="w-full h-full object-contain"
            draggable={false}
          />
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
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 backdrop-blur-md"
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              onClick={() =>
                setCurrentIndex((prev) => (prev + 1) % images.length)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 backdrop-blur-md"
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
                    ? "bg-green-500 scale-110"
                    : "bg-gray-600 hover:bg-gray-500"
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
