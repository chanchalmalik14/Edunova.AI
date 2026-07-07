import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Upload,
  FileText,
  Users,
  LogOut,
  BookOpen,
  BarChart3
} from "lucide-react";

function TeacherDashboard() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");

  // Login Protection
  useEffect(() => {

    const loggedIn = localStorage.getItem("isLoggedIn");

    const storedUser = localStorage.getItem("username");

    if (!loggedIn || !storedUser) {

      navigate("/login");

    } else {

      setUsername(storedUser);
    }

  }, [navigate]);

  // Logout
  const handleLogout = () => {

    localStorage.clear();

    navigate("/login");
  };

  return (

    <div className="min-h-screen bg-black text-white flex">

      {/* SIDEBAR */}
      <div className="w-72 bg-white/[0.03] border-r border-white/10 p-6 hidden md:block">

        {/* Logo */}
        <h1 className="text-3xl font-light">
          Edunova
          <span className="text-blue-400 font-semibold">
            .AI
          </span>
        </h1>

        {/* Menu */}
        <div className="mt-12 flex flex-col gap-5 text-gray-300">

          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl text-white">

            <LayoutDashboard size={20} />

            <p>Teacher Dashboard</p>

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

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8 overflow-y-auto">

        {/* Top */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

          <div>

            <h1 className="text-5xl font-light">
              Welcome Teacher 👋
            </h1>

            <p className="text-gray-400 mt-3 text-lg">
              Manage students, assignments and notes.
            </p>

          </div>

          {/* Profile */}
          <div className="flex items-center gap-4 bg-white/[0.04] border border-white/10 px-5 py-3 rounded-2xl">

            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-lg font-bold">

              {username?.charAt(0).toUpperCase() || "T"}

            </div>

            <div>

              <p>
                {username || "Teacher"}
              </p>

              <p className="text-gray-400 text-sm">
                Teacher
              </p>

            </div>

          </div>

        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">

          <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-6">

            <h3 className="text-gray-400">
              Total Students
            </h3>

            <p className="text-4xl mt-4 text-blue-400 font-semibold">
              120
            </p>

          </div>

          <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-6">

            <h3 className="text-gray-400">
              Assignments
            </h3>

            <p className="text-4xl mt-4 text-green-400 font-semibold">
              12
            </p>

          </div>

          <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-6">

            <h3 className="text-gray-400">
              Notes Uploaded
            </h3>

            <p className="text-4xl mt-4 text-purple-400 font-semibold">
              24
            </p>

          </div>

        </div>

        {/* FEATURE CARDS */}
        <div className="grid md:grid-cols-3 gap-8 mt-14">

          {/* Upload Notes */}
          <div
            onClick={() => navigate("/upload-notes")}
            className="bg-white/[0.04] border border-white/10 rounded-3xl p-8 hover:border-blue-500 transition-all duration-300 cursor-pointer"
          >

            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center">

              <Upload
                className="text-blue-400"
                size={30}
              />

            </div>

            <h2 className="text-2xl mt-6">
              Upload Notes
            </h2>

            <p className="text-gray-400 mt-3">
              Upload study material and PDFs for students.
            </p>

          </div>

          {/* Assignments */}
          <div
            onClick={() => navigate("/teacher-assignments")}
            className="bg-white/[0.04] border border-white/10 rounded-3xl p-8 hover:border-green-500 transition-all duration-300 cursor-pointer"
          >

            <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center">

              <FileText
                className="text-green-400"
                size={30}
              />

            </div>

            <h2 className="text-2xl mt-6">
              Assignments
            </h2>

            <p className="text-gray-400 mt-3">
              Create and manage assignments for students.
            </p>

          </div>

          {/* Students */}
          <div
            className="bg-white/[0.04] border border-white/10 rounded-3xl p-8 hover:border-purple-500 transition-all duration-300 cursor-pointer"
          >

            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center">

              <Users
                className="text-purple-400"
                size={30}
              />

            </div>

            <h2 className="text-2xl mt-6">
              Students
            </h2>

            <p className="text-gray-400 mt-3">
              Manage and track student performance.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default TeacherDashboard;