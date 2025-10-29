import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import useGeolocation from "../../hooks/useGeolocation";

// ✅ Fix Leaflet marker path issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const LocationMap = ({ latitude, longitude, onSelect }) => {
  const { position } = useGeolocation();
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const markerRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    // Initialize map once
    if (!initialized.current && mapContainerRef.current) {
      initialized.current = true;

      // 🗺️ Setup map
      mapRef.current = L.map(mapContainerRef.current, {
        center: [20.5937, 78.9629],
        zoom: 5,
        zoomControl: true,
      });

      // 🧩 Add OSM tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);

      // 🖱️ Click handler to select location
      mapRef.current.on("click", (e) => {
        const { lat, lng } = e.latlng;
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng]).addTo(mapRef.current);
        }
        mapRef.current.flyTo([lat, lng], 15, { duration: 0.6 });
        if (onSelect) onSelect({ lat, lng });
      });
    }
  }, [onSelect]);

  // 📍 Center to user's position initially
  useEffect(() => {
    if (position && mapRef.current) {
      const { latitude: lat, longitude: lng } = position;
      mapRef.current.flyTo([lat, lng], 13, { duration: 0.8 });
      if (!markerRef.current) {
        markerRef.current = L.marker([lat, lng])
          .addTo(mapRef.current)
          .bindPopup("📍 Your Location")
          .openPopup();
      } else {
        markerRef.current.setLatLng([lat, lng]);
      }
    }
  }, [position]);

  // 🎯 External coordinate update
  useEffect(() => {
    if (latitude && longitude && mapRef.current) {
      const newLatLng = L.latLng(latitude, longitude);
      if (!markerRef.current) {
        markerRef.current = L.marker(newLatLng)
          .addTo(mapRef.current)
          .bindPopup("📍 Selected Location")
          .openPopup();
      } else {
        markerRef.current.setLatLng(newLatLng);
      }
      mapRef.current.flyTo(newLatLng, 15, { duration: 0.6 });
    }
  }, [latitude, longitude]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-[400px] rounded-xl overflow-hidden border border-gray-700 shadow-md"
      style={{
        cursor: "grab",
        touchAction: "auto",
      }}
    />
  );
};

export default LocationMap;
