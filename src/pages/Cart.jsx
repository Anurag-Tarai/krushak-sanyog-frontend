import React, { useState, useEffect } from "react";
import api from "../Router/api";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const [cartId, setCartId] = useState(null);
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("buyerId");
  const token = localStorage.getItem("jwtToken");

  // STEP 1: Fetch the user's cartId
  useEffect(() => {
    const fetchCartId = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/v1/cart/buyer/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetchedCartId = res.data.cartId;
        setCartId(fetchedCartId);
        localStorage.setItem("cartid", fetchedCartId);
      } catch (err) {
        console.error("Error fetching cart ID:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchCartId();
  }, [userId, token]);

  // STEP 2: Fetch cart products once we have cartId
  useEffect(() => {
    const fetchCartProducts = async () => {
      if (!cartId) return;
      try {
        setLoading(true);
        const res = await api.get(`/api/v1/cart/products/${cartId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartProducts(res.data.products || []);
      } catch (err) {
        console.error("Error fetching cart products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCartProducts();
  }, [cartId, token]);

  // ✅ Remove a product from cart
  const removeProductFromCart = async (productId) => {
    try {
      await api.delete(`/api/v1/cart/remove/${cartId}/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartProducts((prev) =>
        prev.filter((item) => item.productId !== productId)
      );
    } catch (err) {
      console.error("Error removing product:", err);
    }
  };

  // ✅ Empty entire cart
  const emptyCart = async () => {
    try {
      await api.delete(`/api/v1/cart/empty/${cartId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartProducts([]);
    } catch (err) {
      console.error("Error emptying cart:", err);
    }
  };

  // ✅ Go to product details
  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-300">
        Loading your cart...
      </div>
    );
  }

  return (
    <div className="cart-page p-6 text-gray-200 min-h-screen bg-gradient-to-b from-[#0b0b0b] via-[#111] to-[#161616]">
      {cartProducts.length > 0 ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-green-400">
              Your Cart ({cartProducts.length})
            </h1>
            <button
              onClick={emptyCart}
              className="bg-red-700/80 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-medium transition shadow-md hover:shadow-lg"
            >
              Empty Cart
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cartProducts.map((product) => (
              <div
                key={product.productId}
                className="bg-gray-900/60 border border-gray-800/60 rounded-xl shadow-lg overflow-hidden transition hover:shadow-green-800/20"
              >
                <div className="h-40 overflow-hidden">
                  <img
                    src={product.imageUrls?.[0] || "/placeholder.png"}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>

                <div className="p-4 space-y-2">
                  <h2 className="text-lg font-semibold text-gray-100">
                    {product.name}
                  </h2>
                  <p className="text-sm text-gray-400">
                    Category:{" "}
                    <span className="text-green-400">{product.category}</span>
                  </p>
                  <p className="text-sm text-gray-400">
                    Address: {product.address || "Not provided"}
                  </p>
                  <p className="text-sm text-gray-400">
                    Quantity: {product.quantity} kg
                  </p>

                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => removeProductFromCart(product.productId)}
                      className="bg-red-700/80 hover:bg-red-600 px-3 py-2 text-sm rounded-md transition shadow-md"
                    >
                      Remove
                    </button>
                    <button
                      onClick={() => handleViewDetails(product.productId)}
                      className="bg-green-700/80 hover:bg-green-600 px-3 py-2 text-sm rounded-md transition shadow-md"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <h1 className="text-xl font-medium">🛒 Your cart is empty</h1>
          <button
            onClick={() => navigate("/products")}
            className="mt-4 px-6 py-2 bg-green-700/80 hover:bg-green-600 rounded-md text-sm transition"
          >
            Explore Products
          </button>
        </div>
      )}
    </div>
  );
};
export default Cart;
