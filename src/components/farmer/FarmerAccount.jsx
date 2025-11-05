import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhone,
  faCalendarAlt,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { FiUpload, FiUser } from "react-icons/fi";
import { FaLeaf } from "react-icons/fa6";
import api from "../../api/api";
import MessageToast from "../common/MessageToast";

const FarmerAccount = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    status: "info",
  });


  const showToast = (message, status = "info") => {
    setToast({ show: true, message, status });
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/api/v1/user`);
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        showToast("Failed to load user details. Please try again.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#070707] via-[#0e0e0f] to-[#141416] text-gray-300">
        <span className="animate-pulse text-gray-400 text-lg">
          Loading account details...
        </span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#070707] via-[#0e0e0f] to-[#141416] text-red-400 text-lg">
        Failed to load user information.
      </div>
    );
  }

  const handleProfileUpload = () => {
    showToast("Profile picture upload feature coming soon 📸", "info");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#070707] via-[#0e0e0f] to-[#141416] text-gray-200 pt-24 flex flex-col items-center px-4 relative">
      {/* Soft light overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.02),transparent_35%)]" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-10">
        <FaLeaf className="text-green-400 text-3xl" />
        <h2 className="text-3xl font-bold text-gray-300 tracking-wide">
          Farmer Account
        </h2>
      </div>

      {/* Card */}
      <div className="relative bg-gray-900/40 border border-gray-800/60 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.05)] 
                      w-full max-w-xl p-8 backdrop-blur-md z-10">
        {/* Profile Section */}
        <div className="flex flex-col items-center mb-6 relative">
          {/* Profile Avatar */}
          <div className="relative w-24 h-24">
            <div className="w-24 h-24 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center shadow-md overflow-hidden">
              <FontAwesomeIcon icon={faUser} className="text-green-400 text-4xl" />
            </div>

            {/* Upload Button Overlay */}
            <button
              onClick={handleProfileUpload}
              className="absolute bottom-1 right-1 bg-gray-800/80 hover:bg-gray-700 border border-gray-600 rounded-full p-1.5 transition-all shadow-sm"
              title="Upload profile picture"
            >
              <FiUpload className="text-gray-300 text-sm" />
            </button>
          </div>

          <h3 className="mt-3 text-xl font-semibold text-gray-100">
            {user.firstName} {user.lastName}
          </h3>
        </div>

        {/* Info Fields */}
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-gray-800/40 p-3 rounded-lg border border-gray-700/60">
            <span className="flex items-center gap-2 text-gray-300">
              <FontAwesomeIcon icon={faEnvelope} className="text-green-400" /> Email
            </span>
            <span className="font-medium text-gray-200">{user.email}</span>
          </div>

          <div className="flex items-center justify-between bg-gray-800/40 p-3 rounded-lg border border-gray-700/60">
            <span className="flex items-center gap-2 text-gray-300">
              <FontAwesomeIcon icon={faPhone} className="text-green-400" /> Phone
            </span>
            <span className="font-medium text-gray-200">
              {user.phoneNumber || "N/A"}
            </span>
          </div>

          <div className="flex items-center justify-between bg-gray-800/40 p-3 rounded-lg border border-gray-700/60">
            <span className="flex items-center gap-2 text-gray-300">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-green-400" /> Registered On
            </span>
            <span className="font-medium text-gray-200">
              {new Date(user.registerTime).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center justify-between bg-gray-800/40 p-3 rounded-lg border border-gray-700/60">
            <span className="flex items-center gap-2 text-gray-300">
              <FontAwesomeIcon icon={faCircleInfo} className="text-green-400" /> Account Status
            </span>
            <span
              className={`font-semibold ${
                user.userAccountStatus === "ACTIVE"
                  ? "text-green-400"
                  : "text-yellow-400"
              }`}
            >
              {user.userAccountStatus}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="px-5 py-2 bg-gray-800/70 hover:bg-gray-700/70 rounded-lg border border-gray-700 transition-all text-gray-200"
          >
            ← Back
          </button>

          <button
            onClick={() =>
              showToast("Profile editing feature coming soon 🚀", "info")
            }
            className="px-5 py-2 bg-green-700/70 hover:bg-green-600/70 rounded-lg border border-green-800 transition-all text-gray-100 shadow-[0_0_10px_rgba(34,197,94,0.25)] hover:shadow-[0_0_15px_rgba(34,197,94,0.35)]"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* ✅ Toast */}
      <MessageToast
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        message={toast.message}
        status={toast.status}
      />
    </div>
  );
};

export default FarmerAccount;
