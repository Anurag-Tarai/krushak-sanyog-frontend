import React, { useState } from "react";
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
        "http://localhost:8080/ecom/admin/signup",
        form
      );

      if (response.status === 200) {
        navigate("/farmer/signin");
      } else {
        console.error("Farmer Registration failed");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        alert(error.response.data.message);
      } else {
        alert("Error registering. Please try again later.");
        console.error("Error registering:", error);
      }
    }
  };

  const { email, password, firstName, lastName, phoneNumber } = form;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-green-950 to-gray-900 pt-24 p-4">
      {/* 🌾 Title above form */}
     <h2 className="text-2xl md:text-3xl font-bold text-green-400 mb-6 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)] tracking-wide text-center">
  🌿 Join the Farmer Network 🌽
</h2>


      <div
        className="w-full max-w-md bg-gray-900/70 border border-gray-800 backdrop-blur-xl 
                   shadow-2xl rounded-2xl p-8 transition-all duration-500 
                   hover:shadow-[0_0_40px_rgba(34,197,94,0.25)] 
                   hover:border-green-700/60 hover:bg-gray-900/80"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { label: "Email", name: "email", type: "text", value: email },
            { label: "Password", name: "password", type: "password", value: password },
            { label: "First Name", name: "firstName", type: "text", value: firstName },
            { label: "Last Name", name: "lastName", type: "text", value: lastName },
            { label: "Phone Number", name: "phoneNumber", type: "text", value: phoneNumber },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-green-100 font-medium mb-1">
                {field.label}:
              </label>
              <input
                type={field.type}
                name={field.name}
                value={field.value}
                onChange={handleInputChange}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                className="w-full px-4 py-2.5 bg-gray-800/90 text-green-100 border border-gray-700 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 
                           placeholder-gray-400 transition-all duration-200"
              />
              {errors[field.name] && (
                <p className="text-red-400 text-sm mt-1">{errors[field.name]}</p>
              )}
            </div>
          ))}

          <button
            type="submit"
            className="w-full py-2.5 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg 
                       shadow-md hover:shadow-green-500/20 transition-all duration-200 transform hover:-translate-y-0.5"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <Link
            to="/farmer/signin"
            className="text-green-400 hover:text-green-300 font-semibold transition-all"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default FarmerRegistration;
