import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import {
  Shield, School, UserPlus, Plus, Trash2, CheckCircle,
  AlertCircle, Eye, EyeOff, Sun, Moon, LogOut, RefreshCw,
  Users, Cpu, BarChart3
} from "lucide-react";

const API = "http://127.0.0.1:8000";

function SuperAdminPanel() {
  const { theme, toggleTheme } = useTheme();

  const [key, setKey] = useState("");
  const [keyInput, setKeyInput] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [schools, setSchools] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [overview, setOverview] = useState({ stats: {} });
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [loadingOverview, setLoadingOverview] = useState(false);

  const [schoolForm, setSchoolForm] = useState({ name: "", city: "", contact_email: "" });
  const [schoolMsg, setSchoolMsg] = useState(null);
  const [creatingSchool, setCreatingSchool] = useState(false);

  const [adminForm, setAdminForm] = useState({ full_name: "", email: "", password: "", school_name: "" });
  const [adminMsg, setAdminMsg] = useState(null);
  const [creatingAdmin, setCreatingAdmin] = useState(false);

  const [editSchoolId, setEditSchoolId] = useState("");
  const [editSchoolForm, setEditSchoolForm] = useState({ name: "", city: "", contact_email: "", status: "active" });
  const [savingSchool, setSavingSchool] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    try {
      const res = await fetch(`${API}/superadmin/schools`, {
        headers: { "x-super-admin-key": keyInput }
      });
      if (res.ok) {
        setKey(keyInput);
        sessionStorage.setItem("sa_key", keyInput);
      } else {
        const d = await res.json();
        setAuthError(d.detail || "Invalid Super Admin key.");
      }
    } catch {
      setAuthError("Cannot reach the backend server.");
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    const saved = sessionStorage.getItem("sa_key");
    if (saved) setKey(saved);
  }, []);

  useEffect(() => {
    if (key) {
      fetchOverview();
      fetchSchools();
      fetchAdmins();
    }
  }, [key]);

  const headers = () => ({ "Content-Type": "application/json", "x-super-admin-key": key });

  const fetchOverview = async () => {
    setLoadingOverview(true);
    try {
      const res = await fetch(`${API}/superadmin/overview`, { headers: headers() });
      const d = await res.json();
      if (res.ok) setOverview(d);
    } catch {}
    finally { setLoadingOverview(false); }
  };

  const fetchSchools = async () => {
    setLoadingSchools(true);
    try {
      const res = await fetch(`${API}/superadmin/schools`, { headers: headers() });
      const d = await res.json();
      if (res.ok) setSchools(d.schools || []);
    } catch {}
    finally { setLoadingSchools(false); }
  };

  const fetchAdmins = async () => {
    setLoadingAdmins(true);
    try {
      const res = await fetch(`${API}/superadmin/admins`, { headers: headers() });
      const d = await res.json();
      if (res.ok) setAdmins(d.admins || []);
    } catch {}
    finally { setLoadingAdmins(false); }
  };

  const handleCreateSchool = async (e) => {
    e.preventDefault();
    setSchoolMsg(null);
    setCreatingSchool(true);
    try {
      const res = await fetch(`${API}/superadmin/create-school`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(schoolForm)
      });
      const d = await res.json();
      if (res.ok) {
        setSchoolMsg({ type: "success", text: d.message });
        setSchoolForm({ name: "", city: "", contact_email: "" });
        fetchSchools();
        fetchOverview();
      } else {
        setSchoolMsg({ type: "error", text: d.detail || "Failed to create school." });
      }
    } catch {
      setSchoolMsg({ type: "error", text: "Server error. Check backend." });
    } finally {
      setCreatingSchool(false);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setAdminMsg(null);
    setCreatingAdmin(true);
    try {
      const res = await fetch(`${API}/superadmin/create-admin`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(adminForm)
      });
      const d = await res.json();
      if (res.ok) {
        setAdminMsg({ type: "success", text: d.message });
        setAdminForm({ full_name: "", email: "", password: "", school_name: "" });
        fetchAdmins();
        fetchOverview();
      } else {
        setAdminMsg({ type: "error", text: d.detail || "Failed to create admin." });
      }
    } catch {
      setAdminMsg({ type: "error", text: "Server error. Check backend." });
    } finally {
      setCreatingAdmin(false);
    }
  };

  const startEditSchool = (school) => {
    setEditSchoolId(school.id);
    setEditSchoolForm({
      name: school.name || "",
      city: school.city || "",
      contact_email: school.contact_email || "",
      status: school.status || "active"
    });
  };

  const handleSaveSchool = async (e) => {
    e.preventDefault();
    setSavingSchool(true);
    try {
      const res = await fetch(`${API}/superadmin/schools/${editSchoolId}`, {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify(editSchoolForm)
      });
      const d = await res.json();
      if (res.ok) {
        setEditSchoolId("");
        setEditSchoolForm({ name: "", city: "", contact_email: "", status: "active" });
        fetchSchools();
        fetchOverview();
      } else {
        setSchoolMsg({ type: "error", text: d.detail || "Unable to update school." });
      }
    } catch {
      setSchoolMsg({ type: "error", text: "Server error while updating school." });
    } finally {
      setSavingSchool(false);
    }
  };

  const handleStatusChange = async (school) => {
    const nextStatus = school.status === "active" ? "suspended" : "active";
    try {
      const res = await fetch(`${API}/superadmin/schools/${school.id}/status`, {
        method: "PATCH",
        headers: headers(),
        body: JSON.stringify({ status: nextStatus })
      });
      const d = await res.json();
      if (res.ok) {
        fetchSchools();
        fetchOverview();
        setSchoolMsg({ type: "success", text: d.message });
      } else {
        setSchoolMsg({ type: "error", text: d.detail || "Failed to update status." });
      }
    } catch {
      setSchoolMsg({ type: "error", text: "Server error while updating status." });
    }
  };

  const handleDeleteSchool = async (school) => {
    if (!window.confirm(`Delete ${school.name}?`)) return;
    try {
      const res = await fetch(`${API}/superadmin/schools/${school.id}`, {
        method: "DELETE",
        headers: headers()
      });
      const d = await res.json();
      if (res.ok) {
        fetchSchools();
        fetchOverview();
        setSchoolMsg({ type: "success", text: d.message });
      } else {
        setSchoolMsg({ type: "error", text: d.detail || "Failed to delete school." });
      }
    } catch {
      setSchoolMsg({ type: "error", text: "Server error while deleting school." });
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("sa_key");
    setKey("");
    setKeyInput("");
  };

  const inputCls = "w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 transition-colors text-gray-900 dark:text-white placeholder-gray-400";
  const accentStyles = {
    blue: { bg: "bg-blue-500/10", text: "text-blue-400" },
    purple: { bg: "bg-purple-500/10", text: "text-purple-400" },
    green: { bg: "bg-green-500/10", text: "text-green-400" },
    orange: { bg: "bg-orange-500/10", text: "text-orange-400" },
    indigo: { bg: "bg-indigo-500/10", text: "text-indigo-400" },
    pink: { bg: "bg-pink-500/10", text: "text-pink-400" },
    emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400" },
    amber: { bg: "bg-amber-500/10", text: "text-amber-400" }
  };
  const statCards = [
    { label: "Total Schools", value: overview?.stats?.total_schools ?? 0, icon: School, accent: "blue" },
    { label: "Total Students", value: overview?.stats?.total_students ?? 0, icon: Users, accent: "purple" },
    { label: "Total Teachers", value: overview?.stats?.total_teachers ?? 0, icon: Users, accent: "green" },
    { label: "Total Admins", value: overview?.stats?.total_admins ?? 0, icon: Shield, accent: "orange" },
    { label: "Active Users Today", value: overview?.stats?.active_users_today ?? 0, icon: BarChart3, accent: "indigo" },
    { label: "AI Requests Today", value: overview?.stats?.ai_requests_today ?? 0, icon: Cpu, accent: "pink" },
    { label: "Revenue", value: `$${overview?.stats?.revenue ?? 0}`, icon: Shield, accent: "emerald" },
    { label: "Storage Usage", value: `${overview?.stats?.storage_usage_mb ?? 0} MB`, icon: BarChart3, accent: "amber" }
  ];

  if (!key) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white flex items-center justify-center px-6 relative overflow-hidden">
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 7 }} className="absolute w-[400px] h-[400px] bg-blue-500/15 rounded-full blur-[120px] top-[-80px] left-[-80px]" />
        <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 9 }} className="absolute w-[400px] h-[400px] bg-purple-500/15 rounded-full blur-[120px] bottom-[-80px] right-[-80px]" />

        <button onClick={toggleTheme} className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 border border-gray-200 dark:border-white/10 transition-all">
          {theme === "dark" ? <Sun size={18} className="text-yellow-400"/> : <Moon size={18} className="text-blue-500"/>}
        </button>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative z-10 w-full max-w-md bg-white dark:bg-white/[0.05] backdrop-blur-sm dark:backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-[40px] p-10 shadow-2xl">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-500/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Shield size={32} className="text-purple-400" />
            </div>
            <h1 className="text-3xl font-light">Edunova<span className="text-blue-400 font-semibold">.AI</span></h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Super Admin Panel</p>
          </div>

          <form onSubmit={handleLogin} className="mt-10 space-y-4">
            <div>
              <label className="block mb-2 text-sm text-gray-500 dark:text-gray-400">Super Admin Key</label>
              <div className="flex items-center bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-4 focus-within:border-blue-500 transition-colors">
                <Shield size={18} className="text-gray-400 shrink-0" />
                <input type={showKey ? "text" : "password"} value={keyInput} onChange={e => setKeyInput(e.target.value)} placeholder="Enter super admin key" required className="w-full bg-transparent px-4 py-3 outline-none text-gray-900 dark:text-white placeholder-gray-400" />
                <button type="button" onClick={() => setShowKey(p => !p)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition">
                  {showKey ? <EyeOff size={18}/> : <Eye size={18}/>} 
                </button>
              </div>
            </div>

            {authError && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <AlertCircle size={16}/> {authError}
              </div>
            )}

            <button type="submit" disabled={authLoading} className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 transition py-3.5 rounded-2xl text-white font-medium">
              {authLoading ? "Verifying..." : "Access Super Admin Panel"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">This panel is for <span className="text-purple-400">Edunova platform operators</span> only.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white">
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur border-b border-gray-200 dark:border-white/10 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-purple-500/10 rounded-xl flex items-center justify-center">
            <Shield size={20} className="text-purple-400"/>
          </div>
          <div>
            <h1 className="font-medium text-gray-900 dark:text-white">Edunova<span className="text-blue-400">.AI</span> — Super Admin</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Platform Management</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 border border-gray-200 dark:border-white/10 transition">
            {theme === "dark" ? <Sun size={16} className="text-yellow-400"/> : <Moon size={16} className="text-blue-500"/>}
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition text-sm">
            <LogOut size={16}/> Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
          {statCards.map(({ label, value, icon: Icon, accent }) => (
            <div key={label} className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                  <p className="text-2xl font-semibold mt-2">{loadingOverview ? "—" : value}</p>
                </div>
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${accentStyles[accent].bg}`}>
                  <Icon size={20} className={accentStyles[accent].text} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {schoolMsg && (
          <div className={`flex items-center gap-2 text-sm rounded-xl px-4 py-3 border ${schoolMsg.type === "success" ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
            {schoolMsg.type === "success" ? <CheckCircle size={16}/> : <AlertCircle size={16}/>}
            {schoolMsg.text}
          </div>
        )}

        <div className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                <School size={22} className="text-blue-400"/>
              </div>
              <div>
                <h2 className="text-xl font-medium">School Management</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage schools, status, and details from one place</p>
              </div>
            </div>
            <button onClick={() => { fetchSchools(); fetchOverview(); }} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 text-sm transition">
              <RefreshCw size={14}/> Refresh
            </button>
          </div>

          {loadingSchools ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">Loading schools...</p>
          ) : schools.length === 0 ? (
            <div className="text-center py-10 text-gray-400 dark:text-gray-500">
              <School size={40} className="mx-auto mb-3 opacity-40"/>
              <p>No schools registered yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {schools.map((school) => {
                const isEditing = editSchoolId === school.id;
                return (
                  <div key={school.id} className="border border-gray-200 dark:border-white/10 rounded-2xl p-4 bg-gray-50 dark:bg-white/[0.03]">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-gray-900 dark:text-white">{school.name}</p>
                          <span className={`text-xs px-2 py-1 rounded-full border ${school.status === "active" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"}`}>
                            {school.status || "active"}
                          </span>
                        </div>
                        {school.city && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{school.city}</p>}
                        {school.contact_email && <p className="text-sm text-gray-400 dark:text-gray-500">{school.contact_email}</p>}
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Created: {school.created_at || "—"}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => startEditSchool(school)} className="px-3 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-sm">Edit</button>
                        <button onClick={() => handleStatusChange(school)} className="px-3 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 text-sm">{school.status === "active" ? "Suspend" : "Activate"}</button>
                        <button onClick={() => handleDeleteSchool(school)} className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-sm">Delete</button>
                      </div>
                    </div>

                    {isEditing && (
                      <form onSubmit={handleSaveSchool} className="mt-4 grid md:grid-cols-3 gap-3">
                        <input type="text" value={editSchoolForm.name} onChange={e => setEditSchoolForm({ ...editSchoolForm, name: e.target.value })} required className={inputCls} placeholder="School name" />
                        <input type="text" value={editSchoolForm.city} onChange={e => setEditSchoolForm({ ...editSchoolForm, city: e.target.value })} className={inputCls} placeholder="City" />
                        <input type="email" value={editSchoolForm.contact_email} onChange={e => setEditSchoolForm({ ...editSchoolForm, contact_email: e.target.value })} className={inputCls} placeholder="Contact email" />
                        <select value={editSchoolForm.status} onChange={e => setEditSchoolForm({ ...editSchoolForm, status: e.target.value })} className={inputCls}>
                          <option value="active">Active</option>
                          <option value="suspended">Suspended</option>
                        </select>
                        <div className="md:col-span-2 flex gap-2">
                          <button type="submit" disabled={savingSchool} className="px-4 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm">{savingSchool ? "Saving..." : "Save Changes"}</button>
                          <button type="button" onClick={() => setEditSchoolId("")} className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm">Cancel</button>
                        </div>
                      </form>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-500/10 rounded-2xl flex items-center justify-center">
              <Plus size={22} className="text-purple-400"/>
            </div>
            <div>
              <h2 className="text-xl font-medium">Register New School</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Add a school to the Edunova platform</p>
            </div>
          </div>

          <form onSubmit={handleCreateSchool} className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-2 text-sm text-gray-500 dark:text-gray-400">School Name <span className="text-red-400">*</span></label>
                <input type="text" value={schoolForm.name} onChange={e => setSchoolForm({ ...schoolForm, name: e.target.value })} placeholder="e.g. JPS Academy" required className={inputCls} />
              </div>
              <div>
                <label className="block mb-2 text-sm text-gray-500 dark:text-gray-400">City</label>
                <input type="text" value={schoolForm.city} onChange={e => setSchoolForm({ ...schoolForm, city: e.target.value })} placeholder="e.g. Delhi" className={inputCls} />
              </div>
              <div>
                <label className="block mb-2 text-sm text-gray-500 dark:text-gray-400">Contact Email</label>
                <input type="email" value={schoolForm.contact_email} onChange={e => setSchoolForm({ ...schoolForm, contact_email: e.target.value })} placeholder="principal@school.edu" className={inputCls} />
              </div>
            </div>
            {schoolMsg && schoolMsg.type !== "success" && (
              <div className="flex items-center gap-2 text-sm rounded-xl px-4 py-3 border bg-red-500/10 border-red-500/20 text-red-400">
                <AlertCircle size={16}/> {schoolMsg.text}
              </div>
            )}
            <button type="submit" disabled={creatingSchool} className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 transition px-6 py-3 rounded-2xl text-white font-medium">
              <Plus size={18}/> {creatingSchool ? "Creating..." : "Add School"}
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-500/10 rounded-2xl flex items-center justify-center">
              <UserPlus size={22} className="text-orange-400"/>
            </div>
            <div>
              <h2 className="text-xl font-medium">Create School Admin Account</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Set up the admin account for a registered school</p>
            </div>
          </div>

          <form onSubmit={handleCreateAdmin} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm text-gray-500 dark:text-gray-400">Full Name <span className="text-red-400">*</span></label>
                <input type="text" value={adminForm.full_name} onChange={e => setAdminForm({ ...adminForm, full_name: e.target.value })} placeholder="Dr. Rajesh Kumar" required className={inputCls} />
              </div>
              <div>
                <label className="block mb-2 text-sm text-gray-500 dark:text-gray-400">Email Address <span className="text-red-400">*</span></label>
                <input type="email" value={adminForm.email} onChange={e => setAdminForm({ ...adminForm, email: e.target.value })} placeholder="principal@jps.edu" required className={inputCls} />
              </div>
              <div>
                <label className="block mb-2 text-sm text-gray-500 dark:text-gray-400">Password <span className="text-red-400">*</span></label>
                <input type="password" value={adminForm.password} onChange={e => setAdminForm({ ...adminForm, password: e.target.value })} placeholder="Set a secure password" required className={inputCls} />
              </div>
              <div>
                <label className="block mb-2 text-sm text-gray-500 dark:text-gray-400">School <span className="text-red-400">*</span></label>
                <select value={adminForm.school_name} onChange={e => setAdminForm({ ...adminForm, school_name: e.target.value })} required className={inputCls}>
                  <option value="" disabled className="bg-gray-900">Select school</option>
                  {schools.map(s => <option key={s.name} value={s.name} className="bg-gray-900 text-white">{s.name}</option>)}
                </select>
                {schools.length === 0 && <p className="mt-1 text-xs text-orange-400">No schools available — add a school first.</p>}
              </div>
            </div>
            {adminMsg && (
              <div className={`flex items-center gap-2 text-sm rounded-xl px-4 py-3 border ${adminMsg.type === "success" ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
                {adminMsg.type === "success" ? <CheckCircle size={16}/> : <AlertCircle size={16}/>}
                {adminMsg.text}
              </div>
            )}
            <button type="submit" disabled={creatingAdmin || schools.length === 0} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 transition px-6 py-3 rounded-2xl text-white font-medium">
              <UserPlus size={18}/> {creatingAdmin ? "Creating..." : "Create Admin Account"}
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500/10 rounded-2xl flex items-center justify-center">
              <Shield size={22} className="text-green-400"/>
            </div>
            <div>
              <h2 className="text-xl font-medium">School Admins</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Current platform administrators</p>
            </div>
          </div>
          {loadingAdmins ? <p className="text-sm text-gray-500 dark:text-gray-400">Loading admins...</p> : admins.length === 0 ? <p className="text-sm text-gray-400">No admins yet.</p> : (
            <div className="space-y-2">
              {admins.map((admin) => (
                <div key={admin.email} className="flex flex-col md:flex-row md:items-center md:justify-between rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.03] px-4 py-3">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{admin.full_name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{admin.email}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2 md:mt-0">
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">{admin.school_name || "—"}</span>
                    <span className={`text-xs px-2 py-1 rounded-full border ${admin.status === "active" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"}`}>{admin.status || "active"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-blue-50 dark:bg-blue-500/5 border border-blue-200 dark:border-blue-500/20 rounded-3xl p-6 text-sm text-gray-600 dark:text-gray-400">
          <p className="font-medium text-blue-600 dark:text-blue-400 mb-2">How the Edunova onboarding flow works:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>You add the school here (e.g. <strong className="text-gray-800 dark:text-gray-200">"JPS Academy"</strong>)</li>
            <li>You create an <strong className="text-gray-800 dark:text-gray-200">Admin account</strong> for the school principal</li>
            <li>The principal logs in and can <strong className="text-gray-800 dark:text-gray-200">approve Teacher registrations</strong></li>
            <li>Teachers and Students register at <code className="bg-gray-200 dark:bg-white/10 px-1.5 py-0.5 rounded text-gray-800 dark:text-gray-200">/register</code> using the school name</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminPanel;
