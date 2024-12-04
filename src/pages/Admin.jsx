import React, { useState, useEffect } from "react";
import AddProduct from "../components/AddProduct";
import AddCustomerAdmin from "../components/AdminUserDetails";
import AddOrderAdmin from "../components/AllOrderAdmin";
import AllProductAdmin from "../components/AllProductAdmin";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import QNAPage from "./QnApage";  // Import the QNAPage
import ChatBoxPage from "./ChatBoxPage"; // Import ChatBoxPage component for live chat

const Admin = () => {
  const [selectedComponent, setSelectedComponent] = useState("all-products");
  const [userName, setUserName] = useState("");
  const [selectedSessionId, setSelectedSessionId] = useState(null);  // Store selected session ID for live chat
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem("name") || "Log In";
    setUserName(name);
  }, []);

  const renderSelectedComponent = () => {
    switch (selectedComponent) {
      case "add-product":
        return <AddProduct />;
      case "all-orders":
        return <AddOrderAdmin />;
      case "add-customer":
        return <AddCustomerAdmin />;
      case "create-auction":
        return <div>Create Auction Session Component</div>;
      case "QNA-page":
        return <QNAPage onSessionClick={handleSessionClick} />;
      case "chat-session":
        // If chat session is selected, render the ChatBoxPage with selected sessionId
        return <ChatBoxPage productId={selectedSessionId} />;
      case "all-products":
      default:
        return <AllProductAdmin />;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminid");
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("name");
    navigate("/");
  };

  const handleSessionClick = (sessionId) => {
    setSelectedSessionId(sessionId);  // Set the session ID for live chat
    setSelectedComponent("chat-session");  // Change component to chat session
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-green-900 text-white p-4 flex items-center justify-between shadow-md">
        <h1 className="text-2xl font-bold tracking-wide mx-auto">FARMER DASHBOARD</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faUser} className="text-lg mr-2" />
            <span className="font-semibold">{userName}</span>
          </div>
          <button
            className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200 flex items-center"
            onClick={handleLogout}
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
            Logout
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-1/4 bg-gray-200 p-4 border-r border-gray-300 flex flex-col">
          <ul className="space-y-2">
            {[
              { name: "Add New Product", value: "add-product" },
              { name: "View All Products", value: "all-products" },
              { name: "Live QNA?", value: "QNA-page" },  // The button to access QNA page
            
              
            ].map((item) => (
              <li
                key={item.value}
                className={`cursor-pointer p-3 rounded-lg text-center bg-green-900 text-white transition duration-200 transform hover:scale-105 hover:bg-green-600 ${
                  selectedComponent === item.value ? "bg-green-900" : ""
                }`}
                onClick={() => setSelectedComponent(item.value)}
              >
                {item.name}
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="bg-white">
            {renderSelectedComponent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
