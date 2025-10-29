import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import useGeolocation from "../../hooks/useGeolocation";

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const LocationMap = ({ latitude, longitude }) => {
  const { position, error } = useGeolocation();
  const mapRef = useRef(null);     // DOM node for the map
  const leafletMap = useRef(null); // Leaflet map instance

  useEffect(() => {
    // --- Initialize map only once ---
    if (!leafletMap.current && mapRef.current) {
      leafletMap.current = L.map(mapRef.current, {
        center: [20.5937, 78.9629], // default India center
        zoom: 5,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      }).addTo(leafletMap.current);
    }

    // --- When coordinates available, fly to location ---
    const lat = latitude || position?.latitude;
    const lng = longitude || position?.longitude;

    if (lat && lng && leafletMap.current) {
      leafletMap.current.setView([lat, lng], 13);

      L.marker([lat, lng])
        .addTo(leafletMap.current)
        .bindPopup(
          `📍 Location<br/>Lat: ${lat.toFixed(4)}<br/>Lng: ${lng.toFixed(4)}`
        )
        .openPopup();
    }

    // --- Cleanup on unmount ---
    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, [latitude, longitude, position]);

  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div
      ref={mapRef}
      style={{
        height: "400px",
        width: "100%",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    />
  );
};

export default LocationMap;
