import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  FileText,
  Trash2,
  LayoutDashboard,
  Users,
  LogOut
} from "lucide-react";

function UploadNotesPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [notes, setNotes] = useState([]);

  // Load Notes from Backend
  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/get-teacher-notes", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok && data.notes) {
        setNotes(data.notes);
      }
    } catch (error) {
      console.error("Error loading notes:", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // File Select
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Upload Notes
  const handleUpload = async () => {
    if (!title || !subject || !studentClass || !selectedFile) {
      alert("Please fill all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subject", subject);
      formData.append("student_class", studentClass);
      formData.append("file", selectedFile);

      const response = await fetch("http://127.0.0.1:8000/upload-note", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        alert("Notes Uploaded Successfully 🚀");
        setTitle("");
        setSubject("");
        setStudentClass("");
        setSelectedFile(null);
        fetchNotes();
      } else {
        alert(data.message || "Failed to upload note");
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed. Make sure backend is running.");
    }
  };

  // Delete Note
  const handleDelete = async (filename) => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://127.0.0.1:8000/delete-note/${filename}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        alert("Note deleted successfully");
        fetchNotes();
      } else {
        alert(data.message || "Failed to delete note");
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
            className="flex items-center gap-3 bg-white/5 p-3 rounded-xl text-white cursor-pointer hover:bg-white/10 transition"
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
            onClick={() => navigate("/student-management")}
            className="flex items-center gap-3 hover:bg-white/5 p-3 rounded-xl transition cursor-pointer"
          >
            <Users size={20} />
            <p>Students</p>
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

        <h1 className="text-5xl font-light">
          Upload Notes
        </h1>

        <p className="text-gray-400 mt-3 text-lg">
          Upload study material for students.
        </p>

      </div>

      {/* Upload Form */}
      <div className="mt-10 bg-white/[0.04] border border-white/10 rounded-3xl p-8">

        {/* Title */}
        <div>

          <p className="mb-3 text-gray-400">
            Notes Title
          </p>

          <input
            type="text"
            placeholder="Trigonometry Notes"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
          />

        </div>

        {/* Subject */}
        <div className="mt-6">

          <p className="mb-3 text-gray-400">
            Subject
          </p>

          <input
            type="text"
            placeholder="Mathematics"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
          />

        </div>

        {/* Target Class */}
        <div className="mt-6">

          <p className="mb-3 text-gray-400">
            Target Class
          </p>

          <input
            type="text"
            placeholder="9th"
            value={studentClass}
            onChange={(e) => setStudentClass(e.target.value)}
            className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
          />

        </div>

        {/* Upload */}
        <div className="mt-6 border-2 border-dashed border-white/10 rounded-3xl p-10 text-center bg-white/[0.02]">

          <Upload
            size={55}
            className="mx-auto text-blue-400"
          />

          <h2 className="text-2xl mt-5">
            Upload Study Material
          </h2>

          <p className="text-gray-400 mt-3">
            PDF, DOCX, PPT supported
          </p>

          <label className="inline-block mt-6 bg-blue-500 hover:bg-blue-600 transition px-6 py-3 rounded-2xl cursor-pointer">

            Select File

            <input
              type="file"
              hidden
              onChange={handleFileChange}
            />

          </label>

          {/* Selected File */}
          {selectedFile && (

            <div className="mt-6 bg-white/10 px-5 py-3 rounded-2xl inline-flex items-center gap-3">

              <FileText size={20} />

              {selectedFile.name}

            </div>

          )}

        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          className="mt-8 w-full bg-blue-500 hover:bg-blue-600 transition py-4 rounded-2xl text-lg"
        >
          Upload Notes
        </button>

      </div>

      {/* Uploaded Notes */}
      <div className="mt-14">

        <h2 className="text-3xl font-light">
          Uploaded Notes
        </h2>

        <div className="mt-8 space-y-6">

          {notes.length === 0 && (

            <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-10 text-center">

              <FileText
                size={60}
                className="mx-auto text-gray-500"
              />

              <h3 className="text-2xl mt-5">
                No Notes Uploaded
              </h3>

            </div>

          )}

          {notes.map((note) => (

            <div
              key={note.filename}
              className="bg-white/[0.04] border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >

              <div>

                <div className="flex items-center gap-3">

                  <FileText className="text-blue-400" />

                  <h3 className="text-2xl">
                    {note.title}
                  </h3>

                </div>

                <p className="text-gray-400 mt-3">
                  📘 {note.subject} (Class: {note.student_class})
                </p>

                <p className="text-gray-500 mt-3">
                  📄 {note.filename}
                </p>

              </div>

              {/* Delete */}
              <button
                onClick={() => handleDelete(note.filename)}
                className="bg-red-500 hover:bg-red-600 transition p-4 rounded-2xl"
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

export default UploadNotesPage;