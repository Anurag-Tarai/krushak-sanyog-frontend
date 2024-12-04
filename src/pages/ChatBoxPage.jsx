import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const ChatBoxPage = ({ productId }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null); // Reference for scrolling to the bottom when a new message arrives

  const getJwtToken = () => {
    return localStorage.getItem('jwtToken'); // Assumes the token is stored in localStorage with the key 'jwtToken'
  };

  useEffect(() => {
    // Function for fetching chat messages for the selected product (session)
    const fetchMessages = async () => {
      try {
        const token = getJwtToken();
        const response = await axios.get(`http://localhost:8080/chat/${productId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    const interval = setInterval(() => {
      fetchMessages();
    }, 2000); 

    fetchMessages();
    return () => clearInterval(interval);
  }, [productId]);

  const handleSendMessage = async () => {
    if (message.trim() === '') return;

    // Prepare the message data to send, with timestamp and productId
    const messageData = {
      productId,
      message,
      dateTime: new Date().toISOString(),  // Include timestamp
    };

    try {
      const token = getJwtToken();
      await axios.post('http://localhost:8080/chat/', messageData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // Update the message list with the new message (optimistic UI update)
      setMessages([...messages, { ...messageData, userName: 'Anupam Tarai', isAdmin: false }]); // Mock user data
      setMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Handle sending message when the Enter key is pressed
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

 
  return (
    <div className="max-w-4xl mx-auto p-5 bg-gray-100 rounded-xl shadow-lg flex flex-col h-full">
      <h2 className="text-center text-2xl font-semibold mb-5 text-gray-700">
        Chat for Product ID: {productId}
      </h2>
      <div className="flex-grow overflow-y-auto mb-4 p-4 bg-white rounded-lg shadow-inner">
        {/* Messages list */}
        {messages&&messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 p-3 rounded-lg ${
              msg.isAdmin ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-800'
            }`}
          >
            <div className="flex justify-between">
              <strong>{msg.isAdmin ? 'Admin' : msg.userName}</strong>
              <span className="text-xs text-gray-500">{new Date(msg.dateTime).toLocaleString()}</span>
            </div>
            <p>{msg.message}</p>
          </div>
        ))}
        {/* End of messages list */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="flex mt-4">
  <input
    type="text"
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    onKeyDown={handleKeyDown}  // Handle Enter key press
    placeholder="Type a message"
    className="flex-grow p-3 border border-gray-300 rounded-l-md"
  />
  <button
    onClick={handleSendMessage}
    className="p-1 bg-green-500 mb-5 text-white rounded-r-md hover:bg-green-600"
  >
    Send
  </button>
</div>

    </div>
  );
};

export default ChatBoxPage;
