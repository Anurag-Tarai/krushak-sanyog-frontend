import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import MessageToast from "../components/common/MessageToast";

const initialFormData = {
  email: "",
  password: "",
};

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({
    show: false,
    message: "",
    status: "info",
  });

  const showToast = (message, status = "info") => {
    setToast({ show: true, message, status });
  };

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      showToast("Processing login...", "info");
      const role = "ROLE_BUYER";
      const res = await axios.post(
        "http://localhost:8080/api/v1/auth/login",
        { ...form, role },
        { headers: { "Content-Type": "application/json" } }
      );

      const { token, userId, name } = res.data;

      if (token) {
        localStorage.setItem("jwtToken", token);
        localStorage.setItem("buyerId", userId);
        localStorage.setItem("name", name || "Buyer");
        localStorage.setItem("role", "buyer");

        showToast("Signed in successfully ✅", "success");

        setTimeout(() => navigate("/products"), 1500);
      } else {
        showToast("Invalid credentials or missing token.", "error");
      }
    } catch (error) {
      if (error.response?.status === 401)
        showToast("Invalid credentials. Please try again.", "error");
      else if (error.response?.status === 403)
        showToast("Access denied. You are not a buyer.", "error");
      else showToast("Server error. Please try again later.", "error");
    }
  };

  // ⚡ Handle Google Sign-in (coming soon)
  const handleGoogleSignIn = () => {
    showToast("Google sign-in under development", "info");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0c0c0c] text-gray-100 px-4">
      <div className="w-full max-w-md bg-gray-900/40 border border-[#2a2a2a] rounded-2xl backdrop-blur-xl shadow-lg p-8 custom-scrollbar">
        <h2 className="text-2xl font-semibold text-gray-100 mb-6 text-center">
          Welcome Buyer
        </h2>

        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg bg-gray-900/60 border border-[#2f2f2f] text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-500"
            />
            {errors.email && (
              <span className="text-red-400 text-sm mt-1 block">
                {errors.email}
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 rounded-lg bg-gray-900/60 border border-[#2f2f2f] text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-500"
            />
            {errors.password && (
              <span className="text-red-400 text-sm mt-1 block">
                {errors.password}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-2 bg-green-700/60 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200"
          >
            Sign In
          </button>

          {/* 🔹 Divider */}
          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-[#2a2a2a]" />
            <span className="mx-3 text-gray-500 text-sm">or</span>
            <div className="flex-grow h-px bg-[#2a2a2a]" />
          </div>

          {/* 🔹 Google Sign-In (Coming Soon) */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full py-2 flex items-center justify-center gap-3 bg-gray-900/60 border border-[#2f2f2f] hover:border-emerald-500/40 rounded-lg text-gray-200 hover:text-emerald-300 transition-all duration-200"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Sign in with Google
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don’t have an account?{" "}
          <Link
            to="/buyer/signup"
            className="text-emerald-400 hover:underline hover:text-emerald-300 transition"
          >
            Signup here
          </Link>
        </p>
      </div>

      {/* ✅ Shared toast system */}
      <MessageToast
        show={toast.show}
        message={toast.message}
        status={toast.status}
         onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

export default Login;
