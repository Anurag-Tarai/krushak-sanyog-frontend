import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const Privateroute = () => {
  let auth = false;
  if (localStorage.getItem("jwtToken") && localStorage.getItem("buyerId")) {
    auth = true;
  }
  return auth ? <Outlet /> : <Navigate to="/buyer/signin" />;
};

const Privaterouteadmin = () => {
  let auth = false;
  if (localStorage.getItem("jwtToken") && localStorage.getItem("farmerId")) {
    auth = true;
  }
  return auth ? <Outlet /> : <Navigate to="/farmer/signin" />;
};


export {Privateroute,Privaterouteadmin};
