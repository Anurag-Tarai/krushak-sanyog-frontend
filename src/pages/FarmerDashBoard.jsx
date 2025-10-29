import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AddProduct from "../components/product/AddProduct";
import AllProductAdmin from "../components/farmer/AllProductFarmer";
import MessageToast from "../components/common/MessageToast";

const FarmerDashBoard = () => {
  const [selectedComponent, setSelectedComponent] = useState("all-products");
  const [userName, setUserName] = useState("");
  const [refreshProducts, setRefreshProducts] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", status: "info" });
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem("name") || "Farmer";
    setUserName(name);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("farmerId");
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("name");
    navigate("/");
  };

  const showToast = (message, status = "info") => {
    setToast({ show: true, message, status });
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 14 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.06, duration: 0.35 },
    }),
  };

  const renderSelectedComponent = () => {
    switch (selectedComponent) {
      case "add-product":
        return (
          <AddProduct
            setRefreshProducts={setRefreshProducts}
            setSelectedComponent={setSelectedComponent}
          />
        );
      default:
        return <AllProductAdmin refresh={refreshProducts} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#070707] via-[#0e0e0f] to-[#141416] text-gray-200 relative">
      {/* faint texture gradient */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.02),transparent_35%)]" />

      <div className="max-w-7xl mx-auto px-6 py-10 relative z-0">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 🌿 Sidebar */}
<motion.aside
  variants={fadeUp}
  initial="hidden"
  animate="visible"
  className="mt-10 lg:col-span-1 p-6 rounded-2xl bg-gray-900/40 border border-gray-800/60 backdrop-blur-md 
             shadow-[0_0_20px_rgba(255,255,255,0.04)] flex flex-col justify-between
             w-[300px] h-[85vh] mx-auto lg:mx-0"
>
  <div>
    <ul className="mt-6 space-y-3">
      {[
        { name: "➕ Add New Product", value: "add-product" },
        { name: "📦 View All Products", value: "all-products" },
      ].map((item) => (
        <motion.li
          key={item.value}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedComponent(item.value)}
          className={`cursor-pointer px-4 py-3 rounded-xl text-sm font-medium border transition-all duration-400
            ${
              selectedComponent === item.value
                ? "bg-green-800/40 border-green-700 text-green-300 shadow-[0_0_15px_rgba(34,197,94,0.25)]"
                : "bg-gray-800/40 border-gray-700/60 text-gray-300 hover:bg-gray-800/60 hover:border-green-700 hover:text-green-400"
            }`}
        >
          {item.name}
        </motion.li>
      ))}
    </ul>
  </div>

  <div className="mt-10 border-t border-gray-800/60 pt-6 text-center">
    <p className="text-xs text-gray-400">Farmer Portal v1.0</p>
    <p className="text-green-400 text-xs mt-1 animate-pulseSlow">
      Powered by FarmerConnect
    </p>
  </div>
</motion.aside>


          {/* 🧾 Main Section */}
          <motion.main
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-10 lg:col-span-3  rounded-2xl bg-gray-900/40 border border-gray-800/60 
                       shadow-[0_0_20px_rgba(255,255,255,0.04)] backdrop-blur-md relative"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedComponent}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="min-h-[70vh]"
              >
                {renderSelectedComponent()}
              </motion.div>
            </AnimatePresence>
          </motion.main>
        </div>
      </div>

      {/* ✅ Message Toast */}
      <MessageToast
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        message={toast.message}
        status={toast.status}
      />
    </div>
  );
};

export default FarmerDashBoard;
