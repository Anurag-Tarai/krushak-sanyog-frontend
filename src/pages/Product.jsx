import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import api from "../Router/api";
import { useNavigate } from "react-router-dom";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceOrder, setPriceOrder] = useState("All");
  const [nameSearch, setNameSearch] = useState("");
  let userid = localStorage.getItem("userid");

  const navigate = useNavigate();

  const filterProducts = (category, priceOrder, nameSearch, data) => {
    let filteredProducts = data;

    // Filter by category
    if (category !== "All") {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === category
      );
    }

    // Filter by name and category
    if (nameSearch !== "") {
      const searchQuery = nameSearch.toLowerCase();
      filteredProducts = filteredProducts.filter((product) => 
        product.name.toLowerCase().includes(searchQuery) || 
        product.category.toLowerCase().includes(searchQuery)
      );
    }

    // Sort by price
    if (priceOrder === "LowToHigh") {
      filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
    } else if (priceOrder === "HighToLow") {
      filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filteredProducts);
  };

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8080/ecom/products/all")
      .then((response) => {
        setProducts(response.data);
        filterProducts(selectedCategory, priceOrder, nameSearch, response.data);
      })
      .catch((error) => {
        console.error("Error fetching data from the API: ", error);
      });
  }, [selectedCategory, priceOrder, nameSearch]);

  const addProductToCart = (productid) => {
    api
      .post(`/ecom/cart/add-product?userId=${userid}&productId=${productid}`)
      .then((response) => {
        localStorage.setItem("cartid", response.data.cartId);
        //alert("Product added to Cart");
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          alert(error.response.data.message);
        } else {
          // alert("Error adding Product. Please try again later.");
          if(error.response.status == 401){
            navigate("/login");
          }
          console.error("Error:", error);
        }
      });
  };

  // const handleCartClick = () => {
  //   if (!userId) {
  //     localStorage.setItem("lastPage", "/user/cart");
  //     navigate("/login");
  //   } else {
  //     navigate("/user/cart");
  //   }
  // };

  return (
    <div className="product-page flex flex-col lg:flex-row p-4 bg-gray-50">
      <div className="filter-section w-full lg:w-1/4 p-4 bg-green-100 rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-4 text-green-700">Filter</h2>
        <hr />
        <label className="block mt-4 text-gray-700">Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
          }}
          className="border border-gray-300 rounded p-2 w-full mt-1"
        >
          <option value="All">All</option>
          <option value="vegetables">Vegetables</option>
          <option value="fruits">Fruits</option>
          <option value="dairyProducts">Dairy Products</option>
          <option value="dryFruits">Dry Fruits</option>
        </select>

        <label className="block mt-4 text-gray-700">Price:</label>
        <select
          value={priceOrder}
          onChange={(e) => {
            setPriceOrder(e.target.value);
          }}
          className="border border-gray-300 rounded p-2 w-full mt-1"
        >
          <option value="All">All</option>
          <option value="LowToHigh">Low to High</option>
          <option value="HighToLow">High To Low</option>
        </select>
      </div>

      <div className="product-list w-full lg:w-3/4 p-4">
        <div className="mt-4">
          <h4 className="font-bold">Search by Name / Category</h4>
          <div className="flex justify-center mt-2">
            <input
              type="text"
              placeholder="Search"
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              className="border border-gray-600 rounded-lg p-2 w-2/3 md:w-1/2 lg:w-1/3 transition duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {filteredProducts.length === 0 ? (
            <h1 className="text-center text-red-500 mt-12">Product Not found...</h1>
          ) : (
            filteredProducts.map((product) => (
              <div className="product-card border border-green-200 rounded-lg shadow-lg p-4 bg-white transition-transform duration-200 transform hover:scale-105 hover:shadow-xl" key={product.productId}>
                <div className="product-image mb-2 overflow-hidden rounded-lg">
                  <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover transition-transform duration-300 transform hover:scale-110" />
                </div>
                <div className="product-info">
                  <h2 className="text-2xl font-bold text-green-700 mb-1">{product.name}</h2>
                  <p className="text-gray-600">
                    <strong>Category:</strong> <span className="text-green-500">{product.category}</span>
                  </p>
                  <p className="text-gray-600">
                    <strong>Description:</strong> {product.description.length > 25 ? `${product.description.substring(0, 25)}...` : product.description}
                  </p>
                  <h2 className="product-price text-lg font-bold text-green-600 mt-2">Price: ₹ {product.price}</h2>
                  <p className="text-gray-500">
                    <strong>Rating:</strong> {product.reviews.length === 0 ? "Not Available" : product.reviews[0].rating}
                  </p>

                  <div className="flex justify-between mt-4">
                    <button 
                      onClick={() => addProductToCart(product.productId)}
                      className="bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600 transition shadow-md hover:shadow-lg">
                      Add to Cart
                    </button>
                    <Link to={`/product/${product.productId}`}>
                      <button className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition shadow-md hover:shadow-lg">
                        View
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
