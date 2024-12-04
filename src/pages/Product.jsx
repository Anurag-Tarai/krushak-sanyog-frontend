import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import api from "../Router/api";
import { useNavigate } from "react-router-dom";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { GOOGLE_MAP_API } from "../api";
import LocationButton from "../components/ProductComponents/LocationButton";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceOrder, setPriceOrder] = useState("All");
  const [nameSearch, setNameSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [radius, setRadius] = useState(2); // Default 2 km
  const [currentLocation, setCurrentLocation] = useState(null);
  let userid = localStorage.getItem("userid");

  const navigate = useNavigate();

  const filterProducts = (category, priceOrder, nameSearch, data, location, radius) => {
    let filteredProducts = data;

    // Convert radius from km to meters for calculation
    const radiusInMeters = radius * 1000;

    // Filter by category
    if (category !== "All") {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === category
      );
    }

    // Filter by name, category, and address
    if (nameSearch !== "") {
      const searchQuery = nameSearch.toLowerCase();
      filteredProducts = filteredProducts.filter((product) => 
        product.name.toLowerCase().includes(searchQuery) || 
        product.category.toLowerCase().includes(searchQuery) ||
        (product.address && product.address.toLowerCase().includes(searchQuery)) // Filter by address
      );
    }

    // Filter by location within radius
    if (location) {
      filteredProducts = filteredProducts.filter((product) => {
        const productLat = product.latitude;
        const productLng = product.longitude;

        const distance = getDistance(location.lat, location.lng, productLat, productLng);
        return distance <= radiusInMeters;
      });
    }

    // Sort by price
    if (priceOrder === "LowToHigh") {
      filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
    } else if (priceOrder === "HighToLow") {
      filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filteredProducts);
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance * 1000; // Convert to meters
  };

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8080/ecom/products/all")
      .then((response) => {
        setProducts(response.data);
        filterProducts(selectedCategory, priceOrder, nameSearch, response.data, currentLocation, radius);
      })
      .catch((error) => {
        console.error("Error fetching data from the API: ", error);
      });
  }, [selectedCategory, priceOrder, nameSearch, currentLocation, radius]);

  const addProductToCart = (productid) => {
    api
      .post(`/ecom/cart/add-product?userId=${userid}&productId=${productid}`)
      .then((response) => {
        localStorage.setItem("cartid", response.data.cartId);
        navigate("/user/cart");
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          alert(error.response.data.message);
        } else {
          if (error.response.status === 401) {
            navigate("/login");
          }
          console.error("Error:", error);
        }
      });
  };

  const handleLocationSelect = (e) => {
    setSelectedLocation({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });
  };

  const handleUseCurrentLocation = () => {
    console.log("Fetching geo location");
   if(!currentLocation){
    navigator.geolocation.getCurrentPosition((position) => {
      setCurrentLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
   }else setCurrentLocation(null)
  };
  console.log(currentLocation);
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

        <div className="mt-4">
          <h4 className="text-lg font-bold text-green-700">Location Filter</h4>
        <LocationButton onClick={handleUseCurrentLocation}/>

          <label className="block mt-4 text-gray-700">Radius (km)</label>
          <input
            type="number"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full mt-1"
          />
        </div>
      </div>

      <div className="product-list w-full lg:w-3/4 p-4">
        <div className="mt-4">
          <h4 className="font-bold">Search by Name / Category / Location</h4>
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
                  <p className="text-gray-600">
                    <strong>Address:</strong> {product.address?.length > 25 ? `${product.address?.substring(0, 25)}...` : product.address}
                  </p>
                  <h2 className="product-price text-lg font-bold text-green-600 mt-2">Available quantity: {product.price} kg</h2>

                  <div className="flex justify-between mt-4">
                    <button 
                      onClick={() => addProductToCart(product.productId)}
                      className="bg-slate-700 hover:bg-slate-800 text-white rounded px-4 py-2 hover:bg-slate-600transition shadow-md hover:shadow-lg">
                      Add to Cart
                    </button>
                    <Link to={`/product/${product.productId}`}>
                      <button className="bg-green-800 text-white rounded px-4 py-2 hover:bg-green-900 transition shadow-md hover:shadow-lg">
                        View Details
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
