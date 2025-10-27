import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from '../Router/api'
import axios from "axios";
import { GOOGLE_MAP_API } from "../api/api";
import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";



const SingleProduct = () => {
  const userId = localStorage.getItem("userid")
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
    imageUrl: "https://5.imimg.com/data5/SELLER/Default/2022/6/IX/CW/FY/31131351/all-you-need-to-know-about-okra-health-benefits-jpg-500x500.jpg",
    name: "Bhindi",
    category: "vegetables",
    description: "A green, elongated vegetable with a slimy texture when cooked.",
    price: 138,
    farmer_id: 1,
    address: "Village Jharberia, P.O. Kothagadia, Khordha District, Odisha - 752045",
    available: true,
    latitude: 19.932041306115536,
    longitude: 85.14404296875,
    productId: 9,
    reviews: [],
    variants:""
  });

  const [farmer, setFarmer] = useState({
    userId: 0,
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    registerTime: "",
    userAccountStatus: "",
    address: [],
  });

  
 const [messages, setMessages] = useState([]);
   const [newMessage, setNewMessage] = useState("");
   const token = localStorage.getItem("jwtToken");

   const handleSendMessage = async () => {
    const userId = localStorage.getItem("userid"); // fetch adminid from localStorage
    const productId = product.productId;
  
    if (!newMessage.trim()) return;
  
    const commentPayload = {
      userId: parseInt(userId),
      productId: parseInt(productId),
      content: newMessage.trim(),
    };
  
    try {
      await api.post("/ecom/comments/add", commentPayload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Optionally, update the UI (e.g., chat messages or comments)
      setMessages([...messages, { from: "You", text: newMessage }]);
      setNewMessage("");
    } catch (error) {
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Status code:", error.response.status);
        console.error("Headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up the request:", error.message);
      }
    
      alert("Error posting comment. Please try again.");
    }
    
  };

  console.log(product.farmer_id);
  

  // Use effect to fetch product chat data

  useEffect(() => {
    const interval = setInterval(() => {
  
      api.get(`/ecom/comments/product/${productId}`)
        .then(res => {
          const fetchedMessages = res.data
            .filter(comment =>
              comment.role === 'ROLE_USER' ||
              (comment.role === 'ROLE_ADMIN' && String(comment.userId) === String(product.farmer_id))
            )
            .map(comment => ({
              from: comment.username || `User ${comment.userId}`,
              text: comment.content,
              role: comment.role,
            }));
          setMessages(fetchedMessages);
        });
    }, 500);
  
    return () => clearInterval(interval);
  }, [productId]);

  const [mapCoordinates, setMapCoordinates] = useState(getRandomCoordinates()); // Initialize coordinates here
  const userid = localStorage.getItem("userid");

  console.log("this is product Id ", productId);
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/ecom/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        });
        
        const fetchedProduct = response.data;
        
        // Map fetched data to match the product state
        setProduct({
          imageUrl: fetchedProduct.imageUrl || "", // Fallback in case imageUrl is missing
          name: fetchedProduct.name || "Unknown Product",
          category: fetchedProduct.category || "Uncategorized",
          description: fetchedProduct.description || "No description available.",
          price: fetchedProduct.price || 0,
          farmer_id: fetchedProduct.farmer_id || 0,
          address: fetchedProduct.address || "Address not available.",
          available: fetchedProduct.available ?? true, // Defaults to true if undefined
          latitude: fetchedProduct.latitude || 0,
          longitude: fetchedProduct.longitude || 0,
          productId: fetchedProduct.productId || 0,
          reviews: fetchedProduct.reviews || [],
          variants : fetchedProduct.variants
        });
        
        console.log("Fetched product:", fetchedProduct);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };
  
    fetchProduct();
  }, [productId]);
  
  
console.log("this is product data", product.price);


