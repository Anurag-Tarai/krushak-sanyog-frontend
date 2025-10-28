import React, { useEffect, useState, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../../Router/api";

// 💤 Lazy load image (optional micro optimization)
const LazyImage = React.memo(({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="overflow-hidden rounded-xl mb-3 relative">
      {!loaded && (
        <div className="absolute inset-0 bg-gray-800/60 animate-pulse rounded-xl" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={(e) => (e.target.src = "/placeholder.jpg")}
        className={`w-full h-48 object-cover transition-transform duration-500 ${
          loaded ? "hover:scale-110" : "opacity-0"
        }`}
      />
    </div>
  );
});

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
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md z-50 transition-all duration-300 px-3 sm:px-0">
          <div className="bg-gradient-to-b from-gray-900 via-black to-gray-900 border border-green-700/40 rounded-2xl p-6 shadow-[0_0_30px_rgba(34,197,94,0.2)] text-center w-full max-w-sm animate-fadeIn">
            <h3 className="text-red-400 font-semibold text-lg mb-3">
              Confirm Deletion
            </h3>
            <p className="text-gray-300 text-sm mb-6">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:space-x-4">
              <button
                onClick={() => handleDeleteConfirmed(confirmId)}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg shadow-md transition w-full sm:w-auto"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setConfirmId(null)}
                className="bg-gray-800 border border-green-700 text-green-300 px-4 py-2 rounded-lg hover:bg-green-700/20 transition shadow-md w-full sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🌱 Product List */}
      <div className="bg-gradient-to-b from-gray-900 via-black to-gray-900 text-gray-100 p-4 sm:p-6 border border-green-800/30 shadow-[0_0_30px_rgba(34,197,94,0.08)] backdrop-blur-md transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-center mb-6 sm:mb-10 text-green-400 tracking-wide drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]">
            🌿 Your Products
          </h1>

          {/* Responsive grid: same PC layout, stacked on small screens */}
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
                  className="bg-gray-900/90 border border-green-800/30 rounded-2xl p-4 shadow-[0_0_30px_rgba(34,197,94,0.08)] hover:scale-[1.03] transition-all duration-300 flex flex-col"
                >
                  {/* 💤 Lazy image loading */}
                  <LazyImage src={imageUrl} alt={product.name || "Product"} />

                  <div className="flex-grow">
                    <h2 className="text-2xl font-bold text-green-400 mb-1 break-words">
                      {product.name}
                    </h2>
                    <p className="text-gray-400 text-sm mb-1 break-words">
                      <strong>Category:</strong> {product.category}
                    </p>
                    <p className="text-gray-400 text-sm mb-1 break-words">
                      <strong>Description:</strong>{" "}
                      {product.description?.length > 25
                        ? `${product.description.substring(0, 25)}...`
                        : product.description}
                    </p>
                    <p className="text-gray-400 text-sm mb-2 break-words">
                      <strong>Address:</strong>{" "}
                      {product.address?.length > 25
                        ? `${product.address.substring(0, 25)}...`
                        : product.address}
                    </p>

                    <h2 className="text-lg font-semibold text-green-300 mb-3">
                      Quantity: {product.quantity} kg
                    </h2>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between gap-3 mt-auto">
                    <button
                      onClick={() => handleViewDetails(product.productId)}
                      className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition shadow-md w-full sm:w-auto"
                    >
                      View Details
                    </button>

                    <button
                      disabled={status === "processing"}
                      onClick={() => setConfirmId(product.productId)}
                      className={`relative bg-red-800 border border-red-700 text-black-300 px-4 py-2 rounded-lg transition shadow-md overflow-hidden w-full sm:w-auto ${
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

// 💤 Lazy-load the full component itself (wrapper)
const AllProductFarmer = (props) => (
  <Suspense
    fallback={
      <div className="text-green-400 text-center p-6 font-semibold">
        Loading Products...
      </div>
    }
  >
    <AllProductFarmerContent {...props} />
  </Suspense>
);

export default AllProductFarmer;
