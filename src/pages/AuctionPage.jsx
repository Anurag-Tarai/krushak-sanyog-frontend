import React, { useState, useEffect } from "react";

const AuctionPage = () => {
  const [bids, setBids] = useState([]);
  const [newBid, setNewBid] = useState("");
  const [endTime, setEndTime] = useState(new Date().getTime() + 3600000); // 1 hour countdown
  const [remainingTime, setRemainingTime] = useState("");

  useEffect(() => {
    // Calculate time left
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime - now;
      if (distance < 0) {
        setRemainingTime("Auction Ended");
        clearInterval(interval);
      } else {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setRemainingTime(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  useEffect(() => {
    // Simulate fetching live bids
    const interval = setInterval(() => {
      setBids((prevBids) => [
        ...prevBids,
        { id: `User${Math.floor(Math.random() * 100)}`, bid: Math.floor(Math.random() * 1000) + 1 },
      ]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleBid = () => {
    // Simulate bid submission
    setBids((prevBids) => [
      ...prevBids,
      { id: `User${Math.floor(Math.random() * 100)}`, bid: newBid },
    ]);
    setNewBid("");
  };

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Auction Details */}
        <div className="bg-white shadow-lg p-6 rounded-lg">
          <h2 className="text-2xl font-semibold">Product Name</h2>
          <div className="mt-4">
            <img src="product-image.jpg" alt="Product" className="w-full h-48 object-cover rounded-md" />
            <p className="text-sm text-gray-500 mt-2">Description: Crop type, quality, etc.</p>
            <div className="mt-4">
              <p className="text-lg font-bold">Starting Price: $100</p>
              <p className="text-lg font-semibold">Current Highest Bid: $200</p>
              <p className="text-sm text-gray-500">Time left: {remainingTime}</p>
            </div>
          </div>
        </div>

        {/* Live Bidding Panel */}
        <div className="bg-white shadow-lg p-6 rounded-lg">
          <h2 className="text-xl font-semibold">Live Bidding</h2>
          <div className="mt-4">
            {bids.map((bid, index) => (
              <div key={index} className="flex justify-between mt-2">
                <span className="font-semibold">{bid.id}</span>
                <span className="text-lg">${bid.bid}</span>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <input
              type="number"
              value={newBid}
              onChange={(e) => setNewBid(e.target.value)}
              className="mt-2 p-2 border border-gray-300 rounded-md w-full"
              placeholder="Place your bid"
            />
            <button
              onClick={handleBid}
              className="mt-2 w-full bg-blue-500 text-white p-2 rounded-md"
            >
              Place Bid
            </button>
          </div>
        </div>
      </div>

      {/* Chat Box */}
      <div className="bg-white shadow-lg p-6 rounded-lg mt-6">
        <h2 className="text-xl font-semibold">Live Chat</h2>
        <div className="mt-4 h-64 overflow-y-auto bg-gray-100 p-4 rounded-md">
          <div className="space-y-4">
            {/* Example Chat Message */}
            <div className="flex">
              <span className="font-semibold">User1:</span>
              <span className="ml-2">Can I bid higher than $200?</span>
            </div>
            <div className="flex">
              <span className="font-semibold">User2:</span>
              <span className="ml-2">Yes, place your bid now!</span>
            </div>
            {/* Add more chat messages here */}
          </div>
        </div>
        <div className="mt-4">
          <input
            type="text"
            placeholder="Type a message"
            className="p-2 border border-gray-300 rounded-md w-full"
          />
          <button className="mt-2 w-full bg-gray-500 text-white p-2 rounded-md">Send</button>
        </div>
      </div>
    </div>
  );
};

export default AuctionPage;
