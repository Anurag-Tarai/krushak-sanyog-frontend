import React from "react";

const CategoryCard = ({ category, imageSrc }) => {
  return (
    <div className="bg-white flex flex-col border rounded-lg shadow-lg overflow-hidden w-[15rem] h-[18rem] mx-4 my-4 p-2">
      <img
        src={imageSrc}
        alt={category}
        className="w-full h-[8rem] object-cover" // Adjust height to fit within the card
      />
      <div className="flex flex-col justify-between text-center mt-2 h-full">
        <h3 className="text-lg font-bold mb-2 flex-grow flex items-center justify-center"> {/* Increased font size and centered */}
          {category}
        </h3>
        <button className="bg-green-600 text-white text-xs px-2 py-1 rounded-lg hover:bg-green-700 transition duration-300 w-full"> {/* Full width button */}
          View {category}
        </button>
      </div>
    </div>
  );
};

export default CategoryCard;
