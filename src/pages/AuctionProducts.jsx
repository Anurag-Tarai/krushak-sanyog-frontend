import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AuctionProduct = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceOrder, setPriceOrder] = useState("All");
  const [nameSearch, setNameSearch] = useState("");
  const navigate = useNavigate()

  const dummyProducts = [
    {
      productId: 1,
      name: "Fresh Tomatoes",
      category: "Vegetables",
      description: "Fresh and organic tomatoes.",
      price: 50,
      currentBid: 65,
      imageUrl: "https://via.placeholder.com/200",
      endDate: "2024-12-01",
    },
    {
      productId: 2,
      name: "Almonds",
      category: "Dry Fruits",
      description: "Premium quality almonds.",
      price: 500,
      currentBid: 700,
      imageUrl: "https://via.placeholder.com/200",
      endDate: "2024-12-05",
    },
    {
      productId: 3,
      name: "Milk",
      category: "Dairy Products",
      description: "Pure cow milk.",
      price: 40,
      currentBid: 60,
      imageUrl: "https://via.placeholder.com/200",
      endDate: "2024-11-30",
    },
  ];

  // Filtering logic
  const filteredProducts = dummyProducts.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch =
      nameSearch === "" ||
      product.name.toLowerCase().includes(nameSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="auction-product-page flex flex-col lg:flex-row p-4 bg-gray-50">
      {/* Filter Section */}
      <div className="filter-section w-full lg:w-1/4 p-4 bg-green-100 rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-4 text-green-700">Filter</h2>
        <hr />
        <label className="block mt-4 text-gray-700">Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full mt-1"
        >
          <option value="All">All</option>
          <option value="Vegetables">Vegetables</option>
          <option value="Fruits">Fruits</option>
          <option value="Dairy Products">Dairy Products</option>
          <option value="Dry Fruits">Dry Fruits</option>
        </select>

        <label className="block mt-4 text-gray-700">Price Order:</label>
        <select
          value={priceOrder}
          onChange={(e) => setPriceOrder(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full mt-1"
        >
          <option value="All">All</option>
          <option value="LowToHigh">Low to High</option>
          <option value="HighToLow">High To Low</option>
        </select>
      </div>

      {/* Product List */}
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
            <h1 className="text-center text-red-500 mt-12">
              Product Not Found...
            </h1>
          ) : (
            filteredProducts.map((product) => (
              <div
                className="product-card border border-green-200 rounded-lg shadow-lg p-4 bg-white transition-transform duration-200 transform hover:scale-105 hover:shadow-xl"
                key={product.productId}
              >
                <div className="product-image mb-2 overflow-hidden rounded-lg">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-48 object-cover transition-transform duration-300 transform hover:scale-110"
                  />
                </div>
                <div className="product-info">
                  <h2 className="text-2xl font-bold text-green-700 mb-1">
                    {product.name}
                  </h2>
                  <p className="text-gray-600">
                    <strong>Category:</strong>{" "}
                    <span className="text-green-500">{product.category}</span>
                  </p>
                  <p className="text-gray-600">
                    <strong>Description:</strong>{" "}
                    {product.description.length > 25
                      ? `${product.description.substring(0, 25)}...`
                      : product.description}
                  </p>
                  <h2 className="product-price text-lg font-bold text-green-600 mt-2">
                    Starting Price: ₹ {product.price}
                  </h2>
                  <h2 className="text-lg font-bold text-blue-600">
                    Current Bid: ₹ {product.currentBid}
                  </h2>
                  <p className="text-gray-500">
                    <strong>Ends On:</strong> {product.endDate}
                  </p>

                  <div className="flex justify-center mt-4">
                    <button className="bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600 transition shadow-md hover:shadow-lg"
                    onClick={()=>{navigate("/auction-page")}}>
                      Go to Auction
                    </button>
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

export default AuctionProduct;
  