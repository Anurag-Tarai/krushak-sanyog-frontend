import React, { useState } from "react";
import "../styles/components/Login.css";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';

const bg = {
  backgroundColor: "#f0f0f0", 
  border: "1px solid grey",
  height: "fit-content",
};

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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
    setErrors({ ...errors, [name]: "" }); // Clear error message for the field
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await axios.post("http://localhost:8080/ecom/customers", form);
      if (response.status === 200) {
        alert("Your registration was successful");
        console.log(response.data);
        navigate("/login");
      } else {
        console.error("Registration failed");
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
    <div className="login-form1" style={bg}>
      <div className="login-form">
        <h2 style={{ textAlign: "center" }}>Registration</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="text"
              name="email"
              value={email}
              onChange={handleInputChange}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleInputChange}
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>
          <div className="form-group">
            <label>First Name:</label>
            <input
              type="text"
              name="firstName"
              value={firstName}
              onChange={handleInputChange}
            />
            {errors.firstName && <span className="error">{errors.firstName}</span>}
          </div>
          <div className="form-group">
            <label>Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={lastName}
              onChange={handleInputChange}
            />
            {errors.lastName && <span className="error">{errors.lastName}</span>}
          </div>
          <div className="form-group">
            <label>Phone Number:</label>
            <input
              type="text"
              name="phoneNumber"
              value={phoneNumber}
              onChange={handleInputChange}
            />
            {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
          </div>
          <div className="form-group">
            <input type="submit" value="Register" />
          </div>
        </form>
        <p>
          Already have an account?{" "}
          <Link to="/login" className="text-green-500">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Registration;
