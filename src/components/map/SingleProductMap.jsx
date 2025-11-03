import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ✅ Fix default Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const SingleProductMap = ({ latitude, longitude, productName }) => {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const initialized = useRef(false);

  // 🗺️ Initialize map only once
  useEffect(() => {
    if (
      !initialized.current &&
      mapContainerRef.current &&
      latitude &&
      longitude
    ) {
      initialized.current = true;

      // Initialize map
      mapRef.current = L.map(mapContainerRef.current, {
        center: [latitude, longitude],
        zoom: 13,
        zoomControl: true,
      });

      // Use OpenStreetMap tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
      }).addTo(mapRef.current);

      // Add marker for the product
      const marker = L.marker([latitude, longitude])
        .addTo(mapRef.current)
        .bindPopup(
          `<b>${productName}</b><br>${latitude.toFixed(4)}, ${longitude.toFixed(
            4
          )}`
        )
        .openPopup();

      // Fly to the marker smoothly
      mapRef.current.flyTo([latitude, longitude], 13, { duration: 0.8 });
    }
  }, [latitude, longitude, productName]);

  // 🌐 Open in Google Maps
  const handleOpenInGoogleMaps = () => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(url, "_blank");
  };

  return (
    <div className="relative w-full">
      {/* 🗺️ Map container */}
      <div
        ref={mapContainerRef}
        className="w-full h-[400px] rounded-xl overflow-hidden border border-gray-700 shadow-md"
      />

      {/* 🌐 Open in Google Maps button */}
      <button
        onClick={handleOpenInGoogleMaps}
         className="absolute top-3 right-3 z-[1000] bg-gray-800/80 hover:bg-gray-700 text-gray-100 text-xs px-3 py-1.5 rounded-md border border-gray-700 shadow-md backdrop-blur-sm transition-all flex items-center gap-1"
      >
        View on Google Maps
      </button>
    </div>
  );
};

export default SingleProductMap;
