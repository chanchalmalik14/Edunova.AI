import React, { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";

import { Sun, Moon,
  User,
  School,
  Shield,
  Save,
  Lock
} from "lucide-react";

function SettingsPage() {

  const { theme, toggleTheme } = useTheme();
  const [profile, setProfile] = useState({
    name: "",
    school: "",
    className: "",
    rollNo: "",
    email: "",
    role: ""
  });

  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: ""
  });

  // Load User Data
  useEffect(() => {

    setProfile({

      name:
        localStorage.getItem("name") || "",

      school:
        localStorage.getItem("school") || "",

      className:
        localStorage.getItem("className") || "",

      rollNo:
        localStorage.getItem("rollNo") || "",

      email:
        localStorage.getItem("email") || "",

      role:
        localStorage.getItem("role") || "Student"
    });

  }, []);

  // Handle Profile Change
  const handleChange = (e) => {

    setProfile({

      ...profile,

      [e.target.name]: e.target.value
    });
  };

  // Save Profile
  const handleSaveProfile = () => {

    localStorage.setItem("name", profile.name);

    localStorage.setItem("school", profile.school);

    localStorage.setItem("className", profile.className);

    localStorage.setItem("rollNo", profile.rollNo);

    localStorage.setItem("email", profile.email);

    localStorage.setItem("role", profile.role);

    alert("Profile Updated Successfully ðŸš€");
  };

  // Password Change
  const handlePasswordChange = () => {

    if (
      passwords.newPassword !==
      passwords.confirmPassword
    ) {

      alert("Passwords do not match");

      return;
    }

    localStorage.setItem(
      "password",
      passwords.newPassword
    );

    alert("Password Changed Successfully ðŸ”");

    setPasswords({
      newPassword: "",
      confirmPassword: ""
    });
  };

  return (

    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-black dark:text-white relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/20 blur-[140px] rounded-full" />

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/20 blur-[140px] rounded-full" />

      {/* Main */}
      <div className="relative z-10 p-8 md:p-12">

        {/* Header */}
        <div>

          <h1 className="text-5xl font-light">
            Settings
          </h1>

          <p className="text-gray-400 mt-4 text-lg">
            Manage your profile and account settings.
          </p>

        </div>

        {/* Grid */}
        <div className="grid lg:grid-cols-2 gap-10 mt-14">

          {/* Profile Section */}
          <div className="bg-white dark:bg-white/[0.05] backdrop-blur-sm dark:backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-[32px] p-8 shadow-md dark:shadow-2xl">

            {/* Heading */}
            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center">

                <User
                  className="text-blue-400"
                  size={28}
                />

              </div>

              <div>

                <h2 className="text-3xl">
                  Profile
                </h2>

                <p className="text-gray-400 mt-1">
                  Personal information
                </p>

              </div>

            </div>

            {/* Inputs */}
            <div className="mt-10 space-y-6">

              {/* Name */}
              <div>

                <p className="text-gray-400 mb-3">
                  Full Name
                </p>

                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-blue-500"
                />

              </div>

              {/* School */}
              <div>

                <p className="text-gray-400 mb-3">
                  School
                </p>

                <div className="relative">

                  <School
                    size={20}
                    className="absolute left-4 top-4 text-gray-400"
                  />

                  <input
                    type="text"
                    name="school"
                    value={profile.school}
                    onChange={handleChange}
                    placeholder="Enter school name"
                    className="w-full bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-2xl pl-12 pr-5 py-4 outline-none focus:border-blue-500"
                  />

                </div>

              </div>

              {/* Class */}
              <div>

                <p className="text-gray-400 mb-3">
                  Class
                </p>

                <input
                  type="text"
                  name="className"
                  value={profile.className}
                  onChange={handleChange}
                  placeholder="Class 10"
                  className="w-full bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-blue-500"
                />

              </div>

              {/* Roll No */}
              <div>

                <p className="text-gray-400 mb-3">
                  Roll Number
                </p>

                <input
                  type="text"
                  name="rollNo"
                  value={profile.rollNo}
                  onChange={handleChange}
                  placeholder="Enter roll number"
                  className="w-full bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-blue-500"
                />

              </div>

              {/* Email */}
              <div>

                <p className="text-gray-400 mb-3">
                  Email
                </p>

                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  className="w-full bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-blue-500"
                />

              </div>

              {/* Role */}
              <div>

                <p className="text-gray-400 mb-3">
                  Role
                </p>

                <input
                  type="text"
                  value={profile.role}
                  disabled
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 text-gray-400"
                />

              </div>

              {/* Save */}
              <button
                onClick={handleSaveProfile}
                className="w-full bg-blue-500 hover:bg-blue-600 transition-all duration-300 py-4 rounded-2xl flex items-center justify-center gap-3 text-lg"
              >

                <Save size={22} />

                Save Changes

              </button>

            </div>

          </div>

          {/* Security Section */}
          <div className="bg-white dark:bg-white/[0.05] backdrop-blur-sm dark:backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-[32px] p-8 shadow-md dark:shadow-2xl">

            {/* Heading */}
            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center">

                <Shield
                  className="text-purple-400"
                  size={28}
                />

              </div>

              <div>

                <h2 className="text-3xl">
                  Security
                </h2>

                <p className="text-gray-400 mt-1">
                  Change your password
                </p>

              </div>

            </div>

            {/* Inputs */}
            <div className="mt-10 space-y-6">

              {/* New Password */}
              <div>

                <p className="text-gray-400 mb-3">
                  New Password
                </p>

                <div className="relative">

                  <Lock
                    size={20}
                    className="absolute left-4 top-4 text-gray-400"
                  />

                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={passwords.newPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        newPassword: e.target.value
                      })
                    }
                    className="w-full bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-2xl pl-12 pr-5 py-4 outline-none focus:border-purple-500"
                  />

                </div>

              </div>

              {/* Confirm Password */}
              <div>

                <p className="text-gray-400 mb-3">
                  Confirm Password
                </p>

                <div className="relative">

                  <Lock
                    size={20}
                    className="absolute left-4 top-4 text-gray-400"
                  />

                  <input
                    type="password"
                    placeholder="Confirm password"
                    value={passwords.confirmPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        confirmPassword: e.target.value
                      })
                    }
                    className="w-full bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-2xl pl-12 pr-5 py-4 outline-none focus:border-purple-500"
                  />

                </div>

              </div>

              {/* Button */}
              <button
                onClick={handlePasswordChange}
                className="w-full bg-purple-500 hover:bg-purple-600 transition-all duration-300 py-4 rounded-2xl text-lg"
              >
                Update Password
              </button>

            </div>

          </div>

        </div>
          {/* Appearance Section */}
          <div className="bg-white dark:bg-white/[0.05] backdrop-blur-sm dark:backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-[32px] p-8 shadow-md dark:shadow-2xl col-span-2 lg:col-span-1">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center">
                {theme === "dark" ? <Sun className="text-yellow-400" size={28}/> : <Moon className="text-blue-500" size={28}/>}
              </div>
              <div>
                <h2 className="text-3xl">Appearance</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Switch between dark and light theme</p>
              </div>
            </div>
            <div className="mt-8 flex items-center justify-between p-5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{theme === "dark" ? "Dark Mode" : "Light Mode"}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{theme === "dark" ? "Easy on the eyes at night" : "Clean and bright interface"}</p>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none ${theme === "dark" ? "bg-blue-500" : "bg-gray-300"}`}
              >
                <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform duration-300 ${theme === "dark" ? "translate-x-9" : "translate-x-1"}`}/>
              </button>
            </div>
          </div>

      </div>

    </div>
  );
}

export default SettingsPage;
