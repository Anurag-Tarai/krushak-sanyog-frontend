import React from "react";

const CategoryCard = ({ category, imageSrc }) => {
  return (
    <div className="bg-white flex flex-col border rounded-lg shadow-lg overflow-hidden mx-auto w-[12rem] md:w-[15rem] lg:w-[18rem] h-auto p-2">
      {/* Image Section */}
      <img
        src={imageSrc}
        alt={category}
        className="w-full h-[10rem] md:h-[12rem] lg:h-[14rem] object-cover"
      />

      {/* Content Section */}
      <div className="flex flex-col justify-between text-center mt-2">
        <h3 className="text-base md:text-lg lg:text-xl font-bold mb-2 flex-grow flex items-center justify-center">
          {category}
        </h3>
        <button className="bg-green-600 text-white text-xs md:text-sm px-2 py-1 rounded-lg hover:bg-green-700 transition duration-300">
          View {category}
        </button>
      </div>
    </div>
  );
};
export default CategoryCard;
