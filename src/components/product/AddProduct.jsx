import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import api from "../../Router/api";
import { GOOGLE_MAP_API } from "../../api/api";

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
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const categories = [
    { name: "Vegetables", value: "vegetables" },
    { name: "Fruits", value: "fruits" },
    { name: "Dairy Products", value: "dairyProducts" },
    { name: "Herbs and Spices", value: "herbsAndSpices" },
    { name: "Dry Fruits", value: "dryFruits" },
  ];

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAP_API,
    libraries: ["places"],
  });

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
      alert("You can select up to 5 images in total.");
      return;
    }

    setImages(totalFiles);
    e.target.value = null;
  };

  const handleMapClick = useCallback((e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setProduct((prev) => ({ ...prev, latitude: lat, longitude: lng }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setSuccess(null);

    if (product.description.length < 10 || product.description.length > 100) {
      setError("Description must be between 10 and 100 characters.");
      setLoading(false);
      return;
    }

    const userId = localStorage.getItem("farmerId");
    const token = localStorage.getItem("jwtToken");

    if (!userId || !token) {
      setError(!userId ? "User ID not found." : "Authorization token not found.");
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

      setSuccess(true);
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
      setError(err.response?.data?.message || "Error adding product");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-black text-gray-100 p-8 rounded-2xl shadow-2xl backdrop-blur-md transition-all duration-500 border border-gray-800">
      <h2 className="text-3xl font-extrabold text-center mb-8 text-emerald-400 tracking-wide">
        🌾 Add New Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={product.name}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 text-gray-100 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Enter product name"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={product.description}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 text-gray-100 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Enter product description"
            required
          />
        </div>

        {/* Variants */}
        <div>
          <label htmlFor="variants" className="block text-sm font-medium text-gray-300 mb-1">
            Product Variants (comma-separated)
          </label>
          <input
            type="text"
            id="variants"
            name="variants"
            value={product.variants}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 text-gray-100 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="e.g., Basmati, Jira, Usuna"
          />
        </div>

        {/* Quantity */}
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-300 mb-1">
            Available Quantity (kg)
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={product.quantity}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 text-gray-100 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Enter quantity"
            min="0"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={product.category}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 text-gray-100 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={product.address}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 text-gray-100 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Enter address"
            required
          />
        </div>

        {/* Images */}
        <div>
          <label htmlFor="images" className="block text-sm font-medium text-gray-300 mb-1">
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

        {/* Thumbnails */}
        <div className="flex flex-row gap-4 mt-3 overflow-x-auto">
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
                className="absolute top-0 right-0 bg-red-600 hover:bg-red-700 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center transition-all"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Google Map */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Product Location
          </label>
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={{ height: "400px", width: "100%", borderRadius: "12px" }}
              zoom={10}
              center={{
                lat: product.latitude || 20.5937,
                lng: product.longitude || 78.9629,
              }}
              onClick={handleMapClick}
            >
              {product.latitude && product.longitude && (
                <Marker position={{ lat: product.latitude, lng: product.longitude }} />
              )}
            </GoogleMap>
          ) : (
            <p className="text-gray-400">Loading map...</p>
          )}
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-emerald-600/30 transition-all duration-300"
        >
          {loading ? "Processing..." : "Add Product"}
        </button>
      </form>

      {success && (
        <p className="text-emerald-400 text-sm mt-3 animate-fade-in">
          ✅ Product added successfully!
        </p>
      )}
      {success === false && (
        <p className="text-red-500 text-sm mt-3">{error}</p>
      )}
    </div>
  );
};

export default AddProduct;
