import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function LoginPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit Login
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const loginData = new URLSearchParams();
      loginData.append("username", formData.email);
      loginData.append("password", formData.password);

      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: loginData
      });

      const data = await response.json();

      if (response.ok && data.access_token) {
        // Save session data to localStorage
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("full_name", data.full_name);
        
        // Legacy keys to keep compatibility
        localStorage.setItem("userRole", data.role === "teacher" ? "Teacher" : (data.role === "admin" ? "Admin" : "Student"));
        localStorage.setItem("username", data.full_name);
        localStorage.setItem("isLoggedIn", "true");

        // Show Success Popup
        setShowSuccess(true);

        // Redirect based on role
        setTimeout(() => {
          if (data.role === "teacher") {
            window.location.href = "/teacher-dashboard";
          } else if (data.role === "admin") {
            window.location.href = "/admin-dashboard";
          } else {
            window.location.href = "/dashboard";
          }
        }, 1500);
      } else {
        alert(data.message || "Invalid email or password");
      }
    } catch (err) {
      console.error(err);
      alert("Authentication failed. Please check backend server.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white flex items-center justify-center px-6 relative overflow-hidden">
            {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 border border-gray-200 dark:border-white/10 transition-all duration-300 shadow-sm"
        title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {theme === "dark" ? <Sun size={18} className="text-yellow-400"/> : <Moon size={18} className="text-blue-500"/>}
      </button>

      {/* Background Glow */}
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 7 }}
        className="absolute w-[450px] h-[450px] bg-blue-500/20 rounded-full blur-[120px] top-[-100px] left-[-100px]"
      />

      <motion.div
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ repeat: Infinity, duration: 9 }}
        className="absolute w-[450px] h-[450px] bg-purple-500/20 rounded-full blur-[120px] bottom-[-100px] right-[-100px]"
      />

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-lg bg-white dark:bg-white/[0.05] backdrop-blur-sm dark:backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-[40px] p-10 shadow-xl dark:shadow-2xl"
      >
        {/* Logo */}
        <div className="text-center">
          <Link to="/">
            <h1 className="text-5xl font-light tracking-wide inline-block hover:opacity-80 transition-opacity">
              Edunova
              <span className="text-blue-400 font-semibold">
                .AI
              </span>
            </h1>
          </Link>
          <p className="text-gray-400 mt-4 text-lg">
            AI Powered Smart Education Platform
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-12">
          <h2 className="text-3xl text-center font-light">
            Welcome Back
          </h2>

          {/* Email */}
          <div className="mt-8">
            <p className="mb-3 text-gray-400">
              Email Address
            </p>
            <div className="flex items-center bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-4 focus-within:border-blue-500 transition-colors">
              <Mail className="text-gray-500" size={20} />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-transparent px-4 py-4 outline-none text-gray-900 dark:text-white placeholder-gray-400"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mt-6">
            <p className="mb-3 text-gray-400">
              Password
            </p>
            <div className="flex items-center bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-4 focus-within:border-blue-500 transition-colors">
              <Lock className="text-gray-500" size={20} />
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-transparent px-4 py-4 outline-none text-gray-900 dark:text-white placeholder-gray-400"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-10 w-full bg-blue-500 hover:bg-blue-600 transition-all duration-300 py-4 rounded-2xl text-lg font-medium hover:scale-[1.01] shadow-lg shadow-blue-500/20"
          >
            Sign In
          </button>

          {/* Helper links */}
          <div className="mt-8 text-center text-gray-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors hover:underline">
              Get Started
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-gray-500 hover:text-gray-400 text-sm transition-colors hover:underline">
              Back to Home
            </Link>
          </div>
        </form>
      </motion.div>

      {/* Success Popup */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute z-50 bg-white/[0.08] backdrop-blur-2xl border border-green-500/20 rounded-3xl px-10 py-8 shadow-2xl"
        >
          <div className="text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <div className="text-4xl">
                âœ…
              </div>
            </div>
            <h2 className="text-3xl mt-6 text-green-400 font-medium">
              Login Successful
            </h2>
            <p className="text-gray-400 mt-3">
              Redirecting to your dashboard...
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default LoginPage;

