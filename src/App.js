import React from "react";
import "./App.css";
import AllRoutes from "./Router/AllRoutes";
import { useLocation, matchPath } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import FarmerNavbar from "./components/common/FarmerNavbar";
import Footer from "./components/common/Footer";
import ScrollToTop from "./components/common/ScrollToTop";

function App() {
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

      {/* ✅ Hide footer for certain pages */}
      {!isRestrictedPath && <Footer />}
    </div>
  );
}

export default App;
