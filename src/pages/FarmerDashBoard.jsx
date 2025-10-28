import React, { useState, useEffect } from "react";
import AddCustomerAdmin from "../components/AdminUserDetails";
import AddOrderAdmin from "../components/AllOrderAdmin";
import AllProductAdmin from "../components/farmer/AllProductFarmer";
import { useNavigate } from "react-router-dom";
import AddProduct from "../components/product/AddProduct";

const FarmerDashBoard = () => {
  const [selectedComponent, setSelectedComponent] = useState("all-products");
  const [userName, setUserName] = useState("");
  const [refreshProducts, setRefreshProducts] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem("name") || "Farmer";
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

  return (
    <div className="flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-64px)] mt-16 bg-gradient-to-b from-gray-950 via-black to-gray-900 text-gray-100 animate-fadeIn">
      {/* 🌿 Sidebar */}
      <aside className="mt-4 w-full lg:w-1/4 bg-gradient-to-b from-gray-900 via-black to-gray-900 backdrop-blur-md p-4 sm:p-6 flex flex-col rounded-2xl shadow-[0_0_30px_rgba(34,197,94,0.08)] animate-slideUp mb-4 lg:mb-0">
        <ul className="space-y-3">
          {[
            { name: "➕ Add New Product", value: "add-product" },
            { name: "📦 View All Products", value: "all-products" },
          ].map((item) => (
            <li
              key={item.value}
              onClick={() => setSelectedComponent(item.value)}
              className={`relative cursor-pointer p-3 rounded-xl text-center text-sm font-medium transition-all duration-500 transform hover:scale-[1.03] hover:-translate-y-[1px]
              before:absolute before:bottom-0 before:left-1/2 before:w-0 before:h-[2px] before:bg-green-500 before:rounded-full before:transition-all before:duration-500 before:transform before:-translate-x-1/2
              hover:before:w-3/4 hover:before:opacity-100
              ${
                selectedComponent === item.value
                  ? "bg-green-600 text-white shadow-[0_0_25px_rgba(34,197,94,0.25)] before:w-3/4 before:opacity-100"
                  : "bg-gray-800/70 border border-green-800/40 text-gray-300 hover:bg-green-700/20 hover:text-green-400 before:opacity-0"
              }`}
            >
              {item.name}
            </li>
          ))}
        </ul>

        {/* 🌙 Sidebar Footer */}
        <div className="mt-auto pt-6 text-xs text-gray-400 border-t border-green-800/30 text-center animate-fadeInSlow">
          <p className="tracking-wide mt-4">Farmer Portal v2.0</p>
          <p className="text-green-400 mt-1 font-medium animate-pulseSlow">
            Powered by FarmerConnect
          </p>
        </div>
      </aside>

      {/* 🧾 Main Section */}
      <main className="flex-1 overflow-y-auto bg-gray-900/60 backdrop-blur-md border border-green-800/30 rounded-2xl shadow-[0_0_25px_rgba(34,197,94,0.08)] mx-0 lg:mx-4 mt-0 lg:mt-4 animate-fadeInSlow">
        <div className="bg-gray-900/90 border border-green-800/30 rounded-2xl shadow-[0_0_30px_rgba(34,197,94,0.08)] transition-all duration-500 hover:-translate-y-[1px] hover:shadow-[0_0_40px_rgba(34,197,94,0.12)] animate-slideUpSlow">
          {renderSelectedComponent()}
        </div>
      </main>
    </div>
  );
};

export default FarmerDashBoard;
