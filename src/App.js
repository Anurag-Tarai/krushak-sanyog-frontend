import React from 'react'; 
import "./App.css";
import AllRoutes from "./Router/AllRoutes";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();

  // Define routes where Navbar and Footer should be hidden
  const isRestrictedPath = [
    "/farmer/dashboard"
  ].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Conditionally render Navbar */}
      {!isRestrictedPath && <Navbar />}

      {/* Main content, adding margin only if Navbar is present */}
      <div className={`flex-grow ${!isRestrictedPath ? "pt-16 pb-16" : ""}`}>
        <AllRoutes />
      </div>

      {/* Conditionally render Footer */}
      {!isRestrictedPath && <Footer />}
    </div>
  );
}

export default App;
