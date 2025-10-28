import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../Router/api";
import { GOOGLE_MAP_API } from "../../api/api";
import UpdateProductForm from "./UpdateProductForm";
import ImageSlider from "../common/ImageSlider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import ImageEditDialog from "../common/ImageEditDialog";
import { Send } from "lucide-react";

const getRandomCoordinates = () => ({
  lat: 20 + Math.random() * 10,
  lng: 80 + Math.random() * 10,
});

const ProductDetailsForFarmer = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");

  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(0);
  const [updatedQuantity, setUpdatedQuantity] = useState(0);
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [farmer, setFarmer] = useState({});
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [mapCoordinates, setMapCoordinates] = useState(getRandomCoordinates());
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [userName, setUserName] = useState("");
  // Add this new state with others:
 const [showImageViewer, setShowImageViewer] = useState(false);


  // 🔹 Fetch Product Details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/api/v1/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProduct(response.data);
        setUpdatedQuantity(response.data.availableQuantity);
        setUpdatedDescription(response.data.description);
        setQuantity(response.data.availableQuantity);
      } catch (error) {
        console.error("Error fetching product details:", error);
        alert("Failed to load product details.");
      }
    };
    fetchProduct();
  }, [productId, token]);

  // 🔹 Fetch Farmer Info
  useEffect(() => {
    if (product.farmer_id) {
      const fetchFarmer = async () => {
        try {
          const response = await api.get(
            `/ecom/user/get-user/${product.farmer_id}`
          );
          setFarmer(response.data);
        } catch (error) {
          console.error("Error fetching farmer:", error);
        }
      };
      fetchFarmer();
    }
  }, [product]);

  // 🔹 Send Chat Message
  const handleSendMessage = async () => {
    const userId = localStorage.getItem("farmerId");
    if (!newMessage.trim()) return;

    const payload = {
      userId: parseInt(userId),
      productId: parseInt(productId),
      content: newMessage.trim(),
    };

    try {
      await api.post("/ecom/comments/add", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages([...messages, { from: "You", text: newMessage }]);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to post comment:", error);
      alert("Error posting comment. Please try again.");
    }
  };

  // 🔹 Update Quantity
  const handleQuantityUpdate = async () => {
    try {
      const updatedProduct = {
        ...product,
        availableQuantity: parseFloat(updatedQuantity),
      };
      const response = await api.put(
        `/api/v1/products/${productId}`,
        updatedProduct,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProduct(response.data);
      setQuantity(response.data.availableQuantity);
      alert("Quantity updated successfully!");
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Failed to update quantity.");
    }
  };

  // 🔹 Modals
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
      const response = await api.put(
        `/api/v1/products/${updatedProduct.productId}`,
        updatedProduct,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProduct(response.data);
      closeUpdateModal();
      alert("Product updated successfully!");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product.");
    }
  };

  // 🔹 Google Map
  useEffect(() => {
    const initMap = () => {
      const lat = product.latitude || mapCoordinates.lat;
      const lng = product.longitude || mapCoordinates.lng;
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat, lng },
        zoom: 12,
      });
      new window.google.maps.Marker({ position: { lat, lng }, map });
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

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    const name = localStorage.getItem("name") || "Log In";
    setUserName(name);
  }, []);

  return (
    <div className="relative min-h-screen mt-10 text-gray-200 bg-gradient-to-br from-[#0b0c0f] via-[#121315] to-[#0a0b0d]">
      {/* Subtle diagonal grey slash lighting overlay */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.02)_0,rgba(255,255,255,0.02)_2px,transparent_2px,transparent_6px)] mix-blend-overlay pointer-events-none"></div>

      <div className="p-8 space-y-10 relative z-10">
        {/* 🔸 Update Product Modal */}
        {showUpdateModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50 overflow-y-auto">
            <div className="max-h-[90vh] overflow-y-auto">
              <UpdateProductForm
                product={selectedProduct}
                onUpdate={(updatedProduct) => {
                  setProduct(updatedProduct);
                  setShowUpdateModal(false);
                }}
                onClose={closeUpdateModal}
              />
            </div>
          </div>
        )}

        {/* 🔸 Image Edit Dialog */}
        {showImageDialog && (
          <ImageEditDialog
            productId={productId}
            token={token}
            product={product}
            onUpdate={(updated) => setProduct(updated)}
            onClose={() => setShowImageDialog(false)}
          />
        )}

        {/* 🔸 Product + Chat Section */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Product Details */}
          <div className="bg-gray-900 border border-gray-700 shadow-2xl rounded-2xl p-8 flex-1 flex flex-col lg:flex-row gap-8 transition duration-300">
        
            {/* 🔹 Image Slider */}
