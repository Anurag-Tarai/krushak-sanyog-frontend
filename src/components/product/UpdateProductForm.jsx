// src/components/farmer/UpdateProductForm.jsx
import React, { useState } from "react";
import api from "../../api/api";
import LocationMap from "../map/LocationMap";
import MessageToast from "../common/MessageToast";

const UpdateProductForm = ({ product, onUpdate, onClose }) => {
  const [updatedProduct, setUpdatedProduct] = useState({ ...product });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", status: "" });
  const token = localStorage.getItem("jwtToken");

  const hideToast = () => setToast({ ...toast, show: false });

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

  const handleSelectCurrentLocation = () => {
    if (!navigator.geolocation) {
      setToast({
        show: true,
        message: "Geolocation not supported.",
        status: "error",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUpdatedProduct((prev) => ({
          ...prev,
          latitude,
          longitude,
        }));
        setToast({
          show: true,
          message: `📍 Current location selected: ${latitude.toFixed(
            4
          )}, ${longitude.toFixed(4)}`,
          status: "success",
        });
      },
      () => {
        setToast({
          show: true,
          message: "Failed to get location.",
          status: "error",
        });
      }
    );
  };

  const handleResetLocation = () => {
    setUpdatedProduct((prev) => ({
      ...prev,
      latitude: "",
      longitude: "",
      address: "",
    }));
    setToast({ show: true, message: "Location reset.", status: "info" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!updatedProduct.name.trim()) {
      setToast({ show: true, message: "Product name is required.", status: "error" });
      return;
    }
    if (
      updatedProduct.description.length < 10 ||
      updatedProduct.description.length > 100
    ) {
      setToast({
        show: true,
        message: "Description must be between 10 and 100 characters.",
        status: "error",
      });
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
            "Content-Type": "application/json"
          },
        }
      );
      onUpdate(response.data);
      setToast({ show: true, message: "✅ Product updated successfully!", status: "success" });
      setTimeout(() => onClose(), 1000);
    } catch (err) {
      console.error("Error updating product:", err);
      setToast({
        show: true,
        message: "Failed to update product. Please try again.",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="relative bg-gray-900/40 border border-gray-900/60 backdrop-blur-md rounded-2xl 
                      shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 md:p-8 
                      text-gray-100 custom-scrollbar transition-all duration-300">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-3xl text-gray-400 hover:text-red-500 transition-all"
        >
          &times;
        </button>

        {/* Header */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-gray-400 uppercase tracking-[0.08em] border-b border-gray-700/50 pb-2">
          ✏️ Update Product
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={updatedProduct.name}
                onChange={handleChange}
                className="w-full bg-gray-900/40 border border-gray-800/60 text-gray-100 rounded-lg p-3 
                           focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter product name"
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Available Quantity (kg)
              </label>
              <input
                type="number"
                name="quantity"
                value={updatedProduct.quantity}
                onChange={handleChange}
                min="0"
                className="w-full bg-gray-900/40 border border-gray-800/60 text-gray-100 rounded-lg p-3 
                           focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter quantity"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Category
              </label>
              <select
                name="category"
                value={updatedProduct.category}
                onChange={handleChange}
                className="w-full bg-gray-900/60 border border-gray-800/60 text-gray-100 rounded-lg p-3 
                           focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Variants */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Product Variants (comma-separated)
              </label>
              <input
                type="text"
                name="variants"
                value={updatedProduct.variants}
                onChange={handleChange}
                className="w-full bg-gray-900/40 border border-gray-800/60 text-gray-100 rounded-lg p-3 
                           focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g., Organic, Local"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={updatedProduct.description}
              onChange={handleChange}
              rows="3"
              className="w-full bg-gray-900/40 border border-gray-800/60 text-gray-100 rounded-lg p-3 
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              placeholder="Enter product description"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={updatedProduct.address}
              onChange={handleChange}
              className="w-full bg-gray-900/40 border border-gray-800/60 text-gray-100 rounded-lg p-3 
                         focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Enter address"
            />
          </div>

          {/* Map Section */}
          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2 sm:gap-0">
              <label className="block text-sm font-medium text-gray-300">
                Product Location
              </label>
              <div className="flex gap-2 justify-start sm:justify-end">
                <button
                  type="button"
                  onClick={handleSelectCurrentLocation}
                  className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-sm rounded-md transition"
                >
                  Select Current
                </button>
                <button
                  type="button"
                  onClick={handleResetLocation}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-800 text-white text-sm rounded-md transition"
                >
                  Reset
                </button>
              </div>
            </div>

            <LocationMap
              latitude={updatedProduct.latitude}
              longitude={updatedProduct.longitude}
              objectName={"Updated"}
              onSelect={({ lat, lng, address }) =>
                setUpdatedProduct((prev) => ({
                  ...prev,
                  latitude: lat,
                  longitude: lng,
                  address: address || prev.address,
                }))
              }
            />

            {updatedProduct.latitude && updatedProduct.longitude && (
              <p className="text-xs text-gray-400 mt-2">
                📍 Selected: {updatedProduct.latitude.toFixed(5)},{" "}
                {updatedProduct.longitude.toFixed(5)}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-700 hover:bg-gray-800 text-white px-5 py-2 rounded-lg transition-all shadow-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`${
                loading
                  ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                  : "bg-emerald-700 hover:bg-emerald-800 text-white"
              } px-5 py-2 rounded-lg shadow-md transition-all`}
            >
              {loading ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>

        <MessageToast
          show={toast.show}
          onClose={hideToast}
          message={toast.message}
          status={toast.status}
        />
      </div>
    </div>
  );
};

export default UpdateProductForm;
