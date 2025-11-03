import { FaMapMarkerAlt } from "react-icons/fa";

function LocationButton({ onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`mt-2 flex items-center justify-center gap-2 rounded-lg px-5 py-3 font-medium transition focus:outline-none
        ${
          active
            ? "bg-green-900 text-white shadow-lg hover:bg-green-800 border border-green-400"
            : "bg-gray-500 text-black hover:bg-gray-400"
        }`}
    >
      <FaMapMarkerAlt className="text-lg" />
      {active ? "🗺Remove Current Location" : "Select Current Location"}
    </button>
  );
}

export default LocationButton;
