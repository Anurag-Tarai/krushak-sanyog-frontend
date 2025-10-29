import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Dark & Grey Image Slider
 * - Left thumbnails (no scrollbar)
 * - Fixed aspect ratio main image
 * - No auto-slide
 * - Smooth fade + scale animation
 */

const ImageSlider = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-[360px] bg-gray-800 flex items-center justify-center text-gray-500 rounded-xl">
        No Images
      </div>
    );
  }

  return (
    <div className="relative flex items-center gap-5">
      {/* LEFT THUMBS - hidden on small screens */}
      <div className="hidden md:flex flex-col gap-3">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 transition-all transform ${
              i === currentIndex ? "scale-105 border border-gray-700" : "opacity-80 hover:opacity-95"
            }`}
            aria-label={`View image ${i + 1}`}
          >
            <img src={img} alt={`thumb-${i}`} className="w-full h-full object-cover" draggable={false} />
          </button>
        ))}
      </div>

      {/* MAIN IMAGE */}
      <div className="relative flex-1 bg-gray-900 rounded-xl overflow-hidden" style={{ minHeight: 360 }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`slide-${currentIndex}`}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className="w-full h-[360px] object-contain bg-gray-900"
            draggable={false}
          />
        </AnimatePresence>

        {/* nav arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrentIndex((p) => (p === 0 ? images.length - 1 : p - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-gray-800/60 hover:bg-gray-800/80 text-gray-100 rounded-full p-2"
              aria-label="Previous image"
            >
              ‹
            </button>

            <button
              onClick={() => setCurrentIndex((p) => (p + 1) % images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-gray-800/60 hover:bg-gray-800/80 text-gray-100 rounded-full p-2"
              aria-label="Next image"
            >
              ›
            </button>
          </>
        )}

        {/* dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2.5 h-2.5 rounded-full ${i === currentIndex ? "bg-gray-200" : "bg-gray-600"}`}
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
