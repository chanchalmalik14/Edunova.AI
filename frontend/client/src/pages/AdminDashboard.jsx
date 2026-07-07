import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  GraduationCap,
  School,
  ClipboardCheck,
  Bell,
  Settings,
  LogOut,
  UserPlus,
  BookPlus,
  Megaphone,
  Layers3,
  ChevronRight,
  Sparkles,
  TrendingUp
} from "lucide-react";

function AdminDashboard() {

  const navigate = useNavigate();

  const [adminName, setAdminName] = useState("");

  // Login Protection
  useEffect(() => {

    const loggedIn = localStorage.getItem("isLoggedIn");

    const username = localStorage.getItem("username");

    if (!loggedIn) {

      navigate("/login");

    } else {

      setAdminName(username || "Admin");
    }

  }, [navigate]);

  // Logout
  const handleLogout = () => {

    localStorage.clear();

    navigate("/login");
  };

  return (

    <div className="min-h-screen bg-black text-white flex overflow-hidden relative">

      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/20 blur-[140px] rounded-full" />

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/20 blur-[140px] rounded-full" />

      {/* SIDEBAR */}
      <div className="w-72 bg-white/[0.03] border-r border-white/10 p-6 hidden md:flex flex-col justify-between relative z-10 backdrop-blur-2xl">

        <div>

          {/* Logo */}
          <h1 className="text-3xl font-light">
            Edunova
            <span className="text-blue-400 font-semibold">
              .AI
            </span>
          </h1>

          {/* Admin Card */}
          <div className="mt-10 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 rounded-3xl p-5">

            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-2xl bg-blue-500 flex items-center justify-center text-xl font-bold">

                {adminName?.charAt(0).toUpperCase() || "A"}

              </div>

              <div>

                <h3 className="text-lg">
                  {adminName}
                </h3>

                <p className="text-gray-400 text-sm">
                  School Administrator
                </p>

              </div>

            </div>

          </div>

          {/* MENU */}
          <div className="mt-10 flex flex-col gap-3 text-gray-300">

            <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl text-white">
              <LayoutDashboard size={20} />
              <p>Dashboard</p>
            </div>

            <div
              onClick={() => navigate("/teacher-management")}
              className="flex items-center justify-between hover:bg-white/5 p-4 rounded-2xl transition cursor-pointer"
            >

              <div className="flex items-center gap-3">
                <GraduationCap size={20} />
                <p>Teachers</p>
              </div>

              <ChevronRight size={18} />

            </div>

            <div
              onClick={() => navigate("/student-management")}
              className="flex items-center justify-between hover:bg-white/5 p-4 rounded-2xl transition cursor-pointer"
            >

              <div className="flex items-center gap-3">
                <Users size={20} />
                <p>Students</p>
              </div>

              <ChevronRight size={18} />

            </div>

            <div
              onClick={() => navigate("/class-management")}
              className="flex items-center justify-between hover:bg-white/5 p-4 rounded-2xl transition cursor-pointer"
            >

              <div className="flex items-center gap-3">
                <School size={20} />
                <p>Classes</p>
              </div>

              <ChevronRight size={18} />

            </div>

            <div
              onClick={() => navigate("/attendance")}
              className="flex items-center justify-between hover:bg-white/5 p-4 rounded-2xl transition cursor-pointer"
            >

              <div className="flex items-center gap-3">
                <ClipboardCheck size={20} />
                <p>Attendance</p>
              </div>

              <ChevronRight size={18} />

            </div>

            <div
              onClick={() => navigate("/notice-board")}
              className="flex items-center justify-between hover:bg-white/5 p-4 rounded-2xl transition cursor-pointer"
            >

              <div className="flex items-center gap-3">
                <Bell size={20} />
                <p>Notice Board</p>
              </div>

              <ChevronRight size={18} />

            </div>

            <div className="flex items-center justify-between hover:bg-white/5 p-4 rounded-2xl transition cursor-pointer">

              <div className="flex items-center gap-3">
                <Settings size={20} />
                <p>Settings</p>
              </div>

              <ChevronRight size={18} />

            </div>

          </div>

        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 transition-all duration-300 py-3 rounded-2xl flex items-center justify-center gap-2"
        >

          <LogOut size={18} />

          Logout

        </button>

      </div>

      {/* MAIN */}
      <div className="flex-1 overflow-y-auto relative z-10">

        {/* HEADER */}
        <div className="p-8 md:p-12">

          <div className="flex flex-col xl:flex-row gap-8">

            {/* LEFT HERO */}
            <div className="flex-1 bg-white/[0.04] border border-white/10 rounded-[40px] p-10 backdrop-blur-2xl">

              <div className="flex items-center gap-3 text-blue-400">

                <Sparkles size={22} />

                <p className="uppercase tracking-[4px] text-sm">
                  School Administration
                </p>

              </div>

              <h1 className="text-6xl font-light mt-6 leading-tight">

                Smart School
                <br />

                Management System

              </h1>

              <p className="text-gray-400 text-lg mt-6 max-w-2xl leading-relaxed">

                Manage teachers, students, classes, assignments,
                attendance and announcements from one premium AI dashboard.

              </p>

              <div className="flex gap-5 mt-10 flex-wrap">

                <button
                  onClick={() => navigate("/teacher-management")}
                  className="bg-blue-500 hover:bg-blue-600 transition-all duration-300 px-8 py-4 rounded-2xl"
                >
                  Manage Teachers
                </button>

                <button
                  onClick={() => navigate("/student-management")}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 px-8 py-4 rounded-2xl"
                >
                  View Students
                </button>

              </div>

            </div>

            {/* RIGHT SIDE */}
            <div className="xl:w-[350px] flex flex-col gap-6">

              {/* Performance */}
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 rounded-[32px] p-8 backdrop-blur-2xl">

                <div className="flex items-center justify-between">

                  <h3 className="text-2xl">
                    School Growth
                  </h3>

                  <TrendingUp className="text-green-400" />

                </div>

                <h1 className="text-6xl font-semibold mt-8">
                  +28%
                </h1>

                <p className="text-gray-300 mt-4">
                  Student engagement increased this month.
                </p>

              </div>

              {/* Activity */}
              <div className="bg-white/[0.04] border border-white/10 rounded-[32px] p-8 backdrop-blur-2xl">

                <h3 className="text-2xl">
                  Today's Activity
                </h3>

                <div className="space-y-5 mt-8">

                  <div className="bg-white/5 rounded-2xl p-4">
                    📘 12 Notes Uploaded
                  </div>

                  <div className="bg-white/5 rounded-2xl p-4">
                    👨‍🎓 18 New Students Added
                  </div>

                  <div className="bg-white/5 rounded-2xl p-4">
                    📝 7 Assignments Published
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* STATS */}
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8 mt-14">

            <div className="bg-white/[0.04] border border-white/10 rounded-[32px] p-8 hover:border-blue-500 transition-all duration-300">

              <Users className="text-blue-400" size={34} />

              <h1 className="text-5xl font-semibold mt-6">
                1250
              </h1>

              <p className="text-gray-400 mt-3 text-lg">
                Total Students
              </p>

            </div>

            <div className="bg-white/[0.04] border border-white/10 rounded-[32px] p-8 hover:border-green-500 transition-all duration-300">

              <GraduationCap className="text-green-400" size={34} />

              <h1 className="text-5xl font-semibold mt-6">
                85
              </h1>

              <p className="text-gray-400 mt-3 text-lg">
                Teachers
              </p>

            </div>

            <div className="bg-white/[0.04] border border-white/10 rounded-[32px] p-8 hover:border-purple-500 transition-all duration-300">

              <Layers3 className="text-purple-400" size={34} />

              <h1 className="text-5xl font-semibold mt-6">
                72
              </h1>

              <p className="text-gray-400 mt-3 text-lg">
                Assignments
              </p>

            </div>

            <div className="bg-white/[0.04] border border-white/10 rounded-[32px] p-8 hover:border-yellow-500 transition-all duration-300">

              <BookPlus className="text-yellow-400" size={34} />

              <h1 className="text-5xl font-semibold mt-6">
                210
              </h1>

              <p className="text-gray-400 mt-3 text-lg">
                Notes Uploaded
              </p>

            </div>

          </div>

          {/* QUICK ACTIONS */}
          <div className="mt-16">

            <div className="flex items-center justify-between">

              <h2 className="text-4xl font-light">
                Quick Actions
              </h2>

              <p className="text-gray-400">
                Manage school faster with shortcuts
              </p>

            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8 mt-10">

              <div
                onClick={() => navigate("/teacher-management")}
                className="group bg-white/[0.04] border border-white/10 rounded-[32px] p-8 cursor-pointer hover:border-blue-500 transition-all duration-300"
              >

                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center">

                  <UserPlus className="text-blue-400" size={30} />

                </div>

                <h3 className="text-2xl mt-8">
                  Add Teacher
                </h3>

                <p className="text-gray-400 mt-4 leading-relaxed">
                  Register new teachers and assign classes.
                </p>

              </div>

              <div
                onClick={() => navigate("/student-management")}
                className="group bg-white/[0.04] border border-white/10 rounded-[32px] p-8 cursor-pointer hover:border-green-500 transition-all duration-300"
              >

                <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center">

                  <Users className="text-green-400" size={30} />

                </div>

                <h3 className="text-2xl mt-8">
                  Add Student
                </h3>

                <p className="text-gray-400 mt-4 leading-relaxed">
                  Manage and organize student records.
                </p>

              </div>

              <div
                onClick={() => navigate("/class-management")}
                className="group bg-white/[0.04] border border-white/10 rounded-[32px] p-8 cursor-pointer hover:border-purple-500 transition-all duration-300"
              >

                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center">

                  <School className="text-purple-400" size={30} />

                </div>

                <h3 className="text-2xl mt-8">
                  Create Class
                </h3>

                <p className="text-gray-400 mt-4 leading-relaxed">
                  Organize sections and subjects efficiently.
                </p>

              </div>

              <div
                onClick={() => navigate("/notice-board")}
                className="group bg-white/[0.04] border border-white/10 rounded-[32px] p-8 cursor-pointer hover:border-yellow-500 transition-all duration-300"
              >

                <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center">

                  <Megaphone className="text-yellow-400" size={30} />

                </div>

                <h3 className="text-2xl mt-8">
                  Post Notice
                </h3>

                <p className="text-gray-400 mt-4 leading-relaxed">
                  Announce updates to teachers and students.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;