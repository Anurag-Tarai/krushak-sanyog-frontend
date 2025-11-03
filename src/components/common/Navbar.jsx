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

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  let userId = localStorage.getItem("buyerId");
  let name = localStorage.getItem("name");

  const closeMenu = () => setIsMenuOpen(false);

  const handleLoginClick = () => {
    closeMenu();
    navigate("/buyer/signin");
  };
  const handleLogoutClick = () => {
    localStorage.removeItem("buyerId");
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    alert("Logout Successfully!");
    closeMenu();
    navigate("/");
  };
  const handleCartClick = () => {
    if (!userId) {
      navigate("/buyer/signin");
    } else navigate("/buyer/cart");
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
            <FontAwesomeIcon icon={faCartShopping} className="mr-1 text-green-400/80 text-[13px]" />
            Cart
          </button>

          {userId ? (
            <>
              <button
                onClick={() => navigate("/buyer/profile")}
                className="relative hover:text-green-400 transition duration-300 after:content-[''] after:block after:w-0 
                           hover:after:w-full after:h-[1px] after:bg-green-400 after:transition-all after:duration-300"
              >
                <FontAwesomeIcon icon={faUser} className="mr-1 text-green-400/80 text-[13px]" />
                {name}
              </button>
              <button
                onClick={handleLogoutClick}
                className="bg-gradient-to-r from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 
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
              <FontAwesomeIcon icon={faUser} className="mr-1 text-green-400/80 text-[13px]" />
              Signin
            </button>
          )}

          {!userId && (
            <button
              onClick={handleFarmerClick}
              className="relative hover:text-green-400 transition duration-300 after:content-[''] after:block after:w-0 
                         hover:after:w-full after:h-[1px] after:bg-green-400 after:transition-all after:duration-300"
            >
              Signin As Farmer
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
          className="bg-gradient-to-b from-gray-900/90 to-gray-950/90 
                     backdrop-blur-lg border-t border-gray-800/60 text-gray-100 
                     flex flex-col space-y-3 p-4 shadow-[0_0_20px_rgba(34,197,94,0.08)] rounded-b-2xl"
        >
          <button
            onClick={handleProductsClick}
            className="py-1.5 text-sm font-medium hover:text-green-400 transition duration-300"
          >
            Explore Products
          </button>

          <button
            onClick={handleCartClick}
            className="flex items-center py-1.5 text-sm font-medium hover:text-green-400 transition duration-300"
          >
            <FontAwesomeIcon icon={faCartShopping} className="mr-2 text-green-400/80 text-[13px]" />
            Cart
          </button>

          <div className="h-px bg-gray-800/70 my-1" />

          {userId ? (
            <>
              <button
                onClick={() => {
                  navigate("/buyer/profile");
                  closeMenu();
                }}
                className="flex items-center py-1.5 text-sm font-medium hover:text-green-400 transition duration-300"
              >
                <FontAwesomeIcon icon={faUser} className="mr-2 text-green-400/80 text-[13px]" />
                {name}
              </button>

              <button
                onClick={handleLogoutClick}
                className="mt-2 bg-gradient-to-r from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 
                           text-white px-4 py-1.5 rounded-md shadow-md transition duration-300 text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleLoginClick}
                className="flex items-center py-1.5 text-sm font-medium hover:text-green-400 transition duration-300"
              >
                <FontAwesomeIcon icon={faUser} className="mr-2 text-green-400/80 text-[13px]" />
                Signin
              </button>

              <button
                onClick={handleFarmerClick}
                className="py-1.5 text-sm font-medium hover:text-green-400 transition duration-300"
              >
                Signin As Farmer
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
