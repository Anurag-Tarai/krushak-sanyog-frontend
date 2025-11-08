import React, { useEffect, useState } from "react";
import "./App.css";
import AllRoutes from "./Router/AllRoutes";
import { useLocation, matchPath } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import FarmerNavbar from "./components/common/FarmerNavbar";
import Footer from "./components/common/Footer";
import ScrollToTop from "./components/common/ScrollToTop";
import { isTokenExpired } from "./utils/jwtExpire"; 
import MessageToast from "./components/common/MessageToast";
import api from "./api/api";

function App() {
  const [toast, setToast] = useState({
    show: false,
    message: "",
    status: "info",
  });

  // 🔔 Centralized Toast handler
  const showToast = (message, status = "info") => {
    setToast({ show: true, message, status });
  };



  const location = useLocation();

  const restrictedPaths = [
    "/farmer/dashboard",
    "/farmer/product/details/:productId",
  ];

  const isRestrictedPath = restrictedPaths.some((path) =>
    matchPath({ path, end: true }, location.pathname)
  );


  const role = localStorage.getItem("role");


  setInterval(() => {
  (async () => {
    try {
      const res = await api.get("/health-check");
      console.log(res.data);
    } catch (err) {
      console.error("Health check failed:", err);
    }
  })();
}, 900000); // every 500ms

  

  return (
    <div className="flex flex-col min-h-screen bg-black text-gray-100">
      {/* ✅ Conditional Navbar */}
      {role==='ROLE_FARMER' ? <FarmerNavbar /> : <Navbar />}

      {/* ✅ Ensure scroll-to-top on route change */}
      <ScrollToTop />

      <main className="flex-grow">
        <AllRoutes />
      </main>

      {/* ✅ Hide footer for restricted pages */}
      {!isRestrictedPath && <Footer />}

      {/* ✅ Global Toast */}
      <MessageToast
        show={toast.show}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        message={toast.message}
        status={toast.status}
      />
    </div>
  );
}

export default App;
