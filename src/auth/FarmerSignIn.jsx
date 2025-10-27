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

    if (!form.email) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const setHandlerChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear error message for the field
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
try {
  const role = "ROLE_FARMER";

  const response = await axios.post(
    "http://localhost:8080/api/v1/auth/login",
    {
      email: form.email,
      password: form.password,
      role: role,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    }
  );
  console.log(response);
  

  console.log(response.data.token);
  const { token, userId, name } = response.data;

  if (response.data?.token) {
    localStorage.setItem("jwtToken",token);
    localStorage.setItem("farmerId", userId);
    localStorage.setItem("name", name || "Farmer");

    navigate("/farmer/dashboard");
  } else {
    alert("Invalid credentials or missing token.");
  }
} catch (error) {
  if (error.response?.status === 401) {
    alert("Invalid credentials. Please try again.");
  } else if (error.response?.status === 403) {
    alert("Access denied. You are not a farmer.");
  } else if (error.response?.status === 502) {
    alert("Server error: You are not a Farmer.");
  } else {
    alert("Error during login. Please try again later.");
    console.error("Error during login:", error);
  }
}
  };

  const { email, password } = form;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">
        WELCOME TO FARMER LOGIN PAGE
      </h2>

      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium">
              Email:
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={setHandlerChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email}</span>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium">
              Password:
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={setHandlerChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password}</span>
            )}
          </div>

          <div>
            <input
              type="submit"
              value="Login"
              className="w-full py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition duration-200"
            />
          </div>
        </form>
        <p className="mt-4 text-center">
                  Don't have an account?{" "}
                  <Link to="/farmer/signup" className="text-blue-500 hover:underline">
                    Signup here
                  </Link>
              </p>
      </div>
    </div>
  );
};

export default FarmerSignIn;
