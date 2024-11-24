import React, { useState } from "react";
import "../../comp_css/Login.css";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
// Removed the login background import since it won't be used
// import loginbg from "../picture/loginbg.webp";

const bg = {
  backgroundColor: "#f0f0f0", // Optional: Add a background color
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

const FarmerRegistration = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialFormData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post("http://localhost:8080/ecom/admin/signup", form);
      
      if (response.status === 200) {
        console.log(response.data); 
        navigate("/login");
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
    <div className="login-form1" style={bg}>
      <div className="login-form">
        <h2 style={{ textAlign: "center" }}>Farmer Registration</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="text"
              name="email"
              value={email}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>First Name:</label>
            <input
              type="text"
              name="firstName"
              value={firstName}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={lastName}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Phone Number:</label>
            <input
              type="text"
              name="phoneNumber"
              value={phoneNumber}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <input type="submit" value="Register" />
          </div>
        </form>
        <p>
          Already have an account?{" "}
          <Link to="/admin-login" className="text-green-500">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default FarmerRegistration;
