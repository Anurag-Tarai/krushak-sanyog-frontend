import { useState, useEffect } from "react";

const ImageSlider = ({ images = [] }) => {
  // ✅ All hooks first
  const [current, setCurrent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState({});

  // ✅ Only run if there are images
  useEffect(() => {
    if (!images.length) return;

    let mounted = true;
    setIsLoading(true);

    const img = new Image();
    img.src = images[current];
    img.onload = () => {
      if (!mounted) return;
      setLoadedImages((prev) => ({ ...prev, [current]: true }));
      setIsLoading(false);
    };
    img.onerror = () => {
      if (!mounted) return;
      setLoadedImages((prev) => ({ ...prev, [current]: false }));
      setIsLoading(false);
    };

    return () => {
      mounted = false;
    };
  }, [current, images]);

  // ✅ Early return AFTER all hooks declared
  if (!images || images.length === 0) return null;

  const nextSlide = () => {
    setIsLoading(true);
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setIsLoading(true);
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentImageLoaded = !!loadedImages[current];

  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl">
      {/* 🌿 Loading overlay until next image fully loads */}
      <div className="relative w-full h-full">
        {!currentImageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-sm animate-pulse z-10">
            Loading image...
          </div>
        )}

        <img
          src={images[current]}
          alt={`Slide ${current + 1}`}
          loading="lazy"
          className={`w-full h-full object-cover rounded-xl transition-all duration-700 ease-in-out ${
            isLoading ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
          onLoad={() => setIsLoading(false)}
          onError={(e) => {
            e.target.src = "/placeholder.jpg";
            setIsLoading(false);
          }}
        />
      </div>

      {/* Controls */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition"
          >
            ❮
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition"
          >
            ❯
          </button>

          {/* Dots */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            {images.map((_, index) => (
              <div
                key={index}
                onClick={() => {
                  setIsLoading(true);
                  setCurrent(index);
                }}
                className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-300 ${
                  index === current ? "bg-white" : "bg-white/40"
                }`}
              ></div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageSlider;
