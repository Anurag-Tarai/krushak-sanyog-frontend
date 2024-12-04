import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();
  const [dummyProfile, setDummyProfile] = useState({
    name: "Rajesh Kumar",
    email: "rajesh.kumar@example.com",
    address: "456 MG Road, Bangalore, Karnataka, India",
    phone: "+91 9876543210",
    profilePic: "https://www.w3schools.com/w3images/avatar2.png", // Default profile picture URL
  });

  const handleEditProfile = () => {
    // Functionality to edit profile can be added here
    alert("Edit Profile clicked");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
              src={dummyProfile.profilePic} // Use the profile picture URL
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover" // Rounded and properly sized image
            />
          </div>
          <h1 className="text-4xl font-semibold text-gray-800 mb-2">User Profile</h1>
          <p className="text-gray-600">Manage your account settings and more</p>
        </div>

        <div className="space-y-6">
          {/* Profile Information */}
          <div className="flex justify-between items-center border-b pb-4">
            <span className="text-gray-700 font-medium">Name:</span>
            <span className="text-gray-600">{dummyProfile.name}</span>
          </div>

          <div className="flex justify-between items-center border-b pb-4">
            <span className="text-gray-700 font-medium">Email:</span>
            <span className="text-gray-600">{dummyProfile.email}</span>
          </div>

          <div className="flex justify-between items-center border-b pb-4">
            <span className="text-gray-700 font-medium">Address:</span>
            <span className="text-gray-600">{dummyProfile.address}</span>
          </div>

          <div className="flex justify-between items-center pb-4">
            <span className="text-gray-700 font-medium">Phone:</span>
            <span className="text-gray-600">{dummyProfile.phone}</span>
          </div>
        </div>

        {/* Edit Profile Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleEditProfile}
            className="bg-slate-700 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
