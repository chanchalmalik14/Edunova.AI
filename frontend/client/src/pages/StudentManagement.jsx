import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, GraduationCap, Mail, School, FileText, Download, CheckCircle, Upload, LayoutDashboard, LogOut, Award, Settings, Calendar } from "lucide-react";

function StudentManagement() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [activeTab, setActiveTab] = useState("roster"); // "roster" or "submissions"

  // Fetch Students list
  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/get-students", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok && data.students) {
        setStudents(data.students);
      }
    } catch (err) {
      console.error("Error loading students:", err);
    }
  };

  // Fetch Submissions list
  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/view-submissions", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok && data.submissions) {
        setSubmissions(data.submissions);
      }
    } catch (err) {
      console.error("Error loading submissions:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchSubmissions();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <div className="w-72 bg-white/[0.03] border-r border-white/10 p-6 hidden md:block">
        <h1 className="text-3xl font-light">
          Edunova
          <span className="text-blue-400 font-semibold">.AI</span>
        </h1>
        <div className="mt-12 flex flex-col gap-5 text-gray-300">
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
            className="flex items-center gap-3 bg-white/5 p-3 rounded-xl text-white cursor-pointer hover:bg-white/10 transition"
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
          <div
            onClick={() => navigate("/teacher-settings")}
            className="flex items-center gap-3 hover:bg-white/5 p-3 rounded-xl transition cursor-pointer"
          >
            <Settings size={20} />
            <p>Settings</p>
          </div>
        </div>
        <button
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
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
          <h1 className="text-5xl font-light">Student Hub</h1>
          <p className="text-gray-400 mt-3 text-lg">Manage registered students and grade assignments.</p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-white/5 border border-white/10 p-1.5 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab("roster")}
            className={`px-6 py-3 rounded-xl transition duration-300 font-medium ${
              activeTab === "roster" ? "bg-blue-500 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            Student Roster
          </button>
          <button
            onClick={() => setActiveTab("submissions")}
            className={`px-6 py-3 rounded-xl transition duration-300 font-medium ${
              activeTab === "submissions" ? "bg-blue-500 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            Submissions ({submissions.length})
          </button>
        </div>
      </div>

      {/* ROSTER TAB */}
      {activeTab === "roster" && (
        <div className="mt-12">
          <h2 className="text-3xl font-light">Registered Students</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {students.length === 0 && (
              <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-12 text-center col-span-full">
                <Users size={60} className="mx-auto text-gray-500" />
                <h3 className="text-2xl mt-5 text-gray-400">No students registered yet</h3>
              </div>
            )}

            {students.map((student, idx) => (
              <div
                key={student.email || idx}
                className="bg-white/[0.04] border border-white/10 rounded-3xl p-6 hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center font-bold text-blue-400 text-lg">
                    {student.full_name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-medium">{student.full_name}</h3>
                    <p className="text-gray-400 text-sm flex items-center gap-1.5 mt-1">
                      <GraduationCap size={15} className="text-purple-400" />
                      Class {student.student_class}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 space-y-3 text-sm text-gray-400">
                  <p className="flex items-center gap-2">
                    <Mail size={16} className="text-gray-500" />
                    {student.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <School size={16} className="text-gray-500" />
                    {student.school_name || "N/A"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBMISSIONS TAB */}
      {activeTab === "submissions" && (
        <div className="mt-12">
          <h2 className="text-3xl font-light">Student Assignment Submissions</h2>

          <div className="mt-8 space-y-6">
            {submissions.length === 0 && (
              <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-12 text-center">
                <FileText size={60} className="mx-auto text-gray-500" />
                <h3 className="text-2xl mt-5 text-gray-400">No assignment submissions yet</h3>
              </div>
            )}

            {submissions.map((sub, idx) => (
              <div
                key={idx}
                className="bg-white/[0.04] border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row md:items-start justify-between gap-6 hover:border-green-500/30 transition-all duration-300"
              >
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-400" size={24} />
                    <div>
                      <h3 className="text-xl font-medium">{sub.assignment_title}</h3>
                      <p className="text-gray-400 text-sm mt-0.5">Submitted by: {sub.student_email}</p>
                    </div>
                  </div>

                  {sub.text_answer && (
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-gray-300">
                      <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wider">Answer Text:</p>
                      <p className="whitespace-pre-wrap">{sub.text_answer}</p>
                    </div>
                  )}

                  {sub.filename && (
                    <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-3 rounded-xl w-fit">
                      <FileText size={18} className="text-blue-400" />
                      <span className="text-sm text-gray-300">{sub.filename}</span>
                    </div>
                  )}
                </div>

                {/* Download Attachment Button */}
                {sub.filename && (
                  <a
                    href={`http://127.0.0.1:8000/download-submission/${sub.filename}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-blue-500 hover:bg-blue-600 transition-all duration-300 px-6 py-4 rounded-2xl flex items-center gap-2 h-fit w-fit text-sm font-semibold"
                  >
                    <Download size={18} />
                    Download Attachment
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default StudentManagement;