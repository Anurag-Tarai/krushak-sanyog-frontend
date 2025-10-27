import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { UserCheck } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });

  const setHandlerChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const authHeader = `Basic ${btoa(`${form.username}:${form.password}`)}`;
      const role = "ROLE_USER";

      const response = await axios.get("http://localhost:8080/ecom/signIn", {
        headers: { Authorization: authHeader },
        params: { role },
      });

      if (response.headers.authorization) {
        localStorage.setItem("jwtToken", response.headers.authorization);
        localStorage.setItem("name", response.data.firstName || "LogIn");
        localStorage.setItem("userid", response.data.id);
        navigate("/");
      } else {
        alert("Invalid Credential");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        alert("Invalid credentials. Please try again.");
      } else if (error.response?.status === 502) {
        alert("You are not a CUSTOMER");
      } else {
        alert("Error during login. Please try again later.");
      }
    }
  };

  const { username, password } = form;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-950 via-black to-gray-900 text-gray-100 relative overflow-hidden">
      {/* ✨ Ambient overlay (subtle green glow) */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950/60 via-black/70 to-gray-900/90 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-br from-green-500/10 via-green-700/5 to-transparent blur-[120px] rounded-full opacity-60" />

      {/* 🌾 Heading */}
      <div className="relative z-10 flex flex-col items-center mb-10 text-center">
        <div className="flex items-center gap-3">
          <UserCheck
            size={38}
            className="text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.4)]"
          />
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(34,197,94,0.25)] tracking-wide">
            Buyer Sign In
          </h1>
        </div>
        <p className="text-gray-400 text-sm mt-2 tracking-wide">
          Connect with farmers, buy fresh products directly 🌾
        </p>
      </div>

      {/* 🪶 Form Card */}
      <div
        className="relative z-10 w-full max-w-md p-8 
                    bg-gray-900/90 border border-green-800/30 backdrop-blur-md rounded-2xl
                    shadow-[0_0_25px_rgba(34,197,94,0.08)] hover:shadow-[0_0_30px_rgba(34,197,94,0.12)] transition-shadow"
      >
        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              value={username}
              onChange={setHandlerChange}
              placeholder="Enter your username"
              autoComplete="off"
              className="w-full px-4 py-3 rounded-lg bg-gray-800/70 border border-green-800/30 text-gray-100 placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-400/70 transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={setHandlerChange}
              placeholder="Enter your password"
              autoComplete="new-password"
              className="w-full px-4 py-3 rounded-lg bg-gray-800/70 border border-green-800/30 text-gray-100 placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-400/70 transition-all duration-300"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 text-lg font-semibold rounded-lg text-white 
                       bg-gradient-to-r from-green-600 to-green-500 
                       hover:from-green-500 hover:to-green-400 transition duration-300 
                       shadow-md hover:shadow-[0_0_20px_rgba(34,197,94,0.25)]"
          >
            Login
          </button>

          <p className="text-center text-gray-400 text-sm mt-4">
            Don’t have an account?{" "}
            <Link
              to="/register-user"
              className="text-green-400 hover:text-green-300 hover:underline transition"
            >
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
