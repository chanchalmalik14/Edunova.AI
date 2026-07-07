import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Hero() {

  const navigate = useNavigate();

  return (
    <div className="relative bg-gray-950 text-white min-h-screen flex items-center justify-center overflow-hidden px-6">

      {/* Animated Background Glow */}
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 6 }}
        className="absolute w-72 h-72 bg-blue-500/20 rounded-full blur-3xl top-20 left-20"
      />

      <motion.div
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ repeat: Infinity, duration: 8 }}
        className="absolute w-72 h-72 bg-purple-500/20 rounded-full blur-3xl bottom-20 right-20"
      />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center text-center">

        {/* Animated Logo */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="text-6xl md:text-7xl font-light tracking-wider"
        >
          Edunova
          <span className="text-blue-400 font-semibold">
            .AI
          </span>
        </motion.h1>

        {/* Animated Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-gray-400 mt-4 max-w-xl text-lg leading-relaxed"
        >
          An AI-powered learning platform built for smarter education,
          deeper understanding, and faster growth.
        </motion.p>

        {/* Animated Button */}
        <motion.button
          onClick={() => navigate("/login")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="mt-8 bg-blue-500 hover:bg-blue-600 transition-all duration-300 text-white px-8 py-3 rounded-full shadow-lg hover:scale-105"
        >
          Get Started
        </motion.button>

      </div>
    </div>
  );
}

export default Hero;