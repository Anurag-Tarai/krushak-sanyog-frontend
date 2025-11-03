import React, { useEffect, useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../../Router/api";
import { motion } from "framer-motion";

// 💤 Lazy imports with subtle artificial delay for smooth transitions
const delayedImport = (factory, delay = 400) =>
  new Promise((resolve) => setTimeout(() => resolve(factory()), delay));

// 💤 (if you want to lazy load some subcomponents later)
const LazyImage = lazy(() => delayedImport(() => import("./LazyImage"), 200));

// 🩶 Compact shimmer skeleton
const Skeleton = ({ className = "" }) => (
  <div
    className={`animate-pulse bg-gray-800/60 rounded-md transition-all duration-300 ease-out ${className}`}
  />
);

// 🌿 Compact shimmer skeleton grid
const ProductCardSkeleton = () => (
  <div className="border border-gray-800/70 bg-gradient-to-b from-gray-900/40 to-gray-900/20 rounded-xl p-5 animate-pulse">
    <Skeleton className="w-full h-44 mb-4 rounded-xl" />
    <Skeleton className="h-5 w-3/5 mb-3" />
    <Skeleton className="h-3 w-4/5 mb-2" />
    <Skeleton className="h-3 w-2/5 mb-2" />
    <Skeleton className="h-8 w-full mt-3" />
  </div>
);

const fetchProducts = async ({ queryKey }) => {
  const [, farmerId, token] = queryKey;
  const res = await api.get(`/api/v1/products/farmer/${farmerId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = res.data || [];
  return data.sort((a, b) => b.productId - a.productId);
};

const AllProductFarmerContent = ({ refresh }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");
  const farmerId = localStorage.getItem("farmerId");
  const [statusMap, setStatusMap] = useState({});
  const [confirmId, setConfirmId] = useState(null);
  const [contentLoading, setContentLoading] = useState(true);

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

  useEffect(() => {
    if (isLoading) {
      setContentLoading(true);
    } else {
      // Small delay for smoother load transition
      const timeout = setTimeout(() => setContentLoading(false), 400);
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

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

  // 🩶 Skeleton loading grid
  if (isLoading || contentLoading)
    return (
      <div className="bg-black rounded-2xl border border-gray-800/60 backdrop-blur-md text-gray-200 relative">
        <div className="max-w-7xl h-[85vh] mx-auto relative z-0">
          <div className="rounded-2xl h-[85vh] bg-gray-950/60 border border-gray-900/60 backdrop-blur-md overflow-y-auto p-6 custom-scrollbar">
            <h1 className="text-xl font-bold text-center mb-6 text-gray-300 tracking-wide">
              🌿 Your Products
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="text-red-500 text-center p-6">
        Failed to load products.
        <br />
        {error?.message || "Something went wrong."}
      </div>
    );

  if (!products.length)
    return (
      <p className="text-gray-400 mt-8 text-center text-lg">
        No products found.
      </p>
    );

  return (
    <div className="bg-black rounded-2xl border border-gray-800/60 backdrop-blur-md text-gray-200 relative">
      {/* 🌿 Confirmation Dialog */}
      {confirmId && (
        <div className="rounded-2xl fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md z-50 transition-all duration-300 px-3 sm:px-0">
          <div className="rounded-2xl bg-gray-900/80 border border-gray-800 p-6 w-full max-w-sm">
            <h3 className="text-red-400 font-semibold text-lg mb-3">
              Confirm Deletion
            </h3>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:space-x-4">
              <button
                onClick={() => handleDeleteConfirmed(confirmId)}
                className="bg-red-800/70 hover:bg-red-700/60 border border-red-600/60 text-gray-100 px-4 py-2 rounded-lg transition-all w-full sm:w-auto"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setConfirmId(null)}
                className="bg-gray-800/70 hover:bg-gray-700/60 border border-green-600/60 text-green-300 px-4 py-2 rounded-lg transition-all w-full sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🌱 Product List */}
      <div className="max-w-7xl h-[85vh] mx-auto relative z-0">
        <div className="rounded-2xl h-[85vh] bg-gray-800/40 border border-gray-900/60 backdrop-blur-md overflow-y-auto p-6 custom-scrollbar">
          <h1 className="text-xl font-bold text-center mb-6 text-gray-300 tracking-wide">
            🌿 Your Products
          </h1>

          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {products.map((product, index) => {
              const imageUrl =
                product.imageUrls?.[0]?.startsWith("http")
                  ? product.imageUrls[0]
                  : "/placeholder.jpg";
              const status = statusMap[product.productId];

              return (
                <motion.div
                  className="group relative border bg-gray-950/60 border-transparent hover:border-green-800/0 hover:bg-green-800/30  rounded-xl p-3 backdrop-blur-sm transition-all duration-300 cursor-pointer flex flex-col"
                  onClick={() => handleViewDetails(product.productId)}
                >
                  {/* Image (Suspense for lazy smooth fade) */}
                  <Suspense fallback={<Skeleton className="w-full h-44 mb-3 rounded-xl" />}>
                    <LazyImage src={imageUrl} alt={product.name || "Product"} />
                  </Suspense>

                  {/* Info */}
                  <div className="flex justify-between items-center mt-3 mb-2">
                    <h2 className="text-base font-semibold text-gray-100 truncate group-hover:text-emerald-400 transition-colors">
                      {product.name}
                    </h2>
                    <span className="text-xs text-gray-400 bg-gray-800/60 border border-gray-700/60 px-2 py-0.5 rounded-md">
                      {product.category}
                    </span>
                  </div>

                  <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed mb-2">
                    {product.description || "No description provided."}
                  </p>

                  <div className="flex justify-between text-sm text-gray-500 mb-3">
                    <span>
                      <strong className="text-gray-300">Qty:</strong>{" "}
                      {product.quantity} kg
                    </span>
                    <span
                      className="truncate max-w-[180px]"
                      title={product.address}
                    >
                      <strong className="text-gray-300">📍</strong>{" "}
                      {product.address?.length > 35
                        ? `${product.address.substring(0, 35)}...`
                        : product.address}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-auto border-t border-gray-800/70 pt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(product.productId);
                      }}
                      className="text-sm px-3 py-1.5 rounded-md border border-green-700/50 hover:bg-green-800/40 transition-all text-white-400 hover:text-white-300"
                    >
                      View Details →
                    </button>

                    <button
                      disabled={status === "processing"}
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmId(product.productId);
                      }}
                      className={`text-sm px-3 py-1.5 rounded-md border border-red-700/50 hover:bg-red-800/40 transition-all ${
                        status === "processing"
                          ? "opacity-70 cursor-wait text-red-400"
                          : "text-red-400 hover:text-red-300"
                      }`}
                    >
                      {status === "processing"
                        ? "Processing..."
                        : status === "deleted"
                        ? "Deleted ✓"
                        : status === "failed"
                        ? "Failed ✗"
                        : "Remove"}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* 🪶 Ultra Compact Modern Scrollbar */}
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

// 💤 Lazy-load wrapper
const AllProductFarmer = (props) => (
  <Suspense
    fallback={
      <div className="text-emerald-400 text-center p-6 font-semibold">
        Loading Products...
      </div>
    }
  >
    <AllProductFarmerContent {...props} />
  </Suspense>
);

export default AllProductFarmer;
