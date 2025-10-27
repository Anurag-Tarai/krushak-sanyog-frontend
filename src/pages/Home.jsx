import React, { useRef } from "react";
import { motion } from "framer-motion";
import Slider from "../components/common/Slider";
import Farmer1 from "../assets/farmer/HomeLogo2.png";

const Home = () => {
  const slideImages = [Farmer1];
  const missionRef = useRef(null);

  const handleSmoothScroll = () => {
    const targetY =
      missionRef.current?.getBoundingClientRect().top + window.scrollY - 60;
    if (!targetY) return;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  return (
    <div className="relative bg-gradient-to-tr from-black via-gray-950 to-green-950 text-gray-100 min-h-screen flex flex-col justify-between pt-20 overflow-hidden">
      {/* 🌌 Ambient Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/3 w-[420px] h-[420px] bg-emerald-600/10 blur-[180px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-0 left-1/3 w-[350px] h-[350px] bg-green-500/10 blur-[160px] rounded-full" />
      </div>

      {/* 🌾 Hero Section */}
      <motion.div
        className="relative overflow-hidden rounded-3xl shadow-[0_0_40px_rgba(34,197,94,0.12)] border border-green-800/20 mx-4 lg:mx-10 backdrop-blur-md"
        whileHover={{
          y: -2,
          transition: { duration: 1 },
        }}
      >
        <div className="relative">
          <Slider images={slideImages} interval={5000} />
          <div className="absolute inset-0 bg-gradient-to-bl from-black/60 via-transparent to-black/70 pointer-events-none rounded-3xl" />
        </div>

        {/* ✨ Overlay Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl md:text-6xl font-extrabold text-green-400 drop-shadow-[0_0_12px_rgba(34,197,94,0.5)] tracking-tight relative 
              after:content-[''] after:block after:w-0 hover:after:w-full after:h-[2px] after:bg-green-400/60 
              after:mx-auto after:transition-all after:duration-700 after:mt-3"
          >
            Farmer Connect
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="mt-4 text-base md:text-lg text-gray-300 max-w-2xl leading-relaxed relative
              after:content-[''] after:block after:w-0 hover:after:w-[70%] after:mx-auto after:h-[1px]
              after:bg-green-400/40 after:transition-all after:duration-700 after:mt-3"
          >
            Bridging the gap between{" "}
            <span className="text-green-400 font-semibold">farmers</span> and{" "}
            <span className="text-green-400 font-semibold">buyers</span> — fostering trust,
            sustainability, and growth.
          </motion.p>

          <motion.button
            onClick={handleSmoothScroll}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 25px rgba(74,222,128,0.5)",
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="mt-6 bg-gradient-to-br from-green-700 to-green-500
              hover:from-green-600 hover:to-green-400
              text-white px-8 py-3 rounded-xl text-base font-semibold 
              relative overflow-hidden group"
          >
            <span className="relative z-10">Explore Products</span>
            {/* Subtle green shimmer underline */}
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-green-400/70 group-hover:w-full transition-all duration-700"></span>
          </motion.button>
        </div>
      </motion.div>

      {/* 🌱 Mission Section */}
      <motion.section
        ref={missionRef}
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1 }}
        className="mt-24 text-center px-6 md:px-16 lg:px-40 scroll-mt-24"
      >
        <h2
          className="text-3xl md:text-4xl font-bold text-green-400 mb-5 drop-shadow-[0_0_10px_rgba(34,197,94,0.25)] 
          relative after:content-[''] after:block after:w-0 hover:after:w-[60%] after:mx-auto 
          after:h-[2px] after:bg-green-400/50 after:transition-all after:duration-700 after:mt-3"
        >
          Empowering Local Farmers
        </h2>
        <p className="text-gray-300 leading-relaxed text-base md:text-lg max-w-3xl mx-auto">
          Our mission is simple — to create a fair, transparent, and community-driven
          platform where farmers can showcase their produce and buyers can access
          authentic, sustainable goods directly from the source.
        </p>
      </motion.section>

      {/* 🌍 CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1 }}
        className="mt-20 mb-24 flex justify-center px-4"
      >
        <motion.div
          whileHover={{
            scale: 1.02,
            y: -4,
          }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-tl from-gray-900/80 via-green-950/25 to-gray-950/80 
          border border-green-800/25 rounded-3xl p-10 md:p-14 text-center 
          shadow-[0_0_40px_rgba(34,197,94,0.1)] max-w-3xl backdrop-blur-md 
          transition-all duration-500 group relative overflow-hidden"
        >
          {/* Premium glowing underline animation */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-green-500/60 group-hover:w-4/5 transition-all duration-700" />

          <h3 className="text-2xl md:text-3xl font-bold text-green-400 mb-4 drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]">
            Join the Farmer Connect Community
          </h3>
          <p className="text-gray-300 mb-8 text-base md:text-lg leading-relaxed">
            Whether you're a farmer looking to expand your reach or a buyer seeking
            fresh, authentic products — we bring you together.
          </p>
          <motion.button
            whileHover={{
              scale: 1.06,
              boxShadow: "0 0 25px rgba(74,222,128,0.5)",
            }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 180 }}
            className="bg-gradient-to-br from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 
              text-white px-8 py-3 rounded-xl text-base font-semibold transition duration-300 shadow-md 
              relative overflow-hidden group"
          >
            <span className="relative z-10">Get Started</span>
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-green-400/70 group-hover:w-full transition-all duration-700"></span>
          </motion.button>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default Home;
