import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from '../Router/api'
import axios from "axios";
import { GOOGLE_MAP_API } from "../api";

const SingleProduct = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  
  // Move the function declaration above the useState hook
  const getRandomCoordinates = () => {
    // Generate random latitude and longitude within India (approximate boundaries)
    const lat = 20 + Math.random() * (30 - 20);  // Latitude between 20° and 30°
    const lng = 80 + Math.random() * (90 - 80);  // Longitude between 80° and 90°
  
    return { lat, lng };
  };

  const [product, setProduct] = useState({
    imageUrl: "https://rukminim2.flixcart.com/image/850/1000/xif0q/plant-seed/d/p/t/7500-vnr-iii-premium-vegetable-cauliflower-25g-7500-seeds-original-imagrygybzvugqpf.jpeg?q=90&crop=false", // Dummy image
    name: "Cauliflower",
    category: "Vegetables",
    description: "Fresh curly cabbage grown without pesticides, rich in nutrients and perfect for your meals.",
    quantity: 80, // Quantity in kg
    farmerName: "Ravi Kumar",
    farmerLocation: "Burla, Odisha, India",
    farmerContact: "+91 9876543210",
    farmerRating: 4.7, // Dummy rating
  });
  const [messages, setMessages] = useState([
    { from: "Farmer", text: "Hello, feel free to ask any questions about this product!" },
    { from: "Buyer", text: "What is the price of this cabbage?" }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [mapCoordinates, setMapCoordinates] = useState(getRandomCoordinates()); // Initialize coordinates here
  const userid = localStorage.getItem("userid");

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8080/ecom/products/${productId}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data from the API: ", error);
      });
  }, [productId]);

  const addProductToCart = (productid) => {
    api
      .post(`/ecom/cart/add-product?userId=${userid}&productId=${productid}`)
      .then((response) => {
        localStorage.setItem("cartid", response.data.cartId);
        alert("Product added to Cart.....");
      })
      .catch((error) => {
        alert("Product Already in cart......");
      });
  };

  const handleSendMessage = () => {
    if (newMessage) {
      setMessages([...messages, { from: "Buyer", text: newMessage }]);
      setNewMessage("");
    }
  };

  useEffect(() => {
    // Load Google Maps when the map div is available
    window.initMap = () => {
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: mapCoordinates.lat, lng: mapCoordinates.lng }, // Use coordinates from state
        zoom: 12,
      });
  
      // Add a marker for the random location
      new window.google.maps.Marker({
        position: { lat: mapCoordinates.lat, lng: mapCoordinates.lng },
        map: map,
        title: "Farmer's Location",
      });
    };
  
    // Dynamically load Google Maps API script
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API}&callback=initMap`; // Fixed URL with correct callback
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, [mapCoordinates]);

  return (
    <>
      <h1 className="text-4xl text-center text-green-600 my-4">Product Details</h1>

      {/* Product and Sidebar Wrapper */}
      <div className="flex flex-wrap justify-between p-6 bg-white shadow-lg rounded-lg">
        
        {/* Product Details Section */}
        <div className="w-full lg:w-2/3 pr-6 mb-6 lg:mb-0">
          <ProductDetails product={product} addProductToCart={addProductToCart} navigate={navigate} mapCoordinates={mapCoordinates} />
        </div>

        {/* Sidebar: Farmer Profile, Address, Contact, Rating, and Chat */}
        <div className="w-full lg:w-1/3 pl-6">
          <FarmerProfile product={product} />
          <FarmerAddress product={product} />
          <FarmerContact product={product} />
          <LiveChat messages={messages} newMessage={newMessage} setNewMessage={setNewMessage} handleSendMessage={handleSendMessage} />
        </div>
      </div>

    </>
  );
};

// Farmer Profile Component
const FarmerProfile = ({ product }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow">
      <h3 className="text-xl font-semibold text-green-600">Farmer Profile</h3>
      <p><strong>Name:</strong> {product.farmerName}</p>
      <p><strong>Location:</strong> {product.farmerLocation}</p>
      <p><strong>Rating:</strong> {product.farmerRating} / 5</p>
    </div>
  );
};

// Farmer Address Component
const FarmerAddress = ({ product }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow mt-4">
      <h3 className="text-xl font-semibold text-green-600">Farmer Address</h3>
      <p>{product.farmerLocation}</p>
    </div>
  );
};

// Farmer Contact Component
const FarmerContact = ({ product }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow mt-4">
      <h3 className="text-xl font-semibold text-green-600">Farmer Contact</h3>
      <p><strong>Contact:</strong> {product.farmerContact}</p>
    </div>
  );
};

// Live Chat Component
const LiveChat = ({ messages, newMessage, setNewMessage, handleSendMessage }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow mt-4">
      <h3 className="text-xl font-semibold text-green-600">Live Chat</h3>
      <div className="space-y-2">
        {messages.map((message, index) => (
          <div key={index} className={`text-sm ${message.from === "Farmer" ? "text-green-600" : "text-blue-600"}`}>
            <strong>{message.from}:</strong> {message.text}
          </div>
        ))}
      </div>
      <div className="mt-4">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="w-full p-2 border rounded-lg"
        />
        <button onClick={handleSendMessage} className="mt-2 py-2 px-4 bg-green-600 text-white rounded-lg">
          Send
        </button>
      </div>
    </div>
  );
};

// Component for displaying product details
const ProductDetails = ({ product, addProductToCart, navigate, mapCoordinates }) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap">
        {/* Product Image */}
        <div className="w-full md:w-2/3 mb-4">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-80 object-cover rounded-lg"
          />
        </div>

        {/* Google Map Section */}
        <div className="w-full md:w-1/3 mb-4">
          <div id="map" className="h-80 bg-gray-200 rounded-lg"></div>
        </div>
      </div>

      {/* Product Details */}
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-green-600">{product.name}</h2>
        <p><strong>Category:</strong> {product.category}</p>
        <p><strong>Description:</strong> {product.description}</p>
        <p><strong>Quantity Available:</strong> {product.quantity} kg</p>
        <button
          onClick={() => {
            addProductToCart(product.productId);
            navigate("/user/cart");
          }}
          className="mt-4 py-2 px-4 bg-green-600 text-white rounded-lg"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default SingleProduct;
