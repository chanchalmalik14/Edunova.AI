import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon, User, Mail, Lock, School, GraduationCap, CheckCircle, Clock, AlertCircle } from "lucide-react";

function RegisterPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");
  const [schools, setSchools] = useState([]);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // { type: "success"|"pending"|"error", message }
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    school: "",
    className: "",
    password: "",
  });

  // Fetch schools list for dropdown
  useEffect(() => {
    const fetchSchools = async () => {
      setLoadingSchools(true);
      try {
        const res = await fetch("http://127.0.0.1:8000/schools");
        const data = await res.json();
        if (res.ok) setSchools(data.schools || []);
      } catch (err) {
        console.error("Failed to fetch schools:", err);
      } finally {
        setLoadingSchools(false);
      }
    };
    fetchSchools();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.name,
          school_name: formData.school,
          student_class: role === "Student" ? formData.className : "",
          email: formData.email,
          password: formData.password,
          role: role.toLowerCase()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // HTTP error (403, 400, etc.)
        const detail = data.detail || "Registration failed. Please try again.";
        setResult({ type: "error", message: detail });
        return;
      }

      if (data.status === "pending") {
        setResult({
          type: "pending",
          message: "Your teacher account is pending approval. Your school admin will review and approve your registration before you can log in."
        });
      } else {
        setResult({ type: "success", message: "Account created successfully!" });
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      console.error(err);
      setResult({ type: "error", message: "Registration failed. Please check the backend server." });
    } finally {
      setSubmitting(false);
    }
  };

  // Result screen (success / pending / error)
  const ResultCard = () => {
    const config = {
      success: {
        icon: <CheckCircle size={48} className="text-green-400" />,
        bg: "bg-green-500/10",
        border: "border-green-500/30",
        title: "Account Created!",
        titleColor: "text-green-400",
        subtitle: "Redirecting you to login..."
      },
      pending: {
        icon: <Clock size={48} className="text-yellow-400" />,
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/30",
        title: "Registration Submitted",
        titleColor: "text-yellow-400",
        subtitle: result?.message
      },
      error: {
        icon: <AlertCircle size={48} className="text-red-400" />,
        bg: "bg-red-500/10",
        border: "border-red-500/30",
        title: "Registration Failed",
        titleColor: "text-red-400",
        subtitle: result?.message
      }
    };

    const c = config[result?.type];
    return (
      <div className={`mt-10 ${c.bg} border ${c.border} rounded-3xl p-8 text-center`}>
        <div className="flex justify-center mb-4">{c.icon}</div>
        <h3 className={`text-2xl font-medium ${c.titleColor}`}>{c.title}</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-3 text-sm leading-relaxed">{c.subtitle}</p>
        {result?.type !== "pending" && (
          <div className="mt-6 flex gap-3 justify-center">
            {result?.type === "error" && (
              <button onClick={() => setResult(null)} className="px-6 py-2 rounded-xl bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 transition text-sm">
                Try Again
              </button>
            )}
            <Link to="/login" className="px-6 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition text-sm">
              Go to Login
            </Link>
          </div>
        )}
        {result?.type === "pending" && (
          <div className="mt-6">
            <Link to="/login" className="px-6 py-3 rounded-xl bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 transition text-sm inline-block">
              Back to Login
            </Link>
          </div>
        )}
      </div>
    );
  };

  const inputClass = "flex items-center bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-4 focus-within:border-blue-500 transition-colors";
  const inputField = "w-full bg-transparent px-4 py-4 outline-none text-gray-900 dark:text-white placeholder-gray-400";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white flex items-center justify-center px-6 relative overflow-hidden py-10">
      
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 border border-gray-200 dark:border-white/10 transition-all duration-300 shadow-sm"
      >
        {theme === "dark" ? <Sun size={18} className="text-yellow-400"/> : <Moon size={18} className="text-blue-500"/>}
      </button>

      {/* Background Glow */}
      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 7 }}
        className="absolute w-[450px] h-[450px] bg-blue-500/20 rounded-full blur-[120px] top-[-100px] left-[-100px]" />
      <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 9 }}
        className="absolute w-[450px] h-[450px] bg-purple-500/20 rounded-full blur-[120px] bottom-[-100px] right-[-100px]" />

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-2xl bg-white dark:bg-white/[0.05] backdrop-blur-sm dark:backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-[40px] p-10 shadow-2xl"
      >
        {/* Logo */}
        <div className="text-center">
          <Link to="/">
            <h1 className="text-5xl font-light tracking-wide inline-block hover:opacity-80 transition-opacity">
              Edunova<span className="text-blue-400 font-semibold">.AI</span>
            </h1>
          </Link>
          <p className="text-gray-500 dark:text-gray-400 mt-4 text-lg">AI Powered Smart Education Platform</p>
        </div>

        {/* STEP 1 — Role Selection */}
        {step === 1 && (
          <div className="mt-12">
            <h2 className="text-3xl text-center font-light">Register As</h2>

            <div className="grid md:grid-cols-2 gap-6 mt-10">
              {/* Student */}
              <button
                onClick={() => handleRoleSelect("Student")}
                className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-8 hover:border-blue-500 transition-all duration-300 flex flex-col items-center justify-between min-h-[220px]"
              >
                <GraduationCap size={50} className="text-blue-400" />
                <h3 className="text-2xl mt-4">Student</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-xs text-center">Access AI learning tools and assignments.</p>
              </button>

              {/* Teacher */}
              <button
                onClick={() => handleRoleSelect("Teacher")}
                className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-8 hover:border-green-500 transition-all duration-300 flex flex-col items-center justify-between min-h-[220px]"
              >
                <User size={50} className="text-green-400" />
                <h3 className="text-2xl mt-4">Teacher</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-xs text-center">Manage students, notes and assignments.</p>
                <span className="mt-3 text-xs bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1 rounded-full">
                  Requires Admin Approval
                </span>
              </button>
            </div>

            {/* Admin info note */}
            <div className="mt-8 p-4 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-center text-sm text-gray-500 dark:text-gray-400">
              Admin accounts are provisioned by the <span className="text-blue-400">Edunova team</span>. Contact us to onboard your school.
            </div>

            <div className="mt-8 text-center text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors hover:underline">Sign In</Link>
            </div>
          </div>
        )}

        {/* STEP 2 — Registration Form */}
        {step === 2 && !result && (
          <form onSubmit={handleSubmit} className="mt-12">
            <h2 className="text-3xl text-center font-light">{role} Registration</h2>
            {role === "Teacher" && (
              <p className="text-center text-yellow-500 text-sm mt-2">Your account will require approval from your school admin.</p>
            )}

            {/* Name */}
            <div className="mt-8">
              <p className="mb-3 text-gray-500 dark:text-gray-400">Full Name</p>
              <div className={inputClass}>
                <User className="text-gray-500" size={20} />
                <input type="text" name="name" placeholder="Enter your full name" value={formData.name} onChange={handleChange} required className={inputField} />
              </div>
            </div>

            {/* Email */}
            <div className="mt-6">
              <p className="mb-3 text-gray-500 dark:text-gray-400">Email Address</p>
              <div className={inputClass}>
                <Mail className="text-gray-500" size={20} />
                <input type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} required className={inputField} />
              </div>
            </div>

            {/* School Dropdown */}
            <div className="mt-6">
              <p className="mb-3 text-gray-500 dark:text-gray-400">School</p>
              <div className={inputClass}>
                <School className="text-gray-500 shrink-0" size={20} />
                <select
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent px-4 py-4 outline-none text-gray-900 dark:text-white"
                >
                  <option value="" disabled className="bg-gray-900">
                    {loadingSchools ? "Loading schools..." : "Select your school"}
                  </option>
                  {schools.map((s) => (
                    <option key={s} value={s} className="bg-gray-900 text-white">{s}</option>
                  ))}
                </select>
              </div>
              {schools.length === 0 && !loadingSchools && (
                <p className="mt-2 text-xs text-red-400">No schools are currently registered. Contact the Edunova team.</p>
              )}
            </div>

            {/* Class (Students only) */}
            {role === "Student" && (
              <div className="mt-6">
                <p className="mb-3 text-gray-500 dark:text-gray-400">Class</p>
                <div className={inputClass}>
                  <GraduationCap className="text-gray-500" size={20} />
                  <input type="text" name="className" placeholder="Enter your class (e.g. 10th)" value={formData.className} onChange={handleChange} required className={inputField} />
                </div>
              </div>
            )}

            {/* Password */}
            <div className="mt-6">
              <p className="mb-3 text-gray-500 dark:text-gray-400">Password</p>
              <div className={inputClass}>
                <Lock className="text-gray-500" size={20} />
                <input type="password" name="password" placeholder="Create a password" value={formData.password} onChange={handleChange} required className={inputField} />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="mt-10 w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 transition-all duration-300 py-4 rounded-2xl text-lg font-medium text-white hover:scale-[1.01]"
            >
              {submitting ? "Creating Account..." : "Create Account"}
            </button>

            <button
              type="button"
              onClick={() => { setStep(1); setResult(null); }}
              className="mt-4 w-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-all duration-300 py-4 rounded-2xl text-lg"
            >
              Back
            </button>
          </form>
        )}

        {/* Result screen */}
        {step === 2 && result && <ResultCard />}

      </motion.div>
    </div>
  );
}

export default RegisterPage;
