import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { UserPlus } from "lucide-react";

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

const Registration = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialFormData);
  const [errors, setErrors] = useState(initialErrors);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!form.email || !emailRegex.test(form.email)) {
      newErrors.email = "Please enter a valid email.";
    }
    if (!form.password || form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    if (!form.firstName) {
      newErrors.firstName = "First name is required.";
    }
    if (!form.lastName) {
      newErrors.lastName = "Last name is required.";
    }
    if (!form.phoneNumber || !phoneRegex.test(form.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid 10-digit phone number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post(
        "http://localhost:8080/ecom/customers",
        form
      );
      if (response.status === 200) {
        alert("Your registration was successful");
        navigate("/login");
      }
    } catch (error) {
      if (error.response?.data) {
        alert(error.response.data.message);
      } else {
        alert("Error registering. Please try again later.");
      }
    }
  };

  const { email, password, firstName, lastName, phoneNumber } = form;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-950 via-black to-gray-900 text-gray-100 relative overflow-hidden px-4 py-16">
      {/* ✨ Ambient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950/60 via-black/70 to-gray-900/90 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-br from-green-500/10 via-green-700/5 to-transparent blur-[120px] rounded-full opacity-60" />

      {/* 🌾 Heading */}
      <div className="relative z-10 flex flex-col items-center mb-10 text-center">
        <div  className="pt-4 flex items-center gap-3">
          <UserPlus
            size={38}
            className="text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.4)]"
          />
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(34,197,94,0.25)] tracking-wide">
            Create Your Buyer Account
          </h1>
        </div>
        <p className="text-gray-400 text-sm mt-2 tracking-wide">
          Join the farmer connect — connect directly with local farmers 🌾
        </p>
      </div>

      {/* 🪶 Registration Form */}
      <div
        className="relative z-10 w-full max-w-md p-8 
                    bg-gray-900/90 border border-green-800/30 backdrop-blur-md rounded-2xl
                    shadow-[0_0_25px_rgba(34,197,94,0.08)] hover:shadow-[0_0_30px_rgba(34,197,94,0.12)] transition-shadow"
      >
        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-5">
          {/* Hidden dummy fields for browser autofill */}
          <input
            type="text"
            name="fake-username"
            id="fake-username"
            autoComplete="username"
            style={{ display: "none" }}
            tabIndex={-1}
          />
          <input
            type="password"
            name="fake-password"
            id="fake-password"
            autoComplete="new-password"
            style={{ display: "none" }}
            tabIndex={-1}
          />

          {[
            {
              label: "First Name",
              name: "firstName",
              type: "text",
              value: firstName,
              autoComplete: "given-name",
            },
            {
              label: "Last Name",
              name: "lastName",
              type: "text",
              value: lastName,
              autoComplete: "family-name",
            },
            {
              label: "Email",
              name: "email",
              type: "text",
              value: email,
              autoComplete: "email",
            },
            {
              label: "Password",
              name: "password",
              type: "password",
              value: password,
              autoComplete: "new-password",
            },
            {
              label: "Phone Number",
              name: "phoneNumber",
              type: "text",
              value: phoneNumber,
              autoComplete: "tel",
            },
          ].map(({ label, name, type, value, autoComplete }) => (
            <div key={name}>
              <label className="block text-gray-300 mb-2">{label}</label>
              <input
                type={type}
                name={name}
                value={value}
                onChange={handleInputChange}
                autoComplete={autoComplete}
                spellCheck="false"
                autoCapitalize="off"
                className="w-full px-4 py-3 rounded-lg bg-gray-800/70 border border-green-800/30 text-gray-100 placeholder-gray-500
                           focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-400/70 transition-all duration-300"
              />
              {errors[name] && (
                <span className="text-red-400 text-sm">{errors[name]}</span>
              )}
            </div>
          ))}

          <button
            type="submit"
            className="w-full py-3 mt-4 text-lg font-semibold rounded-lg text-white 
                       bg-gradient-to-r from-green-600 to-green-500 
                       hover:from-green-500 hover:to-green-400 transition duration-300 
                       shadow-md hover:shadow-[0_0_20px_rgba(34,197,94,0.25)]"
          >
            Register
          </button>

          <p className="text-center text-gray-400 text-sm mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-green-400 hover:text-green-300 hover:underline transition"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Registration;
