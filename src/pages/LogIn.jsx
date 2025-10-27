import React, { useState, useEffect } from "react";
import "../styles/components/Login.css";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const bg = {
  backgroundColor: "#f0f0f0", // Optional: Add a background color if needed
  border: "1px solid grey",
  height: "100vh",
};

const formData = {
  username: "",
  password: "",
};

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(formData);
  

  const setHandlerChange = (e) => {
    const val = e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
  
    try {
      const authHeader = `Basic ${btoa(`${form.username}:${form.password}`)}`;
      const role = "ROLE_USER";  // You can set this dynamically based on user selection or hardcode if it's always the same for your case
  
      const response = await axios.get("http://localhost:8080/ecom/signIn", {
        headers: {
          Authorization: authHeader,
        },
        params: { role },  // Send the role as a query parameter
      });
  
      if (response.headers.authorization !== undefined) {
        console.log(response.headers.authorization);
        localStorage.setItem("jwtToken", response.headers.authorization);
        localStorage.setItem("name", response.data.firstNAme || "LogIn");
        localStorage.setItem("userid", response.data.id);
        navigate("/");
      } else {
        alert("Invalid Credential");
        console.error("JWT retrieval failed");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Invalid credentials. Please try again.");
      } else if (error.response && error.response.status === 502) {
        alert("You are not a COSTUMER");
      } else {
        alert("Error during login. Please try again later.");
        console.error("Error during login:", error);
      }
    }
  };
  

  const { username, password } = form;

  return (
    <>
      <div style={bg}>
        <h2 style={{ textAlign: "center", color: "Black", margin: "20px" }}>
          WELCOME TO CUSTOMER LOGIN PAGE
        </h2>
        <div className="loginConatiner">
          <div className="login-form">
            <h2 style={{ textAlign: "center" }}>LogIn </h2>
            <form onSubmit={submitHandler}>
              <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={username}
                  onChange={setHandlerChange}
                />
              </div>
              <br />
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={setHandlerChange}
                />
              </div>
              <div className="form-group">
                <input type="submit" value="Login" />
                <p>
                  Don't have an account?{" "}
                  <Link to="/register-user" className="text-green-500 ">Register here</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
