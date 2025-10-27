// components/LiveChat.js
import React from "react";

const LiveChat = ({ messages, newMessage, setNewMessage, handleSendMessage }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow mt-4">
      <h3 className="text-xl font-semibold text-green-600">QnA Section</h3>
      <div className="space-y-2">
        {messages.map((message, index) => (
          <div key={index} className={`text-sm ${message.from === "Farmer" ? "text-green-600" : "text-blue-600"}`}>
            <strong>{message.from}:</strong> {message.text}
          </div>
        ))}
      </div>
      <div className="mt-4">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="w-full p-2 border rounded-lg"
        />
        <button onClick={handleSendMessage} className="mt-2 py-2 px-4 bg-green-600 text-white rounded-lg">
          Send
        </button>
      </div>
    </div>
  );
};

export default LiveChat;
