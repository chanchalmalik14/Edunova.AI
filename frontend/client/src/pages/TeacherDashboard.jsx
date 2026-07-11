import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Upload, FileText, Users, LogOut,
  Award, Settings, Calendar, Sun, Moon
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function TeacherDashboard() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [username, setUsername] = useState("");
  const [stats, setStats] = useState({ total_students: 0, assignments_created: 0, notes_uploaded: 0 });

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    const storedUser = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    if (!loggedIn || !storedUser) { navigate("/login"); return; }
    setUsername(storedUser);
    const fetchStats = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/analytics", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const json = await response.json();
        if (response.ok && json.stats) setStats(json.stats);
      } catch (err) { console.error("Error fetching teacher dashboard stats:", err); }
    };
    fetchStats();
  }, [navigate]);

  const handleLogout = () => { localStorage.clear(); navigate("/login"); };

  const navItem = (icon, label, path, active = false) => (
    <div
      onClick={() => navigate(path)}
      className={`flex items-center gap-3 p-3 rounded-xl transition cursor-pointer ${
        active ? "bg-blue-50 dark:bg-white/5 text-blue-600 dark:text-white" : "hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300"
      }`}
    >{icon}<p>{label}</p></div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-black dark:text-white flex">

      {/* SIDEBAR */}
      <div className="w-72 bg-white dark:bg-white/[0.03] border-r border-gray-200 dark:border-white/10 p-6 hidden md:flex flex-col shadow-sm dark:shadow-none">
        <h1 className="text-3xl font-light">Edunova<span className="text-blue-400 font-semibold">.AI</span></h1>
        <div className="mt-12 flex flex-col gap-2 flex-1">
          {navItem(<LayoutDashboard size={20}/>, "Dashboard", "/teacher-dashboard", true)}
          {navItem(<Upload size={20}/>, "Upload Notes", "/upload-notes")}
          {navItem(<FileText size={20}/>, "Assignments", "/teacher-assignments")}
          {navItem(<Award size={20}/>, "Quizzes", "/teacher-quizzes")}
          {navItem(<Users size={20}/>, "Students", "/student-management")}
          {navItem(<Calendar size={20}/>, "Attendance", "/teacher-attendance")}
          {navItem(<Settings size={20}/>, "Settings", "/teacher-settings")}
          <div
            onClick={toggleTheme}
            className="flex items-center gap-3 p-3 rounded-xl transition cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300 mt-auto"
          >
            {theme === "dark" ? <Sun size={20} className="text-yellow-400"/> : <Moon size={20} className="text-blue-500"/>}
            <p>{theme === "dark" ? "Light Mode" : "Dark Mode"}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="mt-4 w-full bg-red-500 hover:bg-red-600 transition-all duration-300 py-3 rounded-2xl flex items-center justify-center gap-2 text-white">
          <LogOut size={18}/> Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-5xl font-light">Welcome Teacher 👋</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg">Manage students, assignments and notes.</p>
          </div>
          <div className="flex items-center gap-4 bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 px-5 py-3 rounded-2xl shadow-sm dark:shadow-none">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-lg font-bold text-white">
              {username?.charAt(0).toUpperCase() || "T"}
            </div>
            <div>
              <p className="text-gray-900 dark:text-white">{username || "Teacher"}</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Teacher</p>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {[
            { label: "Total Students", value: stats.total_students, color: "text-blue-400" },
            { label: "Assignments Created", value: stats.assignments_created, color: "text-green-400" },
            { label: "Notes Uploaded", value: stats.notes_uploaded, color: "text-purple-400" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-sm dark:shadow-none">
              <h3 className="text-gray-500 dark:text-gray-400">{label}</h3>
              <p className={`text-4xl mt-4 font-semibold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* FEATURE CARDS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mt-14">
          {[
            { path: "/upload-notes", color: "blue", icon: <Upload className="text-blue-400" size={30}/>, title: "Upload Notes", desc: "Upload study material and PDFs for students." },
            { path: "/teacher-assignments", color: "green", icon: <FileText className="text-green-400" size={30}/>, title: "Assignments", desc: "Create and manage assignments for students." },
            { path: "/teacher-quizzes", color: "yellow", icon: <Award className="text-yellow-400" size={30}/>, title: "Quizzes", desc: "Create custom quizzes or generate with AI." },
            { path: "/student-management", color: "purple", icon: <Users className="text-purple-400" size={30}/>, title: "Students", desc: "Manage student listings and grade uploads." },
            { path: "/teacher-attendance", color: "red", icon: <Calendar className="text-red-400" size={30}/>, title: "Attendance", desc: "Mark daily attendance and check logs." },
          ].map(({ path, color, icon, title, desc }) => (
            <div
              key={path}
              onClick={() => navigate(path)}
              className={`bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-8 hover:border-${color}-500 transition-all duration-300 cursor-pointer shadow-sm dark:shadow-none`}
            >
              <div className={`w-16 h-16 rounded-2xl bg-${color}-500/10 flex items-center justify-center`}>{icon}</div>
              <h2 className="text-2xl mt-6">{title}</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-3 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;
