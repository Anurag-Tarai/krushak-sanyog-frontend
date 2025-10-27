import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../../Router/api";

const fetchProducts = async ({ queryKey }) => {
  const [, farmerId, token] = queryKey;
  const res = await api.get(`/api/v1/products/farmer/${farmerId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log(res.data);

  const data = res.data || [];
  // ✅ Sort newest first
  return data.sort((a, b) => b.productId - a.productId);
};

const AllProductFarmer = ({ refresh }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");
  const farmerId = localStorage.getItem("farmerId");

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

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/v1/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      refetch();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="text-emerald-400 font-semibold text-center p-6">
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

  // 🌑 Dark theme aesthetic design
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-gray-100 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-10 text-emerald-400 tracking-wide drop-shadow-lg">
          🌾 Your Products
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => {
            const imageUrl =
              product.imageUrls?.[0] && product.imageUrls[0].startsWith("http")
                ? product.imageUrls[0]
                : "/placeholder.jpg";

            return (
              <div
                key={product.productId}
                className="group relative bg-gray-800/80 backdrop-blur-md border border-gray-700 rounded-2xl shadow-xl hover:shadow-emerald-600/20 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative h-52 w-full overflow-hidden rounded-t-2xl">
                  <img
                    src={imageUrl}
                    alt={product.name || "Product"}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => (e.target.src = "/placeholder.jpg")}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                </div>

                <div className="p-5 text-left">
                  <h2 className="text-xl font-bold text-emerald-400 mb-1">
                    {product.name}
                  </h2>
                  <p className="text-emerald-300/80 text-sm font-medium mb-2">
                    Category: {product.category}
                  </p>

                  <p className="text-gray-300 text-sm mb-3 leading-snug">
                    {product.description?.length > 60
                      ? `${product.description.substring(0, 60)}...`
                      : product.description}
                  </p>

                  <p className="text-emerald-400 font-semibold mb-4">
                    Quantity: {product.quantity} kg
                  </p>

                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => handleViewDetails(product.productId)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-5 rounded-lg font-semibold shadow-md hover:shadow-emerald-500/40 transition-all duration-300"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleDelete(product.productId)}
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-5 rounded-lg font-semibold shadow-md hover:shadow-red-500/40 transition-all duration-300"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AllProductFarmer;
