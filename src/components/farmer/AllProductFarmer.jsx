import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../../Router/api";

const fetchProducts = async ({ queryKey }) => {
  const [, farmerId, token] = queryKey;
  const res = await api.get(`/api/v1/products/farmer/${farmerId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = res.data || [];
  return data.sort((a, b) => b.productId - a.productId);
};

const AllProductFarmer = ({ refresh }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");
  const farmerId = localStorage.getItem("farmerId");
  const [statusMap, setStatusMap] = useState({});
  const [confirmId, setConfirmId] = useState(null); // store productId for confirmation

  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
    error,
  } = useQuery({
    queryKey: ["products", farmerId, token],
    queryFn: fetchProducts,
    enabled: !!farmerId && !!token,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    retry: 1,
  });

  useEffect(() => {
    if (refresh) refetch();
  }, [refresh, refetch]);

  const handleViewDetails = (id) => navigate(`/farmer/product/details/${id}`);

  const handleDeleteConfirmed = async (id) => {
    setStatusMap((prev) => ({ ...prev, [id]: "processing" }));
    setConfirmId(null);

    try {
      await api.delete(`/api/v1/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStatusMap((prev) => ({ ...prev, [id]: "deleted" }));
      setTimeout(() => {
        refetch();
        setStatusMap((prev) => {
          const copy = { ...prev };
          delete copy[id];
          return copy;
        });
      }, 1200);
    } catch (err) {
      console.error("Error deleting product:", err);
      setStatusMap((prev) => ({ ...prev, [id]: "failed" }));
      setTimeout(() => {
        setStatusMap((prev) => {
          const copy = { ...prev };
          delete copy[id];
          return copy;
        });
      }, 1500);
    }
  };

  if (isLoading) {
    return (
      <div className="text-green-400 font-semibold text-center p-6">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center p-6">
        Failed to load products.
        <br />
        {error?.message || "Something went wrong."}
      </div>
    );
  }

  if (!products.length) {
    return (
      <p className="text-gray-400 mt-8 text-center text-lg">
        No products found.
      </p>
    );
  }

  return (
    <>
      {/* 🌿 Confirmation Dialog */}
      {confirmId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md z-50 transition-all duration-300">
          <div className="bg-gradient-to-b from-gray-900 via-black to-gray-900 border border-green-700/40 rounded-2xl p-6 shadow-[0_0_30px_rgba(34,197,94,0.2)] text-center max-w-sm w-full mx-4 animate-fadeIn">
            <h3 className="text-red-400 font-semibold text-lg mb-3">
              Confirm Deletion
            </h3>
            <p className="text-gray-300 text-sm mb-6">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleDeleteConfirmed(confirmId)}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg shadow-md transition"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setConfirmId(null)}
                className="bg-gray-800 border border-green-700 text-green-300 px-4 py-2 rounded-lg hover:bg-green-700/20 transition shadow-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🌱 Product List */}
      <div className="bg-gradient-to-b from-gray-900 via-black to-gray-900 text-gray-100 p-6 border border-green-800/30 shadow-[0_0_30px_rgba(34,197,94,0.08)] backdrop-blur-md transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-extrabold text-center mb-10 text-green-400 tracking-wide drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]">
            🌿 Your Products
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const imageUrl =
                product.imageUrls?.[0] && product.imageUrls[0].startsWith("http")
                  ? product.imageUrls[0]
                  : "/placeholder.jpg";

              const status = statusMap[product.productId];

              return (
                <div
                  key={product.productId}
                  className="bg-gray-900/90 border border-green-800/30 rounded-2xl p-4 shadow-[0_0_30px_rgba(34,197,94,0.08)] hover:scale-[1.03] transition-all duration-300"
                >
                  <div className="overflow-hidden rounded-xl mb-3">
                    <img
                      src={imageUrl}
                      alt={product.name || "Product"}
                      className="w-full h-48 object-cover hover:scale-110 transition-transform duration-500"
                      onError={(e) => (e.target.src = "/placeholder.jpg")}
                    />
                  </div>

                  <h2 className="text-2xl font-bold text-green-400 mb-1">
                    {product.name}
                  </h2>
                  <p className="text-gray-400 text-sm mb-1">
                    <strong>Category:</strong> {product.category}
                  </p>
                  <p className="text-gray-400 text-sm mb-1">
                    <strong>Description:</strong>{" "}
                    {product.description?.length > 25
                      ? `${product.description.substring(0, 25)}...`
                      : product.description}
                  </p>
                  <p className="text-gray-400 text-sm mb-2">
                    <strong>Address:</strong>{" "}
                    {product.address?.length > 25
                      ? `${product.address.substring(0, 25)}...`
                      : product.address}
                  </p>

                  <h2 className="text-lg font-semibold text-green-300 mb-3">
                    Quantity: {product.quantity} kg
                  </h2>

                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => handleViewDetails(product.productId)}
                      className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition shadow-md"
                    >
                      View Details
                    </button>

                    <button
                      disabled={status === "processing"}
                      onClick={() => setConfirmId(product.productId)}
                      className={`relative bg-red-800 border border-red-700 text-black-300 px-4 py-2 rounded-lg transition shadow-md overflow-hidden ${
                        status === "processing"
                          ? "opacity-70 cursor-wait"
                          : "hover:bg-red-700/20"
                      }`}
                    >
                      {status === "processing" && (
                        <span className="animate-pulse text-red-400">
                          Processing...
                        </span>
                      )}
                      {status === "deleted" && (
                        <span className="text-red-500">Deleted ✓</span>
                      )}
                      {status === "failed" && (
                        <span className="text-red-400">Failed ✗</span>
                      )}
                      {!status && "Remove"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default AllProductFarmer;
