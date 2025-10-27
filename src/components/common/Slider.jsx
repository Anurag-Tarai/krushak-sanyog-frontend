import React, { useState, useEffect } from "react";
import "../../styles/components/Slider.css"; // Import your CSS styles

const Slider = ({ images, interval }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Set a valid interval time (minimum of 100ms)
    const validInterval = Math.max(interval, 100);

    // Set up the interval
    const slideInterval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, validInterval);

    // Cleanup function to clear the interval on unmount or dependency change
    return () => clearInterval(slideInterval);
  }, [images, interval]);

  return (
    <div className="slider">
      <img
        key={currentIndex}
        src={images[currentIndex]}
        alt={`Slide ${currentIndex}`}
      />
    </div>
  );
};

export default Slider;
