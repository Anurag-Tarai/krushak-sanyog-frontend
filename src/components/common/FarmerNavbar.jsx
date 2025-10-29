import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faBars,
  faTimes,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import appLogo from "../../assets/appLogo2.png";
import MessageToast from "../common/MessageToast"; // ✅ Import Toast

const FarmerNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [logoutStatus, setLogoutStatus] = useState("");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    status: "info",
  });
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const name = localStorage.getItem("name") || "Farmer";

  // Scroll effect for navbar darkening
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toast Handler
  const showToast = (message, status = "info", duration = 3000) => {
    setToast({ show: true, message, status });
    setTimeout(() => setToast({ show: false, message: "", status: "info" }), duration);
  };

  const handleLogoutConfirmed = async () => {
    setLogoutStatus("Processing logout...");
    showToast("Logging out...", "processing", 2000);
    await new Promise((res) => setTimeout(res, 1000));
    localStorage.clear();
    setLogoutStatus("Logout successful!");
    showToast("Logout successful!", "success", 2500);
    await new Promise((res) => setTimeout(res, 700));
    setShowLogoutConfirm(false);
    navigate("/");
  };

  return (
    <>
      {/* ✅ Message Toast */}
      <MessageToast
        show={toast.show}
        onClose={() => setToast({ show: false })}
        message={toast.message}
        status={toast.status}
        duration={3000}
      />

      {/* ✅ NAVBAR */}
      <nav
        className={`fixed top-0 left-0 w-full z-[9999] transition-all duration-500 ${
          scrolled
            ? "bg-gray-950/70 backdrop-blur-md border-b border-gray-800/70 shadow-[0_0_25px_rgba(255,255,255,0.06)]"
            : "bg-gray-900/50 backdrop-blur-md border-b border-gray-800/60 shadow-[0_0_15px_rgba(255,255,255,0.04)]"
        }`}
      >
        {/* subtle glowing green line */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-500/40 to-transparent" />

        <div className="flex items-center justify-between h-16 px-4 md:px-10 relative z-10">
          {/* LOGO */}
          <div
            onClick={() => navigate("/farmer/dashboard")}
            className="flex items-center cursor-pointer transition-transform duration-300 hover:scale-105"
          >
            <img
              src={appLogo}
              alt="Farmer Connect"
              className="h-28 w-auto object-contain brightness-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.08)]"
            />
          </div>

          {/* TITLE */}
          <div className="hidden md:flex items-center justify-center text-center">
            <button
              className="text-lg font-semibold text-gray-200 tracking-wide relative after:content-[''] after:block after:w-0 hover:after:w-full after:h-[1px] after:bg-green-400 after:transition-all after:duration-300"
              onClick={() => navigate("/farmer/dashboard")}
            >
              Farmer Dashboard
            </button>
          </div>

          {/* USER DROPDOWN */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-200 relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:text-green-400 transition-all "
            >
              <FontAwesomeIcon icon={faUserCircle} className="text-gray-300 text-lg" />
              <span className="font-medium relative hover:text-green-400 transition duration-300 after:content-[''] after:block after:w-0 
                         hover:after:w-full after:h-[1px] after:bg-green-400 after:transition-all after:duration-300">{name}</span>
            </button>

            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute top-12 right-0 bg-gray-900/80 backdrop-blur-md border border-gray-800/70 rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.08)] p-3 w-44 text-gray-200 text-sm animate-fadeIn">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setTimeout(() => {
                      navigate("/farmer/account");
                    }, 500);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-800/60 transition duration-200"
                >
                  Account Details
                </button>
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setShowLogoutConfirm(true);
                  }}
                  className="w-full text-left mt-1 rounded-lg bg-red-800/40 border border-red-700/50 text-gray-200 px-4 py-2 hover:bg-red-700/30 flex items-center justify-between transition"
                >
                  <span>Logout</span>
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </button>
              </div>
            )}
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden bg-gray-800/60 hover:bg-gray-700/60 text-gray-300 text-xl p-2 rounded-md transition-all border border-gray-700"
          >
            {isMenuOpen ? (
              <FontAwesomeIcon icon={faTimes} />
            ) : (
              <FontAwesomeIcon icon={faBars} />
            )}
          </button>
        </div>

        {/* MOBILE MENU */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-900/90 backdrop-blur-md border-t border-gray-800/70 text-gray-100 flex flex-col space-y-3 p-4 shadow-[0_0_15px_rgba(255,255,255,0.08)]">
            <div className="flex items-center gap-2 text-gray-300 mb-2">
              <FontAwesomeIcon icon={faUserCircle} className="text-lg" />
              <span className="font-medium">{name}</span>
            </div>

            <button
              onClick={() => {
                setIsMenuOpen(false);
                showToast("Opening Account Details...", "info");
                navigate("/farmer/account");
              }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-800/60 transition duration-200"
            >
              Account Details
            </button>

            <button
              onClick={() => {
                setIsMenuOpen(false);
                setShowLogoutConfirm(true);
              }}
              className="w-full text-left mt-1 rounded-lg bg-red-800/40 border border-red-700/50 text-gray-200 px-4 py-2 hover:bg-red-700/30 flex items-center justify-between transition"
            >
              <span>Logout</span>
              <FontAwesomeIcon icon={faSignOutAlt} />
            </button>
          </div>
        )}
      </nav>

      {/* ✅ LOGOUT CONFIRM MODAL */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[10000] animate-fadeIn">
          <div className="bg-gray-900/80 border border-gray-800/70 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.08)] p-6 w-80 text-center text-gray-200">
            <h3 className="text-lg font-semibold text-gray-100 mb-3">
              Confirm Logout
            </h3>
            {logoutStatus ? (
              <p className="text-sm text-gray-400 animate-pulse">
                {logoutStatus}
              </p>
            ) : (
              <p className="text-sm text-gray-400 mb-4">
                Are you sure you want to log out?
              </p>
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
                  className="px-4 py-2 bg-red-800/60 hover:bg-red-700/50 rounded-lg border border-red-600/50 
           text-gray-200 shadow-[0_0_10px_rgba(220,38,38,0.3)] hover:shadow-[0_0_14px_rgba(220,38,38,0.4)] 
           transition-all duration-300"

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
