import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Farmer1 from "../assets/farmer/HomeLogo2.png";

const Home = () => {
  const missionRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const handleSmoothScroll = () => {
    const targetY =
      missionRef.current?.getBoundingClientRect().top + window.scrollY - 60;
    if (!targetY) return;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  return (
    <div className="relative bg-gradient-to-br from-[#0a0f0a] via-[#0d1410] to-[#061008] text-gray-100 min-h-screen flex flex-col justify-between pt-20 overflow-hidden">
      {/* 🌌 Background mesh (no green glow) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* ❌ Removed green glowing circles */}

        {/* Subtle grid overlay for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:40px_40px]" />
      </div>

      {/* 🌾 Hero Section */}
      <motion.div
        style={{ opacity, scale }}
        className="relative overflow-hidden rounded-[2rem] shadow-[0_0_60px_rgba(0,0,0,0.3)] 
                   border border-gray-800/40 mx-4 lg:mx-10 backdrop-blur-xl bg-gradient-to-br from-gray-900/30 via-gray-900/20 to-green-950/20
                   flex flex-col lg:flex-row-reverse items-center justify-between group"
        whileHover={{
          y: -4,
          boxShadow: "0 0 80px rgba(0,0,0,0.4)",
          transition: { duration: 0.6, ease: "easeOut" },
        }}
      >
        {/* 🖼️ Image on Right */}
        <div className="relative flex-shrink-0 w-full lg:w-1/2 overflow-hidden group">
          {/* Sharp transparent → green diagonal background */}
          <div
            className="absolute inset-0 lg:rounded-none lg:rounded-r-[2rem] rounded-[2rem] pointer-events-none z-0"
            style={{
              background: `
                linear-gradient(135deg,
                  transparent 0%,
                  transparent 60%,
                  rgba(0,128,0,0.85) 60%,
                  rgba(0,128,0,0.85) 100%)
              `,
            }}
          />

          <motion.img
            src={Farmer1}
            alt="Farmer Connect"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 w-full h-[50vh] object-cover rounded-[2rem] lg:rounded-none lg:rounded-r-[2rem]"
          />

          {/* Accent border */}
          <div className="absolute inset-0 z-20 rounded-[2rem] lg:rounded-none lg:rounded-r-[2rem] transition-all duration-700" />
        </div>

        {/* ✨ Text on Left */}
        <div className="relative flex flex-col items-center lg:items-start justify-center text-center lg:text-left p-8 lg:p-14 w-full lg:w-1/2 space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-gray-400 via-gray-400 to-gray-400 
                       bg-clip-text text-transparent tracking-tight relative"
          >
            Farmer Connect
            <motion.span
              className="absolute -bottom-2 left-0 lg:left-0 right-0 lg:right-auto h-[3px] bg-gradient-to-r from-green-400/80 via-emerald-500/60 to-transparent rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
            />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="text-base md:text-xl text-gray-300/90 max-w-2xl leading-relaxed font-light"
          >
            Bridging the gap between{" "}
            <span className="text-green-400 font-semibold">farmers</span> and{" "}
            <span className="text-green-400 font-semibold">buyers</span> — fostering trust, sustainability, and growth.
          </motion.p>

          <motion.button
            onClick={handleSmoothScroll}
            whileHover={{
              scale: 1.06,
            }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative mt-2 px-10 py-4 rounded-2xl bg-gradient-to-r from-green-800 to-green-800 hover:from-green-700 hover:to-green-700
                       text-white text-base font-semibold overflow-hidden transition-all duration-300"
          >
            <span className="relative z-10">Get Started</span>
          </motion.button>
        </div>
      </motion.div>

      {/* 🌱 Mission Section */}
      <motion.section
        ref={missionRef}
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="mt-32 text-center px-6 md:px-16 lg:px-40 scroll-mt-24"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.5 }}
          className="backdrop-blur-sm bg-gray-900/10 border border-gray-800/30 rounded-3xl p-10 md:p-14 shadow-[0_0_50px_rgba(0,0,0,0.15)]"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-green-500 bg-clip-text text-transparent mb-6">
            Empowering Local Farmers
          </h2>
          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent mx-auto mb-8 rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: "6rem" }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
          />
          <p className="text-gray-300/90 leading-relaxed text-base md:text-xl max-w-3xl mx-auto font-light">
            Our mission is simple — to create a fair, transparent, and community-driven
            platform where farmers can showcase their produce and buyers can access
            authentic, sustainable goods directly from the source.
          </p>
        </motion.div>
      </motion.section>

      {/* 🌍 CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1 }}
        className="mt-24 mb-32 flex justify-center px-4"
      >
        <motion.div
          whileHover={{
            scale: 1.02,
            y: -6,
            boxShadow: "0 0 60px rgba(0,0,0,0.3)",
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative bg-gradient-to-br from-gray-900/70 via-gray-900/60 to-green-950/40 border border-gray-800/60 
                     rounded-[2rem] p-12 md:p-16 text-center shadow-[0_0_50px_rgba(0,0,0,0.15)] 
                     max-w-4xl backdrop-blur-xl overflow-hidden"
        >
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold bg-green-500 bg-clip-text text-transparent mb-5">
              Join the Farmer Connect Community
            </h3>
            <motion.div
              className="w-20 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent mx-auto mb-8 rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: "5rem" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <p className="text-gray-300/90 mb-10 text-base md:text-xl leading-relaxed max-w-2xl mx-auto font-light">
              Whether you're a farmer looking to expand your reach or a buyer seeking
              fresh, authentic products — we bring you together.
            </p>
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500
                         text-white px-10 py-4 rounded-2xl text-base font-semibold overflow-hidden transition-all duration-300"
            >
              <span className="relative z-10">Know More</span>
            </motion.button>
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default Home;