// useEffect to fetch Farmer details
useEffect(() => {
  const fetchUser = async () => {
    try {
      const response = await api.get(`/ecom/user/get-user/${product.farmer_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });

      const fetchedUser = response.data;

      // Map fetched data to match the user state
      setFarmer({
        userId: fetchedUser.userId || 0,
        email: fetchedUser.email || "Email not available",
        firstName: fetchedUser.firstName || "Unknown",
        lastName: fetchedUser.lastName || "",
        phoneNumber: fetchedUser.phoneNumber || "Phone number not available",
        registerTime: fetchedUser.registerTime || "Registration time not available",
        userAccountStatus: fetchedUser.userAccountStatus || "Status not available",
        address: fetchedUser.address || [],
      });

      console.log("Fetched user:", fetchedUser);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  fetchUser();
}, [productId]);

console.log("farmer data ", farmer);


const addProductToCart = (productId) => {
  console.log("this is product Id", productId);  // Ensure the parameter is named correctly
  api
    .post(`/ecom/cart/add-product?userId=${userId}&productId=${productId}`)
    .then((response) => {
      localStorage.setItem("cartid", response.data.cartId);
      alert("Product added to Cart.....");
    })
    .catch((error) => {
      alert("Product Already in cart......");
    });
};


 useEffect(() => {
  // Function to initialize the Google Map
  const initMap = () => {
    const map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: product.latitude || mapCoordinates.lat, lng: product.longitude || mapCoordinates.lng },
      zoom: 12,
    });

    // Add a marker for the farmer's location
    new window.google.maps.Marker({
      position: { lat: product.latitude || mapCoordinates.lat, lng: product.longitude || mapCoordinates.lng },
      map: map,
      title: "Farmer's Location",
    });
  };

  // Load Google Maps API script dynamically
  const loadGoogleMapsScript = () => {
    if (!document.querySelector(`script[src*="maps.googleapis.com"]`)) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API}&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    } else {
      // Script already loaded; directly initialize the map
      if (window.google && window.google.maps) {
        initMap();
      }
    }
  };

  // Set global callback for Google Maps
  window.initMap = initMap;

  // Load the script or initialize the map
  loadGoogleMapsScript();
}, [product.latitude, product.longitude]);


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
          <FarmerProfile farmer={farmer} />
          <FarmerAddress product={product} />
          <FarmerContact farmer={farmer} />
          <LiveChat messages={messages} newMessage={newMessage} setNewMessage={setNewMessage} handleSendMessage={handleSendMessage} />
        </div>
      </div>

    </>
  );
};

// Farmer Profile Component
const FarmerProfile = ({ farmer }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow">
      <h3 className="text-xl font-semibold text-green-600">Farmer Profile</h3>
      <p><strong>Name:</strong> {farmer.firstName +" "+farmer.lastName}</p>
      <p><strong>Rating:</strong> -- </p>
    </div>
  );
};

// Farmer Address Component
const FarmerAddress = ({ product }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow mt-4">
      <h3 className="text-xl font-semibold text-green-600">Farmer Address</h3>
      <p>{product.address}</p>
    </div>
  );
};

// Farmer Contact Component
const FarmerContact = ({ farmer }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow mt-4">
      <h3 className="text-xl font-semibold text-green-600">Farmer Contact</h3>
      <p><strong>Contact:</strong> {farmer.phoneNumber}</p>
    </div>
  );
};

// Live Chat Component
const LiveChat = ({ messages, newMessage, setNewMessage, handleSendMessage }) => {
  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 flex-1 flex flex-col h-96">
  <h2 className="text-xl font-bold text-green-800 mb-4">Live Chat</h2>

  {/* Messages */}
  <div className="flex-1 overflow-y-auto border rounded-lg p-4 mb-4 space-y-2">
  {messages.map((msg, index) => (
    <div
      key={index}
      className={`p-2 rounded-lg ${
        msg.role === "ROLE_ADMIN"
          ? "bg-green-100"
          : msg.from === "You"
          ? "bg-green-100 text-right"
          : "bg-gray-100"
      }`}
    >
      <p className="text-sm font-medium">{msg.from}</p>
      <p>{msg.text}</p>
    </div>
  ))}
</div>

  {/* Input and Send Button */}
  <div className="flex items-center space-x-4">
  <input
    type="text"
    value={newMessage}
    onChange={(e) => setNewMessage(e.target.value)}
    placeholder="Type a message..."
    className="flex-1 border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
  />
  <button
    onClick={handleSendMessage}
    className="bg-green-800 hover:bg-green-900 text-white px-4 py-2 rounded-xl"
  >
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
  <div className="w-full md:w-3/5 mb-4 md:mr-10">
    <img
      src={product.imageUrl}
      alt={product.name}
      className="w-full h-80 object-cover rounded-lg shadow-lg"
    />
  </div>

  {/* Google Map Section */}
  <div className="w-full md:w-1/3 mb-4">
    <div id="map" className="h-80 bg-gray-200 rounded-lg shadow-lg"></div>
  </div>
</div>



      {/* Product Details */}
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-green-600">{product.name}</h2>
        <p><strong>Category:</strong> {product.category}</p>
        <p><strong>Description:</strong> {product.description}</p>
        <p><strong>Quantity Available:</strong> {product.price} kg</p>
        <p><strong>Variants Available:</strong> {product.variants}</p>
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
