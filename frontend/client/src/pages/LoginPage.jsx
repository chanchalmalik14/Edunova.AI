import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  School,
  GraduationCap
} from "lucide-react";

function LoginPage() {

  const [step, setStep] = useState(1);

  const [role, setRole] = useState("");

  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    school: "",
    className: "",
    password: "",
  });

  // Handle Input Change
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Role Selection
  const handleRoleSelect = (selectedRole) => {

    setRole(selectedRole);

    setStep(2);
  };

  // Submit
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
        // Save live session data
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("full_name", data.full_name);
        
        // Legacy keys to keep compatibility
        localStorage.setItem("userRole", data.role === "teacher" ? "Teacher" : "Student");
        localStorage.setItem("username", data.full_name);
        localStorage.setItem("isLoggedIn", "true");

        // Show Success Popup
        setShowSuccess(true);

        // Redirect
        setTimeout(() => {
          window.location.href =
            data.role === "teacher"
              ? "/teacher-dashboard"
              : "/dashboard";
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

    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 relative overflow-hidden">

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
        className="relative z-10 w-full max-w-2xl bg-white/[0.05] backdrop-blur-2xl border border-white/10 rounded-[40px] p-10 shadow-2xl"
      >

        {/* Logo */}
        <div className="text-center">

          <h1 className="text-5xl font-light tracking-wide">

            Edunova

            <span className="text-blue-400 font-semibold">
              .AI
            </span>

          </h1>

          <p className="text-gray-400 mt-4 text-lg">
            AI Powered Smart Education Platform
          </p>

        </div>

        {/* STEP 1 */}
        {step === 1 && (

          <div className="mt-12">

            <h2 className="text-3xl text-center font-light">
              Continue As
            </h2>

            <div className="grid md:grid-cols-3 gap-6 mt-10">

              {/* Student */}
              <button
                onClick={() => handleRoleSelect("Student")}
                className="bg-white/[0.04] border border-white/10 rounded-3xl p-8 hover:border-blue-500 hover:bg-white/[0.08] transition-all duration-300"
              >

                <GraduationCap
                  size={50}
                  className="mx-auto text-blue-400"
                />

                <h3 className="text-2xl mt-6">
                  Student
                </h3>

                <p className="text-gray-400 mt-3 text-sm">
                  Access AI learning tools and assignments.
                </p>

              </button>

              {/* Teacher */}
              <button
                onClick={() => handleRoleSelect("Teacher")}
                className="bg-white/[0.04] border border-white/10 rounded-3xl p-8 hover:border-green-500 hover:bg-white/[0.08] transition-all duration-300"
              >

                <User
                  size={50}
                  className="mx-auto text-green-400"
                />

                <h3 className="text-2xl mt-6">
                  Teacher
                </h3>

                <p className="text-gray-400 mt-3 text-sm">
                  Manage students, notes and assignments.
                </p>

              </button>

              {/* Admin */}
              <button
                onClick={() => handleRoleSelect("Admin")}
                className="bg-white/[0.04] border border-white/10 rounded-3xl p-8 hover:border-purple-500 hover:bg-white/[0.08] transition-all duration-300"
              >

                <School
                  size={50}
                  className="mx-auto text-purple-400"
                />

                <h3 className="text-2xl mt-6">
                  Admin
                </h3>

                <p className="text-gray-400 mt-3 text-sm">
                  Control school system and analytics.
                </p>

              </button>

            </div>

          </div>

        )}

        {/* STEP 2 */}
        {step === 2 && (

          <form
            onSubmit={handleSubmit}
            className="mt-12"
          >

            <h2 className="text-3xl text-center font-light">

              {role} Registration

            </h2>

            {/* Name */}
            <div className="mt-8">

              <p className="mb-3 text-gray-400">
                Full Name
              </p>

              <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl px-4">

                <User
                  className="text-gray-500"
                  size={20}
                />

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent px-4 py-4 outline-none"
                />

              </div>

            </div>

            {/* Email */}
            <div className="mt-6">

              <p className="mb-3 text-gray-400">
                Email Address
              </p>

              <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl px-4">

                <Mail
                  className="text-gray-500"
                  size={20}
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent px-4 py-4 outline-none"
                />

              </div>

            </div>

            {/* School */}
            <div className="mt-6">

              <p className="mb-3 text-gray-400">
                School Name
              </p>

              <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl px-4">

                <School
                  className="text-gray-500"
                  size={20}
                />

                <input
                  type="text"
                  name="school"
                  placeholder="Enter school name"
                  value={formData.school}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent px-4 py-4 outline-none"
                />

              </div>

            </div>

            {/* Student Class */}
            {role === "Student" && (

              <div className="mt-6">

                <p className="mb-3 text-gray-400">
                  Class
                </p>

                <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl px-4">

                  <GraduationCap
                    className="text-gray-500"
                    size={20}
                  />

                  <input
                    type="text"
                    name="className"
                    placeholder="Enter your class"
                    value={formData.className}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent px-4 py-4 outline-none"
                  />

                </div>

              </div>

            )}

            {/* Password */}
            <div className="mt-6">

              <p className="mb-3 text-gray-400">
                Password
              </p>

              <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl px-4">

                <Lock
                  className="text-gray-500"
                  size={20}
                />

                <input
                  type="password"
                  name="password"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent px-4 py-4 outline-none"
                />

              </div>

            </div>

            {/* Create Button */}
            <button
              type="submit"
              className="mt-10 w-full bg-blue-500 hover:bg-blue-600 transition-all duration-300 py-4 rounded-2xl text-lg font-medium hover:scale-[1.01]"
            >

              Create Account

            </button>

            {/* Back */}
            <button
              type="button"
              onClick={() => setStep(1)}
              className="mt-4 w-full bg-white/5 hover:bg-white/10 transition-all duration-300 py-4 rounded-2xl text-lg"
            >

              Back

            </button>

          </form>

        )}

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
                ✅
              </div>

            </div>

            <h2 className="text-3xl mt-6 text-green-400">
              Account Created
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