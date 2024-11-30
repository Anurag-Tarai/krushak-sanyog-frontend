import React, { useEffect } from "react";
import Slider from "../components/Slider"; // Ensure this component can handle the new props
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
          <h2 className="text-3xl lg:text-4xl font-bold">Farming Feeds Nations.</h2>
        </div>
      </div>

      {/* Categories Section */}
      <div className="mt-6 mb-8 text-center">
        <h2 className="text-2xl lg:text-3xl font-extrabold text-green-800">
          Supply Categories
        </h2>
        <p className="mt-2 text-gray-600 text-base lg:text-lg">
          Explore a wide range of fresh and quality products
        </p>
      </div>

      <div className="flex justify-center space-x-2 overflow-x-auto pb-4 snap-x snap-mandatory">
        {categories.map((category, index) => (
          <div key={index} className="flex-shrink-0 snap-start">
            <CategoryCard
              category={category.name}
              imageSrc={category.image}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
