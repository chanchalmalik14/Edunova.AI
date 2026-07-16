import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, Users, LogOut, LayoutDashboard, Award, Settings, Calendar, Sun, Moon, Trash2, BookOpen, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function UploadNotesPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [studentClass, setStudentClass] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://127.0.0.1:8000/get-teacher-notes", { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (res.ok) setNotes(data.notes || []);
      } catch (err) { console.error("Failed to load notes:", err); }
      finally { setLoadingNotes(false); }
    };
    fetchNotes();
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (idx) => setSelectedFiles(prev => prev.filter((_, i) => i !== idx));

  const handleUpload = async () => {
    if (selectedFiles.length === 0) { alert("Please select at least one file."); return; }
    if (!subject) { alert("Please select a subject."); return; }
    if (!studentClass) { alert("Please select a target class."); return; }
    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title || file.name);
        formData.append("subject", subject);
        formData.append("student_class", studentClass);
        const res = await fetch("http://127.0.0.1:8000/upload-note", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: formData });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.detail || "Failed to upload file");
        }
      }
      alert("Files uploaded successfully!");
      setSelectedFiles([]);
      setTitle("");
      setSubject("");
      setStudentClass("");
      const res = await fetch("http://127.0.0.1:8000/get-teacher-notes", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setNotes(data.notes || []);
    } catch (err) { console.error("Upload failed:", err); alert("Upload failed: " + err.message); }
    finally { setUploading(false); }
  };

  const handleDelete = async (noteId) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:8000/delete-note/${noteId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setNotes(prev => prev.filter(n => n._id !== noteId));
    } catch (err) { console.error("Delete failed:", err); }
  };

  const navItem = (icon, label, path, active = false) => (
    <div onClick={() => navigate(path)} className={`flex items-center gap-3 p-3 rounded-xl transition cursor-pointer ${active ? "bg-blue-50 dark:bg-white/5 text-blue-600 dark:text-white" : "hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300"}`}>
      {icon}<p>{label}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-black dark:text-white flex">
      <div className="w-72 bg-white dark:bg-white/[0.03] border-r border-gray-200 dark:border-white/10 p-6 hidden md:flex flex-col shadow-sm dark:shadow-none">
        <h1 className="text-3xl font-light">Edunova<span className="text-blue-400 font-semibold">.AI</span></h1>
        <div className="mt-12 flex flex-col gap-2 flex-1">
          {navItem(<LayoutDashboard size={20}/>, "Dashboard", "/teacher-dashboard")}
          {navItem(<Upload size={20}/>, "Upload Notes", "/upload-notes", true)}
          {navItem(<FileText size={20}/>, "Assignments", "/teacher-assignments")}
          {navItem(<Award size={20}/>, "Quizzes", "/teacher-quizzes")}
          {navItem(<Users size={20}/>, "Students", "/student-management")}
          {navItem(<Calendar size={20}/>, "Attendance", "/teacher-attendance")}
          {navItem(<Settings size={20}/>, "Settings", "/teacher-settings")}
          <div onClick={toggleTheme} className="flex items-center gap-3 p-3 rounded-xl transition cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300 mt-auto">
            {theme === "dark" ? <Sun size={20} className="text-yellow-400"/> : <Moon size={20} className="text-blue-500"/>}
            <p>{theme === "dark" ? "Light Mode" : "Dark Mode"}</p>
          </div>
        </div>
        <button onClick={() => { localStorage.clear(); navigate("/login"); }} className="mt-4 w-full bg-red-500 hover:bg-red-600 transition-all duration-300 py-3 rounded-2xl flex items-center justify-center gap-2 text-white">
          <LogOut size={18}/> Logout
        </button>
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-5xl font-light">Upload Notes</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg">Upload PDFs and study material for your students.</p>

        <div className="mt-10 bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-sm dark:shadow-none space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block mb-2 text-sm text-gray-500 dark:text-gray-400">Notes Title (Optional)</label>
              <input
                type="text"
                placeholder="Enter title (defaults to filename)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3.5 outline-none focus:border-blue-500 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm text-gray-500 dark:text-gray-400">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3.5 outline-none focus:border-blue-500 text-gray-900 dark:text-white"
              >
                <option value="" disabled className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">-- Select Subject --</option>
                <option value="Mathematics" className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">Mathematics</option>
                <option value="Science" className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">Science</option>
                <option value="English" className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">English</option>
                <option value="Social Science" className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">Social Science</option>
                <option value="Hindi" className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">Hindi</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm text-gray-500 dark:text-gray-400">Target Class</label>
              <select
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3.5 outline-none focus:border-blue-500 text-gray-900 dark:text-white"
              >
                <option value="" disabled className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">-- Select Class --</option>
                <option value="9th" className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">9th Grade</option>
                <option value="10th" className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">10th Grade</option>
                <option value="11th" className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">11th Grade</option>
                <option value="12th" className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">12th Grade</option>
              </select>
            </div>
          </div>

          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-white/20 rounded-2xl p-12 cursor-pointer hover:border-blue-400 transition">
            <Upload size={40} className="text-blue-400 mb-4"/>
            <p className="text-gray-500 dark:text-gray-400">Click to select files or drag and drop</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">PDF, DOC, DOCX, PPT, PPTX</p>
            <input type="file" multiple accept=".pdf,.doc,.docx,.ppt,.pptx" onChange={handleFileChange} className="hidden"/>
          </label>

          {selectedFiles.length > 0 && (
            <div className="mt-6 space-y-3">
              {selectedFiles.map((f, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3">
                  <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{f.name}</span>
                  <button onClick={() => removeFile(i)} className="text-gray-400 hover:text-red-400 transition ml-4"><X size={16}/></button>
                </div>
              ))}
              <button onClick={handleUpload} disabled={uploading} className="mt-4 w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 transition py-3 rounded-2xl text-white font-medium">
                {uploading ? "Uploading..." : `Upload ${selectedFiles.length} File(s)`}
              </button>
            </div>
          )}
        </div>

        <div className="mt-12">
          <h2 className="text-3xl font-light mb-6">Uploaded Notes</h2>
          {loadingNotes ? (
            <p className="text-gray-500 dark:text-gray-400">Loading notes...</p>
          ) : notes.length === 0 ? (
            <div className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-12 text-center shadow-sm dark:shadow-none">
              <BookOpen size={60} className="mx-auto text-gray-400"/>
              <h3 className="text-2xl mt-5 text-gray-500 dark:text-gray-400">No notes uploaded yet</h3>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note) => (
                <div key={note._id} className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-sm dark:shadow-none">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center"><Upload size={20} className="text-blue-400"/></div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white truncate max-w-[160px]">{note.filename || note.file_name || "Untitled"}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{note.uploaded_at ? new Date(note.uploaded_at).toLocaleDateString() : "Recently"}</p>
                      </div>
                    </div>
                    <button onClick={() => handleDelete(note._id)} className="text-gray-400 hover:text-red-400 transition"><Trash2 size={16}/></button>
                  </div>
                  {note.file_url && (
                    <a href={note.file_url} target="_blank" rel="noreferrer" className="mt-4 flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition">
                      <BookOpen size={14}/> View File
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UploadNotesPage;
