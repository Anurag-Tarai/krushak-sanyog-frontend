import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBars, faTimes, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import appLogo from "../../assets/appLogo2.png";

const FarmerNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const name = localStorage.getItem("name") || "Farmer";

  const handleLogoutClick = () => {
    localStorage.removeItem("farmerId");
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("name");
    alert("Logout Successfully!");
    navigate("/");
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav
      className="fixed top-0 left-0 w-full z-[9999] backdrop-blur-xl border-b border-green-800/20 
                 bg-[#020b06]/95 shadow-[0_0_25px_rgba(0,0,0,0.4)]"
    >
      {/* 🌿 Subtle green gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-700/10 to-transparent pointer-events-none" />

      {/* 🌱 Thin glowing line under navbar */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-500/50 to-transparent blur-[1px]" />

      <div className="flex items-center justify-between h-16 px-4 md:px-10 relative z-10">
        {/* 🌾 Logo */}
        <h3
          className="flex items-center cursor-pointer transition-transform duration-300 hover:scale-105"
          onClick={() => navigate("/farmer/dashboard")}
        >
          <div className="h-10 w-36 flex items-center justify-center rounded-md bg-transparent">
            <img
              src={appLogo}
              alt="Farmer Connect"
              className="h-full w-full object-cover brightness-110 contrast-110 
                         drop-shadow-[0_0_12px_rgba(34,197,94,0.4)]"
            />
          </div>
        </h3>

        {/* 🌾 Center Title */}
        <div className="hidden md:flex items-center justify-center text-center">
          <h1 className="text-xl font-semibold text-green-400 tracking-wide 
                         relative after:content-[''] after:block after:w-0 hover:after:w-full
                         after:h-[1px] after:bg-green-400 after:transition-all after:duration-300">
            Farmer Dashboard
          </h1>
        </div>

        {/* 👤 Right section (User + Logout) */}
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-200">
          <div className="flex items-center bg-transparent px-3 py-1 rounded-lg transition-all duration-300 hover:text-green-400">
            <FontAwesomeIcon icon={faUser} className="text-green-400 mr-2" />
            <span className="font-semibold text-gray-100">{name}</span>
          </div>
          <button
            onClick={handleLogoutClick}
            className="bg-gradient-to-r from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 
                       text-white px-4 py-1.5 rounded-lg shadow-[0_0_10px_rgba(239,68,68,0.4)] 
                       hover:shadow-[0_0_15px_rgba(239,68,68,0.6)] transition duration-300 flex items-center"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
            Logout
          </button>
        </div>

        {/* 📱 Mobile Menu Toggle */}
        <button
          onClick={toggleMenu}
          className="md:hidden bg-green-900/10 hover:bg-green-800/20 text-green-400 text-2xl p-2 rounded-lg 
                     shadow-[0_0_12px_rgba(34,197,94,0.3)] transition duration-300"
        >
          {isMenuOpen ? <FontAwesomeIcon icon={faTimes} /> : <FontAwesomeIcon icon={faBars} />}
        </button>
      </div>

      {/* 📲 Mobile Menu */}
      {isMenuOpen && (
        <div
          className="md:hidden bg-[#010805]/95 border-t border-green-900/40 text-gray-100 flex flex-col space-y-3 p-4 
                     shadow-[0_0_25px_rgba(34,197,94,0.2)]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center text-green-400">
              <FontAwesomeIcon icon={faUser} className="mr-2" />
              <span>{name}</span>
            </div>
            <button
              onClick={handleLogoutClick}
              className="bg-gradient-to-r from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 
                         text-white px-4 py-1 rounded-lg shadow-md transition duration-300 text-sm flex items-center"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
              Logout
            </button>
          </div>

          {/* Centered Title */}
          <div className="text-center text-green-400 text-lg font-semibold mt-3">
            Farmer Dashboard
          </div>
        </div>
      )}
    </nav>
  );
};

export default FarmerNavbar;
