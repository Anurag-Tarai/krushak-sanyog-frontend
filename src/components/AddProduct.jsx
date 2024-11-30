import React, { useState } from "react";
import api from "../Router/api";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    imageUrl: "",
    description: "",
    price: 0,
    category: "",
    available: true,
  });

  const [error, setError] = useState(null);

  const categories = [
    { name: "Vegetables", value: "vegetables" },
    { name: "Fruits", value: "fruits" },
    { name: "Dairy Products", value: "dairyProducts" },
    { name: "Herbs and Spices", value: "herbsAndSpices" },
    { name: "Dry Fruits", value: "dryFruits" }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
  
    // Length validation for name and description fields

  
    if (product.description.length < 10 || product.description.length > 50) {
      setError("Description must be between 10 and 50 characters.");
      return;
    }
  
    try {
      const response = await api.post("/ecom/products/add", product);
      console.log("Product added successfully:", response.data);
      setProduct({
        name: "",
        imageUrl: "",
        description: "",
        price: 0,
        category: "",
        available: true,
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
            Price per kg
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
