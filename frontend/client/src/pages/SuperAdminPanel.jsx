import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import {
  Shield, School, UserPlus, Plus, Trash2, CheckCircle,
  AlertCircle, Eye, EyeOff, Sun, Moon, LogOut, RefreshCw
} from "lucide-react";

const API = "http://127.0.0.1:8000";

function SuperAdminPanel() {
  const { theme, toggleTheme } = useTheme();

  // ─── Auth ───────────────────────────────────────
  const [key, setKey] = useState("");
  const [keyInput, setKeyInput] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // ─── Data ───────────────────────────────────────
  const [schools, setSchools] = useState([]);
  const [loadingSchools, setLoadingSchools] = useState(false);

  // ─── School Form ────────────────────────────────
  const [schoolForm, setSchoolForm] = useState({ name: "", city: "", contact_email: "" });
  const [schoolMsg, setSchoolMsg] = useState(null); // { type, text }
  const [creatingSchool, setCreatingSchool] = useState(false);

  // ─── Admin Form ─────────────────────────────────
  const [adminForm, setAdminForm] = useState({ full_name: "", email: "", password: "", school_name: "" });
  const [adminMsg, setAdminMsg] = useState(null);
  const [creatingAdmin, setCreatingAdmin] = useState(false);

  // ─── Verify key against the backend ─────────────
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

  // Persist key in sessionStorage across page refreshes
  useEffect(() => {
    const saved = sessionStorage.getItem("sa_key");
    if (saved) setKey(saved);
  }, []);

  // Fetch schools whenever key is set
  useEffect(() => {
    if (key) fetchSchools();
  }, [key]);

  const headers = () => ({ "Content-Type": "application/json", "x-super-admin-key": key });

  // ─── Fetch Schools ───────────────────────────────
  const fetchSchools = async () => {
    setLoadingSchools(true);
    try {
      const res = await fetch(`${API}/superadmin/schools`, { headers: headers() });
      const d = await res.json();
      if (res.ok) setSchools(d.schools || []);
    } catch {}
    finally { setLoadingSchools(false); }
  };

  // ─── Create School ───────────────────────────────
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
      } else {
        setSchoolMsg({ type: "error", text: d.detail || "Failed to create school." });
      }
    } catch {
      setSchoolMsg({ type: "error", text: "Server error. Check backend." });
    } finally {
      setCreatingSchool(false);
    }
  };

  // ─── Create Admin ────────────────────────────────
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
      } else {
        setAdminMsg({ type: "error", text: d.detail || "Failed to create admin." });
      }
    } catch {
      setAdminMsg({ type: "error", text: "Server error. Check backend." });
    } finally {
      setCreatingAdmin(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("sa_key");
    setKey("");
    setKeyInput("");
  };

  const inputCls = "w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 transition-colors text-gray-900 dark:text-white placeholder-gray-400";

  // ════════════════════════════════════════
  // LOGIN SCREEN
  // ════════════════════════════════════════
  if (!key) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white flex items-center justify-center px-6 relative overflow-hidden">
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 7 }}
          className="absolute w-[400px] h-[400px] bg-blue-500/15 rounded-full blur-[120px] top-[-80px] left-[-80px]" />
        <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 9 }}
          className="absolute w-[400px] h-[400px] bg-purple-500/15 rounded-full blur-[120px] bottom-[-80px] right-[-80px]" />

        <button onClick={toggleTheme} className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 border border-gray-200 dark:border-white/10 transition-all">
          {theme === "dark" ? <Sun size={18} className="text-yellow-400"/> : <Moon size={18} className="text-blue-500"/>}
        </button>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          className="relative z-10 w-full max-w-md bg-white dark:bg-white/[0.05] backdrop-blur-sm dark:backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-[40px] p-10 shadow-2xl"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-500/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Shield size={32} className="text-purple-400" />
            </div>
            <h1 className="text-3xl font-light">
              Edunova<span className="text-blue-400 font-semibold">.AI</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Super Admin Panel</p>
          </div>

          <form onSubmit={handleLogin} className="mt-10 space-y-4">
            <div>
              <label className="block mb-2 text-sm text-gray-500 dark:text-gray-400">Super Admin Key</label>
              <div className="flex items-center bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-4 focus-within:border-blue-500 transition-colors">
                <Shield size={18} className="text-gray-400 shrink-0" />
                <input
                  type={showKey ? "text" : "password"}
                  value={keyInput}
                  onChange={e => setKeyInput(e.target.value)}
                  placeholder="Enter super admin key"
                  required
                  className="w-full bg-transparent px-4 py-3 outline-none text-gray-900 dark:text-white placeholder-gray-400"
                />
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

            <button type="submit" disabled={authLoading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 transition py-3.5 rounded-2xl text-white font-medium"
            >
              {authLoading ? "Verifying..." : "Access Super Admin Panel"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
            This panel is for <span className="text-purple-400">Edunova platform operators</span> only.
          </p>
        </motion.div>
      </div>
    );
  }

  // ════════════════════════════════════════
  // MAIN PANEL
  // ════════════════════════════════════════
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white">

      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur border-b border-gray-200 dark:border-white/10 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-purple-500/10 rounded-xl flex items-center justify-center">
            <Shield size={20} className="text-purple-400"/>
          </div>
          <div>
            <h1 className="font-medium text-gray-900 dark:text-white">
              Edunova<span className="text-blue-400">.AI</span> — Super Admin
            </h1>
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

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">

        {/* ─── Schools List ──────────────────────────── */}
        <div className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                <School size={22} className="text-blue-400"/>
              </div>
              <div>
                <h2 className="text-xl font-medium">Registered Schools</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">All schools active on the Edunova platform</p>
              </div>
            </div>
            <button onClick={fetchSchools} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 text-sm transition">
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
            <div className="grid md:grid-cols-2 gap-4">
              {schools.map((s, i) => (
                <div key={i} className="flex items-center gap-4 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4">
                  <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center shrink-0">
                    <School size={18} className="text-green-400"/>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">{s.name}</p>
                    {s.city && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.city}</p>}
                    {s.contact_email && <p className="text-xs text-gray-400 dark:text-gray-500">{s.contact_email}</p>}
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Created: {s.created_at || "—"}</p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-xs bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-1 rounded-full">Active</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ─── Add New School ────────────────────────── */}
        <div className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-sm dark:shadow-none">
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
                <input type="text" value={schoolForm.name} onChange={e => setSchoolForm({...schoolForm, name: e.target.value})} placeholder="e.g. JPS Academy" required className={inputCls}/>
              </div>
              <div>
                <label className="block mb-2 text-sm text-gray-500 dark:text-gray-400">City</label>
                <input type="text" value={schoolForm.city} onChange={e => setSchoolForm({...schoolForm, city: e.target.value})} placeholder="e.g. Delhi" className={inputCls}/>
              </div>
              <div>
                <label className="block mb-2 text-sm text-gray-500 dark:text-gray-400">Contact Email</label>
                <input type="email" value={schoolForm.contact_email} onChange={e => setSchoolForm({...schoolForm, contact_email: e.target.value})} placeholder="principal@school.edu" className={inputCls}/>
              </div>
            </div>

            {schoolMsg && (
              <div className={`flex items-center gap-2 text-sm rounded-xl px-4 py-3 border ${schoolMsg.type === "success" ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
                {schoolMsg.type === "success" ? <CheckCircle size={16}/> : <AlertCircle size={16}/>}
                {schoolMsg.text}
              </div>
            )}

            <button type="submit" disabled={creatingSchool} className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 transition px-6 py-3 rounded-2xl text-white font-medium">
              <Plus size={18}/> {creatingSchool ? "Creating..." : "Add School"}
            </button>
          </form>
        </div>

        {/* ─── Create Admin Account ──────────────────── */}
        <div className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-sm dark:shadow-none">
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
                <input type="text" value={adminForm.full_name} onChange={e => setAdminForm({...adminForm, full_name: e.target.value})} placeholder="Dr. Rajesh Kumar" required className={inputCls}/>
              </div>
              <div>
                <label className="block mb-2 text-sm text-gray-500 dark:text-gray-400">Email Address <span className="text-red-400">*</span></label>
                <input type="email" value={adminForm.email} onChange={e => setAdminForm({...adminForm, email: e.target.value})} placeholder="principal@jps.edu" required className={inputCls}/>
              </div>
              <div>
                <label className="block mb-2 text-sm text-gray-500 dark:text-gray-400">Password <span className="text-red-400">*</span></label>
                <input type="password" value={adminForm.password} onChange={e => setAdminForm({...adminForm, password: e.target.value})} placeholder="Set a secure password" required className={inputCls}/>
              </div>
              <div>
                <label className="block mb-2 text-sm text-gray-500 dark:text-gray-400">School <span className="text-red-400">*</span></label>
                <select value={adminForm.school_name} onChange={e => setAdminForm({...adminForm, school_name: e.target.value})} required className={inputCls}>
                  <option value="" disabled className="bg-gray-900">Select school</option>
                  {schools.map(s => (
                    <option key={s.name} value={s.name} className="bg-gray-900 text-white">{s.name}</option>
                  ))}
                </select>
                {schools.length === 0 && (
                  <p className="mt-1 text-xs text-orange-400">No schools available — add a school first.</p>
                )}
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

        {/* ─── Info Box ──────────────────────────────── */}
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
