import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faBars,
  faTimes,
  faSignOutAlt,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import appLogo from "../../assets/appLogo2.png";

const FarmerNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [logoutStatus, setLogoutStatus] = useState("");
  const navigate = useNavigate();

  const name = localStorage.getItem("name") || "Farmer";

  const handleLogoutConfirmed = async () => {
    setLogoutStatus("Processing logout...");
    // simulate processing time
    await new Promise((res) => setTimeout(res, 1000));

    localStorage.removeItem("farmerId");
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("name");

    setLogoutStatus("Logout successful!");
    await new Promise((res) => setTimeout(res, 700));
    setShowLogoutConfirm(false);
    navigate("/");
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <>
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
            <button
              className="text-xl font-semibold text-green-400 tracking-wide 
                           relative after:content-[''] after:block after:w-0 hover:after:w-full
                           after:h-[1px] after:bg-green-400 after:transition-all after:duration-300"
              onClick={() => navigate("/farmer/dashboard")}
            >
              Farmer Dashboard
            </button>
          </div>

          {/* 👤 User dropdown */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-200 relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center bg-transparent px-3 py-1 rounded-lg transition-all duration-300 hover:text-green-400 focus:outline-none"
            >
              <FontAwesomeIcon icon={faUserCircle} className="text-green-400 mr-2 text-lg" />
              <span
                className="font-semibold text-green-400 tracking-wide 
                           relative after:content-[''] after:block after:w-0 hover:after:w-full
                           after:h-[1px] after:bg-green-400 after:transition-all after:duration-300"
              >
                {name}
              </span>
            </button>

            {/* Dropdown menu */}
            {isDropdownOpen && (
              <div
                className="absolute top-12 right-0 bg-[#0b130f]/95 border border-green-900/40 
                           rounded-xl shadow-[0_0_25px_rgba(34,197,94,0.2)] p-3 w-44 
                           text-gray-200 text-sm animate-fadeIn backdrop-blur-md"
              >
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate("/farmer/account");
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-green-800/20 transition duration-200"
                >
                  Account Details
                </button>
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setShowLogoutConfirm(true);
                  }}
                  className="w-full text-left mt-1 rounded-lg bg-red-800 border border-red-700 text-gray-200 px-4 py-2 transition shadow-md overflow-hidden hover:bg-red-700/30 flex items-center justify-between"
                >
                  <span>Logout</span>
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </button>
              </div>
            )}
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
            <div className="flex items-center justify-start text-green-400 mb-3">
              <FontAwesomeIcon icon={faUserCircle} className="mr-2 text-lg" />
              <span className="font-semibold">{name}</span>
            </div>

            <button
              onClick={() => {
                setIsMenuOpen(false);
                navigate("/farmer/account");
              }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-green-800/20 transition duration-200"
            >
              Account Details
            </button>

            <button
              onClick={() => {
                setIsMenuOpen(false);
                setShowLogoutConfirm(true);
              }}
              className="w-full text-left mt-1 rounded-lg bg-red-800 border border-red-700 text-gray-200 px-4 py-2 transition shadow-md overflow-hidden hover:bg-red-700/30 flex items-center justify-between"
            >
              <span>Logout</span>
              <FontAwesomeIcon icon={faSignOutAlt} />
            </button>
          </div>
        )}
      </nav>

      {/* ⚠️ Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[10000] animate-fadeIn">
          <div className="bg-[#0b130f] border border-green-900/50 rounded-2xl shadow-[0_0_30px_rgba(34,197,94,0.2)] p-6 w-80 text-center text-gray-200">
            <h3 className="text-lg font-semibold text-green-400 mb-3">Confirm Logout</h3>
            {logoutStatus ? (
              <p className="text-sm text-gray-400 animate-pulse">{logoutStatus}</p>
            ) : (
              <p className="text-sm text-gray-400 mb-4">Are you sure you want to log out?</p>
            )}

            {!logoutStatus && (
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogoutConfirmed}
                  className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded-lg border border-red-800 transition-all"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FarmerNavbar;
