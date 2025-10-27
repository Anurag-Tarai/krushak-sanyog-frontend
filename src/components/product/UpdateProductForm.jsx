import React, { useState, useCallback } from "react";
import "../../styles/components/updateform.css";
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
    <div className="modal-backdrop fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      {/* 🔹 Scrollable Form Container */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 relative scroll-smooth">
        {/* ❌ Close Button */}
        <span
          className="absolute top-3 right-4 text-2xl cursor-pointer text-gray-600 hover:text-red-600"
          onClick={onClose}
        >
          &times;
        </span>

        {/* 🔹 Header */}
        <h2 className="text-2xl font-bold text-green-800 mb-4 text-center">
          Update Product
        </h2>

        {/* 🔹 Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={updatedProduct.name}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={updatedProduct.description}
              onChange={handleChange}
              rows="3"
              className="w-full border rounded-md p-2"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              value={updatedProduct.category}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={updatedProduct.address}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Variants
            </label>
            <input
              type="text"
              name="variants"
              value={updatedProduct.variants}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            />
          </div>

          {/* 🌍 Map Picker */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            {isLoaded ? (
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
            ) : (
              <p>Loading map...</p>
            )}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* 🔹 Action Buttons */}
          <div className="flex justify-end mt-6 space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md shadow"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`${
                loading ? "bg-gray-400" : "bg-green-700 hover:bg-green-800"
              } text-white px-4 py-2 rounded-md shadow`}
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
