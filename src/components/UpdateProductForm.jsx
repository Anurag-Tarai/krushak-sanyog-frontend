import React, { useState, useCallback } from "react";
import "../comp_css/updateform.css";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { GOOGLE_MAP_API } from "../api";

const UpdateProductForm = ({ product, onUpdate, onClose }) => {
  const [updatedProduct, setUpdatedProduct] = useState({ ...product });
  const [error, setError] = useState(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAP_API, // Use your Google Maps API Key
    libraries: ["places"],
  });

  const categories = [
    { name: "Vegetables", value: "vegetables" },
    { name: "Fruits", value: "fruits" },
    { name: "Dairy Products", value: "dairyProducts" },
    { name: "Herbs and Spices", value: "herbsAndSpices" },
    { name: "Dry Fruits", value: "dryFruits" }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct({ ...updatedProduct, [name]: value });
  };

  const handleMapClick = useCallback((e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setUpdatedProduct((prevProduct) => ({
      ...prevProduct,
      latitude: lat,
      longitude: lng,
    }));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    // Length validation for description
    if (updatedProduct.description.length < 30 || updatedProduct.description.length > 100) {
      setError("Description must be between 30 and 100 characters.");
      return;
    }

    onUpdate(updatedProduct);
  };

  return (
    <>
      <div className="modal-backdrop fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
        <div className="update-product-form bg-white p-6 rounded-lg max-w-lg w-full relative overflow-hidden">
          <span className="close-button absolute top-0 right-0 p-2 cursor-pointer" onClick={onClose}>
            &times;
          </span>
          <h2 className="text-2xl font-semibold mb-4">Update Product</h2>
          <div className="form-scroll-container max-h-[500px] overflow-y-auto p-2">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name:</label>
                <input
                  type="text"
                  name="name"
                  value={updatedProduct.name}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL:</label>
                <input
                  type="text"
                  name="imageUrl"
                  value={updatedProduct.imageUrl}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description:</label>
                <textarea
                  name="description"
                  value={updatedProduct.description}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price:</label>
                <input
                  type="number"
                  name="price"
                  value={updatedProduct.price}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category:</label>
                <select
                  name="category"
                  value={updatedProduct.category}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address:</label>
                <input
                  type="text"
                  name="address"
                  value={updatedProduct.address}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              {/* Google Map Location Picker */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Product Location</label>
                {isLoaded ? (
                  <GoogleMap
                    mapContainerStyle={{ height: "400px", width: "100%" }}
                    zoom={10}
                    center={{
                      lat: updatedProduct.latitude || 20.5937,
                      lng: updatedProduct.longitude || 78.9629
                    }} // Default to India
                    onClick={handleMapClick}
                  >
                    {updatedProduct.latitude && updatedProduct.longitude && (
                      <Marker position={{ lat: updatedProduct.latitude, lng: updatedProduct.longitude }} />
                    )}
                  </GoogleMap>
                ) : (
                  <p>Loading map...</p>
                )}
              </div>

              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

              <div className="flex justify-between mt-4">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Update</button>
                <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-md">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateProductForm;
