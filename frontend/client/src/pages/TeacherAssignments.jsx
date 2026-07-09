import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Plus, Trash2, Calendar, BookOpen, GraduationCap, Upload, Users, LayoutDashboard, LogOut, Award, Settings } from "lucide-react";

function TeacherAssignments() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignments, setAssignments] = useState([]);

  // Fetch teacher's assignments from backend
  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/get-teacher-assignments", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok && data.assignments) {
        setAssignments(data.assignments);
      }
    } catch (err) {
      console.error("Error fetching assignments:", err);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  // Handle Create Assignment
  const handleCreate = async (e) => {
    e.preventDefault();

    if (!title || !subject || !description || !studentClass || !dueDate) {
      alert("Please fill all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/create-assignment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          subject,
          description,
          student_class: studentClass,
          due_date: dueDate
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Assignment Created Successfully 🚀");
        setTitle("");
        setSubject("");
        setDescription("");
        setStudentClass("");
        setDueDate("");
        fetchAssignments();
      } else {
        alert(data.message || "Failed to create assignment");
      }
    } catch (err) {
      console.error(err);
      alert("Server error creating assignment");
    }
  };

  // Handle Delete Assignment
  const handleDelete = async (titleToDelete) => {
    if (!confirm("Are you sure you want to delete this assignment?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://127.0.0.1:8000/delete-assignment/${titleToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        alert("Assignment deleted successfully");
        fetchAssignments();
      } else {
        alert(data.message || "Failed to delete assignment");
      }
    } catch (err) {
      console.error(err);
      alert("Delete request failed.");
    }
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
            className="flex items-center gap-3 bg-white/5 p-3 rounded-xl text-white cursor-pointer hover:bg-white/10 transition"
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
      <div>
        <h1 className="text-5xl font-light">Assignments</h1>
        <p className="text-gray-400 mt-3 text-lg">Create tasks and track assignment materials.</p>
      </div>

      {/* Creation Form */}
      <form onSubmit={handleCreate} className="mt-10 bg-white/[0.04] border border-white/10 rounded-3xl p-8 space-y-6">
        <h2 className="text-2xl font-light">Create New Assignment</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Title */}
          <div>
            <label className="block mb-2 text-gray-400">Assignment Title</label>
            <input
              type="text"
              placeholder="Algebra Homework"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block mb-2 text-gray-400">Subject</label>
            <input
              type="text"
              placeholder="Mathematics"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Target Class */}
          <div>
            <label className="block mb-2 text-gray-400">Target Class</label>
            <input
              type="text"
              placeholder="9th"
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value)}
              className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="block mb-2 text-gray-400">Due Date</label>
            <input
              type="text"
              placeholder="Tomorrow 11:59 PM"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2 text-gray-400">Description / Guidelines</label>
          <textarea
            placeholder="Solve questions 1 to 10 on page 42..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 h-28 resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 transition px-8 py-4 rounded-2xl flex items-center gap-3 font-semibold"
        >
          <Plus size={22} />
          Create Assignment
        </button>
      </form>

      {/* List of Created Assignments */}
      <div className="mt-14">
        <h2 className="text-3xl font-light">All Created Tasks</h2>

        <div className="mt-8 space-y-6">
          {assignments.length === 0 && (
            <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-10 text-center">
              <FileText size={60} className="mx-auto text-gray-500" />
              <h3 className="text-2xl mt-5 text-gray-400">No assignments created yet</h3>
            </div>
          )}

          {assignments.map((assignment) => (
            <div
              key={assignment.title}
              className="bg-white/[0.04] border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div>
                <div className="flex items-center gap-3">
                  <FileText className="text-green-400" />
                  <h3 className="text-2xl">{assignment.title}</h3>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-400 mt-3 text-sm">
                  <span className="flex items-center gap-2">
                    <BookOpen size={16} className="text-blue-400" />
                    {assignment.subject}
                  </span>
                  <span className="flex items-center gap-2">
                    <GraduationCap size={16} className="text-purple-400" />
                    Class: {assignment.student_class}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar size={16} className="text-yellow-400" />
                    Due: {assignment.due_date}
                  </span>
                </div>

                <p className="text-gray-500 mt-4">{assignment.description}</p>
              </div>

              {/* Delete */}
              <button
                onClick={() => handleDelete(assignment.title)}
                className="bg-red-500 hover:bg-red-600 transition p-4 rounded-2xl h-fit w-fit"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}

export default TeacherAssignments;