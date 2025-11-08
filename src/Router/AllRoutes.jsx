
import Home from "../pages/Home";
import ExploreProduct from "../components/product/ExploreProduct";
import Login from "../auth/BuyerSignin";
import Registration from "../auth/BuyerRegistration";
import SingleProduct from "../pages/SingleProduct";
import { Routes, Route } from "react-router-dom";
import { Privateroute,Privaterouteadmin } from "../Router/ProtectedRoute";
import Admin from "../components/farmer/FarmerDashBoard";
import NotFound from "../components/common/NotFound";

import UserProfile from "../pages/UserProfile";
import ProductDetailsForFarmer from "../components/farmer/ProductDetailsForFarmer";
import FarmerRegistration from "../auth/FarmerRegistration";
import FarmerSignIn from "../auth/FarmerSignIn";
import FarmerAccount from "../components/farmer/FarmerAccount";
import Wishlist from "../pages/Wishlist";

const AllRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ExploreProduct />} />
        <Route path="/buyer/signin" element={<Login />} />
        

        <Route path="/buyer" element={<Privateroute />}>
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>

        <Route path="/farmer" element={<Privaterouteadmin />}>

          <Route path="dashboard" element={<Admin />} />
          <Route path="product/details/:productId" element={<ProductDetailsForFarmer/>} />
          <Route path="account" element={<FarmerAccount />} />
        </Route>
        <Route path="/buyer/signup" element={<Registration />} />
        <Route path="/product/:productId" element={<SingleProduct />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/farmer/signin" element={<FarmerSignIn/>} />
        <Route path="/farmer/signup" element={<FarmerRegistration/>}/>
      </Routes>
    </>
  );
};
export default AllRoutes;
