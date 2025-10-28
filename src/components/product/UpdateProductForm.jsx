// src/components/farmer/UpdateProductForm.jsx
import React, { useState, useCallback } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { GOOGLE_MAP_API } from "../../api/api";
import api from "../../Router/api";

const UpdateProductForm = ({ product, onUpdate, onClose }) => {
  const [updatedProduct, setUpdatedProduct] = useState({ ...product });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("jwtToken");

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAP_API,
    libraries: ["places"],
  });

  const categories = [
    { name: "Vegetables", value: "vegetables" },
    { name: "Fruits", value: "fruits" },
    { name: "Dairy Products", value: "dairyProducts" },
    { name: "Herbs and Spices", value: "herbsAndSpices" },
    { name: "Dry Fruits", value: "dryFruits" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct({ ...updatedProduct, [name]: value });
  };

  const handleMapClick = useCallback((e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setUpdatedProduct((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!updatedProduct.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (
      updatedProduct.description.length < 10 ||
      updatedProduct.description.length > 100
    ) {
      setError("Description must be between 10 and 100 characters.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.put(
        `/api/v1/products/${updatedProduct.productId || product.productId}`,
        {
          name: updatedProduct.name,
          description: updatedProduct.description,
          quantity: updatedProduct.quantity,
          category: updatedProduct.category,
          latitude: updatedProduct.latitude,
          longitude: updatedProduct.longitude,
          address: updatedProduct.address,
          variants: updatedProduct.variants,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onUpdate(response.data);
      alert("✅ Product updated successfully!");
      onClose();
    } catch (err) {
      console.error("Error updating product:", err);
      setError("Failed to update product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-20 fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      {/* Scrollable Modal */}
      <div className="bg-gray-900 text-gray-100 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative border border-gray-800">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-red-400 transition"
        >
          &times;
        </button>

        {/* Header */}
        <h2 className="text-3xl font-bold text-green-400 mb-6 text-center tracking-wide">
          Update Product
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-300">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={updatedProduct.name}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-gray-100 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-300">
              Description
            </label>
            <textarea
              name="description"
              value={updatedProduct.description}
              onChange={handleChange}
              rows="3"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-gray-100 focus:ring-2 focus:ring-green-500 outline-none resize-none"
            ></textarea>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-300">
              Category
            </label>
            <select
              name="category"
              value={updatedProduct.category}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-gray-100 focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-300">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={updatedProduct.address}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-gray-100 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Variants */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-300">
              Variants
            </label>
            <input
              type="text"
              name="variants"
              value={updatedProduct.variants}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-gray-100 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Map Picker */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Location
            </label>
            {isLoaded ? (
              <div className="rounded-lg overflow-hidden border border-gray-700 shadow-inner">
                <GoogleMap
                  mapContainerStyle={{ height: "300px", width: "100%" }}
                  zoom={10}
                  center={{
                    lat: updatedProduct.latitude || 20.5937,
                    lng: updatedProduct.longitude || 78.9629,
                  }}
                  onClick={handleMapClick}
                >
                  {updatedProduct.latitude && updatedProduct.longitude && (
                    <Marker
                      position={{
                        lat: updatedProduct.latitude,
                        lng: updatedProduct.longitude,
                      }}
                    />
                  )}
                </GoogleMap>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Loading map...</p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-400 text-sm font-medium bg-red-900/20 rounded-lg px-3 py-2 border border-red-700">
              {error}
            </p>
          )}

          {/* Buttons */}
          <div className="flex justify-end mt-6 space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2 rounded-lg transition-all shadow-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`${
                loading
                  ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              } px-5 py-2 rounded-lg transition-all shadow-md`}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProductForm;
