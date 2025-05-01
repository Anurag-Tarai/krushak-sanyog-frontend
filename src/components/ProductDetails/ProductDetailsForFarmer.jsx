import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../Router/api";
import { GOOGLE_MAP_API } from "../../api";
import UpdateProductForm from "../UpdateProductForm";

// Utility function to generate random coordinates
const getRandomCoordinates = () => {
  const lat = 20 + Math.random() * (30 - 20);
  const lng = 80 + Math.random() * (90 - 80);
  return { lat, lng };
};

const ProductDetailsForFarmer = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");

  const [product, setProduct] = useState({});
  const [farmer, setFarmer] = useState({});
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [mapCoordinates, setMapCoordinates] = useState(getRandomCoordinates());

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updatedQuantity, setUpdatedQuantity] = useState(0);
  const [updatedDescription, setUpdatedDescription] = useState("");

  // Auction State
  const [showAuctionModal, setShowAuctionModal] = useState(false);
  const [auctionDetails, setAuctionDetails] = useState({
    startBid: 0,
    auctionStartTime: "",
    auctionEndTime: "",
  });

  console.log(product);
  

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/ecom/products/${productId}`);
        setProduct(response.data);
        setUpdatedQuantity(response.data.availableQuantity);
        setUpdatedDescription(response.data.description);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };
    fetchProduct();
  }, [productId]);

  useEffect(() => {
    if (product.farmer_id) {
      const fetchFarmer = async () => {
        try {
          const response = await api.get(`/ecom/user/get-user/${product.farmer_id}`);
          setFarmer(response.data);
        } catch (error) {
          console.error("Error fetching farmer details:", error);
        }
      };
      fetchFarmer();
    }
  }, [product]);

  const handleSendMessage = () => {
    if (newMessage) {
      setMessages([...messages, { from: "Farmer", text: newMessage }]);
      setNewMessage("");
    }
  };

  const handleQuantityUpdate = async () => {
    try {
      await api.put(`/ecom/products/update-quantity/${productId}`, {
        availableQuantity: updatedQuantity,
      });
      alert("Quantity updated successfully");
      setProduct(prev => ({
        ...prev,
        availableQuantity: updatedQuantity,
      }));
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Failed to update quantity");
    }
  };

  const updateProduct = () => {
    setSelectedProduct(product);
    setShowUpdateModal(true);
  };

  const closeUpdateModal = () => {
    setSelectedProduct(null);
    setShowUpdateModal(false);
  };

  const handleUpdate = async (updatedProduct) => {
    try {
      await api.put(
        `/ecom/products/update/${updatedProduct.productId}`,
        updatedProduct,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProduct(updatedProduct);
      closeUpdateModal();
      alert("Product updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update product.");
    }
  };

  // Auction creation handler
  const handleCreateAuction = async () => {
    try {
      const auctionData = {
        productId: productId,
        startBid: auctionDetails.startBid,
        auctionStartTime: auctionDetails.auctionStartTime,
        auctionEndTime: auctionDetails.auctionEndTime,
      };
      const response = await api.post(`/ecom/products/create-auction`, auctionData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Auction created successfully!");
      setShowAuctionModal(false);
    } catch (error) {
      console.error("Error creating auction:", error);
      alert("Failed to create auction.");
    }
  };

  useEffect(() => {
    const initMap = () => {
      const lat = product.latitude || mapCoordinates.lat;
      const lng = product.longitude || mapCoordinates.lng;

      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat, lng },
        zoom: 12,
      });

      new window.google.maps.Marker({
        position: { lat, lng },
        map,
        title: "Farmer's Location",
      });
    };

    const loadScript = () => {
      if (!document.querySelector(`script[src*="maps.googleapis.com"]`)) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API}`;
        script.async = true;
        script.defer = true;
        script.onload = initMap;
        document.head.appendChild(script);
      } else {
        initMap();
      }
    };

    loadScript();
  }, [product]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen space-y-10">
      <h1 className="text-4xl font-extrabold text-green-600 text-center">Manage Product</h1>

      {/* Update Modal */}
      {showUpdateModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-6">
          <UpdateProductForm
            product={selectedProduct}
            onUpdate={handleUpdate}
            onClose={closeUpdateModal}
          />
        </div>
      )}

      {/* Auction Modal */}
      {showAuctionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-6">
          <div className="bg-white rounded-xl p-6 space-y-6 w-96">
            <h2 className="text-xl font-semibold text-center">Create Auction</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700">Starting Bid</label>
                <input
                  type="number"
                  value={auctionDetails.startBid}
                  onChange={(e) => setAuctionDetails({ ...auctionDetails, startBid: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl p-2"
                />
              </div>
              <div>
                <label className="block text-gray-700">Auction Start Time</label>
                <input
                  type="datetime-local"
                  value={auctionDetails.auctionStartTime}
                  onChange={(e) => setAuctionDetails({ ...auctionDetails, auctionStartTime: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl p-2"
                />
              </div>
              <div>
                <label className="block text-gray-700">Auction End Time</label>
                <input
                  type="datetime-local"
                  value={auctionDetails.auctionEndTime}
                  onChange={(e) => setAuctionDetails({ ...auctionDetails, auctionEndTime: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl p-2"
                />
              </div>
            </div>
            <div className="flex justify-between">
              <button
                className="bg-red-600 text-white px-6 py-2 rounded-xl"
                onClick={() => setShowAuctionModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 text-white px-6 py-2 rounded-xl"
                onClick={handleCreateAuction}
              >
                Create Auction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product and Chat Section */}
      <div className="flex space-x-10">
        {/* Product Details */}
        <div className="flex space-x-10">
  {/* Product Details */}
  <div className="bg-white shadow-lg rounded-xl p-6 flex-1 space-y-4 flex flex-row">
    <img
      src={product.imageUrl}
      alt={product.name}
      className="w-96 h-50 object-cover rounded-lg shadow-md mr-6" // Image on the left
    />
    <div>
      <p className="text-xl font-semibold">{product.name}</p>
      <p className="text-gray-600">Category: {product.category}</p>
      <p className="text-gray-700">{product.description}</p>
      <p className="text-gray-900 font-bold text-lg">
        Quantity: {product.price} kg
      </p>
    </div>
  </div>
</div>


        {/* Chat Box */}
        <div className="bg-white shadow-lg rounded-xl p-6 flex-1">
          <div className="flex items-center mb-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="border border-gray-300 rounded-xl px-6 py-3 flex-1"
              placeholder="Type your message"
            />
            <button
              className="ml-4 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded-xl shadow-sm">
                <strong className="font-medium">{msg.from}:</strong> {msg.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Buttons Section */}
      <div className="flex justify-between">
        {/* Update and Auction Buttons */}
        <div>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-xl transition duration-300"
            onClick={updateProduct}
          >
            Update Product
          </button>
          <button
            className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-6 rounded-xl mt-4 transition duration-300"
            onClick={() => setShowAuctionModal(true)}
          >
            Create Auction
          </button>
        </div>

        {/* Quantity Update */}
        <div className="flex items-center">
          <input
            type="number"
            value={updatedQuantity}
            onChange={(e) => setUpdatedQuantity(e.target.value)}
            className="border border-gray-300 rounded-xl px-6 py-2 w-24" // smaller width
          />
          <button
            className="ml-4 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
            onClick={handleQuantityUpdate}
          >
           Update Quanity
          </button>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-800">Farmer's Location</h2>
        <div id="map" className="w-full h-60 mt-4 rounded-xl"></div>
      </div>
    </div>
  );
};

export default ProductDetailsForFarmer;
