import React from "react";
import Home from "../pages/Home";
import Product from "../pages/Product";
import Profile from "../components/Profile";
import OrderDetails from "../pages/UserProfile";
import Payment from "../pages/Payment";
import PaymentForm from "../pages/PaymentForm";
import Login from "../pages/LogIn";
import AdminLogin from "../pages/AdminLogIn";
import Registration from "../pages/Registration";
import SingleProduct from "../pages/SingleProduct";
import Cart from "../pages/Cart";
import ShippingDetails from "../pages/ShippingDetails";
import { Routes, Route } from "react-router-dom";
import { Privateroute,Privaterouteadmin } from "../Router/ProtectedRoute";
import Admin from "../pages/Admin";
import NotFound from "../components/NotFound";
import FarmerRegistration from "../pages/auth/FarmerRegistration";
import AuctionProducts from "../pages/AuctionProducts";
import AuctionPage from "../pages/AuctionPage";
import UserProfile from "../pages/UserProfile";
import ProductDetailsForFarmer from "../components/ProductDetails/ProductDetailsForFarmer";

const AllRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auction" element={<AuctionProducts />}/>
        <Route path="/auction-page" element={<AuctionPage />}/>

        <Route path="/user" element={<Privateroute />}>
          <Route path="cart" element={<Cart />} />
          <Route path="save-address" element={<ShippingDetails />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="payment-success" element={<Payment />} />
          <Route path="make-payment" element={<PaymentForm />} />
          <Route path="profile/:userid" element={<Profile />} />
        </Route>

        <Route path="/farmer" element={<Privaterouteadmin />}>
          <Route path="dashboard" element={<Admin />} />
          <Route path="product-details/:productId" element={<ProductDetailsForFarmer/>} />
        </Route>
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/register-user" element={<Registration />} />
        <Route path="/product/:productId" element={<SingleProduct />} />
        <Route path="/products" element={<Product />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/farmer-register" element={<FarmerRegistration/>}/>
      </Routes>
    </>
  );
};
export default AllRoutes;
