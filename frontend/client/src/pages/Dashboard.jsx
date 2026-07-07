import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Brain,
  BookOpen,
  FileText,
  BarChart3,
  Settings,
  LogOut
} from "lucide-react";

function Dashboard() {

  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [stats, setStats] = useState({
    quizzes_completed: 0,
    learning_score: "0%",
    assignments_completed: 0,
    notes_available: 0
  });

  // Login Protection & Fetch Stats
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
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const json = await response.json();
          if (response.ok && json.stats) {
            setStats(json.stats);
          }
        } catch (err) {
          console.error("Error fetching dashboard stats:", err);
        }
      };
      fetchStats();
    }

  }, [navigate]);

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (

    <div className="min-h-screen bg-black text-white flex">

      {/* Sidebar */}
      <div className="w-72 bg-white/[0.03] border-r border-white/10 p-6 hidden md:block">

        <h1 className="text-3xl font-light">
          Edunova
          <span className="text-blue-400 font-semibold">.AI</span>
        </h1>

        <div className="mt-12 flex flex-col gap-5 text-gray-300">

          {/* Dashboard */}
          <div
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3 bg-white/5 p-3 rounded-xl text-white cursor-pointer hover:bg-white/10 transition"
          >
            <LayoutDashboard size={20} />
            <p>Dashboard</p>
          </div>

          {/* AI Workspace */}
          <div
            onClick={() => navigate("/ai-notes")}
            className="flex items-center gap-3 hover:bg-white/5 p-3 rounded-xl transition cursor-pointer"
          >
            <Brain size={20} />
            <p>AI Workspace</p>
          </div>

          {/* Notes Library */}
          <div
            onClick={() => navigate("/notes-library")}
            className="flex items-center gap-3 hover:bg-white/5 p-3 rounded-xl transition cursor-pointer"
          >
            <BookOpen size={20} />
            <p>Notes Library</p>
          </div>

          {/* Assignments */}
          <div
            onClick={() => navigate("/assignment")}
            className="flex items-center gap-3 hover:bg-white/5 p-3 rounded-xl transition cursor-pointer"
          >
            <FileText size={20} />
            <p>Assignments</p>
          </div>

          {/* Analytics (FIXED) */}
          <div
            onClick={() => navigate("/analytics")}
            className="flex items-center gap-3 hover:bg-white/5 p-3 rounded-xl transition cursor-pointer"
          >
            <BarChart3 size={20} />
            <p>Analytics</p>
          </div>

          {/* Settings */}
          <div
            onClick={() => navigate("/settings")}
            className="flex items-center gap-3 hover:bg-white/5 p-3 rounded-xl transition cursor-pointer"
          >
            <Settings size={20} />
            <p>Settings</p>
          </div>

        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-10 w-full bg-red-500 hover:bg-red-600 transition-all duration-300 py-3 rounded-2xl flex items-center justify-center gap-2"
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

          <div>
            <h1 className="text-5xl font-light">
              Welcome Back 👋
            </h1>
            <p className="text-gray-400 mt-3 text-lg">
              Continue learning with AI.
            </p>
          </div>

          {/* Profile */}
          <div className="flex items-center gap-4 bg-white/[0.04] border border-white/10 px-5 py-3 rounded-2xl">

            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-lg font-bold">
              {username?.charAt(0).toUpperCase() || "S"}
            </div>

            <div>
              <p>{username || "Student"}</p>
              <p className="text-gray-400 text-sm">Student</p>
            </div>

          </div>

        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">

          <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-6">
            <h3 className="text-gray-400">Quizzes Completed</h3>
            <p className="text-4xl mt-4 text-blue-400 font-semibold">{stats.quizzes_completed}</p>
          </div>

          <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-6">
            <h3 className="text-gray-400">Assignments Completed</h3>
            <p className="text-4xl mt-4 text-green-400 font-semibold">{stats.assignments_completed}</p>
          </div>

          <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-6">
            <h3 className="text-gray-400">Notes Available</h3>
            <p className="text-4xl mt-4 text-purple-400 font-semibold">{stats.notes_available}</p>
          </div>

        </div>

        {/* Main Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-14">

          <div
            onClick={() => navigate("/ai-notes")}
            className="bg-white/[0.04] border border-white/10 rounded-3xl p-8 hover:border-blue-500 transition-all duration-300 cursor-pointer"
          >
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center">
              <Brain className="text-blue-400" size={30} />
            </div>

            <h2 className="text-2xl mt-6">AI Workspace</h2>
            <p className="text-gray-400 mt-3">
              Generate notes and learn anything instantly.
            </p>
          </div>

          <div
            onClick={() => navigate("/notes-library")}
            className="bg-white/[0.04] border border-white/10 rounded-3xl p-8 hover:border-green-500 transition-all duration-300 cursor-pointer"
          >
            <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center">
              <BookOpen className="text-green-400" size={30} />
            </div>

            <h2 className="text-2xl mt-6">Notes Library</h2>
            <p className="text-gray-400 mt-3">
              Access notes uploaded by teachers.
            </p>
          </div>

          <div
            onClick={() => navigate("/assignment")}
            className="bg-white/[0.04] border border-white/10 rounded-3xl p-8 hover:border-purple-500 transition-all duration-300 cursor-pointer"
          >
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center">
              <FileText className="text-purple-400" size={30} />
            </div>

            <h2 className="text-2xl mt-6">Assignments</h2>
            <p className="text-gray-400 mt-3">
              View and submit assignments.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;