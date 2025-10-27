import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../Router/api";
import LocationButton from "../components/product/LocationButton";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceOrder, setPriceOrder] = useState("All");
  const [nameSearch, setNameSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [radius, setRadius] = useState(2);
  const [currentLocation, setCurrentLocation] = useState(null);
  const navigate = useNavigate();
  let userid = localStorage.getItem("userid");

  const filterProducts = (
    category,
    priceOrder,
    nameSearch,
    data,
    location,
    radius
  ) => {
    let filteredProducts = data;
    const radiusInMeters = radius * 1000;

    if (category !== "All") {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === category
      );
    }

    if (nameSearch !== "") {
      const searchQuery = nameSearch.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery) ||
          product.category.toLowerCase().includes(searchQuery) ||
          (product.address &&
            product.address.toLowerCase().includes(searchQuery))
      );
    }

    if (location) {
      filteredProducts = filteredProducts.filter((product) => {
        const distance = getDistance(
          location.lat,
          location.lng,
          product.latitude,
          product.longitude
        );
        return distance <= radiusInMeters;
      });
    }

    if (priceOrder === "LowToHigh") {
      filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
    } else if (priceOrder === "HighToLow") {
      filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filteredProducts);
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 1000;
  };

  useEffect(() => {
    api
      .get("/api/v1/products")
      .then((response) => {
        setProducts(response.data);
        filterProducts(
          selectedCategory,
          priceOrder,
          nameSearch,
          response.data,
          currentLocation,
          radius
        );
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, [selectedCategory, priceOrder, nameSearch, currentLocation, radius]);

  const addProductToCart = (productid) => {
    api
      .post(`/ecom/cart/add-product?userId=${userid}&productId=${productid}`)
      .then((response) => {
        localStorage.setItem("cartid", response.data.cartId);
        navigate("/user/cart");
      })
      .catch((error) => {
        if (error.response?.status === 401) navigate("/login");
        else alert(error.response?.data?.message || "Error adding to cart");
      });
  };

  const handleUseCurrentLocation = () => {
    if (!currentLocation) {
      navigator.geolocation.getCurrentPosition((pos) =>
        setCurrentLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        })
      );
    } else setCurrentLocation(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900 text-gray-100 pt-24 px-4 lg:px-10">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* 🌿 Filter Panel */}
        <div className="w-full lg:w-1/4 bg-gray-900/80 border border-green-800/30 backdrop-blur-md rounded-2xl p-6 shadow-[0_0_30px_rgba(34,197,94,0.08)]">
          <h2 className="text-xl font-bold text-green-400 mb-4">
            Filter Products
          </h2>
          <hr className="border-green-800/30 mb-4" />

          <label className="block text-gray-300 mt-2 mb-1">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-800/70 border border-green-800/40 text-gray-100 rounded-lg p-2 w-full focus:ring-2 focus:ring-green-500"
          >
            <option value="All">All</option>
            <option value="vegetables">Vegetables</option>
            <option value="fruits">Fruits</option>
            <option value="dairyProducts">Dairy Products</option>
            <option value="dryFruits">Dry Fruits</option>
          </select>

          <div className="mt-6">
            <h4 className="text-lg font-semibold text-green-400">
              Location Filter
            </h4>
            <LocationButton onClick={handleUseCurrentLocation} />

            <label className="block mt-4 text-gray-300">Radius (km)</label>
            <input
              type="number"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              className="bg-gray-800/70 border border-green-800/40 text-gray-100 rounded-lg p-2 w-full focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* 🛒 Product List */}
        <div className="w-full lg:w-3/4">
          {/* 🔍 Search Section */}
          <div className="flex flex-col sm:flex-row items-center justify-end mb-6">
            <div className="flex items-center gap-2 bg-gray-800/80 border border-green-800/40 rounded-lg p-2 w-full sm:w-[60%] md:w-[45%]">
              <input
                type="text"
                placeholder="Search by name, category or address..."
                value={nameSearch}
                onChange={(e) => setNameSearch(e.target.value)}
                className="bg-transparent flex-grow outline-none text-gray-100 placeholder-gray-400 text-sm"
              />
              <button
                onClick={() =>
                  filterProducts(
                    selectedCategory,
                    priceOrder,
                    nameSearch,
                    products,
                    currentLocation,
                    radius
                  )
                }
                className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded-md text-sm transition"
              >
                Search
              </button>
            </div>
          </div>

          {/* 🧺 Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full flex justify-center mt-20">
  <div
    className="bg-gradient-to-r from-green-800/20 via-green-600/10 to-green-800/20 
               px-8 py-5 rounded-2xl border border-green-700/40 
               shadow-[0_0_25px_rgba(34,197,94,0.1)] transform translate-x-[-220px]"
  >
    <h1
      className="text-xl font-semibold text-[#86efac] tracking-wide 
                 drop-shadow-[0_0_5px_rgba(34,197,94,0.4)]"
    >
      🌿 Products Not Found...
    </h1>
  </div>
</div>

            ) : (
              filteredProducts.map((product) => (
                <div
                  key={product.productId}
                  className="bg-gray-900/90 border border-green-800/30 rounded-2xl p-4 shadow-[0_0_30px_rgba(34,197,94,0.08)] hover:scale-[1.03] transition-all duration-300"
                >
                  <div className="overflow-hidden rounded-xl mb-3">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-48 object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-green-400 mb-1">
                    {product.name}
                  </h2>
                  <p className="text-gray-400 text-sm mb-1">
                    <strong>Category:</strong> {product.category}
                  </p>
                  <p className="text-gray-400 text-sm mb-1">
                    <strong>Description:</strong>{" "}
                    {product.description.length > 25
                      ? `${product.description.substring(0, 25)}...`
                      : product.description}
                  </p>
                  <p className="text-gray-400 text-sm mb-2">
                    <strong>Address:</strong>{" "}
                    {product.address?.length > 25
                      ? `${product.address.substring(0, 25)}...`
                      : product.address}
                  </p>

                  <h2 className="text-lg font-semibold text-green-300 mb-3">
                    Available: {product.price} kg
                  </h2>

                  <div className="flex justify-between">
                    <button
                      onClick={() => addProductToCart(product.productId)}
                      className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition shadow-md"
                    >
                      Add to Cart
                    </button>
                    <Link to={`/product/${product.productId}`}>
                      <button className="bg-gray-800 border border-green-700 text-green-300 px-4 py-2 rounded-lg hover:bg-green-700/20 transition shadow-md">
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
