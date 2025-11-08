import React, { useState, useEffect, useCallback } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch wishlist
  const fetchWishlist = useCallback(async () => {
  try {
    setLoading(true);
    const res = await api.get("/api/v1/wishlist/all");
    const products = res.data.items || res.data || [];
    const cleanProducts = products.map((item) => item.product || item).reverse();
    setWishlistProducts(cleanProducts);
  } catch (err) {
    console.error("Error fetching wishlist:", err);
  } finally {
    setLoading(false);
  }
}, []); // empty array → stable reference

useEffect(() => {
  fetchWishlist();
}, [fetchWishlist]); 

  // 🔹 Remove product
  const removeFromWishlist = async (productId) => {
    try {
      await api.delete(`/api/v1/wishlist/remove?productId=${productId}`);
      setWishlistProducts((prev) =>
        prev.filter((item) => item.productId !== productId)
      );
    } catch (err) {
      console.error("Error removing product:", err);
    }
  };

  // 🔹 Navigate to details
  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  // 🔹 Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#0b0b0b] text-gray-400">
        <div className="animate-pulse text-lg">Loading wishlist...</div>
      </div>
    );
  }

  // 🔹 Empty state
  if (wishlistProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#0b0b0b] text-gray-400 p-4 text-center">
        <h2 className="text-lg mb-2 font-medium">💚 Your wishlist is empty</h2>
        <button
          onClick={() => navigate("/products")}
          className="px-5 py-2 mt-3 rounded-md bg-green-700/80 hover:bg-green-600 transition text-sm font-medium"
        >
          Explore Products
        </button>
      </div>
    );
  }

  // 🔹 Main layout
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-[#0b0b0b] p-4 sm:p-6 overflow-y-auto">
      <div className="mt-10 w-full max-w-5xl bg-[#111] border border-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col max-h-[90vh] sm:h-[85vh]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
          <h1 className="text-2xl sm:text-2xl font-semibold text-green-500">Your Wishlist</h1>
          <span className="text-gray-400 text-sm">
            {wishlistProducts.length} item
            {wishlistProducts.length > 1 ? "s" : ""}
          </span>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto max-h-[60vh] sm:max-h-[65vh] pr-1 sm:pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 space-y-3 custom-scrollbar">
          {wishlistProducts.map((product) => (
           <motion.div
  key={product.productId}
  className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 bg-[#1a1a1a] border border-gray-800 rounded-xl p-3 sm:p-4 hover:shadow-md hover:shadow-green-800/10 transition-all duration-300 w-full sm:w-auto"
  whileHover={{ scale: 1.01 }}
>
  {/* Product Image */}
  <div className="w-full sm:w-24 h-40 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden">
    <img
      src={product.imageUrls?.[0] || '/placeholder.png'}
      alt={product.name}
      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
    />
  </div>

  {/* Product Info */}
  <div className="flex-1 space-y-1 sm:space-y-1.5 text-center sm:text-left">
    <h2 className="text-sm sm:text-base font-semibold text-gray-100 truncate">
      {product.name}
    </h2>
    <p className="text-xs sm:text-sm text-gray-400">
      {product.category} • {product.quantity} kg
    </p>
    <p className="text-[11px] sm:text-xs text-gray-500 truncate">
      {product.address || 'No address available'}
    </p>
  </div>

  {/* Actions */}
  <div className="flex sm:flex-col justify-center gap-2 mt-2 sm:mt-0">
    <button
      onClick={() => handleViewDetails(product.productId)}
      className="px-3 py-1 text-xs sm:py-1.5 rounded-md bg-green-700/80 hover:bg-green-600 transition font-medium"
    >
      View
    </button>
    <button
      onClick={() => removeFromWishlist(product.productId)}
      className="px-3 py-1 text-xs sm:py-1.5 rounded-md bg-red-700/80 hover:bg-red-600 transition font-medium"
    >
      Remove
    </button>
  </div>
</motion.div>

          ))}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {}
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(18, 18, 18, 0.4);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(34, 197, 94, 0.35), rgba(34, 197, 94, 0.25));
          border-radius: 9999px;
          border: 1px solid rgba(12, 12, 12, 0.6);
          transition: all 0.25s ease;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(34, 197, 94, 0.6), rgba(34, 197, 94, 0.45));
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(34, 197, 94, 0.4) rgba(18, 18, 18, 0.4);
        }
      `}</style>
    </div>
  );
};

export default Wishlist;
