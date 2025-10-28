import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const initialFormData = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
};

const initialErrors = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
};

const FarmerRegistration = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialFormData);
  const [errors, setErrors] = useState(initialErrors);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

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
    setStatus("Processing registration...");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/auth/register",
        { ...form, role: "ROLE_FARMER" }
      );

      if (response.status === 200) {
        setStatus("Registered successfully ✅ Sign in to continue...");
        setTimeout(() => {
          navigate("/farmer/signin");
        }, 2000);
      } else {
        setStatus("Registration failed ❌");
      }
    } catch (error) {
      console.error("Error registering:", error);
      setStatus("Error during registration ❌");
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Auto-hide status after 4 seconds
  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => setStatus(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const { email, password, firstName, lastName, phoneNumber } = form;

  return (
    <div className="mt-12 min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100 px-4 relative">
      <h2 className="text-3xl font-bold mb-6 tracking-wide bg-gradient-to-r from-green-400 to-green-200 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(34,197,94,0.4)]">
        Become a Farmer 🌿
      </h2>

      <div className="w-full max-w-md bg-gray-900/70 border border-green-800/40 backdrop-blur-lg rounded-2xl shadow-[0_0_25px_rgba(34,197,94,0.15)] p-8 transition-all duration-300 hover:shadow-[0_0_35px_rgba(34,197,94,0.25)]">
        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
          <div>
            <label className="block text-green-300 font-medium mb-1">Email</label>
            <input
              type="text"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg bg-gray-800/80 border border-green-700/40 text-green-100 
                focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500"
              autoComplete="new-password"
            />
            {errors.email && (
              <span className="text-red-400 text-sm mt-1 block">{errors.email}</span>
            )}
          </div>

          <div>
            <label className="block text-green-300 font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 rounded-lg bg-gray-800/80 border border-green-700/40 text-green-100 
                focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500"
              autoComplete="new-password"
            />
            {errors.password && (
              <span className="text-red-400 text-sm mt-1 block">{errors.password}</span>
            )}
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-green-300 font-medium mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={firstName}
                onChange={handleChange}
                placeholder="First name"
                className="w-full px-4 py-2 rounded-lg bg-gray-800/80 border border-green-700/40 text-green-100 
                  focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500"
              />
              {errors.firstName && (
                <span className="text-red-400 text-sm mt-1 block">{errors.firstName}</span>
              )}
            </div>

            <div className="flex-1">
              <label className="block text-green-300 font-medium mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={lastName}
                onChange={handleChange}
                placeholder="Last name"
                className="w-full px-4 py-2 rounded-lg bg-gray-800/80 border border-green-700/40 text-green-100 
                  focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500"
              />
              {errors.lastName && (
                <span className="text-red-400 text-sm mt-1 block">{errors.lastName}</span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-green-300 font-medium mb-1">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={phoneNumber}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="w-full px-4 py-2 rounded-lg bg-gray-800/80 border border-green-700/40 text-green-100 
                focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500"
            />
            {errors.phoneNumber && (
              <span className="text-red-400 text-sm mt-1 block">{errors.phoneNumber}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 mt-2 font-semibold rounded-lg shadow-lg transition-all duration-200 
              ${
                loading
                  ? "bg-green-700 text-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white hover:scale-[1.02]"
              }`}
          >
            {loading ? "Processing..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-green-200">
          Already have an account?{" "}
          <Link
            to="/farmer/signin"
            className="text-green-400 hover:underline hover:text-green-300 transition"
          >
            Sign in here
          </Link>
        </p>
      </div>

      {/* ✅ Floating status message (toggle style like SignIn) */}
      {status && (
        <div
          className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-green-100 
            bg-gray-900/80 border border-green-700/40 backdrop-blur-md transition-all duration-500 
            animate-fade-in-out`}
        >
          {status}
        </div>
      )}

      {/* ✅ Animation for status fade */}
      <style>{`
        @keyframes fadeInOut {
          0%, 100% { opacity: 0; transform: translateY(10px); }
          10%, 90% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-out {
          animation: fadeInOut 4s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default FarmerRegistration;
