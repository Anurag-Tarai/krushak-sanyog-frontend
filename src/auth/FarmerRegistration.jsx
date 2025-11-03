import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import MessageToast from "../components/common/MessageToast";

const initialFormData = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
};

const FarmerRegistration = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({
    show: false,
    message: "",
    status: "info",
  });
  const [loading, setLoading] = useState(false);

  const showToast = (message, status = "info") => {
    setToast({ show: true, message, status });
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!form.email) newErrors.email = "Email is required.";
    else if (!emailRegex.test(form.email))
      newErrors.email = "Enter a valid email address.";

    if (!form.password) newErrors.password = "Password is required.";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";

    if (!form.firstName) newErrors.firstName = "First name is required.";
    if (!form.lastName) newErrors.lastName = "Last name is required.";

    if (!form.phoneNumber) newErrors.phoneNumber = "Phone number is required.";
    else if (!phoneRegex.test(form.phoneNumber))
      newErrors.phoneNumber = "Enter a valid 10-digit phone number.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    showToast("Processing registration...", "info");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/auth/register",
        { ...form, role: "ROLE_FARMER" }
      );

      if (response.status === 200) {
        showToast("Registered successfully ✅ Redirecting...", "success");
        setTimeout(() => navigate("/farmer/signin"), 1500);
      } else {
        showToast("Registration failed ❌", "error");
      }
    } catch (error) {
      console.error("Error registering:", error);
      showToast("Error during registration ❌", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    showToast("Google Authentication coming soon 🚀", "info");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0c0c0c] text-gray-100 px-4">
      <div className="mt-16 w-full max-w-md bg-gray-900/40 border border-[#2a2a2a] rounded-2xl backdrop-blur-xl shadow-lg p-8 custom-scrollbar">
        <h2 className="text-2xl font-semibold text-gray-100 mb-6 text-center">
          Become a Farmer 🌿
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="text"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg bg-gray-900/60 border border-[#2f2f2f] text-gray-200 
              focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-500"
              autoComplete="new-password"
            />
            {errors.email && (
              <span className="text-red-400 text-sm mt-1 block">{errors.email}</span>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 rounded-lg bg-gray-900/60 border border-[#2f2f2f] text-gray-200 
              focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-500"
              autoComplete="new-password"
            />
            {errors.password && (
              <span className="text-red-400 text-sm mt-1 block">{errors.password}</span>
            )}
          </div>

          {/* Names */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="First name"
                className="w-full px-4 py-2 rounded-lg bg-gray-900/60 border border-[#2f2f2f] text-gray-200 
                focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-500"
              />
              {errors.firstName && (
                <span className="text-red-400 text-sm mt-1 block">
                  {errors.firstName}
                </span>
              )}
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Last name"
                className="w-full px-4 py-2 rounded-lg bg-gray-900/60 border border-[#2f2f2f] text-gray-200 
                focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-500"
              />
              {errors.lastName && (
                <span className="text-red-400 text-sm mt-1 block">
                  {errors.lastName}
                </span>
              )}
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="w-full px-4 py-2 rounded-lg bg-gray-900/60 border border-[#2f2f2f] text-gray-200 
              focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-500"
            />
            {errors.phoneNumber && (
              <span className="text-red-400 text-sm mt-1 block">
                {errors.phoneNumber}
              </span>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 mt-2 font-semibold rounded-lg shadow-lg transition-all duration-200 
              ${
                loading
                  ? "bg-green-700/60 text-gray-300 cursor-not-allowed"
                  : "bg-green-700/60 hover:bg-green-700 text-white"
              }`}
          >
            {loading ? "Processing..." : "Register"}
          </button>
        </form>

        {/* 🔹 Divider */}
          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-[#2a2a2a]" />
            <span className="mx-3 text-gray-500 text-sm">or</span>
            <div className="flex-grow h-px bg-[#2a2a2a]" />
          </div>

        {/* Google Auth */}
        <button
          onClick={handleGoogleAuth}
          className="w-full mt-4 py-2  bg-gray-900/60 rounded-lg border border-[#2f2f2f] hover:border-emerald-500/60 
          text-gray-300 hover:text-emerald-400 transition-all flex items-center justify-center gap-2"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            to="/farmer/signin"
            className="text-emerald-400 hover:underline hover:text-emerald-300 transition"
          >
            Sign in here
          </Link>
        </p>
      </div>

      {/* ✅ Shared toast */}
      <MessageToast
        show={toast.show}
        message={toast.message}
        status={toast.status}
         onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

export default FarmerRegistration;
