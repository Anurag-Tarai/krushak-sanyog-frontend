import { useEffect, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa"; // Install react-icons if not already

function LocationButton({onClick}) {
  const [selected, setSelected] = useState(false);

  const handleToggleLocation = () => {
    setSelected((prev) => !prev);
    onClick()
    // Handle location logic here
  };


  return (
    <button
      onClick={handleToggleLocation}
      className={`mt-2 flex items-center justify-center gap-2 rounded-lg px-5 py-3 transition duration-0 focus:outline-none 
        ${selected ? "bg-green-400 text-black shadow-lg  hover:bg-green-400" : "bg-white text-black hover:bg-white focus:ring focus:ring-white"}
      `}
    >
      <FaMapMarkerAlt className="text-lg" />
      {selected ? "Selected" : "Current Location"}
    </button>
  );
}

export default LocationButton;
