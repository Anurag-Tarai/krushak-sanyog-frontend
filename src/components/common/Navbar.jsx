import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faUser,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import appLogo from "../../assets/appLogo2.png";
import { logout } from "../../utils/logout";
import MessageToast from "./MessageToast";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
    const [toast, setToast] = useState({
      show: false,
      message: "",
      status: "info",
    });

     // Toast Handler
  const showToast = (message, status = "info", duration = 3000) => {
    setToast({ show: true, message, status });
    setTimeout(() => setToast({ show: false, message: "", status: "info" }), duration);
  };


  let name = localStorage.getItem("name");

  const closeMenu = () => setIsMenuOpen(false);

  const handleLoginClick = () => {
    closeMenu();
    navigate("/buyer/signin");
  };


  
    const handleLogoutClick = async () => {
    setShowLogoutConfirm(false);
    showToast("Logging out...", "processing", 2000);
  
    try {
      
      const res = await logout();
      if(!res) throw Error("Failed to logout")
  
      localStorage.clear();
      setToast({ show: true, message: "Logout successful!", status: "success" });
      
      // Wait a bit for toast animation
      await new Promise((res) => setTimeout(res, 700));
  
      navigate("/"); // redirect to home/login page
    } catch (err) {
      console.error(err);
      showToast("Logout failed. Please try again.", "error");
    }
  };





  const handleCartClick = () => {
    if (!name) {
      navigate("/buyer/signin");
    } else navigate("/buyer/wishlist");
    closeMenu();
  };
  const handleProductsClick = () => {
    closeMenu();
    navigate("/products");
  };
  const handleFarmerClick = () => {
    closeMenu();
    navigate("/farmer/signin");
  };

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

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
    <nav
      className="fixed top-0 left-0 w-full z-[9999]
                 bg-gray-950 border-b border-gray-800/60
                 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
    >
      {/* 💚 Thin glowing divider */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-500/50 to-transparent blur-[1px]" />

      {/* 🌾 Main Bar */}
      <div className="flex items-center justify-between h-14 px-3 md:px-8 relative z-10">
        <h3
          onClick={() => {
            closeMenu();
            navigate("/");
          }}
          className="flex items-center cursor-pointer transition-transform duration-300 hover:scale-105"
        >
          <div className="h-8 w-32 flex items-center justify-center rounded-md">
            <img
              src={appLogo}
              alt="App Logo"
              className="h-24 w-full object-contain brightness-110 contrast-110 
                         drop-shadow-[0_0_8px_rgba(34,197,94,0.35)]"
            />
          </div>
        </h3>

        {/* 🖥️ Desktop */}
        <div className="hidden md:flex items-center space-x-6 text-[15px] font-medium text-gray-200">
          <button
            onClick={handleProductsClick}
            className="relative hover:text-green-400 transition duration-300 after:content-[''] after:block after:w-0 
                       hover:after:w-full after:h-[1px] after:bg-green-400 after:transition-all after:duration-300"
          >
            Explore Products
          </button>

          <button
            onClick={handleCartClick}
            className="relative hover:text-green-400 transition duration-300 after:content-[''] after:block after:w-0 
                       hover:after:w-full after:h-[1px] after:bg-green-400 after:transition-all after:duration-300"
          >
            <FontAwesomeIcon
              icon={faCartShopping}
              className="mr-1 text-green-400/80 text-[13px]"
            />
            Wishlist
          </button>

          {name ? (
            <>
              <button
                onClick={() => navigate("/buyer/profile")}
                className="relative hover:text-green-400 transition duration-300 after:content-[''] after:block after:w-0 
                           hover:after:w-full after:h-[1px] after:bg-green-400 after:transition-all after:duration-300"
              >
                <FontAwesomeIcon
                  icon={faUser}
                  className="mr-1 text-green-400/80 text-[13px]"
                />
                {name}
              </button>
              <button
                onClick={handleLogoutClick}
                className="bg-red-700/60  hover:from-red-600 hover:to-red-400 
                           text-white px-3 py-1.5 rounded-md shadow-[0_0_8px_rgba(239,68,68,0.4)] 
                           hover:shadow-[0_0_12px_rgba(239,68,68,0.6)] transition duration-300 text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={handleLoginClick}
              className="relative hover:text-green-400 transition duration-300 after:content-[''] after:block after:w-0 
                         hover:after:w-full after:h-[1px] after:bg-green-400 after:transition-all after:duration-300"
            >
              <FontAwesomeIcon
                icon={faUser}
                className="mr-1 text-green-400/80 text-[13px]"
              />
              Sign In
            </button>
          )}

          {!name && (
            <button
              onClick={handleFarmerClick}
              className="relative hover:text-green-400 transition duration-300 after:content-[''] after:block after:w-0 
                         hover:after:w-full after:h-[1px] after:bg-green-400 after:transition-all after:duration-300"
            >
              Sign In As Farmer
            </button>
          )}
        </div>

        {/* 📱 Toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden bg-gray-800/40 hover:bg-gray-700/40 text-green-400 text-xl p-1.5 rounded-md 
                     shadow-[0_0_8px_rgba(34,197,94,0.3)] transition duration-300"
        >
          <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
        </button>
      </div>

      {/* 📲 Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? "max-h-[380px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          className="mx-3 mt-2 bg-gray-950/90 backdrop-blur-xl border border-gray-800/60
               text-gray-100 flex flex-col rounded-2xl p-4 shadow-lg shadow-green-900/10
               divide-y divide-gray-800/70 transition-all duration-300"
        >
          {/* Menu buttons */}
          <button
            onClick={handleProductsClick}
            className="py-2 text-sm font-medium text-center hover:text-green-400 transition duration-200"
          >
            Explore Products
          </button>

          <button
            onClick={handleCartClick}
            className="flex items-center justify-center gap-2 py-2 text-sm font-medium hover:text-green-400 transition duration-200"
          >
            <FontAwesomeIcon
              icon={faCartShopping}
              className="text-green-400/80 text-[13px]"
            />
            Wishlist
          </button>

          {name ? (
            <>
              <button
                onClick={() => {
                  navigate("/buyer/profile");
                  closeMenu();
                }}
                className="flex items-center justify-center gap-2 py-2 text-sm font-medium hover:text-green-400 transition duration-200"
              >
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-green-400/80 text-[13px]"
                />
                {name}
              </button>

              <button
                onClick={handleLogoutClick}
                className="mt-2 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500
                     text-white px-4 py-1.5 rounded-md shadow-md transition duration-300 text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleLoginClick}
                className="flex items-center justify-center gap-2 py-2 text-sm font-medium hover:text-green-400 transition duration-200"
              >
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-green-400/80 text-[13px]"
                />
                Sign In
              </button>

              <button
                onClick={handleFarmerClick}
                className="py-2 text-sm font-medium text-center hover:text-green-400 transition duration-200"
              >
                Sign In as Farmer
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
    </>
  );
};

export default Navbar;
