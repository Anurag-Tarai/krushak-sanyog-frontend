import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhone,
  faCalendarAlt,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import api from "../../Router/api";

const FarmerAccount = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("farmerId");
  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/api/v1/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#1a1a1a] text-green-400 text-lg">
        Loading account details...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#1a1a1a] text-red-400 text-lg">
        Failed to load user information.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050505] via-[#0f0f0f] to-[#1c1c1c] text-gray-200 pt-24 flex flex-col items-center px-4">
      {/* Header */}
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-400 mb-8 text-center">
        Account Details
      </h2>

      {/* Card */}
      <div className="bg-[#111111]/90 border border-gray-700 rounded-2xl shadow-2xl 
                      w-full max-w-xl p-6 md:p-8 backdrop-blur-md">
        {/* Profile Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center shadow-md">
            <FontAwesomeIcon icon={faUser} className="text-green-400 text-3xl" />
          </div>
          <h3 className="mt-3 text-xl font-semibold text-green-800">
            {user.firstName} {user.lastName}
          </h3>
        </div>

        {/* Info Fields */}
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-gray-900 p-3 rounded-lg border border-gray-700">
            <span className="flex items-center gap-2 text-gray-300">
              <FontAwesomeIcon icon={faEnvelope} className="text-green-400" /> Email
            </span>
            <span className="font-medium text-green-300">{user.email}</span>
          </div>

          <div className="flex items-center justify-between bg-gray-900 p-3 rounded-lg border border-gray-700">
            <span className="flex items-center gap-2 text-gray-300">
              <FontAwesomeIcon icon={faPhone} className="text-green-400" /> Phone
            </span>
            <span className="font-medium text-green-300">
              {user.phoneNumber || "N/A"}
            </span>
          </div>

          <div className="flex items-center justify-between bg-gray-900 p-3 rounded-lg border border-gray-700">
            <span className="flex items-center gap-2 text-gray-300">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-green-400" /> Registered On
            </span>
            <span className="font-medium text-green-300">
              {new Date(user.registerTime).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center justify-between bg-gray-900 p-3 rounded-lg border border-gray-700">
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
            className="px-5 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-all"
          >
            Back
          </button>
          <button
            onClick={() => alert("Feature coming soon")}
            className="px-5 py-2 bg-green-700 hover:bg-green-600 rounded-lg border border-green-800 transition-all"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default FarmerAccount;
