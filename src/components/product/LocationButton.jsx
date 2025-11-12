import { FaMapMarkerAlt } from "react-icons/fa";

function LocationButton({ onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition focus:outline-none
        ${
          active
            ? "bg-green-900 text-white shadow hover:bg-green-800 border border-green-400"
            : "bg-gray-500 text-black hover:bg-gray-400"
        }`}
    >
      <FaMapMarkerAlt className="text-sm" />
      {active ? "Remove Location" : "Select Location"}
    </button>
  );
}

export default LocationButton;
