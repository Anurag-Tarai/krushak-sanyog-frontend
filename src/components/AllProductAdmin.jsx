import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../Router/api"; // Assuming 'api' is a pre-configured axios instance
import UpdateProductForm from "./UpdateProductForm";

const AllProductAdmin = () => {
  const [products, setProducts] = useState([]);
  const [deleted, setDeleted] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Retrieve the token from localStorage (or sessionStorage)
  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://127.0.0.1:8080/ecom/products/all?sort=desc", {
          headers: {
            Authorization: `Bearer ${token}`, // Add JWT token to request
          },
        });
        const sortedProducts = response.data.sort((a, b) => b.productId - a.productId);
        setProducts(sortedProducts);
        setDeleted(false);
      } catch (error) {
        console.error("Error fetching data from the API: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [deleted, token]);

  const updateProduct = (productIdToUpdate) => {
    const productToUpdate = products.find((product) => product.productId === productIdToUpdate);
    setSelectedProduct(productToUpdate);
    setShowUpdateModal(true);
  };

  const closeUpdateModal = () => {
    setSelectedProduct(null);
    setShowUpdateModal(false);
  };

  const handleUpdate = async (updatedProduct) => {
    try {
      const response = await api.put(
        `/ecom/products/update/${updatedProduct.productId}`,
        updatedProduct,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add JWT token to request
          },
        }
      );
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.productId === updatedProduct.productId ? updatedProduct : product
        )
      );
      closeUpdateModal();
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const deleteProduct = async (productIdToDelete) => {
    try {
      console.log(token);
      
      await api.delete(`/ecom/products/${productIdToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add JWT token to request
        },
      });
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.productId !== productIdToDelete)
      );
      setDeleted(true);
    } catch (error) {
      console.error("Error deleting product: ", error);
    }
  };

  return (
    <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 min-h-screen">
      <h1 className="text-3xl font-extrabold text-green-800 mb-6">Product Management</h1>

      {isLoading ? (
        <div className="text-green-700 font-semibold">Loading...</div>
      ) : (
        <>
          {showUpdateModal && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center p-4 z-50">
              <UpdateProductForm
                product={selectedProduct}
                onUpdate={handleUpdate}
                onClose={closeUpdateModal}
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
            {products.map((product) => (
              <div
                key={product.productId}
                className="bg-white border border-green-200 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="object-cover w-full h-full transition-opacity duration-300 hover:opacity-80"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-25 hover:bg-opacity-10 transition-opacity duration-300"></div>
                </div>
                <div className="p-4 text-left">
                  <h2 className="text-lg font-bold text-green-700">{product.name}</h2>
                  <p className="text-green-600 text-xs font-medium">ID: {product.productId}</p>
                  <p className="text-green-500 text-sm font-medium">Category: {product.category}</p>
                  <p className="text-gray-600 text-sm mt-2">
                    Description:{" "}
                    {product.description.length > 50
                      ? `${product.description.substring(0, 50)}...`
                      : product.description}
                  </p>
                  <p className="text-green-800 font-semibold mt-2">Price: ₹ {product.price}</p>
                  <div className="mt-4 flex justify-between">
                    <button
                      className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white py-2 px-4 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
                      onClick={() => updateProduct(product.productId)}
                    >
                      Update
                    </button>
                    <button
                      className="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white py-2 px-4 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
                      onClick={() => deleteProduct(product.productId)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AllProductAdmin;
