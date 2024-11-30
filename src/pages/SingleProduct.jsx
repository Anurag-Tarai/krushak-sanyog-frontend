import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from '../Router/api'
import axios from "axios";

const SingleProduct = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
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

  return (
    <>
      <h1 className="text-4xl text-center text-green-600 my-4">Product Details</h1>

      {/* Product and Sidebar Wrapper */}
      <div className="flex flex-wrap justify-between p-6 bg-white shadow-lg rounded-lg">
        
        {/* Product Details Section */}
        <div className="w-full lg:w-2/3 pr-6 mb-6 lg:mb-0">
          <ProductDetails product={product} addProductToCart={addProductToCart} navigate={navigate} />
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

// Component for displaying product details
const ProductDetails = ({ product, addProductToCart, navigate }) => (
  <div className="space-y-2">
    <div className="mb-4">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-80 object-cover rounded-lg"
      />
    </div>
    <h2 className="text-2xl font-semibold text-green-600">{product.name}</h2>
    <p><strong>Category:</strong> {product.category}</p>
    <p><strong>Description:</strong> {product.description}</p>
    <p><strong>Quantity Available:</strong> {product.quantity} kg</p>
    <button
      onClick={() => { addProductToCart(product.productId); navigate("/user/cart"); }}
      className="mt-4 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
    >
      Add to Cart
    </button>
  </div>
);

// Component for displaying the farmer's profile
const FarmerProfile = ({ product }) => (
  <div className="mb-6 flex items-center">
    <img
      src="https://www.shutterstock.com/image-vector/farmer-working-on-field-vector-260nw-2194804755.jpg"
      alt="Farmer"
      className="w-16 h-16 rounded-full mr-4"
    />
    <div>
      <h3 className="text-xl font-semibold text-green-600 mb-2">{product.farmerName}</h3>
      <p><strong>Rating:</strong> {product.farmerRating} ⭐</p>
    </div>
  </div>
);

// Component for displaying farmer's address
const FarmerAddress = ({ product }) => (
  <div className="mb-6">
    <h4 className="text-lg font-semibold text-green-600 mb-2">Address</h4>
    <p>{product.farmerLocation}</p>
  </div>
);

// Component for displaying farmer's contact info
const FarmerContact = ({ product }) => (
  <div className="mb-6">
    <h4 className="text-lg font-semibold text-green-600 mb-2">Contact Info</h4>
    <p>{product.farmerContact}</p>
  </div>
);

// Component for live chat functionality
const LiveChat = ({ messages, newMessage, setNewMessage, handleSendMessage }) => (
  <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
    <h3 className="text-xl font-semibold text-green-600 mb-4">Live Queries</h3>
    <div className="mb-4 max-h-64 overflow-y-auto space-y-2">
      {messages.map((message, index) => (
        <div key={index} className={message.from === "Buyer" ? "text-blue-600" : "text-green-600"}>
          <strong>{message.from}:</strong> {message.text}
        </div>
      ))}
    </div>

    <div className="flex space-x-2">
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type your message..."
        className="w-4/5 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <button
        onClick={handleSendMessage}
        className="w-1/5 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        Send
      </button>
    </div>
  </div>
);

export default SingleProduct;
