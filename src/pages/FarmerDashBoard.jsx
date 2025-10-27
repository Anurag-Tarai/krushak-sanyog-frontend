import React, { useState, useEffect } from "react";
import AddCustomerAdmin from "../components/AdminUserDetails";
import AddOrderAdmin from "../components/AllOrderAdmin";
import AllProductAdmin from "../components/farmer/AllProductFarmer";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import AddProduct from "../components/product/AddProduct";

const FarmerDashBoard = () => {
  const [selectedComponent, setSelectedComponent] = useState("all-products");
  const [userName, setUserName] = useState("");
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [refreshProducts, setRefreshProducts] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem("name") || "Log In";
    setUserName(name);
  }, []);

  const renderSelectedComponent = () => {
    switch (selectedComponent) {
      case "add-product":
        return (
          <AddProduct
            setRefreshProducts={setRefreshProducts}
            setSelectedComponent={setSelectedComponent}
          />
        );
      case "all-products":
        return <AllProductAdmin refresh={refreshProducts} />;
      default:
        return <AllProductAdmin refresh={refreshProducts} />;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("farmerId");
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("name");
    navigate("/");
  };

  const handleSessionClick = (sessionId) => {
    setSelectedSessionId(sessionId);
    setSelectedComponent("chat-session");
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-gray-200">
      {/* 🌿 Header */}
      <header className="bg-gray-900/60 backdrop-blur-md border-b border-gray-700 p-4 flex items-center justify-between shadow-md">
        <h1 className="text-2xl font-bold tracking-wide text-green-400 mx-auto drop-shadow-md">
          FARMER DASHBOARD
        </h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-gray-800/60 px-3 py-1 rounded-lg">
            <FontAwesomeIcon icon={faUser} className="text-green-400 text-lg mr-2" />
            <span className="font-semibold text-gray-100">{userName}</span>
          </div>
          <button
            className="bg-red-600/80 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center transition-all duration-300 hover:scale-105"
            onClick={handleLogout}
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
            Logout
          </button>
        </div>
      </header>

      {/* 🧭 Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* 📂 Sidebar */}
        <aside className="w-1/4 bg-gray-900/70 backdrop-blur-lg border-r border-gray-700 p-6 flex flex-col shadow-xl">
          <ul className="space-y-3">
            {[
              { name: "➕ Add New Product", value: "add-product" },
              { name: "📦 View All Products", value: "all-products" },
            ].map((item) => (
              <li
                key={item.value}
                className={`cursor-pointer p-3 rounded-xl text-center text-sm font-medium transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg ${
                  selectedComponent === item.value
                    ? "bg-green-500 text-gray-900 font-semibold"
                    : "bg-gray-800 text-gray-300 hover:bg-green-600/30 hover:text-green-300"
                }`}
                onClick={() => setSelectedComponent(item.value)}
              >
                {item.name}
              </li>
            ))}
          </ul>

          {/* 🌙 Aesthetic Footer */}
          <div className="mt-auto pt-6 text-xs text-gray-500 border-t border-gray-700 text-center">
            <p>Farmer Portal v2.0</p>
            <p className="text-green-400 mt-1">Powered by FarmerConnect</p>
          </div>
        </aside>

        {/* 🧾 Main Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-950/40 backdrop-blur-sm">
          <div className="bg-gray-900/60 backdrop-blur-lg rounded-2xl p-5 shadow-2xl border border-gray-800 transition-all duration-300">
            {renderSelectedComponent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FarmerDashBoard;
