import React, { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Farmer1 from "../assets/farmer/HomeLogo2.png";

const Home = () => {
  const missionRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.15], [1, 0.85]);
  const scale = useTransform(scrollYProgress, [0, 0.15], [1, 0.97]);

  // Detect when each section is visible
  const heroRef = useRef(null);
  const missionInView = useInView(missionRef, { amount: 0.3 });
  const heroInView = useInView(heroRef, { amount: 0.3 });

  const handleSmoothScroll = () => {
    const targetY =
      missionRef.current?.getBoundingClientRect().top + window.scrollY - 60;
    if (!targetY) return;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#0b0b0b] text-gray-100 overflow-hidden">
      {/* 🩶 Subtle grid overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:60px_60px] pointer-events-none" />

      {/* 🌾 Hero Section */}
      <motion.section
        ref={heroRef}
        style={{
          opacity: heroInView ? 1 : 0,
          scale,
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
        className="relative w-full max-w-7xl px-4 sm:px-6 md:px-10 lg:px-16 pt-24 md:pt-28 pb-12 md:pb-16 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-10"
      >
        {/* 🖼️ Image */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative w-full lg:w-[48%] rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.2)]"
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, transparent 0%, transparent 60%, rgba(16,185,129,0.8) 0%, rgba(16,185,129,0.8) 100%)",
            }}
          />
          <motion.img
            src={Farmer1}
            alt="Farmer Connect"
            className="w-full h-[35vh] sm:h-[42vh] md:h-[50vh] object-cover object-[40%_center] rounded-2xl relative z-[1]"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </motion.div>

        {/* ✨ Text */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-4 md:space-y-5 w-full lg:w-[48%]">
          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-gray-50 group relative inline-block"
          >
            <span
              className="relative inline-block pb-1
                before:content-['']
                before:absolute before:left-1/2 before:bottom-0
                before:h-[2px] before:w-0
                before:bg-gradient-to-r before:from-emerald-400 before:to-green-500
                before:transition-all before:duration-500 before:ease-out
                group-hover:before:left-0 group-hover:before:w-full"
            >
              Farmer Connect
            </span>
          </motion.h1>

          <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-md leading-relaxed font-light">
            A platform that connects{" "}
            <span className="text-emerald-400 font-medium">farmers</span> and{" "}
            <span className="text-emerald-400 font-medium">buyers</span> through
            transparency, trust, and technology.
          </p>

          <motion.button
            onClick={handleSmoothScroll}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="mt-1 px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl bg-green-800/80 hover:bg-green-700 text-white font-medium transition-all duration-300 text-sm sm:text-base"
          >
            Get Started
          </motion.button>
        </div>
      </motion.section>

      {/* 🌱 Mission Section */}
      <motion.section
        ref={missionRef}
        style={{
          opacity: missionInView ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}
        initial={{ y: 45 }}
        animate={{ y: 0 }}
        className="w-full max-w-5xl px-4 sm:px-8 md:px-12 text-center mt-12 md:mt-16"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-50 mb-4 md:mb-5">
          Empowering Local Farmers
        </h2>
        <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mx-auto font-light">
          Our mission is to empower the agricultural community by simplifying access
          to markets, enabling fair trade, and fostering sustainability through digital
          innovation.
        </p>
      </motion.section>

      {/* 🌍 CTA Section */}
      <motion.section
        style={{
          opacity: missionInView ? 1 : 0.5,
          transition: "opacity 0.6s ease",
        }}
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="mt-20 md:mt-28 mb-16 md:mb-24 px-4 sm:px-6 w-full flex justify-center"
      >
        <div className="max-w-4xl w-full text-center border border-gray-800 rounded-3xl py-10 sm:py-12 md:py-14 px-5 sm:px-7 md:px-8 bg-gray-900/60 backdrop-blur-md">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-50 mb-2 sm:mb-3">
            Join the Farmer Connect Community
          </h3>
          <p className="text-gray-400 mb-7 sm:mb-8 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-light">
            Whether you’re a farmer seeking growth or a buyer sourcing genuine produce —
            together we’re building a better agricultural network.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="px-7 sm:px-9 py-2.5 sm:py-3 rounded-xl bg-green-800/80 hover:bg-green-700 text-white font-medium transition-all duration-300 text-sm sm:text-base"
          >
            Know More
          </motion.button>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
