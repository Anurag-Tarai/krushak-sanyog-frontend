import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  let userId = localStorage.getItem("userid");
  let name = localStorage.getItem("name");

  const handleLoginClick = () => navigate("/login");
  const handleLogoutClick = () => {
    localStorage.removeItem("userid");
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("cartid");
    localStorage.removeItem("name");
    alert("Logout Successfully!");
    navigate("/");
  };

  const handleCartClick = () => {
    if (!userId) {
      localStorage.setItem("lastPage", "/user/cart");
      navigate("/login");
    } else navigate("/user/cart");
  };

  const handleProductsClick = () => navigate("/product");
  const handleFarmerClick = () => navigate("/farmer/signin");
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav
      className="fixed top-0 left-0 w-full z-[9999]
                 bg-gray-900/50 backdrop-blur-md border-b border-gray-800/60
                 shadow-[0_0_25px_rgba(255,255,255,0.05)]"
    >
      {/* 💚 Thin glowing green divider */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-500/50 to-transparent blur-[1px]" />

      <div className="flex items-center justify-between h-16 px-4 md:px-10 relative z-10">
        {/* 🌾 Logo */}
        <h3
          className="flex items-center cursor-pointer transition-transform duration-300 hover:scale-105"
          onClick={() => navigate("/")}
        >
          <div className="h-10 w-36 flex items-center justify-center rounded-md bg-transparent">
            <img
              src={appLogo}
              alt="App Logo"
              className="h-28 w-full object-contain brightness-110 contrast-110 
                         drop-shadow-[0_0_10px_rgba(34,197,94,0.4)]"
            />
          </div>
        </h3>

        {/* 🖥️ Desktop Menu */}
        <div className="hidden md:flex items-center space-x-7 text-sm font-medium text-gray-200">
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
            <FontAwesomeIcon icon={faCartShopping} className="mr-2 text-green-400/80" />
            Cart
          </button>

          {userId ? (
            <>
              <button
                onClick={() => navigate("/user/profile")}
                className="relative hover:text-green-400 transition duration-300 after:content-[''] after:block after:w-0 
                           hover:after:w-full after:h-[1px] after:bg-green-400 after:transition-all after:duration-300"
              >
                <FontAwesomeIcon icon={faUser} className="mr-2 text-green-400/80" />
                {name}
              </button>
              <button
                onClick={handleLogoutClick}
                className="bg-gradient-to-r from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 
                           text-white px-4 py-1.5 rounded-lg shadow-[0_0_10px_rgba(239,68,68,0.4)] 
                           hover:shadow-[0_0_15px_rgba(239,68,68,0.6)] transition duration-300"
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
              <FontAwesomeIcon icon={faUser} className="mr-2 text-green-400/80" />
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

        {/* 📱 Mobile Menu Toggle */}
        <button
          onClick={toggleMenu}
          className="md:hidden bg-gray-800/40 hover:bg-gray-700/40 text-green-400 text-2xl p-2 rounded-lg 
                     shadow-[0_0_10px_rgba(34,197,94,0.3)] transition duration-300"
        >
          {isMenuOpen ? (
            <FontAwesomeIcon icon={faTimes} />
          ) : (
            <FontAwesomeIcon icon={faBars} />
          )}
        </button>
      </div>

      {/* 📲 Mobile Menu */}
      {isMenuOpen && (
        <div
          className="md:hidden bg-gray-900/70 backdrop-blur-md border-t border-gray-800/60 text-gray-100 
                     flex flex-col space-y-3 p-4 shadow-[0_0_20px_rgba(34,197,94,0.1)]"
        >
          <button
            onClick={handleProductsClick}
            className="hover:text-green-400 transition duration-300"
          >
            Explore Products
          </button>

          <button
            onClick={handleCartClick}
            className="flex items-center hover:text-green-400 transition duration-300"
          >
            <FontAwesomeIcon icon={faCartShopping} className="mr-2 text-green-400/80" />
            Cart
          </button>

          {userId ? (
            <>
              <button
                onClick={() => navigate("/user/profile")}
                className="flex items-center hover:text-green-400 transition duration-300"
              >
                <FontAwesomeIcon icon={faUser} className="mr-2 text-green-400/80" />
                {name}
              </button>
              <button
                onClick={handleLogoutClick}
                className="bg-gradient-to-r from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 
                           text-white px-4 py-1.5 rounded-lg shadow-md transition duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={handleLoginClick}
              className="flex items-center hover:text-green-400 transition duration-300"
            >
              <FontAwesomeIcon icon={faUser} className="mr-2 text-green-400/80" />
              Signin
            </button>
          )}

          {!userId && (
            <button
              onClick={handleFarmerClick}
              className="hover:text-green-400 transition duration-300"
            >
              Signin As Farmer
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
