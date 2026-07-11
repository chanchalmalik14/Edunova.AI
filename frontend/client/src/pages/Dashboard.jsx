import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Brain, BookOpen, FileText, BarChart3,
  Settings, LogOut, Award, Calendar, Sun, Moon
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function Dashboard() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [username, setUsername] = useState("");
  const [stats, setStats] = useState({
    quizzes_completed: 0,
    learning_score: "0%",
    assignments_completed: 0,
    notes_available: 0
  });

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    const storedUser = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    if (!loggedIn || !storedUser) {
      navigate("/login");
    } else {
      setUsername(storedUser);
      const fetchStats = async () => {
        try {
          const response = await fetch("http://127.0.0.1:8000/analytics", {
            headers: { Authorization: `Bearer ${token}` }
          });
          const json = await response.json();
          if (response.ok && json.stats) setStats(json.stats);
        } catch (err) { console.error("Error fetching dashboard stats:", err); }
      };
      fetchStats();
    }
  }, [navigate]);

  const handleLogout = () => { localStorage.clear(); navigate("/login"); };

  const sidebarItem = (icon, label, path, active = false) => (
    <div
      onClick={() => navigate(path)}
      className={`flex items-center gap-3 p-3 rounded-xl transition cursor-pointer ${
        active
          ? "bg-blue-50 dark:bg-white/5 text-blue-600 dark:text-white"
          : "hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300"
      }`}
    >
      {icon}
      <p>{label}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-black dark:text-white flex">

      {/* Sidebar */}
      <div className="w-72 bg-white dark:bg-white/[0.03] border-r border-gray-200 dark:border-white/10 p-6 hidden md:flex flex-col shadow-sm dark:shadow-none">
        <h1 className="text-3xl font-light">
          Edunova<span className="text-blue-400 font-semibold">.AI</span>
        </h1>
        <div className="mt-12 flex flex-col gap-2 flex-1">
          {sidebarItem(<LayoutDashboard size={20}/>, "Dashboard", "/dashboard", true)}
          {sidebarItem(<Brain size={20}/>, "AI Workspace", "/ai-notes")}
          {sidebarItem(<BookOpen size={20}/>, "Notes Library", "/notes-library")}
          {sidebarItem(<FileText size={20}/>, "Assignments", "/assignment")}
          {sidebarItem(<Award size={20}/>, "Quizzes", "/quizzes")}
          {sidebarItem(<Calendar size={20}/>, "Attendance", "/attendance")}
          {sidebarItem(<BarChart3 size={20}/>, "Analytics", "/analytics")}
          {sidebarItem(<Settings size={20}/>, "Settings", "/settings")}
          <div
            onClick={toggleTheme}
            className="flex items-center gap-3 p-3 rounded-xl transition cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300 mt-auto"
          >
            {theme === "dark" ? <Sun size={20} className="text-yellow-400"/> : <Moon size={20} className="text-blue-500"/>}
            <p>{theme === "dark" ? "Light Mode" : "Dark Mode"}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-4 w-full bg-red-500 hover:bg-red-600 transition-all duration-300 py-3 rounded-2xl flex items-center justify-center gap-2 text-white"
        >
          <LogOut size={18}/> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-5xl font-light">Welcome Back 👋</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg">Continue learning with AI.</p>
          </div>
          <div className="flex items-center gap-4 bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 px-5 py-3 rounded-2xl shadow-sm dark:shadow-none">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-lg font-bold text-white">
              {username?.charAt(0).toUpperCase() || "S"}
            </div>
            <div>
              <p className="text-gray-900 dark:text-white">{username || "Student"}</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Student</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-sm dark:shadow-none">
            <h3 className="text-gray-500 dark:text-gray-400">Quizzes Completed</h3>
            <p className="text-4xl mt-4 text-blue-400 font-semibold">{stats.quizzes_completed}</p>
          </div>
          <div className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-sm dark:shadow-none">
            <h3 className="text-gray-500 dark:text-gray-400">Assignments Completed</h3>
            <p className="text-4xl mt-4 text-green-400 font-semibold">{stats.assignments_completed}</p>
          </div>
          <div className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-sm dark:shadow-none">
            <h3 className="text-gray-500 dark:text-gray-400">Notes Available</h3>
            <p className="text-4xl mt-4 text-purple-400 font-semibold">{stats.notes_available}</p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-14">
          {[
            { path: "/ai-notes", color: "blue", icon: <Brain className="text-blue-400" size={30}/>, title: "AI Workspace", desc: "Generate notes and learn anything instantly." },
            { path: "/notes-library", color: "green", icon: <BookOpen className="text-green-400" size={30}/>, title: "Notes Library", desc: "Access notes uploaded by teachers." },
            { path: "/assignment", color: "purple", icon: <FileText className="text-purple-400" size={30}/>, title: "Assignments", desc: "View and submit classroom assignments." },
            { path: "/quizzes", color: "yellow", icon: <Award className="text-yellow-400" size={30}/>, title: "Quizzes", desc: "Test your knowledge and practice your concepts." },
            { path: "/attendance", color: "red", icon: <Calendar className="text-red-400" size={30}/>, title: "My Attendance", desc: "Track your daily present/absent logs." },
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

export default Dashboard;
