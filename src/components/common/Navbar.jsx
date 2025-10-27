import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faUser, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  let userId = localStorage.getItem("userid");
  let name = localStorage.getItem("name");

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleLogoutClick = () => {
    localStorage.removeItem("userid");
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("cartid");
    localStorage.removeItem("name");

    alert("Logout Successfully.....");
    navigate("/");
  };

  const handleCartClick = () => {
    if (!userId) {
      localStorage.setItem("lastPage", "/user/cart");
      navigate("/login");
    } else {
      navigate("/user/cart");
    }
  };

  const handleProductsClick = () => {
    navigate("/product");
  };

  const handleFarmerClick = () => {
    navigate("/farmer/signin");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-green-900 text-white fixed w-full top-0 z-50">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <h3
          className="text-xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          Farmer Connect
        </h3>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4">
          <button
            className="hover:text-white transition duration-300 bg-green-900 hover:bg-green-600"
            onClick={handleProductsClick}
          >
            Explore Products
          </button>
          <button
            className="hover:text-white 
            transition duration-300 bg-green-900 hover:bg-green-600"
            onClick={handleCartClick}
          >
            <FontAwesomeIcon icon={faCartShopping} className="mr-2" />
            Cart
          </button>

          {userId ? (
            <>
              <button
                className="hover:text-white transition duration-300 bg-green-900 hover:bg-green-600"
                onClick={() => navigate("/user/profile")}
              >
                <FontAwesomeIcon icon={faUser} className="mr-2" />
                {name}
              </button>
              <button
                className="bg-red-500 hover:bg-red-600
                 text-white px-4 py-1 rounded-lg transition duration-300"
                onClick={handleLogoutClick}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              className="hover:text-white transition duration-300 bg-green-900 hover:bg-green-600"
              onClick={handleLoginClick}
            >
              <FontAwesomeIcon icon={faUser} className="mr-2" />
              Login
            </button>
          )}

          {!userId && (
            <button 
            className="hover:text-white transition duration-300 bg-green-900 hover:bg-green-600"
            onClick={handleFarmerClick}
            >
              Get Started As Farmer
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden bg-green-900 hover:bg-green-500 text-white text-2xl p-2 rounded-lg hover:text-white transition duration-300"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <FontAwesomeIcon icon={faTimes} /> : <FontAwesomeIcon icon={faBars} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-green-800 hover:bg-green-700 text-white flex flex-col space-y-2 p-4">
          <button onClick={handleProductsClick}  className="hover:text-white 
            transition duration-300 bg-green-900 hover:bg-green-600" >
              Explore Products
              </button>
          <button onClick={handleCartClick}   className="hover:text-white 
            transition duration-300 bg-green-900 hover:bg-green-600" >
            <FontAwesomeIcon icon={faCartShopping} className="mr-2" />
            Cart
          </button>

          {userId ? (
            <>
              <button onClick={() => navigate("/user/profile")} className="hover:text-white 
            transition duration-300 bg-green-900 hover:bg-green-600">
                <FontAwesomeIcon icon={faUser} className="mr-2" />
                {name}
              </button>
              <button
                 className="bg-red-500 hover:bg-red-600
                 text-white px-4 py-1 rounded-lg transition duration-300"
                onClick={handleLogoutClick}
              >
                Logout
              </button>
            </>
          ) : (
            <button onClick={handleLoginClick}  className="hover:text-white 
            transition duration-300 bg-green-900 hover:bg-green-600">
              <FontAwesomeIcon icon={faUser} className="mr-2" />
              Login
            </button>
          )}

          {!userId && (
            <button
               className="hover:text-white 
            transition duration-300 bg-green-900 hover:bg-green-600"
              onClick={handleFarmerClick}
            >
              Get Started As Farmer
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
