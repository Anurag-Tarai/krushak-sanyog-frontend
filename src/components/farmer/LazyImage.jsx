import React, { useState } from "react";

const LazyImage = React.memo(({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative overflow-hidden rounded bg-gray-900/40">
      {!loaded && (
        <div className="absolute inset-0 bg-gray-800/60 animate-pulse rounded-xl" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={(e) => (e.target.src = "/placeholder.jpg")}
        className={`w-full h-44 object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          loaded ? "scale-100 group-hover:scale-[1.00]" : "opacity-0"
        }`}
      />
      
    </div>
  );
});

export default LazyImage;
