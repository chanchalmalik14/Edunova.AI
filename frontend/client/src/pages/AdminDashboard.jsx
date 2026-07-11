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
  TrendingUp,
  Trash2,
  Search,
  Plus,
  X,
  PlusCircle,
  HelpCircle,
  FileText,
  Award,
  BookOpen
} from "lucide-react";

function AdminDashboard() {
  const navigate = useNavigate();

  const [adminName, setAdminName] = useState("");
  const [activeTab, setActiveTab] = useState("overview"); // overview, users, classes, content, announcements, settings

  // Overview stats & Activity states
  const [analytics, setAnalytics] = useState({
    stats: {
      total_users: 0,
      total_students: 0,
      total_teachers: 0,
      total_notes: 0,
      total_assignments: 0,
      total_quizzes: 0
    },
    recent_activity: []
  });
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  // User Management states
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [userRoleFilter, setUserRoleFilter] = useState("teacher"); // "teacher" or "student"
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingPending, setLoadingPending] = useState(false);

  // Create User Form
  const [userForm, setUserForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "student",
    student_class: "",
    school_name: "Edunova High School"
  });

  // Class Management states
  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [classForm, setClassForm] = useState({
    class_name: "",
    sections: "", // comma separated
    subjects: ""  // comma separated
  });

  // Content Management states
  const [content, setContent] = useState({
    notes: [],
    assignments: [],
    quizzes: []
  });
  const [loadingContent, setLoadingContent] = useState(false);

  // Announcement states
  const [announcements, setAnnouncements] = useState([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);
  const [announceForm, setAnnounceForm] = useState({
    title: "",
    content: "",
    target_group: "all"
  });

  // AI settings state
  const [aiSettings, setAiSettings] = useState({
    model: "gemini-3-flash-preview",
    maxTokens: "2048",
    temperature: "0.7"
  });

  // Check login and load config
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("username") || localStorage.getItem("full_name") || "Admin";

    if (!loggedIn || role !== "admin") {
      localStorage.clear();
      navigate("/login");
      return;
    }
    setAdminName(name);
    
    // Default load analytics
    fetchAnalytics();
  }, [navigate]);

  // Tab Load triggers
  useEffect(() => {
    if (activeTab === "overview") fetchAnalytics();
    if (activeTab === "users") { fetchUsers(); fetchPendingTeachers(); }
    if (activeTab === "classes") fetchClasses();
    if (activeTab === "content") fetchContent();
    if (activeTab === "announcements") fetchAnnouncements();
  }, [activeTab, userRoleFilter]);

  // Fetch Analytics
  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/admin/analytics", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setAnalytics(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  // Fetch Users (Teachers and Students)
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const token = localStorage.getItem("token");
      const url = userRoleFilter === "teacher" 
        ? "http://127.0.0.1:8000/admin/get-teachers" 
        : "http://127.0.0.1:8000/admin/get-students";
      
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        if (userRoleFilter === "teacher") {
          setTeachers(data.teachers || []);
        } else {
          setStudents(data.students || []);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch Pending Teachers
  const fetchPendingTeachers = async () => {
    setLoadingPending(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/admin/pending-teachers", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setPendingTeachers(data.pending_teachers || []);
    } catch (err) { console.error(err); }
    finally { setLoadingPending(false); }
  };

  // Approve Teacher
  const handleApproveTeacher = async (email) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:8000/admin/approve-teacher/${encodeURIComponent(email)}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setPendingTeachers(prev => prev.filter(t => t.email !== email));
        setTeachers(prev => [...prev, { ...pendingTeachers.find(t => t.email === email), status: "active" }]);
      } else {
        alert(data.detail || "Failed to approve teacher");
      }
    } catch (err) { console.error(err); }
  };

  // Reject Teacher
  const handleRejectTeacher = async (email) => {
    if (!window.confirm(`Reject and remove ${email}?`)) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:8000/admin/reject-teacher/${encodeURIComponent(email)}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setPendingTeachers(prev => prev.filter(t => t.email !== email));
    } catch (err) { console.error(err); }
  };

  // Create User Account
  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!userForm.full_name || !userForm.email || !userForm.password) {
      alert("All fields are required");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/admin/add-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(userForm)
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "User created successfully!");
        setUserForm({
          full_name: "",
          email: "",
          password: "",
          role: "student",
          student_class: "",
          school_name: "Edunova High School"
        });
        fetchUsers();
      } else {
        alert(data.detail || data.message || "Failed to create user");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete User
  const handleDeleteUser = async (email) => {
    if (!window.confirm(`Are you sure you want to delete user ${email}?`)) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:8000/admin/delete-user/${email}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        alert("User deleted successfully!");
        fetchUsers();
      } else {
        alert(data.detail || "Delete operation failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch Classes Configurations
  const fetchClasses = async () => {
    setLoadingClasses(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/admin/get-classes", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setClasses(data.classes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingClasses(false);
    }
  };

  // Create Class Configuration
  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!classForm.class_name) {
      alert("Class name is required");
      return;
    }
    const payload = {
      class_name: classForm.class_name,
      sections: classForm.sections.split(",").map(s => s.trim()).filter(Boolean),
      subjects: classForm.subjects.split(",").map(s => s.trim()).filter(Boolean)
    };
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/admin/create-class", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setClassForm({ class_name: "", sections: "", subjects: "" });
        fetchClasses();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Class Config
  const handleDeleteClass = async (className) => {
    if (!window.confirm(`Delete configuration for ${className} class?`)) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:8000/admin/delete-class/${className}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert("Class configuration deleted");
        fetchClasses();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch Content Monitoring Data
  const fetchContent = async () => {
    setLoadingContent(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/admin/get-content", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setContent(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingContent(false);
    }
  };

  // Moderate/Delete note
  const handleDeleteNote = async (filename) => {
    if (!window.confirm("Moderator delete this study note?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:8000/delete-note/${filename}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert("Study Note moderated/deleted");
        fetchContent();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Moderate/Delete assignment
  const handleDeleteAssignment = async (title) => {
    if (!window.confirm("Moderator delete this assignment?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:8000/delete-assignment/${title}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert("Assignment moderated/deleted");
        fetchContent();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch Notice Board Announcements
  const fetchAnnouncements = async () => {
    setLoadingAnnouncements(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/admin/get-announcements", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setAnnouncements(data.announcements || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAnnouncements(false);
    }
  };

  // Create Announcement Notice
  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!announceForm.title || !announceForm.content) {
      alert("All fields are required");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/admin/create-announcement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(announceForm)
      });
      if (res.ok) {
        alert("Notice published successfully!");
        setAnnounceForm({ title: "", content: "", target_group: "all" });
        fetchAnnouncements();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Announcement
  const handleDeleteAnnouncement = async (title) => {
    if (!window.confirm("Delete this notice board announcement?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:8000/admin/delete-announcement/${title}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert("Announcement deleted");
        fetchAnnouncements();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Filtered lists for User management tab
  const filteredUsersList = (userRoleFilter === "teacher" ? teachers : students).filter(u => 
    u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white flex overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[150px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/10 blur-[150px] rounded-full" />

      {/* SIDEBAR */}
      <div className="w-72 bg-white/[0.03] border-r border-white/10 p-6 hidden md:flex flex-col justify-between relative z-10 backdrop-blur-2xl">
        <div>
          {/* Logo */}
          <h1 className="text-3xl font-light">
            Edunova
            <span className="text-blue-400 font-semibold">.AI</span>
          </h1>

          {/* Admin Card */}
          <div className="mt-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 rounded-3xl p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-lg font-bold">
                {adminName?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="min-w-0">
                <h3 className="text-md font-medium truncate">{adminName}</h3>
                <p className="text-gray-500 text-xs mt-0.5">Administrator</p>
              </div>
            </div>
          </div>

          {/* MENU */}
          <div className="mt-10 flex flex-col gap-2 text-gray-300">
            {[
              { id: "overview", label: "Overview", icon: <LayoutDashboard size={18} /> },
              { id: "users", label: "User Control", icon: <Users size={18} /> },
              { id: "classes", label: "Classes & Subjects", icon: <School size={18} /> },
              { id: "content", label: "Content Monitor", icon: <BookOpen size={18} /> },
              { id: "announcements", label: "Announcements", icon: <Megaphone size={18} /> },
              { id: "settings", label: "Platform settings", icon: <Settings size={18} /> }
            ].map(tab => (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 p-3.5 rounded-2xl transition cursor-pointer font-medium ${
                  activeTab === tab.id 
                    ? "bg-white/5 border border-white/10 text-white" 
                    : "hover:bg-white/5 text-gray-400 hover:text-white"
                }`}
              >
                {tab.icon}
                <p className="text-sm">{tab.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 transition py-3 rounded-2xl flex items-center justify-center gap-2 font-semibold text-sm"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

      {/* MAIN VIEW */}
      <div className="flex-1 overflow-y-auto relative z-10 p-8 md:p-12">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-12">
            {/* Hero Card */}
            <div className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-[36px] p-8 md:p-10 backdrop-blur-2xl flex flex-col xl:flex-row gap-8 justify-between items-start xl:items-center">
              <div>
                <div className="flex items-center gap-2 text-blue-400">
                  <Sparkles size={18} />
                  <span className="uppercase tracking-[3px] text-xs font-bold">Control Console</span>
                </div>
                <h1 className="text-5xl font-light mt-4">EduNova Platform Admin</h1>
                <p className="text-gray-400 text-md mt-4 max-w-xl">
                  Manage teachers, student databases, configurations, and review system usage dynamically.
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 rounded-3xl p-6 min-w-[250px]">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">System Status</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping" />
                </div>
                <h2 className="text-3xl mt-4 font-semibold">Active</h2>
                <p className="text-xs text-gray-500 mt-2">MongoDB database & Gemini APIs operational</p>
              </div>
            </div>

            {/* Metrics grid */}
            {loadingAnalytics ? (
              <p className="text-gray-400 text-center">Loading live stats...</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { title: "Total Users", val: analytics.stats?.total_users, color: "text-blue-400" },
                  { title: "Students Enrolled", val: analytics.stats?.total_students, color: "text-green-400" },
                  { title: "Teachers Count", val: analytics.stats?.total_teachers, color: "text-yellow-400" },
                  { title: "Files Uploaded (Notes)", val: analytics.stats?.total_notes, color: "text-purple-400" }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-6">
                    <span className="text-gray-500 text-sm">{stat.title}</span>
                    <h2 className={`text-5xl font-semibold mt-4 ${stat.color}`}>{stat.val}</h2>
                  </div>
                ))}
              </div>
            )}

            {/* Recent Activity Logs */}
            <div className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-8 space-y-6">
              <h2 className="text-2xl font-light">Recent Platform Logs</h2>
              <div className="divide-y divide-white/5 space-y-4">
                {analytics.recent_activity?.length === 0 ? (
                  <p className="text-gray-500 py-4">No recent database operations recorded.</p>
                ) : (
                  analytics.recent_activity?.map((log, idx) => (
                    <div key={idx} className="pt-4 flex items-center gap-3 text-gray-300 text-sm">
                      <span className="text-blue-400">â€¢</span>
                      <p>{log}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* USER MANAGEMENT TAB */}
        {activeTab === "users" && (
          <div className="space-y-8">

            {/* ─── Pending Teacher Approvals ─── */}
            {(pendingTeachers.length > 0 || loadingPending) && (
              <div className="bg-yellow-50 dark:bg-yellow-500/5 border border-yellow-400/40 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-yellow-500/20 flex items-center justify-center">
                    <span className="text-yellow-500 text-xl">⏳</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-medium text-gray-900 dark:text-white">Pending Teacher Approvals</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">These teachers registered and are waiting for your approval to log in.</p>
                  </div>
                  <span className="ml-auto bg-yellow-400/20 text-yellow-500 border border-yellow-400/30 text-sm px-3 py-1 rounded-full font-medium">
                    {pendingTeachers.length} pending
                  </span>
                </div>

                {loadingPending ? (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Loading pending approvals...</p>
                ) : (
                  <div className="space-y-3">
                    {pendingTeachers.map((t) => (
                      <div key={t.email} className="flex items-center justify-between bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{t.full_name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{t.email}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            Registered: {t.registered_at || "Recently"} · School: {t.school_name}
                          </p>
                        </div>
                        <div className="flex gap-3 ml-6">
                          <button
                            onClick={() => handleApproveTeacher(t.email)}
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm transition-all"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectTeacher(t.email)}
                            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-sm transition-all"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Create account form */}

            <form onSubmit={handleCreateUser} className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-8 space-y-6">
              <h2 className="text-2xl font-light">Register Student or Teacher Account</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block mb-2 text-sm text-gray-400">Full Name</label>
                  <input
                    type="text"
                    required
                    value={userForm.full_name}
                    onChange={(e) => setUserForm({ ...userForm, full_name: e.target.value })}
                    className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
                    placeholder="Arpita"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-400">Email Address</label>
                  <input
                    type="email"
                    required
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
                    placeholder="arpita@gmail.com"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-400">Account Password</label>
                  <input
                    type="password"
                    required
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
                    placeholder="â€¢â€¢â€¢â€¢â€¢â€¢"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-400">Role Privilege</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                    className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 text-gray-300"
                  >
                    <option value="student" className="bg-gray-900">Student</option>
                    <option value="teacher" className="bg-gray-900">Teacher</option>
                    <option value="admin" className="bg-gray-900">Admin</option>
                  </select>
                </div>
                {userForm.role !== "admin" && (
                  <div>
                    <label className="block mb-2 text-sm text-gray-400">
                      Assign Class {userForm.role === "teacher" ? "(Teacher's class)" : ""}
                    </label>
                    <select
                      value={userForm.student_class}
                      onChange={(e) => setUserForm({ ...userForm, student_class: e.target.value })}
                      className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 text-gray-300"
                    >
                      <option value="" className="bg-gray-900">-- Select Class --</option>
                      <option value="9th" className="bg-gray-900">9th Grade</option>
                      <option value="10th" className="bg-gray-900">10th Grade</option>
                      <option value="11th" className="bg-gray-900">11th Grade</option>
                      <option value="12th" className="bg-gray-900">12th Grade</option>
                    </select>
                  </div>
                )}

              </div>
              <button type="submit" className="bg-blue-500 hover:bg-blue-600 transition px-8 py-3.5 rounded-2xl font-semibold flex items-center gap-2">
                <UserPlus size={18} /> Add Account
              </button>
            </form>

            {/* List & controls */}
            <div className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-8 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                {/* Search */}
                <div className="relative w-full max-w-sm">
                  <Search size={18} className="absolute left-4 top-3.5 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search accounts by name/email..."
                    className="w-full bg-white/10 border border-white/10 rounded-2xl pl-12 pr-4 py-3 outline-none focus:border-blue-500 text-sm"
                  />
                </div>

                {/* Filter */}
                <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl w-fit">
                  <button
                    onClick={() => setUserRoleFilter("teacher")}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                      userRoleFilter === "teacher" ? "bg-blue-500 text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Teachers
                  </button>
                  <button
                    onClick={() => setUserRoleFilter("student")}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                      userRoleFilter === "student" ? "bg-blue-500 text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Students
                  </button>
                </div>
              </div>

              {loadingUsers ? (
                <p className="text-gray-400 text-center py-6">Querying user list...</p>
              ) : (
                <div className="overflow-hidden border border-white/5 rounded-2xl">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/[0.02] text-xs font-semibold text-gray-400 uppercase">
                        <th className="p-4">Name</th>
                        <th className="p-4">Email Address</th>
                        {userRoleFilter === "student" && <th className="p-4">Class</th>}
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredUsersList.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="p-8 text-center text-gray-500">No accounts matched.</td>
                        </tr>
                      ) : (
                        filteredUsersList.map((user, index) => (
                          <tr key={index} className="hover:bg-white/[0.01] transition text-sm">
                            <td className="p-4 font-medium">{user.full_name}</td>
                            <td className="p-4 text-gray-400">{user.email}</td>
                            {userRoleFilter === "student" && <td className="p-4 text-gray-400">{user.student_class} Grade</td>}
                            <td className="p-4 text-right">
                              <button
                                onClick={() => handleDeleteUser(user.email)}
                                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 p-2.5 rounded-xl transition"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CLASS CONFIGURATION TAB */}
        {activeTab === "classes" && (
          <div className="space-y-8">
            <form onSubmit={handleCreateClass} className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-8 space-y-6">
              <h2 className="text-2xl font-light">Configure Class, Sections, and Subjects</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block mb-2 text-sm text-gray-400">Class Name</label>
                  <input
                    type="text"
                    required
                    placeholder="9th"
                    value={classForm.class_name}
                    onChange={(e) => setClassForm({ ...classForm, class_name: e.target.value })}
                    className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-400">Sections (Comma Separated)</label>
                  <input
                    type="text"
                    placeholder="A, B, C"
                    value={classForm.sections}
                    onChange={(e) => setClassForm({ ...classForm, sections: e.target.value })}
                    className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-400">Subjects (Comma Separated)</label>
                  <input
                    type="text"
                    placeholder="Physics, Chemistry, Mathematics"
                    value={classForm.subjects}
                    onChange={(e) => setClassForm({ ...classForm, subjects: e.target.value })}
                    className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <button type="submit" className="bg-blue-500 hover:bg-blue-600 transition px-8 py-3.5 rounded-2xl font-semibold flex items-center gap-2">
                <PlusCircle size={18} /> Save Class Configuration
              </button>
            </form>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loadingClasses ? (
                <p className="text-gray-400 col-span-full text-center">Loading class grid configs...</p>
              ) : classes.length === 0 ? (
                <p className="text-gray-500 col-span-full text-center py-6">No class configurations saved.</p>
              ) : (
                classes.map((cls, idx) => (
                  <div key={idx} className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-2xl font-light text-blue-400">{cls.class_name} Grade</h3>
                        <button
                          onClick={() => handleDeleteClass(cls.class_name)}
                          className="text-red-400 hover:text-red-500 transition p-1"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="mt-4 space-y-2 text-sm">
                        <p><span className="text-gray-500 font-medium">Sections:</span> {cls.sections?.join(", ")}</p>
                        <p><span className="text-gray-500 font-medium">Subjects:</span> {cls.subjects?.join(", ")}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* CONTENT MANAGEMENT TAB */}
        {activeTab === "content" && (
          <div className="space-y-8">
            <h2 className="text-3xl font-light">Global Content Moderation</h2>
            {loadingContent ? (
              <p className="text-gray-400 text-center">Loading active media indexes...</p>
            ) : (
              <div className="space-y-10">
                {/* Notes section */}
                <div className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-6 space-y-4">
                  <h3 className="text-xl font-medium text-blue-400 flex items-center gap-2">
                    <BookOpen size={20} /> Study Notes Uploads
                  </h3>
                  <div className="divide-y divide-white/5">
                    {content.notes?.length === 0 ? (
                      <p className="text-gray-500 py-3">No study notes uploaded.</p>
                    ) : (
                      content.notes?.map((n, idx) => (
                        <div key={idx} className="py-3.5 flex justify-between items-center text-sm">
                          <div>
                            <p className="font-semibold">{n.title} ({n.subject})</p>
                            <p className="text-xs text-gray-500 mt-0.5">Class: {n.student_class} | Uploaded by: {n.uploaded_by}</p>
                          </div>
                          <button onClick={() => handleDeleteNote(n.filename)} className="text-red-400 hover:text-red-500 transition p-2">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Assignments section */}
                <div className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-6 space-y-4">
                  <h3 className="text-xl font-medium text-green-400 flex items-center gap-2">
                    <FileText size={20} /> Assignments Published
                  </h3>
                  <div className="divide-y divide-white/5">
                    {content.assignments?.length === 0 ? (
                      <p className="text-gray-500 py-3">No assignments created.</p>
                    ) : (
                      content.assignments?.map((a, idx) => (
                        <div key={idx} className="py-3.5 flex justify-between items-center text-sm">
                          <div>
                            <p className="font-semibold">{a.title} ({a.subject})</p>
                            <p className="text-xs text-gray-500 mt-0.5">Target Grade: {a.student_class} | Due: {a.due_date}</p>
                          </div>
                          <button onClick={() => handleDeleteAssignment(a.title)} className="text-red-400 hover:text-red-500 transition p-2">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* NOTICE BOARD BROADCAST TAB */}
        {activeTab === "announcements" && (
          <div className="space-y-8">
            <form onSubmit={handleCreateAnnouncement} className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-8 space-y-6">
              <h2 className="text-2xl font-light">Publish Announcement Notice</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-sm text-gray-400">Notice Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Terminal Exam Timetable"
                    value={announceForm.title}
                    onChange={(e) => setAnnounceForm({ ...announceForm, title: e.target.value })}
                    className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-400">Target Group</label>
                  <select
                    value={announceForm.target_group}
                    onChange={(e) => setAnnounceForm({ ...announceForm, target_group: e.target.value })}
                    className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 text-gray-300"
                  >
                    <option value="all" className="bg-gray-900">All Students & Teachers</option>
                    <option value="9th" className="bg-gray-900">9th Grade</option>
                    <option value="10th" className="bg-gray-900">10th Grade</option>
                    <option value="11th" className="bg-gray-900">11th Grade</option>
                    <option value="12th" className="bg-gray-900">12th Grade</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm text-gray-400">Notice Content Body</label>
                <textarea
                  required
                  placeholder="Announce updates to target students..."
                  value={announceForm.content}
                  onChange={(e) => setAnnounceForm({ ...announceForm, content: e.target.value })}
                  className="w-full bg-white/10 border border-white/10 rounded-2xl p-4 outline-none focus:border-blue-500 h-28 resize-none text-gray-200"
                />
              </div>
              <button type="submit" className="bg-blue-500 hover:bg-blue-600 transition px-8 py-3.5 rounded-2xl font-semibold flex items-center gap-2">
                <Megaphone size={18} /> Broadcast Announcement
              </button>
            </form>

            <div className="space-y-4">
              <h2 className="text-2xl font-light">Notice Board Archives</h2>
              {loadingAnnouncements ? (
                <p className="text-gray-400 text-center">Loading announcements...</p>
              ) : announcements.length === 0 ? (
                <p className="text-gray-500 text-center py-6">No announcements published.</p>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {announcements.map((announce, idx) => (
                    <div key={idx} className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start border-b border-white/5 pb-3">
                          <h3 className="text-xl font-medium truncate pr-4">{announce.title}</h3>
                          <button onClick={() => handleDeleteAnnouncement(announce.title)} className="text-red-400 hover:text-red-500 transition">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-gray-400 mt-4 text-sm leading-relaxed">{announce.content}</p>
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-500 mt-6 pt-3 border-t border-white/5">
                        <span>Target: Class {announce.target_group?.toUpperCase()}</span>
                        <span>{announce.created_at}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === "settings" && (
          <div className="space-y-8">
            <h2 className="text-3xl font-light">System settings & Configuration</h2>
            <div className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-8 space-y-6">
              <h3 className="text-xl font-medium text-blue-400 flex items-center gap-2">
                <Settings size={20} /> AI Configuration
              </h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block mb-2 text-sm text-gray-400">Gemini LLM Model</label>
                  <select
                    value={aiSettings.model}
                    onChange={(e) => setAiSettings({ ...aiSettings, model: e.target.value })}
                    className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 text-gray-300"
                  >
                    <option value="gemini-3-flash-preview" className="bg-gray-900">Gemini 3 Flash Preview</option>
                    <option value="gemini-1.5-pro" className="bg-gray-900">Gemini 1.5 Pro</option>
                    <option value="gemini-1.5-flash" className="bg-gray-900">Gemini 1.5 Flash</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-400">Model Temperature</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={aiSettings.temperature}
                    onChange={(e) => setAiSettings({ ...aiSettings, temperature: e.target.value })}
                    className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-400">Max Tokens Response</label>
                  <input
                    type="number"
                    value={aiSettings.maxTokens}
                    onChange={(e) => setAiSettings({ ...aiSettings, maxTokens: e.target.value })}
                    className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              
              <button onClick={() => alert("AI Platform Settings Saved ðŸš€")} className="bg-blue-500 hover:bg-blue-600 transition px-8 py-3.5 rounded-2xl font-semibold mt-4">
                Save System Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
