import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const initialFormData = {
  email: "",
  password: "",
};

const initialErrors = {
  email: "",
  password: "",
};

const FarmerSignIn = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialFormData);
  const [errors, setErrors] = useState(initialErrors);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.email) newErrors.email = "Email is required.";
    else if (!emailRegex.test(form.email))
      newErrors.email = "Enter a valid email address.";

    if (!form.password) newErrors.password = "Password is required.";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const setHandlerChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const role = "ROLE_FARMER";
      const response = await axios.post(
        "http://localhost:8080/api/v1/auth/login",
        { email: form.email, password: form.password, role },
        { headers: { "Content-Type": "application/json", Accept: "*/*" } }
      );

      
      const { token, userId, name } = response.data;
      if (token) {
        localStorage.setItem("jwtToken", token);
        localStorage.setItem("farmerId", userId);
        localStorage.setItem("name", name || "Farmer");
        localStorage.setItem("role", "farmer"); // or "buyer"
        navigate("/farmer/dashboard");
      } else {
        alert("Invalid credentials or missing token.");
      }
    } catch (error) {
      if (error.response?.status === 401)
        alert("Invalid credentials. Please try again.");
      else if (error.response?.status === 403)
        alert("Access denied. You are not a farmer.");
      else if (error.response?.status === 502)
        alert("Server error: You are not a Farmer.");
      else alert("Error during login. Please try again later.");
    }
  };

  const { email, password } = form;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-green-950 to-black text-white px-4">
      <h2 className="text-3xl font-bold mb-6 tracking-wide bg-gradient-to-r from-green-400 to-green-200 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(34,197,94,0.4)]">
        Welcome, Farmer 🌾
      </h2>

      <div className="w-full max-w-md bg-gray-900/70 border border-green-800/40 backdrop-blur-lg rounded-2xl shadow-[0_0_25px_rgba(34,197,94,0.15)] p-8 transition-all duration-300 hover:shadow-[0_0_35px_rgba(34,197,94,0.25)]">
        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-green-300 font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={setHandlerChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-800/80 border border-green-700/40 text-green-100 
                focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500"
              placeholder="Enter your email"
            />
            {errors.email && (
              <span className="text-red-400 text-sm mt-1 block">{errors.email}</span>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-green-300 font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={setHandlerChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-800/80 border border-green-700/40 text-green-100 
                focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500"
              placeholder="Enter your password"
            />
            {errors.password && (
              <span className="text-red-400 text-sm mt-1 block">{errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600
              text-white font-semibold rounded-lg shadow-lg transition-all duration-200 hover:scale-[1.02]"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-green-200">
          Don’t have an account?{" "}
          <Link
            to="/farmer/signup"
            className="text-green-400 hover:underline hover:text-green-300 transition"
          >
            Signup here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default FarmerSignIn;
