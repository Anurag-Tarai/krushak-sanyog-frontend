import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const QNAPage = ({ onSessionClick }) => {  // Accept onSessionClick as a prop
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    const fetchSessions = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8080/ecom/products/all?sort=desc", {
          headers: {
            Authorization: `Bearer ${token}`, // Add JWT token to request
          },
        });
        const sortedSessions = response.data.sort((a, b) => b.productId - a.productId);
        setSessions(sortedSessions);
      } catch (error) {
        console.error("Error fetching data from the API: ", error);
      }
    };
    fetchSessions();
  }, []);

  return (
    <div className="qna-page p-6">
      <h2 className="text-2xl font-semibold mb-4">Available Q&A Sessions</h2>

      {/* Session List */}
      <div className="session-list space-y-4">
        {sessions.map((session) => (
          <div
            key={session.productId}
            className="session p-4 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-all duration-300 flex items-center space-x-4 border border-gray-200 hover:bg-green-50"
            onClick={() => onSessionClick(session.productId)}  // Trigger onSessionClick passed from Admin
          >
            {/* Product Image */}
            <img 
              src={session.imageUrl} 
              alt={session.name} 
              className="w-16 h-16 object-cover rounded-full border-2 border-green-500"
            />
            
            {/* Product Info */}
            <div className="flex flex-col">
              <p className="font-semibold text-lg text-gray-800">{session.name}</p>
              <p className="text-sm text-gray-500">Product ID: {session.productId}</p>
              {/* Additional session details */}
              <div className="text-sm text-gray-600 mt-2">
                <p><strong>Category:</strong> {session.category}</p>
                <p><strong>Available Quantity:</strong>{session.price} kg</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QNAPage;
