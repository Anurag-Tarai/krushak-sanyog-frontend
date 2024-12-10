import React from "react";
import Slider from "../components/Slider";
import CategoryCard from "../components/CategoryCard";
import Veg from "../picture/category/vegitables.jpg";
import Fruits from "../picture/category/fruits.webp";
import DryFruits from "../picture/category/dry-fruits.webp";
import Dairy from "../picture/category/dairy.jpeg";
import HerbSpices from "../picture/category/indian-spices.webp";
import Farmer1 from "../picture/farmer/best2.jpg";
import Farmer2 from "../picture/farmer/best.jpg";
import Farmer3 from "../picture/farmer/tim-mossholder-xDwEa2kaeJA-unsplash.jpg";

const Home = () => {
  const categories = [
    { name: "Vegetables", image: Veg },
    { name: "Dairy Products", image: Dairy },
    { name: "Dry Fruits", image: DryFruits },
    { name: "Fruits", image: Fruits },
    { name: "Herbs and Spices", image: HerbSpices },
  ];

  const slideImages = [Farmer1, Farmer2, Farmer3];

  return (
    <div className="bg-gray-50 p-4 lg:p-10 rounded-lg shadow-lg">
      {/* Slider Section */}
      <div className="relative overflow-hidden rounded-lg shadow-md">
        <Slider images={slideImages} interval={5000} />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center text-white">
          <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-center px-4">
            Farming Feeds Nations
          </h2>
        </div>
      </div>

      {/* Categories Section */}
      <div className="mt-6 mb-8 text-center">
        <h2 className="text-lg md:text-2xl lg:text-3xl font-extrabold text-green-800">
          Supply Categories
        </h2>
        <p className="mt-2 text-gray-600 text-sm md:text-base lg:text-lg">
          Explore a wide range of fresh and quality products
        </p>
      </div>

      {/* Categories Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {categories.map((category, index) => (
          <CategoryCard
            key={index}
            category={category.name}
            imageSrc={category.image}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
