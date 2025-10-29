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

  // 🧠 Check JWT expiry once on mount
  useEffect(() => {
  // showToast("Checking expiry of JWT...", "info");

  const token = localStorage.getItem("jwtToken");
  if (!token) return;

  if (isTokenExpired(token)) {
    console.log("❌ Session expired");
    showToast("Session expired!", "error");

    localStorage.clear();

    // Wait long enough for the toast to be visible
    const timer = setTimeout(() => {
      window.location.replace("/farmer/signin");
    }, 2500);

    // Cleanup in case component unmounts
    return () => clearTimeout(timer);
  } else {
    console.log("✅ Token still valid");
  }
}, []);


  const location = useLocation();

  const restrictedPaths = [
    "/farmer/dashboard",
    "/farmer/product/details/:productId",
  ];

  const isRestrictedPath = restrictedPaths.some((path) =>
    matchPath({ path, end: true }, location.pathname)
  );

  // 🧠 Determine role dynamically from localStorage
  const isFarmerLoggedIn = localStorage.getItem("farmerId");
  const isBuyerLoggedIn = localStorage.getItem("userid");

  return (
    <div className="flex flex-col min-h-screen bg-black text-gray-100">
      {/* ✅ Conditional Navbar */}
      {isFarmerLoggedIn ? <FarmerNavbar /> : <Navbar />}

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
