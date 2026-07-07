import React, { useState, useEffect } from "react";

import {
  Upload,
  FileText,
  Trash2
} from "lucide-react";

function UploadNotesPage() {

  const [title, setTitle] = useState("");

  const [subject, setSubject] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);

  const [notes, setNotes] = useState([]);

  // Load Notes
  useEffect(() => {

    const storedNotes =
      JSON.parse(localStorage.getItem("notes")) || [];

    setNotes(storedNotes);

  }, []);

  // File Select
  const handleFileChange = (e) => {

    const file = e.target.files[0];

    if (file) {

      setSelectedFile(file);
    }
  };

  // Upload Notes
  const handleUpload = () => {

    if (!title || !subject || !selectedFile) {

      alert("Please fill all fields");

      return;
    }

    const newNote = {

      id: Date.now(),

      title,
      subject,

      fileName: selectedFile.name,

      uploadedAt: new Date().toLocaleDateString()
    };

    const updatedNotes = [
      newNote,
      ...notes
    ];

    setNotes(updatedNotes);

    localStorage.setItem(
      "notes",
      JSON.stringify(updatedNotes)
    );

    // Reset
    setTitle("");
    setSubject("");
    setSelectedFile(null);

    alert("Notes Uploaded Successfully 🚀");
  };

  // Delete
  const handleDelete = (id) => {

    const filteredNotes =
      notes.filter((item) => item.id !== id);

    setNotes(filteredNotes);

    localStorage.setItem(
      "notes",
      JSON.stringify(filteredNotes)
    );
  };

  return (

    <div className="min-h-screen bg-black text-white p-8">

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
              key={note.id}
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
                  📘 {note.subject}
                </p>

                <p className="text-gray-500 mt-3">
                  📄 {note.fileName}
                </p>

              </div>

              {/* Delete */}
              <button
                onClick={() => handleDelete(note.id)}
                className="bg-red-500 hover:bg-red-600 transition p-4 rounded-2xl"
              >

                <Trash2 size={20} />

              </button>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default UploadNotesPage;