<div className="relative w-full lg:w-[420px] h-[300px] rounded-2xl overflow-hidden shadow-md">
  {Array.isArray(product.imageUrls) && product.imageUrls.length > 0 ? (
    <>
      <ImageSlider images={product.imageUrls} />

      {/* 🔸 View Button (bottom-left corner) */}
      <button
        onClick={() => setShowImageViewer(true)}
        className="absolute bottom-3 left-3 bg-black/60 hover:bg-black/80 text-white text-xs px-3 py-1 rounded-lg shadow-md transition duration-300"
      >
        View
      </button>
    </>
  ) : (
    <img
      src="/placeholder.jpg"
      alt="No Image"
      className="w-full h-full object-cover opacity-80"
    />
  )}
</div>


            {/* 🔹 Product Info */}
            <div className="space-y-3 text-gray-300">
              <p className="text-2xl font-semibold text-green-400 tracking-wide">
                {product.name}
              </p>
              <p>
                <strong>Category:</strong> {product.category}
              </p>
              <p>
                <strong>Description:</strong> {product.description}
              </p>
              <p>
                <strong>Quantity:</strong> {product.quantity} kg
              </p>
              <p>
                <strong>Variants:</strong> {product.variants}
              </p>
              <p>
                <strong>Address:</strong> {product.address}
              </p>

              {/* 🔸 Edit Images Button */}
              <button
                onClick={() => setShowImageDialog(true)}
                className="mt-4 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg shadow-md transition duration-300"
              >
                Edit Images
              </button>
            </div>
          </div>

          {/* Chat Box */}
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 flex flex-col lg:w-[360px] h-[400px] shadow-2xl">
            <h2 className="text-lg font-bold text-green-400 mb-3">Live Chat</h2>
            <div className="flex-1 overflow-y-auto bg-gray-800 p-3 rounded-lg mb-3 space-y-2">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-lg text-sm ${
                    msg.role === "ROLE_FARMER"
                      ? "bg-green-700 text-white"
                      : msg.from === "You"
                      ? "bg-green-600 text-white text-right"
                      : "bg-gray-700 text-gray-100"
                  }`}
                >
                  <p className="font-semibold">{msg.from}</p>
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-gray-800 border border-green-600 rounded-xl px-3 py-2 text-gray-200 focus:ring-2 focus:ring-green-600 outline-none"
              />
              <button
                onClick={handleSendMessage}
                className="bg-green-700 hover:bg-green-800 text-white px-2.5 py-1.5 rounded-lg text-sm flex items-center gap-1.5 transition duration-300"
              >
                <Send size={14} className="text-white" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </div>
        </div>

        {/* 🔸 Buttons Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
          <div className="space-x-4">
            <button
              className="bg-green-700 hover:bg-green-800 text-white py-2 px-6 rounded-xl shadow-md transition duration-300"
              onClick={updateProduct}
            >
              Update Product
            </button>
            <button
              onClick={() => navigate("/farmer/dashboard")}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-xl shadow-md transition duration-300"
            >
              Return to Dashboard
            </button>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={updatedQuantity}
              onChange={(e) => setUpdatedQuantity(e.target.value)}
              className="bg-gray-800 border border-green-600 text-white focus:ring-2 focus:ring-green-600 outline-none py-2 px-6 rounded-xl shadow-md transition duration-300"
            />
            <button
              className="bg-green-700 hover:bg-green-800 text-white py-2 px-6 rounded-xl shadow-md transition duration-300"
              onClick={handleQuantityUpdate}
            >
              Update Quantity
            </button>
          </div>
        </div>

        {/* 🔸 Map Section */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-2xl font-bold text-green-400 mb-2">
            Farmer’s Location
          </h2>
          <div
            id="map"
            className="w-full h-60 mt-4 rounded-xl border border-green-700 shadow-inner"
          ></div>
        </div>
      </div>
      {/* 🔸 Fullscreen Image Viewer */}
{showImageViewer && (
  <div
    className="fixed inset-0 bg-black bg-opacity-90 backdrop-blur-sm flex justify-center items-center z-[100]"
    onClick={() => setShowImageViewer(false)}
  >
    <div
      className="relative w-[90%] max-w-4xl h-[80vh] bg-gray-900 rounded-2xl overflow-hidden"
      onClick={(e) => e.stopPropagation()} // prevents accidental close
    >
      <button
        onClick={() => setShowImageViewer(false)}
        className="absolute top-4 right-4 bg-gray-800 hover:bg-gray-700 text-white rounded-full px-3 py-1 z-10"
      >
        ✕
      </button>

      {/* Fullscreen Slider */}
      <ImageSlider images={product.imageUrls} />
    </div>
  </div>
)}

    </div>
  );
};

export default ProductDetailsForFarmer;
