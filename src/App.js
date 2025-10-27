import React from 'react'; 
import "./App.css";
import AllRoutes from "./Router/AllRoutes";
import { useLocation, matchPath } from "react-router-dom";
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

function App() {
  const location = useLocation();

  // List of restricted path patterns
  const restrictedPaths = [
    "/farmer/dashboard",
    "/farmer/product/details/:productId"
  ];

  // Check if current path matches any restricted pattern
  const isRestrictedPath = restrictedPaths.some((path) =>
    matchPath({ path, end: true }, location.pathname)
  );

  return (
    <div className="flex flex-col min-h-screen">
      {!isRestrictedPath && <Navbar/>}

      <div className={`flex-grow ${!isRestrictedPath ? "pt-16 pb-16" : ""}`}>
        <AllRoutes />
      </div>

      {!isRestrictedPath && <Footer/>}
    </div>
  );
}

export default App;
