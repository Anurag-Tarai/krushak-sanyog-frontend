import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import api from "../Router/api";
import { GOOGLE_MAP_API } from "../api";

const AddProduct = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    imageUrl: "",
    description: "",
    price: 0,
    category: "",
    available: true,
    latitude: "",  // Add latitude
    longitude: "",
    address: "",  // Add address
    farmer_id: "" // Add farmer_id to the product state
  });

  
  const [error, setError] = useState(null);

  const categories = [
    { name: "Vegetables", value: "vegetables" },
    { name: "Fruits", value: "fruits" },
    { name: "Dairy Products", value: "dairyProducts" },
    { name: "Herbs and Spices", value: "herbsAndSpices" },
    { name: "Dry Fruits", value: "dryFruits" }
  ];

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAP_API, // Use your Google Maps API Key
    libraries: ["places"],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleMapClick = useCallback((e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setProduct((prevProduct) => ({
      ...prevProduct,
      latitude: lat,
      longitude: lng,
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Length validation for description
    if (product.description.length < 30 || product.description.length > 100) {
      setError("Description must be between 30 and 100 characters.");
      return;
    }

    // Extract the farmerId from localStorage
    const userId = localStorage.getItem("adminid");
    if (!userId) {
      setError("User ID not found.");
      return;
    }

    // Include the farmer_id in the product data
    const productWithFarmerId = {
      ...product,
      farmer_id: userId,
    };

    try {
      const response = await api.post("/ecom/products/add", productWithFarmerId);
      console.log("Product added successfully:", response.data);
      setProduct({
        name: "",
        imageUrl: "",
        description: "",
        price: 0,
        category: "",
        available: true,
        latitude: "",
        longitude: "",
        address: "",
        farmer_id: "", // Reset farmer_id
      });
      alert("Product Added Successfully!");
      navigate("/admin/admin");
    } catch (error) {
      setError(error.response?.data?.message || "Error adding product");
      console.error("Error adding product:", error.response?.data);
    }
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={product.name}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
            placeholder="Enter product name"
            required
          />
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
            Image URL
          </label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={product.imageUrl}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
            placeholder="Enter image URL"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={product.description}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
            placeholder="Enter product description"
            required
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Available Quantity
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={product.price}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
            placeholder="Enter price"
            min="0"
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={product.category}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={product.address}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
            placeholder="Enter address"
            required
          />
        </div>

        {/* Google Map Location Picker */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Product Location</label>
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={{ height: "400px", width: "100%" }}
              zoom={10}
              center={{ lat: 20.5937, lng: 78.9629 }} // Default to India
              onClick={handleMapClick}
            >
              {product.latitude && product.longitude && (
                <Marker position={{ lat: product.latitude, lng: product.longitude }} />
              )}
            </GoogleMap>
          ) : (
            <p>Loading map...</p>
          )}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md transition duration-300"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
