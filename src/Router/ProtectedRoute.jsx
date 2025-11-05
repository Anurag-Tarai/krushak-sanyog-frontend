import React, { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import api from "../api/api"; // Axios instance with withCredentials: true

// 🧠 Helper to verify auth status from backend
const useAuthCheck = (roleCheckUrl) => {
  const [isAuth, setIsAuth] = useState(null); // null = loading, true/false = result

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await api.get(roleCheckUrl);
        if (res.status >= 200 && res.status < 300) setIsAuth(true);
        else setIsAuth(false);
      } catch (err) {
        setIsAuth(false);
      }
    };

    verifyAuth();
  }, [roleCheckUrl]);

  return isAuth;
};

const Privateroute = () => {
  const isAuth = useAuthCheck("/api/v1/auth/validate-buyer"); 

  if (isAuth === null) return <div>Loading...</div>; 
  return isAuth ? <Outlet /> : <Navigate to="/buyer/signin" />;
};

const Privaterouteadmin = () => {
  const isAuth = useAuthCheck("/api/v1/auth/validate-farmer"); 

  if (isAuth === null) return <div>Loading...</div>;
  return isAuth ? <Outlet /> : <Navigate to="/farmer/signin" />;
};

export { Privateroute, Privaterouteadmin };
