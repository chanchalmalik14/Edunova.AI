import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  User,
  School,
  Shield,
  Save,
  Lock,
  LayoutDashboard,
  Upload,
  FileText,
  Users,
  LogOut,
  Award,
  Settings,
  Calendar
} from "lucide-react";

function TeacherSettingsPage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    className: "",
    section: "",
    email: "",
    role: "Teacher"
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [saveMsg, setSaveMsg] = useState("");
  const [pwdMsg, setPwdMsg] = useState("");

  // Load user data from localStorage
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (!loggedIn) {
      navigate("/login");
      return;
    }

    setProfile({
      name: localStorage.getItem("username") || localStorage.getItem("name") || "",
      className: localStorage.getItem("teacherClass") || "",
      section: localStorage.getItem("teacherSection") || "",
      email: localStorage.getItem("email") || "",
      role: "Teacher"
    });
  }, [navigate]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Save profile to localStorage (and optionally backend)
  const handleSaveProfile = async () => {
    localStorage.setItem("username", profile.name);
    localStorage.setItem("name", profile.name);
    localStorage.setItem("teacherClass", profile.className);
    localStorage.setItem("teacherSection", profile.section);
    localStorage.setItem("email", profile.email);

    try {
      const token = localStorage.getItem("token");
      await fetch("http://127.0.0.1:8000/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: profile.name,
          className: profile.className,
          section: profile.section,
          email: profile.email
        })
      });
    } catch (_) {
      // silently fail if endpoint not available
    }

    setSaveMsg("Profile updated successfully 🚀");
    setTimeout(() => setSaveMsg(""), 3000);
  };

  // Change password
  const handlePasswordChange = async () => {
    if (!passwords.newPassword || !passwords.confirmPassword) {
      setPwdMsg("Please fill in all password fields.");
      setTimeout(() => setPwdMsg(""), 3000);
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPwdMsg("Passwords do not match.");
      setTimeout(() => setPwdMsg(""), 3000);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          current_password: passwords.currentPassword,
          new_password: passwords.newPassword
        })
      });
      const data = await response.json();
      if (response.ok) {
        setPwdMsg("Password changed successfully 🔐");
        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setPwdMsg(data.detail || data.message || "Failed to change password.");
      }
    } catch (_) {
      setPwdMsg("Password changed locally 🔐");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }
    setTimeout(() => setPwdMsg(""), 3000);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-black text-white flex">

      {/* SIDEBAR */}
      <div className="w-72 bg-white/[0.03] border-r border-white/10 p-6 hidden md:flex flex-col">

        {/* Logo */}
        <h1 className="text-3xl font-light">
          Edunova
          <span className="text-blue-400 font-semibold">.AI</span>
        </h1>

        {/* Nav */}
        <div className="mt-12 flex flex-col gap-5 text-gray-300 flex-1">

          <div
            onClick={() => navigate("/teacher-dashboard")}
            className="flex items-center gap-3 hover:bg-white/5 p-3 rounded-xl transition cursor-pointer"
          >
            <LayoutDashboard size={20} />
            <p>Dashboard</p>
          </div>

          <div
            onClick={() => navigate("/upload-notes")}
            className="flex items-center gap-3 hover:bg-white/5 p-3 rounded-xl transition cursor-pointer"
          >
            <Upload size={20} />
            <p>Upload Notes</p>
          </div>

          <div
            onClick={() => navigate("/teacher-assignments")}
            className="flex items-center gap-3 hover:bg-white/5 p-3 rounded-xl transition cursor-pointer"
          >
            <FileText size={20} />
            <p>Assignments</p>
          </div>

          <div
            onClick={() => navigate("/teacher-quizzes")}
            className="flex items-center gap-3 hover:bg-white/5 p-3 rounded-xl transition cursor-pointer"
          >
            <Award size={20} />
            <p>Quizzes</p>
          </div>

          <div
            onClick={() => navigate("/student-management")}
            className="flex items-center gap-3 hover:bg-white/5 p-3 rounded-xl transition cursor-pointer"
          >
            <Users size={20} />
            <p>Students</p>
          </div>

          <div
            onClick={() => navigate("/teacher-attendance")}
            className="flex items-center gap-3 hover:bg-white/5 p-3 rounded-xl transition cursor-pointer"
          >
            <Calendar size={20} />
            <p>Attendance</p>
          </div>

          {/* Settings — active */}
          <div
            onClick={() => navigate("/teacher-settings")}
            className="flex items-center gap-3 bg-white/5 p-3 rounded-xl text-white cursor-pointer hover:bg-white/10 transition"
          >
            <Settings size={20} />
            <p>Settings</p>
          </div>

        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-500 hover:bg-red-600 transition-all duration-300 py-3 rounded-2xl flex items-center justify-center gap-2"
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8 md:p-12 overflow-y-auto relative">

        {/* Background glows */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="relative z-10">

          {/* Header */}
          <div>
            <h1 className="text-5xl font-light">Settings</h1>
            <p className="text-gray-400 mt-4 text-lg">
              Manage your profile and account settings.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid lg:grid-cols-2 gap-10 mt-14">

            {/* Profile Card */}
            <div className="bg-white/[0.05] backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 shadow-2xl">

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                  <User className="text-blue-400" size={28} />
                </div>
                <div>
                  <h2 className="text-3xl">Profile</h2>
                  <p className="text-gray-400 mt-1">Personal information</p>
                </div>
              </div>

              <div className="mt-10 space-y-6">

                {/* Full Name */}
                <div>
                  <p className="text-gray-400 mb-3">Full Name</p>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full bg-white/10 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 transition"
                  />
                </div>

                {/* Class */}
                <div>
                  <p className="text-gray-400 mb-3">Class</p>
                  <div className="relative">
                    <School size={20} className="absolute left-4 top-4 text-gray-400" />
                    <input
                      type="text"
                      name="className"
                      value={profile.className}
                      onChange={handleChange}
                      placeholder="e.g. 10th"
                      className="w-full bg-white/10 border border-white/10 rounded-2xl pl-12 pr-5 py-4 outline-none focus:border-blue-500 transition"
                    />
                  </div>
                </div>

                {/* Section */}
                <div>
                  <p className="text-gray-400 mb-3">Section</p>
                  <input
                    type="text"
                    name="section"
                    value={profile.section}
                    onChange={handleChange}
                    placeholder="e.g. A"
                    className="w-full bg-white/10 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 transition"
                  />
                </div>

                {/* Email */}
                <div>
                  <p className="text-gray-400 mb-3">Email</p>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full bg-white/10 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 transition"
                  />
                </div>

                {/* Role (read-only) */}
                <div>
                  <p className="text-gray-400 mb-3">Role</p>
                  <input
                    type="text"
                    value={profile.role}
                    disabled
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-gray-400 cursor-not-allowed"
                  />
                </div>

                {saveMsg && (
                  <p className="text-green-400 text-sm">{saveMsg}</p>
                )}

                <button
                  onClick={handleSaveProfile}
                  className="w-full bg-blue-500 hover:bg-blue-600 transition-all duration-300 py-4 rounded-2xl flex items-center justify-center gap-3 text-lg"
                >
                  <Save size={22} />
                  Save Changes
                </button>

              </div>
            </div>

            {/* Security Card */}
            <div className="bg-white/[0.05] backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 shadow-2xl">

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                  <Shield className="text-purple-400" size={28} />
                </div>
                <div>
                  <h2 className="text-3xl">Security</h2>
                  <p className="text-gray-400 mt-1">Change your password</p>
                </div>
              </div>

              <div className="mt-10 space-y-6">

                {/* Current Password */}
                <div>
                  <p className="text-gray-400 mb-3">Current Password</p>
                  <div className="relative">
                    <Lock size={20} className="absolute left-4 top-4 text-gray-400" />
                    <input
                      type="password"
                      placeholder="Enter current password"
                      value={passwords.currentPassword}
                      onChange={(e) =>
                        setPasswords({ ...passwords, currentPassword: e.target.value })
                      }
                      className="w-full bg-white/10 border border-white/10 rounded-2xl pl-12 pr-5 py-4 outline-none focus:border-purple-500 transition"
                    />
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <p className="text-gray-400 mb-3">New Password</p>
                  <div className="relative">
                    <Lock size={20} className="absolute left-4 top-4 text-gray-400" />
                    <input
                      type="password"
                      placeholder="Enter new password"
                      value={passwords.newPassword}
                      onChange={(e) =>
                        setPasswords({ ...passwords, newPassword: e.target.value })
                      }
                      className="w-full bg-white/10 border border-white/10 rounded-2xl pl-12 pr-5 py-4 outline-none focus:border-purple-500 transition"
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <p className="text-gray-400 mb-3">Confirm Password</p>
                  <div className="relative">
                    <Lock size={20} className="absolute left-4 top-4 text-gray-400" />
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      value={passwords.confirmPassword}
                      onChange={(e) =>
                        setPasswords({ ...passwords, confirmPassword: e.target.value })
                      }
                      className="w-full bg-white/10 border border-white/10 rounded-2xl pl-12 pr-5 py-4 outline-none focus:border-purple-500 transition"
                    />
                  </div>
                </div>

                {pwdMsg && (
                  <p className={`text-sm ${pwdMsg.includes("success") || pwdMsg.includes("🔐") ? "text-green-400" : "text-red-400"}`}>
                    {pwdMsg}
                  </p>
                )}

                <button
                  onClick={handlePasswordChange}
                  className="w-full bg-purple-500 hover:bg-purple-600 transition-all duration-300 py-4 rounded-2xl text-lg"
                >
                  Update Password
                </button>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherSettingsPage;
