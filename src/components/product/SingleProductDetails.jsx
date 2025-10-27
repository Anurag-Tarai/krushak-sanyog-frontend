import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useHistory } from "react-router-dom"; // For getting the productId from URL
import UpdateProductForm from "./UpdateProductForm"; // Assuming your UpdateProductForm component is reusable

const SingleProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { productId } = useParams(); // Getting productId from URL params
  const history = useHistory(); // To redirect back to the All Product page

  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8080/ecom/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product details: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductDetails();
  }, [productId, token]);

  const handleUpdate = async (updatedProduct) => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:8080/ecom/products/update/${updatedProduct.productId}`,
        updatedProduct,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProduct(response.data);
      setShowUpdateModal(false);
    } catch (error) {
      console.log("Error updating product: ", error);
    }
  };

  const closeUpdateModal = () => {
    setShowUpdateModal(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 min-h-screen">
      <h1 className="text-3xl font-extrabold text-green-800 mb-6">Product Details</h1>

      {showUpdateModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center p-4 z-50">
          <UpdateProductForm product={product} onUpdate={handleUpdate} onClose={closeUpdateModal} />
        </div>
      )}

      <div className="bg-white border border-green-200 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-green-700">{product.name}</h2>
        <p className="text-green-600 text-xs font-medium">ID: {product.productId}</p>
        <p className="text-green-500 text-sm font-medium">Category: {product.category}</p>
        <p className="text-gray-600 text-sm mt-2">Description: {product.description}</p>
        <p className="text-green-800 font-semibold mt-2">Price: {product.price} kg</p>
        <p className="text-green-800 font-semibold mt-2">Available Quantity: {product.availableQuantity} kg</p>
        <div className="mt-4 flex justify-between">
          <button
            className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white py-2 px-4 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
            onClick={() => setShowUpdateModal(true)}
          >
            Update Product
          </button>
          <button
            className="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white py-2 px-4 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
            onClick={() => history.push("/admin/products")} // Navigate back to the all products page
          >
            Back to All Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleProductDetails;
