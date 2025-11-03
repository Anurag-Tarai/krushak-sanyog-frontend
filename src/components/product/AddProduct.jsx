import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Router/api";
import LocationMap from "../map/LocationMap";
import MessageToast from "../common/MessageToast";

const AddProduct = ({ setRefreshProducts, setSelectedComponent }) => {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    quantity: 0,
    category: "",
    available: true,
    latitude: "",
    longitude: "",
    address: "",
    farmer_id: "",
    variants: "",
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fixed: use `status` instead of `type`
  const [toast, setToast] = useState({ show: false, message: "", status: "" });
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
    setProduct({ ...product, [name]: value });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImagesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const totalFiles = [...images, ...selectedFiles];
    if (totalFiles.length > 5) {
      setToast({
        show: true,
        message: "You can select up to 5 images.",
        status: "error",
      });
      return;
    }
    setImages(totalFiles);
    e.target.value = null;
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
        setProduct((prev) => ({
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
    setProduct((prev) => ({
      ...prev,
      latitude: "",
      longitude: "",
      address: "",
    }));
    setToast({ show: true, message: "Location reset.", status: "info" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (product.description.length < 10 || product.description.length > 100) {
      setToast({
        show: true,
        message: "Description must be between 10 and 100 characters.",
        status: "error",
      });
      setLoading(false);
      return;
    }

    const userId = localStorage.getItem("farmerId");
    const token = localStorage.getItem("jwtToken");

    if (!userId || !token) {
      setToast({
        show: true,
        message: !userId
          ? "User ID not found."
          : "Authorization token not found.",
        status: "error",
      });
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append(
      "product",
      new Blob([JSON.stringify({ ...product, farmer_id: userId })], {
        type: "application/json",
      })
    );
    images.forEach((file) => formData.append("images", file));

    try {
      await api.post("/api/v1/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setToast({
        show: true,
        message: "✅ Product added successfully!",
        status: "success",
      });

      setProduct({
        name: "",
        description: "",
        quantity: 0,
        category: "",
        available: true,
        latitude: "",
        longitude: "",
        address: "",
        farmer_id: "",
        variants: "",
      });
      setImages([]);
      setRefreshProducts((prev) => !prev);

      setTimeout(() => {
        setSelectedComponent("all-products");
      }, 1000);
    } catch (err) {
      const msg = err.response?.data?.message || "Error adding product";
      setToast({ show: true, message: msg, status: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative rounded-2xl bg-gray-900/40 border border-gray-900/60 backdrop-blur-md text-gray-100 p-8 shadow-2xl transition-all duration-500 h-[85vh] overflow-y-auto custom-scrollbar">
        <h2
          className="text-3xl font-bold text-center mb-10 text-gray-400 tracking-[0.08em] uppercase 
                 border-b border-gray-700/50 inline-block pb-2 mx-44"
        >
          🌾 Add New Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 🔹 All original fields remain untouched */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name, Quantity, Category, Variants */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Product Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={product.name}
                onChange={handleChange}
                className="w-full bg-gray-900/40 border border-gray-800/60 text-gray-100 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter product name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Available Quantity (kg)
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={product.quantity}
                onChange={handleChange}
                className="w-full bg-gray-900/40 border border-gray-800/60 text-gray-100 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter quantity"
                min="0"
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
  Category
</label>
<div className="relative">
  <select
    id="category"
    name="category"
    value={product.category}
    onChange={handleChange}
    className="w-full appearance-none bg-gray-900/60 border border-gray-800 text-gray-100 rounded-lg p-3 pr-10
               focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
               transition duration-150 ease-in-out cursor-pointer"
    required
    style={{
      colorScheme: 'dark', // ensures consistent dark dropdown style
    }}
  >
    <option value="" disabled className="text-green-400 bg-red-500">
      Select a category
    </option>
    {categories.map((cat) => (
      <option
        key={cat.value}
        value={cat.value}
        className="bg-gray-900 text-gray-100 hover:bg-emerald-600 hover:text-white"
      >
        {cat.name}
      </option>
    ))}
  </select>

  {/* Custom dropdown arrow */}
  <svg
    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
  </svg>
</div>

            </div>

            <div>
              <label
                htmlFor="variants"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Product Variants (comma-separated)
              </label>
              <input
                type="text"
                id="variants"
                name="variants"
                value={product.variants}
                onChange={handleChange}
                className="w-full bg-gray-900/40 border border-gray-800/60 text-gray-100 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g., Basmati, Jira, Usuna"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={product.description}
              onChange={handleChange}
              className="w-full bg-gray-900/40 border border-gray-800/60 text-gray-100 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              rows="3"
              placeholder="Enter product description"
              required
            />
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={product.address}
              onChange={handleChange}
              className="w-full bg-gray-900/40 border border-gray-800/60 text-gray-100 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Enter address"
              required
            />
          </div>

          {/* Images */}
          <div>
            <label
              htmlFor="images"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Upload Images
            </label>
            <input
              type="file"
              id="images"
              multiple
              accept="image/*"
              onChange={handleImagesChange}
              className="w-full text-gray-300 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-700 file:text-white hover:file:bg-emerald-600 transition-all"
            />
          </div>

          {/* Image preview */}
          <div className="flex flex-row gap-4 mt-3 overflow-x-auto custom-scrollbar">
            {images.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  width={80}
                  className="rounded-lg border border-gray-700"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-0 right-0 bg-red-700 hover:bg-red-800 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center transition-all"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* 🗺️ Map + Search */}
          <div className="mt-4">
            <div className="flex justify-between mb-2">
              <label className="block text-sm font-medium text-gray-300">
                Product Location
              </label>
              <div className="flex gap-2">
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
              latitude={product.latitude}
              longitude={product.longitude}
              objectName={"My"}
              onSelect={({ lat, lng, address }) =>
                setProduct((prev) => ({
                  ...prev,
                  latitude: lat,
                  longitude: lng,
                  address: address || prev.address,
                }))
              }
            />

            {product.latitude && product.longitude && (
              <p className="text-xs text-gray-400 mt-2">
                📍 Selected: {product.latitude.toFixed(5)},{" "}
                {product.longitude.toFixed(5)}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-emerald-600/30 transition-all duration-300"
          >
            {loading ? "Processing..." : "Add Product"}
          </button>
        </form>

        {/* ✅ Toast (now fully functional) */}
        <MessageToast
          show={toast.show}
          onClose={hideToast}
          message={toast.message}
          status={toast.status}
        />

        {/* Scrollbar Style */}
        <style>
          {`
            .custom-scrollbar::-webkit-scrollbar {}
            .custom-scrollbar::-webkit-scrollbar-track {
              background: rgba(18,18,18,0.4);
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: linear-gradient(180deg,rgba(34,197,94,0.35),rgba(34,197,94,0.25));
              border-radius:9999px;
              border:1px solid rgba(12,12,12,0.6);
              transition:all 0.25s ease;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: linear-gradient(180deg,rgba(34,197,94,0.6),rgba(34,197,94,0.45));
            }
            .custom-scrollbar {
              scrollbar-width: thin;
              scrollbar-color: rgba(34,197,94,0.4) rgba(18,18,18,0.4);
            }
          `}
        </style>
      </div>
    </>
  );
};

export default AddProduct;
