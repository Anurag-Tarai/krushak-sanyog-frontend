import React from "react";
import { useNavigate } from "react-router-dom";
import "../comp_css/Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { DoubleArrowDownIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from "@radix-ui/react-icons";

const Navbar = () => {
  const iconstyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };
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
    navigate("/product"); // Navigate to the product page
  };

  const handleAuctionProductClick = ()=>{
    navigate("/auction");
  }

  return (
    <nav className="navbar">
      <div className="logo">
        <h3
          onClick={() => {
            navigate("/");
          }}
        >
          କୃଷକ ସଂଯୋଗ 
        </h3>
      </div>

      <div className="iconbutton">
      <button
          style={iconstyle}
          onClick={handleAuctionProductClick} // New button to explore products
          className="explore-products-button bg-transparent"
        >
          Explore Auctions
        </button>
        <button
          style={iconstyle}
          onClick={handleProductsClick} // New button to explore products
          className="explore-products-button bg-transparent"
        >
          Explore Products
        </button>

        <button
          style={iconstyle}
          onClick={handleCartClick}
          className="cart-button"
        >
          <FontAwesomeIcon icon={faCartShopping} className="cart-icon" />
          Cart
        </button>

        {userId ? (
          <>
            <button
              style={iconstyle}
              className="login-button"
              onClick={() => {
                navigate("/user/order-details");
              }}
            >
              <FontAwesomeIcon icon={faUser} className="cart-icon" />
              {name}
            </button>
            <button onClick={handleLogoutClick} className="bg-red-500">Logout</button>
          </>
        ) : (
          <>
            <button
              style={iconstyle}
              className="login-button"
              onClick={handleLoginClick}
            >
              <FontAwesomeIcon icon={faUser} className="cart-icon" />
              Login
            </button>
          </>
        )}

        {/* Conditionally render Farmer Login Button */}
        {!userId && (
          <button
            className="iconbutton"
            onClick={() => {
              console.log("Navigating to farmer login..."); // Add log to confirm click
              navigate("/farmer-register");
            }}
          >
            Get Started As Farmer
            <DoubleArrowRightIcon/>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
