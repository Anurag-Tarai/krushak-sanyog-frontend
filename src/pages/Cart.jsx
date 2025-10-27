import React, { useState, useEffect } from "react";
import api from "../Router/api";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const [cartData, setCartData] = useState({});
  const cartId = localStorage.getItem("cartid"); // Make sure cartId is retrieved correctly

  // Fetch cart data when cartId changes
  useEffect(() => {
    if (cartId) {
      fetchCartData();
    }
  }, [cartId]); // Dependency array ensures this effect runs when cartId changes

  const fetchCartData = () => {
    console.log("fetching cart data");

    api
      .get(`/ecom/cart/products/${cartId}`)
      .then((response) => {
        setCartData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data from the API: ", error);
      });
  };

  // Remove product from cart
  const removeProductFromCart = (productId) => {
    api
      .delete(`/ecom/cart/remove-product/${cartId}/${productId}`)
      .then(() => {
        fetchCartData(); // Refresh cart data after removing a product
      })
      .catch((error) => {
        console.error("Error removing product from cart: ", error);
      });
  };

  // Handle viewing product details
  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`); // Dynamically pass productId
  };

  return (
    <div className="cart-page">
      {cartData.cartItems?.length > 0 ? (
        <div className="cart-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cartData.cartItems.map((item) => (
            <div
              className="product-card w-98 border border-b-slate-600 rounded-lg shadow-lg p-3 bg-white transition-shadow duration-200 hover:shadow-xl"
              key={item.product.productId}
            >
              <div className="product-image mb-2 overflow-hidden rounded-lg">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-full h-40 object-cover" // Reduced image height
                />
              </div>
              <div className="product-info">
                <h2 className="text-xl font-bold text-green-700 mb-1">
                  {item.product.name}
                </h2>
                <p className="text-gray-600 text-sm">
                  <strong>Category:</strong>{" "}
                  <span className="text-green-500">{item.product.category}</span>
                </p>
                <p className="text-gray-600 text-sm">
                  <strong>Description:</strong>{" "}
                  {item.product.description.length > 25
                    ? `${item.product.description.substring(0, 25)}...`
                    : item.product.description}
                </p>
                <p className="text-gray-600 text-sm">
                  <strong>Address:</strong>{" "}
                  {item.product.address?
              `${item.product.address?.substring(0, 25)}...`
                    : "Not Available"}
                </p>
                <h2 className="product-price text-lg font-bold text-green-600 mt-2">
                  Available quantity: {item.product.price} kg
                </h2>

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => removeProductFromCart(item.product.productId)}
                    className="bg-red-700 text-white rounded px-4 py-2 hover:bg-red-600 transition shadow-md hover:shadow-lg"
                  >
                    Remove from Cart
                  </button>
                  <button
                    onClick={() => handleViewDetails(item.product.productId)}
                    className="bg-slate-700 text-white rounded px-4 py-2 hover:bg-slate-800 transition shadow-md hover:shadow-lg"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-cart-message">
          <h1>Your cart is empty.</h1>
        </div>
      )}
    </div>
  );
};

export default Cart;
